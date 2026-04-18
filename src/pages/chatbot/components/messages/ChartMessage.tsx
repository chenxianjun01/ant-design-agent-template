import {
  Area,
  type AreaConfig,
  Bar,
  type BarConfig,
  Column,
  type ColumnConfig,
  DualAxes,
  type DualAxesConfig,
  Line,
  type LineConfig,
  Pie,
  type PieConfig,
  Radar,
  type RadarConfig,
} from '@ant-design/plots';
import { Alert, Empty, Space, Typography } from 'antd';
import React, { memo, useMemo } from 'react';

import type { IChartMessageContent } from '../../data';
import { extractChartConfigFromSchema } from '../schema/adapter';
import SchemaSlot from '../schema/SchemaSlot';
import type { MessageComponentProps } from './TextMessage';

const DEFAULT_CHART_HEIGHT = 240;

const ChartMessage: React.FC<MessageComponentProps> = ({
  message,
  schemaFieldRender,
}) => {
  const schemaConfig = extractChartConfigFromSchema(message.schema);
  const content = {
    ...(message.content as IChartMessageContent),
    ...schemaConfig,
  } as IChartMessageContent;

  const height = content.height ?? DEFAULT_CHART_HEIGHT;

  const chartNode = useMemo(() => {
    if (!Array.isArray(content.data) || content.data.length === 0) {
      return <Empty description="暂无图表数据" />;
    }

    if (content.type === 'line') {
      if (!Array.isArray(content.data) || Array.isArray(content.data[0])) {
        return <Empty description="当前折线图数据格式不正确" />;
      }

      const config: LineConfig = {
        data: content.data,
        xField: content.xField ?? 'x',
        yField: typeof content.yField === 'string' ? content.yField : 'y',
        colorField: content.seriesField,
        height,
        autoFit: true,
        axis: {
          x: { title: false },
          y: { title: false },
        },
        legend: content.seriesField
          ? {
              color: {
                layout: { justifyContent: 'center' },
              },
            }
          : undefined,
        ...content.config,
      };

      return <Line {...config} />;
    }

    if (content.type === 'area') {
      if (!Array.isArray(content.data) || Array.isArray(content.data[0])) {
        return <Empty description="当前面积图数据格式不正确" />;
      }

      const config: AreaConfig = {
        data: content.data,
        xField: content.xField ?? 'x',
        yField: typeof content.yField === 'string' ? content.yField : 'y',
        colorField: content.seriesField ?? content.colorField,
        height,
        autoFit: true,
        axis: {
          x: { title: false },
          y: { title: false },
        },
        ...content.config,
      };

      return <Area {...config} />;
    }

    if (content.type === 'column') {
      if (!Array.isArray(content.data) || Array.isArray(content.data[0])) {
        return <Empty description="当前柱状图数据格式不正确" />;
      }

      const config: ColumnConfig = {
        data: content.data,
        xField: content.xField ?? 'x',
        yField: typeof content.yField === 'string' ? content.yField : 'y',
        colorField: content.seriesField,
        height,
        autoFit: true,
        axis: {
          x: { title: false },
          y: { title: false },
        },
        ...content.config,
      };

      return <Column {...config} />;
    }

    if (content.type === 'bar') {
      if (!Array.isArray(content.data) || Array.isArray(content.data[0])) {
        return <Empty description="当前条形图数据格式不正确" />;
      }

      const config: BarConfig = {
        data: content.data,
        xField: typeof content.xField === 'string' ? content.xField : 'value',
        yField:
          typeof content.yField === 'string' ? content.yField : 'category',
        colorField: content.colorField ?? content.seriesField,
        height,
        autoFit: true,
        axis: {
          x: { title: false },
          y: { title: false },
        },
        ...content.config,
      };

      return <Bar {...config} />;
    }

    if (content.type === 'pie') {
      if (!Array.isArray(content.data) || Array.isArray(content.data[0])) {
        return <Empty description="当前饼图数据格式不正确" />;
      }

      const config: PieConfig = {
        data: content.data,
        angleField:
          content.angleField ??
          (typeof content.yField === 'string' ? content.yField : 'value'),
        colorField: content.colorField ?? content.xField ?? 'type',
        height,
        autoFit: true,
        radius: 0.82,
        innerRadius: 0.52,
        legend: {
          color: {
            layout: { justifyContent: 'center' },
          },
        },
        label: {
          text: (datum: Record<string, unknown>) =>
            String(datum[content.colorField ?? content.xField ?? 'type'] ?? ''),
        },
        ...content.config,
      };

      return <Pie {...config} />;
    }

    if (content.type === 'radar') {
      if (!Array.isArray(content.data) || Array.isArray(content.data[0])) {
        return <Empty description="当前雷达图数据格式不正确" />;
      }

      const config: RadarConfig = {
        data: content.data,
        xField: content.xField ?? 'name',
        yField: typeof content.yField === 'string' ? content.yField : 'value',
        colorField: content.colorField ?? content.seriesField,
        height,
        autoFit: true,
        ...content.config,
      };

      return <Radar {...config} />;
    }

    if (content.type === 'dualAxes') {
      if (
        !Array.isArray(content.data) ||
        !Array.isArray(content.data[0]) ||
        !Array.isArray(content.data[1])
      ) {
        return <Empty description="当前双轴图数据格式不正确" />;
      }

      const config: DualAxesConfig = {
        data: content.data,
        xField: content.xField ?? 'x',
        yField:
          Array.isArray(content.yField) && content.yField.length === 2
            ? content.yField
            : ['value', 'value2'],
        height,
        autoFit: true,
        legend: {
          color: {
            layout: { justifyContent: 'center' },
          },
        },
        ...content.config,
      };

      return <DualAxes {...config} />;
    }

    return (
      <Alert
        type="warning"
        showIcon
        message="暂不支持该图表类型"
        description={`当前图表类型为 "${content.type}"，请扩展 ChartMessage 的图表映射。`}
      />
    );
  }, [content, height]);

  return (
    <Space direction="vertical" size={12} style={{ width: '100%' }}>
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

      <SchemaSlot
        message={message}
        schema={message.schema}
        schemaFieldRender={schemaFieldRender}
      />

      <div style={{ width: '100%', minHeight: height }}>{chartNode}</div>
    </Space>
  );
};

export default memo(ChartMessage);
