import Calendar from './Calendar';
import SnackbarAlert from './SnackbarAlert';
import { useState } from 'react';
import axios from "axios";
import Grid from "@mui/material/Grid";
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import FormGroup from '@mui/material/FormGroup';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import { format } from 'date-fns';
import theme from "../../theme";

const timeSlots = [
    {
        start: "8:00 AM",
        end: "10:30 AM"
    },
    {
        start: "8:30 AM",
        end: "11:00 AM"
    },
    {
        start: "9:00 AM",
        end: "11:30 PM"
    },
    {
        start: "9:30 AM",
        end: "12:00 PM"
    },
    {
        start: "10:00 AM",
        end: "12:30 PM"
    },
    {
        start: "10:30 AM",
        end: "1:00 PM"
    },
    {
        start: "11:00 AM",
        end: "1:30 PM"
    },
    {
        start: "11:30 AM",
        end: "2:00 PM"
    },
    {
        start: "12:00 PM",
        end: "2:30 PM"
    },
    {
        start: "12:30 PM",
        end: "3:00 PM"
    },
    {
        start: "1:00 PM",
        end: "3:30 PM"
    },
    {
        start: "1:30 PM",
        end: "4:00 PM"
    },
    {
        start: "2:00 PM",
        end: "4:30 PM"
    },
    {
        start: "2:30 PM",
        end: "5:00 PM"
    },
    {
        start: "3:00 PM",
        end: "5:30 PM"
    },
    {
        start: "3:30 PM",
        end: "6:00 PM"
    },
    {
        start: "4:00 PM",
        end: "6:30 PM"
    },
    {
        start: "4:30 PM",
        end: "7:00 PM"
    },
    {
        start: "5:00 PM",
        end: "7:30 PM"
    },
    {
        start: "5:30 PM",
        end: "8:00 PM"
    },
    {
        start: "6:00 PM",
        end: "8:30 PM"
    },
    {
        start: "6:30 PM",
        end: "9:00 PM"
    },
    {
        start: "7:00 PM",
        end: "9:30 PM"
    },
    {
        start: "7:30 PM",
        end: "10:00 PM"
    },
    {
        start: "8:00 PM",
        end: "10:30 PM"
    },
    {
        start: "8:30 PM",
        end: "11:00 PM"
    },
];

const checkedProps = {
    sx: {'&.Mui-checked': {color: theme.palette.admin}}
};

function SetAvailability({CustomTypography, fetchAvailability, datesToDisable}) { 
    const [selectedLocation, setSelectedLocation] = useState("");
    const [selectedDates, setSelectedDates] = useState([]);
    const [selectedTimeSlots, setSelectedTimeSlots] = useState([]);
    const [showAlert, setShowAlert] = useState({
        message: "",
        success: false,
    });

    const handleTimeSlotSelection = (event) => { 
        const selectedTimeSlot = event.target.name;
        if (event.target.checked) {
            setSelectedTimeSlots([...selectedTimeSlots, selectedTimeSlot]);
        } else {
            setSelectedTimeSlots(selectedTimeSlots.filter((timeSlot) => timeSlot !== selectedTimeSlot));
        }
    };

    const handleSubmit = (event) => {
        if (!selectedLocation || !selectedDates.length || !selectedTimeSlots.length) {
            setShowAlert({message: "Please fill in all fields"});
        } else {
            setAvailability(event);
        }
    };

    const setAvailability = async (event) => {
        const button = event.target;
        button.disabled = true;
        try {
            await axios.post('/protected/api/setAvailability', {
                selectedLocation,
                selectedDates,
                allTimeSlots: timeSlots.map(timeSlot => timeSlot.start),
                selectedTimeSlots,
            }, { withCredentials: true });
            setSelectedLocation("");
            setSelectedDates([]);
            setSelectedTimeSlots([]);
            setShowAlert({message: "Updated availability", success: true});
            button.disabled = false;
            fetchAvailability();
        } catch (error) { 
            setShowAlert({message: "Server error. Please try again", success: false});
            button.disabled = false;
        }
    };

    const disableDates = (date) => {
        const formattedDate = format(new Date(date), 'MM-dd-yyyy');
        return datesToDisable.includes(formattedDate);
    };

    return ( 
        <>
            <Grid container item xs={12} sm={12} md={6} lg={6} sx={{padding: 3.5}}>
                <Grid item xs={12}>
                    <FormControl>
                        <CustomTypography>Select the location you want to set availability for:</CustomTypography>
                        <RadioGroup row sx={{marginTop: 0.5}} value={selectedLocation} onChange={(event) => {setSelectedLocation(event.target.value)}}> 
                            <FormControlLabel value="Richmond Hill" control={<Radio {...checkedProps}/>} label="Richmond Hill" />
                            <FormControlLabel value="Waterloo" control={<Radio {...checkedProps}/>} label="Waterloo" />
                        </RadioGroup>
                    </FormControl>
                </Grid>

                <Grid item xs={12} sx={{marginTop: 3}}>
                    <Typography>
                        For this next part, select the dates and time slots you want to make available. Selected time slots will be applied to all selected dates. 
                        Once you set availability for a date, you will not be able to edit it. Instead, you can delete the availability for that date (in the 
                        Delete Availability tab) and set it again (in this tab). Dates/times that are not selected will not be made available for booking.
                    </Typography>
                </Grid>

                <Grid item xs={12} sx={{marginTop: 2}}>
                    <CustomTypography>Select date(s):</CustomTypography>
                    <Calendar disableDates={disableDates} selectedDates={selectedDates} setSelectedDates={setSelectedDates}/>
                </Grid>

                <Grid item xs={12}>
                    <FormControl>
                        <CustomTypography>Select time slot(s):</CustomTypography>
                            <FormGroup sx={{marginTop: 0.5}}>
                                {timeSlots.map((timeSlot) => (
                                    <FormControlLabel
                                        control={
                                            <Checkbox 
                                                name={timeSlot.start} 
                                                checked={selectedTimeSlots.includes(timeSlot.start)}
                                                onChange={handleTimeSlotSelection}
                                                {...checkedProps}
                                            />
                                        }
                                        key={timeSlot.start}
                                        label={`${timeSlot.start} - ${timeSlot.end}`}
                                    />
                                ))}
                            </FormGroup>
                    </FormControl>
                </Grid>

                <Grid item xs={12} sx={{marginTop: 3}}>
                    <Button variant="contained" sx={{backgroundColor: theme.palette.admin, ':hover': {backgroundColor: theme.palette.admin}}} onClick={handleSubmit}>Submit</Button>
                </Grid>
            </Grid>

            <SnackbarAlert success={showAlert.success} message={showAlert.message} setShowAlert={setShowAlert}/>
        </>
    );
}

export default SetAvailability;