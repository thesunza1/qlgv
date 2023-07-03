import { useEffect, useState } from 'react';
import axiosClient from '~/api/axiosClient';
import cogoToast from 'cogo-toast';
import classNames from 'classnames/bind';
import styles from './ThemDonVi.module.scss';

const cx = classNames.bind(styles);

function ThemDonVi({ togglePopupAdd, setIsOpenAdd, loadDonVi }) {
    const [dSDonViTruong, setDSDonViTruong] = useState([]);
    const [dSDonViCha, setDSDonViCha] = useState([]);

    const [themDonVi, setThemDonVi] = useState({
        dv_ten: '',
        dv_id_dvtruong: '',
        dv_dvcha: '',
    });

    useEffect(() => {
        const getDSDonViTruong = async () => {
            const response = await axiosClient.get('/get_NhanVien');
            setDSDonViTruong(response.data.nhanViens);
        };
        getDSDonViTruong();
    }, []);

    useEffect(() => {
        const getDSDonViCha = async () => {
            const response = await axiosClient.get('/get_DonVi');
            setDSDonViCha(response.data.don_vis);
        };
        getDSDonViCha();
    }, []);

    function handleChange(event) {
        setThemDonVi({
            ...themDonVi,
            [event.target.name]: event.target.value,
        });
    }

    const handleThemDonVi = async (e) => {
        e.preventDefault();

        const { dv_ten, dv_id_dvtruong, dv_dvcha } = themDonVi;

        const response = await axiosClient.post('/add_DonVi', {
            dv_ten,
            dv_id_dvtruong,
            dv_dvcha,
        });

        if (response.status === 200) {
            await loadDonVi();
            setIsOpenAdd(false);
            cogoToast.success(`Đơn vị ${dv_ten.toUpperCase()} đã được thêm`, {
                position: 'top-right',
            });
        }
    };

    return (
        <div className={cx('wrapper')}>
            <h2>Thêm đơn vị</h2>
            <div className={cx('inner')}>
                <form className={cx('form-group')}>
                    <div className={cx('form-item')}>
                        <label>Tên đơn vị</label>
                        <input
                            type="search"
                            name="dv_ten"
                            value={themDonVi.dv_ten}
                            onChange={handleChange}
                        />
                    </div>
                    <div className={cx('form-item')}>
                        <label>Đơn vị trưởng</label>
                        <select
                            name="dv_id_dvtruong"
                            value={themDonVi.dv_id_dvtruong}
                            onChange={handleChange}
                        >
                            <option value="">-- Chọn đơn vị trưởng --</option>
                            {dSDonViTruong.map((dvTruong) => (
                                <option key={dvTruong.nv_id} value={dvTruong.nv_id}>
                                    {dvTruong.nv_ten}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className={cx('form-item')}>
                        <label>Đơn vị cha</label>
                        <select name="dv_dvcha" value={themDonVi.dv_dvcha} onChange={handleChange}>
                            <option value="">-- Chọn đơn vị cha --</option>
                            {dSDonViCha.map((dvCha) => (
                                <option key={dvCha.dv_id} value={dvCha.dv_id}>
                                    {dvCha.dv_ten}
                                </option>
                            ))}
                        </select>
                    </div>
                </form>
                <div className={cx('handle')}>
                    <button onClick={handleThemDonVi}>Lưu</button>
                    <button onClick={togglePopupAdd}>Hủy</button>
                </div>
            </div>
        </div>
    );
}

export default ThemDonVi;
