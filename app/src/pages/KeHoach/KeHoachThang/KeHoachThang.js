import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faAnglesLeft,
    faAnglesRight,
    faEnvelope,
    faList,
    faRotateRight,
} from '@fortawesome/free-solid-svg-icons';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import ReactPaginate from 'react-paginate';
import axiosClient from '~/api/axiosClient';
import classNames from 'classnames/bind';
import styles from './KeHoachThang.module.scss';
import CongViecDotXuat from '../CongViecDotXuat/CongViecDotXuat';
import 'moment/locale/vi';
const cx = classNames.bind(styles);

function KeHoachThang() {
    const [dSKeHoach, setDSKeHoach] = useState([]);
    const [sortColumn, setSortColumn] = useState('');
    const [sortDirection, setSortDirection] = useState('');
    const [searchText, setSearchText] = useState('');
    const [currentPage, setCurrentPage] = useState(0);

    const [filterName, setFilterName] = useState('');
    const [filterState, setFilterState] = useState('');
    const [filterDateStart, setFilterDateStart] = useState('');
    const [dSNhanVien, setDSNhanVien] = useState([]);
    const PER_PAGE = 15;
    const getListProduct = async () => {
        var now = new Date();
        let month = now.getMonth();
        const token = localStorage.getItem('Token');
        const response = await axiosClient.get(`/get_CV_Thang/${month + 1}/?token=${token}`);
        setDSKeHoach(response.data.cong_viecs);
    };
    useEffect(() => {
        getListProduct();
    }, []);
    useEffect(() => {
        const getListNhanVien = async () => {
            const response = await axiosClient.get('/get_NhanVien');
            setDSNhanVien(response.data.nhanViens);
        };
        getListNhanVien();
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
    const handleFilterName = (event) => {
        setFilterName(event.target.value);
    };

    const handleFilterState = (event) => {
        setFilterState(event.target.value);
    };

    const handleReset = () => {
        setSearchText('');
        setFilterName('');
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
            const aOrder = cvTrangThaiOrder[a.cv_trangthai] ?? 999;
            const bOrder = cvTrangThaiOrder[b.cv_trangthai] ?? 999;
            return aOrder - bOrder;
        });

        return sortedItems;
    }, [dSKeHoach, sortColumn, sortDirection]);

    const getDisplayKeHoach = useCallback(() => {
        const filteredCongViec = sortedKeHoach.filter(
            (cv) =>
                cv.cv_ten &&
                cv.cv_ten.toLowerCase().includes(searchText.toLowerCase()) &&
                (filterName === '' || cv.nv_id.toString() === filterName) &&
                (filterState === '' || cv.cv_trangthai === filterState) &&
                (filterDateStart === '' || cv.cv_thgianbatdau === filterDateStart),
        );
        const startIndex = currentPage * PER_PAGE;
        return filteredCongViec.slice(startIndex, startIndex + PER_PAGE) || [];
    }, [sortedKeHoach, currentPage, searchText, filterName, filterState, filterDateStart]);

    const totalPage = Math.ceil(sortedKeHoach.length / PER_PAGE);

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
            case '4':
                return <button className={cx('b4')}>Quá hạn</button>;
            default:
                return <button className={cx('b5')}>Từ chối</button>;
        }
    }
    const displayedKeHoach = getDisplayKeHoach();
    var now = new Date();
    let month = now.getMonth();
    return (
        <>
            <div className={cx('wrapper')}>
                <div className={cx('title')}>
                    <div className={cx('list')}>
                        <Link to="/qlcv/congviec" className={cx('list-btn')}>
                            <FontAwesomeIcon icon={faList} /> Danh sách công việc
                        </Link>
                    </div>
                    <h2>Công việc trong tháng {month + 1}</h2>
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
                            <div className={cx('label')}>Tên công việc</div>
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
                    </div>
                </div>
                <div className={cx('inner')}>
                    {displayedKeHoach.length > 0 ? (
                        <>
                            <table className={cx('table')}>
                                <thead>
                                    <tr>
                                        <th>STT</th>
                                        <th onClick={() => handleSortColumn('cv_ten')}>
                                            <span>Tên công việc</span>
                                        </th>
                                        <th
                                            className={cx('center')}
                                            onClick={() => handleSortColumn('cv_thgianbatdau')}
                                        >
                                            <span>Ngày bắt đầu</span>
                                        </th>
                                        <th
                                            className={cx('center')}
                                            onClick={() => handleSortColumn('cv_hanhoanthanh')}
                                        >
                                            <span>Ngày hết hạn</span>
                                        </th>

                                        <th>Nội dung</th>
                                        <th className={cx('center')}>Đơn vị</th>
                                        <th className={cx('center')}>Người đảm nhiệm</th>
                                        <th className={cx('center')}>Trạng thái</th>
                                        <th className={cx('center')}>Xử lý</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {displayedKeHoach.map((cv, index) => (
                                        <tr key={cv.cv_id}>
                                            <td>{index + 1 + currentPage * PER_PAGE}</td>
                                            <td>{cv.cv_ten}</td>
                                            <td className={cx('center')}>
                                                {cv.cv_thgianbatdau
                                                    ? cv.cv_thgianbatdau.split(' ')[0]
                                                    : '-'}
                                            </td>
                                            <td className={cx('center')}>
                                                {cv.cv_hanhoanthanh
                                                    ? cv.cv_hanhoanthanh.split(' ')[0]
                                                    : '-'}
                                            </td>
                                            <td>{cv.cv_noidung ? cv.cv_noidung : '-'}</td>
                                            <td className={cx('center')}>
                                                {cv.don_vi?.ten_don_vi}
                                            </td>
                                            <td>{cv.nhan_vien_lam?.ten_nhan_vien || '-'}</td>

                                            <td className={cx('center')}>
                                                {trangThai(cv.cv_trangthai)}
                                            </td>
                                            <td className={cx('center')}>
                                                <Link
                                                    to={`/qlcv/congviec/${cv.cv_id}/${cv.cv_ten}/${cv.cv_thgianhoanthanh}/xingiahan`}
                                                >
                                                    <Tippy content="Xin gia hạn" placement="bottom">
                                                        <button
                                                            className={cx('handle', 'view-btn')}
                                                        >
                                                            <FontAwesomeIcon icon={faEnvelope} />
                                                        </button>
                                                    </Tippy>
                                                </Link>
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

export default KeHoachThang;
