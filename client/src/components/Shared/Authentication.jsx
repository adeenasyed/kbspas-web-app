import { useState, useEffect } from 'react';
import axios from 'axios';
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from "@mui/material/DialogActions";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from "@mui/material/Typography";
import Error from '@mui/icons-material/Error';
import theme from '../../theme';

function Authentication({authenticated, setAuthenticated, access}) { 
  const [password, setPassword] = useState('');
  const [incorrect, setIncorrect] = useState(false);

  useEffect(() => {
    axios.get(`/protected/api/check${access}Auth`, { withCredentials: true })
    .then(response => {
      if (response.data.valid) {
        setAuthenticated(true);
      } else {
        setAuthenticated(false);
      }
    })
    .catch(error => {
      setAuthenticated(false);
    });
  }, []);    

  const handlePasswordChange = (event) => { 
    setPassword(event.target.value);
    setIncorrect(false);
  }

  const handleSubmit = () => {
    axios.post(`/api/${access.toLowerCase()}Authentication`, { password })
    .then(response => {
      setAuthenticated(true);
    })
    .catch(error => {
      setIncorrect(true);
    });
  };

  return (
    <>
        <Dialog open={!authenticated}>
            <DialogContent>
                <DialogContentText sx={{color: 'black'}}>Password:</DialogContentText>
                <TextField
                    fullWidth
                    type="password"
                    variant="standard"
                    value={password}
                    onChange={handlePasswordChange}
                    onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      handleSubmit();
                    }
                    }}
                    sx={{'& .MuiInput-underline:after': {borderBottomColor: theme.palette.admin}}}
                />
                {incorrect &&
                    <Typography sx={{paddingTop: 1, fontWeight: 700, color: theme.palette.err}}>
                    <Error sx={{marginRight: '2px', marginBottom: '4px', fontSize: '20px'}}/> Incorrect password
                    </Typography>   
                }
            </DialogContent>
            <DialogActions>
                <Button sx={{color: theme.palette.admin}} onClick={handleSubmit}>Login</Button>
            </DialogActions>
        </Dialog>
    </>
  );
}

export default Authentication;