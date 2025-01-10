import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import theme from "../../theme";

const radioProps = {
    icon: <LocationOnOutlinedIcon />,
    checkedIcon: <LocationOnIcon />,
    sx: {
        '&.Mui-checked': {color: theme.palette.accent},
        '&:hover': {backgroundColor: theme.palette.hover}
    }
}

function LocationSelection({handleLocationSelection}) { 
    return ( 
        <Grid item xs={12} sx={{paddingTop: 3.5}}>
            <Typography sx={{color: theme.palette.formText}}>
                Select location: *
            </Typography>
            <RadioGroup sx={{paddingTop: 1, alignItems: "start"}} onChange={handleLocationSelection}> 
                <FormControlLabel value="Richmond Hill" control={<Radio {...radioProps}/>} label="Richmond Hill"/>
                <FormControlLabel value="Waterloo" control={<Radio {...radioProps}/>} label="Waterloo"/>
            </RadioGroup>
        </Grid>
    );
}

export default LocationSelection;