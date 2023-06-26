import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import axiosClient from '~/api/axiosClient';
// import cogoToast from 'cogo-toast';
import classNames from 'classnames/bind';
import styles from './ThemKeHoach.module.scss';
import swal from 'sweetalert';

const cx = classNames.bind(styles);

function ThemKeHoach({ onClose }) {
    const navigate = useNavigate();

    const [themKeHoach, setThemKeHoach] = useState({
        kh_ten: '',
        kh_loaikehoach: '',
        kh_thgianbatdau: new Date().toISOString().substr(0, 10),
        kh_thgianketthuc: '',
        kh_stt: '',
        kh_tongthgian: '',
    });

    function handleChange(event) {
        setThemKeHoach({
            ...themKeHoach,
            [event.target.name]: event.target.value,
        });
    }

    const handleThemDonVi = async (e) => {
        e.preventDefault();

        const { kh_stt, kh_ten, kh_thgianbatdau, kh_thgianketthuc, kh_loaikehoach, kh_tongthgian } =
            themKeHoach;
        console.log(themKeHoach);
        const token = localStorage.getItem('Token');
        const response = await axiosClient.post(`/create_KeHoach?token=${token}`, {
            kh_ten,
            kh_loaikehoach,
            kh_thgianbatdau,
            kh_thgianketthuc,
            kh_tongthgian,
            kh_stt,
        });

        if (response.status === 200) {
            navigate('/qlcv/kehoach');
            swal(`Thêm kế hoạch ${kh_ten.toUpperCase()} mới thành công`, {
                position: 'top-right',
            });
            onClose();
            window.location.reload();
        } else {
            alert('error');
        }
    };

    const handleCancel = () => {
        onClose();
    };

    return (
        <>
            <div className={cx('modal')}>
                <div className={cx('modal-content')}>
                    <header className={cx('modal-header')}>
                        <h2>Thêm kế hoạch</h2>
                        <button onClick={handleCancel} className={cx('close-button')}>
                            <FontAwesomeIcon icon={faClose} />
                        </button>
                    </header>
                    <div className={cx('inner')}>
                        <form className={cx('form-group')}>
                            <div className={cx('form-item')}>
                                <label>Số thứ tự</label>
                                <input
                                    type="number"
                                    min={0}
                                    max={999}
                                    name="kh_stt"
                                    value={themKeHoach.kh_stt}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className={cx('form-item')}>
                                <label>Tên kế hoạch</label>
                                <input
                                    type="text"
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
                                <label>Tổng thời gian</label>
                                <input
                                    type="text"
                                    name="kh_tongthgian"
                                    value={themKeHoach.kh_tongthgian}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className={cx('form-item')}>
                                <label>Loại kế hoạch</label>
                                {/* <input
                                type="text"
                                name="kh_loaikehoach"
                                value={themKeHoach.kh_loaikehoach}
                                onChange={handleChange}
                            /> */}
                                <select name="kh_loaikehoach" onChange={handleChange}>
                                    <option>-- Chọn loại kế hoạch --</option>
                                    <option value="Kế Hoạch Theo Tháng">Tháng</option>
                                    <option value="Kế Hoạch Theo Quý">Quý</option>
                                    <option value="Kế Hoạch Theo Năm">Năm</option>
                                </select>
                            </div>
                        </form>
                    </div>
                    <footer className={cx('modal-footer')}>
                        <button onClick={handleThemDonVi}>Lưu lại</button>
                        <button onClick={handleCancel}>Hủy</button>
                    </footer>
                </div>
            </div>
        </>
    );
}

export default ThemKeHoach;
