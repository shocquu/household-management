import LoadingButton from '@mui/lab/LoadingButton';
import {
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
import { useRegisterMutation } from '../../../hooks/useRegisterMutation';

const AVATARS_COUNT = 24;
const AVATARS_PER_PAGE_COUNT = 8;

const validationSchema = yup.object({
    email: yup.string().email('Enter a valid email').required('Email is required'),
    password: yup.string().min(5, 'Password should be of minimum 5 characters length').required('Password is required'),
});

const RegisterForm = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [page, setPage] = useState(1);
    const [register, { loading, error }] = useRegisterMutation();

    const avatars = [-1, ...Array(AVATARS_COUNT).keys()];
    const theme = useTheme();
    const formik = useFormik({
        initialValues: {
            email: '',
            displayName: '',
            username: '',
            password: '',
            avatarKey: -1,
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            const { avatarKey, ...data } = values;
            register({ ...data, avatarUrl: mapAvatarKey(values.avatarKey) });
        },
    });

    const mapAvatarKey = (key: number) => {
        if (key === -1) return 'avatar_default.jpg';
        return `avatar_${key + 1}.jpg`;
    };

    const handlePageChange = (event: ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    return (
        <form onSubmit={formik.handleSubmit}>
            <Stack spacing={3}>
                <TextField
                    id='email'
                    name='email'
                    label='Email address'
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                />
                <Stack direction='row' spacing={2}>
                    <TextField
                        fullWidth
                        id='username'
                        name='username'
                        label='Username'
                        autoComplete='off'
                        value={formik.values.username}
                        onChange={formik.handleChange}
                    />
                    <TextField
                        fullWidth
                        id='displayName'
                        name='displayName'
                        label='Display name'
                        value={formik.values.displayName}
                        onChange={formik.handleChange}
                    />
                </Stack>

                <TextField
                    id='password'
                    name='password'
                    label='Password'
                    autoComplete='off'
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
                    {avatars
                        .slice((page - 1) * AVATARS_PER_PAGE_COUNT, page * AVATARS_PER_PAGE_COUNT)
                        .map((key, index) => (
                            <Grid key={index} item xs={3}>
                                <IconButton
                                    sx={
                                        formik.values.avatarKey === key && {
                                            bgcolor: `${theme.palette.primary.light} !important`,
                                        }
                                    }
                                    disabled={formik.values.avatarKey === key}
                                    onClick={() => formik.setFieldValue('avatarKey', key)}>
                                    <Avatar
                                        alt={`Avatar ${index + 2}`}
                                        src={`/assets/images/avatars/${mapAvatarKey(key)}`}
                                        sx={{ width: 64, height: 64 }}
                                    />
                                </IconButton>
                            </Grid>
                        ))}
                </Grid>
                <Pagination
                    count={Math.ceil((AVATARS_COUNT + 1) / AVATARS_PER_PAGE_COUNT)}
                    page={page}
                    onChange={handlePageChange}
                />
                <LoadingButton
                    fullWidth
                    // loading
                    loadingPosition='start'
                    size='large'
                    type='submit'
                    variant='contained'
                    // disabled={!!Object.keys(formik.errors).length}
                >
                    Create account
                </LoadingButton>
            </Stack>
        </form>
    );
};

export default RegisterForm;
