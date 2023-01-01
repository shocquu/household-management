import { ReactNode } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

interface ConfirmDialog {
    open: boolean;
    title: string;
    content: ReactNode;
    onClose: (ok?: boolean) => void;
}

const ConfirmDialog = ({ open, title, content, onClose, ...rest }: ConfirmDialog) => {
    const handleCancel = () => {
        onClose();
    };

    const handleOk = () => {
        onClose(true);
    };

    return (
        <Dialog sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }} maxWidth='xs' open={open} {...rest}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent dividers>{content}</DialogContent>
            <DialogActions>
                <Button autoFocus onClick={handleCancel}>
                    Cancel
                </Button>
                <Button onClick={handleOk} variant='contained'>
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    );
};
export default ConfirmDialog;
