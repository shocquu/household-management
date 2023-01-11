import {
    Box,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    Stack,
    TextField,
    Tooltip,
    Typography,
    useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { LoadingButton } from '@mui/lab';
import Grid from '@mui/material/Unstable_Grid2';
import { capitalize } from 'lodash';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { gql, useMutation } from '@apollo/client';
import useAlert from '../../../hooks/useAlert';
import { TAGS_QUERY } from '../../../pages/TagsPage';
import { LabelColors } from '../../../types';

const ADD_TAG_MUTATION = gql`
    mutation CreateTag($createTagInput: CreateTagInput!) {
        createTag(createTagInput: $createTagInput) {
            id
        }
    }
`;

interface TagModal {
    open: boolean;
    handleClose: () => void;
    initialValues?: {
        title: string;
        color: keyof LabelColors;
    };
}

const validationSchema = yup.object({
    title: yup.string().required().max(10),
    color: yup.string().required().max(7),
});

const TagModal = ({ open, handleClose, initialValues }: TagModal) => {
    const theme = useTheme();
    const alert = useAlert();
    const [createTag, { loading }] = useMutation(ADD_TAG_MUTATION, {
        onCompleted: () => {
            alert.success('Added new label');
            handleClose();
        },
        onError: () => {
            alert.error('Failed to add a new label');
        },
    });

    const formik = useFormik({
        initialValues: initialValues ?? {
            title: '',
            color: Object.keys(LabelColors)[Math.floor(Math.random() * 9)],
        },
        isInitialValid: false,
        validationSchema: validationSchema,
        onSubmit: ({ title, color }) => {
            createTag({
                variables: {
                    createTagInput: {
                        color,
                        label: title,
                    },
                },
                update: (cache, { data: { createTag } }) => {
                    const { tags } = cache.readQuery({ query: TAGS_QUERY });
                    cache.writeQuery({
                        query: TAGS_QUERY,
                        data: { tags: tags.concat([createTag]) },
                    });
                },
            });
            formik.resetForm();
        },
    });

    return (
        <Dialog fullWidth maxWidth={'xs'} onClose={handleClose} open={open}>
            <form onSubmit={formik.handleSubmit}>
                <DialogContent>
                    <Stack spacing={1}>
                        <Stack direction='row' alignItems='center' justifyContent='space-between' mb={1}>
                            <Typography variant='h6'>Create label</Typography>
                            <IconButton
                                disableRipple
                                sx={{
                                    position: 'absolute',
                                    right: theme.spacing(1),
                                    top: theme.spacing(1),
                                }}
                                onClick={handleClose}>
                                <CloseIcon />
                            </IconButton>
                        </Stack>
                        <TextField
                            size='small'
                            name='title'
                            label={'Title'}
                            value={formik.values.title}
                            inputProps={{ maxLength: 10 }}
                            error={formik.touched.title && Boolean(formik.errors.title)}
                            helperText={formik.touched.title && formik.errors.title}
                            onChange={formik.handleChange}
                        />
                        <Typography variant='subtitle2' pl={'1px'}>
                            Select a color
                        </Typography>
                        <Grid container spacing={1}>
                            {Object.entries(LabelColors).map(([label, value]) => (
                                <Grid key={label} xs={4}>
                                    <Tooltip
                                        title={capitalize(label)}
                                        PopperProps={{
                                            modifiers: [
                                                {
                                                    name: 'offset',
                                                    options: {
                                                        offset: [0, -12],
                                                    },
                                                },
                                            ],
                                        }}>
                                        <Box
                                            sx={{
                                                boxSizing: 'border-box',
                                                bgcolor: value,
                                                height: '5vw',
                                                maxHeight: 40,
                                                cursor: 'pointer',
                                                color: 'secondary.light',
                                                border: '2px solid currentColor',
                                                borderColor: 'background.paper',
                                                ...(formik.values.color === label && {
                                                    outline: '4px solid currentColor',
                                                }),
                                            }}
                                            onClick={() => formik.setFieldValue('color', label)}
                                        />
                                    </Tooltip>
                                </Grid>
                            ))}
                        </Grid>
                        <LoadingButton
                            loading={loading}
                            disabled={!formik.isValid}
                            type='submit'
                            variant='contained'
                            sx={{ alignSelf: 'start' }}>
                            Create
                        </LoadingButton>
                    </Stack>
                </DialogContent>
            </form>
        </Dialog>
    );
};

export default TagModal;
