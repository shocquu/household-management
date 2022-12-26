import { format, getTime, formatDistanceToNow } from 'date-fns';

export function fDate(date: string | number, newFormat?: string) {
    const fm = newFormat || 'dd MMM yyyy';

    return date ? format(new Date(+date), fm) : '';
}

export function fDateTime(date: string | number, newFormat?: string) {
    const fm = newFormat || 'dd MMM yyyy p';

    return date ? format(new Date(+date), fm) : '';
}

export function fTimestamp(date: string | number) {
    return date ? getTime(new Date(+date)) : '';
}

export function fToNow(date: string | number) {
    return date
        ? formatDistanceToNow(new Date(+date), {
              addSuffix: true,
          })
        : '';
}
