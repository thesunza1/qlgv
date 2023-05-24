import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './Sidebar.module.scss';
const cx = classNames.bind(styles);


function Sidebar() {
    return <div className={cx("sidebar")}>
        <ul className={cx("sidebar-list")}>
            <li className={cx("sidebar-item")}><Link to="/" class="sidebar-anchor">Item 1</Link></li>
            <li className={cx("sidebar-item")}><Link to="/" class="sidebar-anchor">Item 2</Link></li>
            <li className={cx("sidebar-item")}><Link to="/" class="sidebar-anchor">Item 3</Link></li>
            <li className={cx("sidebar-item")}><Link to="/" class="sidebar-anchor">Item 4</Link></li>
            <li className={cx("sidebar-item")}><Link to="/" class="sidebar-anchor">Item 5</Link></li>
        </ul>
    </div>
}

export default Sidebar;
