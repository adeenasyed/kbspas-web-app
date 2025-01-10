import { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

function ServiceSelection({services, handleServiceSelection}) { 
    const [dropdownOpen, setDropdownOpen] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setDropdownOpen(false);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <Grid item xs={12} align="center" sx={{paddingTop: 4}}> 
            <Autocomplete
                open={dropdownOpen}
                onOpen={() => setDropdownOpen(true)}
                onClose={() => setDropdownOpen(false)}
                options={services}
                noOptionsText={"Loading..."}
                groupBy={(option) => option.type}
                getOptionLabel={(option) => option.name}
                style={{width: '100%'}}
                clearIcon={null}
                renderInput={(params) => (<TextField {...params} inputProps={{ ...params.inputProps, readOnly: true }} label="Select your service *" placeholder="" />)}
                onChange={handleServiceSelection}
            />
        </Grid>
    );
}

export default ServiceSelection;