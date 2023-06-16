import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import axiosClient from '~/api/axiosClient';
import classNames from 'classnames/bind';
import styles from './Header.module.scss';
import Logo from '~/assets/images/logo_vnpt.png';

const cx = classNames.bind(styles);

function Header() {
    const [infoUser, setInfoUser] = useState([]);

    useEffect(() => {
        const getInfoUser = async () => {
            const token = localStorage.getItem('Token');
            const response = await axiosClient.get(`/user-info?token=${token}`);
            setInfoUser(response.data.result);
        };
        getInfoUser();
    }, []);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('heading')}>
                <img src={Logo} alt="Logo_VNPT" />
                <h1>Hệ thống quản lý</h1>
            </div>
            <div className={cx('content')}>
                <div>
                    <h3>{infoUser.nv_ten} </h3>
                    <p>{infoUser.nv_quyen === 'ld' ? 'Lãnh đạo' : 'Nhân viên'}</p>
                </div>
                <Link>
                    <FontAwesomeIcon className={cx('bell-icon')} icon={faBell} />
                    <span className={cx('badge')}>2</span>
                </Link>
            </div>
        </div>
    );
}

export default Header;
