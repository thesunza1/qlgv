import classNames from 'classnames/bind';
import styles from './Login.module.scss';

const cx = classNames.bind(styles);

function Login() {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('content')}>
                <h3>Giới thiệu tổng quan</h3>
                <p>
                    Hệ thống là một công cụ quản lý công việc nhằm giúp các tổ chức quản lý và phân
                    phối công việc một cách hiệu quả cho các thành viên trong nhóm. Hệ thống này cho
                    phép các quản lý và người sử dụng đăng ký và phân công các công việc, theo dõi
                    tiến độ và đánh giá kết quả của các công việc đó
                </p>
            </div>
            <form className={cx('form-login')}>
                <h3>Đăng nhập</h3>
                <div className={cx('form-group')}>
                    <label>Tài khoản</label>
                    <input type="text" required />
                </div>
                <div className={cx('form-group')}>
                    <label>Mật khẩu</label>
                    <input type="password" required></input>
                </div>
                <div className={cx('login-btn')}>
                    <button>Đăng nhập</button>
                </div>
                <div className={cx('forgot-pw')}>
                    <a href="/">Quên mật khẩu</a>
                </div>
            </form>
        </div>
    );
}

export default Login;
