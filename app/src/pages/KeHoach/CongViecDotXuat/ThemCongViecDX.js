import { useState, useEffect } from 'react';
import axiosClient from '~/api/axiosClient';
import classNames from 'classnames/bind';
import styles from './ThemCongViecDX.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import swal from 'sweetalert';

const cx = classNames.bind(styles);

function AddTaskModal({ onClose }) {
    const [taskData, setTaskData] = useState({
        kh_id: 1,
        cong_viec: [
            {
                cv_ten: 'Tên công việc',
                cv_thgianbatdau: new Date().toISOString().substr(0, 10),
                cv_noidung: 'Nội dung',
                cv_cv_cha: 1,
                cv_trongso: 1,
                dv_id: '',
                da_id: 1,
                n_cv_id: 1,
                cv_hanhoanthanh: '',
                cv_tgthuchien: 300,
                lcv_id: 1,
                nv_id_lam: '',
            },
        ],
    });

    const handleSubmit = async (event) => {
        event.preventDefault();

        const token = localStorage.getItem('Token');
        const response = await axiosClient.post(`/add_CV_DotXuat?token=${token}`, {
            kh_id: taskData.kh_id,
            cong_viec: taskData.cong_viec,
        });

        if (response.status === 200) {
            swal(`Thêm kế hoạch ${taskData.cong_viec[0].cv_ten.toUpperCase()} mới thành công`, {
                position: 'top-right',
            });
            onClose();
            window.location.reload();
        } else {
            alert('error');
        }
    };

    const handleInputChange = (event, index) => {
        const { name, value } = event.target;
        setTaskData((prevState) => ({
            ...prevState,
            cong_viec: [
                {
                    ...prevState.cong_viec[index],
                    [name]: value,
                },
            ],
        }));
    };

    const handleCancel = () => {
        onClose();
    };
    const [optionListDV, setOptionListDV] = useState([]);
    const [optionListNV, setOptionListNV] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            const resDonVi = await axiosClient.get(`/get_DonVi`);
            const resNhanVien = await axiosClient.get(`/get_NhanVien`);
            setOptionListDV(resDonVi.data.don_vis);
            setOptionListNV(resNhanVien.data.nhanViens);
        };

        fetchData();
    }, []);
    return (
        <div className={cx('modal')}>
            <div className={cx('modal-content')}>
                <header className={cx('modal-header')}>
                    <h2>Thêm công việc đột xuất</h2>
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
                                value={taskData.cong_viec[0].cv_ten}
                                onChange={(event) => handleInputChange(event, 0)}
                            />
                        </div>
                        <div className={cx('form-item')}>
                            <label>Thời gian bắt đầu</label>
                            <input
                                type="date"
                                name="cv_thgianbatdau"
                                value={taskData.cong_viec[0].cv_thgianbatdau}
                                onChange={(event) => handleInputChange(event, 0)}
                            />
                        </div>
                        <div className={cx('form-item')}>
                            <label>Hạn hoàn thành</label>
                            <input
                                type="date"
                                name="cv_hanhoanthanh"
                                value={taskData.cong_viec[0].cv_hanhoanthanh}
                                onChange={(event) => handleInputChange(event, 0)}
                            />
                        </div>

                        <div className={cx('form-item')}>
                            <label>Nội dung</label>
                            <textarea
                                name="cv_noidung"
                                value={taskData.cong_viec[0].cv_noidung}
                                onChange={(event) => handleInputChange(event, 0)}
                            />
                        </div>
                        <div className={cx('form-item')}>
                            <label>Công việc cha</label>
                            <input
                                type="text"
                                name="cv_cv_cha"
                                value={taskData.cong_viec[0].cv_cv_cha}
                                onChange={(event) => handleInputChange(event, 0)}
                            />
                        </div>
                        <div className={cx('form-item')}>
                            <label>Trọng số</label>
                            <input
                                type="text"
                                name="cv_trongso"
                                value={taskData.cong_viec[0].cv_trongso}
                                onChange={(event) => handleInputChange(event, 0)}
                            />
                        </div>
                        <div className={cx('form-item')}>
                            <label>Đơn vị</label>
                            <select
                                type="text"
                                name="dv_id"
                                value={taskData.cong_viec[0].dv_id}
                                onChange={(event) => handleInputChange(event, 0)}
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
                                value={taskData.cong_viec[0].da_id}
                                onChange={(event) => handleInputChange(event, 0)}
                            />
                        </div>
                        <div className={cx('form-item')}>
                            <label>Người đảm nhận</label>
                            <select
                                type="text"
                                name="nv_id_lam"
                                value={taskData.cong_viec[0].nv_id_lam}
                                onChange={(event) => handleInputChange(event, 0)}
                            >
                                <option>--Chọn Nhân viên--</option>
                                {optionListNV.map((item) => (
                                    <>
                                        <option key={item.nv_id} value={item.nv_id}>
                                            {item.nv_ten}
                                        </option>
                                    </>
                                ))}
                            </select>
                        </div>
                        <div className={cx('form-item')}>
                            <label>Thời gian thực hiện</label>
                            <input
                                type="text"
                                name="cv_tgthuchien"
                                value={taskData.cong_viec[0].cv_tgthuchien}
                                onChange={(event) => handleInputChange(event, 0)}
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

export default AddTaskModal;
