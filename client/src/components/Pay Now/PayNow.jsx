import ApptDetails from "./ApptDetails";
import ContactForm from "./ContactForm";
import WaiverForm from "./WaiverForm";
import Promo from "./Promo";
import PostPayNow from "../Post Pay Now/PostPayNow";
import Loading from "../Post Pay Now/Loading";
import { useState, useEffect } from "react";
import axios from "axios";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Error from '@mui/icons-material/Error';
import { styled } from "@mui/material";
import theme from "../../theme";

function PayNow({selectedService, selectedLocation, selectedDate, selectedTimeSlot, total, bypass}) {
    const DEPOSIT_AMOUNT = bypass ? 0 : 20;

    const [formInfo, setFormInfo] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        waiver: false,
        promoCode: ''
    });

    const [showError, setShowError] = useState(false);

    const [promoApplied, setPromoApplied] = useState(0);
    const [showPromoCodeError, setShowPromoCodeError] = useState(false);

    const handleFirstNameChange = (event) => {
        const value = event.target.value.replace(/[^a-zA-Z-' ]/g, '').slice(0, 35);
        setFormInfo(prevState => ({ ...prevState, firstName: value }));
    };
    const handleLastNameChange = (event) => {
        const value = event.target.value.replace(/[^a-zA-Z-' ]/g, '').slice(0, 35);
        setFormInfo(prevState => ({ ...prevState, lastName: value }));
    };
    const handleEmailChange = (event) => {
        const value = event.target.value.slice(0, 254);
        setFormInfo(prevState => ({ ...prevState, email: value }));
    };
    const handlePhoneNumChange = (event) => {
        const value = event.target.value.replace(/\D/g, '').slice(0, 10);
        setFormInfo(prevState => ({ ...prevState, phone: value }));
    };
    const handleWaiverChange = (event) => {
        setFormInfo(prevState => ({ ...prevState, waiver: event.target.checked }));
    };
    const handlePromoCodeChange = (event) => {
        const value = event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 18);
        setFormInfo(prevState => ({ ...prevState, promoCode: value }));
        setShowPromoCodeError(false);
    };

    const validateForm = () => {
        const errors = {
            firstName: !/^[a-zA-Z-' ]{1,35}$/.test(formInfo.firstName),
            lastName: !/^[a-zA-Z-' ]{1,35}$/.test(formInfo.lastName),
            email: !/^(?=.{1,254}$)(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(formInfo.email),
            phone: !/^\d{10}$/.test(formInfo.phone),
            waiver: !formInfo.waiver
        };

        return !Object.values(errors).some(error => error);
    };

    useEffect(() => {
        if (validateForm()) {
            setShowError(false);
        }
    }, [formInfo]);

    const validatePromoCode = async () => {
        if (!/^[A-Z0-9]{2,18}$/.test(formInfo.promoCode)) {
            setShowPromoCodeError(true);
            return;
        }
        try {
            const response = await axios.post('/api/validatePromoCode', {promoCode: formInfo.promoCode.trim().toUpperCase()});
            const promo = response.data;
            if (promo.valid) {
                setPromoApplied(promo.percentOff);
            } else {
                setShowPromoCodeError(true);
            }
        } catch (error) {
            setShowPromoCodeError(true);
        }
    };

    const clearPromoCode = () => {
        setPromoApplied(0);
        setFormInfo(prevState => ({ ...prevState, promoCode: '' }));
    };

    const [loading, setLoading] = useState(false);
    const [postPayNow, setPostPayNow] = useState(false);

    const confirm = (event) => {
        const button = event.target;
        button.disabled = true;

        if (!validateForm()) {
            setShowError(true);
            button.disabled = false;
            return;
        }

        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setPostPayNow(true);
        }, 1000);
    };

    const FormHeader = styled(Typography)({
        fontWeight: 700,
        fontSize: '20px'
    });

    if (loading) {
        return (<Loading/>);
    } else if (postPayNow) {
        return (<PostPayNow redirect={false}/>);
    }
    return (
        <Grid container style={{display: 'flex', height: '100vh'}}>
            <ApptDetails selectedService={selectedService} selectedLocation={selectedLocation} selectedDate={selectedDate} selectedTimeSlot={selectedTimeSlot} total={total} DEPOSIT_AMOUNT={DEPOSIT_AMOUNT} promoApplied={promoApplied} FormHeader={FormHeader} />

            <Grid item xs={12} sm={12} md={6} lg={6} padding={3.5}>
                <ContactForm formInfo={formInfo} handleFirstNameChange={handleFirstNameChange} handleLastNameChange={handleLastNameChange} handleEmailChange={handleEmailChange} handlePhoneNumChange={handlePhoneNumChange} FormHeader={FormHeader}/>

                <WaiverForm waiver={formInfo.waiver} handleWaiverChange={handleWaiverChange} FormHeader={FormHeader}/>

                <Promo promoCode={formInfo.promoCode} handlePromoCodeChange={handlePromoCodeChange} validatePromoCode={validatePromoCode} showPromoCodeError={showPromoCodeError} setShowPromoCodeError={setShowPromoCodeError} promoApplied={promoApplied} clearPromoCode={clearPromoCode}/>

                {(showError) &&
                    <Grid item xs={12} sx={{paddingTop: 3.5}}>
                        <Typography sx={{fontWeight: 700, color: theme.palette.err}}>
                            <Error sx={{marginRight: '2px', marginBottom: '4px'}}/> Please ensure all fields are filled in correctly
                        </Typography>
                    </Grid>
                }

                <Grid item xs={12} align="center" sx={{paddingTop: 3.5}}>
                    <Button
                        variant="contained"
                        sx={{fontWeight: 700, backgroundColor: 'black', ':hover': {backgroundColor: 'black'}}}
                        onClick={confirm}
                        disabled={loading}
                    >
                        Confirm Appointment
                    </Button>
                </Grid>
            </Grid>
        </Grid>
    );
  }

  export default PayNow;
