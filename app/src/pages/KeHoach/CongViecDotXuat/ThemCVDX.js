import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleArrowLeft } from '@fortawesome/free-solid-svg-icons';
import axiosClient from '~/api/axiosClient';
// import cogoToast from 'cogo-toast';
import classNames from 'classnames/bind';
import styles from './ThemCVDX.module.scss';
import swal from 'sweetalert';

const cx = classNames.bind(styles);

function ThemCVDX() {
    const navigate = useNavigate();

    const [ThemCVDX, setThemCVDX] = useState({
        cv_ten: '',
        cv_loaikehoach: '',
        cv_thgianbatdau: '',
        cv_thgianketthuc: '',
        cv_stt: '',
        cv_tongthgian: '',

    });

    function handleChange(event) {
        setThemCVDX({
            ...ThemCVDX,
            [event.target.name]: event.target.value,
        });
    }

    const handleThemDonVi = async (e) => {
        e.preventDefault();

        const { cv_stt, cv_ten, cv_thgianbatdau, cv_thgianketthuc, cv_loaikehoach, cv_tongthgian } = ThemCVDX;
        console.log(ThemCVDX)
        const token = localStorage.getItem('Token')
        const response = await axiosClient.post(`/add_CV_DotXuat?token=${token}`, {
            cv_ten,
            cv_loaikehoach,
            cv_thgianbatdau,
            cv_thgianketthuc,
            cv_tongthgian,
            cv_stt,
        });




        if (response.status === 200) {
            navigate('/qlcv/kehoach');
            swal(`Thêm kế hoạch ${cv_ten.toUpperCase()} mới thành công`, {
                position: 'top-right',
            });
        } else { alert('error') }
    };

    const handleCancel = () => {
        navigate('/qlcv/kehoach');
    };

    return (
        <>
            <div className={cx('wrapper')}>
                <h2>
                    <Link to="/qlcv/kehoach">
                        <FontAwesomeIcon className={cx('back-icon')} icon={faCircleArrowLeft} />
                    </Link>
                    Thêm công việc đột xuất
                </h2>
                <div className={cx('inner')}>
                    <form className={cx('form-group')}>
                        <div className={cx('form-item')}>
                            <label>Số thứ tự</label>
                            <input
                                type="number"
                                min={0}
                                max={999}
                                name="cv_stt"

                                value={ThemCVDX.cv_stt}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={cx('form-item')}>
                            <label>Tên kế hoạch</label>
                            <input
                                type="search"
                                name="cv_ten"
                                value={ThemCVDX.cv_ten}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={cx('form-item')}>
                            <label>Thời gian bắt đầu</label>
                            <input
                                type="date"
                                name="cv_thgianbatdau"
                                value={ThemCVDX.cv_thgianbatdau}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={cx('form-item')}>
                            <label>Thời gian kết thúc</label>
                            <input
                                type="date"
                                name="cv_thgianketthuc"
                                value={ThemCVDX.cv_thgianketthuc}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={cx('form-item')}>
                            <label>Tổng thời gian</label>
                            <input
                                type="search"
                                name="cv_tongthgian"
                                value={ThemCVDX.cv_tongthgian}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={cx('form-item')}>
                            <label>Loại kế hoạch</label>
                            {/* <input
                                type="search"
                                name="cv_loaikehoach"
                                value={ThemCVDX.cv_loaikehoach}
                                onChange={handleChange}
                            /> */}
                            <select name='cv_loaikehoach' onChange={handleChange}>
                                <option>-- Chọn loại kế hoạch --</option>
                                <option value='Kế Hoạch Theo Tháng'>Tháng</option>
                                <option value='Kế Hoạch Theo Quý'>Quý</option>
                                <option value='Kế Hoạch Theo Năm'>Năm</option>

                            </select>
                        </div>
                    </form>
                    <div className={cx('handle')}>
                        <button onClick={handleThemDonVi}>Lưu</button>
                        <button onClick={handleCancel}>Hủy</button>
                    </div>
                </div>
            </div>
        </>

    );
}

export default ThemCVDX;