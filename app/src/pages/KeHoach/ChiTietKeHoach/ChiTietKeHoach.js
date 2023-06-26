import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleArrowLeft } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import styles from './ChiTietKeHoach.module.scss';
import BangCongViec from './BangCongViec';

const cx = classNames.bind(styles);

function ChiTietKeHoach() {
    const { kh_id, kh_ten, nv_ten, kh_thgianketthuc, kh_tongthgian, kh_trangthai } = useParams();
    const [ChiTietKeHoach, setChiTietKeHoach] = useState({
        kh_id: '',
        kh_ten: '',
        nv_ten: '',
        kh_thgianketthuc: '',
        kh_tongthgian: '',
        kh_trangthai: '//',
    });

    useEffect(() => {
        setChiTietKeHoach({
            kh_id,
            kh_ten,
            nv_ten,
            kh_thgianketthuc,
            kh_tongthgian,
            kh_trangthai,
        });
    }, [kh_id, kh_ten, nv_ten, kh_thgianketthuc, kh_tongthgian, kh_trangthai]);
    return (
        <div className={cx('wrapper')}>
            <h2>
                <Link to="/qlcv/kehoach">
                    <FontAwesomeIcon className={cx('back-icon')} icon={faCircleArrowLeft} />
                </Link>
                Chi tiết kế hoạch
            </h2>
            <div className={cx('inner')}>
                <form className={cx('form-group')} style={{ maxWidth: '600px', margin: '0 auto' }}>
                    <div className={cx('item-group')}>
                        <div className={cx('form-item')}>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                                Tên kế hoạch:
                            </label>
                            <div>{ChiTietKeHoach.kh_ten}</div>
                        </div>
                        <div className={cx('form-item')}>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                                Mức độ hoàn thành:
                            </label>
                            <div>{ChiTietKeHoach.kh_ten}</div>
                        </div>
                        <div className={cx('form-item')}>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                                Người chịu trách nhiệm:
                            </label>
                            <div>{ChiTietKeHoach.nv_ten}</div>
                        </div>
                    </div>
                    <div className={cx('item-group')}>
                        <div className={cx('form-item')}>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                                Tổng thời gian hiện tại:
                            </label>
                            <div>{ChiTietKeHoach.kh_tongthgian}</div>
                        </div>
                        <div className={cx('form-item')}>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                                Thời gian hoàn thành dự kiến:
                            </label>
                            <div>{ChiTietKeHoach.kh_thgianketthuc.split(' ')[0]}</div>
                        </div>
                        <div className={cx('form-item')}>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                                Trạng thái:
                            </label>
                            {ChiTietKeHoach.kh_trangthai !== 'null' ? (
                                <div style={{ color: 'green' }}>{ChiTietKeHoach.kh_trangthai}</div>
                            ) : (
                                <div style={{ color: 'red' }}>Chưa có</div>
                            )}
                        </div>
                    </div>
                </form>
            </div>
            <BangCongViec kh_id={ChiTietKeHoach.kh_id} />
        </div>
    );
}

export default ChiTietKeHoach;
