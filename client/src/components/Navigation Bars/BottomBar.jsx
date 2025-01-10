import { useState } from "react";
import { Link } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material";

const CustomTypography = styled(Typography)({
  fontSize: '12px',
  color: 'white'
});

function BottomBar() {
    const [viewAttributions, setViewAttributions] = useState(false);

    return (
      <AppBar position="relative" sx={{background: '#D4A49F'}}>
        <Toolbar variant="dense" disableGutters>
          <Stack 
            direction={{xs: 'column', sm: 'row'}}
            padding={{xs: 1, sm: 0}}
            spacing={{xs: 1, sm: 4}}
            marginLeft={{xs: 0, sm: 2}}
            alignItems={{xs: 'center', sm: 'flex-start'}}
            width='100%'
          >
              <CustomTypography>
                  © 2023 KbSpas. All Rights Reserved.
              </CustomTypography>

              <Link to="/privacypolicy">
                <CustomTypography>
                  Privacy Policy
                </CustomTypography>
              </Link>

              <CustomTypography 
                component="span"
                sx={{cursor: 'pointer'}}
                onClick={() => {setViewAttributions(true)}}
              >
                Attributions
              </CustomTypography>
              <Dialog open={viewAttributions} onClose={() => setViewAttributions(false)} maxWidth="md">
                <Paper sx={{padding: 3.5}}> 
                  <Typography> 
                    "Dual Ball" loading icon from loading.io
                  </Typography>
                  <Typography> 
                    "Twilight" background from loading.io
                  </Typography>
                </Paper>
              </Dialog>
            </Stack>
        </Toolbar>
      </AppBar>
    );
}

export default BottomBar;
