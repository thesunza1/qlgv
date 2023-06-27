import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faPenToSquare,
    faTrash,
    faAnglesLeft,
    faAnglesRight,
    faEnvelope,
} from '@fortawesome/free-solid-svg-icons';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import ReactPaginate from 'react-paginate';
import axiosClient from '~/api/axiosClient';
import classNames from 'classnames/bind';
import styles from './CongViecDX.module.scss';
import AddTaskModal from './ThemCongViecDX';
import swal from 'sweetalert';

const cx = classNames.bind(styles);

function CongViecDotXuat() {
    const [dSCongViec, setDSCongViec] = useState([]);
    const [sortColumn, setSortColumn] = useState('');
    const [sortDirection, setSortDirection] = useState('');
    const [currentPage, setCurrentPage] = useState(0);

    const PER_PAGE = 5;

    useEffect(() => {
        const getListProduct = async () => {
            const token = localStorage.getItem('Token');
            const response = await axiosClient.get(`/get_CV_DotXuat?token=${token}`);
            setDSCongViec(response.data.danh_sach_cv_dot_xuat);
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
    const [showModal, setShowModal] = useState(false);

    const handleOpenModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('inner')}>
                <div className={cx('title')}>
                    <h2>Công Việc Đột Xuất</h2>
                </div>
                <div className={cx('features')}>
                    <div>
                        <button onClick={handleOpenModal} className={cx('add-btn')}>
                            Thêm
                        </button>
                        {showModal && <AddTaskModal onClose={handleCloseModal} />}
                    </div>
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
                                    <th>Thời gian bắt đầu</th>
                                    <th onClick={() => handleSortColumn('cv_thgianketthuc')}>
                                        <span>Thời gian hết hạn</span>
                                    </th>
                                    <th>Mục đích</th>
                                    <th>Đơn vị</th>
                                    <th>Người đảm nhận</th>
                                    <th>Trạng thái</th>
                                    <th className={cx('center')}>Xử lý</th>
                                </tr>
                            </thead>
                            <tbody>
                                {displayedCongViec.map((cv, index) => (
                                    <tr key={cv.cv_id}>
                                        <td>{index + 1 + currentPage * PER_PAGE}</td>
                                        <td>{cv.cv_ten}</td>
                                        {/* <td>
                                            {kh.nhan_viens.map((nv) =>
                                                parseInt(kh.dv_id_dvtruong) === nv.nv_id
                                                    ? nv.nv_ten
                                                    : null,
                                            )}
                                        </td> */}
                                        <td>{cv.cv_thgianbatdau.split(' ')[0]}</td>
                                        <td>
                                            {cv.cv_hanhoanthanh
                                                ? cv.cv_hanhoanthanh.split(' ')[0]
                                                : '-'}
                                        </td>

                                        <td>{cv.cv_noidung}</td>
                                        <td>{cv.don_vi.dv_ten}</td>
                                        <td>{cv.nv_id_lam || '-'}</td>
                                        <td>{trangThai(cv.cv_trangthai)}</td>
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
