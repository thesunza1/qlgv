import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faSearch,
    faPlus,
    faPenToSquare,
    faTrash,
    faAnglesLeft,
    faAnglesRight,
    faEnvelope,
    faCircleArrowLeft,
} from '@fortawesome/free-solid-svg-icons';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import ReactPaginate from 'react-paginate';
import axiosClient from '~/api/axiosClient';
import classNames from 'classnames/bind';
import styles from './CongViec.module.scss';
import swal from 'sweetalert';

const cx = classNames.bind(styles);

function CongViec() {
    const [dSCongViec, setDSCongViec] = useState([]);
    const [sortColumn, setSortColumn] = useState('');
    const [sortDirection, setSortDirection] = useState('');
    const [searchText, setSearchText] = useState('');
    const [currentPage, setCurrentPage] = useState(0);

    const PER_PAGE = 10;

    useEffect(() => {
        const getListProduct = async () => {
            const token = localStorage.getItem('Token');
            const response = await axiosClient.get(`/get_CongViec?token=${token}`);
            setDSCongViec(response.data);
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

    const handleSearchInputChange = (event) => {
        setSearchText(event.target.value);
        setCurrentPage(0);
    };

    const sortedCongViec = useMemo(() => {
        let sortedItems = [...dSCongViec];
        sortedItems = sortedItems.sort((a, b) =>
            a[sortColumn] > b[sortColumn] ? 1 : b[sortColumn] > a[sortColumn] ? -1 : 0,
        );
        if (sortDirection === 'asc') {
            sortedItems.reverse();
        }
        return sortedItems;
    }, [dSCongViec, sortColumn, sortDirection]);

    const getDisplayCongViec = useCallback(() => {
        const filteredCongViec = sortedCongViec.filter((cv) =>
            cv.cv_ten.toLowerCase().includes(searchText.toLowerCase()),
        );
        const startIndex = currentPage * PER_PAGE;
        return filteredCongViec.slice(startIndex, startIndex + PER_PAGE) || [];
    }, [sortedCongViec, searchText, currentPage]);

    const totalPage = Math.ceil(sortedCongViec.length / PER_PAGE);

    const handlePageClick = ({ selected: selectedPage }) => {
        setCurrentPage(selectedPage);
    };
    const handleXoaCongViec = (cv) => {
        swal({
            title: `Bạn chắc chắn muốn xóa công việc này`,
            text: 'Sau khi xóa, bạn sẽ không thể khôi phục công việc này!',
            icon: 'warning',
            buttons: true,
            dangerMode: true,
        }).then(async (willDelete) => {
            if (willDelete) {
                await axiosClient.delete(`/xoaCongViec1ấdsad`);
                swal(` đã được xóa`, {
                    icon: 'success',
                });
                window.location.reload();
            } else {
                return;
            }
        });
    };
    function trangThai(trangThai) {
        switch (trangThai) {
            case '1':
                return "Đang chờ phê duyệt";
            case '2':
                return "Đã được duyệt";
            case '3':
                return "Đang thực hiện";
            case '4':
                return "Đã hoàn thành";
            default:
                return "Unknown trạng thái";
        }
    }
    const displayedCongViec = getDisplayCongViec();

    return (
        <div className={cx('wrapper')}>
            <div className={cx('inner')}>
                <div className={cx('title')}>
                    <h2>
                        {' '}
                        <Link to="/qlcv/kehoach">
                            <FontAwesomeIcon className={cx('back-icon')} icon={faCircleArrowLeft} />
                        </Link>
                        Công Việc
                    </h2>
                </div>
                <div className={cx('features')}>
                    <Link to="dsxingiahan" className={cx('add-btn')}>
                        <FontAwesomeIcon icon={faPlus} /> Danh sách xin gia hạn
                    </Link>
                    <div className={cx('search')}>
                        <input
                            type="search"
                            placeholder="Tìm kiếm công việc"
                            value={searchText}
                            onChange={handleSearchInputChange}
                        />
                        <FontAwesomeIcon icon={faSearch} />
                    </div>
                    <Link to="them" className={cx('add-btn')}>
                        <FontAwesomeIcon icon={faPlus} /> Thêm
                    </Link>
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
                                    <th onClick={() => handleSortColumn('kh_ten')}>
                                        <span>Tên kế hoạch</span>
                                    </th>
                                    <th onClick={() => handleSortColumn('cv_thgianbatdau')}>Thời gian bắt đầu</th>
                                    <th onClick={() => handleSortColumn('cv_thgianketthuc')}>
                                        <span>Thời gian hết hạn</span>
                                    </th>
                                    <th onClick={() => handleSortColumn('dv_id')}>Đơn vị</th>
                                    <th onClick={() => handleSortColumn('nv_id')}>Nhân viên</th>
                                    <th onClick={() => handleSortColumn('cv_trangthai')}>Trạng thái</th>
                                    <th>Xử lý</th>
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
                                        <td>{cv.ke_hoach.ten_ke_hoach}</td>
                                        <td>{cv.cv_thgianbatdau.split(' ')[0]}</td>
                                        <td>{cv.cv_thgianhoanthanh ? cv.cv_thgianhoanthanh.split(' ')[0] : '-'}</td>
                                        <td>{cv.don_vi.ten_don_vi}</td>
                                        <td>{cv.nhan_vien.ten_nhan_vien}</td>
                                        <td>{trangThai(cv.cv_trangthai)}</td>
                                        <td>
                                            <Link to={`/qlcv/congviec/${cv.cv_id}/${cv.cv_ten}/${cv.cv_thgianketthuc}/xingiahan`}>
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
                                            <Link to={`/qlcv/congviec/${cv.cv_id}/${cv.cv_ten}/${cv.cv_thgianbatdau}/${cv.cv_thgianketthuc}/${cv.dv_id}/${cv.nv_id}/chinhsua`}>
                                                <Tippy content="Chỉnh sửa" placement="bottom">
                                                    <button className={cx('handle', 'edit-btn')}>
                                                        <FontAwesomeIcon icon={faPenToSquare} />
                                                    </button>
                                                </Tippy>
                                            </Link>
                                            <Tippy content="Xóa" placement="bottom">
                                                <button className={cx('handle', 'delete-btn')} onClick={handleXoaCongViec}>
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

export default CongViec;
