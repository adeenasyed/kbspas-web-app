import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import Badge from '@mui/material/Badge';
import { format } from 'date-fns';
import theme from "../../theme";

function Calendar({disableDates, selectedDates, setSelectedDates}) {
    const handleDateSelection = (newDate) => { 
        const formattedDate = format(new Date(newDate), 'MM-dd-yyyy');
        if (selectedDates.includes(formattedDate)) {
            setSelectedDates(selectedDates.filter((date) => date !== formattedDate));
        } else {
            setSelectedDates([...selectedDates, formattedDate]);
        }
    };

    const CustomDay = (props) => {
        const { selectedDates, day, ...other } = props;
        const formattedDate = format(new Date(day), 'MM-dd-yyyy');
        const selected = selectedDates.includes(formattedDate);
        return (
            <Badge
                key={day.toString()}
                overlap="circular"
                badgeContent={selected ? '🌸' : undefined}
            >
                <PickersDay {...other} day={day} />
            </Badge>
        )
    };

    return (    
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar
                disablePast 
                shouldDisableDate={disableDates}
                views={['day']}
                onChange={handleDateSelection}
                slots={{day: CustomDay}}
                slotProps={{day: {selectedDates}}}
                sx={{
                    '.MuiPickersDay-root': {
                        '&.Mui-selected': {
                            backgroundColor:  theme.palette.bg + ' !important',
                            color: 'black',
                        },
                        '&:not(.Mui-selected):hover': {
                            backgroundColor: theme.palette.bg + ' !important',
                        },
                        '&:active, &:focus': {
                            backgroundColor: theme.palette.bg + ' !important',
                        },
                    },
                }}
            />
        </LocalizationProvider>
    );
}

export default Calendar;