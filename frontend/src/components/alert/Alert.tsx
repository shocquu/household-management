import { useContext, useEffect, useState } from 'react';
import { Alert as MuiAlert, AlertColor, Paper, Snackbar } from '@mui/material';
import { AlertContext } from '../../hooks/useAlert';
import { AlertStatus } from '../../types';

const Alert = () => {
    const alert = useContext(AlertContext);
    const [open, setOpen] = useState(alert.status !== AlertStatus.None);

    const handleClose = () => {
        setOpen(false);
        alert.clear();
    };

    useEffect(() => {
        setOpen(alert.status !== AlertStatus.None);
    }, [alert.status]);

    return (
        <Snackbar
            open={open}
            autoHideDuration={5000}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            onClose={handleClose}>
            <Paper elevation={5}>
                <MuiAlert
                    variant='standard'
                    severity={alert.status !== AlertStatus.None ? (alert.status as AlertColor) : undefined}
                    onClose={handleClose}>
                    {alert.message}
                </MuiAlert>
            </Paper>
        </Snackbar>
    );
};

export default Alert;
