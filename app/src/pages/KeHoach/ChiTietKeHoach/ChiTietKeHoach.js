import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleArrowLeft } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import styles from './ChiTietKeHoach.module.scss'
import BangCongViec from './BangCongViec';

const cx = classNames.bind(styles);

function ChiTietKeHoach() {
    const { kh_id, kh_ten, nv_id, kh_thgianketthuc, kh_tongthgian } = useParams();
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

    // useEffect(() => {
    //     const getListProduct = async (kh_id) => {
    //         const token = localStorage.getItem('Token');
    //         const response = await axiosClient.post(`/get_KeHoach_CongViec?token=${token}`, {
    //             kh_id: 6,
    //         });
    //         setDSCongViec(response.data);
    //         console.log(dSCongViec)
    //     };
    //     getListProduct(kh_id);
    // }, []);

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
                    <div className={cx('item-group')}>
                        <div className={cx('form-item')}>
                            <label>Tên kế hoạch: </label>
                            <div>
                                {ChiTietKeHoach.kh_ten}
                            </div>
                        </div>
                        <div className={cx('form-item')}>
                            <label>Mức độ hoàn thành: </label>
                            <div>
                                {ChiTietKeHoach.kh_ten}
                            </div>
                        </div>
                        <div className={cx('form-item')}>
                            <label>Người chịu trách nhiệm: </label>
                            <div>{ChiTietKeHoach.nv_id}
                            </div>
                        </div>
                    </div>


                    <div className={cx('item-group')}>
                        <div className={cx('form-item')}>
                            <label>Tổng thời gian hiện tại: </label>
                            <div>
                                {ChiTietKeHoach.kh_tongthgian}
                            </div>
                        </div>
                        <div className={cx('form-item')}>
                            <label>Thời gian hoàn thành dự kiến: </label>
                            <div>
                                {ChiTietKeHoach.kh_thgianketthuc.split(" ")[0]}
                            </div>
                        </div>
                        <div className={cx('form-item')}>
                            <label>Trạng thái: </label>
                            <div>
                                {ChiTietKeHoach.kh_thgianketthuc.split(" ")[0]}
                            </div>
                        </div>
                    </div>

                </form>
            </div>
            <BangCongViec kh_id={ChiTietKeHoach.kh_id} />
        </div>
    );
}

export default ChiTietKeHoach;
