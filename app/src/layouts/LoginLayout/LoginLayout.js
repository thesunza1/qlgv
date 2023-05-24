import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './LoginLayout.module.scss';
import Logo from '~/assets/images/logo.png';

const cx = classNames.bind(styles);

function LoginLayout({ children }) {
    return (
        <div className={cx('wrapper')}>
            <heading className={cx('inner')}>
                <a href="https://www.facebook.com/haugiang.vnpt.vn" target="blank">
                    <img src={Logo} alt="Logo VNPT" />
                </a>
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
            <div className={cx('content')}>{children}</div>
        </div>
    );
}

export default LoginLayout;
