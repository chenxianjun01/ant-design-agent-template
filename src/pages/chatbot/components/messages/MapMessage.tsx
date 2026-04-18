import { Alert, Button, Empty, Space, Typography } from 'antd';
import React, { memo, useEffect, useMemo, useRef, useState } from 'react';

import type { IMapMessageContent, IMapMessageMarker } from '../../data';
import type { MessageComponentProps } from './TextMessage';
import 'ol/ol.css';
import {
  MessageActionAlert,
  useMessageActionExecution,
} from './useMessageActionExecution';

const DEFAULT_MAP_HEIGHT = 280;

const MapMessage: React.FC<MessageComponentProps> = ({
  message,
  onFormSubmit,
}) => {
  const content = message.content as IMapMessageContent;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [mapError, setMapError] = useState<string>();
  const height = content.height ?? DEFAULT_MAP_HEIGHT;
  const { submitError, executeAction } = useMessageActionExecution({
    message,
    onFormSubmit,
  });

  const markerSummary = useMemo(
    () => (content.markers ?? []).map((marker) => marker.title).join(' / '),
    [content.markers],
  );

  useEffect(() => {
    let destroyed = false;
    let cleanup: (() => void) | undefined;

    const bootstrap = async () => {
      if (!containerRef.current) {
        return;
      }

      try {
        const [
          { default: OLMap },
          { default: View },
          { default: TileLayer },
          { default: VectorLayer },
          { default: OSM },
          { default: VectorSource },
          { Feature },
          { Point },
          { fromLonLat },
          { Circle: CircleStyle, Fill, Stroke, Style },
        ] = await Promise.all([
          import('ol/Map'),
          import('ol/View'),
          import('ol/layer/Tile'),
          import('ol/layer/Vector'),
          import('ol/source/OSM'),
          import('ol/source/Vector'),
          import('ol'),
          import('ol/geom'),
          import('ol/proj'),
          import('ol/style'),
        ]);

        if (destroyed || !containerRef.current) {
          return;
        }

        const features = (content.markers ?? []).map((marker) => {
          const feature = new Feature({
            geometry: new Point(
              fromLonLat([marker.longitude, marker.latitude]),
            ),
            name: marker.title,
            marker,
          });

          feature.setStyle(
            new Style({
              image: new CircleStyle({
                radius: 6,
                fill: new Fill({ color: '#1677ff' }),
                stroke: new Stroke({ color: '#ffffff', width: 2 }),
              }),
            }),
          );

          return feature;
        });

        const map = new OLMap({
          target: containerRef.current,
          layers: [
            new TileLayer({
              source: new OSM(),
            }),
            new VectorLayer({
              source: new VectorSource({
                features,
              }),
            }),
          ],
          view: new View({
            center: fromLonLat(content.center),
            zoom: content.zoom ?? 10,
          }),
          controls: [],
        });

        map.on('singleclick', (event) => {
          map.forEachFeatureAtPixel(event.pixel, (feature) => {
            const marker = feature.get('marker') as
              | IMapMessageMarker
              | undefined;

            if (marker?.clickAction) {
              void executeAction(
                marker.clickAction,
                marker.clickAction.key ?? `${marker.title}-click`,
                {
                  markerTitle: marker.title,
                  longitude: marker.longitude,
                  latitude: marker.latitude,
                  markerDescription: marker.description ?? '',
                  ...(marker.values ?? {}),
                },
              );
            }

            return true;
          });
        });

        cleanup = () => {
          map.setTarget(undefined);
        };
      } catch (error) {
        if (!destroyed) {
          setMapError(
            error instanceof Error ? error.message : '地图初始化失败',
          );
        }
      }
    };

    void bootstrap();

    return () => {
      destroyed = true;
      cleanup?.();
    };
  }, [content.center, content.markers, content.zoom]);

  return (
    <Space orientation="vertical" size={12} style={{ width: '100%' }}>
      <MessageActionAlert error={submitError} />
      {(content.title || content.description) && (
        <div>
          {content.title && (
            <Typography.Title level={5} style={{ marginBottom: 4 }}>
              {content.title}
            </Typography.Title>
          )}
          {content.description && (
            <Typography.Paragraph type="secondary" style={{ marginBottom: 0 }}>
              {content.description}
            </Typography.Paragraph>
          )}
        </div>
      )}

      {mapError ? (
        <Alert
          type="warning"
          showIcon
          message="地图初始化失败"
          description={mapError}
        />
      ) : (
        <div
          ref={containerRef}
          style={{
            width: '100%',
            height,
            borderRadius: 12,
            overflow: 'hidden',
            border: '1px solid rgba(5, 5, 5, 0.08)',
          }}
        />
      )}

      {markerSummary ? (
        <Space orientation="vertical" size={4}>
          <Typography.Text type="secondary">
            标记点：{markerSummary}
          </Typography.Text>
          {(content.markers ?? []).map((marker, index) => {
            const action = marker.clickAction;
            if (!action) {
              return null;
            }

            return (
              <Button
                key={marker.key ?? `${index}-${marker.title}`}
                type="link"
                style={{ paddingInline: 0 }}
                onClick={() => {
                  void executeAction(
                    action,
                    action.key ?? `${marker.title}-click`,
                    {
                      markerTitle: marker.title,
                      longitude: marker.longitude,
                      latitude: marker.latitude,
                      markerDescription: marker.description ?? '',
                      ...(marker.values ?? {}),
                    },
                  );
                }}
              >
                {marker.title}
              </Button>
            );
          })}
        </Space>
      ) : (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="暂无地图标记点"
        />
      )}
    </Space>
  );
};

export default memo(MapMessage);
