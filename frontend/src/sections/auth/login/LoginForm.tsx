import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Link,
    Stack,
    IconButton,
    InputAdornment,
    TextField,
    Checkbox,
    Avatar,
    Unstable_Grid2 as Grid,
    FormControl,
    InputLabel,
    OutlinedInput,
    FormControlLabel,
    FormHelperText,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { gql, useMutation } from '@apollo/client';
import Iconify from '../../../components/iconify';
import useAuth from '../../../hooks/useAuth';
import { useLoginMutation } from '../../../hooks/useLoginMutation';

const LOGIN_MUTATION = gql`
    mutation Login($loginUserInput: LoginUserInput!) {
        loginUser(loginUserInput: $loginUserInput) {
            access_token
        }
    }
`;

const validationSchema = yup.object({
    email: yup.string().email('Enter a valid email').required('Email is required'),
    password: yup.string().min(5, 'Password should be of minimum 5 characters length').required('Password is required'),
});

export default function LoginForm() {
    const [showPassword, setShowPassword] = useState(false);
    // const { getUser } = useAuth();
    const [login] = useLoginMutation();
    // const [login, { data, loading, error }] = useMutation(LOGIN_MUTATION, {
    //     onCompleted: ({ loginUser }) => {
    //         localStorage.setItem('access_token', loginUser.access_token);
    //         navigate('/board/tasks', { replace: true });
    //         // getUser({
    //         //     variables: {
    //         //         access_token: loginUser.access_token,
    //         //     },
    //         // });
    //     },
    //     onError: (error) => {
    //         formik.setStatus({
    //             response: error,
    //         });
    //     },
    // });

    const navigate = useNavigate();
    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: validationSchema,
        onSubmit: ({ email, password }) => {
            login(email, password);
        },
    });

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
                <TextField
                    id='password'
                    name='password'
                    label='Password'
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
                {/* {error && <FormHelperText error>{error.message}</FormHelperText>} */}
            </Stack>

            <Stack direction='row' alignItems='center' justifyContent='space-between' sx={{ my: 2 }}>
                <FormControlLabel control={<Checkbox name='remember' />} label='Remember me' />
                <Link variant='subtitle2' underline='hover'>
                    Forgot password?
                </Link>
            </Stack>

            <LoadingButton
                fullWidth
                // loading={loading}
                size='large'
                type='submit'
                variant='contained'
                disabled={!!Object.keys(formik.errors).length}>
                Login
            </LoadingButton>
        </form>
    );
}
