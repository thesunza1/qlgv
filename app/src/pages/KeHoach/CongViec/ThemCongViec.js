import { useState, useMemo, useCallback, useEffect } from 'react';
// import { Link } from 'react-router-dom';
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
import 'tippy.js/dist/tippy.css';
import ReactPaginate from 'react-paginate';
import classNames from 'classnames/bind';
import styles from './ThemCongViec.module.scss';
import axiosClient from '~/api/axiosClient';


const cx = classNames.bind(styles);

function createData(
    id,
    cv_ten,
    cv_thgianbatdau,
    cv_thgianketthuc,
    dv_id,
    nv_id,
    cv_trangthai,
) {
    return {
        id,
        cv_ten,
        cv_thgianbatdau,
        cv_thgianketthuc,
        dv_id,
        nv_id,
        cv_trangthai,
    };
}

const rows = [
    createData(1, '31/5/2023', 'Lập trình', 'Bằng Reactjs 1', '2', '50%', '2', 'Đã thẩm định', '1'),
    createData(
        2,
        '31/5/2023',
        'Lập trình',
        'Bằng Reactjs 2',
        '2',
        '50%',
        '2',
        'Chưa thẩm định',
        '1',
    ),
    createData(3, '29/5/2023', 'Lập trình 1', 'Bằng Reactjs', '2', '50%', '2', 'Đã thẩm định', '1'),
    createData(4, '30/5/2023', 'Thiết kế', 'Bằng Reactjs', '2', '50%', '2', 'Đã thẩm định', '1'),
    createData(5, '31/5/2023', 'Lập trình', 'Bằng Reactjs', '2', '50%', '2', 'Đã thẩm định', '1'),
    createData(6, '31/5/2023', 'Lập trình', 'Bằng Reactjs', '2', '50%', '2', 'Đã thẩm định', '1'),
    createData(7, '31/5/2023', 'Lập trình', 'Bằng Reactjs', '2', '50%', '2', 'Đã thẩm định', '1'),
    createData(8, '31/5/2023', 'Lập trình', 'Bằng Reactjs', '2', '50%', '2', 'Đã thẩm định', '1'),
    createData(9, '31/5/2023', 'Lập trình', 'Bằng Reactjs', '2', '50%', '2', 'Đã thẩm định', '1'),
    createData(10, '31/5/2023', 'Lập trình', 'Bằng Reactjs', '2', '50%', '2', 'Đã thẩm định', '1'),
    createData(11, '31/5/2023', 'Lập trình', 'Bằng Reactjs', '2', '50%', '2', 'Đã thẩm định', '1'),
    createData(12, '31/5/2023', 'Lập trình', 'Bằng Reactjs', '2', '50%', '2', 'Đã thẩm định', '1'),
];

function ThemCongViec() {
    const [dSCongViec, setDSCongViec] = useState(
        rows.map((row) => ({
            ...row,
            isEdit: false,
        })),
    );
    console.log(dSCongViec);
    const [sortColumn, setSortColumn] = useState('');
    const [sortDirection, setSortDirection] = useState('');
    const [searchText, setSearchText] = useState('');
    const [currentPage, setCurrentPage] = useState(0);

    const AddRowTable = () => {
        const id = dSCongViec.length + 1;
        const newRow = {
            id: id,
            cv_ten: '',
            cv_thgianbatdau: '',
            cv_thgianketthuc: '',
            dv_id: '',
            nv_id: '',
            cv_trangthai: '',
            isEdit: true,
        };
        setDSCongViec([...dSCongViec, newRow]);
    };

    const handleInputChange = (event, id) => {
        const { name, value } = event.target;
        const newData = dSCongViec.map((item) =>
            item.id === id ? { ...item, [name]: value } : item,
        );
        setDSCongViec(newData);
    };
    useEffect(() => {
        const getListProduct = async () => {
            const token = localStorage.getItem('Token')
            const response = await axiosClient.get(`/get_CV_KeHoach?token=${token}`);
            setDSCongViec(response.data.cong_viecs);
        };
        getListProduct();
    }, []);

    const PER_PAGE = 10;

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
            cv.cv_ten.toLowerCase().includes(searchText.toLowerCase()),
        );
        const startIndex = currentPage * PER_PAGE;
        return filteredCongViec.slice(startIndex, startIndex + PER_PAGE) || [];
    }, [sortedCongViec, searchText, currentPage]);

    const totalPage = Math.ceil(sortedCongViec.length / PER_PAGE);

    const handlePageClick = ({ selected: selectedPage }) => {
        setCurrentPage(selectedPage);
    };

    const displayedCongViec = getDisplayCongViec();

    return (
        <div className={cx('wrapper')}>
            <h2>Thêm Công Việc</h2>
            <div className={cx('inner')}>
                <div className={cx('features')}>
                    <div className={cx('search')}>
                        <input
                            type="search"
                            placeholder="Tìm kiếm báo cáo"
                            value={searchText}
                            onChange={handleSearchInputChange}
                        />
                        <FontAwesomeIcon icon={faSearch} />
                    </div>
                    <div>
                        <button className={cx('add-btn')} onClick={AddRowTable}>
                            <FontAwesomeIcon icon={faPlus} /> Thêm hàng
                        </button>
                        <button className={cx('add-btn')}>
                            <FontAwesomeIcon icon={faSave} /> Lưu
                        </button>
                    </div>
                </div>
                {displayedCongViec.length > 0 ? (
                    <>
                        <table className={cx('table')}>
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th onClick={() => handleSortColumn('cv_ten')}>
                                        <span>Tên công việc</span>
                                        {sortColumn === 'cv_ten' && (
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
                                    <th onClick={() => handleSortColumn('cv_thgianbatdau')}>
                                        <span>Thơi gian bắt đầu</span>
                                        {sortColumn === 'cv_thgianbatdau' && (
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
                                    <th>Thời gian kết thúc</th>
                                    <th>Đơn vị</th>
                                    <th>Nhân viên</th>
                                    <th onClick={() => handleSortColumn('cv_trangthai')}>
                                        <span>Trạng thái</span>
                                        {sortColumn === 'cv_trangthai' && (
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
                                {displayedCongViec.map((cv, index) => (
                                    <tr key={cv.id}>
                                        <td>{index + 1 + currentPage * PER_PAGE}</td>
                                        <td>
                                            {cv.isEdit ? (
                                                <textarea
                                                    name="cv_ten"
                                                    value={cv.cv_ten}
                                                    onChange={(event) =>
                                                        handleInputChange(event, cv.id)
                                                    }
                                                />
                                            ) : (
                                                <>{cv.cv_ten}</>
                                            )}
                                        </td>
                                        <td>
                                            {cv.isEdit ? (
                                                <textarea
                                                    type="search"
                                                    name="cv_thgianbatdau"
                                                    value={cv.cv_thgianbatdau}
                                                    onChange={(event) =>
                                                        handleInputChange(event, cv.id)
                                                    }
                                                />
                                            ) : (
                                                <>{cv.cv_thgianbatdau}</>
                                            )}
                                        </td>
                                        <td>
                                            {cv.isEdit ? (
                                                <textarea
                                                    type="search"
                                                    name="cv_thgianketthuc"
                                                    value={cv.cv_thgianketthuc}
                                                    onChange={(event) =>
                                                        handleInputChange(event, cv.id)
                                                    }
                                                />
                                            ) : (
                                                <>{cv.cv_thgianketthuc}</>
                                            )}
                                        </td>
                                        <td>
                                            {cv.isEdit ? (
                                                <textarea
                                                    type="search"
                                                    name="dv_id"
                                                    value={cv.dv_id}
                                                    onChange={(event) =>
                                                        handleInputChange(event, cv.id)
                                                    }
                                                />
                                            ) : (
                                                <>{cv.dv_id}</>
                                            )}
                                        </td>
                                        <td>
                                            {cv.isEdit ? (
                                                <textarea
                                                    type="search"
                                                    name="nv_id"
                                                    value={cv.nv_id}
                                                    onChange={(event) =>
                                                        handleInputChange(event, cv.id)
                                                    }
                                                />
                                            ) : (
                                                <>{cv.nv_id}</>
                                            )}
                                        </td>

                                        <td>
                                            {cv.isEdit ? (
                                                <textarea
                                                    type="search"
                                                    name="cv_trangthai"
                                                    value={cv.cv_trangthai}
                                                    onChange={(event) =>
                                                        handleInputChange(event, cv.id)
                                                    }
                                                />
                                            ) : (
                                                <>{cv.cv_trangthai}</>
                                            )}
                                        </td>
                                        <td>
                                            <input type="checkbox"></input>
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

export default ThemCongViec;
