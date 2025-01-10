import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from '@mui/material/TextField';
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import Error from '@mui/icons-material/Error';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import theme from "../../theme";

const buttonProps = {
    sx: {
        color: theme.palette.accent,
        ':hover': {backgroundColor: theme.palette.hover},
        borderRadius: theme.customBorderRadius,
    }
};

function Promo({promoCode, handlePromoCodeChange, validatePromoCode, showPromoCodeError, setShowPromoCodeError, promoApplied, clearPromoCode}) { 
    const [open, setOpen] = useState(false);

    const handleClose = () => {
        setOpen(false);
        setShowPromoCodeError(false);
        if (!promoApplied) clearPromoCode();
    };

    useEffect(() => {
        if (!!promoApplied) { 
            handleClose();
        }
    }, [promoApplied]);

    if (!!promoApplied) { 
        return ( 
            <Grid container item xs={12} sx={{paddingTop: 2}}>
                <Grid item>
                    <Typography sx={{color: '#008000'}}>
                        <CheckCircleRoundedIcon sx={{marginRight: '5px', marginBottom: '4px'}}/> {promoApplied}% off promo applied 
                    </Typography>
                </Grid>
                <Grid item>
                    <button style={{color: theme.palette.formText2}} onClick={clearPromoCode}>
                        <ClearRoundedIcon sx={{marginLeft: '10px'}}/>
                    </button>
                </Grid>
            </Grid>
        );
    }
    return ( 
        <>
            <Grid item xs={12}sx={{paddingTop: 2}}>
                <button style={{color: theme.palette.formText2}} onClick={() =>(setOpen(true))}>
                    <AddRoundedIcon sx={{marginRight: '5px', marginBottom: '4px'}}/> I have a promo code
                </button>
            </Grid>
            <Dialog 
                open={open} 
                onClose={handleClose}
            >
                <DialogContent>
                    <TextField
                        label="Promo code"
                        fullWidth
                        variant="standard"
                        value={promoCode}
                        onChange={handlePromoCodeChange}
                    />
                    {showPromoCodeError &&
                        <Typography sx={{paddingTop: 1, fontWeight: 700, color: theme.palette.err}}>
                            <Error sx={{marginRight: '2px', marginBottom: '4px', fontSize: '20px'}}/> Invalid promo code
                        </Typography>   
                    }
                </DialogContent>
                <DialogActions>
                    <Button {...buttonProps} onClick={handleClose}>Cancel</Button>
                    <Button {...buttonProps} onClick={validatePromoCode}>Apply</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default Promo;