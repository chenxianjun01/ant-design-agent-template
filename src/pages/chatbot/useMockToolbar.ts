import { useMemo } from 'react';

import {
  CHAT_PROVIDER_MODE,
  MOCK_CHART_TYPE_LABELS,
  MOCK_CHART_TYPES,
  MOCK_MESSAGE_TYPE_LABELS,
  MOCK_MESSAGE_TYPES,
  type MockChartType,
  type MockMessageType,
} from './service';

interface UseMockToolbarOptions {
  mockChartType: MockChartType;
  mockType: MockMessageType;
}

export const useMockToolbar = ({
  mockChartType,
  mockType,
}: UseMockToolbarOptions) => {
  const showMockToolbar = CHAT_PROVIDER_MODE !== 'remote';

  const currentMockTypeLabel =
    mockType === 'chart'
      ? `${MOCK_MESSAGE_TYPE_LABELS[mockType]} · ${MOCK_CHART_TYPE_LABELS[mockChartType]}`
      : MOCK_MESSAGE_TYPE_LABELS[mockType];

  const mockMessageTypeOptions = useMemo(
    () =>
      MOCK_MESSAGE_TYPES.map((type) => ({
        label: MOCK_MESSAGE_TYPE_LABELS[type],
        value: type,
      })),
    [],
  );

  const mockChartTypeOptions = useMemo(
    () =>
      MOCK_CHART_TYPES.map((type) => ({
        label: MOCK_CHART_TYPE_LABELS[type],
        value: type,
      })),
    [],
  );

  return {
    currentMockTypeLabel,
    mockChartTypeOptions,
    mockMessageTypeOptions,
    showMockToolbar,
  };
};
