import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosClient from '~/api/axiosClient';
import cogoToast from 'cogo-toast';
import classNames from 'classnames/bind';
import styles from './ThemNhanVien.module.scss';

const cx = classNames.bind(styles);

function ThemNhanVien({ togglePopupAdd, setIsOpenAdd, loadNhanVien }) {
    const { dv_id } = useParams();
    // eslint-disable-next-line no-unused-vars
    const [donViID, setDonViID] = useState(dv_id);

    const [themNhanVien, setThemNhanVien] = useState({
        nv_taikhoan: '',
        nv_matkhau: '',
        nv_ten: '',
        nv_stt: '',
        nv_quyen: 'nv',
        nv_quyenthamdinh: '0',
        nv_sdt: '',
        dv_id: donViID,
        nv_diachi: '',
    });

    const [dSDonVi, setDSDonVi] = useState([]);

    useEffect(() => {
        const getDSDonVi = async () => {
            const response = await axiosClient.get('/get_DonVi');
            setDSDonVi(response.data.don_vis);
        };
        getDSDonVi();
    }, []);

    function handleChange(event) {
        setThemNhanVien({
            ...themNhanVien,
            [event.target.name]: event.target.value,
        });
    }

    const handleThemNhanVien = async (e) => {
        e.preventDefault();

        const {
            nv_taikhoan,
            nv_matkhau,
            nv_ten,
            nv_stt,
            nv_quyen,
            nv_quyenthamdinh,
            nv_sdt,
            dv_id,
            nv_diachi,
        } = themNhanVien;

        const response = await axiosClient.post('/add_NhanVien', {
            nv_taikhoan,
            nv_matkhau,
            nv_ten,
            nv_stt,
            nv_quyen,
            nv_quyenthamdinh,
            nv_sdt,
            dv_id,
            nv_diachi,
        });

        if (response.status === 200) {
            await loadNhanVien();
            setIsOpenAdd(false);
            cogoToast.success(`Nhân viên ${nv_ten.toUpperCase()} đã được thêm`, {
                position: 'top-right',
            });
        }
    };

    return (
        <div className={cx('wrapper')}>
            <h2>Thêm nhân viên</h2>
            <div className={cx('inner')}>
                <form className={cx('form-group')}>
                    <div className={cx('form-item')}>
                        <label>Tên nhân viên</label>
                        <input
                            type="search"
                            name="nv_ten"
                            value={themNhanVien.nv_ten}
                            onChange={handleChange}
                        />
                    </div>
                    <div className={cx('form-item')}>
                        <label>Tên tài khoản</label>
                        <input
                            type="search"
                            name="nv_taikhoan"
                            value={themNhanVien.nv_taikhoan}
                            onChange={handleChange}
                        />
                    </div>
                    <div className={cx('form-item')}>
                        <label>Mật khẩu</label>
                        <input
                            type="password"
                            name="nv_matkhau"
                            value={themNhanVien.nv_matkhau}
                            onChange={handleChange}
                        />
                    </div>
                    <div className={cx('form-item')}>
                        <label>Độ ưu tiên</label>
                        <input
                            type="search"
                            name="nv_stt"
                            value={themNhanVien.nv_stt}
                            onChange={handleChange}
                        />
                    </div>
                    <div className={cx('form-item')}>
                        <label>Quyền</label>
                        <select
                            name="nv_quyen"
                            value={themNhanVien.nv_quyen || 'nv'}
                            onChange={handleChange}
                        >
                            <option value="nv">Nhân viên</option>
                            <option value="ld">Lãnh đạo</option>
                        </select>
                    </div>
                    <div className={cx('form-item')}>
                        <label>Quyền thẩm định</label>
                        <select
                            name="nv_quyenthamdinh"
                            value={themNhanVien.nv_quyenthamdinh || '0'}
                            onChange={handleChange}
                        >
                            <option value="0">Không</option>
                            <option value="1">Có</option>
                        </select>
                    </div>
                    <div className={cx('form-item')}>
                        <label>Thuộc đơn vị</label>
                        <select
                            name="dv_id"
                            value={themNhanVien.dv_id || donViID}
                            onChange={handleChange}
                        >
                            {dSDonVi.map((dv) => (
                                <option key={dv.dv_id} value={dv.dv_id}>
                                    {dv.dv_ten}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className={cx('form-item')}>
                        <label>Số điện thoại</label>
                        <input
                            type="search"
                            name="nv_sdt"
                            value={themNhanVien.nv_sdt}
                            onChange={handleChange}
                        />
                    </div>
                    <div className={cx('form-item')}>
                        <label>Địa chỉ</label>
                        <input
                            type="search"
                            name="nv_diachi"
                            value={themNhanVien.nv_diachi}
                            onChange={handleChange}
                        />
                    </div>
                </form>
                <div className={cx('handle')}>
                    <button onClick={handleThemNhanVien}>Lưu</button>
                    <button onClick={togglePopupAdd}>Hủy</button>
                </div>
            </div>
        </div>
    );
}

export default ThemNhanVien;
