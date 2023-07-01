import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleArrowLeft } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import styles from './ChiTietKeHoach.module.scss';
import BangCongViec from './BangCongViec';

const cx = classNames.bind(styles);

function ChiTietKeHoach() {
    const { kh_id, kh_ten, nv_id, kh_thgianbatdau, kh_thgianketthuc, kh_trangthai } = useParams();

    const [chiTietKeHoach, setChiTietKeHoach] = useState({
        kh_id: '',
        kh_ten: '',
        nv_id: '',
        kh_thgianketthuc: '',
        kh_tongthgian: '',
    });

    useEffect(() => {
        setChiTietKeHoach({
            kh_id,
            kh_ten,
            nv_id,
            kh_thgianbatdau,
            kh_thgianketthuc,
            kh_trangthai,
        });
    }, [kh_id, kh_ten, nv_id, kh_thgianbatdau, kh_thgianketthuc, kh_trangthai]);

    function trangThai(trangThai) {
        switch (trangThai) {
            case '0':
                return <button className={cx('b0')}>Đang Soạn</button>;
            case '1':
                return <button className={cx('b1')}>Chờ duyệt</button>;
            case '2':
                return <button className={cx('b2')}>Đang thực hiện</button>;
            case '3':
                return <button className={cx('b3')}>Hoàn thành</button>;
            case '4':
                return <button className={cx('b4')}>Quá hạn</button>;
            default:
                return <button className={cx('b5')}>Từ chối</button>;
        }
    }

    return (
        <div className={cx('wrapper')}>
            <h2>
                <Link to="/qlcv/kehoach">
                    <FontAwesomeIcon className={cx('back-icon')} icon={faCircleArrowLeft} />
                </Link>
                Chi tiết kế hoạch
            </h2>
            <div className={cx('inner')}>
                <form className={cx('form-group')}>
                    <div>
                        <div className={cx('form-item')}>
                            <label>
                                Tên kế hoạch: <span>{chiTietKeHoach.kh_ten}</span>
                            </label>
                        </div>
                        <div className={cx('form-item')}>
                            <label>
                                Người lập kế hoạch: <span>{chiTietKeHoach.nv_id}</span>
                            </label>
                        </div>
                    </div>
                    <div>
                        <div className={cx('form-item')}>
                            <label>
                                Thời gian bắt đầu: <span>{chiTietKeHoach.kh_thgianbatdau}</span>
                            </label>
                        </div>
                        <div className={cx('form-item')}>
                            <label>
                                Hạn hoàn thành: <span>{chiTietKeHoach.kh_thgianketthuc}</span>
                            </label>
                        </div>
                    </div>
                    <div>
                        <div className={cx('form-item')}>
                            <label>
                                Trạng thái: <span>{trangThai(chiTietKeHoach.kh_trangthai)}</span>
                            </label>
                        </div>
                    </div>
                </form>
            </div>
            <BangCongViec />
        </div>
    );
}

export default ChiTietKeHoach;
