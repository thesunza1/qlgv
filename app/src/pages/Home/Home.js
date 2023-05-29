import React from 'react';
import classNames from 'classnames/bind';
import styles from './Home.module.scss';
const cx = classNames.bind(styles);
function Home() {
    return <div className={cx('wrapper')}>
        <h1 className={cx('title')}>TỔNG QUAN</h1>
        <div className={cx('content')}>
            <div className={cx('card')}>
                <div className={cx('card-number')}>
                    152
                </div>
                <div className={cx('card-text')}>
                    <h2>Nhân viên</h2>
                </div>
            </div>
            <div className={cx('card')}>
                <div className={cx('card-number')}>
                    152
                </div>
                <div className={cx('card-text')}>
                    <h2>Kế hoạch</h2>
                </div>
            </div>
            <div className={cx('card')}>
                <div className={cx('card-number')}>
                    152
                </div>
                <div className={cx('card-text')}>
                    <h2>Công việc cần làm</h2>
                </div>
            </div>
        </div>
    </div>;
}

export default Home;
