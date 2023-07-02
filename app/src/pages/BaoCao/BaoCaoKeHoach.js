import { useState, useMemo, useCallback, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faAnglesLeft,
    faAnglesRight,
    faCaretRight,
    faCaretDown,
    faArrowUp,
    faArrowDown,
    faRotateRight,
} from '@fortawesome/free-solid-svg-icons';
import 'tippy.js/dist/tippy.css';
import ReactPaginate from 'react-paginate';
import classNames from 'classnames/bind';
import styles from './BaoCao.module.scss';
import axiosClient from '~/api/axiosClient';

const cx = classNames.bind(styles);

function BaoCaoKeHoach() {
    const [dSBaoCao, setDSBaoCao] = useState([]);
    const [sortColumn, setSortColumn] = useState('');
    const [sortDirection, setSortDirection] = useState('');
    const [searchText, setSearchText] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [isBaoCao, setIsBaoCao] = useState(false);
    const [icon, setIcon] = useState(faCaretRight);
    const [dSNhanVien, setDSNhanVien] = useState([]);
    const [dSDonVi, setDSDonVi] = useState([]);
    const [filterName, setFilterName] = useState('');
    const [filterDonVi, setFilterDonVi] = useState('');

    const PER_PAGE = 10;

    useEffect(() => {
        const getBaoCao = async () => {
            const token = localStorage.getItem('Token');
            const response = await axiosClient.get(`/get_CV_KeHoach?token=${token}`);
            setDSBaoCao(response.data.ke_hoachs);
        };
        getBaoCao();
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

    const toggleBaocao = () => {
        setIsBaoCao(!isBaoCao);
        if (icon === faCaretRight) {
            setIcon(faCaretDown);
        } else {
            setIcon(faCaretRight);
        }
    };

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

    const handleFilterDonVi = (event) => {
        setFilterDonVi(event.target.value);
    };

    const handleReset = () => {
        setSearchText('');
        setFilterName('');
        setFilterDonVi('');
    };

    const sortedBaocao = useMemo(() => {
        let sortedItems = [...dSBaoCao];
        sortedItems = sortedItems.sort((a, b) =>
            a[sortColumn] > b[sortColumn] ? 1 : b[sortColumn] > a[sortColumn] ? -1 : 0,
        );
        if (sortDirection === 'asc') {
            sortedItems.reverse();
        }
        return sortedItems;
    }, [dSBaoCao, sortColumn, sortDirection]);

    const getDisplayBaocao = useCallback(() => {
        const filteredBaocao = sortedBaocao.filter(
            (bc) =>
                bc.kh_ten.toLowerCase().includes(searchText.toLowerCase()) &&
                (filterName === '' || bc.nv_id.toString() === filterName) &&
                (filterDonVi === '' || bc.dv_id === filterDonVi),
        );
        const startIndex = currentPage * PER_PAGE;
        return filteredBaocao.slice(startIndex, startIndex + PER_PAGE) || [];
    }, [sortedBaocao, currentPage, searchText, filterName, filterDonVi]);

    const totalPage = Math.ceil(sortedBaocao.length / PER_PAGE);

    const handlePageClick = ({ selected: selectedPage }) => {
        setCurrentPage(selectedPage);
    };

    const displayedBaocao = getDisplayBaocao();

    const startIndex = currentPage * PER_PAGE + 1;
    const endIndex =
        startIndex + displayedBaocao.length - 1 <= dSBaoCao.length
            ? startIndex + displayedBaocao.length - 1
            : dSBaoCao.length;
    const total = dSBaoCao.length;

    return (
        <div className={cx('wrapper')}>
            <div
                className={cx('title')}
                style={{ fontSize: isBaoCao ? '3rem' : '2rem' }}
                onClick={toggleBaocao}
            >
                <h2 style={{ fontSize: isBaoCao ? '3rem' : '2rem' }}>Báo cáo tiến độ kế hoạch</h2>
                <FontAwesomeIcon className={cx('right-icon')} icon={icon} />
            </div>

            <div style={{ display: isBaoCao ? 'block' : 'none' }}>
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
                            <select value={filterDonVi} onChange={handleFilterDonVi}>
                                <option value="">Tất cả</option>
                                {dSDonVi.map((dv) => (
                                    <option key={dv.dv_id} value={dv.dv_ten}>
                                        {dv.dv_ten}
                                    </option>
                                ))}
                            </select>
                            <div className={cx('label', 'name-dv')}>Đơn vị</div>
                        </div>
                    </div>
                    <div className={cx('handle-features')}>
                        <button className={cx('reset-btn')} onClick={handleReset}>
                            <FontAwesomeIcon icon={faRotateRight} /> Reset
                        </button>
                    </div>
                </div>
                <div className={cx('inner')}>
                    {displayedBaocao.length > 0 ? (
                        <>
                            <table className={cx('table')}>
                                <thead>
                                    <tr>
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
                                        <th onClick={() => handleSortColumn('kh_loaikehoach')}>
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
                                        <th onClick={() => handleSortColumn('kh_thgianbatdau')}>
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
                                        <th onClick={() => handleSortColumn('kh_thgianketthuc')}>
                                            <span>Thời gian kết thúc</span>
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
                                        <th onClick={() => handleSortColumn('kh_tongthgian')}>
                                            <span>Tổng thời gian</span>
                                            {sortColumn === 'kh_tongthgian' && (
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
                                    </tr>
                                </thead>
                                <tbody>
                                    {displayedBaocao.map((bc, index) => (
                                        <tr key={bc.kh_id}>
                                            <td>{index + 1 + currentPage * PER_PAGE}</td>
                                            <td style={{ textAlign: 'left' }}>{bc.kh_ten}</td>
                                            <td style={{ textAlign: 'left' }}>
                                                {bc.kh_loaikehoach}
                                            </td>
                                            <td>{bc.kh_thgianbatdau.split(' ')[0]}</td>
                                            <td>{bc.kh_thgianketthuc.split(' ')[0]}</td>
                                            <td>{bc.nhan_vien?.nv_ten}</td>
                                            <td>{bc.don_vi?.dv_ten}</td>
                                            <td>{bc.kh_tongthgian}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {sortedBaocao.length > PER_PAGE && (
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
                        </>
                    ) : (
                        <p className={cx('no-result')}>Không có kết quả tìm kiếm</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default BaoCaoKeHoach;
