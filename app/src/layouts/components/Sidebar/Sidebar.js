import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './Sidebar.module.scss';
const cx = classNames.bind(styles);


function Sidebar() {
    return <div className={cx("sidebar")}>
        <ul className={cx("sidebar-list")}>
            <li className={cx("sidebar-item")}><Link to="/home" className={cx("sidebar-link")}>Trang chủ</Link></li>
            <li className={cx("sidebar-item")}><Link to="/" className={cx("sidebar-link")}>Danh sách đơn vị</Link></li>
            <li className={cx("sidebar-item")}><Link to="/" className={cx("sidebar-link")}>Kế hoạch</Link></li>
            <li className={cx("sidebar-item")}><Link to="/" className={cx("sidebar-link")}>Báo cáo</Link></li>
            <li className={cx("sidebar-item")}><Link to="/" className={cx("sidebar-link")}>Log out</Link></li>
        </ul>
    </div>
}

export default Sidebar;
