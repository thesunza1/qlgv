import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleArrowLeft } from '@fortawesome/free-solid-svg-icons';
import cogoToast from 'cogo-toast';
import classNames from 'classnames/bind';
import styles from "./CSKeHoach.module.scss";
import axiosClient from '~/api/axiosClient';

const cx = classNames.bind(styles);

function ChinhSuaKH() {
    const navigate = useNavigate();
    const { kh_id, kh_ten, kh_thgianbatdau, kh_thgianketthuc, dv_id, nv_id, kh_loaikehoach } = useParams();

    const [chinhSuaKH, setChinhSuaKH] = useState({
        kh_ten: '',
        kh_thgianbatdau: '',
        kh_thgianketthuc: '',
        dv_id: '',
        nv_id: '',
        kh_loaikehoach: '',
    });

    useEffect(() => {
        setChinhSuaKH({
            kh_id,
            kh_ten,
            kh_thgianbatdau,
            kh_thgianketthuc,
            dv_id,
            nv_id,
            kh_loaikehoach,
        });
    }, [kh_id, kh_ten, kh_thgianbatdau, kh_thgianketthuc, dv_id, nv_id, kh_loaikehoach]);

    function handleChange(event) {
        setChinhSuaKH({
            ...chinhSuaKH,
            [event.target.name]: event.target.value,
        });
    }

    const handleChinhSuaKH = async (e) => {
        e.preventDefault();

        const { kh_ten, kh_thgianbatdau, kh_thgianketthuc, dv_id, nv_id, kh_loaikehoach } = chinhSuaKH;

        const response = await axiosClient.put(`/update_KeHoach/${kh_id}?token=${localStorage.getItem('Token')}`, {
            kh_ten,
            kh_thgianbatdau,
            kh_thgianketthuc,
            dv_id,
            nv_id,
            kh_loaikehoach,
        });
        console.log(kh_ten, kh_thgianbatdau, kh_thgianketthuc, dv_id, nv_id, kh_loaikehoach)
        if (response.status === 200) {
            navigate('/qlcv/kehoach');
            cogoToast.success(`Chỉnh sửa công việc ${kh_ten.toUpperCase()} thành công`, {
                position: 'top-right',
            });
        }
    };

    const handleCancel = () => {
        navigate('/qlcv/kehoach');
    };
    const [startDateValues, startTimeValues] = chinhSuaKH.kh_thgianbatdau.split(' ');
    const [endDateValues, endTimeValues] = chinhSuaKH.kh_thgianketthuc.split(' ');

    return (
        <div className={cx('wrapper')}>
            <h2>
                <button onClick={() => navigate(-1)}>
                    <FontAwesomeIcon className={cx('back-icon')} icon={faCircleArrowLeft} />
                </button>
                Chỉnh sửa kế hoạch
            </h2>
            <div className={cx('inner')}>
                <form className={cx('form-group')}>
                    <div className={cx('form-item')}>
                        <label>Tên kế hoạch</label>
                        <input
                            type="search"
                            name="kh_ten"
                            value={chinhSuaKH.kh_ten}
                            onChange={handleChange}
                        />
                    </div>
                    <div className={cx('form-item')}>
                        <label>Thời gian bắt đầu</label>
                        <input
                            type="date"
                            name="kh_thgianbatdau"
                            value={startDateValues}
                            onChange={handleChange}
                        />
                    </div>
                    <div className={cx('form-item')}>
                        <label>Thời gian hoàn thành</label>
                        <input
                            type="date"
                            name="kh_thgianketthuc"
                            value={endDateValues}
                            onChange={handleChange}
                        />
                    </div>
                    <div className={cx('form-item')}>
                        <label>Đơn vị </label>
                        {/* <input
                            type="search"
                            name="dv_id"
                            value={chinhSuaKH.dv_id}
                            onChange={handleChange}
                        /> */}
                        <select name='dv_id' onChange={handleChange}>
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
                    <div className={cx('form-item')}>
                        <label>Nhân viên </label>
                        <select name='nv_id' onChange={handleChange}>
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
                    <div className={cx('form-item')}>
                        <label>Loại kế hoạch</label>
                        {/* <input
                                type="search"
                                name="kh_loaikehoach"
                                value={themKeHoach.kh_loaikehoach}
                                onChange={handleChange}
                            /> */}
                        <select name='kh_loaikehoach' onChange={handleChange}>
                            <option value='Kế Hoạch Theo Tháng'>Tháng</option>
                            <option value='Kế Hoạch Theo Quý'>Quý</option>
                            <option value='Kế Hoạch Theo Năm'>Năm</option>
                        </select>
                    </div>
                </form>
                <div className={cx('handle')}>
                    <button onClick={handleChinhSuaKH}>Cập nhật</button>
                    <button onClick={handleCancel}>Hủy</button>
                </div>
            </div>
        </div>
    );
}

export default ChinhSuaKH;
