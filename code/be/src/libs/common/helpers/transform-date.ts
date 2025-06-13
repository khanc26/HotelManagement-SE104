import { formatInTimeZone } from 'date-fns-tz';

export const transformDateTime = {
  to: (value: Date) => value,
  from: (value: Date | string | null) => {
    if (!value) return null;
    const date = value instanceof Date ? value : new Date(value);
    return formatInTimeZone(date, 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd HH:mm:ss');
  },
};
