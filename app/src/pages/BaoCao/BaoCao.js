import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faSearch,
    faArrowUp,
    faArrowDown,
    faSave,
    faPlus,
} from '@fortawesome/free-solid-svg-icons';
import axiosClient from '~/api/axiosClient';
import classNames from 'classnames/bind';
import styles from './BaoCao.module.scss';
import BaoCaoKeHoach from './BaoCaoKeHoach';
import BaoCaoCongViec from './BaoCaoCongViec';

const cx = classNames.bind(styles);

function BaoCao() {
    const [infoUser, setInfoUser] = useState([]);
    const [dSBaoCaoHangNgay, setDSBaoCaoHangNgay] = useState([]);
    const [dSBaocao, setDSBaocao] = useState([]);
    const [sortColumn, setSortColumn] = useState('');
    const [sortDirection, setSortDirection] = useState('');
    const [searchText, setSearchText] = useState('');

    const [displayedBaocao, setDisplayedBaocao] = useState([]);
    const [nextId, setNextId] = useState(displayedBaocao.length);

    const [themBaoCao, setThemBaoCao] = useState({
        nhan_vien: { ten_nhan_vien: '' },
        cong_viec: { ten_cong_viec: '' },
        loai_cong_viec: { ten_loai_cong_viec: '' },
        bchn_noidung: '',
        so_gio_lam: '',
    });

    console.log(themBaoCao);

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
            const response = await axiosClient.get('/get_CV_BC_HangNgay');
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

    const handleAddRowTable = () => {
        const newRow = {
            bchn_id: nextId,
            bchn_ngay: new Date().toISOString().substr(0, 10),
            nhan_vien: { ten_nhan_vien: '' },
            cong_viec: { ten_cong_viec: '' },
            loai_cong_viec: { ten_loai_cong_viec: '' },
            bchn_noidung: '',
            so_gio_lam: '',
            bchn_tiendo: '',
            bchn_giothamdinh: '',
            bchn_trangthai: '0',
            isEdit: true,
        };
        setDisplayedBaocao([newRow, ...displayedBaocao]);
        setNextId(nextId + 1);
    };

    const handleChangeInput = (event, rowIndex) => {
        const { name, value } = event.target;
        const updatedBaoCao = [...displayedBaocao];
        updatedBaoCao[rowIndex] = { ...updatedBaoCao[rowIndex], [name]: value };
        setDisplayedBaocao(updatedBaoCao);
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

    const filterBaocao = (baocao, infoUser) => {
        const filteredBaocao =
            infoUser.nv_quyenthamdinh === '1'
                ? baocao
                : baocao.filter((item) => item.nhan_vien.ten_nhan_vien === infoUser.nv_ten);

        const searchedBaocao = filteredBaocao
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
        setDisplayedBaocao(filterBaocao(dSBaocao, infoUser));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchText, sortDirection, sortColumn, infoUser, dSBaocao]);

    return (
        <div className={cx('wrapper')}>
            <BaoCaoKeHoach />
            <BaoCaoCongViec />
            <h2>Báo cáo công việc hàng ngày</h2>
            <p>
                Tổng giờ đã làm: <span>16 giờ</span>
            </p>
            <div className={cx('inner')}>
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
                        <button className={cx('save-btn')}>
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
                                        <td>
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
                                        <td>
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
                                        <td style={{ textAlign: 'center' }}>
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

export default BaoCao;
