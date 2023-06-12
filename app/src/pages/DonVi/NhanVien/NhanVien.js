import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faSearch,
    faPlus,
    faArrowUp,
    faArrowDown,
    faPenToSquare,
    faTrash,
    faAnglesLeft,
    faAnglesRight,
    faCircleArrowLeft,
} from '@fortawesome/free-solid-svg-icons';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import ReactPaginate from 'react-paginate';
import axiosClient from '~/api/axiosClient';
import classNames from 'classnames/bind';
import styles from '~/pages/DonVi/DonVi.module.scss';

const cx = classNames.bind(styles);

function NhanVien() {
    const { dv_id } = useParams();

    const [dSNhanVien, setDSNhanVien] = useState([]);
    const [dSNhanVienTheoDV, setDSNhanVienTheoDV] = useState([]);
    const [sortColumn, setSortColumn] = useState('');
    const [sortDirection, setSortDirection] = useState('');
    const [searchText, setSearchText] = useState('');
    const [currentPage, setCurrentPage] = useState(0);

    const PER_PAGE = 5;

    useEffect(() => {
        const getDSNhanVien = async () => {
            const response = await axiosClient.get('/getNhanVien');
            setDSNhanVien(response.data.nhanViens);
        };
        getDSNhanVien();
    }, []);

    useEffect(() => {
        const filteredNhanVien = dSNhanVien.filter((nv) => nv.dv_id.toString() === dv_id);
        setDSNhanVienTheoDV(filteredNhanVien);
    }, [dv_id, dSNhanVien]);

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

    const sortedNhanVien = useMemo(() => {
        let sortedItems = [...dSNhanVienTheoDV];
        sortedItems = sortedItems.sort((a, b) =>
            a[sortColumn] > b[sortColumn] ? 1 : b[sortColumn] > a[sortColumn] ? -1 : 0,
        );
        if (sortDirection === 'asc') {
            sortedItems.reverse();
        }
        return sortedItems;
    }, [dSNhanVienTheoDV, sortColumn, sortDirection]);

    const getDisplayNhanVien = useCallback(() => {
        const filteredNhanVien = sortedNhanVien.filter((nv) =>
            nv.nv_ten.toLowerCase().includes(searchText.toLowerCase()),
        );
        const startIndex = currentPage * PER_PAGE;
        return filteredNhanVien.slice(startIndex, startIndex + PER_PAGE) || [];
    }, [sortedNhanVien, searchText, currentPage]);

    const totalPage = Math.ceil(sortedNhanVien.length / PER_PAGE);

    const handlePageClick = ({ selected: selectedPage }) => {
        setCurrentPage(selectedPage);
    };

    const displayedNhanVien = getDisplayNhanVien();

    return (
        <div className={cx('wrapper')}>
            <h2>
                <Link to="/qlcv/donvi">
                    <FontAwesomeIcon className={cx('back-icon')} icon={faCircleArrowLeft} />
                </Link>
                Danh sách nhân viên
            </h2>
            <div className={cx('inner')}>
                <div className={cx('features')}>
                    <div className={cx('search')}>
                        <input
                            type="search"
                            placeholder="Tìm kiếm nhân viên"
                            value={searchText}
                            onChange={handleSearchInputChange}
                        />
                        <FontAwesomeIcon icon={faSearch} />
                    </div>
                    <Link to="them" className={cx('add-btn')}>
                        <FontAwesomeIcon icon={faPlus} /> Thêm
                    </Link>
                </div>
                {displayedNhanVien.length > 0 ? (
                    <>
                        <table className={cx('table')}>
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th onClick={() => handleSortColumn('nv_stt')}>
                                        <span>Mã nhân viên</span>
                                        {sortColumn === 'nv_stt' && (
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
                                    <th onClick={() => handleSortColumn('nv_ten')}>
                                        <span>Tên nhân viên</span>
                                        {sortColumn === 'nv_ten' && (
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
                                    <th>Quyền</th>
                                    <th>SĐT</th>
                                    <th>Địa chỉ</th>
                                    <th>Xử lý</th>
                                </tr>
                            </thead>
                            <tbody>
                                {displayedNhanVien.map((nv, index) => (
                                    <tr key={nv.nv_id}>
                                        <td>{index + 1 + currentPage * PER_PAGE}</td>
                                        <td>{nv.nv_id}</td>
                                        <td>{nv.nv_ten}</td>
                                        <td>{nv.nv_quyen === 'ld' ? 'Lãnh đạo' : 'Nhân viên'}</td>
                                        <td>{nv.nv_sdt}</td>
                                        <td>{nv.nv_diachi}</td>
                                        <td>
                                            <Link to={`/chinhsua/${nv.dv_id}`}>
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
                        {sortedNhanVien.length > PER_PAGE && (
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

export default NhanVien;
