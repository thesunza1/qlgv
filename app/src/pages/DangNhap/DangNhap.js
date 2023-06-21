import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import axiosClient from '~/api/axiosClient';
import cogoToast from 'cogo-toast';
import classNames from 'classnames/bind';
import styles from './DangNhap.module.scss';
import Logo from '~/assets/images/logo_vnpt.png';
import Background from '~/assets/images/background_vnpt.jpg';

const cx = classNames.bind(styles);

function DangNhap() {
    const navigate = useNavigate();

    const [values, setValues] = useState({ nv_taikhoan: '', nv_matkhau: '' });

    const handleChangeInput = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const handleSubmitLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axiosClient.post('/auth/SignIn', values);

            if (response.status === 200) {
                const token = response.data.token;

                localStorage.setItem('Token', token);

                navigate('/qlcv/trangchu');
            }
        } catch (e) {
            if (e.response && e.response.status === 422) {
                cogoToast.error('Tên tài khoản hoặc mật khẩu không hợp lệ', {
                    position: 'top-right',
                });
            } else {
                cogoToast.error('Đã xảy ra lỗi. Vui lòng thử lại sau', {
                    position: 'top-right',
                });
            }
        }
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('heading')}>
                <img src={Logo} alt="Logo_VNPT" />
                <h1>Hệ thống quản lý</h1>
            </div>
            <div className={cx('inner')}>
                <img src={Background} alt="Background_VNPT_HG" />
                <div className={cx('form-login')}>
                    <form onSubmit={handleSubmitLogin}>
                        <h2>ĐĂNG NHẬP</h2>
                        <div className={cx('form-group')}>
                            <input
                                type="text"
                                required
                                name="nv_taikhoan"
                                onChange={handleChangeInput}
                            />
                            <label>Tài khoản</label>
                            <FontAwesomeIcon className={cx('icon-btn')} icon={faUser} />
                        </div>

                        <div className={cx('form-group')}>
                            <input
                                type="password"
                                required
                                name="nv_matkhau"
                                pattern=".{8,}"
                                title="Mật khẩu phải có ít nhất 8 ký tự"
                                onChange={handleChangeInput}
                            />
                            <label>Mật khẩu</label>
                            <FontAwesomeIcon className={cx('icon-btn')} icon={faLock} />
                        </div>
                        <div className={cx('login-btn')}>
                            <button>Đăng nhập</button>
                        </div>
                        <div className={cx('forgot-btn')}>
                            <Link to="/">Quên mật khẩu</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default DangNhap;
