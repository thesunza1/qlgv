import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faPlus,
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

const cx = classNames.bind(styles);

function CongViecDotXuat() {
    const [dSCongViec, setDSCongViec] = useState([]);
    const [sortColumn, setSortColumn] = useState('');
    const [sortDirection, setSortDirection] = useState('');
    const [searchText, setSearchText] = useState('');
    const [currentPage, setCurrentPage] = useState(0);

    const PER_PAGE = 5;

    useEffect(() => {
        const getListProduct = async () => {
            const token = localStorage.getItem('Token')
            const response = await axiosClient.get(`/get_CV_DotXuat?token=${token}`);
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
                    <h2>Công Việc Đột Xuất</h2>
                </div>
                <div className={cx('features')}>
                    {/* <div className={cx('search')}>
                        <input
                            type="search"
                            placeholder="Tìm kiếm công việc"
                            value={searchText}
                            onChange={handleSearchInputChange}
                        />
                        <FontAwesomeIcon icon={faSearch} />
                    </div> */}
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
                                    <th>Thời gian bắt đầu</th>
                                    <th onClick={() => handleSortColumn('cv_thgianketthuc')}>
                                        <span>Thời gian hết hạn</span>
                                    </th>
                                    <th>Nội dung</th>
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
                                        <td>{cv.cv_thgianhoanthanh ? cv.cv_thgianhoanthanh.split(' ')[0] : '-'}</td>
                                        <td>{cv.cv_noidung}</td>
                                        <td>{trangThai(cv.cv_trangthai)}</td>
                                        <td className={cx('center')}>
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
                                                <button className={cx('handle', 'delete-btn')}>
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
