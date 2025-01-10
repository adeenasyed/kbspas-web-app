import { useState } from "react";
import Grid from "@mui/material/Grid";
import { CardElement } from "@stripe/react-stripe-js";
import theme from "../../theme";

const CARD_OPTIONS = {
	iconStyle: "solid",
	style: {
		base: {
			iconColor: theme.palette.formText2,
			color: "black",
            fontSize: "16px",
			fontFamily: "Segoe UI Regular, sans-serif",
			":-webkit-autofill": { color: theme.palette.formText2 },
			"::placeholder": { color: theme.palette.formText2 }
		},
		invalid: {
			iconColor: theme.palette.err,
			color: theme.palette.err,
		}
	},
}

function PaymentForm({handleCardChange, FormHeader}) { 
    const [paymentFocus, setPaymentFocus] = useState(false);
    const [paymentHover, setPaymentHover] = useState(false);
    
    const borderStyle = () => {
        if (paymentFocus) {
            return '2px solid' + theme.palette.accent;
        }
        if (paymentHover) {
            return '1px solid black';
        }
        return '1px solid #bfbeba';
    };

    return ( 
        <>
            <Grid item xs={12} sx={{marginTop: '18px', marginBottom: 2}}>
                <FormHeader>Payment</FormHeader>
            </Grid>

            <Grid item xs={12} align="center">
                <div 
                    style={{border: borderStyle(), borderRadius: '10px', padding: '18px'}}
                    onMouseEnter={() => setPaymentHover(true)}
                    onMouseLeave={() => setPaymentHover(false)}
                >
                    <CardElement options={CARD_OPTIONS}
                        onFocus={() => setPaymentFocus(true)}
                        onBlur={() => setPaymentFocus(false)}
                        onChange={handleCardChange}
                    />
                </div>
            </Grid>
        </>
    );
}

export default PaymentForm;