import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleArrowLeft } from '@fortawesome/free-solid-svg-icons';
import axiosClient from '~/api/axiosClient';
// import cogoToast from 'cogo-toast';
import classNames from 'classnames/bind';
import styles from './ThemKeHoach.module.scss';
// import BangKeHoach from './BangKeHoach';

const cx = classNames.bind(styles);

function ThemKeHoach() {
    const navigate = useNavigate();

    const [themKeHoach, setThemKeHoach] = useState({
        kh_ten: '',
        kh_thgianbatdau: '',
        kh_thgianketthuc: '',
        kh_loaikehoach: ''
    });

    function handleChange(event) {
        setThemKeHoach({
            ...themKeHoach,
            [event.target.name]: event.target.value,
        });
    }

    const handleThemDonVi = async (e) => {
        e.preventDefault();

        const { kh_ten, kh_thgianbatdau, kh_thgianketthuc, kh_loaikehoach } = themKeHoach;
        const token = localStorage.getItem('Token')
        const response = await axiosClient.post(`/create_KeHoach?token=${token}`, {
            kh_ten,
            kh_thgianbatdau,
            kh_thgianketthuc,
            kh_loaikehoach,
        });

        if (response.status === 200) {
            navigate('/qlcv/donvi');
            alert(`Thêm đơn vị ${kh_ten.toUpperCase()} mới thành công`, {
                position: 'top-right',
            });
        }
    };

    const handleCancel = () => {
        navigate('/qlcv/donvi');
    };

    return (
        <>
            <div className={cx('wrapper')}>
                <h2>
                    <Link to="/qlcv/donvi">
                        <FontAwesomeIcon className={cx('back-icon')} icon={faCircleArrowLeft} />
                    </Link>
                    Thêm kế hoạch
                </h2>
                <div className={cx('inner')}>
                    <form className={cx('form-group')}>
                        <div className={cx('form-item')}>
                            <label>Tên kế hoạch</label>
                            <input
                                type="search"
                                name="kh_ten"
                                value={themKeHoach.kh_ten}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={cx('form-item')}>
                            <label>Thời gian bắt đầu</label>
                            <input
                                type="date"
                                name="kh_thgianbatdau"
                                value={themKeHoach.kh_thgianbatdau}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={cx('form-item')}>
                            <label>Thời gian kết thúc</label>
                            <input
                                type="date"
                                name="kh_thgianketthuc"
                                value={themKeHoach.kh_thgianketthuc}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={cx('form-item')}>
                            <label>Loại kế hoạch</label>
                            <input
                                type="search"
                                name="kh_loaikehoach"
                                value={themKeHoach.kh_loaikehoach}
                                onChange={handleChange}
                            />
                        </div>
                    </form>
                    <div className={cx('handle')}>
                        <button onClick={handleThemDonVi}>Lưu</button>
                        <button onClick={handleCancel}>Hủy</button>
                    </div>
                </div>
            </div>
            {/* <BangKeHoach></BangKeHoach> */}
        </>

    );
}

export default ThemKeHoach;