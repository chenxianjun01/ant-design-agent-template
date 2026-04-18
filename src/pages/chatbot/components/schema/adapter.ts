import type {
  IChartMessageContent,
  IMessageTableColumn,
  MessageSchema,
} from '../../data';

export interface SchemaProperty {
  type?: string;
  title?: string;
  enum?: Array<string | number>;
  default?: unknown;
  required?: boolean;
  description?: string;
  'x-component'?: string;
  'x-component-props'?: Record<string, unknown>;
}

export const isObjectRecord = (
  value: unknown,
): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

export const getSchemaComponentProps = (
  schema?: MessageSchema,
): Record<string, unknown> | undefined => {
  if (!schema) {
    return undefined;
  }

  const componentProps = schema['x-component-props'];
  return isObjectRecord(componentProps) ? componentProps : undefined;
};

export const extractTableColumnsFromSchema = (
  schema?: MessageSchema,
): IMessageTableColumn[] | undefined => {
  const schemaComponentProps = getSchemaComponentProps(schema);
  const columns = schemaComponentProps?.columns;

  if (!Array.isArray(columns)) {
    return undefined;
  }

  return columns.filter(isObjectRecord).map((column) => ({
    key:
      typeof column.key === 'string'
        ? column.key
        : typeof column.dataIndex === 'string'
          ? column.dataIndex
          : undefined,
    title:
      typeof column.title === 'string'
        ? column.title
        : typeof column.dataIndex === 'string'
          ? column.dataIndex
          : '未命名列',
    dataIndex: String(column.dataIndex ?? column.key ?? ''),
    width:
      typeof column.width === 'number' || typeof column.width === 'string'
        ? column.width
        : undefined,
    ellipsis:
      typeof column.ellipsis === 'boolean' ? column.ellipsis : undefined,
    align:
      column.align === 'left' ||
      column.align === 'center' ||
      column.align === 'right'
        ? column.align
        : undefined,
    valueType:
      column.valueType === 'text' ||
      column.valueType === 'digit' ||
      column.valueType === 'percent' ||
      column.valueType === 'dateTime' ||
      column.valueType === 'tag'
        ? column.valueType
        : undefined,
  }));
};

export const extractChartConfigFromSchema = (
  schema?: MessageSchema,
): Partial<IChartMessageContent> | undefined => {
  const schemaComponentProps = getSchemaComponentProps(schema);
  if (!schemaComponentProps) {
    return undefined;
  }

  const extracted: Partial<IChartMessageContent> = {};

  if (
    schemaComponentProps.type === 'line' ||
    schemaComponentProps.type === 'column' ||
    schemaComponentProps.type === 'pie' ||
    schemaComponentProps.type === 'area' ||
    schemaComponentProps.type === 'bar' ||
    schemaComponentProps.type === 'radar' ||
    schemaComponentProps.type === 'dualAxes'
  ) {
    extracted.type = schemaComponentProps.type;
  }

  if (typeof schemaComponentProps.xField === 'string') {
    extracted.xField = schemaComponentProps.xField;
  }

  if (
    typeof schemaComponentProps.yField === 'string' ||
    (Array.isArray(schemaComponentProps.yField) &&
      schemaComponentProps.yField.every(
        (item: unknown): item is string => typeof item === 'string',
      ))
  ) {
    extracted.yField = schemaComponentProps.yField;
  }

  if (typeof schemaComponentProps.angleField === 'string') {
    extracted.angleField = schemaComponentProps.angleField;
  }

  if (typeof schemaComponentProps.colorField === 'string') {
    extracted.colorField = schemaComponentProps.colorField;
  }

  if (typeof schemaComponentProps.seriesField === 'string') {
    extracted.seriesField = schemaComponentProps.seriesField;
  }

  if (typeof schemaComponentProps.height === 'number') {
    extracted.height = schemaComponentProps.height;
  }

  return Object.keys(extracted).length > 0 ? extracted : undefined;
};

export const extractFormPropertiesFromSchema = (
  schema?: MessageSchema,
): Array<{ name: string; property: SchemaProperty }> => {
  if (!isObjectRecord(schema)) {
    return [];
  }

  const schemaProperties = schema.properties;
  if (!isObjectRecord(schemaProperties)) {
    return [];
  }

  const requiredFields = Array.isArray(schema.required)
    ? schema.required.filter((item): item is string => typeof item === 'string')
    : [];

  return Object.entries(schemaProperties)
    .filter(([, property]) => isObjectRecord(property))
    .map(([name, property]) => {
      const schemaProperty = property as Record<string, unknown>;

      return {
        name,
        property: {
          ...schemaProperty,
          required:
            typeof schemaProperty.required === 'boolean'
              ? schemaProperty.required
              : requiredFields.includes(name),
        } as SchemaProperty,
      };
    });
};
