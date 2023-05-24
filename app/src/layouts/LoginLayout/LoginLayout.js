import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './LoginLayout.module.scss';
import Logo from '~/assets/images/logo.jpg';

const cx = classNames.bind(styles);

function LoginLayout({ children }) {
    return (
        <div className={cx('wrapper')}>
            <heading className={cx('inner')}>
                <img src={Logo} alt="Logo VNPT" />
                <ul>
                    <li>
                        <Link>Giới thiệu</Link>
                    </li>
                    <li>
                        <Link>Liên hệ</Link>
                    </li>
                    <li>
                        <Link>Tin tức</Link>
                    </li>
                </ul>
            </heading>
            <div className={cx('container')}>
                <div className={cx('content')}>{children}</div>
            </div>
            <footer className={cx('footer')}>
                <img src={Logo} alt="Logo VNPT" />
                <a
                    href="https://www.facebook.com/haugiang.vnpt.vn"
                    target="blank"
                    alt="Facebook_VNPT_HauGiang"
                >
                    https://www.facebook.com/haugiang.vnpt.vn
                </a>
            </footer>
        </div>
    );
}

export default LoginLayout;
