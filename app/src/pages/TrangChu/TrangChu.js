import React from 'react';
import { useEffect, useState } from 'react';
import callApi from '~/api/axiosClient';
import classNames from 'classnames/bind';
import styles from './TrangChu.module.scss';
// import { Token } from '@mui/icons-material';
const cx = classNames.bind(styles);
function TrangChu() {
    const [soKeHoach, setSoKeHoach] = useState([]);
    const [soNhanVien, setSoNhanVien] = useState([]);
    const [soCongViec, setSoCongViec] = useState([]);
    // useEffect(() => {
    //     callApi.get(`/getKeHoach?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvYXBpL2F1dGgvU2lnbkluIiwiaWF0IjoxNjg2MjAxMDU2LCJleHAiOjE2ODYyMDQ2NTYsIm5iZiI6MTY4NjIwMTA1NiwianRpIjoiaWxreXF3eTE3WVpNVmlmUyIsInN1YiI6IjQiLCJwcnYiOiI3ZWE5MTdmMmI1MGIyY2I0MDQ3YTBiNGZkMjgwZTFiYmY4NjhmNmQxIn0.dNblgXcdvW3g3Z5mbJJ1ID7Cad95va4eK806KDJbjBk`)
    //         .then((response) => {
    //             setSoKeHoach(response.data.ke_hoachs);
    //         })
    // }, [])
    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('Token');
            const resSoKeHoach = await callApi.get(`/get_CV_KeHoach?token=${token}`);
            const resSoNhanVien = await callApi.get(`/getNhanVien`);
            setSoKeHoach(resSoKeHoach.data.so_luong_ke_hoach);
            setSoCongViec(resSoKeHoach.data.so_luong_cong_viec);
            setSoNhanVien(resSoNhanVien.data.so_luong_nhan_vien);
        };

        fetchData()

    }, []);
    return <div className={cx('wrapper')}>
        <h1 className={cx('title')}>TỔNG QUAN</h1>
        <div className={cx('content')}>
            <div className={cx('card')}>
                <div className={cx('card-number')}>
                    {soNhanVien}
                </div>
                <div className={cx('card-text')}>
                    <h2>Nhân viên</h2>
                </div>
            </div>
            <div className={cx('card')}>
                <div className={cx('card-number')}>
                    {soKeHoach}
                </div>
                <div className={cx('card-text')}>
                    <h2>Kế hoạch</h2>
                </div>
            </div>
            <div className={cx('card')}>
                <div className={cx('card-number')}>
                    {soCongViec}
                </div>
                <div className={cx('card-text')}>
                    <h2>Công việc cần làm</h2>
                </div>
            </div>
        </div>
    </div>;
}

export default TrangChu;
