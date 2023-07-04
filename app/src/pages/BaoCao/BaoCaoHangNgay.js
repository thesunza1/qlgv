import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faArrowUp,
    faArrowDown,
    faSave,
    faPlus,
    faCaretRight,
    faCaretDown,
    faPenToSquare,
    faTrash,
    faCancel,
    faCircleMinus,
    faCheck,
    faRotateRight,
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import Tippy from '@tippyjs/react';
import axiosClient from '~/api/axiosClient';
import cogoToast from 'cogo-toast';
import moment from 'moment';
import classNames from 'classnames/bind';
import styles from './BaoCao.module.scss';
import BaoCaoKeHoach from './BaoCaoKeHoach';
import BaoCaoCongViec from './BaoCaoCongViec';
import swal from 'sweetalert';

const cx = classNames.bind(styles);

function BaoCaoHangNgay() {
    const [infoUser, setInfoUser] = useState([]);
    const [dSBaoCaoHangNgay, setDSBaoCaoHangNgay] = useState([]);
    const [dSBaocao, setDSBaocao] = useState([]);
    const [sortColumn, setSortColumn] = useState('');
    const [sortDirection, setSortDirection] = useState('');
    const [searchText, setSearchText] = useState('');
    const [isBaoCao, setIsBaoCao] = useState(true);
    const [icon, setIcon] = useState(faCaretDown);
    const [displayedBaocao, setDisplayedBaocao] = useState([]);
    const [themBaoCao, setThemBaoCao] = useState([]);
    const [dSCongViec, setDSCongViec] = useState([]);
    const [dateFilter, setDateFilter] = useState({
        month: new Date().getMonth(),
        year: new Date().getFullYear(),
    });
    const [dSNhanVien, setDSNhanVien] = useState([]);
    const [filterName, setFilterName] = useState('');
    const [filterState, setFilterState] = useState('');

    const getDSBaoCaoHangNgay = async () => {
        const token = localStorage.getItem('Token');
        const response = await axiosClient.get(`/get_CV_BC_HangNgay?token=${token}`);
        setDSBaoCaoHangNgay(response.data);
    };

    useEffect(() => {
        getDSBaoCaoHangNgay();
    }, []);

    useEffect(() => {
        const getInfoUser = async () => {
            const token = localStorage.getItem('Token');
            const response = await axiosClient.get(`/get_CongViec?token=${token}`);
            setDSCongViec(response.data);
        };
        getInfoUser();
    }, []);

    useEffect(() => {
        const getInfoUser = async () => {
            const token = localStorage.getItem('Token');
            const response = await axiosClient.get(`/user-info?token=${token}`);
            setInfoUser(response.data.result);
        };
        getInfoUser();
    }, []);

    useEffect(() => {
        const getListNhanVien = async () => {
            const response = await axiosClient.get('/get_NhanVien');
            setDSNhanVien(response.data.nhanViens);
        };
        getListNhanVien();
    }, []);

    useEffect(() => {
        setDSBaocao(
            dSBaoCaoHangNgay.map((bc) => ({
                ...bc,
                isEdit: false,
                isChecked: false,
            })),
        );
    }, [dSBaoCaoHangNgay]);

    const loadBaoCaoHangNgay = async () => {
        await getDSBaoCaoHangNgay();
        setDSBaocao(
            dSBaoCaoHangNgay.map((bc) => ({
                ...bc,
                isEdit: false,
                isChecked: false,
            })),
        );
        await filterBaocao();
        await sortedData();
    };

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

    const handleChangeSearchInput = (event) => {
        setSearchText(event.target.value);
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
    };

    const handleChangeDate = (event) => {
        const { name, value } = event.target;
        setDateFilter((prevState) => ({
            ...prevState,
            [name]: value === '' ? '' : parseInt(value),
        }));
    };

    const formatDate = (dateString) => {
        const [day, month, year] = dateString.split('-');
        return `${month}-${day}-${year}`;
    };

    const filterBaocao = (baocao) => {
        const searchedBaocao = baocao
            .filter(
                (bc) =>
                    bc.cong_viec.ten_cong_viec.toLowerCase().includes(searchText.toLowerCase()) &&
                    (filterName === '' || bc.nhan_vien?.ten_nhan_vien.toString() === filterName) &&
                    (filterState === '' || bc.bchn_trangthai === filterState),
            )
            .filter((event) => {
                const formattedDate = formatDate(event.bchn_ngay);
                const eventDate = new Date(formattedDate);
                if (
                    (dateFilter.month === '' || eventDate.getMonth() === dateFilter.month) &&
                    (dateFilter.year === '' || eventDate.getFullYear() === dateFilter.year)
                ) {
                    return true;
                }
                return false;
            })

            .sort((a, b) => {
                if (sortDirection === 'asc') {
                    return a[sortColumn] < b[sortColumn]
                        ? -1
                        : a[sortColumn] > b[sortColumn]
                        ? 1
                        : 0;
                } else {
                    return a[sortColumn] < b[sortColumn]
                        ? 1
                        : a[sortColumn] > b[sortColumn]
                        ? -1
                        : 0;
                }
            });

        return searchedBaocao.filter((bc) => bc !== null) || [];
    };

    useEffect(() => {
        setDisplayedBaocao(filterBaocao(dSBaocao));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchText, sortDirection, sortColumn, dSBaocao, dateFilter, filterName, filterState]);

    const filteredBaocao = displayedBaocao.filter((bc) => bc.bchn_trangthai === '1');

    const totalHour = filteredBaocao.reduce((total, bc) => {
        return total + Number(bc.so_gio_lam);
    }, 0);

    // Tính giờ
    const [startHour] = useState('07:00');
    const [endHour] = useState(moment().format('HH:mm'));
    const [totalHours, setTotalHours] = useState('');

    useEffect(() => {
        const start = moment(`${startHour}:00`, 'HH:mm:ss');
        const end = moment(`${endHour}:00`, 'HH:mm:ss');
        const formattedHours = moment
            .utc(moment.duration(end.diff(start)).asMilliseconds())
            .format('HH.mm');

        setTotalHours(formattedHours);
    }, [startHour, endHour]);

    // Thêm báo cáo
    const handleAddRowTable = () => {
        const newRow = {
            cv_id: '',
            bdhn_tiendo: 10,
            bchn_noidung: '',
            so_gio_lam: totalHours.toString(),
            bchn_giobatdau: startHour,
            bchn_gioketthuc: endHour,
        };
        setThemBaoCao((prevRows) => [...prevRows, newRow]);
    };

    const handleChangeNewInput = (event, index) => {
        const { name, value } = event.target;
        setThemBaoCao((prevRows) =>
            prevRows.map((row, i) => (i === index ? { ...row, [name]: value } : row)),
        );
    };

    const handleCancelAllNewRows = () => {
        setThemBaoCao([]);
    };

    const handleCancelNewRows = (index) => {
        setThemBaoCao((prevRows) => prevRows.filter((_, i) => i !== index));
    };

    // Thêm báo cáo
    const handleThemBaoCao = async (e) => {
        e.preventDefault();

        const danh_sach_cong_viec_bao_cao = [];

        for (let bc of themBaoCao) {
            const {
                cv_id,
                bdhn_tiendo,
                bchn_noidung,
                so_gio_lam,
                bchn_giobatdau,
                bchn_gioketthuc,
            } = bc;
            danh_sach_cong_viec_bao_cao.push({
                cv_id,
                bdhn_tiendo,
                bchn_noidung,
                so_gio_lam,
                bchn_giobatdau,
                bchn_gioketthuc,
            });
        }

        const token = localStorage.getItem('Token');

        const response = await axiosClient.post(`/add_CV_BC_HangNgay?token=${token}`, {
            danh_sach_cong_viec_bao_cao,
        });

        if (response.status === 200) {
            setThemBaoCao([]);
            await loadBaoCaoHangNgay();
            cogoToast.success(`Báo cáo đã được thêm`, {
                position: 'top-right',
            });
        }
    };

    // Xóa báo cáo
    const handleXoaBaoCao = (bc) => {
        swal({
            title: `Bạn chắc chắn muốn xóa báo cáo ${bc.cong_viec.ten_cong_viec.toUpperCase()} này`,
            text: 'Sau khi xóa, bạn sẽ không thể khôi phục báo cáo này!',
            icon: 'warning',
            buttons: true,
            dangerMode: true,
        }).then(async (willDelete) => {
            if (willDelete) {
                const deletebchn_ids = [bc.bchn_id];
                await axiosClient.delete('/delete_CV_BC_HangNgay', {
                    data: { deletebchn_ids },
                });
                await loadBaoCaoHangNgay();
                swal(`${bc.cong_viec.ten_cong_viec.toUpperCase()} đã được xóa`, {
                    icon: 'success',
                });
            } else {
                return;
            }
        });
    };

    // Chỉnh sửa báo cáo
    const [chinhSuaBaoCao, setChinhSuaBaoCao] = useState([]);

    const handleEditRow = (id) => {
        const newData = displayedBaocao.map((bc) =>
            bc.bchn_id === id ? { ...bc, isEdit: true } : bc,
        );
        setDisplayedBaocao(newData);
    };

    const handleCancelRow = (id) => {
        const newData = displayedBaocao.map((bc) =>
            bc.bchn_id === id ? { ...bc, isEdit: false } : bc,
        );
        setDisplayedBaocao(newData);
    };

    const handleChangeEditInput = (event, id, name) => {
        const { value } = event.target;

        let newData;
        const changedItem = { bchn_id: id, [name]: value };
        const existingItemIndex = chinhSuaBaoCao.findIndex((item) => item.bchn_id === id);

        if (existingItemIndex !== -1) {
            const updatedData = [...chinhSuaBaoCao];
            updatedData[existingItemIndex] = {
                ...updatedData[existingItemIndex],
                ...changedItem,
            };
            setChinhSuaBaoCao(updatedData);
        } else {
            setChinhSuaBaoCao([...chinhSuaBaoCao, changedItem]);
        }

        newData = displayedBaocao.map((row) =>
            row.bchn_id === id ? { ...row, [name]: value } : row,
        );
        setDisplayedBaocao(newData);
    };

    const handleSaveChinhSuaBaoCao = async (e) => {
        e.preventDefault();

        const danh_sach_cong_viec_bao_cao = [];

        for (let bc of chinhSuaBaoCao) {
            const { bchn_id, bchn_giothamdinh, bchn_trangthai } = bc;
            danh_sach_cong_viec_bao_cao.push({
                bchn_id,
                bchn_giothamdinh,
                bchn_trangthai,
            });
        }

        const token = localStorage.getItem('Token');

        const response = await axiosClient.put(`/update_TienDoBaoCaoHangNgay?token=${token}`, {
            danh_sach_cong_viec_bao_cao,
        });

        if (response.status === 200) {
            await loadBaoCaoHangNgay();
            cogoToast.success(`Báo cáo đã được cập nhật`, {
                position: 'top-right',
            });
        }
    };

    const handleChangeCheckBox = (event, id, so_gio_lam) => {
        const { checked } = event.target;
        const newData = displayedBaocao.map((row) =>
            row.bchn_id === id ? { ...row, isChecked: checked } : row,
        );
        setDisplayedBaocao(newData);

        if (checked) {
            const existingItemIndex = chinhSuaBaoCao.findIndex((item) => item.bchn_id === id);
            const changedItem = {
                bchn_id: id,
                bchn_trangthai: checked ? '1' : '0',
                bchn_giothamdinh:
                    newData.find((row) => row.bchn_id === id)?.bchn_giothamdinh || so_gio_lam,
            };

            if (existingItemIndex !== -1) {
                const updatedData = [...chinhSuaBaoCao];
                updatedData[existingItemIndex] = {
                    ...updatedData[existingItemIndex],
                    ...changedItem,
                };
                setChinhSuaBaoCao(updatedData);
            } else {
                setChinhSuaBaoCao([...chinhSuaBaoCao, changedItem]);
            }
        } else {
            const filteredData = chinhSuaBaoCao.filter((item) => item.bchn_id !== id);
            setChinhSuaBaoCao(filteredData);
        }
    };

    // Sắp xếp Trạng thái
    const sortedData = [...displayedBaocao].sort((a, b) => {
        if (a.bchn_trangthai === '0' && b.bchn_trangthai !== '0') {
            return -1;
        } else if (a.bchn_trangthai !== '0' && b.bchn_trangthai === '0') {
            return 1;
        }
        return 0;
    });

    return (
        <div className={cx('wrapper')}>
            {infoUser.nv_quyen === 'ld' && <BaoCaoKeHoach />}
            <BaoCaoCongViec />
            <div
                className={cx('title')}
                style={{ fontSize: isBaoCao ? '3rem' : '2rem' }}
                onClick={toggleBaocao}
            >
                <h2 style={{ fontSize: isBaoCao ? '3rem' : '2rem' }}>Báo cáo tiến độ hàng ngày</h2>
                <FontAwesomeIcon className={cx('right-icon')} icon={icon} />
            </div>
            <div style={{ display: isBaoCao ? 'block' : 'none' }}>
                <div className={cx('features')}>
                    <div className={cx('month')}>
                        <select name="month" value={dateFilter.month} onChange={handleChangeDate}>
                            <option value={''}>Tất cả</option>
                            <option value={0}>Tháng 1</option>
                            <option value={1}>Tháng 2</option>
                            <option value={2}>Tháng 3</option>
                            <option value={3}>Tháng 4</option>
                            <option value={4}>Tháng 5</option>
                            <option value={5}>Tháng 6</option>
                            <option value={6}>Tháng 7</option>
                            <option value={7}>Tháng 8</option>
                            <option value={8}>Tháng 9</option>
                            <option value={9}>Tháng 10</option>
                            <option value={10}>Tháng 11</option>
                            <option value={11}>Tháng 12</option>
                        </select>
                        <select name="year" value={dateFilter.year} onChange={handleChangeDate}>
                            <option value={''}>Tất cả</option>
                            <option value={2021}>2021</option>
                            <option value={2022}>2022</option>
                            <option value={2023}>2023</option>
                        </select>
                        <p>
                            Số dòng: <span>{displayedBaocao.length}</span>
                        </p>
                        {infoUser.nv_quyen !== 'ld' && (
                            <p>
                                Tổng số giờ đã làm: <span>{totalHour} giờ</span>
                            </p>
                        )}
                    </div>
                    <div className={cx('filter')}>
                        <div className={cx('filter-item')}>
                            <input
                                type="search"
                                required
                                value={searchText}
                                onChange={handleChangeSearchInput}
                            />
                            <div className={cx('label')}>Tên công việc</div>
                        </div>
                        {infoUser.nv_quyen === 'ld' && (
                            <div className={cx('filter-item')}>
                                <select value={filterName} onChange={handleFilterName}>
                                    <option value="">Tất cả</option>
                                    {dSNhanVien.map((nv) => (
                                        <option key={nv.nv_id} value={nv.nv_ten}>
                                            {nv.nv_ten}
                                        </option>
                                    ))}
                                </select>
                                <div className={cx('label', 'name-respon')}>Người đảm nhiệm</div>
                            </div>
                        )}

                        <div className={cx('filter-item')}>
                            <select value={filterState} onChange={handleFilterState}>
                                <option value="">Tất cả</option>
                                <option value="0">Chưa thẩm định</option>
                                <option value="1">Đã thẩm định</option>
                            </select>
                            <div className={cx('label', 'name')}>Trạng thái</div>
                        </div>
                    </div>
                    <div className={cx('handle-features')}>
                        <button className={cx('reset-btn')} onClick={handleReset}>
                            <FontAwesomeIcon icon={faRotateRight} /> Reset
                        </button>
                        <div>
                            <div>
                                {infoUser.nv_quyenthamdinh === '1' ? (
                                    <button
                                        className={cx('add-btn')}
                                        onClick={handleSaveChinhSuaBaoCao}
                                        disabled={chinhSuaBaoCao.length === 0}
                                    >
                                        <FontAwesomeIcon icon={faCheck} /> Thẩm định
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            className={cx('add-btn')}
                                            onClick={handleAddRowTable}
                                        >
                                            <FontAwesomeIcon icon={faPlus} /> Thêm hàng
                                        </button>
                                        {themBaoCao.length > 0 && (
                                            <>
                                                <button
                                                    className={cx('cancel-btn')}
                                                    onClick={handleCancelAllNewRows}
                                                >
                                                    <FontAwesomeIcon icon={faCancel} /> Hủy tất cả
                                                </button>
                                                <button
                                                    className={cx('save-btn')}
                                                    onClick={handleThemBaoCao}
                                                >
                                                    <FontAwesomeIcon icon={faSave} /> Lưu
                                                </button>
                                            </>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className={cx('inner')}>
                    <table className={cx('table')}>
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th onClick={() => handleSortColumn('bchn_ngay')}>
                                    <span>Thời gian</span>
                                    {sortColumn === 'bchn_ngay' && (
                                        <FontAwesomeIcon
                                            icon={sortDirection === 'asc' ? faArrowUp : faArrowDown}
                                            className={cx('icon')}
                                        />
                                    )}
                                </th>
                                <th>Tên công việc</th>
                                <th>Nội dung công việc</th>
                                {infoUser.nv_quyenthamdinh === '1' && <th>Người đảm nhiệm</th>}
                                <th>Giờ bắt đầu</th>
                                <th>Giờ kết thúc</th>
                                <th>Số giờ làm (h)</th>
                                <th>Tiến độ (%)</th>
                                <th onClick={() => handleSortColumn('bchn_trangthai')}>
                                    <span>Trạng thái</span>
                                    {sortColumn === 'bchn_trangthai' && (
                                        <FontAwesomeIcon
                                            icon={sortDirection === 'asc' ? faArrowUp : faArrowDown}
                                            className={cx('icon')}
                                        />
                                    )}
                                </th>
                                {infoUser.nv_quyenthamdinh === '1' && (
                                    <>
                                        <th>Duyệt giờ (h)</th>
                                        <th>Thẩm định</th>
                                    </>
                                )}
                                <th>Xử lý</th>
                            </tr>
                        </thead>
                        <tbody>
                            {themBaoCao.length > 0 &&
                                themBaoCao.map((bc, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>
                                            <input
                                                type="date"
                                                defaultValue={new Date()
                                                    .toISOString()
                                                    .substr(0, 10)}
                                                disabled
                                            />
                                        </td>
                                        <td>
                                            <select
                                                name="cv_id"
                                                value={bc.cv_id}
                                                onChange={(e) => handleChangeNewInput(e, index)}
                                            >
                                                <option value="" disabled>
                                                    Chọn tên công việc
                                                </option>
                                                {dSCongViec.map((cv) => (
                                                    <option key={cv.cv_id} value={cv.cv_id}>
                                                        {cv.cv_ten}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td>
                                            <textarea
                                                name="bchn_noidung"
                                                value={bc.bchn_noidung}
                                                onChange={(e) => handleChangeNewInput(e, index)}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="time"
                                                name="bchn_giobatdau"
                                                value={bc.bchn_giobatdau}
                                                onChange={(e) => handleChangeNewInput(e, index)}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="time"
                                                name="bchn_gioketthuc"
                                                value={bc.bchn_gioketthuc}
                                                onChange={(e) => handleChangeNewInput(e, index)}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                min="1"
                                                max="24"
                                                name="so_gio_lam"
                                                value={bc.so_gio_lam}
                                                onChange={(e) => handleChangeNewInput(e, index)}
                                                onInvalid={(e) => {
                                                    e.target.setCustomValidity(
                                                        'Giá trị phải từ 1 đến 24',
                                                    );
                                                }}
                                                onInput={(e) => {
                                                    e.target.setCustomValidity('');
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                placeholder="1-100"
                                                min="1"
                                                max="100"
                                                name="bdhn_tiendo"
                                                value={bc.bdhn_tiendo}
                                                onChange={(e) => handleChangeNewInput(e, index)}
                                                onInvalid={(e) => {
                                                    e.target.setCustomValidity(
                                                        'Giá trị phải từ 1 đến 24',
                                                    );
                                                }}
                                                onInput={(e) => {
                                                    e.target.setCustomValidity('');
                                                }}
                                            />
                                        </td>
                                        <td>Chưa thẩm định</td>
                                        <td>
                                            <Tippy content="Hủy" placement="bottom">
                                                <button
                                                    className={cx('handle', 'cancle-btn')}
                                                    onClick={() => handleCancelNewRows(index)}
                                                >
                                                    <FontAwesomeIcon icon={faCircleMinus} />
                                                </button>
                                            </Tippy>
                                        </td>
                                    </tr>
                                ))}
                            {sortedData.length > 0 ? (
                                <>
                                    {sortedData.map((bc, index) => (
                                        <tr key={bc.bchn_id}>
                                            {bc.isEdit ? (
                                                <>
                                                    <td>{index + 1}</td>
                                                    <td style={{ textAlign: 'left' }}>
                                                        {bc.bchn_ngay.split(' ')[0]}
                                                    </td>
                                                    <td style={{ textAlign: 'left' }}>
                                                        {bc.cong_viec?.ten_cong_viec}
                                                    </td>
                                                    <td style={{ textAlign: 'left' }}>
                                                        {bc.bchn_noidung}
                                                    </td>
                                                    {infoUser.nv_quyenthamdinh === '1' && (
                                                        <td style={{ textAlign: 'left' }}>
                                                            {bc.nhan_vien_lam?.ten_nhan_vien}
                                                        </td>
                                                    )}
                                                    <td>{bc.bchn_giobatdau}</td>
                                                    <td>{bc.bchn_gioketthuc}</td>
                                                    <td>{bc.so_gio_lam}</td>
                                                    <td>{bc.bchn_tiendo}</td>
                                                    <td
                                                        className={
                                                            bc.bchn_trangthai === '1'
                                                                ? cx('tham-dinh')
                                                                : ''
                                                        }
                                                    >
                                                        Chưa thẩm định
                                                    </td>
                                                    {infoUser.nv_quyenthamdinh === '1' && (
                                                        <>
                                                            <td>
                                                                <input
                                                                    type="number"
                                                                    min="1"
                                                                    max={bc.so_gio_lam}
                                                                    name="bchn_giothamdinh"
                                                                    value={
                                                                        bc.bchn_giothamdinh ||
                                                                        bc.so_gio_lam
                                                                    }
                                                                    onChange={(e) =>
                                                                        handleChangeEditInput(
                                                                            e,
                                                                            bc.bchn_id,
                                                                            'bchn_giothamdinh',
                                                                        )
                                                                    }
                                                                />
                                                            </td>
                                                            <td>
                                                                <input
                                                                    type="checkbox"
                                                                    value={bc.isChecked}
                                                                    onChange={(e) =>
                                                                        handleChangeCheckBox(
                                                                            e,
                                                                            bc.bchn_id,
                                                                            bc.so_gio_lam,
                                                                        )
                                                                    }
                                                                />
                                                            </td>
                                                        </>
                                                    )}
                                                    <td>
                                                        <Link>
                                                            <Tippy content="Lưu" placement="bottom">
                                                                <button
                                                                    className={cx(
                                                                        'handle',
                                                                        'save-btn',
                                                                    )}
                                                                    onClick={
                                                                        handleSaveChinhSuaBaoCao
                                                                    }
                                                                >
                                                                    <FontAwesomeIcon
                                                                        icon={faSave}
                                                                    />
                                                                </button>
                                                            </Tippy>
                                                            <Tippy content="Hủy" placement="bottom">
                                                                <button
                                                                    className={cx(
                                                                        'handle',
                                                                        'cancle-btn',
                                                                    )}
                                                                    onClick={() =>
                                                                        handleCancelRow(bc.bchn_id)
                                                                    }
                                                                >
                                                                    <FontAwesomeIcon
                                                                        icon={faCircleMinus}
                                                                    />
                                                                </button>
                                                            </Tippy>
                                                        </Link>
                                                    </td>
                                                </>
                                            ) : (
                                                <>
                                                    <td>{index + 1}</td>
                                                    <td style={{ textAlign: 'left' }}>
                                                        {bc.bchn_ngay.split(' ')[0]}
                                                    </td>
                                                    <td style={{ textAlign: 'left' }}>
                                                        {bc.cong_viec?.ten_cong_viec}
                                                    </td>
                                                    <td style={{ textAlign: 'left' }}>
                                                        {bc.bchn_noidung}
                                                    </td>
                                                    {infoUser.nv_quyenthamdinh === '1' && (
                                                        <td style={{ textAlign: 'left' }}>
                                                            {bc.nhan_vien?.ten_nhan_vien}
                                                        </td>
                                                    )}
                                                    <td>{bc.bchn_giobatdau}</td>
                                                    <td>{bc.bchn_gioketthuc}</td>
                                                    <td>{bc.so_gio_lam}</td>
                                                    <td>{bc.bchn_tiendo}</td>
                                                    <td
                                                        className={
                                                            bc.bchn_trangthai === '1'
                                                                ? cx('tham-dinh')
                                                                : ''
                                                        }
                                                    >
                                                        {bc.bchn_trangthai === '0'
                                                            ? 'Chưa thẩm định'
                                                            : 'Đã thẩm định'}
                                                    </td>
                                                    {infoUser.nv_quyenthamdinh === '1' && (
                                                        <td>{bc.bchn_giothamdinh}</td>
                                                    )}
                                                    {infoUser.nv_quyenthamdinh === '1' &&
                                                        bc.bchn_trangthai === '0' && (
                                                            <td>
                                                                <input
                                                                    type="checkbox"
                                                                    value={bc.isChecked}
                                                                    onChange={(e) =>
                                                                        handleChangeCheckBox(
                                                                            e,
                                                                            bc.bchn_id,
                                                                            bc.so_gio_lam,
                                                                        )
                                                                    }
                                                                />
                                                            </td>
                                                        )}
                                                    <td colSpan="2">
                                                        {bc.bchn_trangthai === '0' && (
                                                            <>
                                                                {infoUser.nv_quyenthamdinh ===
                                                                '1' ? (
                                                                    <Tippy
                                                                        content="Chỉnh sửa"
                                                                        placement="bottom"
                                                                    >
                                                                        <button
                                                                            className={cx(
                                                                                'handle',
                                                                                'edit-btn',
                                                                            )}
                                                                            onClick={() =>
                                                                                handleEditRow(
                                                                                    bc.bchn_id,
                                                                                )
                                                                            }
                                                                        >
                                                                            <FontAwesomeIcon
                                                                                icon={faPenToSquare}
                                                                            />
                                                                        </button>
                                                                    </Tippy>
                                                                ) : (
                                                                    <Tippy
                                                                        content="Xóa"
                                                                        placement="bottom"
                                                                    >
                                                                        <button
                                                                            className={cx(
                                                                                'handle',
                                                                                'delete-btn',
                                                                            )}
                                                                            onClick={() =>
                                                                                handleXoaBaoCao(bc)
                                                                            }
                                                                        >
                                                                            <FontAwesomeIcon
                                                                                icon={faTrash}
                                                                            />
                                                                        </button>
                                                                    </Tippy>
                                                                )}
                                                            </>
                                                        )}
                                                    </td>
                                                </>
                                            )}
                                        </tr>
                                    ))}
                                </>
                            ) : (
                                <tr className={cx('no-result-bchn')}>
                                    <td colSpan="15">Không có kết quả tìm kiếm</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default BaoCaoHangNgay;
