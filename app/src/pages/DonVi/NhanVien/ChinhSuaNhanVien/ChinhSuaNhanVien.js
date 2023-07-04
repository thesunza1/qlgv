import { useEffect, useState } from 'react';
import axiosClient from '~/api/axiosClient';
import cogoToast from 'cogo-toast';
import classNames from 'classnames/bind';
import styles from '../ThemNhanVien/ThemNhanVien.module.scss';

const cx = classNames.bind(styles);

function ChinhSuaNhanVien({ togglePopupEdit, setIsOpenEdit, loadNhanVien, nVID }) {
    const [nhanVienID] = useState(nVID);

    const [chinhSuaNhanVien, setChinhSuaNhanVien] = useState({
        nv_taikhoan: '',
        nv_matkhau: '',
        nv_ten: '',
        nv_stt: '10',
        nv_quyen: 'nv',
        nv_quyenthamdinh: '0',
        nv_sdt: '',
        dv_id: nhanVienID,
        nv_diachi: '',
    });

    const [dSDonVi, setDSDonVi] = useState([]);

    useEffect(() => {
        const getData = async () => {
            try {
                const responseDonViID = await axiosClient.get(`/get_ID_NhanVien/${nVID}`);
                setChinhSuaNhanVien(responseDonViID.data.nhanVien);

                const responseDSDonVi = await axiosClient.get('/get_DonVi');
                setDSDonVi(responseDSDonVi.data.don_vis);
            } catch (error) {
                cogoToast.error('Không thể lấy dữ liệu', { position: 'top-right' });
            }
        };
        getData();
    }, [nVID]);

    function handleChange(event) {
        setChinhSuaNhanVien({
            ...chinhSuaNhanVien,
            [event.target.name]: event.target.value,
        });
    }

    const handleChinhSuaNhanVien = async (e) => {
        e.preventDefault();

        const {
            nv_taikhoan,
            nv_matkhau,
            nv_ten,
            nv_quyen,
            nv_quyenthamdinh,
            nv_sdt,
            dv_id,
            nv_diachi,
        } = chinhSuaNhanVien;

        const response = await axiosClient.put(`/update_NhanVien/${nhanVienID}`, {
            nv_taikhoan,
            nv_matkhau,
            nv_ten,
            nv_quyen,
            nv_quyenthamdinh,
            nv_sdt,
            dv_id,
            nv_diachi,
        });

        if (response.status === 200) {
            await loadNhanVien();
            setIsOpenEdit(false);
            cogoToast.success(`Nhân viên ${nv_ten.toUpperCase()} đã được cập nhật`, {
                position: 'top-right',
            });
        }
    };

    return (
        <div className={cx('wrapper')}>
            <h2>Chỉnh sửa nhân viên</h2>
            <div className={cx('inner')}>
                <form className={cx('form-group')} onSubmit={handleChinhSuaNhanVien}>
                    <div className={cx('form-item')}>
                        <label>Tên nhân viên</label>
                        <input
                            type="search"
                            required
                            pattern="[\p{L}0-9 ]{0,100}"
                            title="Vui lòng nhập tên nhân viên (tối đa 100 ký tự, không chứa ký tự đặc biệt)"
                            name="nv_ten"
                            value={chinhSuaNhanVien.nv_ten}
                            onChange={handleChange}
                        />
                    </div>
                    <div className={cx('form-item')}>
                        <label>Tên tài khoản</label>
                        <input
                            type="search"
                            required
                            pattern=".{0,50}"
                            title="Vui lòng nhập tên tài khoản (tối đa 50 ký tự)"
                            name="nv_taikhoan"
                            value={chinhSuaNhanVien.nv_taikhoan}
                            onChange={handleChange}
                        />
                    </div>
                    <div className={cx('form-item')}>
                        <label>Mật khẩu</label>
                        <input
                            type="password"
                            pattern=".{8,}"
                            title="Mật khẩu phải có ít nhất 8 ký tự"
                            value={chinhSuaNhanVien.nv_matkhau}
                            onChange={handleChange}
                        />
                    </div>
                    <div className={cx('form-item')}>
                        <label>Quyền</label>
                        <select
                            name="nv_quyen"
                            value={chinhSuaNhanVien.nv_quyen || 'nv'}
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
                            value={chinhSuaNhanVien.nv_quyenthamdinh || '0'}
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
                            value={chinhSuaNhanVien.dv_id || nhanVienID}
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
                            required
                            pattern="[0-9]{10}"
                            title="Vui lòng nhập số điện thoại gồm 10 chữ số"
                            name="nv_sdt"
                            value={chinhSuaNhanVien.nv_sdt}
                            onChange={handleChange}
                        />
                    </div>
                    <div className={cx('form-item')}>
                        <label>Địa chỉ</label>
                        <input
                            type="search"
                            required
                            pattern=".{0,255}"
                            title="Vui lòng nhập địa chỉ (tối đa 255 ký tự)"
                            name="nv_diachi"
                            value={chinhSuaNhanVien.nv_diachi}
                            onChange={handleChange}
                        />
                    </div>
                    <div className={cx('handle')}>
                        <button>Cập nhật</button>
                        <button onClick={togglePopupEdit}>Hủy</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ChinhSuaNhanVien;
