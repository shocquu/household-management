import { Dispatch, MouseEvent, SetStateAction, useState } from 'react';
import { styled, alpha } from '@mui/material/styles';
import { Toolbar, Tooltip, IconButton, Typography, OutlinedInput, InputAdornment } from '@mui/material';
import Iconify from '../../../components/iconify';

interface TagsListToolbarProps {
    numSelected: number;
    filterName: string;
    setFilterName: Dispatch<SetStateAction<string>>;
    onFilterName: (event: any) => void;
}

const TagsListToolbar = ({ numSelected, filterName, setFilterName, onFilterName }: TagsListToolbarProps) => {
    const [focused, setFocused] = useState(false);

    const clearInput = (_event: MouseEvent<HTMLButtonElement>) => setFilterName('');

    return (
        <StyledRoot
            sx={{
                ...(numSelected > 0 && {
                    color: 'secondary.dark',
                    bgcolor: 'secondary.lighter',
                }),
            }}>
            {numSelected > 0 ? (
                <Typography component='div' variant='subtitle1'>
                    {numSelected} selected
                </Typography>
            ) : (
                <StyledSearch
                    value={filterName}
                    onChange={onFilterName}
                    placeholder={'Search label...'}
                    inputProps={{ onFocus: () => setFocused(true), onBlur: () => setFocused(false) }}
                    startAdornment={
                        <InputAdornment position='start'>
                            <Iconify icon='eva:search-fill' sx={{ color: 'text.disabled', width: 20, height: 20 }} />
                        </InputAdornment>
                    }
                    endAdornment={
                        filterName.length > 0 &&
                        !focused && (
                            <Tooltip
                                title={'Clear search'}
                                PopperProps={{
                                    placement: 'right',
                                }}>
                                <IconButton size='small' onClick={clearInput}>
                                    <Iconify icon='eva:close-circle-outline' sx={{ color: 'text.disabled' }} />
                                </IconButton>
                            </Tooltip>
                        )
                    }
                />
            )}

            {numSelected > 0 && (
                <Tooltip title='Delete'>
                    <IconButton>
                        <Iconify icon='eva:trash-2-fill' />
                    </IconButton>
                </Tooltip>
            )}
        </StyledRoot>
    );
};

const StyledRoot = styled(Toolbar)(({ theme }) => ({
    height: 96,
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing(0, 1, 0, 3),
}));

const StyledSearch = styled(OutlinedInput)(({ theme }) => ({
    width: 240,
    transition: theme.transitions.create(['box-shadow', 'width'], {
        easing: theme.transitions.easing.easeInOut,
        duration: theme.transitions.duration.shorter,
    }),
    '&.Mui-focused': {
        width: 320,
        boxShadow: theme.customShadows.z8,
    },
    '& fieldset': {
        borderWidth: `1px !important`,
        borderColor: `${alpha(theme.palette.grey[500], 0.32)} !important`,
    },
}));

export default TagsListToolbar;
