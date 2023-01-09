import { Card, CardContent, Stack, TextField, Typography } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import InfoIcon from '@mui/icons-material/Info';
import { gql, useMutation } from '@apollo/client';
import { useFormik } from 'formik';
import * as yup from 'yup';
import useAuth from '../../hooks/useAuth';
import useAlert from '../../hooks/useAlert';

const UPDATE_PASSWORD_MUTATION = gql`
    mutation Mutation($updatePasswordInput: UpdatePasswordInput!) {
        updatePassword(updatePasswordInput: $updatePasswordInput) {
            id
        }
    }
`;

const validationSchema = yup.object({
    oldPassword: yup.string().required('Old password is required'),
    newPassword: yup
        .string()
        .required('New password is required')
        .min(5, 'Password must consist of 5 or more characters')
        .notOneOf([yup.ref('oldPassword'), 'New password cannot be the same as your old password']),
    confirmNewPassword: yup
        .string()
        .oneOf([yup.ref('newPassword'), 'Passwords must match'])
        .defined(),
});

const PasswordChange = () => {
    const alert = useAlert();
    const { user } = useAuth();
    const [updatePassword, { loading }] = useMutation(UPDATE_PASSWORD_MUTATION);

    const formik = useFormik({
        initialValues: {
            oldPassword: '',
            newPassword: '',
            confirmNewPassword: '',
        },
        validationSchema,
        validateOnBlur: true,
        validateOnChange: false,
        onSubmit: ({ oldPassword, newPassword }) => {
            updatePassword({
                variables: { updatePasswordInput: { id: user.id, oldPassword, newPassword } },
                onError: (error) => {
                    formik.setErrors({ oldPassword: error.message });
                    alert.error('Failed to update the password');
                },
                onCompleted: () => {
                    formik.resetForm();
                    alert.success('Password updated');
                },
            });
        },
    });

    console.log(formik);

    return (
        <Card elevation={3}>
            <CardContent>
                <form onSubmit={formik.handleSubmit}>
                    <Stack spacing={3}>
                        <TextField
                            id='oldPassword'
                            name='oldPassword'
                            label='Old password'
                            type='password'
                            error={Boolean(formik.errors.oldPassword)}
                            helperText={formik.errors.oldPassword}
                            value={formik.values.oldPassword}
                            onChange={formik.handleChange}
                        />
                        <TextField
                            id='newPassword'
                            name='newPassword'
                            label='New password'
                            type='password'
                            error={Boolean(formik.errors.newPassword)}
                            helperText={formik.errors.newPassword ? formik.errors.newPassword : <HelperText />}
                            value={formik.values.newPassword}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        <TextField
                            id='confirmNewPassword'
                            name='confirmNewPassword'
                            label='Confirm new password'
                            type='password'
                            error={Boolean(formik.errors.confirmNewPassword)}
                            helperText={formik.errors.confirmNewPassword}
                            value={formik.values.confirmNewPassword}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        <LoadingButton
                            variant='contained'
                            type='submit'
                            loading={loading}
                            disabled={!formik.dirty || (formik.dirty && !formik.isValid)}
                            sx={{ alignSelf: 'end' }}>
                            Save changes
                        </LoadingButton>
                    </Stack>
                </form>
            </CardContent>
        </Card>
    );
};

const HelperText = () => (
    <Typography variant='caption' sx={{ display: 'inline-flex', alignItems: 'center' }}>
        <InfoIcon color='info' sx={{ fontSize: '16px', mr: 0.5 }} /> Password must be minimum 5 characters
    </Typography>
);

export default PasswordChange;
