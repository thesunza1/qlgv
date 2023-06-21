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
} from '@fortawesome/free-solid-svg-icons';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import ReactPaginate from 'react-paginate';
import axiosClient from '~/api/axiosClient';
import classNames from 'classnames/bind';
import styles from './KeHoach.module.scss';
import CongViecDotXuat from './CongViecDotXuat/CongViecDotXuat';
import swal from 'sweetalert';
const cx = classNames.bind(styles);

function KeHoach() {
    const [dSKeHoach, setDSKeHoach] = useState([]);
    const [sortColumn, setSortColumn] = useState('');
    const [sortDirection, setSortDirection] = useState('');
    const [searchText, setSearchText] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    // const [loading, setLoading] = useState(true);
    const PER_PAGE = 5;

    useEffect(() => {
        const getListProduct = async () => {
            const token = localStorage.getItem('Token')
            const response = await axiosClient.get(`/get_CV_KeHoach?token=${token}`);
            setDSKeHoach(response.data.ke_hoachs || []);
            // setLoading(false);
        };
        getListProduct();
    }, []);
    // const plansWithEmployee = dSKeHoach.filter(plan => plan.nhan_vien !== null);

    // // Map the new array to extract nv_ten property
    // const employees = useMemo(
    //     () => dSKeHoach.filter(plan => plan.nhan_vien !== null).map(plan => plan.nhan_vien.nv_ten),
    //     [dSKeHoach]
    // );
    // const unit = useMemo(
    //     () => dSKeHoach.filter(plan => plan.don_vi !== null).map(plan => plan.don_vi.dv_ten),
    //     [dSKeHoach]
    // );

    // Print the array of nv_ten values
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
    const handleXoaKH = (kh) => {
        swal({
            title: `Bạn chắc chắn muốn xóa kế hoạch ${kh.kh_ten.toUpperCase()} này`,
            text: 'Sau khi xóa, bạn sẽ không thể khôi phục công việc này!',
            icon: 'warning',
            buttons: true,
            dangerMode: true,
        }).then(async (willDelete) => {
            if (willDelete) {
                try {
                    const token = localStorage.getItem('Token');
                    const response = await axiosClient.delete('/delete_KeHoach', {
                        data: { delletekh_ids: [kh.kh_id] }, // pass an array of the ID to delete
                        params: { token: token },
                    });
                    if (response.status === 200) {
                        swal(`Kế hoạch ${kh.kh_ten} đã được xóa thành công!`, { icon: 'success' });
                        window.location.reload();
                    }
                } catch (error) {
                    console.error(error);
                    swal(`Lỗi khi xóa kế hoạch ${kh.kh_ten} : ${error.message}`, { icon: 'error' });
                }
            } else {
                return;
            }
        });
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
                        <Link to="/qlcv/congviec" className={cx('add-btn')}>
                            <FontAwesomeIcon icon={faPlus} /> Danh sách công việc
                        </Link>
                        <div className={cx('search')}>
                            <input
                                type="search"
                                placeholder="Tìm kiếm kế hoạch"
                                value={searchText}
                                onChange={handleSearchInputChange}
                            />
                            <FontAwesomeIcon icon={faSearch} />
                        </div>
                        <Link to="them" className={cx('add-btn')}>
                            <FontAwesomeIcon icon={faPlus} /> Thêm
                        </Link>

                    </div>
                    {displayedKeHoach.length > 0 ? (
                        <>
                            <table className={cx('table')}>
                                <thead>
                                    <tr>
                                        <th>STT</th>
                                        <th onClick={() => handleSortColumn('kh_ten')}>
                                            <span>Tên kế hoạch</span>
                                        </th>
                                        <th onClick={() => handleSortColumn('kh_thgianbatdau')}>
                                            <span>Thời gian bắt đầu</span>
                                        </th>
                                        <th onClick={() => handleSortColumn('kh_thgianketthuc')}>
                                            <span>Thời gian hết hạn</span>
                                        </th>
                                        <th>Đơn vị</th>
                                        <th>Người lập</th>
                                        <th className={cx('center')}>Tổng thời gian</th>
                                        <th className={cx('center')}>Xử lý</th>
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
                                            <td>{kh.kh_thgianbatdau.split(' ')[0]}</td>
                                            <td>{kh.kh_thgianketthuc.split(' ')[0]}</td>
                                            <td>{kh.don_vi ? kh.don_vi.dv_ten : '-'}</td>
                                            <td>{kh.nhan_vien ? kh.nhan_vien.nv_ten : '-'}</td>
                                            <td className={cx('center')}>{kh.kh_tongthgian}</td>
                                            <td className={cx('center')}>
                                                <Link to={`${kh.kh_id}/${kh.kh_ten}/${kh.nv_id}/${kh.kh_tongthgian}/${kh.kh_thgianketthuc}/chitiet`}>
                                                    <Tippy content="Xem chi tiết" placement="bottom">
                                                        <button className={cx('handle', 'view-btn')}>
                                                            <FontAwesomeIcon icon={faEye} />
                                                        </button>
                                                    </Tippy>
                                                </Link>
                                                <Link to={`${kh.kh_id}/${kh.kh_ten}/${kh.kh_thgianbatdau}/${kh.kh_thgianketthuc}/${kh.kh_tongthgian}/${kh.kh_stt}/chinhsua`}>
                                                    <Tippy content="Chỉnh sửa" placement="bottom">
                                                        <button className={cx('handle', 'edit-btn')}>
                                                            <FontAwesomeIcon icon={faPenToSquare} />
                                                        </button>
                                                    </Tippy>
                                                </Link>
                                                <Tippy content="Xóa" placement="bottom">
                                                    <button className={cx('handle', 'delete-btn')} onClick={() => handleXoaKH(kh)}>
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
