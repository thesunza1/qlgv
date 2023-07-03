import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faSearch,
    faPlus,
    faArrowUp,
    faArrowDown,
    faEye,
    faPenToSquare,
    faTrash,
    faAnglesLeft,
    faAnglesRight,
} from '@fortawesome/free-solid-svg-icons';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import ReactPaginate from 'react-paginate';
import axiosClient from '~/api/axiosClient';
import swal from 'sweetalert';
import classNames from 'classnames/bind';
import styles from './DonVi.module.scss';
import ThemDonVi from './ThemDonVi';
import ChinhSuaDonVi from './ChinhSuaDonVi';

const cx = classNames.bind(styles);

function DonVi() {
    const [dSDonVi, setDSDonVi] = useState([]);
    const [sortColumn, setSortColumn] = useState('');
    const [sortDirection, setSortDirection] = useState('');
    const [searchText, setSearchText] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [infoUser, setInfoUser] = useState([]);

    const PER_PAGE = 8;

    const getListDonVi = async () => {
        const response = await axiosClient.get('/get_DonVi');
        setDSDonVi(response.data.don_vis);
    };

    useEffect(() => {
        getListDonVi();
    }, []);

    useEffect(() => {
        const getInfoUser = async () => {
            const token = localStorage.getItem('Token');
            const response = await axiosClient.get(`/user-info?token=${token}`);
            setInfoUser(response.data.result);
        };
        getInfoUser();
    }, []);

    const loadDonVi = async () => {
        await getListDonVi();
        await getDisplayDonVi();
    };

    const handleXoaDonVi = (dv) => {
        swal({
            title: `Bạn chắc chắn muốn xóa đơn vị ${dv.dv_ten.toUpperCase()} này`,
            text: 'Sau khi xóa, bạn sẽ không thể khôi phục đơn vị này!',
            icon: 'warning',
            buttons: true,
            dangerMode: true,
        }).then(async (willDelete) => {
            if (willDelete) {
                const deletedv_ids = [dv.dv_id];
                await axiosClient.delete('/delete_DonVi', {
                    data: { deletedv_ids },
                });
                await loadDonVi();
                swal(`${dv.dv_ten.toUpperCase()} đã được xóa`, {
                    icon: 'success',
                });
            } else {
                return;
            }
        });
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

    const sortedDonVi = useMemo(() => {
        let sortedItems = [...dSDonVi];
        sortedItems = sortedItems.sort((a, b) =>
            a[sortColumn] > b[sortColumn] ? 1 : b[sortColumn] > a[sortColumn] ? -1 : 0,
        );
        if (sortDirection === 'asc') {
            sortedItems.reverse();
        }
        return sortedItems;
    }, [dSDonVi, sortColumn, sortDirection]);

    const getDisplayDonVi = useCallback(() => {
        const filteredDonVi = sortedDonVi.filter((dv) =>
            dv.dv_ten.toLowerCase().includes(searchText.toLowerCase()),
        );
        const startIndex = currentPage * PER_PAGE;
        return filteredDonVi.slice(startIndex, startIndex + PER_PAGE) || [];
    }, [sortedDonVi, searchText, currentPage]);

    const totalPage = Math.ceil(sortedDonVi.length / PER_PAGE);

    const handlePageClick = ({ selected: selectedPage }) => {
        setCurrentPage(selectedPage);
    };

    const displayedDonVi = getDisplayDonVi();

    const startIndex = currentPage * PER_PAGE + 1;
    const endIndex =
        startIndex + displayedDonVi.length - 1 <= dSDonVi.length
            ? startIndex + displayedDonVi.length - 1
            : dSDonVi.length;
    const total = dSDonVi.length;

    // Thêm đơn vị
    const [isOpenAdd, setIsOpenAdd] = useState(false);

    const togglePopupAdd = () => {
        setIsOpenAdd(!isOpenAdd);
    };

    // Chỉnh sửa đơn vị
    const [donViID, setDonViID] = useState(null);
    const [isOpenEdit, setIsOpenEdit] = useState(false);

    const togglePopupEdit = (dvID) => {
        setDonViID(dvID);
        setIsOpenEdit(!isOpenEdit);
    };

    return (
        <div>
            <div>
                {isOpenAdd && (
                    <div className={cx('popup')}>
                        <div className={cx('popup-content')}>
                            <ThemDonVi
                                togglePopupAdd={togglePopupAdd}
                                setIsOpenAdd={setIsOpenAdd}
                                loadDonVi={loadDonVi}
                            />
                        </div>
                    </div>
                )}
                {isOpenEdit && (
                    <div className={cx('popup')}>
                        <div className={cx('popup-content')}>
                            <ChinhSuaDonVi
                                togglePopupEdit={togglePopupEdit}
                                setIsOpenEdit={setIsOpenEdit}
                                loadDonVi={loadDonVi}
                                donViID={donViID}
                            />
                        </div>
                    </div>
                )}
            </div>
            <div className={cx('wrapper')}>
                <h2>Danh sách đơn vị</h2>
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
                    {infoUser.nv_quyen === 'ld' && (
                        <button className={cx('add-btn')} onClick={togglePopupAdd}>
                            <FontAwesomeIcon icon={faPlus} /> Thêm
                        </button>
                    )}
                </div>
                <div className={cx('inner')}>
                    {displayedDonVi.length > 0 ? (
                        <>
                            <table className={cx('table')}>
                                <thead>
                                    <tr>
                                        <th>STT</th>
                                        <th onClick={() => handleSortColumn('dv_ten')}>
                                            <span>Tên đơn vị</span>
                                            {sortColumn === 'dv_ten' && (
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
                                        <th onClick={() => handleSortColumn('dv_id_dvtruong')}>
                                            <span>Đơn vị trưởng</span>
                                            {sortColumn === 'dv_id_dvtruong' && (
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
                                        <th onClick={() => handleSortColumn('dv_dvcha')}>
                                            <span>Đơn vị cha</span>
                                            {sortColumn === 'dv_dvcha' && (
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
                                        <th>Xử lý</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {displayedDonVi.map((dv, index) => (
                                        <tr key={dv.dv_id}>
                                            <td>{index + 1 + currentPage * PER_PAGE}</td>
                                            <td>{dv.dv_ten}</td>
                                            <td>{dv.dv_id_dvtruong?.nv_ten}</td>
                                            <td>{dv.dv_dvcha?.dv_ten}</td>
                                            <td>
                                                <Link to={`${dv.dv_id}/${dv.dv_ten}/nhanvien`}>
                                                    <Tippy
                                                        content="Xem chi tiết"
                                                        placement="bottom"
                                                    >
                                                        <button
                                                            className={cx('handle', 'view-btn')}
                                                        >
                                                            <FontAwesomeIcon icon={faEye} />
                                                        </button>
                                                    </Tippy>
                                                </Link>
                                                {infoUser.nv_quyen === 'ld' && (
                                                    <>
                                                        <Tippy
                                                            content="Chỉnh sửa"
                                                            placement="bottom"
                                                        >
                                                            <button
                                                                className={cx('handle', 'edit-btn')}
                                                                onClick={() =>
                                                                    togglePopupEdit(dv.dv_id)
                                                                }
                                                            >
                                                                <FontAwesomeIcon
                                                                    icon={faPenToSquare}
                                                                />
                                                            </button>
                                                        </Tippy>
                                                        <Tippy content="Xóa" placement="bottom">
                                                            <button
                                                                className={cx(
                                                                    'handle',
                                                                    'delete-btn',
                                                                )}
                                                                onClick={() => handleXoaDonVi(dv)}
                                                            >
                                                                <FontAwesomeIcon icon={faTrash} />
                                                            </button>
                                                        </Tippy>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {sortedDonVi.length > PER_PAGE && (
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

export default DonVi;
