import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleArrowLeft } from '@fortawesome/free-solid-svg-icons';
import axiosClient from '~/api/axiosClient';
import cogoToast from 'cogo-toast';
import classNames from 'classnames/bind';
import styles from '../ThemNhanVien/ThemNhanVien.module.scss';

const cx = classNames.bind(styles);

function ChinhSuaNhanVien() {
    const navigate = useNavigate();
    const { dv_id, nv_id } = useParams();
    // eslint-disable-next-line no-unused-vars
    const [donViID, setDonViID] = useState(dv_id);
    // eslint-disable-next-line no-unused-vars
    const [nhanVienID, setNhanVienID] = useState(nv_id);

    const [chinhSuaNhanVien, setChinhSuaNhanVien] = useState({
        nv_taikhoan: '',
        nv_matkhau: '',
        nv_ten: '',
        nv_stt: '',
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
                const responseDonViID = await axiosClient.get(`/get_ID_NhanVien/${nv_id}`);
                setChinhSuaNhanVien(responseDonViID.data.nhanVien);

                const responseDSDonVi = await axiosClient.get('/get_DonVi');
                setDSDonVi(responseDSDonVi.data.don_vis);
            } catch (error) {
                cogoToast.error('Không thể lấy dữ liệu', { position: 'top-right' });
            }
        };
        getData();
    }, [nv_id]);

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
            nv_stt,
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
            nv_stt,
            nv_quyen,
            nv_quyenthamdinh,
            nv_sdt,
            dv_id,
            nv_diachi,
        });

        if (response.status === 200) {
            navigate(`/qlcv/donvi/${donViID}/nhanvien`);
            cogoToast.success(`Nhân viên ${nv_ten.toUpperCase()} đã được cập nhật`, {
                position: 'top-right',
            });
        }
    };

    const handleCancel = () => {
        navigate(`/qlcv/donvi/${donViID}/nhanvien`);
    };

    return (
        <div className={cx('wrapper')}>
            <h2>
                <Link to={`/qlcv/donvi/${donViID}/nhanvien`}>
                    <FontAwesomeIcon className={cx('back-icon')} icon={faCircleArrowLeft} />
                </Link>
                Chỉnh sửa nhân viên
            </h2>
            <div className={cx('inner')}>
                <form className={cx('form-group')}>
                    <div className={cx('form-item')}>
                        <label>Tên nhân viên</label>
                        <input
                            type="search"
                            required
                            name="nv_ten"
                            value={chinhSuaNhanVien.nv_ten}
                            onChange={handleChange}
                        />
                    </div>
                    <div className={cx('form-item')}>
                        <label>Tên tài khoản</label>
                        <input
                            type="search"
                            name="nv_taikhoan"
                            value={chinhSuaNhanVien.nv_taikhoan}
                            onChange={handleChange}
                        />
                    </div>
                    <div className={cx('form-item')}>
                        <label>Mật khẩu</label>
                        <input
                            type="password"
                            value={chinhSuaNhanVien.nv_matkhau}
                            onChange={handleChange}
                        />
                    </div>
                    <div className={cx('form-item')}>
                        <label>Độ ưu tiên</label>
                        <input
                            type="search"
                            name="nv_stt"
                            value={chinhSuaNhanVien.nv_stt}
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
                            name="nv_sdt"
                            value={chinhSuaNhanVien.nv_sdt}
                            onChange={handleChange}
                        />
                    </div>
                    <div className={cx('form-item')}>
                        <label>Địa chỉ</label>
                        <input
                            type="search"
                            name="nv_diachi"
                            value={chinhSuaNhanVien.nv_diachi}
                            onChange={handleChange}
                        />
                    </div>
                </form>
                <div className={cx('handle')}>
                    <button onClick={handleChinhSuaNhanVien}>Cập nhật</button>
                    <button onClick={handleCancel}>Hủy</button>
                </div>
            </div>
        </div>
    );
}

export default ChinhSuaNhanVien;
