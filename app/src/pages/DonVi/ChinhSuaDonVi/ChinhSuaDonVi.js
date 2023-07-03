import { useEffect, useState } from 'react';
import cogoToast from 'cogo-toast';
import classNames from 'classnames/bind';
import styles from '../ThemDonVi/ThemDonVi.module.scss';
import axiosClient from '~/api/axiosClient';

const cx = classNames.bind(styles);

function ChinhSuaDonVi({ togglePopupEdit, setIsOpenEdit, loadDonVi, donViID }) {
    const [dSDonViTruong, setDSDonViTruong] = useState([]);
    const [dSDonViCha, setDSDonViCha] = useState([]);

    const [chinhSuaDonVi, setChinhSuaDonVi] = useState({
        dv_ten: '',
        dv_id_dvtruong: '',
        dv_dvcha: '',
    });

    useEffect(() => {
        const getData = async () => {
            try {
                const responseDonViID = await axiosClient.get(`/get_ID_DonVi/${donViID}`);
                setChinhSuaDonVi(responseDonViID.data.don_vi);

                const responseDonViTruong = await axiosClient.get('/get_NhanVien');
                setDSDonViTruong(responseDonViTruong.data.nhanViens);

                const responseDonViCha = await axiosClient.get('/get_DonVi');
                setDSDonViCha(responseDonViCha.data.don_vis);
            } catch (error) {
                cogoToast.error('Không thể lấy dữ liệu', { position: 'top-right' });
            }
        };
        getData();
    }, [donViID]);

    function handleChange(event) {
        setChinhSuaDonVi({
            ...chinhSuaDonVi,
            [event.target.name]: event.target.value,
        });
    }

    const handleChinhSuaDonVi = async (e) => {
        e.preventDefault();

        const { dv_ten, dv_id_dvtruong, dv_dvcha } = chinhSuaDonVi;

        const response = await axiosClient.put(`/update_DonVi/${donViID}`, {
            dv_ten,
            dv_id_dvtruong,
            dv_dvcha,
        });

        if (response.status === 200) {
            await loadDonVi();
            setIsOpenEdit(false);
            cogoToast.success(`Đơn vị ${dv_ten.toUpperCase()} đã được cập nhật`, {
                position: 'top-right',
            });
        }
    };

    return (
        <div className={cx('wrapper')}>
            <h2>Chỉnh sửa đơn vị</h2>
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
                        <select
                            name="dv_id_dvtruong"
                            value={chinhSuaDonVi.dv_id_dvtruong?.nv_id}
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
                        <select
                            name="dv_dvcha"
                            value={chinhSuaDonVi.dv_dvcha?.dv_id}
                            onChange={handleChange}
                        >
                            <option value="">-- Chọn đơn vị cha --</option>
                            {dSDonViCha.map((dvCha) => (
                                <option key={dvCha.dv_id} value={dvCha.dv_id}>
                                    {dvCha.dv_ten}
                                </option>
                            ))}
                            {chinhSuaDonVi.dv_dvcha === null ? (
                                <option value="">-- Chưa có đơn vị cha --</option>
                            ) : null}
                        </select>
                    </div>
                </form>
                <div className={cx('handle')}>
                    <button onClick={handleChinhSuaDonVi}>Cập nhật</button>
                    <button onClick={togglePopupEdit}>Hủy</button>
                </div>
            </div>
        </div>
    );
}

export default ChinhSuaDonVi;
