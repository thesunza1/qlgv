import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleArrowLeft } from '@fortawesome/free-solid-svg-icons';
import cogoToast from 'cogo-toast';
import classNames from 'classnames/bind';
import styles from './ChiTietKeHoach.module.scss'
import axiosClient from '~/api/axiosClient';

const cx = classNames.bind(styles);

function ChiTietKeHoach() {
    const navigate = useNavigate();
    const { kh_id, kh_ten, nv_id, kh_thgianketthuc, kh_tongthgian } = useParams();
    console.log(kh_id, kh_ten, nv_id, kh_thgianketthuc, kh_tongthgian)
    const [ChiTietKeHoach, setChiTietKeHoach] = useState({
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
            kh_thgianketthuc,
            kh_tongthgian,
        });
    }, [kh_id,
        kh_ten,
        nv_id,
        kh_thgianketthuc,
        kh_tongthgian,]);

    function handleChange(event) {
        setChiTietKeHoach({
            ...ChiTietKeHoach,
            [event.target.name]: event.target.value,
        });
    }

    // const handleChiTietKeHoach = async (e) => {
    //     e.preventDefault();

    //     const { kh_ten, kh_id_khtruong, kh_khcha } = ChiTietKeHoach;

    //     const response = await axiosClient.put(`/update_donvi/${kh_id}`, {
    //         kh_ten,
    //         kh_id_khtruong,
    //         kh_khcha,
    //     });

    //     if (response.status === 200) {
    //         navigate('/qlcv/donvi');
    //         cogoToast.success(`Chỉnh sửa đơn vị ${kh_ten.toUpperCase()} thành công`, {
    //             position: 'top-right',
    //         });
    //     }
    // };

    const handleCancel = () => {
        navigate('/qlcv/kehoach');
    };

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
                    <div className={cx('form-item')}>
                        <label>Tên kế hoạch: </label>
                        {/* <input
                            type="search"
                            name="kh_ten"
                            value={ChiTietKeHoach.kh_ten}
                            onChange={handleChange}
                        /> */}
                        <div>
                            {ChiTietKeHoach.kh_ten}
                        </div>
                    </div>
                    <div className={cx('form-item')}>
                        <label>Mức độ hoàn thành: </label>
                        {/* <input
                            type="search"
                            name="kh_id_khtruong"
                            value={ChiTietKeHoach.kh_id_khtruong}
                            onChange={handleChange}
                        /> */}
                        <div>
                            {ChiTietKeHoach.kh_ten}
                        </div>
                    </div>
                    <div className={cx('form-item')}>
                        <label>Người chịu trách nhiệm: </label>
                        {/* <input
                            type="search"
                            name="kh_khcha"
                            value={ChiTietKeHoach.kh_khcha}
                            onChange={handleChange}
                        /> */}
                        <div>{ChiTietKeHoach.nv_id}
                        </div>
                    </div>
                    <div className={cx('form-item')}>
                        <label>Tổng thời gian hiện tại: </label>
                        {/* <input
                            type="search"
                            name="kh_khcha"
                            value={ChiTietKeHoach.kh_khcha}
                            onChange={handleChange}
                        /> */}
                        <div>
                            {ChiTietKeHoach.kh_tongthgian}
                        </div>
                    </div>
                    <div className={cx('form-item')}>
                        <label>Thời gian hoàn thành dự kiến: </label>
                        {/* <input
                            type="search"
                            name="kh_khcha"
                            value={ChiTietKeHoach.kh_khcha}
                            onChange={handleChange}
                        /> */}
                        <div>
                            {ChiTietKeHoach.kh_thgianketthuc.split(" ")[0]}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ChiTietKeHoach;
