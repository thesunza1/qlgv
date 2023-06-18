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
    faEnvelope,
    faCircleArrowLeft,
    faCalendarCheck,
} from '@fortawesome/free-solid-svg-icons';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import ReactPaginate from 'react-paginate';
import axiosClient from '~/api/axiosClient';
import classNames from 'classnames/bind';
import styles from './dsXinGiaHan.module.scss';
import swal from 'sweetalert';

const cx = classNames.bind(styles);

function DSXinGiaHan() {
    const [dSCongViec, setDSCongViec] = useState([]);
    const [sortColumn, setSortColumn] = useState('');
    const [sortDirection, setSortDirection] = useState('');
    const [searchText, setSearchText] = useState('');
    const [currentPage, setCurrentPage] = useState(0);

    const PER_PAGE = 10;

    useEffect(() => {
        const getListProduct = async () => {
            const token = localStorage.getItem('Token');
            const response = await axiosClient.get(`/dsCongViecXinGiaHan?token=${token}`);
            setDSCongViec(response.data.danh_sach_cong_viec_xingiahan);
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
            cv.cv_id.toLowerCase().includes(searchText.toLowerCase()),
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

    const displayedCongViec = getDisplayCongViec();

    return (
        <div className={cx('wrapper')}>
            <div className={cx('inner')}>
                <div className={cx('title')}>
                    <h2>
                        {' '}
                        <Link to="/qlcv/congviec">
                            <FontAwesomeIcon className={cx('back-icon')} icon={faCircleArrowLeft} />
                        </Link>
                        Danh sách công việc xin gia hạn
                    </h2>
                </div>
                <div className={cx('features')}>
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
                                    <th onClick={() => handleSortColumn('cv_id')}>
                                        <span>Tên công việc</span>
                                    </th>
                                    {/* <th onClick={() => handleSortColumn('cv_thgianbatdau')}>Thời gian bắt đầu</th>
                                    <th onClick={() => handleSortColumn('cv_thgianketthuc')}>
                                        <span>Thời gian hết hạn</span>
                                    </th> */}
                                    <th onClick={() => handleSortColumn('thgiandenghi')}>Thời gian đề nghị</th>
                                    <th onClick={() => handleSortColumn('nv_id')}>Nhân viên</th>

                                    <th>Lý do</th>
                                    <th onClick={() => handleSortColumn('nv_idduyet')}>Người duyệt</th>
                                    <th>Xử lý</th>
                                </tr>
                            </thead>
                            <tbody>
                                {displayedCongViec.map((cv, index) => (
                                    <tr key={cv.cv_id}>
                                        <td>{index + 1 + currentPage * PER_PAGE}</td>
                                        <td>{cv.cv_id}</td>
                                        {/* <td>
                                            {kh.nhan_viens.map((nv) =>
                                                parseInt(kh.dv_id_dvtruong) === nv.nv_id
                                                    ? nv.nv_ten
                                                    : null,
                                            )}
                                        </td> */}
                                        {/* <td>{cv.cv_thgianbatdau}</td>
                                        <td>{cv.cv_thgianketthuc}</td> */}
                                        <td>{cv.thgiandenghi ? cv.thgiandenghi.split(' ')[0] : '-'}</td>
                                        <td>{cv.nv_id}</td>
                                        <td>{cv.lido}</td>
                                        <td>{cv.nv_idduyet}</td>
                                        <td>
                                            <Link to={`/qlcv/congviec/${cv.cv_id}/${cv.cv_ten}/${cv.cv_thgianketthuc}/xingiahan`}>
                                                <Tippy content="duyệt" placement="bottom">
                                                    <button className={cx('handle', 'view-btn')}>
                                                        <FontAwesomeIcon icon={faCalendarCheck} />
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
                                            <Link to={`chinhsua`}>
                                                <Tippy content="Chỉnh sửa" placement="bottom">
                                                    <button className={cx('handle', 'edit-btn')}>
                                                        <FontAwesomeIcon icon={faPenToSquare} />
                                                    </button>
                                                </Tippy>
                                            </Link>
                                            {/* <Tippy content="Xóa" placement="bottom">
                                                <button className={cx('handle', 'delete-btn')} onClick={handleXoaCongViec}>
                                                    <FontAwesomeIcon icon={faTrash} />
                                                </button>
                                            </Tippy> */}
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

export default DSXinGiaHan;
