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
import classNames from 'classnames/bind';
import styles from './BaoCao.module.scss';
import BaoCaoKeHoach from './BaoCaoKeHoach';
import BaoCaoCongViec from './BaoCaoCongViec';
import cogoToast from 'cogo-toast';

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
    console.log(themBaoCao);

    const [dSCongViec, setDSCongViec] = useState([]);

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
        const getDSBaoCaoHangNgay = async () => {
            const token = localStorage.getItem('Token');
            const response = await axiosClient.get(`/get_CV_BC_HangNgay?token=${token}`);
            setDSBaoCaoHangNgay(response.data);
        };
        getDSBaoCaoHangNgay();
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

    const handleAddRowTable = () => {
        const newRow = {
            cv_id: '',
            lcv_id: '',
            bdhn_tiendo: '',
            bchn_noidung: '',
            so_gio_lam: '',
        };
        setThemBaoCao((prevRows) => [...prevRows, newRow]);
    };

    const handleChangeNewInput = (event, index) => {
        const { name, value } = event.target;
        setThemBaoCao((prevRows) =>
            prevRows.map((row, i) => (i === index ? { ...row, [name]: value } : row)),
        );
    };

    const handleChangeInput = (event, rowIndex) => {
        const { name, value } = event.target;
        const updatedBaoCao = [...displayedBaocao];
        updatedBaoCao[rowIndex] = { ...updatedBaoCao[rowIndex], [name]: value };
        setDisplayedBaocao(updatedBaoCao);
    };

    const handleSave = async (e) => {
        e.preventDefault();

        const [{ cv_id, lcv_id, bdhn_tiendo, bchn_noidung, so_gio_lam }] = themBaoCao;
        const token = localStorage.getItem('Token');

        const response = await axiosClient.post(`/add_CV_BC_HangNgay?token=${token}`, {
            danh_sach_cong_viec_bao_cao: [{ cv_id, lcv_id, bdhn_tiendo, bchn_noidung, so_gio_lam }],
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

    const filterBaocao = (baocao) => {
        const searchedBaocao = baocao
            .filter(
                (bc) =>
                    bc.cong_viec.ten_cong_viec &&
                    bc.cong_viec.ten_cong_viec.toLowerCase().includes(searchText.toLowerCase()),
            )
            .filter((bc) => bc.bchn_trangthai === '0')
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

        return searchedBaocao || [];
    };

    useEffect(() => {
        setDisplayedBaocao(filterBaocao(dSBaocao));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchText, sortDirection, sortColumn, dSBaocao]);

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
            <p style={{ display: isBaoCao ? 'block' : 'none' }}>
                Tổng giờ đã làm: <span>16 giờ</span>
            </p>
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
                        <button className={cx('save-btn')} onClick={handleSave}>
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
                                    <th>Tên công việc</th>
                                    <th>Loại công việc</th>
                                    <th>Nội dung công việc</th>
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
                                                style={{ border: 'none' }}
                                                name="bchn_ngay"
                                                value={
                                                    bc.bchn_ngay ||
                                                    new Date().toISOString().substr(0, 10)
                                                }
                                                onChange={(e) => handleChangeNewInput(e, index)}
                                            />
                                        </td>
                                        <td style={{ textAlign: 'left' }}>
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
                                            <select
                                                name="lcv_id"
                                                value={bc.lcv_id}
                                                onChange={(e) => handleChangeNewInput(e, index)}
                                            >
                                                <option value="" disabled>
                                                    Chọn loại công việc
                                                </option>
                                                {dSCongViec.map((cv) => (
                                                    <option key={cv.lcv_id} value={cv.lcv_id}>
                                                        {cv.loai_cong_viecs.lcv_ten}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td style={{ textAlign: 'left' }}>
                                            <textarea
                                                name="bchn_noidung"
                                                value={bc.bchn_noidung}
                                                onChange={(e) => handleChangeNewInput(e, index)}
                                            />
                                        </td>
                                        <td>
                                            <textarea
                                                name="so_gio_lam"
                                                value={bc.so_gio_lam}
                                                onChange={(e) => handleChangeNewInput(e, index)}
                                            />
                                        </td>
                                        <td>
                                            <textarea
                                                name="bdhn_tiendo"
                                                value={bc.bdhn_tiendo}
                                                onChange={(e) => handleChangeNewInput(e, index)}
                                            />
                                        </td>
                                        <td>Chưa thẩm định</td>
                                    </tr>
                                ))}
                                {displayedBaocao.map((bc, index) => (
                                    <tr key={bc.bchn_id}>
                                        <td>{index + 1}</td>
                                        <td>
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
                                                <>{bc.bchn_ngay}</>
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
                                        <td>
                                            {bc.isEdit ? (
                                                <textarea
                                                    name="loai_cong_viec"
                                                    value={bc.loai_cong_viec?.ten_loai_cong_viec}
                                                    onChange={(event) =>
                                                        handleChangeInput(event, index)
                                                    }
                                                />
                                            ) : (
                                                <>{bc.loai_cong_viec?.ten_loai_cong_viec}</>
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
                                        <td>
                                            {bc.isEdit ? (
                                                <textarea
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
                                                <textarea
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
                                                    <textarea
                                                        name="bchn_giothamdinh"
                                                        value={bc.bchn_giothamdinh}
                                                        onChange={(event) =>
                                                            handleChangeInput(event, index)
                                                        }
                                                    />
                                                ) : (
                                                    <>{bc.bchn_giothamdinh}</>
                                                )}
                                            </td>
                                        )}
                                        <td>
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
