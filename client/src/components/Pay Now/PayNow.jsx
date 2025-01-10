import ApptDetails from "./ApptDetails";
import ContactForm from "./ContactForm";
import WaiverForm from "./WaiverForm";
import PaymentForm from "./PaymentForm";
import Promo from "./Promo";
import PostPayNow from "../Post Pay Now/PostPayNow";
import Loading from "../Post Pay Now/Loading";
import { useState, useEffect } from "react";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { v4 as uuidv4 } from 'uuid';
import axios from "axios";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
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

    const [cardError, setCardError] = useState(true);
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
    const handleCardChange = (event) => {
        if (event.error || !event.complete) {
            setCardError(true);
        } else {
            setCardError(false);
        }
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
            waiver: !formInfo.waiver,
            ...(bypass ? {} : {card: cardError})
        };
    
        return !Object.values(errors).some(error => error);
    };

    useEffect(() => {
        if (validateForm()) {
            setShowError(false);
        }
    }, [formInfo, cardError]);
    
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

    const stripe = useStripe();
    const elements = useElements();
    const idempotencyKey = uuidv4();
    const [loading, setLoading] = useState(false);
    const [paymentFailed, setPaymentFailed] = useState(false);
    const [postPayNow, setPostPayNow] = useState(false);
    const [redirect, setRedirect] = useState(false);

    const payment = async (event) => { 
        event.preventDefault();

        const button = event.target;
        button.disabled = true;

        if (!validateForm()) {
            setShowError(true);
            button.disabled = false;
            return;
        } else {
            const {error, paymentMethod} = await stripe.createPaymentMethod({ 
                type: "card",
                card: elements.getElement(CardElement),
                billing_details: {
                    name: formInfo.firstName.trim() + ' ' + formInfo.lastName.trim(),
                    email: formInfo.email
                }
            });
            
            if(!error) {
                setLoading(true);
                setPaymentFailed(false);
                try {
                    const {id} = paymentMethod;
                    const response = await axios.post("/api/payment", { 
                        id,
                        firstName: formInfo.firstName.trim(),
                        lastName: formInfo.lastName.trim(),
                        email: formInfo.email.trim().toLowerCase(),
                        phone: formInfo.phone,
                        promoCode: formInfo.promoCode.trim().toUpperCase(),
                        selectedService,
                        selectedLocation,
                        selectedDate, 
                        selectedTimeSlot
                    }, { headers: { 'Idempotency-Key': idempotencyKey } });

                    if (response.data.message === "Payment failed") { 
                        setLoading(false);
                        button.disabled = false;
                        setPaymentFailed(true);
                    } else if (response.data.message === "Time slot unavailable")  {
                        setRedirect(true);
                        setPostPayNow(true);
                        setLoading(false);
                    } else {
                        setPostPayNow(true);
                        setLoading(false);
                    }
                } catch (error) { 
                    if (error.response && error.response.data !== "Rate limit exceeded") { 
                        setRedirect(true);
                        setPostPayNow(true);
                        setLoading(false);
                    }
                }
            } else { 
                button.disabled = false;
                setCardError(true);
                setShowError(true);
            }
        }
    };

    const bypassPayment = async (event) => { 
        const button = event.target;
        button.disabled = true;

        if (!validateForm()) {
            setShowError(true);
            button.disabled = false;
            return;
        } else {
            setLoading(true);
            try {
                const response = await axios.post("/protected2/api/bypassPayment", { 
                    firstName: formInfo.firstName.trim(),
                    lastName: formInfo.lastName.trim(),
                    email: formInfo.email.trim().toLowerCase(),
                    phone: formInfo.phone,
                    promoCode: formInfo.promoCode.trim().toUpperCase(),
                    selectedService,
                    selectedLocation,
                    selectedDate, 
                    selectedTimeSlot
                });

                if (response.data.message === "Time slot unavailable")  {
                    setRedirect(true);
                    setPostPayNow(true);
                    setLoading(false);
                } else {
                    setPostPayNow(true);
                    setLoading(false);
                }
            } catch (error) { 
                if (error.response && error.response.data !== "Rate limit exceeded") { 
                    setRedirect(true);
                    setPostPayNow(true);
                    setLoading(false);
                }
            }
        }
    };

    const FormHeader = styled(Typography)({
        fontWeight: 700, 
        fontSize: '20px'
    });

    if (loading) {
        return (<Loading/>);
    } else if (postPayNow) { 
        return (<PostPayNow redirect={redirect}/>);
    }
    return (
        <Grid container style={{display: 'flex', height: '100vh'}}>
            <ApptDetails selectedService={selectedService} selectedLocation={selectedLocation} selectedDate={selectedDate} selectedTimeSlot={selectedTimeSlot} total={total} DEPOSIT_AMOUNT={DEPOSIT_AMOUNT} promoApplied={promoApplied} FormHeader={FormHeader} />

            <Grid item xs={12} sm={12} md={6} lg={6} padding={3.5}>
                <ContactForm formInfo={formInfo} handleFirstNameChange={handleFirstNameChange} handleLastNameChange={handleLastNameChange} handleEmailChange={handleEmailChange} handlePhoneNumChange={handlePhoneNumChange} FormHeader={FormHeader}/>

                <WaiverForm waiver={formInfo.waiver} handleWaiverChange={handleWaiverChange} FormHeader={FormHeader}/>

                <PaymentForm handleCardChange={handleCardChange} FormHeader={FormHeader}/>

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
                        onClick={(event) => (bypass ? bypassPayment(event) : payment(event))}
                        disabled={loading}
                    >
                        Pay ${DEPOSIT_AMOUNT} Deposit
                    </Button>
                </Grid>
            </Grid>
            
            <Snackbar open={paymentFailed} onClose={() => {setPaymentFailed(false)}} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                <Alert 
                    onClose={() => {setPaymentFailed(false)}} 
                    severity="error"
                    sx={{
                        backgroundColor: theme.palette.err,
                        color: 'white',
                        '& .MuiAlert-icon': {
                            color: 'white',
                        }
                    }}
                    >
                    Payment failed. Please try again.
                </Alert>
            </Snackbar>
        </Grid>
    );
  }
  
  export default PayNow;