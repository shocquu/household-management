import { forwardRef } from 'react';
import { Radio, RadioGroup } from '@mui/material';
import Icon from './Icon';

interface ColorSinglePicker {
    colors: string[];
}

const ColorSinglePicker = forwardRef(({ colors, ...other }: ColorSinglePicker, ref) => (
    <RadioGroup row ref={ref} {...other}>
        {colors.map((color) => {
            const whiteColor = color === '#FFFFFF' || color === 'white';

            return (
                <Radio
                    key={color}
                    value={color}
                    color='default'
                    icon={<Icon whiteColor={whiteColor} />}
                    checkedIcon={<Icon checked whiteColor={whiteColor} />}
                    sx={{
                        color,
                        '&:hover': { opacity: 0.72 },
                        '& svg': { width: 12, height: 12 },
                    }}
                />
            );
        })}
    </RadioGroup>
));

export default ColorSinglePicker;
