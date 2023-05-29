import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCirclePlus,
    faEye,
    faPenToSquare,
    faSearch,
    faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { visuallyHidden } from '@mui/utils';
import { Button, ButtonGroup, InputAdornment, TextField } from '@mui/material';
import { alpha } from '@mui/material/styles';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

function createData(id, ten_don_vi, don_vi_truong, ghi_chu, xu_ly) {
    return {
        id,
        ten_don_vi,
        don_vi_truong,
        ghi_chu,
        xu_ly,
    };
}

const rows = [
    createData(
        1,
        'Lorem ipsum dolor sit amet commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
        'Lorem ipsum dolor sit amet commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
        'Lorem ipsum dolor sit amet commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
        'Lorem ipsum dolor sit amet commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
    ),
    createData(2, 452, 25.0, 51, 4.9),
    createData(3, 262, 16.0, 24, 6.0),
    createData(4, 159, 6.0, 24, 4.0),
    createData(5, 356, 16.0, 49, 3.9),
    createData(6, 408, 3.2, 87, 6.5),
    createData(7, 237, 9.0, 37, 4.3),
    createData(8, 375, 0.0, 94, 0.0),
    createData(9, 518, 26.0, 65, 7.0),
    createData(10, 392, 0.2, 98, 0.0),
    createData(11, 318, 0, 81, 2.0),
    createData(12, 360, 19.0, 9, 37.0),
    createData(13, 437, 18.0, 63, 4.0),
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

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

const headCells = [
    {
        id: 'id',
        numeric: true,
        disablePadding: true,
        label: 'ID',
    },
    {
        id: 'ten_don_vi',
        numeric: true,
        disablePadding: false,
        label: 'Tên đơn vị',
    },
    {
        id: 'don_vi_truong',
        numeric: true,
        disablePadding: false,
        label: 'Đơn vị trưởng',
    },
    {
        id: 'ghi_chu',
        numeric: true,
        disablePadding: false,
        label: 'Ghi chú',
    },
    {
        id: 'xu_ly',
        numeric: true,
        disablePadding: false,
        label: 'Xử lý',
    },
];

function EnhancedTableHead(props) {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead sx={{ background: '#0087E1' }}>
            <TableRow>
                <TableCell padding="checkbox">
                    <Checkbox
                        color="primary"
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{
                            'aria-label': 'select all desserts',
                        }}
                        sx={{
                            '& .MuiSvgIcon-root': { fontSize: 20 },
                            color: '#fff',
                            '&.Mui-checked': {
                                color: '#000',
                            },
                        }}
                    />
                </TableCell>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.id === 'id' ? 'left' : 'center'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                        sx={{
                            fontSize: '1.8rem',
                            fontWeight: '500',
                            color: '#fff',
                        }}
                    >
                        <TableSortLabel
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
    const { numSelected } = props;

    return (
        <Toolbar
            sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
                ...(numSelected > 0 && {
                    bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                }),
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}
        >
            {numSelected > 0 ? (
                <Typography
                    sx={{ flex: '1 1 100%', fontSize: 16 }}
                    color="inherit"
                    variant="subtitle1"
                    component="div"
                >
                    {numSelected} đã chọn
                </Typography>
            ) : (
                <TextField
                    label="Tìm kiếm đơn vị..."
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton>
                                    <FontAwesomeIcon icon={faSearch} />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                    sx={{
                        width: '300px',
                        fontWeight: 'bold',
                        '& .MuiInputLabel-root': {
                            fontSize: '1.4rem',
                        },
                        '& .MuiInputBase-input': {
                            fontSize: '1.4rem',
                        },
                    }}
                />
            )}

            {numSelected > 0 ? (
                <Tooltip title="Xóa tất cả">
                    <IconButton>
                        <FontAwesomeIcon
                            icon={faTrash}
                            style={{
                                fontSize: '16px',
                                color: 'var(--primary)',
                                marginRight: '10px',
                            }}
                        />
                    </IconButton>
                </Tooltip>
            ) : (
                <Link to="/plan">
                    <Button
                        startIcon={
                            <FontAwesomeIcon icon={faCirclePlus} style={{ color: '#0B7A4B' }} />
                        }
                        variant="outlined"
                        sx={{
                            fontSize: 12,
                            color: '#000',
                            fontWeight: 'bold',
                            marginRight: '10px',
                        }}
                    >
                        Thêm
                    </Button>
                </Link>
            )}
        </Toolbar>
    );
}

EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
};

function Unit() {
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('id');
    const [selected, setSelected] = useState([]);
    const [page, setPage] = useState(0);
    const [dense, setDense] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelected = rows.map((n) => n.id);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, id) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        setSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleChangeDense = (event) => {
        setDense(event.target.checked);
    };

    const isSelected = (id) => selected.indexOf(id) !== -1;

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    const visibleRows = useMemo(
        () =>
            stableSort(rows, getComparator(order, orderBy)).slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage,
            ),
        [order, orderBy, page, rowsPerPage],
    );

    return (
        <Box sx={{ width: '100%' }}>
            <Typography
                sx={{
                    flex: '1 1 100%',
                    textAlign: 'center',
                    fontWeight: 'bold',
                    marginBottom: '10px',
                }}
                variant="h3"
                id="tableTitle"
                component="div"
            >
                Danh sách đơn vị
            </Typography>
            <Paper sx={{ width: '100%' }} elevation={5}>
                <EnhancedTableToolbar numSelected={selected.length} />
                <TableContainer>
                    <Table
                        sx={{ minWidth: 750 }}
                        aria-labelledby="tableTitle"
                        size={dense ? 'small' : 'medium'}
                    >
                        <EnhancedTableHead
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={rows.length}
                        />
                        <TableBody>
                            {visibleRows.map((row, index) => {
                                const isItemSelected = isSelected(row.id);
                                const labelId = `enhanced-table-checkbox-${index}`;

                                return (
                                    <TableRow
                                        hover
                                        onClick={(event) => handleClick(event, row.id)}
                                        role="checkbox"
                                        aria-checked={isItemSelected}
                                        tabIndex={-1}
                                        key={row.id}
                                        selected={isItemSelected}
                                        sx={{ cursor: 'pointer' }}
                                    >
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                color="primary"
                                                checked={isItemSelected}
                                                inputProps={{
                                                    'aria-labelledby': labelId,
                                                }}
                                                sx={{
                                                    '& .MuiSvgIcon-root': { fontSize: 20 },
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell
                                            sx={{
                                                fontSize: 14,
                                                fontWeight: 'bold',
                                            }}
                                            component="th"
                                            id={labelId}
                                            scope="row"
                                            padding="none"
                                        >
                                            {row.id}
                                        </TableCell>
                                        <TableCell sx={{ fontSize: 14 }} align="left">
                                            {row.ten_don_vi}
                                        </TableCell>
                                        <TableCell sx={{ fontSize: 14 }} align="left">
                                            {row.don_vi_truong}
                                        </TableCell>
                                        <TableCell sx={{ fontSize: 14 }} align="left">
                                            {row.ghi_chu}
                                        </TableCell>
                                        <TableCell sx={{ fontSize: 14 }} align="left">
                                            <ButtonGroup
                                                size="large"
                                                aria-label="small button group"
                                            >
                                                <Tooltip title="Xem chi tiết">
                                                    <Link to="/plan">
                                                        <IconButton>
                                                            <FontAwesomeIcon
                                                                icon={faEye}
                                                                style={{
                                                                    fontSize: '16px',
                                                                    color: '#000',
                                                                }}
                                                            />
                                                        </IconButton>
                                                    </Link>
                                                </Tooltip>
                                                <Tooltip title="Sửa">
                                                    <Link to="/plan">
                                                        <IconButton>
                                                            <FontAwesomeIcon
                                                                icon={faPenToSquare}
                                                                style={{
                                                                    fontSize: '16px',
                                                                    color: '#2400FF',
                                                                }}
                                                            />
                                                        </IconButton>
                                                    </Link>
                                                </Tooltip>
                                                <Tooltip title="Xóa tất cả">
                                                    <Link to="/plan">
                                                        <IconButton>
                                                            <FontAwesomeIcon
                                                                icon={faTrash}
                                                                style={{
                                                                    fontSize: '16px',
                                                                    color: 'var(--primary)',
                                                                }}
                                                            />
                                                        </IconButton>
                                                    </Link>
                                                </Tooltip>
                                            </ButtonGroup>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                            {emptyRows > 0 && (
                                <TableRow
                                    style={{
                                        height: (dense ? 33 : 53) * emptyRows,
                                    }}
                                >
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    labelRowsPerPage="Số hàng:"
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    sx={{
                        fontSize: '1.2rem',
                        '& .MuiTablePagination-selectLabel': {
                            fontSize: '1.2rem',
                            fontWeight: 500,
                        },
                        '& .MuiTablePagination-displayedRows': {
                            fontSize: '1.2rem',
                            fontWeight: 500,
                        },
                        '& .MuiSvgIcon-root': { fontSize: '2rem' },
                    }}
                />
            </Paper>
            <FormControlLabel
                sx={{
                    '& .MuiTypography-root': { fontSize: '1.2rem' },
                }}
                control={<Switch checked={dense} onChange={handleChangeDense} />}
                label="Thu nhỏ"
            />
        </Box>
    );
}

export default Unit;
