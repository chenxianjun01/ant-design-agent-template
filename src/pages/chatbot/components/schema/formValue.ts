import dayjs from 'dayjs';

export const normalizeInitialValues = (
  initialValues?: Record<string, unknown>,
) => {
  if (!initialValues) {
    return undefined;
  }

  return Object.fromEntries(
    Object.entries(initialValues).map(([key, value]) => {
      if (
        typeof value === 'string' &&
        /^\d{4}-\d{2}-\d{2}( \d{2}:\d{2}:\d{2})?$/.test(value)
      ) {
        const parsed = dayjs(value);
        if (parsed.isValid()) {
          return [key, parsed];
        }
      }

      return [key, value];
    }),
  );
};

export const serializeFormValues = (values: Record<string, unknown>) =>
  Object.fromEntries(
    Object.entries(values).map(([key, value]) => {
      if (dayjs.isDayjs(value)) {
        return [key, value.format('YYYY-MM-DD')];
      }

      if (Array.isArray(value)) {
        return [
          key,
          value.map((item) =>
            dayjs.isDayjs(item) ? item.format('YYYY-MM-DD') : item,
          ),
        ];
      }

      return [key, value];
    }),
  );
