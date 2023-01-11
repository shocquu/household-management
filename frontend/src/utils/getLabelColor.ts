import { LabelColors } from '../types';

export const getLabelColor = (color: string): string =>
    Object.keys(LabelColors).includes(color)
        ? LabelColors[color as keyof LabelColors] // mapped color
        : color.match(/^#[a-zA-Z0-9]{3,6}$/)
        ? color // hex value
        : '#919EAB';
