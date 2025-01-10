import NavBar from '../Navigation Bars/NavBar';
import BottomBar from "../Navigation Bars/BottomBar";
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import theme from '../../theme';

const typographyStyles = {
    color: theme.palette.accent,
    fontWeight: 700,
    fontSize: {
        xs: '24px',
        sm: '28px',
        md: '28px',
        lg: '28px',
    },
};

function FullScreen({showNavBar, text}) { 
    return (
        <div className='container'>
            {showNavBar && <NavBar />}
            <Grid 
                container 
                direction="column"
                justifyContent="center"
                align="center"
                className="content"
                sx={{marginTop: '22px', marginBottom: '44px', paddingX: 4}}
            >
                {text.map((line, index) => (
                    <Typography sx={{...typographyStyles, marginTop: index > 0 && 4}}>{line}</Typography>
                ))}
            </Grid>
            {showNavBar && <BottomBar/>}
        </div>
    );
}

export default FullScreen;