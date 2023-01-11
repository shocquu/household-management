import {
    alpha,
    Box,
    darken,
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
import { capitalize, initial } from 'lodash';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { sentenceCase } from 'change-case';
import { gql, useMutation } from '@apollo/client';
import useAlert from '../../../hooks/useAlert';
import { TAGS_QUERY } from '../../../pages/TagsPage';
import { LabelColors, Tag } from '../../../types';
import { getLabelColor } from '../../../utils/getLabelColor';
import { useEffect } from 'react';

const ADD_TAG_MUTATION = gql`
    mutation CreateTag($createTagInput: CreateTagInput!) {
        createTag(createTagInput: $createTagInput) {
            id
        }
    }
`;

const UPDATE_TAG_MUTATION = gql`
    mutation UpdateTag($updateTagInput: UpdateTagInput!) {
        updateTag(updateTagInput: $updateTagInput) {
            id
        }
    }
`;

interface TagModal {
    open: boolean;
    handleClose: () => void;
    labelToEdit?: Tag;
}

const validationSchema = yup.object({
    title: yup.string().required().max(10),
    color: yup.string().required(),
});

const TagModal = ({ open, handleClose, labelToEdit }: TagModal) => {
    const theme = useTheme();
    const alert = useAlert();
    const [createTag, { loading: adding }] = useMutation(ADD_TAG_MUTATION, {
        onCompleted: () => {
            alert.success('Added new label');
            handleClose();
        },
        onError: () => {
            alert.error('Failed to add a new label');
        },
    });
    const [updateTag, { loading: updating }] = useMutation(UPDATE_TAG_MUTATION, {
        onCompleted: () => {
            alert.success('Successfully edited label');
            handleClose();
        },
        onError: () => {
            alert.error('Failed to edit the label');
        },
    });

    const getRandomLabelColor = () => Object.keys(LabelColors)[Math.floor(Math.random() * 9)];

    const loading = adding || updating;
    const formik = useFormik({
        initialValues: labelToEdit
            ? {
                  title: labelToEdit.label,
                  color: labelToEdit.color,
              }
            : {
                  title: '',
                  color: getRandomLabelColor(),
              },
        isInitialValid: false,
        enableReinitialize: Boolean(labelToEdit),
        validationSchema: validationSchema,
        onSubmit: ({ title, color }) => {
            labelToEdit
                ? updateTag({
                      variables: {
                          updateTagInput: {
                              id: labelToEdit.id,
                              label: title,
                              color,
                          },
                      },
                      update: (cache) => {
                          cache.modify({
                              fields: {
                                  tags(cachedTags: Tag[] = [], { readField }) {
                                      const updatedTag = cachedTags?.find(
                                          (tag) => labelToEdit.id === readField('id', tag)
                                      );
                                      return { ...cachedTags, updatedTag };
                                  },
                              },
                          });
                      },
                  })
                : createTag({
                      variables: {
                          createTagInput: {
                              color,
                              label: title,
                          },
                      },
                      update: (cache, { data: { createTag } }) => {
                          const { tags } = cache.readQuery({ query: TAGS_QUERY });
                          //   cache.writeQuery({
                          //       query: TAGS_QUERY,
                          //       data: { tags: tags.concat([createTag]) },
                          //   });
                          cache.modify({
                              fields: {
                                  tags(cachedTags: Tag[]) {
                                      return cachedTags?.concat([createTag]);
                                  },
                              },
                          });
                      },
                  });
            formik.resetForm();
        },
    });

    useEffect(() => {
        if (!labelToEdit && open) formik.setValues({ title: '', color: getRandomLabelColor() });
    }, [open, labelToEdit]);

    return (
        <Dialog fullWidth maxWidth={'xs'} onClose={handleClose} open={open}>
            <form onSubmit={formik.handleSubmit}>
                <DialogContent>
                    <Stack spacing={1}>
                        <Stack direction='row' alignItems='center' justifyContent='space-between' mb={1}>
                            <Typography variant='h6'> {labelToEdit ? 'Edit label' : 'Create label'}</Typography>
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
                                        title={sentenceCase(label)}
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
                                                height: 'clamp(30px, 5vw, 40px)',
                                                cursor: 'pointer',
                                                color: darken(getLabelColor(value), 0.05),
                                                borderRadius: 1,
                                                boxShadow: theme.shadows[1],
                                                ...(formik.values.color === label && {
                                                    outline: '3px solid currentColor',
                                                    boxShadow: `0 4px 6px 3px ${alpha(getLabelColor(value), 0.8)}`,
                                                }),
                                            }}
                                            onClick={() => formik.setFieldValue('color', label)}>
                                            {formik.values.color === label && (
                                                <Typography
                                                    variant='subtitle2'
                                                    textAlign='center'
                                                    sx={{
                                                        top: '50%',
                                                        transform: 'translateY(-50%)',
                                                        position: 'relative',
                                                        color: darken(getLabelColor(value), 0.25),
                                                    }}>
                                                    {sentenceCase(label)}
                                                </Typography>
                                            )}
                                        </Box>
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
                            {labelToEdit ? 'Edit' : 'Create'}
                        </LoadingButton>
                    </Stack>
                </DialogContent>
            </form>
        </Dialog>
    );
};

export default TagModal;
