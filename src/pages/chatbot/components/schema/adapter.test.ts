import {
  extractChartConfigFromSchema,
  extractFormPropertiesFromSchema,
  extractTableColumnsFromSchema,
  getSchemaComponentProps,
} from './adapter';

describe('chatbot schema adapter', () => {
  it('extracts normalized table columns from schema component props', () => {
    const columns = extractTableColumnsFromSchema({
      'x-component-props': {
        columns: [
          {
            dataIndex: 'progress',
            title: '进度',
            valueType: 'percent',
            align: 'right',
          },
        ],
      },
    });

    expect(columns).toEqual([
      {
        key: 'progress',
        title: '进度',
        dataIndex: 'progress',
        width: undefined,
        ellipsis: undefined,
        align: 'right',
        valueType: 'percent',
      },
    ]);
  });

  it('extracts chart config from schema component props', () => {
    const config = extractChartConfigFromSchema({
      'x-component-props': {
        type: 'column',
        xField: 'date',
        yField: 'value',
        height: 320,
      },
    });

    expect(config).toEqual({
      type: 'column',
      xField: 'date',
      yField: 'value',
      height: 320,
    });
  });

  it('extracts form properties and applies required flags', () => {
    const fields = extractFormPropertiesFromSchema({
      required: ['topic'],
      properties: {
        topic: {
          type: 'string',
          title: '主题',
        },
        optionalFlag: {
          type: 'boolean',
          title: '开关',
          required: false,
        },
      },
    });

    expect(fields).toEqual([
      {
        name: 'topic',
        property: {
          type: 'string',
          title: '主题',
          required: true,
        },
      },
      {
        name: 'optionalFlag',
        property: {
          type: 'boolean',
          title: '开关',
          required: false,
        },
      },
    ]);
  });

  it('returns schema component props only for object-like values', () => {
    expect(
      getSchemaComponentProps({
        'x-component-props': {
          placeholder: 'test',
        },
      }),
    ).toEqual({ placeholder: 'test' });

    expect(
      getSchemaComponentProps({
        'x-component-props': 'invalid',
      }),
    ).toBeUndefined();
  });
});
