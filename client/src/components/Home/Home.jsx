import NavBar from '../Navigation Bars/NavBar';
import BottomBar from '../Navigation Bars/BottomBar';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

function Home() { 
    return ( 
        <div className='container'>
            <NavBar/>
            <Grid                
                container 
                direction="column"
                justifyContent="center"
                alignItems="center"
                align="center"
                className="content"
                sx={{marginTop: '22px', marginBottom: '44px'}}
            >
                <div style={{ width: '300px', height: '240px' }}>
                    <img src="/resources/under-construction.webp" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center bottom' }}/>
                </div>
                <Typography sx={{paddingY: 2, paddingX: 4}}>
                    Our home page is currently under construction. 
                    For now, feel free to explore the rest of the website and book an appointment!
                </Typography>
            </Grid>
            <BottomBar/>
        </div>
    );
}

export default Home;