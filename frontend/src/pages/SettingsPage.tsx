import { LoadingButton } from '@mui/lab';
import {
    Card,
    CardContent,
    Container,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { useFormik } from 'formik';
import { Helmet } from 'react-helmet-async';
import useAuth, { CURRENT_USER_QUERY } from '../hooks/useAuth';
import * as yup from 'yup';
import useAlert from '../hooks/useAlert';
import { gql, useMutation } from '@apollo/client';
import { fDate } from '../utils/formatTime';
import { ChangeEvent, ChangeEventHandler } from 'react';
import { User } from '../types';
import { useTranslation } from 'react-i18next';

const UPDATE_USER_MUTATION = gql`
    mutation Mutation($updateUserInput: UpdateUserInput!) {
        updateUser(updateUserInput: $updateUserInput) {
            id
        }
    }
`;

const TIME_FORMATS = [
    { value: 'HH:mm', label: '24h' },
    { value: 'hh:mm p', label: '12h' },
];
const DATE_FORMATS = [
    'dd-MM-yyyy',
    'MM-dd-yyyy',
    'yyyy-MM-dd',
    'yyyy-dd-MM',
    'dd/MM/yyyy',
    'MM/dd/yyyy',
    'yyyy/MM/dd',
    'yyyy/dd/MM',
];

const validationSchema = yup.object({
    dateFormat: yup.string().required(),
    timeFormat: yup
        .string()
        .required()
        .matches(/^(HH|hh):mm( p)?$/),
});

const SettingsPage = () => {
    const { user } = useAuth();
    const alert = useAlert();
    const { t } = useTranslation();
    const [updateUser, { loading }] = useMutation(UPDATE_USER_MUTATION, {
        onCompleted: () => {
            alert.success('Successfuly updated');
        },
        onError: () => {
            alert.error('Failed to update');
        },
    });

    const formik = useFormik({
        initialValues: {
            dateFormat: user.settings.dateFormat,
            timeFormat: user.settings.timeFormat,
        },
        validationSchema,
        validateOnBlur: true,
        onSubmit: (values) => {
            if (formik.dirty)
                updateUser({
                    variables: { updateUserInput: { id: user.id, ...values } },
                    update: (cache, { data }) => {
                        const { whoami } = cache.readQuery({
                            query: CURRENT_USER_QUERY,
                        });
                        cache.writeQuery({
                            query: CURRENT_USER_QUERY,
                            data: { whoami: { ...whoami, settings: values } },
                        });
                    },
                });
            formik.resetForm({ values });
        },
    });

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        formik.setFieldValue(event.target.name, event.target.value as string);
    };

    return (
        <>
            <Helmet title='Settings | Hovee' />
            <Container
                maxWidth='md'
                sx={{
                    height: '100%',
                }}>
                <form onSubmit={formik.handleSubmit}>
                    <Typography variant='h4' mb={3}>
                        {t('common.settings')}
                    </Typography>
                    <Card elevation={3}>
                        <CardContent
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                            <Stack spacing={1} sx={{ width: '100%' }}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={4} md={4}>
                                        <TextField
                                            fullWidth
                                            select
                                            name='dateFormat'
                                            label={t('common.dateFormat')}
                                            value={formik.values.dateFormat}
                                            error={formik.touched.dateFormat && Boolean(formik.errors.dateFormat)}
                                            helperText={formik.touched.dateFormat && formik.errors.dateFormat}
                                            onChange={handleChange}>
                                            {DATE_FORMATS.map((format) => (
                                                <MenuItem key={format} value={format}>
                                                    {fDate(new Date(), format)}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={12} sm={3} md={2}>
                                        <TextField
                                            fullWidth
                                            select
                                            name='timeFormat'
                                            label={t('common.timeFormat')}
                                            value={formik.values.timeFormat}
                                            error={formik.touched.timeFormat && Boolean(formik.errors.timeFormat)}
                                            helperText={formik.touched.timeFormat && formik.errors.timeFormat}
                                            onChange={handleChange}>
                                            {TIME_FORMATS.map(({ value, label }) => (
                                                <MenuItem key={value} value={value}>
                                                    {label}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Grid>
                                </Grid>
                                <LoadingButton
                                    variant='contained'
                                    type='submit'
                                    loading={loading}
                                    disabled={!formik.dirty}
                                    sx={{ alignSelf: 'start' }}>
                                    {t('common.saveChanges')}
                                </LoadingButton>
                            </Stack>
                        </CardContent>
                    </Card>
                </form>
            </Container>
        </>
    );
};

export default SettingsPage;
