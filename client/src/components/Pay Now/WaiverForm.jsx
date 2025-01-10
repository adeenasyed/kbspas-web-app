import { useState } from 'react';
import { pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = '/resources/waiver/pdf.worker.js';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import { Document, Page } from 'react-pdf';
import Grid from "@mui/material/Grid";
import Dialog from "@mui/material/Dialog";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import theme from '../../theme';
import DescriptionIcon from '@mui/icons-material/Description';

function WaiverForm({waiver, handleWaiverChange, FormHeader}) {
    const [viewWaiver, setViewWaiver] = useState(false);

    return ( 
        <div>
            <Grid item xs={12} sx={{marginTop: 3.5, marginBottom: 1}}>
                <FormHeader>Waiver Agreement</FormHeader>
            </Grid>

            <Grid container spacing={3} alignItems="center">
                <Grid item>
                    <button style={{color: theme.palette.formText2}} onClick={() => setViewWaiver(true)}>
                        <DescriptionIcon sx={{marginRight: '5px', marginBottom: '4px'}}/> View waiver
                    </button>

                    <Dialog open={viewWaiver} onClose={() => setViewWaiver(false)} maxWidth="md">
                        <Document file='/resources/waiver/Eyelash Technician Services Waiver and Agreement.pdf'>
                            <Page pageNumber={1} />
                        </Document>
                    </Dialog>
                </Grid>


                <Grid item>
                    <FormControlLabel  
                        control={
                            <Checkbox 
                                sx={{'&.Mui-checked': {color: 'black'}, '&:hover': {backgroundColor: theme.palette.hover}}} 
                                checked={waiver}
                                onChange={(event) => handleWaiverChange(event)}
                            />
                        } 
                        label="Agree *"
                    />
                </Grid>
            </Grid>
        </div>
    );
}

export default WaiverForm;