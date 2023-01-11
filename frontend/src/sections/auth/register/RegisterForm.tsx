import LoadingButton from '@mui/lab/LoadingButton';
import {
    alpha,
    Avatar,
    Grid,
    IconButton,
    InputAdornment,
    Pagination,
    Stack,
    TextField,
    Typography,
    useTheme,
} from '@mui/material';
import { useFormik } from 'formik';
import { ChangeEvent, useState } from 'react';
import * as yup from 'yup';
import Iconify from '../../../components/iconify';
import { AVATARS_COUNT } from '../../../constants';
import { useRegisterMutation } from '../../../hooks/useRegisterMutation';

const AVATARS_PER_PAGE_COUNT = 8;

const validationSchema = yup.object({
    email: yup.string().email('Enter a valid email').required('Email is required'),
    username: yup.string().required('Username is required'),
    displayName: yup.string().required('Display name is required'),
    password: yup.string().required('Password is required').min(5, 'Password should be of minimum 5 characters length'),
});

const RegisterForm = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [page, setPage] = useState(1);
    const [register, { loading }] = useRegisterMutation();

    const theme = useTheme();
    const formik = useFormik({
        initialValues: {
            email: '',
            displayName: '',
            username: '',
            password: '',
            avatarKey: undefined,
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            const { avatarKey, ...data } = values;
            register({
                ...data,
                avatarUrl: avatarKey
                    ? `avatar_${values.avatarKey}.jpg`
                    : `avatar_${Math.floor(Math.random() * AVATARS_COUNT) + 1}.jpg`,
            });
        },
    });

    const handlePageChange = (_event: ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    return (
        <form onSubmit={formik.handleSubmit}>
            <Stack spacing={3}>
                <TextField
                    required
                    id='email'
                    name='email'
                    label='Email address'
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    inputProps={{ autoComplete: 'off' }}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                />
                <Stack direction='row' spacing={2}>
                    <TextField
                        required
                        fullWidth
                        id='username'
                        name='username'
                        label='Username'
                        inputProps={{ autoComplete: 'off' }}
                        value={formik.values.username}
                        onChange={formik.handleChange}
                        error={formik.touched.username && Boolean(formik.errors.username)}
                        helperText={formik.touched.username && formik.errors.username}
                    />
                    <TextField
                        required
                        fullWidth
                        id='displayName'
                        name='displayName'
                        label='Display name'
                        inputProps={{ autoComplete: 'off' }}
                        value={formik.values.displayName}
                        onChange={formik.handleChange}
                        error={formik.touched.displayName && Boolean(formik.errors.displayName)}
                        helperText={formik.touched.displayName && formik.errors.displayName}
                    />
                </Stack>

                <TextField
                    required
                    id='password'
                    name='password'
                    label='Password'
                    inputProps={{ autoComplete: 'new-password' }}
                    type={showPassword ? 'text' : 'password'}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position='end'>
                                <IconButton onClick={() => setShowPassword(!showPassword)} edge='end'>
                                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                    value={formik.values.password}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    error={formik.touched.password && Boolean(formik.errors.password)}
                    helperText={formik.touched.password && formik.errors.password}
                />
                <Typography variant='subtitle1'>Select avatar</Typography>
                <Grid container spacing={3}>
                    {[...Array(AVATARS_COUNT).keys()]
                        .slice((page - 1) * AVATARS_PER_PAGE_COUNT, page * AVATARS_PER_PAGE_COUNT)
                        .map((key) => (
                            <Grid key={key} item xs={3}>
                                <IconButton
                                    sx={
                                        formik.values.avatarKey === key
                                            ? {
                                                  bgcolor: `${theme.palette.primary.light} !important`,
                                                  boxShadow: theme.customShadows.primary,
                                              }
                                            : undefined
                                    }
                                    disabled={formik.values.avatarKey === key}
                                    onClick={() => formik.setFieldValue('avatarKey', key)}>
                                    <Avatar
                                        alt={`Avatar ${key + 1}`}
                                        src={`/assets/images/avatars/avatar_${key + 1}.jpg`}
                                        sx={{ width: 64, height: 64 }}
                                    />
                                </IconButton>
                            </Grid>
                        ))}
                </Grid>
                <Pagination
                    count={Math.ceil(AVATARS_COUNT / AVATARS_PER_PAGE_COUNT)}
                    page={page}
                    onChange={handlePageChange}
                />
                <LoadingButton
                    fullWidth
                    loading={loading}
                    // loadingPosition='start'
                    size='large'
                    type='submit'
                    variant='contained'
                    disabled={!formik.dirty || (formik.dirty && !formik.isValid)}>
                    Create account
                </LoadingButton>
            </Stack>
        </form>
    );
};

export default RegisterForm;
