import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import styles from './Header.module.scss';
import Logo from '~/assets/images/logo.png';

const cx = classNames.bind(styles);

function Header() {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('heading')}>
                <img src={Logo} alt="Logo_VNPT" />
                <h1>Hệ thống quản lý</h1>
            </div>
            <div className={cx('content')}>
                <h3>Lãnh đạo</h3>
                <Link>
                    <FontAwesomeIcon className={cx('bell-icon')} icon={faBell} />
                    <span className={cx('badge')}>2</span>
                </Link>
            </div>
        </div>
    );
}

export default Header;
