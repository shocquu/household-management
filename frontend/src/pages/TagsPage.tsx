import { Helmet } from 'react-helmet-async';
import { capitalize, filter } from 'lodash';
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
import { gql, useQuery } from '@apollo/client';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
import { TagModal, TagsListHead, TagsListToolbar } from '../sections/@app/tags';
import { getLabelColor } from '../utils/getLabelColor';
import ColorSinglePicker from '../components/color-utils/ColorSinglePicker';

export const TAGS_QUERY = gql`
    query Tags {
        tags {
            id
            label
            color
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
    const [open, setOpen] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [page, setPage] = useState(0);
    const [order, setOrder] = useState<'asc' | 'desc'>('asc');
    const [selected, setSelected] = useState([]);
    const [orderBy, setOrderBy] = useState('label');
    const [filterName, setFilterName] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const { data } = useQuery(TAGS_QUERY);

    const handleOpenMenu = (event) => {
        setOpen(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setOpen(null);
    };

    const handleCloseModal = () => setOpenModal(false);

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

    const handleClick = (_event, name) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected = [];
        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
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
            <Helmet>
                <title> Labels | Hovee </title>
            </Helmet>

            <ColorSinglePicker colors={['red', 'blue']} />
            <TagModal open={openModal} handleClose={handleCloseModal} />
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
                                        .map(({ id, label, color }) => {
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
                                                            label={capitalize(color)}
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
                                                            onClick={handleOpenMenu}>
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
                <MenuItem>
                    <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
                    Edit
                </MenuItem>

                <MenuItem sx={{ color: 'error.main' }}>
                    <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
                    Delete
                </MenuItem>
            </Popover>
        </>
    );
};

export default TagsPage;
