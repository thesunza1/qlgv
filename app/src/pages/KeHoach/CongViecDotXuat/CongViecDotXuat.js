import { useState, useEffect, useMemo, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faPlus,
    faPenToSquare,
    faTrash,
    faAnglesLeft,
    faAnglesRight,
    faArrowUp,
    faArrowDown,
    faCircleMinus,
    faSave,
    faMinusCircle,
    faXmarkCircle,
} from '@fortawesome/free-solid-svg-icons';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import axiosClient from '~/api/axiosClient';
import ReactPaginate from 'react-paginate';
import classNames from 'classnames/bind';
import styles from './CongViecDX.module.scss';
import cogoToast from 'cogo-toast';
import swal from 'sweetalert';

const cx = classNames.bind(styles);

function BangCongViec() {
    const [dSCongViec, setDSCongViec] = useState([]);
    const [sortColumn, setSortColumn] = useState('');
    const [sortDirection, setSortDirection] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [dSNhanVien, setDSNhanVien] = useState([]);
    const [dSDonVi, setDSDonVi] = useState([]);
    const [listCongViec, setListCongViec] = useState([]);
    const [displayedCongViec, setDisplayedCongViec] = useState([]);
    const [infoUser, setInfoUser] = useState([]);

    const PER_PAGE = 10;

    useEffect(() => {
        const getListCongViec = async () => {
            const token = localStorage.getItem('Token');
            const response = await axiosClient.get(`/get_CV_DotXuat?token=${token}`, {});
            setListCongViec(response.data.danh_sach_cv_dot_xuat);
        };
        getListCongViec();
    }, []);

    useEffect(() => {
        setDSCongViec(
            listCongViec.map((cv) => ({
                ...cv,
                isEdit: false,
            })),
        );
    }, [listCongViec]);

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
            case '5':
                return <button className={cx('b4')}>Từ chối</button>;
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

    const sortedCongViec = useMemo(() => {
        let sortedItems = [...dSCongViec];
        sortedItems = sortedItems.sort((a, b) =>
            a[sortColumn] > b[sortColumn] ? 1 : b[sortColumn] > a[sortColumn] ? -1 : 0,
        );
        if (sortDirection === 'asc') {
            sortedItems.reverse();
        }
        sortedItems = sortedItems.sort((a, b) => {
            const cvTrangThaiOrder = { 0: 0, 1: 1, 2: 3, 3: 4, 4: 2 };
            const aOrder = cvTrangThaiOrder[a.cv_trangthai] ?? 999;
            const bOrder = cvTrangThaiOrder[b.cv_trangthai] ?? 999;
            return aOrder - bOrder;
        });

        return sortedItems;
    }, [dSCongViec, sortColumn, sortDirection]);

    const getDisplayCongViec = useCallback(() => {
        let filteredCongViec = sortedCongViec;
        const startIndex = currentPage * PER_PAGE;
        return filteredCongViec.slice(startIndex, startIndex + PER_PAGE) || [];
    }, [sortedCongViec, currentPage]);

    useEffect(() => {
        const updatedDisplayedCongViec = getDisplayCongViec();
        setDisplayedCongViec(updatedDisplayedCongViec);
    }, [getDisplayCongViec]);

    const totalPage = Math.ceil(sortedCongViec.length / PER_PAGE);

    const handlePageClick = ({ selected: selectedPage }) => {
        setCurrentPage(selectedPage);
    };

    // Thêm công việc
    const [newRows, setNewRows] = useState([]);

    const handleNewInputChange = (event, index) => {
        const { name, value } = event.target;
        setNewRows((prevRows) =>
            prevRows.map((row, i) => (i === index ? { ...row, [name]: value } : row)),
        );
    };

    const handleAddNewRow = () => {
        const newRow = {
            cv_ten: '',
            cv_noidung: '',
            cv_thgianbatdau: '' || new Date().toISOString().substr(0, 10),
            cv_hanhoanthanh: '',
            nv_id_lam: '',
            dv_id: '',

            cv_cv_cha: '1',
            cv_trongso: '1',
            da_id: '1',
            n_cv_id: '1',
            lcv_id: '3',
        };
        setNewRows((prevRows) => [...prevRows, newRow]);
    };

    const handleCancelNewRows = (index) => {
        setNewRows((prevRows) => prevRows.filter((_, i) => i !== index));
    };

    const handleThemCongViec = async (e) => {
        e.preventDefault();

        const cong_viec = [];

        for (let cv of newRows) {
            const {
                cv_ten,
                cv_noidung,
                cv_thgianbatdau,
                cv_hanhoanthanh,
                nv_id_lam,
                dv_id,

                cv_cv_cha,
                cv_trongso,
                da_id,
                n_cv_id,
                lcv_id,
            } = cv;

            cong_viec.push({
                cv_ten,
                cv_noidung,
                cv_thgianbatdau,
                cv_hanhoanthanh,
                nv_id_lam,
                dv_id,

                cv_cv_cha,
                cv_trongso,
                da_id,
                n_cv_id,
                lcv_id,
            });
        }

        const token = localStorage.getItem('Token');

        const response = await axiosClient.post(`/add_CV_DotXuat?token=${token}`, {
            kh_id: 1,
            cong_viec,
        });

        if (response.status === 200) {
            cogoToast.success(`Công việc đột xuất đã được thêm`, {
                position: 'top-right',
            });
            window.location.reload();
        }
    };

    // Xóa công việc
    const handleXoaCongViec = (cv) => {
        swal({
            title: `Bạn chắc chắn muốn xóa công việc ${cv.cv_ten.toUpperCase()} này`,
            text: 'Sau khi xóa, bạn sẽ không thể khôi phục công việc này!',
            icon: 'warning',
            buttons: true,
            dangerMode: true,
        }).then(async (willDelete) => {
            if (willDelete) {
                const deletecv_ids = [cv.cv_id];
                await axiosClient.delete('/delete_CongViec', {
                    data: { deletecv_ids },
                });
                swal(`${cv.cv_ten.toUpperCase()} đã được xóa`, {
                    icon: 'success',
                });
                window.location.reload();
            } else {
                return;
            }
        });
    };

    // Sửa công việc
    const [chinhSuaCongViec, setChinhSuaCongViec] = useState([]);

    const handleEditInputChange = (event, id, name) => {
        const { value } = event.target;

        let newData;
        const changedItem = { cv_id: id, [name]: value };
        const existingItemIndex = chinhSuaCongViec.findIndex((item) => item.cv_id === id);

        if (existingItemIndex !== -1) {
            const updatedData = [...chinhSuaCongViec];
            updatedData[existingItemIndex] = {
                ...updatedData[existingItemIndex],
                ...changedItem,
            };
            setChinhSuaCongViec(updatedData);
        } else {
            setChinhSuaCongViec([...chinhSuaCongViec, changedItem]);
        }

        newData = displayedCongViec.map((row) =>
            row.cv_id === id ? { ...row, [name]: value } : row,
        );
        setDisplayedCongViec(newData);
    };

    const handleChinhSuaCongViec = (id) => {
        const newData = displayedCongViec.map((row) =>
            row.cv_id === id ? { ...row, isEdit: true } : row,
        );
        setDisplayedCongViec(newData);
    };

    const handleCancelEdit = (id) => {
        const newData = displayedCongViec.map((row) => {
            if (row.cv_id === id) {
                const originalRow = displayedCongViec.find((r) => r.cv_id === id);
                return { ...originalRow, isEdit: false };
            }
            return row;
        });
        setDisplayedCongViec(newData);

        const updatedEditedData = chinhSuaCongViec.filter((row) => row.cv_id !== id);
        setChinhSuaCongViec(updatedEditedData);
    };

    const handleSaveChinhSuaCongViec = async (e) => {
        e.preventDefault();

        const congviec = [];

        for (let bc of chinhSuaCongViec) {
            const {
                cv_ten,
                cv_noidung,
                cv_thgianbatdau,
                cv_hanhoanthanh,
                cv_id,
                dv_id,
                nv_id_lam,
            } = bc;
            congviec.push({
                cv_id,
                dv_id,
                nv_id_lam,
                cv_ten,
                cv_noidung,
                cv_thgianbatdau,
                cv_hanhoanthanh,
            });
        }

        const token = localStorage.getItem('Token');

        const response = await axiosClient.put(`/update_CongViec?token=${token}`, {
            congviec,
        });

        if (response.status === 200) {
            window.location.reload();
            cogoToast.success(`Công việc đã được cập nhật`, {
                position: 'top-right',
            });
        }
    };
    function convertDateFormat(dateString) {
        const parts = dateString.split('-');
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    // Từ chối công việc
    const handleTuChoiCongViec = async (cvID) => {
        const token = localStorage.getItem('Token');
        const data = [{ cv_ids: cvID, cv_trangthai: '5' }];

        const response = await axiosClient.post('/duyet_CongViec', data, {
            params: { token: token },
        });

        if (response.status === 200) {
            window.location.reload();
            cogoToast.success(`Công việc đã từ chối`, {
                position: 'top-right',
            });
        }
    };

    const startIndex = currentPage * PER_PAGE + 1;
    const endIndex =
        startIndex + displayedCongViec.length - 1 <= dSCongViec.length
            ? startIndex + displayedCongViec.length - 1
            : dSCongViec.length;
    const total = dSCongViec.length;

    return (
        <div className={cx('wrapper')}>
            <div className={cx('inner')}>
                <div className={cx('title')}>
                    <h2>Công Việc Đột Xuất</h2>
                </div>
                <div className={cx('features')}>
                    {infoUser.nv_quyen === 'ld' && (
                        <div className={cx('btn-group')}>
                            <button className={cx('add-btn')} onClick={handleAddNewRow}>
                                <FontAwesomeIcon icon={faPlus} /> Thêm hàng
                            </button>
                            <button className={cx('save-btn')}>
                                <FontAwesomeIcon icon={faSave} onClick={handleThemCongViec} /> Lưu
                            </button>
                        </div>
                    )}
                </div>
                <table className={cx('table')}>
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th onClick={() => handleSortColumn('dv_ten')}>
                                <span>Tên công việc</span>
                                {sortColumn === 'dv_ten' && (
                                    <FontAwesomeIcon
                                        icon={sortDirection === 'asc' ? faArrowUp : faArrowDown}
                                        className={cx('icon')}
                                    />
                                )}
                            </th>
                            <th>Mục đích</th>
                            <th>Thời gian bắt đầu</th>
                            <th>Hạn hoàn thành</th>
                            <th>Người đảm nhiệm</th>
                            <th>Đơn vị</th>
                            <th className={cx('center')}>Trạng thái</th>
                            <th className={cx('center')}>Xử lý</th>
                        </tr>
                    </thead>
                    <tbody>
                        {newRows.map((newRow, index) => (
                            <tr key={index}>
                                <td className={cx('center')}>{index + 1}</td>
                                <td>
                                    <input
                                        type="text"
                                        name="cv_ten"
                                        value={newRow.cv_ten}
                                        onChange={(e) => handleNewInputChange(e, index)}
                                    />
                                </td>
                                <td>
                                    <textarea
                                        name="cv_noidung"
                                        value={newRow.cv_noidung}
                                        onChange={(e) => handleNewInputChange(e, index)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="date"
                                        name="cv_thgianbatdau"
                                        value={
                                            newRow.cv_thgianbatdau ||
                                            new Date().toISOString().substr(0, 10)
                                        }
                                        onChange={(e) => handleNewInputChange(e, index)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="date"
                                        name="cv_hanhoanthanh"
                                        value={newRow.cv_hanhoanthanh}
                                        onChange={(e) => handleNewInputChange(e, index)}
                                    />
                                </td>
                                <td>
                                    <select
                                        name="nv_id_lam"
                                        value={newRow.nv_id_lam}
                                        onChange={(e) => handleNewInputChange(e, index)}
                                    >
                                        <option value="" disabled>
                                            -- Chọn nhân viên --
                                        </option>
                                        {dSNhanVien.map((nv) => (
                                            <option key={nv.nv_id} value={nv.nv_id}>
                                                {nv.nv_ten}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                                <td>
                                    <select
                                        name="dv_id"
                                        value={newRow.dv_id}
                                        onChange={(e) => handleNewInputChange(e, index)}
                                    >
                                        <option value="" disabled>
                                            -- Chọn đơn vị --
                                        </option>
                                        {dSDonVi.map((dv) => (
                                            <option key={dv.dv_id} value={dv.dv_id}>
                                                {dv.dv_ten}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                                <td className={cx('center')}>{trangThai('0')}</td>
                                <td>
                                    <Tippy content="Hủy" placement="bottom">
                                        <button
                                            className={cx('handle', 'cancle-btn')}
                                            onClick={() => handleCancelNewRows(index)}
                                        >
                                            <FontAwesomeIcon icon={faCircleMinus} />
                                        </button>
                                    </Tippy>
                                </td>
                            </tr>
                        ))}
                        {displayedCongViec.length > 0 ? (
                            <>
                                {displayedCongViec.map((cv, index) => (
                                    <tr key={cv.cv_id}>
                                        {cv.isEdit ? (
                                            <>
                                                <td className={cx('center')}>
                                                    {index + 1 + currentPage * PER_PAGE}
                                                </td>
                                                <td>
                                                    {infoUser.nv_quyen !== 'ld' ? (
                                                        cv.cv_ten
                                                    ) : (
                                                        <input
                                                            name="cv_ten"
                                                            value={cv.cv_ten}
                                                            onChange={(e) =>
                                                                handleEditInputChange(
                                                                    e,
                                                                    cv.cv_id,
                                                                    'cv_ten',
                                                                )
                                                            }
                                                        />
                                                    )}
                                                </td>
                                                <td>
                                                    {infoUser.nv_quyen !== 'ld' ? (
                                                        cv.cv_noidung
                                                    ) : (
                                                        <textarea
                                                            type="text"
                                                            name="cv_noidung"
                                                            value={cv.cv_noidung}
                                                            onChange={(e) =>
                                                                handleEditInputChange(
                                                                    e,
                                                                    cv.cv_id,
                                                                    'cv_noidung',
                                                                )
                                                            }
                                                        />
                                                    )}
                                                </td>
                                                <td>
                                                    {infoUser.nv_quyen !== 'ld' ? (
                                                        cv.cv_thgianbatdau
                                                    ) : (
                                                        <input
                                                            type="date"
                                                            name="cv_thgianbatdau"
                                                            value={convertDateFormat(
                                                                cv.cv_thgianbatdau,
                                                            )}
                                                            onChange={(e) =>
                                                                handleEditInputChange(
                                                                    e,
                                                                    cv.cv_id,
                                                                    'cv_thgianbatdau',
                                                                )
                                                            }
                                                        />
                                                    )}
                                                </td>
                                                <td>
                                                    {infoUser.nv_quyen !== 'ld' ? (
                                                        cv.cv_hanhoanthanh
                                                    ) : (
                                                        <input
                                                            type="date"
                                                            name="cv_hanhoanthanh"
                                                            value={cv.cv_hanhoanthanh}
                                                            onChange={(e) =>
                                                                handleEditInputChange(
                                                                    e,
                                                                    cv.cv_id,
                                                                    'cv_hanhoanthanh',
                                                                )
                                                            }
                                                        />
                                                    )}
                                                </td>
                                                <td>
                                                    <select
                                                        name="nv_id_lam"
                                                        value={cv.nhan_vien_lam?.nv_id}
                                                        onChange={(e) =>
                                                            handleEditInputChange(
                                                                e,
                                                                cv.cv_id,
                                                                'nv_id_lam',
                                                            )
                                                        }
                                                    >
                                                        <option value={cv.nhan_vien_lam?.nv_id}>
                                                            {cv.nhan_vien_lam?.nv_ten}
                                                        </option>
                                                        {dSNhanVien.map((nv) => (
                                                            <option key={nv.nv_id} value={nv.nv_id}>
                                                                {nv.nv_ten}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td>
                                                    <select
                                                        name="dv_id"
                                                        value={cv.don_vi?.dv_id}
                                                        onChange={(e) =>
                                                            handleEditInputChange(
                                                                e,
                                                                cv.cv_id,
                                                                'dv_id',
                                                            )
                                                        }
                                                    >
                                                        <option value={cv.nhan_vien_lam?.dv_id}>
                                                            {cv.nhan_vien_lam?.don_vi}
                                                        </option>
                                                        {dSDonVi.map((dv) => (
                                                            <option key={dv.dv_id} value={dv.dv_id}>
                                                                {dv.dv_ten}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td>{trangThai(cv.cv_trangthai)}</td>
                                                <td className={cx('center')}>
                                                    <Tippy content="Lưu" placement="bottom">
                                                        <button
                                                            className={cx('handle', 'save-btn')}
                                                            onClick={handleSaveChinhSuaCongViec}
                                                        >
                                                            <FontAwesomeIcon icon={faSave} />
                                                        </button>
                                                    </Tippy>
                                                    <Tippy content="Hủy" placement="bottom">
                                                        <button
                                                            className={cx('handle', 'cancle-btn')}
                                                            onClick={() =>
                                                                handleCancelEdit(cv.cv_id)
                                                            }
                                                        >
                                                            <FontAwesomeIcon icon={faMinusCircle} />
                                                        </button>
                                                    </Tippy>
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                <td className={cx('center')}>
                                                    {index + 1 + currentPage * PER_PAGE}
                                                </td>
                                                <td>{cv.cv_ten}</td>
                                                <td>{cv.cv_noidung}</td>
                                                <td>{cv.cv_thgianbatdau}</td>
                                                <td>{cv.cv_hanhoanthanh}</td>
                                                <td>{cv.nhan_vien_lam?.nv_ten || '--'}</td>
                                                <td>{cv.don_vi?.dv_ten}</td>
                                                <td className={cx('center')}>
                                                    {trangThai(cv.cv_trangthai)}
                                                </td>
                                                <td className={cx('center')}>
                                                    {infoUser.nv_quyen === 'ld' &&
                                                        cv.cv_trangthai === '1' && (
                                                            <Tippy
                                                                content="Từ chối công việc"
                                                                placement="bottom"
                                                            >
                                                                <button
                                                                    className={cx(
                                                                        'handle',
                                                                        'refuse',
                                                                    )}
                                                                    onClick={() =>
                                                                        handleTuChoiCongViec(
                                                                            cv.cv_id,
                                                                        )
                                                                    }
                                                                >
                                                                    <FontAwesomeIcon
                                                                        icon={faXmarkCircle}
                                                                    />
                                                                </button>
                                                            </Tippy>
                                                        )}
                                                    {(cv.cv_trangthai === '0' ||
                                                        cv.cv_trangthai === '1' ||
                                                        cv.cv_trangthai === '2') && (
                                                        <Tippy
                                                            content="Chỉnh sửa"
                                                            placement="bottom"
                                                        >
                                                            <button
                                                                className={cx('handle', 'edit-btn')}
                                                                onClick={() =>
                                                                    handleChinhSuaCongViec(cv.cv_id)
                                                                }
                                                            >
                                                                <FontAwesomeIcon
                                                                    icon={faPenToSquare}
                                                                />
                                                            </button>
                                                        </Tippy>
                                                    )}
                                                    {cv.cv_trangthai === '0' && (
                                                        <Tippy content="Xóa" placement="bottom">
                                                            <button
                                                                className={cx(
                                                                    'handle',
                                                                    'delete-btn',
                                                                )}
                                                                onClick={() =>
                                                                    handleXoaCongViec(cv)
                                                                }
                                                            >
                                                                <FontAwesomeIcon icon={faTrash} />
                                                            </button>
                                                        </Tippy>
                                                    )}
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                ))}
                            </>
                        ) : (
                            <tr className={cx('no-result')}>
                                <td colSpan="9">Không có công việc trong kế hoạch này</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                {sortedCongViec.length > PER_PAGE && (
                    <div className={cx('paginate')}>
                        {startIndex}-{endIndex} của {total}
                        <ReactPaginate
                            previousLabel={<FontAwesomeIcon icon={faAnglesLeft} />}
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
            </div>
        </div>
    );
}

export default BangCongViec;
