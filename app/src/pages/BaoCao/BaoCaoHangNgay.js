import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faSearch,
    faArrowUp,
    faArrowDown,
    faSave,
    faPlus,
    faCaretRight,
    faCaretDown,
} from '@fortawesome/free-solid-svg-icons';
import axiosClient from '~/api/axiosClient';
import cogoToast from 'cogo-toast';
import moment from 'moment';
import classNames from 'classnames/bind';
import styles from './BaoCao.module.scss';
import BaoCaoKeHoach from './BaoCaoKeHoach';
import BaoCaoCongViec from './BaoCaoCongViec';

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
    console.log(themBaoCao);

    useEffect(() => {
        const getDSBaoCaoHangNgay = async () => {
            const token = localStorage.getItem('Token');
            const response = await axiosClient.get(`/get_CV_BC_HangNgay?token=${token}`);
            setDSBaoCaoHangNgay(response.data);
        };
        getDSBaoCaoHangNgay();
    }, []);

    useEffect(() => {
        const getInfoUser = async () => {
            const token = localStorage.getItem('Token');
            const response = await axiosClient.get(`/get_CongViec?token=${token}`);
            setDSCongViec(response.data.cong_viecs);
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
        setDSBaocao(
            dSBaoCaoHangNgay.map((bc) => ({
                ...bc,
                isEdit: false,
            })),
        );
    }, [dSBaoCaoHangNgay]);

    const toggleBaocao = () => {
        setIsBaoCao(!isBaoCao);
        if (icon === faCaretRight) {
            setIcon(faCaretDown);
        } else {
            setIcon(faCaretRight);
        }
    };

    const handleChangeInput = (event, rowIndex) => {
        const { name, value } = event.target;
        const updatedBaoCao = [...displayedBaocao];
        updatedBaoCao[rowIndex] = { ...updatedBaoCao[rowIndex], [name]: value };
        setDisplayedBaocao(updatedBaoCao);
    };

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
            window.location.reload();
            cogoToast.success(`Báo cáo đã được thêm`, {
                position: 'top-right',
            });
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

    const handleChangeDate = (event) => {
        const { value, name } = event.target;
        setDateFilter((prevFilter) => ({
            ...prevFilter,
            [name]: parseInt(value),
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
                    bc.cong_viec.ten_cong_viec &&
                    bc.cong_viec.ten_cong_viec.toLowerCase().includes(searchText.toLowerCase()),
            )
            .filter((event) => {
                const formattedDate = formatDate(event.bchn_ngay);
                const eventDate = new Date(formattedDate);
                if (
                    eventDate.getMonth() === dateFilter.month &&
                    eventDate.getFullYear() === dateFilter.year
                ) {
                    return event;
                }
                return null;
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
    }, [searchText, sortDirection, sortColumn, dSBaocao, dateFilter]);

    const filteredBaocao = displayedBaocao.filter((bc) => bc.bchn_trangthai === '1');

    const totalHour = filteredBaocao.reduce((total, bc) => {
        return total + Number(bc.so_gio_lam);
    }, 0);

    // eslint-disable-next-line no-unused-vars
    const [startHour, setStartHour] = useState('07:00');
    // eslint-disable-next-line no-unused-vars
    const [endHour, setEndHour] = useState(moment().format('HH:mm'));
    const [totalHours, setTotalHours] = useState('');

    useEffect(() => {
        const start = moment(`${startHour}:00`, 'HH:mm');
        const end = moment(`${endHour}:00`, 'HH:mm');
        const formattedHours = moment
            .utc(moment.duration(end.diff(start)).asMilliseconds())
            .format('HH:mm');

        setTotalHours(parseInt(formattedHours));
    }, [startHour, endHour]);

    const handleAddRowTable = () => {
        const newRow = {
            cv_id: '',
            bdhn_tiendo: 7,
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
                <div className={cx('month')}>
                    <select name="month" value={dateFilter.month} onChange={handleChangeDate}>
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
                        <option value={2021}>2021</option>
                        <option value={2022}>2022</option>
                        <option value={2023}>2023</option>
                    </select>
                    <p>
                        Số dòng: <span>{displayedBaocao.length}</span>
                    </p>
                    <p>
                        Tổng số giờ đã làm: <span>{totalHour} giờ</span>
                    </p>
                </div>
            </div>
            <div className={cx('inner')} style={{ display: isBaoCao ? 'block' : 'none' }}>
                <div className={cx('features')}>
                    <div className={cx('search')}>
                        <input
                            type="search"
                            placeholder="Tìm kiếm báo cáo"
                            value={searchText}
                            onChange={handleChangeSearchInput}
                        />
                        <FontAwesomeIcon icon={faSearch} />
                    </div>
                    <div>
                        <button className={cx('add-btn')} onClick={handleAddRowTable}>
                            <FontAwesomeIcon icon={faPlus} /> Thêm hàng
                        </button>
                        <button className={cx('save-btn')} onClick={handleThemBaoCao}>
                            <FontAwesomeIcon icon={faSave} /> Lưu
                        </button>
                    </div>
                </div>
                {displayedBaocao.length > 0 ? (
                    <>
                        <table className={cx('table')}>
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th onClick={() => handleSortColumn('bchn_ngay')}>
                                        <span>Thời gian</span>
                                        {sortColumn === 'bchn_ngay' && (
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
                                    <th>Tên công việc</th>
                                    <th>Nội dung công việc</th>
                                    {infoUser.nv_quyenthamdinh === '1' && (
                                        <th
                                            onClick={() =>
                                                handleSortColumn('nhan_vien?.ten_nhan_vien')
                                            }
                                        >
                                            <span>Nhân viên</span>
                                            {sortColumn === 'nhan_vien?.ten_nhan_vien' && (
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
                                    )}
                                    <th>Giờ bắt đầu</th>
                                    <th>Giờ kết thúc</th>
                                    <th>Giờ làm việc (h)</th>
                                    <th>Tiến độ (%)</th>
                                    {infoUser.nv_quyenthamdinh === '1' && <th>Duyệt giờ (h)</th>}
                                    <th onClick={() => handleSortColumn('bchn_trangthai')}>
                                        <span>Trạng thái</span>
                                        {sortColumn === 'bchn_trangthai' && (
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
                                    {infoUser.nv_quyenthamdinh === '1' && <th>Thẩm định</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {themBaoCao.map((bc, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>
                                            <input
                                                type="date"
                                                name="bchn_ngay"
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
                                                // onBlur={(e) => {
                                                //     if (e.target.value > e.target.max) {
                                                //         e.target.value = e.target.max;
                                                //         handleChangeNewInput(e, index);
                                                //     } else if (e.target.value < e.target.min) {
                                                //         e.target.value = e.target.min;
                                                //         handleChangeNewInput(e, index);
                                                //     }
                                                // }}
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
                                                // onBlur={(e) => {
                                                //     if (e.target.value > e.target.max) {
                                                //         e.target.value = e.target.max;
                                                //         handleChangeNewInput(e, index);
                                                //     } else if (e.target.value < e.target.min) {
                                                //         e.target.value = e.target.min;
                                                //         handleChangeNewInput(e, index);
                                                //     }
                                                // }}
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
                                    </tr>
                                ))}
                                {displayedBaocao.map((bc, index) => (
                                    <tr key={bc.bchn_id}>
                                        <td>{index + 1}</td>
                                        <td style={{ textAlign: 'left' }}>
                                            {bc.isEdit ? (
                                                <input
                                                    type="date"
                                                    name="bchn_ngay"
                                                    value={
                                                        bc.bchn_ngay ||
                                                        new Date().toISOString().substr(0, 10)
                                                    }
                                                    onChange={(event) =>
                                                        handleChangeInput(event, index)
                                                    }
                                                />
                                            ) : (
                                                <>{bc.bchn_ngay.split(' ')[0]}</>
                                            )}
                                        </td>
                                        {infoUser.nv_quyenthamdinh === '1' && (
                                            <td>
                                                {bc.isEdit ? (
                                                    <textarea
                                                        name="ten_nhan_vien"
                                                        value={bc.nhan_vien?.ten_nhan_vien}
                                                        onChange={(event) =>
                                                            handleChangeInput(event, index)
                                                        }
                                                    />
                                                ) : (
                                                    <>{bc.nhan_vien?.ten_nhan_vien}</>
                                                )}
                                            </td>
                                        )}
                                        <td style={{ textAlign: 'left' }}>
                                            {bc.isEdit ? (
                                                <textarea
                                                    name="cong_viec"
                                                    value={bc.cong_viec?.ten_cong_viec}
                                                    onChange={(event) =>
                                                        handleChangeInput(event, index)
                                                    }
                                                />
                                            ) : (
                                                <>{bc.cong_viec?.ten_cong_viec}</>
                                            )}
                                        </td>
                                        <td style={{ textAlign: 'left' }}>
                                            {bc.isEdit ? (
                                                <textarea
                                                    name="bchn_noidung"
                                                    value={bc.bchn_noidung}
                                                    onChange={(event) =>
                                                        handleChangeInput(event, index)
                                                    }
                                                />
                                            ) : (
                                                <>{bc.bchn_noidung}</>
                                            )}
                                        </td>
                                        <td>{bc.bchn_giobatdau}</td>
                                        <td>{bc.bchn_gioketthuc}</td>
                                        <td>
                                            {bc.isEdit ? (
                                                <input
                                                    name="so_gio_lam"
                                                    value={bc.so_gio_lam}
                                                    onChange={(event) =>
                                                        handleChangeInput(event, index)
                                                    }
                                                />
                                            ) : (
                                                <>{bc.so_gio_lam}</>
                                            )}
                                        </td>
                                        <td>
                                            {bc.isEdit ? (
                                                <input
                                                    name="bchn_tiendo"
                                                    value={bc.bchn_tiendo}
                                                    onChange={(event) =>
                                                        handleChangeInput(event, index)
                                                    }
                                                />
                                            ) : (
                                                <>{bc.bchn_tiendo}</>
                                            )}
                                        </td>
                                        {infoUser.nv_quyenthamdinh === '1' && (
                                            <td>
                                                {bc.isEdit ? (
                                                    <input
                                                        name="bchn_giothamdinh"
                                                        value={bc.bchn_giothamdinh}
                                                        onChange={(event) =>
                                                            handleChangeInput(event, index)
                                                        }
                                                    />
                                                ) : (
                                                    <input value={bc.bchn_giothamdinh} />
                                                )}
                                            </td>
                                        )}
                                        <td
                                            className={
                                                bc.bchn_trangthai === '1' ? cx('tham-dinh') : ''
                                            }
                                        >
                                            {bc.isEdit ? (
                                                <textarea
                                                    name="bchn_trangthai"
                                                    value={bc.bchn_trangthai}
                                                    onChange={(event) =>
                                                        handleChangeInput(event, index)
                                                    }
                                                />
                                            ) : (
                                                <>
                                                    {bc.bchn_trangthai === '0'
                                                        ? 'Chưa thẩm định'
                                                        : 'Đã thẩm định'}
                                                </>
                                            )}
                                        </td>

                                        {infoUser.nv_quyenthamdinh === '1' && (
                                            <td>
                                                <input type="checkbox"></input>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                ) : (
                    <p className={cx('no-result')}>Không có kết quả tìm kiếm</p>
                )}
            </div>
        </div>
    );
}

export default BaoCaoHangNgay;
