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
import Iconify from '../../../components/iconify';
import { useLoginMutation } from '../../../hooks/useLoginMutation';
import { useTranslation } from 'react-i18next';

const validationSchema = yup.object({
    email: yup.string().email('Enter a valid email').required('Email is required'),
    password: yup.string().min(5, 'Password should be of minimum 5 characters length').required('Password is required'),
});

export default function LoginForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [login, { loading }] = useLoginMutation();
    const { t } = useTranslation();

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            remember: false,
        },
        validationSchema: validationSchema,
        onSubmit: ({ email, password, remember }) => {
            login(email, password, remember);
        },
    });

    return (
        <form onSubmit={formik.handleSubmit}>
            <Stack spacing={3}>
                <TextField
                    id='email'
                    name='email'
                    label={t('common.email')}
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                />
                <TextField
                    id='password'
                    name='password'
                    label={t('common.password')}
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
            </Stack>

            <Stack direction='row' alignItems='center' justifyContent='space-between' sx={{ my: 2 }}>
                <FormControlLabel
                    control={
                        <Checkbox
                            name='remember'
                            checked={formik.values.remember}
                            onClick={() => formik.setFieldValue('remember', !formik.values.remember)}
                        />
                    }
                    label={t('loginPage.rememberMe')}
                />
            </Stack>

            <LoadingButton
                fullWidth
                loading={loading}
                size='large'
                type='submit'
                variant='contained'
                disabled={!!Object.keys(formik.errors).length}>
                {t('loginPage.login')}
            </LoadingButton>
        </form>
    );
}
