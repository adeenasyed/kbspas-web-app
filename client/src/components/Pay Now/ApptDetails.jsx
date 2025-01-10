import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import WestRoundedIcon from '@mui/icons-material/WestRounded';
import { styled } from "@mui/material";

const Label = styled(Typography)({
    fontWeight: 700,
    marginRight: '5px'
});

function ApptDetails({selectedService, selectedLocation, selectedDate, selectedTimeSlot, total, DEPOSIT_AMOUNT, promoApplied, FormHeader}) { 
    const appDetails = [
        { label: 'Service:', detail: selectedService },
        { label: 'Location:', detail: selectedLocation },
        { label: 'Date & Time:', detail: `${selectedDate} @ ${selectedTimeSlot}` }
    ];

    let newTotal = total*(1-promoApplied/100);
    
    return ( 
        <Grid item xs={12} sm={12} md={6} lg={6} 
            sx={{
                height: {
                    xs: 'auto',
                    sm: 'auto',
                    md: '100vh', 
                    lg: '100vh',
                },
                background: '#E0B0AB',
            }}
        >
            <Grid container padding={3.5}>
                <Grid item xs={12}>
                    <button
                        onClick={() => window.location.reload()}
                    >
                        <WestRoundedIcon sx={{fontSize:'32px', color: 'black'}}/>
                    </button>
                </Grid>
                <Grid item xs={12} 
                    sx={{
                        paddingTop: {
                            xs: 3.5,
                            sm: 3.5,
                            md: 10,
                            lg: 10,
                        }, 
                        paddingBottom: 1
                    }}>
                    <FormHeader>Appointment Details</FormHeader>
                </Grid>
                {appDetails.map(appDetail => (
                    <Grid item xs={12} sx={{display: 'flex', paddingY: 1}} key={appDetail.label}>
                        <Label>{appDetail.label}</Label>
                        <Typography>{appDetail.detail}</Typography>
                    </Grid>
                ))}

                <Grid item xs={12} sx={{paddingY: 2}}>
                    <Divider sx={{height: '0.5px', backgroundColor: 'black'}} />
                </Grid>

                <Grid container>
                    <Grid item xs={6} sx={{paddingY: 1}}>
                        <FormHeader>Total</FormHeader>
                    </Grid>
                    <Grid item xs={6} align="right" sx={{paddingY: 1}}>
                        {!!promoApplied ? <FormHeader><del>${Number(total).toFixed(2)}</del> ${Number(newTotal).toFixed(2)}</FormHeader> : <FormHeader>${Number(total).toFixed(2)}</FormHeader>}
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item xs={6} sx={{paddingY: 1}}>
                        <FormHeader>Deposit</FormHeader>
                    </Grid>
                    <Grid item xs={6} align="right" sx={{paddingY: 1}}>
                        <FormHeader>${Number(DEPOSIT_AMOUNT).toFixed(2)}</FormHeader>
                    </Grid>
                </Grid>

                <Grid item xs={12} sx={{paddingTop: 2}}>
                    <Typography>The remaining ${Number(newTotal - DEPOSIT_AMOUNT).toFixed(2)} is to be paid in-person on {selectedDate} (the date of the appointment).</Typography>
                </Grid>
            </Grid>
        </Grid>
    );
}

export default ApptDetails;