import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faSearch,
    faPlus,
    faPenToSquare,
    faTrash,
    faAnglesLeft,
    faAnglesRight,
    faEnvelope,
    faCircleArrowLeft,
    faSave,
    faCircleCheck,
    faCalendarCheck,
} from '@fortawesome/free-solid-svg-icons';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import ReactPaginate from 'react-paginate';
import axiosClient from '~/api/axiosClient';
import classNames from 'classnames/bind';
import styles from './CongViec.module.scss';
import swal from 'sweetalert';

const cx = classNames.bind(styles);

function CongViec() {
    const navigate = useNavigate();
    const [dSCongViec, setDSCongViec] = useState([]);
    const [sortColumn, setSortColumn] = useState('');
    const [sortDirection, setSortDirection] = useState('');
    const [searchText, setSearchText] = useState('');
    const [currentPage, setCurrentPage] = useState(0);

    const PER_PAGE = 10;

    useEffect(() => {
        const getListProduct = async () => {
            const token = localStorage.getItem('Token');
            const response = await axiosClient.get(`/get_CongViec?token=${token}`);
            setDSCongViec(response.data.cong_viecs);
            // console.log(dSCongViec)
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

    // const sortedCongViec = useMemo(() => {
    //     let sortedItems = [...dSCongViec];
    //     sortedItems = sortedItems.sort((a, b) =>
    //         a[sortColumn] > b[sortColumn] ? 1 : b[sortColumn] > a[sortColumn] ? -1 : 0,
    //     );
    //     if (sortDirection === 'asc') {
    //         sortedItems.reverse();
    //     }
    //     return sortedItems;
    // }, [dSCongViec, sortColumn, sortDirection]);

    const sortedCongViec = useMemo(() => {
        let sortedItems = [...dSCongViec];
        sortedItems = sortedItems.sort((a, b) =>
            a[sortColumn] > b[sortColumn] ? 1 : b[sortColumn] > a[sortColumn] ? -1 : 0,
        );
        if (sortDirection === 'asc') {
            sortedItems.reverse();
        }

        // move 'Chưa hoàn thành' tasks to the top
        sortedItems = sortedItems.sort((a, b) => {
            if (a.cv_trangthai === '0' && b.cv_trangthai !== '0') {
                return -1;
            } else if (a.cv_trangthai !== '1' && b.cv_trangthai === '1') {
                return 1;
            } else {
                return 0;
            }
        });

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
    function trangThai(trangThai) {
        switch (trangThai) {
            case '0':
                return <button className={cx('done-btn')}>Đang Soạn</button>;
            case '1':
                return <button className={cx('done-btn')}>Đợi duyệt</button>;
            case '2':
                return <button className={cx('done-btn')}>Đang thực hiện</button>;
            case '3':
                return <button className={cx('out-date-btn')}>Hoàn thành</button>;
            default:
                return <button className={cx('chuaht-btn')}>Chưa hoàn thành</button>;
        }
    }
    const displayedCongViec = getDisplayCongViec();
    const [optionList, setOptionList] = useState([]);
    const [optionListDV, setOptionListDV] = useState([]);
    const [optionListKH, setOptionListKH] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            const resSoNhanVien = await axiosClient.get(`/get_NhanVien`);
            const resDonVi = await axiosClient.get(`/get_DonVi`);
            const resKH = await axiosClient.get(
                `/get_CV_KeHoach?token=${localStorage.getItem('Token')}`,
            );
            setOptionList(resSoNhanVien.data.nhanViens);
            setOptionListDV(resDonVi.data.don_vis);
            setOptionListKH(resKH.data.ke_hoachs);
        };

        fetchData();
    }, []);

    const handleGiaoViec = (cv) => {
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
    const [newCongViec, setNewCongViec] = useState({
        cv_ten: '',
        kh_id: '',
        cv_thgianbatdau: '',
        cv_thgianhoanthanh: '',
        cv_mucdich: '',
        dv_id: '',
        nv_id: '',
        cv_trangthai: '',
    });
    const handleNewCongViecInputChange = (event) => {
        const { name, value } = event.target;
        setNewCongViec((prevValue) => ({
            ...prevValue,
            [name]: value,
        }));
    };
    const [creatingNewCongViec, setCreatingNewCongViec] = useState(false);

    // const handleCreateNewCongViec = async (e) => {
    //     e.preventDefault();

    //     const { cv_stt, cv_ten, cv_thgianbatdau, cv_thgianketthuc, kh_id, nv_id, dv_id } = newCongViec;
    //     console.log(newCongViec)
    //     const token = localStorage.getItem('Token')
    //     const response = await axiosClient.post(`/add_CongViec/${kh_id}?token=${token}`, {
    //         cv_ten,
    //         kh_id,
    //         cv_thgianbatdau,
    //         cv_thgianketthuc,
    //         cv_stt,
    //         nv_id,
    //         dv_id,
    //     });
    //     if (response.status === 200) {
    //         navigate('/qlcv/kehoach');
    //         swal(`Thêm kế hoạch ${cv_ten.toUpperCase()} mới thành công`, {
    //             position: 'top-right',
    //         });
    //     } else { alert('error') }
    // };
    const handleCreateNewCongViec = async (e) => {
        e.preventDefault();

        const {
            cv_ten,
            cv_thgianbatdau,
            cv_trangthai,
            cv_noidung,
            cv_cv_cha,
            cv_trongso,
            dv_id,
            kh_id,
            da_id,
            n_cv_id,
            cv_hanhoanthanh,
            cv_tgthuchien,
        } = newCongViec;
        console.log(newCongViec);
        const token = localStorage.getItem('Token');
        const response = await axiosClient.post(`/add_CongViec/${kh_id}?token=${token}`, {
            cv_ten,
            cv_thgianbatdau,
            cv_trangthai,
            cv_noidung,
            cv_cv_cha,
            cv_trongso,
            dv_id,
            kh_id,
            da_id,
            n_cv_id,
            cv_hanhoanthanh,
            cv_tgthuchien,
        });

        if (response.status === 200) {
            navigate('/qlcv/kehoach');
            swal(`Thêm công việc ${cv_ten.toUpperCase()} mới thành công`, {
                position: 'top-right',
            });
        } else {
            alert('Có lỗi xảy ra, vui lòng thử lại sau.');
        }
    };

    const handleCancelNewCongViec = () => {
        setNewCongViec({
            cv_ten: '',
            kh_ten: '',
            cv_thgianbatdau: '',
            cv_thgianhoanthanh: '',
            cv_mucdich: '',
            dv_id: '',
            nv_id: '',
            cv_trangthai: '',
        });
        setCreatingNewCongViec(false);
    };

    const handleAddNewCongViec = () => {
        setCreatingNewCongViec(true);
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('inner')}>
                <div className={cx('title')}>
                    <h2>
                        {' '}
                        <Link to="/qlcv/kehoach">
                            <FontAwesomeIcon className={cx('back-icon')} icon={faCircleArrowLeft} />
                        </Link>
                        Công Việc
                    </h2>
                </div>
                <div className={cx('features')}>
                    <Link to="dsxingiahan" className={cx('add-btn')}>
                        <FontAwesomeIcon icon={faPlus} /> Danh sách xin gia hạn
                    </Link>
                    <div className={cx('search')}>
                        <input
                            type="search"
                            placeholder="Tìm kiếm công việc"
                            value={searchText}
                            onChange={handleSearchInputChange}
                        />
                        <FontAwesomeIcon icon={faSearch} />
                    </div>
                    <button className={cx('add-btn')} onClick={handleAddNewCongViec}>
                        <FontAwesomeIcon icon={faPlus} /> Thêm
                    </button>
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
                                    <th onClick={() => handleSortColumn('kh_ten')}>
                                        <span>Tên kế hoạch</span>
                                    </th>
                                    {/* <th onClick={() => handleSortColumn('cv_thgianbatdau')}>
                                        Thời gian bắt đầu
                                    </th> */}
                                    <th onClick={() => handleSortColumn('cv_thgianhoanthanh')}>
                                        <span>Thời gian hết hạn</span>
                                    </th>
                                    <th>Mục đích hoàn thành</th>

                                    <th onClick={() => handleSortColumn('dv_id')}>Đơn vị</th>
                                    <th onClick={() => handleSortColumn('nv_id')}>Nhân viên</th>
                                    <th className={cx('center')} onClick={() => handleSortColumn('cv_tiendo')}>Tiến độ</th>
                                    <th onClick={() => handleSortColumn('cv_trangthai')}>
                                        Trạng thái
                                    </th>
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
                                        <td>{cv.ke_hoachs?.kh_ten || '-'}</td>
                                        {/* <td>{cv.cv_thgianbatdau.split(' ')[0]}</td> */}
                                        <td>
                                            {cv.cv_thgianhoanthanh
                                                ? cv.cv_thgianhoanthanh.split(' ')[0]
                                                : '-'}
                                        </td>
                                        <td>Mục đích hoàn thành</td>

                                        <td>{cv.don_vi.dv_ten}</td>
                                        {/* <td>
                                            <select
                                                pla={cv.don_vi.dv_ten}
                                                value={cv.don_vi.dv_ten}
                                                onChange={(e) => {
                                                    const selectedValue = e.target.value;
                                                    const updatedCV = { ...cv, don_vi: { dv_ten: selectedValue } };
                                                    setDSCongViec((prev) =>
                                                        prev.map((prevCV) =>
                                                            prevCV.cv_id === cv.cv_id ? updatedCV : prevCV
                                                        )
                                                    );
                                                }}
                                            >
                                                {optionListDV.map((item) => (
                                                    <option key={item.dv_id} value={item.dv_id}>
                                                        {item.dv_ten}
                                                    </option>
                                                ))}
                                            </select>
                                        </td> */}
                                        <td>{cv.nhan_vien.nv_ten}</td>
                                        <td className={cx('center')}>{cv.cv_tiendo}%</td>
                                        {/* <td>
                                            <select
                                                placeholder={cv.nhan_vien.nv_ten}
                                                value={cv.nhan_vien.nv_ten}
                                                onChange={(e) => {
                                                    const selectedValue = e.target.value;
                                                    const updatedCV = { ...cv, nhan_vien: { nv_ten: selectedValue } };
                                                    setDSCongViec((prev) =>
                                                        prev.map((prevCV) =>
                                                            prevCV.cv_id === cv.cv_id ? updatedCV : prevCV
                                                        )
                                                    );
                                                }}
                                            >
                                                {optionList.map((item) => (
                                                    <option key={item.nv_id} value={item.nv_id}>
                                                        {item.nv_ten}
                                                    </option>
                                                ))}
                                            </select>
                                        </td> */}
                                        <td>{trangThai(cv.cv_trangthai)}</td>
                                        <td className={cx('center')}>
                                            <Tippy content="Duyệt" placement="bottom">
                                                <button
                                                    className={cx('handle', 'check-btn')}
                                                    onClick={handleXoaCongViec}
                                                >
                                                    <FontAwesomeIcon icon={faCalendarCheck} />
                                                </button>
                                            </Tippy>
                                            <Link
                                                to={`/qlcv/congviec/${cv.cv_id}/${cv.cv_ten}/${cv.cv_thgianhoanthanh}/xingiahan`}
                                            >
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
                                            <Link
                                                to={`/qlcv/congviec/${cv.cv_id}/${cv.cv_ten}/${cv.cv_thgianbatdau}/${cv.cv_thgianhoanthanh}/${cv.dv_id}/${cv.nv_id}/chinhsua`}
                                            >
                                                <Tippy content="Chỉnh sửa" placement="bottom">
                                                    <button className={cx('handle', 'edit-btn')}>
                                                        <FontAwesomeIcon icon={faPenToSquare} />
                                                    </button>
                                                </Tippy>
                                            </Link>
                                            <Tippy content="Xóa" placement="bottom">
                                                <button
                                                    className={cx('handle', 'delete-btn')}
                                                    onClick={handleXoaCongViec}
                                                >
                                                    <FontAwesomeIcon icon={faTrash} />
                                                </button>
                                            </Tippy>

                                        </td>
                                    </tr>
                                ))}
                                {creatingNewCongViec && (
                                    <tr>
                                        <td>
                                            <input
                                                className={cx('small-input')}
                                                type="text"
                                                name="cv_stt"
                                                value={sortedCongViec.length + 1}
                                                onChange={handleNewCongViecInputChange}
                                            /></td>
                                        <td>
                                            <input
                                                placeholder='Tên công việc'
                                                type="text"
                                                name="cv_ten"
                                                value={newCongViec.cv_ten}
                                                onChange={handleNewCongViecInputChange}
                                            />
                                        </td>
                                        <td>
                                            {/* 
                                             */}
                                            <select

                                                name="kh_id"
                                                value={newCongViec.kh_id}
                                                onChange={handleNewCongViecInputChange}
                                            >
                                                <option>--Chọn kế hoạch--</option>
                                                {optionListKH.map((item) => (
                                                    <>
                                                        <option key={item.kh_id} value={item.kh_id}>
                                                            {item.kh_ten}
                                                        </option>
                                                    </>
                                                ))}
                                            </select>
                                        </td>
                                        <td>
                                            <input
                                                type="date"
                                                name="cv_thgianbatdau"
                                                value={newCongViec.cv_thgianbatdau}
                                                onChange={handleNewCongViecInputChange}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="date"
                                                name="cv_thgianhoanthanh"
                                                value={newCongViec.cv_thgianhoanthanh}
                                                onChange={handleNewCongViecInputChange}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                placeholder='Mục đích'
                                                type="text"
                                                name="cv_mucdich"
                                                value={newCongViec.cv_mucdich}
                                                onChange={handleNewCongViecInputChange}
                                            />
                                        </td>
                                        <td>
                                            <select
                                                name="dv_id"
                                                value={newCongViec.dv_id}
                                                onChange={handleNewCongViecInputChange}
                                            >
                                                <option>--Chọn đơn vị--</option>
                                                {optionListDV.map((item) => (
                                                    <>
                                                        <option key={item.dv_id} value={item.dv_id}>
                                                            {item.dv_ten}
                                                        </option>
                                                    </>
                                                ))}
                                            </select>
                                        </td>
                                        <td>
                                            <select
                                                name="nv_id"
                                                value={newCongViec.nv_id}
                                                onChange={handleNewCongViecInputChange}
                                            >
                                                <option>--Chọn nhân viên--</option>
                                                {optionList.map((item) => (
                                                    <option key={item.nv_id} value={item.nv_id}>
                                                        {item.nv_ten}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td>
                                            <input
                                                className={cx('small-input')}
                                                placeholder='Trạng thái'
                                                type="number"
                                                name="cv_trangthai"
                                                value='0'
                                                onChange={handleNewCongViecInputChange}
                                            />
                                        </td>

                                        <td>
                                            <button className={cx('save-btn')} onClick={handleCreateNewCongViec}>Lưu</button>
                                            <button className={cx('cancel-btn')} onClick={handleCancelNewCongViec}>Hủy</button>
                                        </td>
                                    </tr>
                                )}
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

export default CongViec;
