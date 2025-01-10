import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { forwardRef } from 'react';

const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function SnackbarAlert({ success, message, setShowAlert }) {
    const handleClose = () => {
        setShowAlert({ message: "", success: false });
    };
    return (    
        <Snackbar open={!!message} autoHideDuration={4000} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
            <Alert onClose={handleClose} severity={success ? "success" : "error"}>
                {message}
            </Alert>
        </Snackbar>
    );
}

export default SnackbarAlert;
