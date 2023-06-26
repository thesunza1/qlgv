import { useState, useEffect } from 'react';
import axiosClient from '~/api/axiosClient';
import classNames from 'classnames/bind';
import styles from './ThemCV.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import swal from 'sweetalert';

const cx = classNames.bind(styles);

function ThemCV({ onClose, kh_id }) {
    const [taskData, setTaskData] = useState({
        kh_id: kh_id,
        cv_ten: '',
        cv_thgianbatdau: new Date().toISOString().substr(0, 10),
        cv_noidung: '',
        cv_cv_cha: '',
        cv_trongso: '',
        dv_id: '',
        da_id: '',
        n_cv_id: '',
        cv_hanhoanthanh: '',
        cv_tgthuchien: '',
        cv_trangthai: '0',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const {
            cv_ten,
            cv_thgianbatdau,
            cv_noidung,
            cv_cv_cha,
            cv_trongso,
            dv_id,
            kh_id,
            da_id,
            n_cv_id,
            cv_hanhoanthanh,
            cv_tgthuchien,
            cv_trangthai,
        } = taskData;
        const token = localStorage.getItem('Token');
        const response = await axiosClient.post(`/add_CongViec/${taskData.kh_id}?token=${token}`, {
            cv_ten,
            cv_thgianbatdau,
            cv_noidung,
            cv_cv_cha,
            cv_trongso,
            dv_id,
            kh_id,
            da_id,
            n_cv_id,
            cv_hanhoanthanh,
            cv_tgthuchien,
            cv_trangthai,
        });

        if (response.status === 200) {
            swal(`Thêm công việc ${cv_ten.toUpperCase()} mới thành công`, {
                position: 'top-right',
            });
            window.location.reload();
        } else {
            alert('Có lỗi xảy ra, vui lòng thử lại sau.');
        }
    };

    function handleInputChange(event) {
        setTaskData({
            ...taskData,
            [event.target.name]: event.target.value,
        });
    }

    const handleCancel = () => {
        onClose();
    };
    const [optionListDV, setOptionListDV] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            const resDonVi = await axiosClient.get(`/get_DonVi`);
            setOptionListDV(resDonVi.data.don_vis);
        };

        fetchData();
    }, []);
    return (
        <div className={cx('modal')}>
            <div className={cx('modal-content')}>
                <header className={cx('modal-header')}>
                    <h2>Thêm công việc cho kế hoạch {kh_id}</h2>
                    <button onClick={handleCancel} className={cx('close-button')}>
                        <FontAwesomeIcon icon={faClose} />
                    </button>
                </header>
                <div className={cx('inner')}>
                    <form className={cx('form-group')}>
                        <div className={cx('form-item')}>
                            <label>Tên công việc</label>
                            <input
                                type="text"
                                name="cv_ten"
                                value={taskData.cv_ten}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className={cx('form-item')}>
                            <label>Thời gian bắt đầu</label>
                            <input
                                type="date"
                                name="cv_thgianbatdau"
                                value={taskData.cv_thgianbatdau}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className={cx('form-item')}>
                            <label>Hạn hoàn thành</label>
                            <input
                                type="date"
                                name="cv_hanhoanthanh"
                                value={taskData.cv_hanhoanthanh}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className={cx('form-item')}>
                            <label>Nội dung</label>
                            <textarea
                                name="cv_noidung"
                                value={taskData.cv_noidung}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className={cx('form-item')}>
                            <label>Công việc cha</label>
                            <input
                                type="text"
                                name="cv_cv_cha"
                                value={taskData.cv_cv_cha}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className={cx('form-item')}>
                            <label>Trọng số</label>
                            <input
                                type="text"
                                name="cv_trongso"
                                value={taskData.cv_trongso}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className={cx('form-item')}>
                            <label>Đơn vị</label>
                            <select
                                type="text"
                                name="dv_id"
                                value={taskData.dv_id}
                                onChange={handleInputChange}
                            >
                                <option>--Chọn đơn vị--</option>
                                {optionListDV.map((item) => (
                                    <>
                                        <option key={item.dv_id} value={item.dv_id}>
                                            {item.dv_ten}
                                        </option>
                                    </>
                                ))}
                            </select>
                        </div>
                        <div className={cx('form-item')}>
                            <label>Dự án</label>
                            <input
                                type="text"
                                name="da_id"
                                value={taskData.da_id}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className={cx('form-item')}>
                            <label>Nhân viên</label>
                            <input
                                type="text"
                                name="n_cv_id"
                                value={taskData.n_cv_id}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className={cx('form-item')}>
                            <label>Thời gian thực hiện</label>
                            <input
                                type="text"
                                name="cv_tgthuchien"
                                value={taskData.cv_tgthuchien}
                                onChange={handleInputChange}
                            />
                        </div>
                    </form>
                </div>
                <footer className={cx('modal-footer')}>
                    <button onClick={handleSubmit}>Lưu lại</button>
                    <button onClick={handleCancel}>Hủy</button>
                </footer>
            </div>
        </div>
    );
}

export default ThemCV;
