import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleArrowLeft } from '@fortawesome/free-solid-svg-icons';
import axiosClient from '~/api/axiosClient';
// import cogoToast from 'cogo-toast';
import classNames from 'classnames/bind';
import styles from './XinGiaHan.module.scss';
import { useParams } from 'react-router-dom';

const cx = classNames.bind(styles);

function XinGiaHan() {
    const navigate = useNavigate();
    const { cv_id, cv_ten, cv_thgianhoanthanh, lido, thgiandenghi } = useParams();

    const [xinGiaHan, setXinGiaHan] = useState({
        cv_id: '',
        cv_ten: '',
        cv_thgianhoanthanh: '',
        lido: '',
        thgiandenghi: '',
    });
    useEffect(() => {
        setXinGiaHan({
            cv_id,
            cv_ten,
            cv_thgianhoanthanh,
            lido,
            thgiandenghi,
        });
    }, [cv_id, cv_ten, cv_thgianhoanthanh, lido, thgiandenghi]);

    function handleChange(event) {
        setXinGiaHan({
            ...xinGiaHan,
            [event.target.name]: event.target.value,
        });
    }

    const handleXinGiaHan = async (e) => {
        e.preventDefault();

        const { kh_ten, kh_thgianhoanthanh, lido, thgiandenghi } = xinGiaHan;
        const token = localStorage.getItem('Token');
        const response = await axiosClient.post(`/update_KeHoach/${cv_id}?token=${token}`, {
            cv_id,
            cv_ten,
            cv_thgianhoanthanh,
            lido,
            thgiandenghi,
        });

        if (response.status === 200) {
            navigate('/qlcv/donvi');
            alert(`Xin gia hạn ${kh_ten.toUpperCase()} mới thành công`, {
                position: 'top-right',
            });
        }
    };

    const handleCancel = () => {
        navigate('/qlcv/congviec');
    };

    return (
        <>
            <div className={cx('wrapper')}>
                <h2>
                    <Link to="/qlcv/congviec">
                        <FontAwesomeIcon className={cx('back-icon')} icon={faCircleArrowLeft} />
                    </Link>
                    Xin Gia Hạn
                </h2>
                <div className={cx('inner')}>
                    <form className={cx('form-group')}>
                        <div className={cx('form-item')}>
                            <label>Tên kế hoạch</label>
                            <input
                                type="search"
                                name="kh_ten"
                                value={xinGiaHan.cv_ten}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={cx('form-item')}>
                            <label>Thời gian hết hạn</label>
                            <input
                                type="date"
                                name="kh_thgianbatdau"
                                value={xinGiaHan.cv_thgianhoanthanh ? xinGiaHan.cv_thgianhoanthanh.split(' ')[0] : '2023-01-01'}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={cx('form-item')}>
                            <label>Lý do gia hạn</label>
                            <input
                                type="search"
                                name="kh_ten"
                                value={xinGiaHan.lido}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={cx('form-item')}>
                            <label>Thời gian gia hạn</label>
                            <input
                                type="date"
                                name="kh_ten"
                                value={xinGiaHan.thgiandenghi}
                                onChange={handleChange}
                            />
                        </div>
                    </form>
                    <div className={cx('handle')}>
                        <button onClick={handleXinGiaHan}>Lưu</button>
                        <button onClick={handleCancel}>Hủy</button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default XinGiaHan;
