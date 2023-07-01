import { useState, useEffect, useMemo, useCallback, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faSearch,
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
} from '@fortawesome/free-solid-svg-icons';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import swal from 'sweetalert';
import ReactPaginate from 'react-paginate';
import axiosClient from '~/api/axiosClient';
import classNames from 'classnames/bind';
import styles from './KeHoach.module.scss';
import CongViecDotXuat from './CongViecDotXuat/CongViecDotXuat';
import cogoToast from 'cogo-toast';
import KeHoachThang from './KeHoachThang/KeHoachThang';

const cx = classNames.bind(styles);

function KeHoach() {
    const [dSKeHoach, setDSKeHoach] = useState([]);
    const [sortColumn, setSortColumn] = useState('');
    const [sortDirection, setSortDirection] = useState('');
    const [searchText, setSearchText] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [dSNhanVien, setDSNhanVien] = useState([]);
    const [dSDonVi, setDSDonVi] = useState([]);
    const [infoUser, setInfoUser] = useState([]);

    const PER_PAGE = 10;

    useEffect(() => {
        const getListProduct = async () => {
            const token = localStorage.getItem('Token');
            const response = await axiosClient.get(`/get_CV_KeHoach?token=${token}`);
            setDSKeHoach(response.data.ke_hoachs || []);
        };
        getListProduct();
    }, []);

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
                return <button className={cx('b1')}>Đợi duyệt</button>;
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
        const filteredKeHoach = sortedKeHoach.filter((kh) =>
            kh.kh_ten.toLowerCase().includes(searchText.toLowerCase()),
        );
        const startIndex = currentPage * PER_PAGE;
        return filteredKeHoach.slice(startIndex, startIndex + PER_PAGE) || [];
    }, [sortedKeHoach, searchText, currentPage]);

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
    const displayedKeHoach = getDisplayKeHoach();

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
            cogoToast.success(`Kế hoạch đã được từ chối`, {
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
            kh_loaikehoach: '',
            kh_thgianbatdau: '' || new Date().toISOString().substr(0, 10),
            kh_hanhoanthanh: '',
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
            newRows;
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

    return (
        <>
            {infoUser.nv_quyen !== 'nv' ? (
                <>
                    <div className={cx('wrapper')}>
                        <div className={cx('inner')}>
                            <div className={cx('title')}>
                                <div className={cx('work-list')}>
                                    <Link to="/qlcv/congviec">
                                        <FontAwesomeIcon icon={faList} /> Danh sách công việc
                                    </Link>
                                </div>
                                <h2>Kế Hoạch</h2>
                            </div>
                            <div className={cx('features')}>
                                <div className={cx('search')}>
                                    <input
                                        type="search"
                                        placeholder="Tìm kiếm kế hoạch"
                                        value={searchText}
                                        onChange={handleSearchInputChange}
                                    />
                                    <FontAwesomeIcon icon={faSearch} />
                                </div>
                                <div>
                                    <button className={cx('add-btn')} onClick={handleAddNewRow}>
                                        <FontAwesomeIcon icon={faPlus} /> Thêm hàng
                                    </button>
                                    <button className={cx('save-btn')} onClick={handleThemKeHoach}>
                                        <FontAwesomeIcon icon={faSave} /> Lưu
                                    </button>
                                </div>
                            </div>
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
                                                <th>Trạng thái</th>
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
                                                            value={newRow.cv_ten}
                                                            onChange={(e) =>
                                                                handleNewInputChange(e, index)
                                                            }
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="text"
                                                            name="kh_loaikehoach"
                                                            value={newRow.kh_loaikehoach}
                                                            onChange={(e) =>
                                                                handleNewInputChange(e, index)
                                                            }
                                                        />
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
                                                            name="kh_hanhoanthanh"
                                                            value={newRow.kh_hanhoanthanh}
                                                            onChange={(e) =>
                                                                handleNewInputChange(e, index)
                                                            }
                                                        />
                                                    </td>
                                                    <td>
                                                        <select
                                                            name="nv_id_lam"
                                                            value={newRow.nv_id_lam}
                                                            onChange={(e) =>
                                                                handleNewInputChange(e, index)
                                                            }
                                                        >
                                                            <option value="" disabled>
                                                                -- Chọn nhân viên --
                                                            </option>
                                                            {dSNhanVien.map((nv) => (
                                                                <option
                                                                    key={nv.nv_id}
                                                                    value={nv.nv_id}
                                                                >
                                                                    {nv.nv_ten}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </td>
                                                    <td>
                                                        <select
                                                            name="dv_id"
                                                            value={newRow.dv_id}
                                                            onChange={(e) =>
                                                                handleNewInputChange(e, index)
                                                            }
                                                        >
                                                            <option value="" disabled>
                                                                -- Chọn đơn vị --
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
                                                    </td>
                                                    <td>{trangThai('0')}</td>
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
                                                    <tr
                                                        className={`${
                                                            isRowExpanded(kh.kh_id)
                                                                ? 'expanded'
                                                                : ''
                                                        }`}
                                                        onClick={() => toggleRow(kh.kh_id)}
                                                    >
                                                        <td>
                                                            {kh.cong_viecs.length > 0 && (
                                                                <FontAwesomeIcon
                                                                    style={{ cursor: 'pointer' }}
                                                                    icon={
                                                                        isRowExpanded(kh.kh_id)
                                                                            ? faChevronDown
                                                                            : faChevronRight
                                                                    }
                                                                />
                                                            )}
                                                        </td>
                                                        <td>
                                                            {index + 1 + currentPage * PER_PAGE}
                                                        </td>
                                                        <td>{kh.kh_ten}</td>
                                                        <td>{kh.kh_loaikehoach}</td>
                                                        <td>{kh.kh_thgianbatdau.split(' ')[0]}</td>
                                                        <td>{kh.kh_thgianketthuc.split(' ')[0]}</td>
                                                        <td>{kh.nhan_vien?.nv_ten}</td>
                                                        <td>{kh.don_vi?.dv_ten}</td>
                                                        <td>{trangThai(kh.kh_trangthai)}</td>
                                                        <td className={cx('center')}>
                                                            {kh.kh_trangthai === '1' && (
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
                                                                                icon={faCheckCircle}
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
                                                                                icon={faXmarkCircle}
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
                                                            {(kh.kh_trangthai === '0' ||
                                                                kh.kh_trangthai === '1' ||
                                                                kh.kh_trangthai === '2') && (
                                                                <Link
                                                                    to={`${kh.kh_id}/${kh.kh_ten}/${kh.kh_thgianbatdau}/${kh.kh_thgianketthuc}/${kh.kh_tongthgian}/${kh.kh_stt}/chinhsua`}
                                                                >
                                                                    <Tippy
                                                                        content="Chỉnh sửa"
                                                                        placement="bottom"
                                                                    >
                                                                        <button
                                                                            className={cx(
                                                                                'handle',
                                                                                'edit-btn',
                                                                            )}
                                                                        >
                                                                            <FontAwesomeIcon
                                                                                icon={faPenToSquare}
                                                                            />
                                                                        </button>
                                                                    </Tippy>
                                                                </Link>
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
                    <CongViecDotXuat></CongViecDotXuat>
                </>
            ) : (
                <KeHoachThang />
            )}
        </>
    );
}

export default KeHoach;
