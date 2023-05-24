import classNames from 'classnames/bind';
import styles from './Header.module.scss';
import Logo from '~/assets/images/logo.jpg'
import { Link } from 'react-router-dom';
const cx = classNames.bind(styles);

function Header() {
    return <div className={cx('wrapper')}>
                <div className={cx('inner')}>
                    <Link to="/home"><img className={cx('logo')} src={Logo} alt="" /></Link>
                    <div className={cx('header')}>
                        <div className={cx('header-left')}>
                            <Link class={cx('header-name')}>Hệ Thống Quản Lý</Link>
                        </div>
                        <div className={cx('header-right')}>
                            <Link class={cx('header-name')}>Username</Link>
                        </div>
                    </div>
                </div>
            </div>;
}

export default Header;
