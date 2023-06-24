import { useState, useMemo, useCallback, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faSearch,
    faAnglesLeft,
    faAnglesRight,
    faCaretRight,
    faCaretDown,
    faArrowUp,
    faArrowDown,
} from '@fortawesome/free-solid-svg-icons';
import 'tippy.js/dist/tippy.css';
import ReactPaginate from 'react-paginate';
import classNames from 'classnames/bind';
import styles from './BaoCao.module.scss';
import axiosClient from '~/api/axiosClient';

const cx = classNames.bind(styles);

function BaoCaoCongViec() {
    const [dSBaoCao, setDSBaoCao] = useState([]);
    const [sortColumn, setSortColumn] = useState('');
    const [sortDirection, setSortDirection] = useState('');
    const [searchText, setSearchText] = useState('');
    const [currentPage, setCurrentPage] = useState(0);

    const [isBaoCao, setIsBaoCao] = useState(false);
    const [icon, setIcon] = useState(faCaretRight);

    const PER_PAGE = 10;

    useEffect(() => {
        const getBaoCao = async () => {
            const token = localStorage.getItem('Token');
            const response = await axiosClient.get(`/get_CongViec?token=${token}`);
            setDSBaoCao(response.data);
        };
        getBaoCao();
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
            (bc) => bc.cv_ten && bc.cv_ten.toLowerCase().includes(searchText.toLowerCase()),
        );
        const startIndex = currentPage * PER_PAGE;
        return filteredBaocao.slice(startIndex, startIndex + PER_PAGE) || [];
    }, [sortedBaocao, searchText, currentPage]);

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
                <h2 style={{ fontSize: isBaoCao ? '3rem' : '2rem' }}>Báo cáo tiến độ công việc</h2>
                <FontAwesomeIcon className={cx('right-icon')} icon={icon} />
            </div>
            <div className={cx('inner')} style={{ display: isBaoCao ? 'block' : 'none' }}>
                <div className={cx('features')}>
                    <div className={cx('search')}>
                        <input
                            type="search"
                            placeholder="Tìm kiếm người lập"
                            value={searchText}
                            onChange={handleSearchInputChange}
                        />
                        <FontAwesomeIcon icon={faSearch} />
                    </div>
                </div>
                {displayedBaocao.length > 0 ? (
                    <>
                        <table className={cx('table')}>
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th onClick={() => handleSortColumn('kh_ten')}>
                                        <span>Tên công việc</span>
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
                                    <th onClick={() => handleSortColumn('cv_hanhoanthanh')}>
                                        <span>Hạn hoàn thành</span>
                                        {sortColumn === 'cv_hanhoanthanh' && (
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
                                    <th onClick={() => handleSortColumn('cv_hanhoanthanh')}>
                                        <span>Thời gian hoàn thành</span>
                                        {sortColumn === 'cv_hanhoanthanh' && (
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
                                    <th>Nội dung</th>
                                    <th>Người lập</th>
                                    <th>Người đảm nhiệm</th>
                                    <th>Đơn vị</th>
                                    <th>Tiến độ</th>
                                    <th>Tổng thời gian</th>
                                </tr>
                            </thead>
                            <tbody>
                                {displayedBaocao.map((bc, index) => (
                                    <tr key={bc.cv_id}>
                                        <td>{index + 1 + currentPage * PER_PAGE}</td>
                                        <td style={{ textAlign: 'left' }}>{bc.cv_ten}</td>
                                        <td>{bc.cv_thgianbatdau}</td>
                                        <td>{bc.cv_thgianhoanthanh}</td>
                                        <td>{bc.cv_hanhoanthanh}</td>
                                        <td style={{ textAlign: 'left' }}>{bc.cv_noidung}</td>
                                        <td style={{ textAlign: 'left' }}>
                                            {bc.nguoi_tao?.ten_nguoi_tao}
                                        </td>
                                        <td style={{ textAlign: 'left' }}>
                                            {bc.nhan_vien_lam?.ten_nhan_vien}
                                        </td>
                                        <td style={{ textAlign: 'left' }}>
                                            {bc.don_vi?.ten_don_vi}
                                        </td>
                                        <td>{bc.cv_tiendo}</td>
                                        <td>{bc.cv_tgthuchien}</td>
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
    );
}

export default BaoCaoCongViec;
