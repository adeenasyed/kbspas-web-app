import SnackbarAlert from './SnackbarAlert';
import { useState, useEffect } from 'react';
import axios from "axios";
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Slider from '@mui/material/Slider';
import Button from '@mui/material/Button';
import Paper from "@mui/material/Paper";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import theme from '../../theme';

function ManagePromos({CustomTypography, TableHeader}) { 
    const [promoCode, setPromoCode] = useState("");
    const [percentOff, setPercentOff] = useState(0);
    const [showAlert, setShowAlert] = useState({
        message: "",
        success: false,
    });
    const [activePromos, setActivePromos] = useState([]);

    const handlePromoCodeChange = (event) => { 
        const value = event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 18);
        setPromoCode(value);
    }

    const validatePromo = () => {
        return /^[A-Z0-9]{2,18}$/.test(promoCode) && !activePromos.some(promo => promo.code === promoCode) && percentOff;
    };

    const handleSubmit = () => {
        if (validatePromo()) {
            createPromo();
        } else {
            setShowAlert(prevState => ({ ...prevState, message: "Please fill in all fields correctly", success: false}));
        }
    };

    const fetchPromos = async () => {
        try {
            const response = await axios.get(`/protected/api/fetchPromos`);
            setActivePromos(response.data);
        } catch (error) {/* */}
    };

    useEffect(() => {
        fetchPromos();
    }, []);

    const createPromo = async () => {
        try { 
            await axios.post(`/protected/api/createPromo`, {
                promoCode: promoCode.trim().toUpperCase(), 
                percentOff
            }, { withCredentials: true });
            setPromoCode("");
            setPercentOff(0);
            setShowAlert(prevState => ({ ...prevState, message: "Promotion has been created", success: true }));
            fetchPromos();
        } catch (error) { 
            setShowAlert(prevState => ({ ...prevState, message: "Server error. Please try again", success: false }));
        }
    };

    const deletePromo = async (id) => {
        try {
            await axios.delete(`/protected/api/deletePromo/${id}`, { withCredentials: true });
            fetchPromos();
        } catch (error) {/* */}
    };

    return ( 
        <Grid container sx={{padding: 3.5}}>
            <Grid item xs={12}>
                <TextField
                    label="Promo code"
                    value={promoCode}
                    onChange={handlePromoCodeChange}
                    sx={{
                        width: 300,
                        '& .MuiOutlinedInput-root': {
                            '&.Mui-focused fieldset': {
                                borderColor: theme.palette.admin + '!important'
                            }
                        },
                        '& .MuiInputLabel-root': {
                            '&.Mui-focused': {
                                color: theme.palette.admin + '!important'
                            }
                        }
                    }}
                />
            </Grid>

            <Grid item xs={12} sx={{marginTop: 3}}>
                <CustomTypography sx={{marginBottom: 0.5}}>Percent off:</CustomTypography>
                <Slider
                    marks={[
                        {
                            value: 0,
                            label: '0%'
                        },
                        {
                            value: 100,
                            label: '100%'
                        }
                    ]}
                    valueLabelDisplay="auto"
                    value={percentOff}
                    onChange={(event, newValue) => setPercentOff(newValue)}
                    sx={{
                        width: 300,
                        '& .MuiSlider-thumb': {
                            color: theme.palette.admin
                        },
                        '& .MuiSlider-track': {
                            color: theme.palette.admin
                        },
                        '& .MuiSlider-rail': {
                            color: theme.palette.admin
                        },
                        '& .MuiSlider-mark': {
                            color: theme.palette.admin
                        }
                    }}
                />
            </Grid>

            <Grid item xs={12} sx={{marginTop: 3}}>
                <Typography sx={{color: theme.palette.formText2}}>Note: promo codes can only contain letters and numbers and each promo must have a unique code</Typography>
            </Grid>

            <Grid item xs={12} sx={{marginTop: 3}}>
                <Button variant="contained" sx={{backgroundColor: theme.palette.admin, ':hover': {backgroundColor: theme.palette.admin}}} onClick={handleSubmit}>Submit</Button>
            </Grid>

            <Grid item xs={12} sx={{marginTop: 6}}>
                <Typography sx={{fontWeight: 700, fontSize: '20px'}}>
                    Active Promotions
                </Typography>
            </Grid>
            
            <Grid item xs={12} sx={{marginTop: 3}}>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableHeader>Promo</TableHeader>
                                <TableHeader>Percent Off</TableHeader>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {activePromos.map((promo) => (
                                <TableRow key={promo._id}>
                                    <TableCell>{promo.code}</TableCell>
                                    <TableCell>{promo.percentOff}%</TableCell>
                                    <TableCell><button onClick={() => deletePromo(promo._id)}><ClearRoundedIcon/></button></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>

            <SnackbarAlert success={showAlert.success} message={showAlert.message} setShowAlert={setShowAlert}/>
        </Grid>
    );
}

export default ManagePromos;