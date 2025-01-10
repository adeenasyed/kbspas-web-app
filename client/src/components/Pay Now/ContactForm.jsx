import Grid from "@mui/material/Grid";
import TextField from '@mui/material/TextField';

function ContactInfo({formInfo, handleFirstNameChange, handleLastNameChange, handleEmailChange, handlePhoneNumChange, FormHeader}) { 
    return ( 
        <>
            <Grid item xs={12} sx={{marginBottom: 2}}>
                <FormHeader>Contact Information</FormHeader>
            </Grid>
            <Grid container>
                <Grid item xs={6} sx={{paddingRight: 1, paddingBottom: 1}}>
                    <TextField
                        label="First name *"
                        value={formInfo.firstName}
                        onChange={(event) => handleFirstNameChange(event)}
                    />
                </Grid>
                <Grid item xs={6} sx={{paddingLeft: 1, paddingBottom: 1}}>
                    <TextField
                        label="Last name *"
                        value={formInfo.lastName}
                        onChange={(event) => handleLastNameChange(event)}
                    />
                </Grid>
            </Grid>
            <Grid container>
                <Grid item xs={6} sx={{paddingRight: 1, paddingTop: 1}}>
                    <TextField
                        type="email"
                        label="Email *"
                        value={formInfo.email}
                        onChange={(event) => handleEmailChange(event)}
                    />
                </Grid>
                <Grid item xs={6} sx={{paddingLeft: 1, paddingTop: 1}}>
                    <TextField
                        type="tel"
                        label="Phone number *"
                        value={formInfo.phone}
                        onChange={(event) => handlePhoneNumChange(event)}
                    />
                </Grid>
            </Grid>
        </>
    );
}

export default ContactInfo;