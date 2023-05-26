import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import styles from './Login.module.scss';
import Logo from '~/assets/images/logo.png';
import Background from '~/assets/images/background_vnpt.jpg';

const cx = classNames.bind(styles);

function Login() {
    const navigate = useNavigate();

    const [values, setValues] = useState({ name: '', password: '' });

    const handleChangeInput = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const handleSubmitLogin = (e) => {
        e.preventDefault();
        setValues({ password: '' });
        navigate('/home');
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('heading')}>
                <img src={Logo} alt="Logo_VNPT" />
                <h1>Hệ thống quản lý</h1>
            </div>
            <div className={cx('inner')}>
                <img src={Background} alt="Image_VNPT_HG" />
                <div className={cx('form-login')}>
                    <form onSubmit={handleSubmitLogin}>
                        <h2>ĐĂNG NHẬP</h2>
                        <div className={cx('form-group')}>
                            <input type="text" required name="name" onChange={handleChangeInput} />
                            <label>Tài khoản</label>
                            <FontAwesomeIcon className={cx('icon-btn')} icon={faUser} />
                        </div>

                        <div className={cx('form-group')}>
                            <input
                                type="password"
                                required
                                name="password"
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

export default Login;
