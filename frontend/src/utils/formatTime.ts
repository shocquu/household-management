import { format, getTime, formatDistanceToNow, intervalToDuration, formatDuration } from 'date-fns';

type FormatOptions = 'years' | 'months' | 'weeks' | 'days' | 'hours' | 'minutes' | 'seconds';

export function fDate(date: Date | string | number, newFormat?: string) {
    const fm = newFormat || 'dd MMM yyyy';

    return date ? format(new Date(+date), fm) : '';
}

export function fDateTime(date: Date | string | number, newFormat?: string) {
    const fm = newFormat || 'dd MMM yyyy p';

    return date ? format(new Date(+date), fm) : '';
}

export function fTimestamp(date: Date | string | number) {
    return date ? getTime(new Date(+date)) : '';
}

export function fToNow(date: Date | string | number) {
    return date
        ? formatDistanceToNow(new Date(+date), {
              addSuffix: true,
          })
        : '';
}

export function fCountdown(date: string | number, format?: FormatOptions[]) {
    const duration = intervalToDuration({
        start: new Date(),
        end: new Date(+date),
    });

    return formatDuration(duration, {
        delimiter: ', ',
        format,
    });
}
