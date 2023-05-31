import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleLeft } from '@fortawesome/free-solid-svg-icons';
import { Box, Button, Paper, TextField, Typography } from '@mui/material';
import cogoToast from 'cogo-toast';

function ChinhSuaDonVi() {
    const navigate = useNavigate();

    const handleEditUnit = () => {
        navigate('/donvi');
        cogoToast.success(`Chỉnh sửa đơn vị thành công`, { position: 'top-right' });
    };

    const handleCancel = () => {
        navigate('/donvi');
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '350px',
                    margin: '10px 0 20px 0',
                }}
            >
                <Link to="/donvi">
                    <FontAwesomeIcon
                        icon={faCircleLeft}
                        style={{ fontSize: '2.5rem', color: 'green', marginLeft: '150px' }}
                    />
                </Link>
                <Typography
                    sx={{
                        flex: '1 1 80%',
                        fontWeight: 'bold',
                    }}
                    variant="h3"
                    id="tableTitle"
                    component="div"
                >
                    Chỉnh sửa đơn vị
                </Typography>
            </Box>
            <Box component="form" noValidate autoComplete="off">
                <Paper
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '20px',
                        width: '50%',
                        margin: '0 auto',
                        padding: '20px',
                    }}
                    elevation={5}
                >
                    <TextField
                        type="search"
                        InputLabelProps={{
                            shrink: false,
                        }}
                        variant="outlined"
                        placeholder="Tên đơn vị..."
                        size="small"
                        sx={{
                            width: '100%',
                            '& .MuiInputLabel-root': {
                                fontSize: '1.4rem',
                            },
                            '& .MuiInputBase-input': {
                                fontSize: '1.4rem',
                            },
                        }}
                    />
                    <TextField
                        type="search"
                        InputLabelProps={{
                            shrink: false,
                        }}
                        variant="outlined"
                        placeholder="Đơn vị trưởng"
                        size="small"
                        sx={{
                            width: '100%',
                            '& .MuiInputLabel-root': {
                                fontSize: '1.4rem',
                            },
                            '& .MuiInputBase-input': {
                                fontSize: '1.4rem',
                            },
                        }}
                    />
                    <TextField
                        type="search"
                        InputLabelProps={{
                            shrink: false,
                        }}
                        rows={6}
                        variant="outlined"
                        placeholder="Ghi chú"
                        multiline
                        size="small"
                        sx={{
                            width: '100%',
                            '& .MuiInputLabel-root': {
                                fontSize: '1.4rem',
                            },
                            '& .MuiInputBase-input': {
                                fontSize: '1.4rem',
                            },
                        }}
                    />
                    <Box sx={{ display: 'flex', gap: '10px' }}>
                        <Button
                            variant="contained"
                            sx={{ width: '50px', fontSize: '1.2rem', fontWeight: 'bold' }}
                            onClick={handleEditUnit}
                        >
                            Lưu
                        </Button>
                        <Button
                            variant="contained"
                            sx={{ width: '50px', fontSize: '1.2rem', fontWeight: 'bold' }}
                            onClick={handleCancel}
                        >
                            Hủy
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Box>
    );
}

export default ChinhSuaDonVi;
