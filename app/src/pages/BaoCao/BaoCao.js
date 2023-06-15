import { useState, useMemo, useCallback, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faSearch,
    faArrowUp,
    faArrowDown,
    faAnglesLeft,
    faAnglesRight,
    faSave,
    faPlus,
} from '@fortawesome/free-solid-svg-icons';
import axiosClient from '~/api/axiosClient';
import ReactPaginate from 'react-paginate';
import classNames from 'classnames/bind';
import styles from './BaoCao.module.scss';
import BaoCaoKeHoach from './BaoCaoKeHoach';
import BaoCaoCongViec from './BaoCaoCongViec';

const cx = classNames.bind(styles);

function BaoCao() {
    const [infoUser, setInfoUser] = useState([]);
    console.log(infoUser);
    const [dSBaoCaoHangNgay, setDSBaoCaoHangNgay] = useState([]);
    const [dSBaocao, setDSBaocao] = useState([]);
    const [sortColumn, setSortColumn] = useState('');
    const [sortDirection, setSortDirection] = useState('');
    const [searchText, setSearchText] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    console.log(dSBaocao);

    const PER_PAGE = 5;

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
            bchn_id: dSBaocao.length + 1,
            bchn_ngay: new Date().toISOString().substr(0, 10),
            nhan_vien: '',
            cong_viec: '',
            loai_cong_viec: '',
            bchn_noidung: '',
            so_gio_lam: '',
            bchn_tiendo: '',
            bchn_giothamdinh: '',
            bchn_trangthai: '0',
            isEdit: true,
        };
        setDSBaocao([...dSBaocao, newRow]);
    };

    const handleInputChange = (event, id) => {
        const { name, value } = event.target;
        const newData = dSBaocao.map((item) =>
            item.bchn_id === id ? { ...item, [name]: value } : item,
        );
        setDSBaocao([...newData]);
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
            bc.bchn_ngay.toLowerCase().includes(searchText.toLowerCase()),
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
                                    {infoUser.nv_quyenthamdinh === '1' && (
                                        <th onClick={() => handleSortColumn('nhan_vien')}>
                                            <span>Nhân viên</span>
                                            {sortColumn === 'nhan_vien' && (
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
                                    <th>Loại công việc</th>
                                    <th>Nội dung công việc</th>
                                    <th>Giờ làm việc (h)</th>
                                    <th>Tiến độ (%)</th>
                                    {infoUser.nv_quyenthamdinh === '1' && <th>Duyệt giờ (h)</th>}
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
                                    {infoUser.nv_quyenthamdinh === '1' && <th>Thẩm định</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {displayedBaocao.map((bc, index) => (
                                    <tr key={bc.bchn_id}>
                                        <td>{index + 1 + currentPage * PER_PAGE}</td>
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
                                                        handleInputChange(event, bc.bchn_id)
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
                                                            handleInputChange(event, bc.bchn_id)
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
                                                        handleInputChange(event, bc.bchn_id)
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
                                                        handleInputChange(event, bc.bchn_id)
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
                                                        handleInputChange(event, bc.bchn_id)
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
                                                        handleInputChange(event, bc.bchn_id)
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
                                                        handleInputChange(event, bc.bchn_id)
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
                                                            handleInputChange(event, bc.bchn_id)
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
                                                        handleInputChange(event, bc.bchn_id)
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

export default BaoCao;
