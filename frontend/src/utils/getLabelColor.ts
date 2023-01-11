import { LabelColors } from '../types';

export const getLabelColor = (color: string): string =>
    Object.keys(LabelColors).includes(color)
        ? LabelColors[color as keyof LabelColors] // mapped color
        : color; // hex value
