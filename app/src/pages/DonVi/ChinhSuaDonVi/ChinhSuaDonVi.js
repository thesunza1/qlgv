import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleArrowLeft } from '@fortawesome/free-solid-svg-icons';
import cogoToast from 'cogo-toast';
import classNames from 'classnames/bind';
import styles from '../ThemDonVi/ThemDonVi.module.scss';
import axiosClient from '~/api/axiosClient';

const cx = classNames.bind(styles);

function ChinhSuaDonVi() {
    const navigate = useNavigate();
    const { dv_id, dv_ten, dv_id_dvtruong, dv_dvcha } = useParams();

    const [chinhSuaDonVi, setChinhSuaDonVi] = useState({
        dv_ten: '',
        dv_id_dvtruong: '',
        dv_dvcha: '',
    });

    useEffect(() => {
        setChinhSuaDonVi({
            dv_id,
            dv_ten,
            dv_id_dvtruong,
            dv_dvcha,
        });
    }, [dv_id, dv_ten, dv_id_dvtruong, dv_dvcha]);

    function handleChange(event) {
        setChinhSuaDonVi({
            ...chinhSuaDonVi,
            [event.target.name]: event.target.value,
        });
    }

    const handleChinhSuaDonVi = async (e) => {
        e.preventDefault();

        const { dv_ten, dv_id_dvtruong, dv_dvcha } = chinhSuaDonVi;

        const response = await axiosClient.put(`/update_donvi/${dv_id}`, {
            dv_ten,
            dv_id_dvtruong,
            dv_dvcha,
        });

        if (response.status === 200) {
            navigate('/qlcv/donvi');
            cogoToast.success(`Chỉnh sửa đơn vị ${dv_ten.toUpperCase()} thành công`, {
                position: 'top-right',
            });
        }
    };

    const handleCancel = () => {
        navigate('/qlcv/donvi');
    };

    return (
        <div className={cx('wrapper')}>
            <h2>
                <Link to="/qlcv/donvi">
                    <FontAwesomeIcon className={cx('back-icon')} icon={faCircleArrowLeft} />
                </Link>
                Chỉnh sửa đơn vị
            </h2>
            <div className={cx('inner')}>
                <form className={cx('form-group')}>
                    <div className={cx('form-item')}>
                        <label>Tên đơn vị</label>
                        <input
                            type="search"
                            name="dv_ten"
                            value={chinhSuaDonVi.dv_ten}
                            onChange={handleChange}
                        />
                    </div>
                    <div className={cx('form-item')}>
                        <label>Đơn vị trưởng</label>
                        <input
                            type="search"
                            name="dv_id_dvtruong"
                            value={chinhSuaDonVi.dv_id_dvtruong}
                            onChange={handleChange}
                        />
                    </div>
                    <div className={cx('form-item')}>
                        <label>Đơn vị cha</label>
                        <input
                            type="search"
                            name="dv_dvcha"
                            value={chinhSuaDonVi.dv_dvcha}
                            onChange={handleChange}
                        />
                    </div>
                </form>
                <div className={cx('handle')}>
                    <button onClick={handleChinhSuaDonVi}>Cập nhật</button>
                    <button onClick={handleCancel}>Hủy</button>
                </div>
            </div>
        </div>
    );
}

export default ChinhSuaDonVi;
