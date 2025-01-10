import NavBar from '../Navigation Bars/NavBar';
import BottomBar from '../Navigation Bars/BottomBar';
import ServicesGrid from './ServicesGrid'
import { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import axios from 'axios';
import theme from '../../theme';
import services from '/public/resources/services.json'

function Services() { 
    const [lashServices, setLashServices] = useState([]);
    const [browServices, setBrowServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const placeholderLashServices = new Array(9).fill(null);
    const placeholderBrowServices = new Array(2).fill(null);
    
    const fetchServices = async () => {
      setLoading(true);
      try {
        // const response = await axios.get(`/api/fetchServices`);
        // const data = response.data;
        const data = services;
        setLashServices(data.filter(service => service.type === 'Eyelash Services').sort((a, b) => a.index - b.index));
        setBrowServices(data.filter(service => service.type === 'Eyebrow Services').sort((a, b) => a.index - b.index));
        setLoading(false);
      } catch (error) { /* */ }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    return (  
      <>
        <NavBar />
        <header className='services-header lashes-header' style={{marginTop: '5px', marginBottom: '50px'}}></header>
        <Grid container>
          <ServicesGrid loading={loading} placeholders={placeholderLashServices} services={lashServices} />
          <Grid item xs={12} align="center" sx={{marginBottom: '40px'}}>
            <div style={{color: theme.palette.displayText}}>*Please be advised refills require 40% of your previous set remaining</div>
          </Grid>
        </Grid>

        <header className='services-header brows-header' style={{marginTop: '10px', marginBottom: '50px'}}></header>
        <Grid container>
          <ServicesGrid loading={loading} placeholders={placeholderBrowServices} services={browServices} />
        </Grid>

        <div style={{marginBottom: '38px'}}></div>
        <BottomBar/>
      </>
    );
}

export default Services;