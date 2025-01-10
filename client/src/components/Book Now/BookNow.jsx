import NavBar from "../Navigation Bars/NavBar";
import BottomBar from "../Navigation Bars/BottomBar";
import ServiceSelection from "./ServiceSelection";
import LocationSelection from "./LocationSelection";
import DateSelection from "./DateSelection";
import TimeSelection from "./TimeSelection";
import StripeContainer from "../Pay Now/StripeContainer";
import { useState, useEffect } from "react";
import axios from "axios";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import EastRoundedIcon from '@mui/icons-material/EastRounded';
import Collapse from "@mui/material/Collapse";
import { format } from 'date-fns';

function BookNow({bypass}) {
    const [services, setServices] = useState([]);
    const [availability, setAvailability] = useState([]);
    const [availableDates, setAvailableDates] = useState([]);
    const [availableTimes, setAvailableTimes] = useState([]);

    const [generalError, setGeneralError] = useState(false);

    const [selectedService, setSelectedService] = useState();
    const [selectedLocation, setSelectedLocation] = useState();
    const [selectedDate, setSelectedDate] = useState();
    const [selectedTimeSlot, setSelectedTimeSlot] = useState();
    const [total, setTotal] = useState(0.00);

    const fetchServices = async () => {
        try {
            const response = await axios.get(`/api/fetchServices`);
            const data = response.data;     
            const updatedServices = data.reduce((acc, service) => {
                    if (service.hasRefill) {
                        acc.push({...service, name: `${service.name} - Full Set`});
                        acc.push({...service, name: `${service.name} - Refill`, price: `${service.refillPrice}`});
                    } else { 
                        acc.push({...service, name: `${service.name}`});
                    }
                    return acc;
            }, []);
            updatedServices.sort((a, b) => {
                if (a.name.includes("Full Set") && b.name.includes("Refill")) {
                    return -1;
                }
                if (a.name.includes("Refill") && b.name.includes("Full Set")) {
                    return 1;
                }
                return a.index - b.index;
            });
            setServices(updatedServices);
        } catch (error) {
            setGeneralError(true);
        }
    };
  
    useEffect(() => {
        fetchServices();
    }, []);

    const fetchAvailability = async () => {
        try {
            const response = await axios.get(`/api/fetchAvailability`, {
                params: { location: selectedLocation }
            });
            const data = response.data;
            setAvailability(data);
            const dates = data.map(entry => entry.date);
            setAvailableDates(dates);
        } catch (error) {
            setGeneralError(true);
        }
    };

    useEffect(() => {
        if (selectedLocation) {
            fetchAvailability();
        }
    }, [selectedLocation]);

    const disableUnavailableDates = (date) => {
        const formattedDate = format(new Date(date), 'MM-dd-yyyy');
        return !availableDates.includes(formattedDate);
    };

    const handleServiceSelection = (event, service) => {
        setSelectedService(service.name);
        setTotal(service.price);
    };

    const handleLocationSelection = (event) => { 
        setSelectedLocation(event.target.value);
        setSelectedDate();
        setAvailableDates([]);
        if (selectedTimeSlot) { 
            setSelectedTimeSlot();
            setAvailableTimes([]);
        } else { 
            setTimeout(() => {
                setSelectedTimeSlot();
                setAvailableTimes([]);
            }, 600);
        }
    };

    const handleDateSelection = (date) => {
        setSelectedTimeSlot();
        const formattedDate = format(new Date(date), 'MM-dd-yyyy');
        setSelectedDate(formattedDate);
        const correspondingEntry = availability.find(entry => entry.date === formattedDate);
        setAvailableTimes(correspondingEntry.timeSlots);
    };

    const handleTimeSelection = (event, time) => {
        setSelectedTimeSlot(time);
    };

    const [renderPayNow, setRenderPayNow] = useState(false);
    const proceedToPayNow = () => {
        setRenderPayNow(true);
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [renderPayNow]);
    
    if (renderPayNow) {
        return (<StripeContainer selectedService={selectedService} selectedLocation={selectedLocation} selectedDate={selectedDate} selectedTimeSlot={selectedTimeSlot} total={total} bypass={bypass}/>)
    }

    return (
        <div className="container">
            <NavBar />
            <Grid container justifyContent="center" className='starry-background content'>
                <Grid item xs={12} sm={12} md={9} lg={8} sx={{padding: 3.5}}>
                    <Paper sx={{padding: 3.5}}>
                        <Grid item xs={12}>
                            <Typography sx={{fontWeight: 700, fontSize: '20px'}}>Book your appointment</Typography>
                        </Grid>
                        {generalError ?
                            <Grid item xs={12} align="center" sx={{paddingTop: 4}}>
                                <Typography>
                                    Sorry, something went wrong. Please refresh and try again. 
                                </Typography>
                                <Typography>
                                    If this problem persists, please message @kbspas on Instagram.
                                </Typography>
                            </Grid>
                        :
                            <>
                                <ServiceSelection services={services} handleServiceSelection={handleServiceSelection} />

                                <Collapse in={!!selectedService}>
                                    <LocationSelection handleLocationSelection={handleLocationSelection} />
                                </Collapse>

                                <Collapse in={!!selectedLocation}>
                                    <DateSelection disableUnavailableDates={disableUnavailableDates} handleDateSelection={handleDateSelection} selectedLocation={selectedLocation} />
                                </Collapse>

                                <Collapse in={!!selectedDate}>
                                        <TimeSelection availableTimes={availableTimes} handleTimeSelection={handleTimeSelection} selectedTimeSlot={selectedTimeSlot} />
                                </Collapse>

                                <Collapse in={!!selectedTimeSlot}>
                                    <Grid item xs={12} align="right" sx={{paddingTop: 3.5}}>
                                        <button
                                            onClick={() => {proceedToPayNow()}}
                                        >
                                            <EastRoundedIcon sx={{fontSize:'32px', color: 'black'}}/>
                                        </button>
                                    </Grid>
                                </Collapse>
                            </>
                        }
                    </Paper>
                </Grid>
            </Grid>
            <BottomBar/>
        </div>
    );
}

export default BookNow;