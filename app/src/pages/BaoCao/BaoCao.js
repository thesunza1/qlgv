import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus, faFileExcel, faSearch, faTrash } from '@fortawesome/free-solid-svg-icons';
import { visuallyHidden } from '@mui/utils';
import { Button, InputAdornment, TextField } from '@mui/material';
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

function createData(
    id,
    thoi_gian,
    ten_cong_viec,
    noi_dung_cong_viec,
    gio_lam_viec,
    tien_do,
    duyet_gio,
    trang_thai,
    tham_dinh,
) {
    return {
        id,
        thoi_gian,
        ten_cong_viec,
        noi_dung_cong_viec,
        gio_lam_viec,
        tien_do,
        duyet_gio,
        trang_thai,
        tham_dinh,
    };
}

const rows = [
    createData(1, '31/5/2023', 'Lập trình', 'Bằng Reactjs 1', '2', '50%', '2', 'Đã thẩm định', '1'),
    createData(
        2,
        '31/5/2023',
        'Lập trình',
        'Bằng Reactjs 2',
        '2',
        '50%',
        '2',
        'Chưa thẩm định',
        '1',
    ),
    createData(3, '31/5/2023', 'Lập trình 1', 'Bằng Reactjs', '2', '50%', '2', 'Đã thẩm định', '1'),
    createData(4, '31/5/2023', 'Thiết kế', 'Bằng Reactjs', '2', '50%', '2', 'Đã thẩm định', '1'),
    createData(5, '31/5/2023', 'Lập trình', 'Bằng Reactjs', '2', '50%', '2', 'Đã thẩm định', '1'),
    createData(6, '31/5/2023', 'Lập trình', 'Bằng Reactjs', '2', '50%', '2', 'Đã thẩm định', '1'),
    createData(7, '31/5/2023', 'Lập trình', 'Bằng Reactjs', '2', '50%', '2', 'Đã thẩm định', '1'),
    createData(8, '31/5/2023', 'Lập trình', 'Bằng Reactjs', '2', '50%', '2', 'Đã thẩm định', '1'),
    createData(9, '31/5/2023', 'Lập trình', 'Bằng Reactjs', '2', '50%', '2', 'Đã thẩm định', '1'),
    createData(10, '31/5/2023', 'Lập trình', 'Bằng Reactjs', '2', '50%', '2', 'Đã thẩm định', '1'),
    createData(11, '31/5/2023', 'Lập trình', 'Bằng Reactjs', '2', '50%', '2', 'Đã thẩm định', '1'),
    createData(12, '31/5/2023', 'Lập trình', 'Bằng Reactjs', '2', '50%', '2', 'Đã thẩm định', '1'),
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
        label: 'STT',
    },
    {
        id: 'thoi_gian',
        numeric: false,
        disablePadding: false,
        label: 'Thời gian',
    },
    {
        id: 'ten_cong_viec',
        numeric: false,
        disablePadding: false,
        label: 'Tên công việc',
    },
    {
        id: 'noi_dung_cong_viec',
        numeric: false,
        disablePadding: false,
        label: 'Nội dung công việc',
    },
    {
        id: 'gio_lam_viec',
        numeric: false,
        disablePadding: false,
        label: 'Giờ làm việc (giờ)',
    },
    {
        id: 'tien_do',
        numeric: false,
        disablePadding: false,
        label: 'Tiến độ',
    },
    {
        id: 'duyet_gio',
        numeric: false,
        disablePadding: false,
        label: 'Duyệt giờ (giờ)',
    },
    {
        id: 'trang_thai',
        numeric: false,
        disablePadding: false,
        label: 'Trạng thái',
    },
    {
        id: 'tham_dinh',
        numeric: false,
        disablePadding: false,
        label: 'Thẩm định',
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
                    type="search"
                    onInput={(e) => {
                        setSearchQuery(e.target.value);
                    }}
                    InputLabelProps={{
                        shrink: false,
                    }}
                    variant="outlined"
                    placeholder="Tìm kiếm đơn vị..."
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
                        width: '250px',
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
                <Tooltip title={<h1 style={{ color: 'lightblue' }}>Xóa tất cả</h1>}>
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
                <Link to="them">
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
                    <Button
                        startIcon={
                            <FontAwesomeIcon icon={faFileExcel} style={{ color: '#0B7A4B' }} />
                        }
                        variant="outlined"
                        sx={{
                            fontSize: 12,
                            color: '#000',
                            fontWeight: 'bold',
                            marginRight: '10px',
                        }}
                    >
                        Xuất file
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
                d.ten_cong_viec.toLowerCase().indexOf(query.toLowerCase()) > -1 ||
                d.trang_thai.toLowerCase().indexOf(query.toLowerCase()) > -1,
        );
    }
};

function DonVi() {
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
                    margin: '10px 0 20px 0',
                }}
                variant="h3"
                id="tableTitle"
                component="div"
            >
                Báo cáo công việc hằng ngày
            </Typography>
            <h3 style={{ marginBottom: '10px' }}>
                Tổng số giờ đã làm: <span style={{ color: 'var(--primary)' }}>16 giờ</span>
            </h3>
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
                                            <TableCell sx={{ fontSize: 14 }} align="center">
                                                {row.thoi_gian}
                                            </TableCell>
                                            <TableCell sx={{ fontSize: 14 }} align="left">
                                                {row.ten_cong_viec}
                                            </TableCell>
                                            <TableCell sx={{ fontSize: 14 }} align="left">
                                                {row.noi_dung_cong_viec}
                                            </TableCell>
                                            <TableCell sx={{ fontSize: 14 }} align="center">
                                                {row.gio_lam_viec}
                                            </TableCell>
                                            <TableCell sx={{ fontSize: 14 }} align="left">
                                                {row.tien_do}
                                            </TableCell>
                                            <TableCell sx={{ fontSize: 14 }} align="center">
                                                {row.duyet_gio}
                                            </TableCell>
                                            <TableCell sx={{ fontSize: 14 }} align="left">
                                                {row.trang_thai}
                                            </TableCell>
                                            <TableCell sx={{ fontSize: 14 }} align="center">
                                                {row.tham_dinh}
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

export default DonVi;
