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

function createData(id, ten_don_vi, don_vi_truong, ghi_chu) {
    return {
        id,
        ten_don_vi,
        don_vi_truong,
        ghi_chu,
    };
}

const rows = [
    createData(1, 'Đơn vị 1', 'Đơn vị trưởng 1', 'Ghi chú 1'),
    createData(2, 'Đơn vị 2', 'Đơn vị trưởng 2', 'Ghi chú 2'),
    createData(3, 'Đơn vị 3', 'Đơn vị trưởng 3', 'Ghi chú 3'),
    createData(4, 'Đơn vị 4', 'Đơn vị trưởng 4', 'Ghi chú 4'),
    createData(5, 'Đơn vị 5', 'Đơn vị trưởng 5', 'Ghi chú 5'),
    createData(6, 'Đơn vị 6', 'Đơn vị trưởng 6', 'Ghi chú 6'),
    createData(7, 'Đơn vị 7', 'Đơn vị trưởng 7', 'Ghi chú 7'),
    createData(8, 'Đơn vị 8', 'Đơn vị trưởng 8', 'Ghi chú 8'),
    createData(9, 'Đơn vị 9', 'Đơn vị trưởng 9', 'Ghi chú 9'),
    createData(10, 'Đơn vị 10', 'Đơn vị trưởng 10', 'Ghi chú 10'),
    createData(11, 'Đơn vị 11', 'Đơn vị trưởng 11', 'Ghi chú 11'),
    createData(12, 'Đơn vị 12', 'Đơn vị trưởng 12', 'Ghi chú 12'),
    createData(13, 'Đơn vị 13', 'Đơn vị trưởng 13', 'Ghi chú 13'),
    createData(14, 'Đơn vị 14', 'Đơn vị trưởng 14', 'Ghi chú 14'),
    createData(15, 'Đơn vị 15', 'Đơn vị trưởng 15', 'Ghi chú 15'),
    createData(16, 'Đơn vị 16', 'Đơn vị trưởng 16', 'Ghi chú 16'),
    createData(17, 'Đơn vị 17', 'Đơn vị trưởng 17', 'Ghi chú 17'),
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
        numeric: false,
        disablePadding: false,
        label: 'Tên đơn vị',
    },
    {
        id: 'don_vi_truong',
        numeric: false,
        disablePadding: false,
        label: 'Đơn vị trưởng',
    },
    {
        id: 'ghi_chu',
        numeric: false,
        disablePadding: false,
        label: 'Ghi chú',
    },
    {
        id: 'xu_ly',
        numeric: false,
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
    const { numSelected, setSearchQuery } = props;

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
                    label="Tìm kiếm đơn vị hoặc đơn vị trưởng"
                    onInput={(e) => {
                        setSearchQuery(e.target.value);
                    }}
                    variant="outlined"
                    placeholder="Search..."
                    size="small"
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

const filterData = (query, data) => {
    if (!query) {
        return data;
    } else {
        return data.filter(
            (d) =>
                d.ten_don_vi.toLowerCase().indexOf(query.toLowerCase()) > -1 ||
                d.don_vi_truong.toLowerCase().indexOf(query.toLowerCase()) > -1,
        );
    }
};

function Unit() {
    const [searchQuery, setSearchQuery] = useState('');
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

    const dataFiltered = filterData(searchQuery, rows);

    const visibleRows = useMemo(
        () =>
            stableSort(dataFiltered, getComparator(order, orderBy)).slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage,
            ),
        [dataFiltered, order, orderBy, page, rowsPerPage],
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
                <EnhancedTableToolbar
                    numSelected={selected.length}
                    setSearchQuery={setSearchQuery}
                />
                <TableContainer>
                    {visibleRows.length > 0 ? (
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
                                            <TableCell sx={{ fontSize: 14 }} align="center">
                                                <ButtonGroup
                                                    size="large"
                                                    aria-label="small button group"
                                                >
                                                    <Tooltip title="Xem chi tiết">
                                                        <Link to="/donvi/nhanvien">
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
                                                    <Tooltip title="Xóa">
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
                    ) : (
                        <p style={{ margin: '30px' }}>Không có kết quả tìm kiếm</p>
                    )}
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
