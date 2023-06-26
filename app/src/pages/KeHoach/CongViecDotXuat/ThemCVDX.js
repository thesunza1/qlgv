import { useState } from 'react';
import axiosClient from '~/api/axiosClient';
import classNames from 'classnames/bind';
import styles from './ThemCVDX.module.scss';
import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleArrowLeft } from '@fortawesome/free-solid-svg-icons';
const cx = classNames.bind(styles);
function AddTaskForm() {
    const navigate = useNavigate();
    const [taskData, setTaskData] = useState({
        kh_id: 1,
        cong_viec: [
            {
                cv_ten: '',
                cv_thgianbatdau: '',
                cv_trangthai: '',
                cv_noidung: '',
                cv_cv_cha: '',
                cv_trongso: '',
                dv_id: '',
                da_id: '',
                n_cv_id: '',
                cv_hanhoanthanh: '',
                cv_tgthuchien: '',
            },
        ],
    });

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axiosClient.post(
                `/add_CV_DotXuat?token=${localStorage.getItem('Token')}`,
                {
                    body: JSON.stringify(taskData),
                },
            );
            if (response.ok) {
                console.log('Task added successfully!');
                setTaskData({
                    kh_id: 1,
                    cong_viec: [
                        {
                            cv_ten: '',
                            cv_thgianbatdau: '',
                            cv_trangthai: '',
                            cv_noidung: '',
                            cv_cv_cha: '',
                            cv_trongso: '',
                            dv_id: '',
                            da_id: '',
                            n_cv_id: '',
                            cv_hanhoanthanh: '',
                            cv_tgthuchien: '',
                        },
                    ],
                });
            } else {
                console.error('Failed to add task');
                console.log(taskData);
            }
        } catch (error) {
            console.error('Failed to add task: ', error);
            console.log(taskData);
        }
    };

    const handleInputChange = (event, index) => {
        const { name, value } = event.target;
        const updatedTaskData = { ...taskData };
        updatedTaskData.cong_viec[index][name] = value;
        setTaskData(updatedTaskData);
    };

    // const handleAddTask = () => {
    //     const updatedTaskData = { ...taskData };
    //     updatedTaskData.cong_viec.push({
    //         cv_ten: '',
    //         cv_thgianbatdau: '',
    //         cv_trangthai: '',
    //         cv_noidung: '',
    //         cv_cv_cha: '',
    //         cv_trongso: '',
    //         dv_id: '',
    //         da_id: '',
    //         n_cv_id: '',
    //         cv_hanhoanthanh: '',
    //         cv_tgthuchien: '',
    //     });
    //     setTaskData(updatedTaskData);
    // };
    const handleCancel = () => {
        navigate('/qlcv/kehoach');
    };

    return (
        <>
            <div className={cx('wrapper')}>
                <h2>
                    <Link to="/qlcv/kehoach">
                        <FontAwesomeIcon className={cx('back-icon')} icon={faCircleArrowLeft} />
                    </Link>
                    Thêm công việc đột xuất
                </h2>
                <div className={cx('inner')}>
                    <form className={cx('form-group')}>
                        <div className={cx('form-item')}>
                            <label>Tên kế hoạch</label>
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
                            <input
                                type="search"
                                name="cv_noidung"
                                value={taskData.cong_viec[0].cv_noidung}
                                onChange={(event) => handleInputChange(event, 0)}
                            />
                        </div>
                        <div className={cx('form-item')}>
                            <label>Công việc cha</label>
                            <input
                                type="search"
                                name="cv_cv_cha"
                                value={taskData.cong_viec[0].cv_cv_cha}
                                onChange={(event) => handleInputChange(event, 0)}
                            />
                        </div>
                        <div className={cx('form-item')}>
                            <label>Thời gian thực hiện</label>
                            <input
                                type="search"
                                name="cv_tgthuchien"
                                value={taskData.cong_viec[0].cv_tgthuchien}
                                onChange={(event) => handleInputChange(event, 0)}
                            />
                        </div>
                        <div className={cx('form-item')}>
                            <label>Dự án</label>
                            <input
                                type="search"
                                name="da_id"
                                value={taskData.cong_viec[0].da_id}
                                onChange={(event) => handleInputChange(event, 0)}
                            />
                        </div>
                        <div className={cx('form-item')}>
                            <label>N cv id</label>
                            <input
                                type="search"
                                name="n_cv_id"
                                value={taskData.cong_viec[0].n_cv_id}
                                onChange={(event) => handleInputChange(event, 0)}
                            />
                        </div>
                        <div className={cx('form-item')}>
                            <label>Trạng thái</label>
                            <input
                                type="search"
                                name="cv_trangthai"
                                value={taskData.cong_viec[0].cv_trangthai}
                                onChange={(event) => handleInputChange(event, 0)}
                            />
                        </div>
                        <div className={cx('form-item')}>
                            <label>Trọng số</label>
                            <input
                                type="search"
                                name="cv_trongso"
                                value={taskData.cong_viec[0].cv_trongso}
                                onChange={(event) => handleInputChange(event, 0)}
                            />
                        </div>
                        <div className={cx('form-item')}>
                            <label>Đơn vị</label>
                            <select
                                value={taskData.cong_viec[0].dv_id}
                                onChange={(event) => handleInputChange(event, 0)}
                            >
                                <option>-- Chọn loại kế hoạch --</option>
                                <option value="1">Tháng</option>
                                <option value="2">Quý</option>
                                <option value="3">Năm</option>
                            </select>
                        </div>
                    </form>
                    <div className={cx('handle')}>
                        <button onClick={handleSubmit}>Lưu</button>
                        <button onClick={handleCancel}>Hủy</button>
                    </div>
                </div>
            </div>
        </>
    );
}
export default AddTaskForm;
