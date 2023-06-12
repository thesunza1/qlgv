import { useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faSearch,
    faArrowUp,
    faArrowDown,
    faAnglesLeft,
    faAnglesRight,
    faSave,
    faCaretRight,
    faCaretDown,
} from '@fortawesome/free-solid-svg-icons';
import 'tippy.js/dist/tippy.css';
import ReactPaginate from 'react-paginate';
import classNames from 'classnames/bind';
import styles from './BaoCao.module.scss';

const cx = classNames.bind(styles);

function createData(
    id,
    thoi_gian,
    ten_cong_viec,
    noi_dung_cong_viec,
    gio_lam_viec,
    tien_do,
    duyet_gio,
    trang_thai,
    tham_dinh,
) {
    return {
        id,
        thoi_gian,
        ten_cong_viec,
        noi_dung_cong_viec,
        gio_lam_viec,
        tien_do,
        duyet_gio,
        trang_thai,
        tham_dinh,
    };
}

const rows = [
    createData(1, '31/5/2023', 'Lập trình', 'Bằng Reactjs 1', '2', '50%', '2', 'Đã thẩm định', '1'),
    createData(
        2,
        '31/5/2023',
        'Lập trình',
        'Bằng Reactjs 2',
        '2',
        '50%',
        '2',
        'Chưa thẩm định',
        '1',
    ),
    createData(3, '29/5/2023', 'Lập trình 1', 'Bằng Reactjs', '2', '50%', '2', 'Đã thẩm định', '1'),
    createData(4, '30/5/2023', 'Thiết kế', 'Bằng Reactjs', '2', '50%', '2', 'Đã thẩm định', '1'),
    createData(5, '31/5/2023', 'Lập trình', 'Bằng Reactjs', '2', '50%', '2', 'Đã thẩm định', '1'),
    createData(6, '31/5/2023', 'Lập trình', 'Bằng Reactjs', '2', '50%', '2', 'Đã thẩm định', '1'),
    createData(7, '31/5/2023', 'Lập trình', 'Bằng Reactjs', '2', '50%', '2', 'Đã thẩm định', '1'),
    createData(8, '31/5/2023', 'Lập trình', 'Bằng Reactjs', '2', '50%', '2', 'Đã thẩm định', '1'),
    createData(9, '31/5/2023', 'Lập trình', 'Bằng Reactjs', '2', '50%', '2', 'Đã thẩm định', '1'),
    createData(10, '31/5/2023', 'Lập trình', 'Bằng Reactjs', '2', '50%', '2', 'Đã thẩm định', '1'),
    createData(11, '31/5/2023', 'Lập trình', 'Bằng Reactjs', '2', '50%', '2', 'Đã thẩm định', '1'),
    createData(12, '31/5/2023', 'Lập trình', 'Bằng Reactjs', '2', '50%', '2', 'Đã thẩm định', '1'),
];

function BaoCaoCongViec() {
    const [dSBaocao, setDSBaocao] = useState(rows);
    const [sortColumn, setSortColumn] = useState('');
    const [sortDirection, setSortDirection] = useState('');
    const [searchText, setSearchText] = useState('');
    const [currentPage, setCurrentPage] = useState(0);

    const [isBaoCao, setIsBaoCao] = useState(false);
    const [icon, setIcon] = useState(faCaretRight);

    const toggleBaocao = () => {
        setIsBaoCao(!isBaoCao);
        if (icon === faCaretRight) {
            setIcon(faCaretDown);
        } else {
            setIcon(faCaretRight);
        }
    };

    const PER_PAGE = 5;

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
        let sortedItems = [...dSBaocao];
        sortedItems = sortedItems.sort((a, b) =>
            a[sortColumn] > b[sortColumn] ? 1 : b[sortColumn] > a[sortColumn] ? -1 : 0,
        );
        if (sortDirection === 'asc') {
            sortedItems.reverse();
        }
        return sortedItems;
    }, [dSBaocao, sortColumn, sortDirection]);

    const getDisplayBaocao = useCallback(() => {
        const filteredBaocao = sortedBaocao.filter((bc) =>
            bc.ten_cong_viec.toLowerCase().includes(searchText.toLowerCase()),
        );
        const startIndex = currentPage * PER_PAGE;
        return filteredBaocao.slice(startIndex, startIndex + PER_PAGE) || [];
    }, [sortedBaocao, searchText, currentPage]);

    const totalPage = Math.ceil(sortedBaocao.length / PER_PAGE);

    const handlePageClick = ({ selected: selectedPage }) => {
        setCurrentPage(selectedPage);
    };

    const displayedBaocao = getDisplayBaocao();

    return (
        <div className={cx('wrapper')}>
            <div className={cx('title')}>
                <h2
                    style={{
                        fontSize: isBaoCao ? '3rem' : '2rem',
                    }}
                >
                    Báo cáo tiến độ công việc
                </h2>
                <FontAwesomeIcon className={cx('right-icon')} icon={icon} onClick={toggleBaocao} />
            </div>
            <div className={cx('inner')} style={{ display: isBaoCao ? 'block' : 'none' }}>
                <div className={cx('features')}>
                    <div className={cx('search')}>
                        <input
                            type="search"
                            placeholder="Tìm kiếm báo cáo"
                            value={searchText}
                            onChange={handleSearchInputChange}
                        />
                        <FontAwesomeIcon icon={faSearch} />
                    </div>
                    <Link className={cx('add-btn')}>
                        <FontAwesomeIcon icon={faSave} /> Lưu
                    </Link>
                </div>
                {displayedBaocao.length > 0 ? (
                    <>
                        <table className={cx('table')}>
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th onClick={() => handleSortColumn('thoi_gian')}>
                                        <span>Thời gian</span>
                                        {sortColumn === 'thoi_gian' && (
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
                                    <th onClick={() => handleSortColumn('ten_cong_viec')}>
                                        <span>Tên công việc</span>
                                        {sortColumn === 'ten_cong_viec' && (
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
                                    <th>Nội dung công việc</th>
                                    <th>Giờ làm việc</th>
                                    <th>Tiến độ</th>
                                    <th>Duyệt giờ</th>
                                    <th onClick={() => handleSortColumn('trang_thai')}>
                                        <span>Trạng thái</span>
                                        {sortColumn === 'trang_thai' && (
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
                                    <th>Thẩm định</th>
                                </tr>
                            </thead>
                            <tbody>
                                {displayedBaocao.map((bc, index) => (
                                    <tr key={bc.id}>
                                        <td>{index + 1 + currentPage * PER_PAGE}</td>
                                        <td>{bc.thoi_gian}</td>
                                        <td>{bc.ten_cong_viec}</td>
                                        <td>{bc.noi_dung_cong_viec}</td>
                                        <td>{bc.gio_lam_viec}</td>
                                        <td>{bc.tien_do}</td>
                                        <td>{bc.duyet_gio}</td>
                                        <td>{bc.trang_thai}</td>
                                        <td>
                                            <input type="checkbox"></input>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {sortedBaocao.length > PER_PAGE && (
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

export default BaoCaoCongViec;
