import { useState, useEffect, useMemo, useCallback, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faPlus,
    faEye,
    faPenToSquare,
    faTrash,
    faAnglesLeft,
    faAnglesRight,
    faList,
    faArrowUp,
    faArrowDown,
    faChevronDown,
    faChevronRight,
    faCheckCircle,
    faXmarkCircle,
    faCircleMinus,
    faSave,
    faPaperPlane,
    faMinusCircle,
    faRotateRight,
} from '@fortawesome/free-solid-svg-icons';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import swal from 'sweetalert';
import ReactPaginate from 'react-paginate';
import axiosClient from '~/api/axiosClient';
import Moment from 'moment';
import 'moment/locale/vi';
import classNames from 'classnames/bind';
import styles from './KeHoach.module.scss';
import CongViecDotXuat from './CongViecDotXuat/CongViecDotXuat';
import cogoToast from 'cogo-toast';
import KeHoachThang from './KeHoachThang/KeHoachThang';

const cx = classNames.bind(styles);

function KeHoach() {
    const [dSKeHoach, setDSKeHoach] = useState([]);
    const [listKeHoach, setListKeHoach] = useState([]);
    const [sortColumn, setSortColumn] = useState('');
    const [sortDirection, setSortDirection] = useState('');
    const [searchText, setSearchText] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [dSNhanVien, setDSNhanVien] = useState([]);
    const [dSDonVi, setDSDonVi] = useState([]);
    const [infoUser, setInfoUser] = useState([]);
    const [displayedKeHoach, setDisplayedKeHoach] = useState([]);
    const [filterName, setFilterName] = useState('');
    const [filterType, setFilterType] = useState('');
    const [filterState, setFilterState] = useState('');
    const [filterDateStart, setFilterDateStart] = useState('');

    const PER_PAGE = 10;

    useEffect(() => {
        const getListProduct = async () => {
            const token = localStorage.getItem('Token');
            const response = await axiosClient.get(`/get_CV_KeHoach?token=${token}`);
            setListKeHoach(response.data.ke_hoachs || []);
        };
        getListProduct();
    }, []);

    useEffect(() => {
        setDSKeHoach(
            listKeHoach.map((cv) => ({
                ...cv,
                isEdit: false,
            })),
        );
    }, [listKeHoach]);

    useEffect(() => {
        const getInfoUser = async () => {
            const token = localStorage.getItem('Token');
            const response = await axiosClient.get(`/user-info?token=${token}`);
            setInfoUser(response.data.result);
        };
        getInfoUser();
    }, []);

    useEffect(() => {
        const getListNhanVien = async () => {
            const response = await axiosClient.get('/get_NhanVien');
            setDSNhanVien(response.data.nhanViens);
        };
        getListNhanVien();
    }, []);

    useEffect(() => {
        const getListDonVi = async () => {
            const response = await axiosClient.get('/get_DonVi');
            setDSDonVi(response.data.don_vis);
        };
        getListDonVi();
    }, []);

    function trangThai(trangThai) {
        switch (trangThai) {
            case '0':
                return <button className={cx('b0')}>Đang Soạn</button>;
            case '1':
                return <button className={cx('b1')}>Chờ duyệt</button>;
            case '2':
                return <button className={cx('b2')}>Đang thực hiện</button>;
            case '3':
                return <button className={cx('b3')}>Hoàn thành</button>;
            case '4':
                return <button className={cx('b4')}>Quá hạn</button>;
            default:
                return <button className={cx('b5')}>Từ chối</button>;
        }
    }

    const handleSortColumn = (key) => {
        if (sortColumn === key) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(key);
            setSortDirection('desc');
        }
    };

    const handleSearchInputChange = (event) => {
        setSearchText(event.target.value);
        setCurrentPage(0);
    };

    const handleFilterName = (event) => {
        setFilterName(event.target.value);
    };

    const handleFilterType = (event) => {
        setFilterType(event.target.value);
    };

    const handleFilterState = (event) => {
        setFilterState(event.target.value);
    };

    const handleFilterDateStart = (event) => {
        const selectedDate = event.target.value;

        if (selectedDate) {
            const filteredData = displayedKeHoach.filter((item) => {
                const itemDate = Moment(item.kh_thgianbatdau, 'DD-MM-YYYY');
                const selectedDateObj = Moment(selectedDate, 'YYYY-MM-DD');

                return itemDate.isSameOrAfter(selectedDateObj);
            });

            setFilterDateStart(selectedDate);
            setDisplayedKeHoach(filteredData);
        } else {
            setFilterDateStart('');
            setDisplayedKeHoach('');
        }
    };

    const handleReset = () => {
        setSearchText('');
        setFilterName('');
        setFilterType('');
        setFilterState('');
        setFilterDateStart('');
    };

    const sortedKeHoach = useMemo(() => {
        let sortedItems = [...dSKeHoach];
        sortedItems = sortedItems.sort((a, b) =>
            a[sortColumn] > b[sortColumn] ? 1 : b[sortColumn] > a[sortColumn] ? -1 : 0,
        );
        if (sortDirection === 'asc') {
            sortedItems.reverse();
        }

        sortedItems = sortedItems.sort((a, b) => {
            const cvTrangThaiOrder = { 0: 0, 1: 1, 2: 3, 3: 4, 4: 2 };
            const aOrder = cvTrangThaiOrder[a.kh_trangthai] ?? 999;
            const bOrder = cvTrangThaiOrder[b.kh_trangthai] ?? 999;
            return aOrder - bOrder;
        });

        return sortedItems;
    }, [dSKeHoach, sortColumn, sortDirection]);

    const getDisplayKeHoach = useCallback(() => {
        const filteredKeHoach = sortedKeHoach.filter(
            (kh) =>
                kh.kh_ten.toLowerCase().includes(searchText.toLowerCase()) &&
                (filterName === '' || kh.nv_id.toString() === filterName) &&
                (filterType === '' || kh.kh_loaikehoach === filterType) &&
                (filterState === '' || kh.kh_trangthai === filterState) &&
                (filterDateStart === '' || kh.kh_thgianbatdau === filterDateStart),
        );

        const startIndex = currentPage * PER_PAGE;
        return filteredKeHoach.slice(startIndex, startIndex + PER_PAGE) || [];
    }, [
        sortedKeHoach,
        currentPage,
        searchText,
        filterName,
        filterType,
        filterState,
        filterDateStart,
    ]);

    useEffect(() => {
        const updatedDisplayedKeHoach = getDisplayKeHoach();
        setDisplayedKeHoach(updatedDisplayedKeHoach);
    }, [getDisplayKeHoach]);

    const totalPage = Math.ceil(sortedKeHoach.length / PER_PAGE);

    const handlePageClick = ({ selected: selectedPage }) => {
        setCurrentPage(selectedPage);
    };

    const handleXoaKH = (kh) => {
        swal({
            title: `Bạn chắc chắn muốn xóa kế hoạch ${kh.kh_ten.toUpperCase()} này`,
            text: 'Sau khi xóa, bạn sẽ không thể khôi phục công việc này!',
            icon: 'warning',
            buttons: true,
            dangerMode: true,
        }).then(async (willDelete) => {
            if (willDelete) {
                try {
                    const token = localStorage.getItem('Token');
                    const response = await axiosClient.delete('/delete_KeHoach', {
                        data: { delletekh_ids: [kh.kh_id] }, // pass an array of the ID to delete
                        params: { token: token },
                    });
                    if (response.status === 200) {
                        swal(`Kế hoạch ${kh.kh_ten} đã được xóa thành công!`, { icon: 'success' });
                        window.location.reload();
                    }
                } catch (error) {
                    console.error(error);
                    swal(`Lỗi khi xóa kế hoạch ${kh.kh_ten} : ${error.message}`, { icon: 'error' });
                }
            } else {
                return;
            }
        });
    };

    const startIndex = currentPage * PER_PAGE + 1;
    const endIndex =
        startIndex + displayedKeHoach.length - 1 <= dSKeHoach.length
            ? startIndex + displayedKeHoach.length - 1
            : dSKeHoach.length;
    const total = dSKeHoach.length;

    // Expanded table
    const [expandedRows, setExpandedRows] = useState([]);

    const toggleRow = (rowId) => {
        const isRowExpanded = expandedRows.includes(rowId);
        let updatedRows = [];
        if (isRowExpanded) {
            updatedRows = expandedRows.filter((id) => id !== rowId);
        } else {
            updatedRows = [...expandedRows, rowId];
        }
        setExpandedRows(updatedRows);
    };

    const isRowExpanded = (rowId) => {
        return expandedRows.includes(rowId);
    };

    // Duyệt kế hoạch
    const handleNopKeHoach = async (khID) => {
        const token = localStorage.getItem('Token');
        const data = { kh_ids: khID };

        const response = await axiosClient.post('/nop_KeHoach', data, {
            params: { token: token },
        });

        if (response.status === 200) {
            window.location.reload();
            cogoToast.success(`Kế hoạch đã được nộp`, {
                position: 'top-right',
            });
        }
    };

    // Duyệt kế hoạch
    const handleDuyetKeHoach = async (khID) => {
        const token = localStorage.getItem('Token');
        const data = [{ kh_ids: khID, kh_trangthai: '2' }];

        const response = await axiosClient.post('/duyet_KeHoach', data, {
            params: { token: token },
        });

        if (response.status === 200) {
            window.location.reload();
            cogoToast.success(`Kế hoạch đã được duyệt`, {
                position: 'top-right',
            });
        }
    };

    // Từ chối kế hoạch
    const handleTuChoiKeHoach = async (khID) => {
        const token = localStorage.getItem('Token');
        const data = [{ kh_ids: khID, kh_trangthai: '5' }];

        const response = await axiosClient.post('/duyet_KeHoach', data, {
            params: { token: token },
        });

        if (response.status === 200) {
            window.location.reload();
            cogoToast.success(`Kế hoạch đã từ chối`, {
                position: 'top-right',
            });
        }
    };

    // Thêm kế hoạch
    const [newRows, setNewRows] = useState([]);

    const handleNewInputChange = (event, index) => {
        const { name, value } = event.target;
        setNewRows((prevRows) =>
            prevRows.map((row, i) => (i === index ? { ...row, [name]: value } : row)),
        );
    };

    const handleAddNewRow = () => {
        const newRow = {
            kh_ten: '',
            kh_loaikehoach: '' || 'Kế Hoạch Tháng',
            kh_thgianbatdau: '' || new Date().toISOString().substr(0, 10),
            kh_thgianketthuc: '',
            kh_stt: '1',
            kh_tongthgian: '0',
        };
        setNewRows((prevRows) => [...prevRows, newRow]);
    };

    const handleCancelNewRows = (index) => {
        setNewRows((prevRows) => prevRows.filter((_, i) => i !== index));
    };

    const handleThemKeHoach = async (e) => {
        e.preventDefault();

        const { kh_ten, kh_loaikehoach, kh_thgianbatdau, kh_thgianketthuc, kh_stt, kh_tongthgian } =
            newRows[0];

        const token = localStorage.getItem('Token');
        const response = await axiosClient.post(`/create_KeHoach?token=${token}`, {
            kh_ten,
            kh_loaikehoach,
            kh_thgianbatdau,
            kh_thgianketthuc,
            kh_stt,
            kh_tongthgian,
        });

        if (response.status === 200) {
            window.location.reload();
            cogoToast.success('Kế hoạch đã được thêm', {
                position: 'top-right',
            });
        }
    };

    // Chỉnh sửa kế hoạch
    const [chinhSuaKeHoach, setChinhSuaKeHoach] = useState([]);

    const handleChinhSuaKeHoach = (id) => {
        const newData = displayedKeHoach.map((row) =>
            row.kh_id === id ? { ...row, isEdit: true } : row,
        );
        setDisplayedKeHoach(newData);
    };

    const handleEditInputChange = (event, id, name) => {
        const { value } = event.target;

        let newData;
        const changedItem = { kh_id: id, [name]: value };
        const existingItemIndex = chinhSuaKeHoach.findIndex((item) => item.kh_id === id);

        if (existingItemIndex !== -1) {
            const updatedData = [...chinhSuaKeHoach];
            updatedData[existingItemIndex] = {
                ...updatedData[existingItemIndex],
                ...changedItem,
            };
            setChinhSuaKeHoach(updatedData);
        } else {
            setChinhSuaKeHoach([...chinhSuaKeHoach, changedItem]);
        }

        newData = displayedKeHoach.map((row) =>
            row.kh_id === id ? { ...row, [name]: value } : row,
        );
        setDisplayedKeHoach(newData);
    };

    const handleCancelEdit = (id) => {
        const newData = displayedKeHoach.map((row) => {
            if (row.kh_id === id) {
                const originalRow = displayedKeHoach.find((r) => r.kh_id === id);
                return { ...originalRow, isEdit: false };
            }
            return row;
        });
        setDisplayedKeHoach(newData);

        const updatedEditedData = chinhSuaKeHoach.filter((row) => row.kh_id !== id);
        setChinhSuaKeHoach(updatedEditedData);
    };

    const handleSaveChinhSuaCongViec = async (e) => {
        e.preventDefault();

        const kehoach = [];

        for (let kh of chinhSuaKeHoach) {
            const { kh_id, kh_ten, kh_loaikehoach, nv_id, dv_id } = kh;
            kehoach.push({
                kh_id,
                kh_ten,
                kh_loaikehoach,
                nv_id,
                dv_id,
            });
        }

        const token = localStorage.getItem('Token');

        const response = await axiosClient.put(`/update_KeHoach?token=${token}`, {
            kehoach,
        });

        if (response.status === 200) {
            window.location.reload();
            cogoToast.success(`Công việc đã được cập nhật`, {
                position: 'top-right',
            });
        }
    };

    return (
        <>
            {infoUser.nv_quyenthamdinh !== '0' ? (
                <>
                    <div className={cx('wrapper')}>
                        <div className={cx('title')}>
                            <div className={cx('work-list')}>
                                <Link to="/qlcv/congviec">
                                    <FontAwesomeIcon icon={faList} /> Danh sách công việc
                                </Link>
                            </div>
                            <h2>Kế Hoạch</h2>
                        </div>
                        <div className={cx('features')}>
                            <div className={cx('filter')}>
                                <div className={cx('filter-item')}>
                                    <input
                                        type="search"
                                        required
                                        value={searchText}
                                        onChange={handleSearchInputChange}
                                    />
                                    <div className={cx('label')}>Tên kế hoạch</div>
                                </div>
                                <div className={cx('filter-item')}>
                                    <select value={filterType} onChange={handleFilterType}>
                                        <option value="">Tất cả</option>
                                        <option value="Kế Hoạch Tháng">Kế Hoạch Tháng</option>
                                        <option value="Kế Hoạch Quý">Kế Hoạch Quý</option>
                                        <option value="Kế Hoạch Năm">Kế Hoạch Năm</option>
                                        <option value="Kế Hoạch Đột Xuất">Kế Hoạch Đột Xuất</option>
                                    </select>
                                    <div className={cx('label')}>Loại kế hoạch</div>
                                </div>
                                <div className={cx('filter-item')}>
                                    <select value={filterName} onChange={handleFilterName}>
                                        <option value="">Tất cả</option>
                                        {dSNhanVien.map((nv) => (
                                            <option key={nv.nv_id} value={nv.nv_ten}>
                                                {nv.nv_ten}
                                            </option>
                                        ))}
                                    </select>
                                    <div className={cx('label', 'name')}>Người lập</div>
                                </div>
                                <div className={cx('filter-item')}>
                                    <input
                                        type="date"
                                        required
                                        value={filterDateStart}
                                        onChange={handleFilterDateStart}
                                    />
                                    <div className={cx('label', 'date-start')}>
                                        Thời gian bắt đầu
                                    </div>
                                </div>
                                <div className={cx('filter-item')}>
                                    <input type="date" required />
                                    <div className={cx('label', 'date-end')}>Hạn hoàn thành</div>
                                </div>
                                <div className={cx('filter-item')}>
                                    <select value={filterState} onChange={handleFilterState}>
                                        <option value="">Tất cả</option>
                                        <option value="0">Đang soạn</option>
                                        <option value="1">Chờ duyệt</option>
                                        <option value="2">Đang thực hiện</option>
                                        <option value="3">Hoàn thành</option>
                                        <option value="4">Quá hạn</option>
                                        <option value="5">Từ chối</option>
                                    </select>
                                    <div className={cx('label', 'name')}>Trạng thái</div>
                                </div>
                            </div>
                            <div className={cx('handle-features')}>
                                <button className={cx('reset-btn')} onClick={handleReset}>
                                    <FontAwesomeIcon icon={faRotateRight} /> Reset
                                </button>
                                <div>
                                    {infoUser.nv_quyen !== 'ld' && (
                                        <button className={cx('add-btn')} onClick={handleAddNewRow}>
                                            <FontAwesomeIcon icon={faPlus} /> Thêm hàng
                                        </button>
                                    )}

                                    {newRows.length > 0 && (
                                        <button
                                            className={cx('save-btn')}
                                            onClick={handleThemKeHoach}
                                        >
                                            <FontAwesomeIcon icon={faSave} /> Lưu
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className={cx('inner')}>
                            {displayedKeHoach.length > 0 ? (
                                <>
                                    <table className={cx('table')}>
                                        <thead>
                                            <tr>
                                                <th></th>
                                                <th>STT</th>
                                                <th onClick={() => handleSortColumn('kh_ten')}>
                                                    <span>Tên kế hoạch</span>
                                                    {sortColumn === 'kh_ten' && (
                                                        <FontAwesomeIcon
                                                            icon={
                                                                sortDirection === 'asc'
                                                                    ? faArrowUp
                                                                    : faArrowDown
                                                            }
                                                            className={cx('icon')}
                                                        />
                                                    )}
                                                </th>
                                                <th
                                                    onClick={() =>
                                                        handleSortColumn('kh_loaikehoach')
                                                    }
                                                >
                                                    <span>Loại kế hoạch</span>
                                                    {sortColumn === 'kh_loaikehoach' && (
                                                        <FontAwesomeIcon
                                                            icon={
                                                                sortDirection === 'asc'
                                                                    ? faArrowUp
                                                                    : faArrowDown
                                                            }
                                                            className={cx('icon')}
                                                        />
                                                    )}
                                                </th>
                                                <th
                                                    onClick={() =>
                                                        handleSortColumn('kh_thgianbatdau')
                                                    }
                                                >
                                                    <span>Thời gian bắt đầu</span>
                                                    {sortColumn === 'kh_thgianbatdau' && (
                                                        <FontAwesomeIcon
                                                            icon={
                                                                sortDirection === 'asc'
                                                                    ? faArrowUp
                                                                    : faArrowDown
                                                            }
                                                            className={cx('icon')}
                                                        />
                                                    )}
                                                </th>
                                                <th
                                                    onClick={() =>
                                                        handleSortColumn('kh_thgianketthuc')
                                                    }
                                                >
                                                    <span>Thời gian hết hạn</span>
                                                    {sortColumn === 'kh_thgianketthuc' && (
                                                        <FontAwesomeIcon
                                                            icon={
                                                                sortDirection === 'asc'
                                                                    ? faArrowUp
                                                                    : faArrowDown
                                                            }
                                                            className={cx('icon')}
                                                        />
                                                    )}
                                                </th>
                                                <th>Người lập</th>
                                                <th>Đơn vị</th>
                                                <th className={cx('center')}>Trạng thái</th>
                                                <th className={cx('center')}>Xử lý</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {newRows.map((newRow, index) => (
                                                <tr key={index}>
                                                    <td></td>
                                                    <td>{index + 1}</td>
                                                    <td>
                                                        <input
                                                            type="text"
                                                            name="kh_ten"
                                                            value={newRow.kh_ten}
                                                            onChange={(e) =>
                                                                handleNewInputChange(e, index)
                                                            }
                                                        />
                                                    </td>
                                                    <td>
                                                        <select
                                                            name="kh_loaikehoach"
                                                            value={newRow.kh_loaikehoach}
                                                            onChange={(e) =>
                                                                handleNewInputChange(e, index)
                                                            }
                                                        >
                                                            <option value="Kế Hoạch Tháng">
                                                                Kế Hoạch Tháng
                                                            </option>
                                                            <option value="Kế Hoạch Quý">
                                                                Kế Hoạch Quý
                                                            </option>
                                                            <option value="Kế Hoạch Năm">
                                                                Kế Hoạch Năm
                                                            </option>
                                                        </select>
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="date"
                                                            name="kh_thgianbatdau"
                                                            value={
                                                                newRow.kh_thgianbatdau ||
                                                                new Date()
                                                                    .toISOString()
                                                                    .substr(0, 10)
                                                            }
                                                            onChange={(e) =>
                                                                handleNewInputChange(e, index)
                                                            }
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="date"
                                                            name="kh_thgianketthuc"
                                                            value={newRow.kh_thgianketthuc}
                                                            onChange={(e) =>
                                                                handleNewInputChange(e, index)
                                                            }
                                                        />
                                                    </td>
                                                    <td>{infoUser.nv_ten}</td>
                                                    <td>{infoUser.don_vi.dv_ten}</td>
                                                    <td className={cx('center')}>
                                                        {trangThai('0')}
                                                    </td>
                                                    <td className={cx('center')}>
                                                        <Tippy content="Hủy" placement="bottom">
                                                            <button
                                                                className={cx(
                                                                    'handle',
                                                                    'cancle-btn',
                                                                )}
                                                                onClick={() =>
                                                                    handleCancelNewRows(index)
                                                                }
                                                            >
                                                                <FontAwesomeIcon
                                                                    icon={faCircleMinus}
                                                                />
                                                            </button>
                                                        </Tippy>
                                                    </td>
                                                </tr>
                                            ))}
                                            {displayedKeHoach.map((kh, index) => (
                                                <Fragment key={kh.kh_id}>
                                                    <tr>
                                                        {kh.isEdit ? (
                                                            <>
                                                                <td></td>
                                                                <td>
                                                                    {index +
                                                                        1 +
                                                                        currentPage * PER_PAGE}
                                                                </td>
                                                                <td>
                                                                    {infoUser.nv_quyen === 'ld' ? (
                                                                        kh.kh_ten
                                                                    ) : (
                                                                        <input
                                                                            name="kh_ten"
                                                                            value={kh.kh_ten}
                                                                            onChange={(e) =>
                                                                                handleEditInputChange(
                                                                                    e,
                                                                                    kh.kh_id,
                                                                                    'kh_ten',
                                                                                )
                                                                            }
                                                                        />
                                                                    )}
                                                                </td>
                                                                <td>
                                                                    {infoUser.nv_quyen === 'ld' ? (
                                                                        kh.kh_loaikehoach
                                                                    ) : (
                                                                        <select
                                                                            name="kh_loaikehoach"
                                                                            value={
                                                                                kh.kh_loaikehoach
                                                                            }
                                                                            onChange={(e) =>
                                                                                handleEditInputChange(
                                                                                    e,
                                                                                    kh.kh_id,
                                                                                    'kh_loaikehoach',
                                                                                )
                                                                            }
                                                                        >
                                                                            <option value="Kế Hoạch Tháng">
                                                                                Kế Hoạch Tháng
                                                                            </option>
                                                                            <option value="Kế Hoạch Quý">
                                                                                Kế Hoạch Quý
                                                                            </option>
                                                                            <option value="Kế Hoạch Năm">
                                                                                Kế Hoạch Năm
                                                                            </option>
                                                                        </select>
                                                                    )}
                                                                </td>
                                                                <td>
                                                                    {infoUser.nv_quyen === 'ld' ? (
                                                                        kh.kh_thgianbatdau
                                                                    ) : (
                                                                        <input
                                                                            name="kh_thgianbatdau"
                                                                            value={
                                                                                kh.kh_thgianbatdau
                                                                            }
                                                                            onChange={(e) =>
                                                                                handleEditInputChange(
                                                                                    e,
                                                                                    kh.kh_id,
                                                                                    'kh_thgianbatdau',
                                                                                )
                                                                            }
                                                                        />
                                                                    )}
                                                                </td>
                                                                <td>
                                                                    {infoUser.nv_quyen === 'ld' ? (
                                                                        kh.kh_thgianketthuc
                                                                    ) : (
                                                                        <input
                                                                            name="kh_thgianketthuc"
                                                                            value={
                                                                                kh.kh_thgianketthuc
                                                                            }
                                                                            onChange={(e) =>
                                                                                handleEditInputChange(
                                                                                    e,
                                                                                    kh.kh_id,
                                                                                    'kh_thgianketthuc',
                                                                                )
                                                                            }
                                                                        />
                                                                    )}
                                                                </td>
                                                                <td>
                                                                    {infoUser.nv_quyen === 'ld' ? (
                                                                        <select
                                                                            name="nv_id"
                                                                            value={kh.nv_id}
                                                                            onChange={(e) =>
                                                                                handleEditInputChange(
                                                                                    e,
                                                                                    kh.kh_id,
                                                                                    'nv_id',
                                                                                )
                                                                            }
                                                                        >
                                                                            <option
                                                                                value={
                                                                                    kh.nhan_vien
                                                                                        ?.nv_id
                                                                                }
                                                                            >
                                                                                {
                                                                                    kh.nhan_vien
                                                                                        ?.nv_ten
                                                                                }
                                                                            </option>
                                                                            {dSNhanVien.map(
                                                                                (nv) => (
                                                                                    <option
                                                                                        key={
                                                                                            nv.nv_id
                                                                                        }
                                                                                        value={
                                                                                            nv.nv_id
                                                                                        }
                                                                                    >
                                                                                        {nv.nv_ten}
                                                                                    </option>
                                                                                ),
                                                                            )}
                                                                        </select>
                                                                    ) : (
                                                                        <>{kh.nv_id}</>
                                                                    )}
                                                                </td>
                                                                <td>
                                                                    {infoUser.nv_quyen === 'ld' ? (
                                                                        <select
                                                                            name="dv_id"
                                                                            value={kh.dv_id}
                                                                            onChange={(e) =>
                                                                                handleEditInputChange(
                                                                                    e,
                                                                                    kh.kh_id,
                                                                                    'dv_id',
                                                                                )
                                                                            }
                                                                        >
                                                                            <option
                                                                                value={
                                                                                    kh.don_vi?.dv_id
                                                                                }
                                                                            >
                                                                                {kh.don_vi?.dv_ten}
                                                                            </option>
                                                                            {dSDonVi.map((dv) => (
                                                                                <option
                                                                                    key={dv.dv_id}
                                                                                    value={dv.dv_id}
                                                                                >
                                                                                    {dv.dv_ten}
                                                                                </option>
                                                                            ))}
                                                                        </select>
                                                                    ) : (
                                                                        <>{kh.dv_id}</>
                                                                    )}
                                                                </td>

                                                                <td>
                                                                    {trangThai(kh.kh_trangthai)}
                                                                </td>
                                                                <td className={cx('center')}>
                                                                    <Tippy
                                                                        content="Lưu"
                                                                        placement="bottom"
                                                                    >
                                                                        <button
                                                                            className={cx(
                                                                                'handle',
                                                                                'save-btn',
                                                                            )}
                                                                            onClick={
                                                                                handleSaveChinhSuaCongViec
                                                                            }
                                                                        >
                                                                            <FontAwesomeIcon
                                                                                icon={faSave}
                                                                            />
                                                                        </button>
                                                                    </Tippy>
                                                                    <Tippy
                                                                        content="Hủy"
                                                                        placement="bottom"
                                                                    >
                                                                        <button
                                                                            className={cx(
                                                                                'handle',
                                                                                'cancle-btn',
                                                                            )}
                                                                            onClick={() =>
                                                                                handleCancelEdit(
                                                                                    kh.kh_id,
                                                                                )
                                                                            }
                                                                        >
                                                                            <FontAwesomeIcon
                                                                                icon={faMinusCircle}
                                                                            />
                                                                        </button>
                                                                    </Tippy>
                                                                </td>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <td
                                                                    className={`${
                                                                        isRowExpanded(kh.kh_id)
                                                                            ? 'expanded'
                                                                            : ''
                                                                    }`}
                                                                    onClick={() =>
                                                                        toggleRow(kh.kh_id)
                                                                    }
                                                                >
                                                                    {kh.cong_viecs.length > 0 && (
                                                                        <FontAwesomeIcon
                                                                            style={{
                                                                                cursor: 'pointer',
                                                                            }}
                                                                            icon={
                                                                                isRowExpanded(
                                                                                    kh.kh_id,
                                                                                )
                                                                                    ? faChevronDown
                                                                                    : faChevronRight
                                                                            }
                                                                        />
                                                                    )}
                                                                </td>
                                                                <td>
                                                                    {index +
                                                                        1 +
                                                                        currentPage * PER_PAGE}
                                                                </td>
                                                                <td>{kh.kh_ten}</td>
                                                                <td>{kh.kh_loaikehoach}</td>
                                                                <td>
                                                                    {
                                                                        kh.kh_thgianbatdau.split(
                                                                            ' ',
                                                                        )[0]
                                                                    }
                                                                </td>
                                                                <td>
                                                                    {
                                                                        kh.kh_thgianketthuc.split(
                                                                            ' ',
                                                                        )[0]
                                                                    }
                                                                </td>
                                                                <td>{kh.nhan_vien?.nv_ten}</td>
                                                                <td>{kh.don_vi?.dv_ten}</td>
                                                                <td className={cx('center')}>
                                                                    {trangThai(kh.kh_trangthai)}
                                                                </td>
                                                                <td className={cx('center')}>
                                                                    {kh.kh_trangthai === '0' && (
                                                                        <Tippy
                                                                            content="Nộp kế hoạch"
                                                                            placement="bottom"
                                                                        >
                                                                            <button
                                                                                className={cx(
                                                                                    'handle',
                                                                                    'send',
                                                                                )}
                                                                                onClick={() =>
                                                                                    handleNopKeHoach(
                                                                                        kh.kh_id,
                                                                                    )
                                                                                }
                                                                            >
                                                                                <FontAwesomeIcon
                                                                                    icon={
                                                                                        faPaperPlane
                                                                                    }
                                                                                />
                                                                            </button>
                                                                        </Tippy>
                                                                    )}
                                                                    {infoUser.nv_quyen === 'ld' &&
                                                                        kh.kh_trangthai === '1' && (
                                                                            <>
                                                                                <Tippy
                                                                                    content="Duyệt kế hoạch"
                                                                                    placement="bottom"
                                                                                >
                                                                                    <button
                                                                                        className={cx(
                                                                                            'handle',
                                                                                            'apply',
                                                                                        )}
                                                                                        onClick={() =>
                                                                                            handleDuyetKeHoach(
                                                                                                kh.kh_id,
                                                                                            )
                                                                                        }
                                                                                    >
                                                                                        <FontAwesomeIcon
                                                                                            icon={
                                                                                                faCheckCircle
                                                                                            }
                                                                                        />
                                                                                    </button>
                                                                                </Tippy>
                                                                                <Tippy
                                                                                    content="Từ chối kế hoạch"
                                                                                    placement="bottom"
                                                                                >
                                                                                    <button
                                                                                        className={cx(
                                                                                            'handle',
                                                                                            'refuse',
                                                                                        )}
                                                                                        onClick={() =>
                                                                                            handleTuChoiKeHoach(
                                                                                                kh.kh_id,
                                                                                            )
                                                                                        }
                                                                                    >
                                                                                        <FontAwesomeIcon
                                                                                            icon={
                                                                                                faXmarkCircle
                                                                                            }
                                                                                        />
                                                                                    </button>
                                                                                </Tippy>
                                                                            </>
                                                                        )}
                                                                    <Link
                                                                        to={`${kh.kh_id}/${kh.kh_ten}/${kh.nv_id}/${kh.kh_thgianbatdau}/${kh.kh_thgianketthuc}/${kh.kh_trangthai}/chitiet`}
                                                                    >
                                                                        <Tippy
                                                                            content="Xem chi tiết"
                                                                            placement="bottom"
                                                                        >
                                                                            <button
                                                                                className={cx(
                                                                                    'handle',
                                                                                    'view-btn',
                                                                                )}
                                                                            >
                                                                                <FontAwesomeIcon
                                                                                    icon={faEye}
                                                                                />
                                                                            </button>
                                                                        </Tippy>
                                                                    </Link>
                                                                    {((infoUser.nv_quyen === 'ld' &&
                                                                        (kh.kh_trangthai === '1' ||
                                                                            kh.kh_trangthai ===
                                                                                '2')) ||
                                                                        (infoUser.nv_quyen ===
                                                                            'nv' &&
                                                                            infoUser.nv_quyenthamdinh ===
                                                                                '1' &&
                                                                            kh.kh_trangthai ===
                                                                                '0')) && (
                                                                        <Tippy
                                                                            content="Chỉnh sửa"
                                                                            placement="bottom"
                                                                        >
                                                                            <button
                                                                                className={cx(
                                                                                    'handle',
                                                                                    'edit-btn',
                                                                                )}
                                                                                onClick={() =>
                                                                                    handleChinhSuaKeHoach(
                                                                                        kh.kh_id,
                                                                                    )
                                                                                }
                                                                            >
                                                                                <FontAwesomeIcon
                                                                                    icon={
                                                                                        faPenToSquare
                                                                                    }
                                                                                />
                                                                            </button>
                                                                        </Tippy>
                                                                    )}
                                                                    {kh.kh_trangthai === '0' && (
                                                                        <Tippy
                                                                            content="Xóa"
                                                                            placement="bottom"
                                                                        >
                                                                            <button
                                                                                className={cx(
                                                                                    'handle',
                                                                                    'delete-btn',
                                                                                )}
                                                                                onClick={() =>
                                                                                    handleXoaKH(kh)
                                                                                }
                                                                            >
                                                                                <FontAwesomeIcon
                                                                                    icon={faTrash}
                                                                                />
                                                                            </button>
                                                                        </Tippy>
                                                                    )}
                                                                </td>
                                                            </>
                                                        )}
                                                    </tr>
                                                    {isRowExpanded(kh.kh_id) &&
                                                        kh.cong_viecs.length > 0 && (
                                                            <tr className={cx('tb')}>
                                                                <td colSpan="13">
                                                                    <table
                                                                        className={cx(
                                                                            'table-child',
                                                                        )}
                                                                    >
                                                                        <thead>
                                                                            <tr>
                                                                                <th>STT</th>
                                                                                <th>
                                                                                    Tên công việc
                                                                                </th>
                                                                                <th>
                                                                                    Thời gian bắt
                                                                                    đầu
                                                                                </th>
                                                                                <th>
                                                                                    Hạn hoàn thành
                                                                                </th>
                                                                                <th>Nội dung</th>
                                                                                <th>
                                                                                    Người đảm nhiệm
                                                                                </th>
                                                                                <th>Đơn vị</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {kh.cong_viecs.map(
                                                                                (cv, index) => (
                                                                                    <tr
                                                                                        key={
                                                                                            cv.cv_id
                                                                                        }
                                                                                    >
                                                                                        <td>
                                                                                            {index +
                                                                                                1}
                                                                                        </td>
                                                                                        <td>
                                                                                            {
                                                                                                cv.cv_ten
                                                                                            }
                                                                                        </td>
                                                                                        <td>
                                                                                            {cv.cv_thgianbatdau.split(
                                                                                                ' ',
                                                                                            )[0] ||
                                                                                                '-'}
                                                                                        </td>
                                                                                        <td>
                                                                                            {
                                                                                                cv.cv_thgianhoanthanh
                                                                                            }
                                                                                        </td>
                                                                                        <td>
                                                                                            {
                                                                                                cv.cv_noidung
                                                                                            }
                                                                                        </td>
                                                                                        <td>
                                                                                            {
                                                                                                cv.nv_id_lam
                                                                                            }
                                                                                        </td>
                                                                                        <td>
                                                                                            {
                                                                                                cv
                                                                                                    .don_vi
                                                                                                    ?.dv_ten
                                                                                            }
                                                                                        </td>
                                                                                    </tr>
                                                                                ),
                                                                            )}
                                                                        </tbody>
                                                                    </table>
                                                                </td>
                                                            </tr>
                                                        )}
                                                </Fragment>
                                            ))}
                                        </tbody>
                                    </table>
                                    {sortedKeHoach.length > PER_PAGE && (
                                        <div className={cx('paginate')}>
                                            {startIndex}-{endIndex} của {total}
                                            <ReactPaginate
                                                previousLabel={
                                                    <FontAwesomeIcon icon={faAnglesLeft} />
                                                }
                                                nextLabel={<FontAwesomeIcon icon={faAnglesRight} />}
                                                breakLabel={'...'}
                                                pageCount={totalPage}
                                                marginPagesDisplayed={1}
                                                pageRangeDisplayed={2}
                                                onPageChange={handlePageClick}
                                                containerClassName={cx('pagination')}
                                                activeClassName={cx('active')}
                                            />
                                        </div>
                                    )}
                                </>
                            ) : (
                                <p className={cx('no-result')}>Không có kết quả tìm kiếm</p>
                            )}
                        </div>
                    </div>
                    <CongViecDotXuat />
                </>
            ) : (
                <KeHoachThang />
            )}
        </>
    );
}

export default KeHoach;
