import { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from "@mui/x-date-pickers";
import { getDaysInMonth, getDay, startOfMonth } from 'date-fns';
import theme from '../../theme';

function DateSelection({disableUnavailableDates, handleDateSelection, selectedLocation}) { 
    const [smallScreenMarginLeft, setSmallScreenMarginLeft] = useState('auto');

    const checkWindowWidth = () => {
        if (window.innerWidth < 448) {
            const margin = Math.min(448 - window.innerWidth, 24);
            setSmallScreenMarginLeft('-' + margin + 'px');
        } else {
            setSmallScreenMarginLeft('auto'); 
        }
    };
    
    useEffect(() => {
        checkWindowWidth();
        window.addEventListener('resize', checkWindowWidth);
        return () => {
          window.removeEventListener('resize', checkWindowWidth);
        };
    }, []);

    const [spansSixWeeks, setSpansSixWeeks] = useState(false);

    const calculateSpansSixWeeks = (dateString) => {
        const date = new Date(dateString);
        const totalDaysDisplayed = getDay(startOfMonth(date)) + getDaysInMonth(date);
        return totalDaysDisplayed > 35;
    };

    useEffect(() => {
        setSpansSixWeeks(calculateSpansSixWeeks(new Date()));
    }, [selectedLocation]);

    return ( 
        <>
            <Grid item xs={12} sx={{paddingTop: '18px'}}>
                <Typography sx={{color: theme.palette.formText}}>
                    Select date and time: *
                </Typography>
            </Grid>
            <Grid item xs={12} 
                sx={{
                    marginBottom: spansSixWeeks ? '0px' : '-38px',
                    marginLeft: smallScreenMarginLeft
                }}
            >
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateCalendar
                        disablePast
                        shouldDisableDate={disableUnavailableDates}
                        views={['day']}
                        key={selectedLocation}
                        onChange={handleDateSelection}
                        onMonthChange={(month) => {setSpansSixWeeks(calculateSpansSixWeeks(month))}}
                    />
                </LocalizationProvider>
            </Grid>
        </>
    );
}

export default DateSelection;