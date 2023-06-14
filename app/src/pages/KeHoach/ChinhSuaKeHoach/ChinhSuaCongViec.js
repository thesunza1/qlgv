import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleArrowLeft } from '@fortawesome/free-solid-svg-icons';
import cogoToast from 'cogo-toast';
import classNames from 'classnames/bind';
import styles from "./CSKeHoach.module.scss";
import axiosClient from '~/api/axiosClient';

const cx = classNames.bind(styles);

function ChinhSuaCV() {
    const navigate = useNavigate();
    const { cv_id, cv_ten, cv_thgianbatdau, cv_thgianketthuc, dv_id, nv_id } = useParams();

    const [chinhSuaCV, setChinhSuaCV] = useState({
        cv_ten: '',
        cv_thgianbatdau: '',
        cv_thgianketthuc: '',
        dv_id: '',
        nv_id: '',
    });

    useEffect(() => {
        setChinhSuaCV({
            cv_id,
            cv_ten,
            cv_thgianbatdau,
            cv_thgianketthuc,
            dv_id,
            nv_id,
        });
    }, [cv_id, cv_ten, cv_thgianbatdau, cv_thgianketthuc, dv_id, nv_id]);

    function handleChange(event) {
        setChinhSuaCV({
            ...chinhSuaCV,
            [event.target.name]: event.target.value,
        });
    }

    const handleChinhSuaCV = async (e) => {
        e.preventDefault();

        const { cv_ten, cv_thgianbatdau, cv_thgianketthuc, dv_id, nv_id } = chinhSuaCV;

        const response = await axiosClient.put(`/update`, {
            cv_ten,
            cv_thgianbatdau,
            cv_thgianketthuc,
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
    const [startDateValues, startTimeValues] = chinhSuaCV.cv_thgianbatdau.split(' ');
    const [endDateValues, endTimeValues] = chinhSuaCV.cv_thgianketthuc.split(' ');
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
                            value={startDateValues}
                            onChange={handleChange}
                        />
                    </div>
                    <div className={cx('form-item')}>
                        <label>Thời gian hoàn thành</label>
                        <input
                            type="date"
                            name="cv_thgianketthuc"
                            value={endDateValues}
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
                        <select name='dv_id' onChange={handleChange} defaultValue={chinhSuaCV.dv_id}>
                            <option value="1">Thế Anh</option>
                            <option value="2">B</option>
                            <option value="3">C</option>
                            <option value="4">D</option>
                            <option value="5">E</option>
                            <option value="6">F</option>
                            <option value="7">Văn Thạch</option>
                            <option value="8">Thanh Trọng</option>
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
                        <select name='nv_id' onChange={handleChange} defaultValue={chinhSuaCV.nv_id}>
                            <option value="1">A</option>
                            <option value="2">B</option>
                            <option value="3">C</option>
                            <option value="4">D</option>
                            <option value="5">E</option>
                            <option value="6">F</option>
                            <option value="7">G</option>
                            <option value="8">H</option>
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
