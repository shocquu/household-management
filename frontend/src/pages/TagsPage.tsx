import { Helmet } from 'react-helmet-async';
import { capitalize, filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState } from 'react';
import {
    Card,
    Table,
    Stack,
    Paper,
    Avatar,
    Button,
    Popover,
    Checkbox,
    TableRow,
    MenuItem,
    TableBody,
    TableCell,
    Container,
    Typography,
    IconButton,
    TableContainer,
    TablePagination,
    Chip,
    alpha,
    darken,
} from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';
import { gql, useMutation, useQuery } from '@apollo/client';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
import { TagModal, TagsListHead, TagsListToolbar } from '../sections/@app/tags';
import { getLabelColor } from '../utils/getLabelColor';
import { LabelColors, Tag } from '../types';
import useAlert from '../hooks/useAlert';
import useLocalPreferences from '../hooks/useLocalPreferences';
import { USERS_QUERY } from './TasksPage';

export const TAGS_QUERY = gql`
    query Tags {
        tags {
            id
            label
            color
        }
    }
`;

const REMOVE_TAG_MUTATION = gql`
    mutation RemoveTag($removeTagId: Int!) {
        removeTag(id: $removeTagId) {
            id
            color
            label
        }
    }
`;

const REMOVE_TAGS_MUTATION = gql`
    mutation RemoveTags($ids: [Int]!) {
        removeTags(ids: $ids) {
            count
        }
    }
`;

const TABLE_HEAD = [
    { id: 'label', label: 'Label', alignRight: false },
    { id: 'color', label: 'Color', alignRight: false },
    { id: '' },
];

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    if (query) {
        return filter(array, (_tag) => _tag.label.toLowerCase().indexOf(query.toLowerCase()) !== -1);
    }
    return stabilizedThis.map((el) => el[0]);
}

const TagsPage = () => {
    const [open, setOpen] = useState<Element | null>(null);
    const [openModal, setOpenModal] = useState(false);
    const [selectedLabelItem, setSelectedLabelItem] = useState<Tag | null>(null);
    const [page, setPage] = useState(0);
    const [order, setOrder] = useState<'asc' | 'desc'>('asc');
    const [selected, setSelected] = useState<number[]>([]);
    const [orderBy, setOrderBy] = useState('label');
    const [filterName, setFilterName] = useState('');
    const { preferences, setPreference } = useLocalPreferences();
    const [rowsPerPage, setRowsPerPage] = useState(preferences?.rowsPerPage ?? 5);
    const alert = useAlert();

    const { data } = useQuery(TAGS_QUERY);
    const [removeTag] = useMutation(REMOVE_TAG_MUTATION, {
        refetchQueries: [{ query: USERS_QUERY }],
        variables: {
            removeTagId: selectedLabelItem?.id,
        },
        onCompleted: () => alert.success('Label has been removed'),
        onError: (error) => alert.error(error.message),
        update(cache) {
            const normalizedId = cache.identify({ id: selectedLabelItem?.id, __typename: 'Tag' });
            cache.evict({ id: normalizedId });
            cache.gc();
        },
    });
    const [removeTags] = useMutation(REMOVE_TAGS_MUTATION, {
        refetchQueries: [{ query: USERS_QUERY }],
        variables: {
            ids: selected,
        },
        onCompleted: () => {
            setSelected([]);
            alert.success('Labels have been removed');
        },
        onError: (error) => alert.error(error.message),
        update(cache) {
            cache.modify({
                fields: {
                    tags(cachedTags: Tag[] = [], { readField }) {
                        return cachedTags?.filter((tag) => !selected.includes(readField('id', tag)));
                    },
                },
            });
        },
    });

    const handleOpenMenu = (selectedTag: Tag) => (event) => {
        setOpen(event.currentTarget);
        setSelectedLabelItem(selectedTag);
    };

    const handleCloseMenu = () => {
        setOpen(null);
    };

    const handleOpenModal = () => {
        setOpenModal(true), setOpen(null);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedLabelItem(null);
    };

    const handleRequestSort = (_event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = data?.tags.map((n) => n.id);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleClick = (_event, label: number) => {
        const selectedIndex = selected.indexOf(label);
        let newSelected = [];
        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, label);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
        }
        setSelected(newSelected);
    };

    const handleChangePage = (_event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setPage(0);
        setRowsPerPage(parseInt(event.target.value, 10));
        setPreference('rowsPerPage', parseInt(event.target.value, 10));
    };

    const handleFilterByName = (event) => {
        setPage(0);
        setFilterName(event.target.value);
    };

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data?.tags.length) : 0;

    const filteredTags = data?.tags ? applySortFilter(data?.tags, getComparator(order, orderBy), filterName) : [];

    const isNotFound = !filteredTags.length && !!filterName;

    return (
        <>
            <Helmet title='Labels | Hovee ' />

            <TagModal open={openModal} handleClose={handleCloseModal} labelToEdit={selectedLabelItem} />
            <Container>
                <Stack direction='row' alignItems='center' justifyContent='space-between' mb={5}>
                    <Typography variant='h4' gutterBottom>
                        Labels
                    </Typography>
                    <Button
                        variant='contained'
                        startIcon={<Iconify icon='eva:plus-fill' />}
                        onClick={() => setOpenModal(true)}>
                        New label
                    </Button>
                </Stack>

                <Card>
                    <TagsListToolbar
                        numSelected={selected.length}
                        filterName={filterName}
                        setFilterName={setFilterName}
                        onFilterName={handleFilterByName}
                        onRemove={() => removeTags()}
                    />

                    <Scrollbar>
                        <TableContainer sx={{ minWidth: 800 }}>
                            <Table>
                                <TagsListHead
                                    order={order}
                                    orderBy={orderBy}
                                    headLabel={TABLE_HEAD}
                                    rowCount={data?.tags.length}
                                    numSelected={selected.length}
                                    onRequestSort={handleRequestSort}
                                    onSelectAllClick={handleSelectAllClick}
                                />
                                <TableBody>
                                    {filteredTags
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((tag) => {
                                            const { id, label, color } = tag;
                                            const selectedTag = selected.indexOf(id) !== -1;

                                            return (
                                                <TableRow
                                                    hover
                                                    key={id}
                                                    tabIndex={-1}
                                                    role='checkbox'
                                                    selected={selectedTag}>
                                                    <TableCell padding='checkbox'>
                                                        <Checkbox
                                                            checked={selectedTag}
                                                            onChange={(event) => handleClick(event, id)}
                                                        />
                                                    </TableCell>

                                                    <TableCell component='th' scope='row' padding='none'>
                                                        <Typography variant='subtitle2' ml={2} noWrap>
                                                            {label}
                                                        </Typography>
                                                    </TableCell>

                                                    <TableCell align='left'>
                                                        <Chip
                                                            avatar={
                                                                <CircleIcon
                                                                    sx={{
                                                                        fill: getLabelColor(color),
                                                                    }}
                                                                />
                                                            }
                                                            label={sentenceCase(color)}
                                                            sx={{
                                                                color: darken(getLabelColor(color), 0.3),
                                                                bgcolor: alpha(getLabelColor(color), 0.5),
                                                            }}
                                                        />
                                                    </TableCell>

                                                    <TableCell align='right'>
                                                        <IconButton
                                                            size='large'
                                                            color='inherit'
                                                            onClick={handleOpenMenu(tag)}>
                                                            <Iconify icon={'eva:more-vertical-fill'} />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    {emptyRows > 0 && (
                                        <TableRow style={{ height: 53 * emptyRows }}>
                                            <TableCell colSpan={3} />
                                        </TableRow>
                                    )}
                                </TableBody>

                                {isNotFound && (
                                    <TableBody>
                                        <TableRow>
                                            <TableCell align='center' colSpan={3} sx={{ py: 3 }}>
                                                <Paper
                                                    sx={{
                                                        textAlign: 'center',
                                                    }}>
                                                    <Typography variant='h6' paragraph>
                                                        Not found
                                                    </Typography>

                                                    <Typography variant='body2'>
                                                        No results found for &nbsp;
                                                        <strong>&quot;{filterName}&quot;</strong>.
                                                    </Typography>
                                                </Paper>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                )}
                            </Table>
                        </TableContainer>
                    </Scrollbar>

                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component='div'
                        count={data?.tags.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Card>
            </Container>

            <Popover
                open={Boolean(open)}
                anchorEl={open}
                onClose={handleCloseMenu}
                anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                PaperProps={{
                    sx: {
                        p: 1,
                        width: 140,
                        '& .MuiMenuItem-root': {
                            px: 1,
                            typography: 'body2',
                            borderRadius: 0.75,
                        },
                    },
                }}>
                <MenuItem onClick={handleOpenModal}>
                    <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
                    Edit
                </MenuItem>

                <MenuItem
                    sx={{ color: 'error.main' }}
                    onClick={() => {
                        removeTag();
                    }}>
                    <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
                    Delete
                </MenuItem>
            </Popover>
        </>
    );
};

export default TagsPage;
