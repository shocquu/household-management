import { useState } from 'react';
import { alpha } from '@mui/material/styles';
import { Box, MenuItem, Stack, IconButton, Popover } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ELanguage } from '../../../types';

export default function LanguagePopover() {
    const [open, setOpen] = useState(null);
    const [selectedLang, setSelectedLang] = useState(ELanguage.EN);
    const { t, i18n } = useTranslation();

    const languages = {
        en: {
            value: 'en',
            label: t('header.language.english'),
            icon: '/assets/icons/ic_flag_en.svg',
        },
        de: {
            value: 'de',
            label: t('header.language.german'),
            icon: '/assets/icons/ic_flag_de.svg',
        },
        pl: {
            value: 'pl',
            label: t('header.language.polish'),
            icon: '/assets/icons/ic_flag_pl.svg',
        },
    };

    const handleOpen = (event) => {
        setOpen(event.currentTarget);
    };

    const handleClose = () => {
        setOpen(null);
    };

    const changeLanguage = (langKey: ELanguage) => {
        i18n.changeLanguage(langKey);
        setSelectedLang(langKey);
        setOpen(null);
    };

    return (
        <>
            <IconButton
                onClick={handleOpen}
                sx={{
                    padding: 0,
                    width: 44,
                    height: 44,
                    ...(open && {
                        bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.focusOpacity),
                    }),
                }}>
                <img
                    src={languages[selectedLang].icon}
                    alt={languages[selectedLang].label}
                    style={{
                        borderRadius: '4px',
                        border: '1px solid lightGrey',
                    }}
                />
            </IconButton>

            <Popover
                open={Boolean(open)}
                anchorEl={open}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                PaperProps={{
                    sx: {
                        p: 1,
                        mt: 1.5,
                        ml: 0.75,
                        width: 180,
                        '& .MuiMenuItem-root': {
                            px: 1,
                            typography: 'body2',
                            borderRadius: 0.75,
                        },
                    },
                }}>
                <Stack spacing={0.75}>
                    {Object.values(languages).map((option) => (
                        <MenuItem
                            key={option.value}
                            selected={option.value === selectedLang}
                            onClick={() => changeLanguage(option.value as ELanguage)}>
                            <Box
                                component='img'
                                alt={option.label}
                                src={option.icon}
                                sx={{
                                    width: 28,
                                    mr: 2,
                                    borderRadius: '4px',
                                    border: '1px solid black',
                                    borderColor: 'action.disabled',
                                }}
                            />

                            {option.label}
                        </MenuItem>
                    ))}
                </Stack>
            </Popover>
        </>
    );
}
