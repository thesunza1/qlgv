import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faPenToSquare,
    faTrash,
    faAnglesLeft,
    faAnglesRight,
    faEnvelope,
    faPlus,
    faSave,
    faCircleMinus,
} from '@fortawesome/free-solid-svg-icons';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import ReactPaginate from 'react-paginate';
import axiosClient from '~/api/axiosClient';
import classNames from 'classnames/bind';
import styles from './CongViecDX.module.scss';
import swal from 'sweetalert';
import cogoToast from 'cogo-toast';
const cx = classNames.bind(styles);

function CongViecDotXuat() {
    const [dSCongViec, setDSCongViec] = useState([]);
    const [sortColumn, setSortColumn] = useState('');
    const [sortDirection, setSortDirection] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [userInfo, setUserInfo] = useState([]);
    const PER_PAGE = 5;

    useEffect(() => {
        const getListProduct = async () => {
            const token = localStorage.getItem('Token');
            const response = await axiosClient.get(`/get_CV_DotXuat?token=${token}`);
            const info = await axiosClient.get(`/user-info?token=${token}`);
            setDSCongViec(response.data.danh_sach_cv_dot_xuat);
            setUserInfo(info.data.result);
        };
        getListProduct();
    }, []);

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
            const cvTrangThaiOrder = { 0: 0, 1: 1, 2: 2, 3: 3 };
            const aOrder = cvTrangThaiOrder[a.cv_trangthai] ?? 999;
            const bOrder = cvTrangThaiOrder[b.cv_trangthai] ?? 999;
            return aOrder - bOrder;
        });

        return sortedItems;
    }, [dSCongViec, sortColumn, sortDirection]);

    const getDisplayCongViec = useCallback(() => {
        const filteredCongViec = sortedCongViec.filter((cv) => cv.cv_ten.toLowerCase());
        const startIndex = currentPage * PER_PAGE;
        return filteredCongViec.slice(startIndex, startIndex + PER_PAGE) || [];
    }, [sortedCongViec, currentPage]);

    const totalPage = Math.ceil(sortedCongViec.length / PER_PAGE);

    const handlePageClick = ({ selected: selectedPage }) => {
        setCurrentPage(selectedPage);
    };
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
            default:
                return <button className={cx('b4')}>Quá hạn</button>;
        }
    }
    const handleXoaCongViec = (cv) => {
        swal({
            title: `Bạn chắc chắn muốn xóa kế hoạch ${cv.cv_ten.toUpperCase()} này`,
            text: 'Sau khi xóa, bạn sẽ không thể khôi phục công việc này!',
            icon: 'warning',
            buttons: true,
            dangerMode: true,
        }).then(async (willDelete) => {
            if (willDelete) {
                try {
                    const token = localStorage.getItem('Token');

                    const response = await axiosClient.delete('/delete_CongViec', {
                        data: { deletecv_ids: [cv.cv_id] }, // pass an array of the ID to delete
                        params: { token: token },
                    });
                    if (response.status === 200) {
                        swal(`Kế hoạch ${cv.cv_ten} đã được xóa thành công!`, { icon: 'success' });
                        window.location.reload();
                    }
                } catch (error) {
                    console.error(error);
                    swal(`Lỗi khi xóa kế hoạch ${cv.cv_ten} : ${error.message}`, { icon: 'error' });
                }
            } else {
                return;
            }
        });
    };

    const displayedCongViec = getDisplayCongViec();
    //them cvdx
    const [optionList, setOptionList] = useState([]);
    const [optionListDV, setOptionListDV] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            const resSoNhanVien = await axiosClient.get(`/get_NhanVien`);
            const resDonVi = await axiosClient.get(`/get_DonVi`);
            setOptionList(resSoNhanVien.data.nhanViens);
            setOptionListDV(resDonVi.data.don_vis);
        };

        fetchData();
    }, []);
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
            kh_id: '',
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
        const kh_ids = newRows.map((row) => row.kh_id);
        const cong_viec = [];
        for (let cv of newRows) {
            const {
                cv_ten,
                cv_noidung,
                cv_thgianbatdau,
                cv_hanhoanthanh,
                nv_id_lam,
                dv_id,
                kh_id,
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
                kh_id,
                cv_cv_cha,
                cv_trongso,
                da_id,
                n_cv_id,
                lcv_id,
            });
        }
        const token = localStorage.getItem('Token');

        for (const kh_id of kh_ids) {
            const response = await axiosClient.post(`/add_CV_DotXuat?token=${token}`, {
                kh_id: 1,
                cong_viec,
            });

            if (response.status === 200) {
                cogoToast.success(`Công việc đột xuất đã được thêm ${kh_id}`, {
                    position: 'top-right',
                });
                window.location.reload();
            }
        }
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('inner')}>
                <div className={cx('title')}>
                    <h2>Công Việc Đột Xuất</h2>
                </div>
                <div className={cx('features')}>
                    {userInfo.nv_quyen === 'ld' && (
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
                {displayedCongViec.length > 0 ? (
                    <>
                        <table className={cx('table')}>
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th onClick={() => handleSortColumn('cv_ten')}>
                                        <span>Tên công việc</span>
                                    </th>
                                    <th className={cx('center')}>Thời gian bắt đầu</th>
                                    <th
                                        className={cx('center')}
                                        onClick={() => handleSortColumn('cv_thgianketthuc')}
                                    >
                                        <span>Thời gian hết hạn</span>
                                    </th>
                                    <th>Mục đích</th>
                                    <th className={cx('center')}>Đơn vị</th>
                                    <th>Người đảm nhận</th>
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
                                        <td className={cx('center')}>
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
                                        <td className={cx('center')}>
                                            <input
                                                type="date"
                                                name="cv_hanhoanthanh"
                                                value={newRow.cv_hanhoanthanh}
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

                                        <td className={cx('center')}>
                                            <select
                                                type="text"
                                                name="dv_id"
                                                value={newRow.dv_id}
                                                onChange={(e) => handleNewInputChange(e, index)}
                                            >
                                                <option value="" disabled>
                                                    -- Chọn đơn vị --
                                                </option>
                                                {optionListDV.map((dv) => (
                                                    <option key={dv.dv_id} value={dv.dv_id}>
                                                        {dv.dv_ten}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td>
                                            <select
                                                type="text"
                                                name="nv_id_lam"
                                                value={newRow.nv_id_lam}
                                                onChange={(e) => handleNewInputChange(e, index)}
                                            >
                                                <option value="" disabled>
                                                    -- Chọn nhân viên --
                                                </option>
                                                {optionList.map((nv) => (
                                                    <option key={nv.nv_id} value={nv.nv_id}>
                                                        {nv.nv_ten}
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
                                {displayedCongViec.map((cv, index) => (
                                    <tr key={cv.cv_id}>
                                        <td>{index + 1 + currentPage * PER_PAGE}</td>
                                        <td>{cv.cv_ten}</td>
                                        <td className={cx('center')}>
                                            {cv.cv_thgianbatdau.split(' ')[0]}
                                        </td>
                                        <td className={cx('center')}>
                                            {cv.cv_hanhoanthanh
                                                ? cv.cv_hanhoanthanh.split(' ')[0]
                                                : '-'}
                                        </td>

                                        <td>{cv.cv_noidung}</td>
                                        <td className={cx('center')}>{cv.don_vi.dv_ten}</td>
                                        <td>{cv.nhan_vien_lam?.nv_ten || '-'}</td>
                                        <td className={cx('center')}>
                                            {trangThai(cv.cv_trangthai)}
                                        </td>
                                        <td className={cx('center')}>
                                            <Link
                                                to={`/qlcv/congviec/${cv.cv_id}/${cv.cv_ten}/${cv.cv_thgianketthuc}/xingiahan`}
                                            >
                                                <Tippy content="Xin gia hạn" placement="bottom">
                                                    <button className={cx('handle', 'view-btn')}>
                                                        <FontAwesomeIcon icon={faEnvelope} />
                                                    </button>
                                                </Tippy>
                                            </Link>
                                            {/* <Link to={`${cv.dv_id}/nhanvien`}>
                                                <Tippy content="Xem chi tiết" placement="bottom">
                                                    <button className={cx('handle', 'view-btn')}>
                                                        <FontAwesomeIcon icon={faAdd} />
                                                    </button>
                                                </Tippy>
                                            </Link> */}
                                            <Link
                                                to={`/qlcv/congviec/${cv.cv_id}/${cv.cv_ten}/${cv.cv_thgianbatdau}/${cv.cv_hanhoanthanh}/${cv.dv_id}/${cv.nv_id}/chinhsua`}
                                            >
                                                <Tippy content="Chỉnh sửa" placement="bottom">
                                                    <button className={cx('handle', 'edit-btn')}>
                                                        <FontAwesomeIcon icon={faPenToSquare} />
                                                    </button>
                                                </Tippy>
                                            </Link>
                                            <Tippy content="Xóa" placement="bottom">
                                                <button
                                                    onClick={() => handleXoaCongViec(cv)}
                                                    className={cx('handle', 'delete-btn')}
                                                >
                                                    <FontAwesomeIcon icon={faTrash} />
                                                </button>
                                            </Tippy>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {sortedCongViec.length > PER_PAGE && (
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
                        )}
                    </>
                ) : (
                    <p className={cx('no-result')}>Không có kết quả tìm kiếm</p>
                )}
            </div>
        </div>
    );
}

export default CongViecDotXuat;
