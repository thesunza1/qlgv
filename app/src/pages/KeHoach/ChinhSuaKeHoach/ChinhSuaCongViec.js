import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleArrowLeft } from '@fortawesome/free-solid-svg-icons';
import cogoToast from 'cogo-toast';
import classNames from 'classnames/bind';
import styles from './CSKeHoach.module.scss';
import axiosClient from '~/api/axiosClient';

const cx = classNames.bind(styles);

function ChinhSuaCV() {
    const navigate = useNavigate();
    const { cv_id, cv_ten, cv_thgianbatdau, cv_thgianhoanthanh, dv_id, nv_id } = useParams();

    const [chinhSuaCV, setChinhSuaCV] = useState({
        cv_ten: '',
        cv_thgianbatdau: '',
        cv_thgianhoanthanh: '',
        dv_id: '',
        nv_id: '',
    });

    useEffect(() => {
        setChinhSuaCV({
            cv_id,
            cv_ten,
            cv_thgianbatdau,
            cv_thgianhoanthanh,
            dv_id,
            nv_id,
        });
    }, [cv_id, cv_ten, cv_thgianbatdau, cv_thgianhoanthanh, dv_id, nv_id]);

    function handleChange(event) {
        setChinhSuaCV({
            ...chinhSuaCV,
            [event.target.name]: event.target.value,
        });
    }
    const [optionList, setOptionList] = useState([]);
    const [optionListDV, setOptionListDV] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            const resSoNhanVien = await axiosClient.get(`/get_NhanVien`);
            const resDonVi = await axiosClient.get(`/get_DonVi`);
            setOptionList(resSoNhanVien.data.nhanViens);
            setOptionListDV(resDonVi.data.don_vis);
        };

        fetchData();
    }, []);

    const handleChinhSuaCV = async (e) => {
        e.preventDefault();

        const { cv_ten, cv_thgianbatdau, cv_thgianhoanthanh, dv_id, nv_id } = chinhSuaCV;

        const response = await axiosClient.put(`/update`, {
            cv_ten,
            cv_thgianbatdau,
            cv_thgianhoanthanh,
            dv_id,
            nv_id,
        });

        if (response.status === 200) {
            navigate('/qlcv/congviec');
            cogoToast.success(`Chỉnh sửa công việc ${cv_ten.toUpperCase()} thành công`, {
                position: 'top-right',
            });
        }
    };

    const handleCancel = () => {
        navigate('/qlcv/congviec');
    };
    // const [startDateValues, startTimeValues] = chinhSuaCV.cv_thgianbatdau.split(' ');
    // const [endDateValues, endTimeValues] = chinhSuaCV.cv_thgianhoanthanh.split(' ');
    return (
        <div className={cx('wrapper')}>
            <h2>
                {/* <Link to="/qlcv/congviec">
                    <FontAwesomeIcon className={cx('back-icon')} icon={faCircleArrowLeft} />
                </Link> */}
                <button onClick={() => navigate(-1)}>
                    <FontAwesomeIcon className={cx('back-icon')} icon={faCircleArrowLeft} />
                </button>
                Chỉnh sửa công việc
            </h2>
            <div className={cx('inner')}>
                <form className={cx('form-group')}>
                    <div className={cx('form-item')}>
                        <label>Tên công việc</label>
                        <input
                            type="search"
                            name="cv_ten"
                            value={chinhSuaCV.cv_ten}
                            onChange={handleChange}
                        />
                    </div>
                    <div className={cx('form-item')}>
                        <label>Thời gian bắt đầu</label>
                        <input
                            type="date"
                            name="cv_thgianbatdau"
                            value={
                                chinhSuaCV.cv_thgianbatdau
                                    ? chinhSuaCV.cv_thgianbatdau.split(' ')[0]
                                    : '2023-01-01'
                            }
                            onChange={handleChange}
                        />
                    </div>
                    <div className={cx('form-item')}>
                        <label>Thời gian hoàn thành</label>
                        <input
                            type="date"
                            name="cv_thgianhoanthanh"
                            value={
                                chinhSuaCV.cv_thgianhoanthanh
                                    ? chinhSuaCV.cv_thgianhoanthanh.split(' ')[0]
                                    : '2023-01-01'
                            }
                            onChange={handleChange}
                        />
                    </div>
                    <div className={cx('form-item')}>
                        <label>Đơn vị </label>
                        {/* <input
                            type="search"
                            name="dv_id"
                            value={chinhSuaCV.dv_id}
                            onChange={handleChange}
                        /> */}
                        <select
                            name="dv_id"
                            onChange={handleChange}
                            defaultValue={chinhSuaCV.dv_id}
                        >
                            {optionListDV.map((dv) => (
                                <option key={dv.dv_id} value={dv.dv_id}>
                                    {dv.dv_ten}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className={cx('form-item')}>
                        <label>Nhân viên </label>
                        {/* <input
                            type="search"
                            name="nv_id"
                            value={chinhSuaCV.nv_id}
                            onChange={handleChange}
                        /> */}
                        <select
                            name="nv_id"
                            onChange={handleChange}
                            defaultValue={chinhSuaCV.nv_id}
                        >
                            {optionList.map((employee) => (
                                <option key={employee.nv_id} value={employee.nv_id}>
                                    {employee.nv_ten}
                                </option>
                            ))}
                        </select>
                    </div>
                </form>
                <div className={cx('handle')}>
                    <button onClick={handleChinhSuaCV}>Cập nhật</button>
                    <button onClick={handleCancel}>Hủy</button>
                </div>
            </div>
        </div>
    );
}

export default ChinhSuaCV;
