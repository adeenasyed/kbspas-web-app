import Calendar from './Calendar';
import SnackbarAlert from './SnackbarAlert';
import { useState } from 'react';
import axios from "axios";
import { format } from 'date-fns';
import Grid from "@mui/material/Grid";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import theme from "../../theme";

const buttonProps = { 
    sx: { color: theme.palette.admin } 
};

function DeleteAvailability({CustomTypography, fetchAvailability, availability, appointments}) {
    const [selectedDates, setSelectedDates] = useState([]);
    const [warningAppointments, setWarningAppointments] = useState([]);
    const [showWarning, setShowWarning] = useState(false);
    const [showAlert, setShowAlert] = useState({
        message: "",
        success: false,
    });
    
    const handleSubmit = () => {
        if (!selectedDates.length) {
            setShowAlert({message: "Please select at least 1 date"});
        } else {
            const appts = appointments
            .filter(appointment => {
                const formattedDate = format(new Date(appointment.date), 'MM-dd-yyyy');
                return selectedDates.includes(formattedDate);
            })
            .map(appointment => {
                const formattedDate = format(new Date(appointment.date), 'MM-dd-yyyy');
                return `${formattedDate} @ ${appointment.time}`;
            });
            if (appts.length) {
                setWarningAppointments(appts);
                setShowWarning(true);
            } else { 
                deleteAvailability();
            }
        }
    };

    const closeWarning = () => {
        setShowWarning(false);
        setWarningAppointments([]);
    };

    const deleteAvailability = async () => {
        closeWarning();
        try {
            await axios.post('/protected/api/deleteAvailability', {selectedDates}, { withCredentials: true });
            setShowAlert({message: "Availability has been updated", success: true});
            setSelectedDates([]);
            fetchAvailability();
        } catch (error) { 
            setShowAlert({message: "Server error. Please try again", success: false});
        }
    };

    const disableDates = (date) => {
        const formattedDate = format(new Date(date), 'MM-dd-yyyy');
        return !availability.includes(formattedDate);
    };

    return ( 
        <>
            <Grid container item xs={12} sm={12} md={6} lg={6} sx={{padding: 3.5}}>
                <Grid item xs={12}>
                    <CustomTypography>Select date(s) to delete availability from:</CustomTypography>
                    <Calendar disableDates={disableDates} selectedDates={selectedDates} setSelectedDates={setSelectedDates}/>
                </Grid>

                <Grid item xs={12} sx={{marginTop: 2}}>
                    <Button variant="contained" sx={{backgroundColor: theme.palette.admin, ':hover': {backgroundColor: theme.palette.admin}}} onClick={handleSubmit}>Submit</Button>
                </Grid>
            </Grid>

            <Dialog open={showWarning}>
                <DialogTitle sx={{fontWeight: 700}}><WarningRoundedIcon sx={{marginRight: '5px', marginBottom: '4px'}}/>WARNING</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please be aware there are appointments scheduled on one or more of the dates you selected:
                    </DialogContentText>
                    <DialogContentText sx={{paddingTop: 1}}>
                        <div>
                            <ol style={{ listStyleType: 'disc', marginLeft: '24px' }}>
                                {warningAppointments.map((appt, index) => (
                                    <li key={index} style={{marginLeft: 20}}>{appt}</li>
                                ))}
                            </ol>
                        </div>
                    </DialogContentText>
                    <DialogContentText sx={{paddingTop: 1}}>
                        If you choose to set availability for these dates again, keep these appointments in mind to prevent double bookings.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button {...buttonProps} onClick={closeWarning}>Cancel</Button>
                    <Button {...buttonProps} onClick={deleteAvailability}>Submit</Button>
                </DialogActions>
            </Dialog>

            <SnackbarAlert success={showAlert.success} message={showAlert.message} setShowAlert={setShowAlert}/>
        </>
    );
}

export default DeleteAvailability;