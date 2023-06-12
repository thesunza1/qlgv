import { useState, useEffect, useMemo, useCallback } from 'react';
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
    faAdd,
} from '@fortawesome/free-solid-svg-icons';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import ReactPaginate from 'react-paginate';
import axiosClient from '~/api/axiosClient';
import classNames from 'classnames/bind';
import styles from './KeHoach.module.scss';
import CongViecDotXuat from './CongViecDotXuat/CongViecDotXuat';

const cx = classNames.bind(styles);

function KeHoach() {
    const [dSKeHoach, setDSKeHoach] = useState([]);
    const [sortColumn, setSortColumn] = useState('');
    const [sortDirection, setSortDirection] = useState('');
    const [searchText, setSearchText] = useState('');
    const [currentPage, setCurrentPage] = useState(0);

    const PER_PAGE = 5;

    useEffect(() => {
        const getListProduct = async () => {
            const token = localStorage.getItem('Token')
            const response = await axiosClient.get(`/get_CV_KeHoach?token=${token}`);
            setDSKeHoach(response.data.ke_hoachs);
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

    const sortedKeHoach = useMemo(() => {
        let sortedItems = [...dSKeHoach];
        sortedItems = sortedItems.sort((a, b) =>
            a[sortColumn] > b[sortColumn] ? 1 : b[sortColumn] > a[sortColumn] ? -1 : 0,
        );
        if (sortDirection === 'asc') {
            sortedItems.reverse();
        }
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

    const displayedKeHoach = getDisplayKeHoach();

    return (
        <>
            <div className={cx('wrapper')}>
                <div className={cx('inner')}>
                    <div className={cx('title')}>
                        <h2>Kế Hoạch</h2>
                    </div>
                    <div className={cx('features')}>
                        <div className={cx('search')}>
                            <input
                                type="search"
                                placeholder="Tìm kiếm đơn vị"
                                value={searchText}
                                onChange={handleSearchInputChange}
                            />
                            <FontAwesomeIcon icon={faSearch} />
                        </div>
                        <Link to="them" className={cx('add-btn')}>
                            <FontAwesomeIcon icon={faPlus} /> Thêm
                        </Link>
                        <Link to="/qlcv/congviec" className={cx('add-btn')}>
                            <FontAwesomeIcon icon={faPlus} /> Danh sách công việc
                        </Link>
                    </div>
                    {displayedKeHoach.length > 0 ? (
                        <>
                            <table className={cx('table')}>
                                <thead>
                                    <tr>
                                        <th>STT</th>
                                        <th onClick={() => handleSortColumn('dv_ten')}>
                                            <span>Tên kế hoạch</span>
                                        </th>
                                        <th onClick={() => handleSortColumn('dv_id_dvtruong')}>
                                            <span>Thời gian hết hạn</span>
                                        </th>
                                        <th>Đơn vị</th>
                                        <th>Người lập</th>
                                        <th>Trạng thái</th>
                                        <th>Xử lý</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {displayedKeHoach.map((kh, index) => (
                                        <tr key={kh.kh_id}>
                                            <td>{index + 1 + currentPage * PER_PAGE}</td>
                                            <td>{kh.kh_ten}</td>
                                            {/* <td>
                                            {kh.nhan_viens.map((nv) =>
                                                parseInt(kh.dv_id_dvtruong) === nv.nv_id
                                                    ? nv.nv_ten
                                                    : null,
                                            )}
                                        </td> */}
                                            <td>{kh.kh_thgianketthuc}</td>
                                            <td>{kh.dv_id}</td>
                                            <td>{kh.nv_id}</td>
                                            <td>{kh.kh_trangthai}</td>
                                            <td>
                                                <Link to={`${kh.kh_id}/${kh.kh_ten}/${kh.nv_id}/${kh.kh_tongthgian}/${kh.kh_thgianketthuc}/chitiet`}>
                                                    <Tippy content="Xem chi tiết" placement="bottom">
                                                        <button className={cx('handle', 'view-btn')}>
                                                            <FontAwesomeIcon icon={faEye} />
                                                        </button>
                                                    </Tippy>
                                                </Link>
                                                <Link to={`${kh.dv_id}/nhanvien`}>
                                                    <Tippy content="Xem chi tiết" placement="bottom">
                                                        <button className={cx('handle', 'view-btn')}>
                                                            <FontAwesomeIcon icon={faAdd} />
                                                        </button>
                                                    </Tippy>
                                                </Link>
                                                <Link to={`chinhsua`}>
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
                            {sortedKeHoach.length > PER_PAGE && (
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
            <CongViecDotXuat></CongViecDotXuat>
        </>

    );
}

export default KeHoach;
