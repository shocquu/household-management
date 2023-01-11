import { Dispatch, useState } from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import {
    Avatar,
    Button,
    Card,
    CardContent,
    Dialog,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    TextField,
    useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Stack } from '@mui/system';
import { FormikProps, useFormik } from 'formik';
import * as yup from 'yup';
import useAuth, { CURRENT_USER_QUERY } from '../../hooks/useAuth';
import { AVATARS_BASE_PATH } from '../../constants';
import { gql, useMutation } from '@apollo/client';
import useAlert from '../../hooks/useAlert';

type FormikValues = {
    email: string;
    username: string;
    displayName: string;
    avatarUrl: string;
};

const UPDATE_USER_MUTATION = gql`
    mutation Mutation($updateUserInput: UpdateUserInput!) {
        updateUser(updateUserInput: $updateUserInput) {
            id
        }
    }
`;

const validationSchema = yup.object({
    email: yup.string().email('Enter a valid email').required('Email is required'),
    username: yup.string().required('Username is required'),
    displayName: yup.string().required('Display name is required'),
});

const General = () => {
    const [open, setOpen] = useState(false);
    const { user } = useAuth();
    const alert = useAlert();
    const [updateUser, { loading }] = useMutation(UPDATE_USER_MUTATION, {
        refetchQueries: [{ query: CURRENT_USER_QUERY }],
        onCompleted: () => {
            alert.success('Successfuly updated');
        },
        onError: () => {
            alert.error('Failed to update');
        },
    });

    const formik = useFormik({
        initialValues: {
            email: user.email,
            username: user.username,
            displayName: user.displayName,
            avatarUrl: user.avatarUrl.substring(user.avatarUrl.lastIndexOf('/') + 1),
        },
        validationSchema,
        validateOnBlur: true,
        onSubmit: ({ email, displayName, avatarUrl, username }) => {
            if (formik.dirty)
                updateUser({
                    variables: { updateUserInput: { id: user.id, email, displayName, avatarUrl } },
                });
            formik.resetForm({ values: { email, displayName, avatarUrl, username } });
        },
    });

    return (
        <>
            <AvatarSelection formik={formik} setOpen={setOpen} open={open} />
            <form onSubmit={formik.handleSubmit}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={4}>
                        <Card elevation={3}>
                            <CardContent
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                <Stack spacing={1}>
                                    <IconButton
                                        disabled
                                        sx={{
                                            border: '1px dashed gray',
                                            borderColor: 'divider',
                                        }}>
                                        <Avatar
                                            src={AVATARS_BASE_PATH + formik.values.avatarUrl}
                                            alt={user.displayName}
                                            sx={{
                                                height: 140,
                                                width: 140,
                                            }}
                                        />
                                    </IconButton>
                                    <Button color='secondary' onClick={() => setOpen(true)}>
                                        Change avatar
                                    </Button>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                        <Card elevation={3}>
                            <CardContent>
                                <Stack spacing={3}>
                                    <TextField
                                        disabled
                                        id='username'
                                        name='username'
                                        label='Username'
                                        value={formik.values.username}
                                    />
                                    <TextField
                                        id='displayName'
                                        name='displayName'
                                        label='Display name'
                                        value={formik.values.displayName}
                                        onChange={formik.handleChange}
                                        error={Boolean(formik.errors.displayName)}
                                        helperText={
                                            formik.errors.displayName && (
                                                <span>{String(formik.errors.displayName)}</span>
                                            )
                                        }
                                    />
                                    <TextField
                                        id='email'
                                        name='email'
                                        label='Email address'
                                        value={formik.values.email}
                                        onChange={formik.handleChange}
                                        error={Boolean(formik.errors.email)}
                                        helperText={formik.errors.email && <span>{String(formik.errors.email)}</span>}
                                    />
                                    <LoadingButton
                                        variant='contained'
                                        type='submit'
                                        loading={loading}
                                        disabled={!formik.dirty}
                                        sx={{ alignSelf: 'end' }}>
                                        Save changes
                                    </LoadingButton>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </form>
        </>
    );
};

const AvatarSelection = ({
    formik,
    open,
    setOpen,
}: {
    formik: FormikProps<FormikValues>;
    open: boolean;
    setOpen: Dispatch<React.SetStateAction<boolean>>;
}) => {
    const handleClose = () => setOpen(false);
    const theme = useTheme();

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>
                Select avatar
                <IconButton
                    sx={{ position: 'absolute', right: theme.spacing(1), top: theme.spacing(1) }}
                    onClick={handleClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <Grid container columns={5} justifyContent='space-between'>
                    {Array.from(Array(25)).map((_, index) => (
                        <Grid key={index} item>
                            <IconButton
                                sx={() =>
                                    formik.values.avatarUrl === `avatar_${index + 1}.jpg` && {
                                        bgcolor: 'primary.light',

                                        padding: 1,
                                    }
                                }
                                onClick={() => {
                                    formik.setFieldValue('avatarUrl', `avatar_${index + 1}.jpg`);
                                    handleClose();
                                }}>
                                <Avatar
                                    src={AVATARS_BASE_PATH + `avatar_${index + 1}.jpg`}
                                    alt={`Avatar ${index + 1}`}
                                    sx={{
                                        width: 64,
                                        height: 64,
                                        boxSizeing: 'border-box',
                                        color: 'background.paper',
                                        outline: '4px solid currentColor',
                                    }}
                                />
                            </IconButton>
                        </Grid>
                    ))}
                </Grid>
            </DialogContent>
        </Dialog>
    );
};

export default General;
