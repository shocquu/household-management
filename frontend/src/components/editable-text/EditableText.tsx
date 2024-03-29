import { ElementType, useState } from 'react';
import { Button, Stack, styled, TextField, Typography, TypographyProps } from '@mui/material';
import ModeEditIcon from '@mui/icons-material/ModeEdit';

interface EditableText extends TypographyProps {
    text?: string;
    name?: string;
    minRows?: number;
    maxRows?: number;
    fullWidth?: boolean;
    showButtons?: boolean;
    component?: ElementType;
    onBlur?: (event: any) => void;
    onChange?: (event: any) => void;
    onClick?: (event: any) => void;
}

const EditableText = ({
    text,
    name,
    minRows,
    maxRows,
    fullWidth,
    showButtons,
    variant,
    component,
    sx,
    onClick,
    onChange,
    onBlur,
    ...restProps
}: EditableText) => {
    const [isFocused, setIsFocused] = useState(false);
    const [value, setValue] = useState(text);

    const handleCancel = () => {
        setValue(text);
        setIsFocused(false);
    };

    return !isFocused ? (
        <Stack
            direction='row'
            alignItems='center'
            spacing={1}
            sx={{
                cursor: 'pointer',
                position: 'relative',
                zIndex: 10,
                '&:hover': {
                    svg: {
                        opacity: 1,
                    },
                },
            }}
            onClick={(event) => {
                onClick?.(event);
                setIsFocused(true);
            }}>
            <Typography {...restProps} fullWidth={fullWidth} variant={variant} component={component}>
                {value}
            </Typography>
            <ModeEditIcon fontSize='small' sx={{ opacity: 0 }} />
        </Stack>
    ) : (
        <>
            <TextField
                autoFocus
                fullWidth
                multiline
                size='small'
                name={name}
                value={value}
                minRows={minRows}
                maxRows={maxRows}
                onChange={(event) => {
                    onChange?.(event);
                    setValue(event.target.value);
                }}
                onBlur={(event) => {
                    onBlur?.(event);
                    setIsFocused(false);
                }}
            />
            {showButtons && (
                <Stack direction='row' spacing={1} mt={1}>
                    <Button variant='contained' size='small'>
                        Save
                    </Button>
                    <Button size='small' onClick={handleCancel} onMouseDown={(e) => e.preventDefault()}>
                        Cancel
                    </Button>
                </Stack>
            )}
        </>
    );
};

const Wrapper = styled('div')(() => ({
    position: 'relative',
}));

export default EditableText;
