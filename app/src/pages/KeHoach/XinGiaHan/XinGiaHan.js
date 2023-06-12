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
    const { cv_id, cv_ten, cv_thgianketthuc, lydo, thoigian_giahan } = useParams();

    const [xinGiaHan, setXinGiaHan] = useState({
        cv_id: '',
        cv_ten: '',
        cv_thgianketthuc: '',
        lydo: '',
        thoigian_giahan: '',
    });
    useEffect(() => {
        setXinGiaHan({
            cv_id,
            cv_ten,
            cv_thgianketthuc,
            lydo,
            thoigian_giahan,
        });
    }, [cv_id, cv_ten, cv_thgianketthuc, lydo, thoigian_giahan]);

    function handleChange(event) {
        setXinGiaHan({
            ...xinGiaHan,
            [event.target.name]: event.target.value,
        });
    }

    const handleXinGiaHan = async (e) => {
        e.preventDefault();

        const { kh_ten, kh_thgianketthuc, lydo, thoigian_giahan } = xinGiaHan;
        const token = localStorage.getItem('Token');
        const response = await axiosClient.post(`/update_KeHoach/${cv_id}?token=${token}`, {
            cv_id,
            cv_ten,
            cv_thgianketthuc,
            lydo,
            thoigian_giahan,
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
                                value={xinGiaHan.cv_thgianketthuc}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={cx('form-item')}>
                            <label>Lý do gia hạn</label>
                            <input
                                type="search"
                                name="kh_ten"
                                value={xinGiaHan.lydo}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={cx('form-item')}>
                            <label>Thời gian gia hạn</label>
                            <input
                                type="date"
                                name="kh_ten"
                                value={xinGiaHan.thoigian_giahan}
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
