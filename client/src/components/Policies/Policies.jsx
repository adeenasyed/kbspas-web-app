import NavBar from '../Navigation Bars/NavBar';
import BottomBar from '../Navigation Bars/BottomBar';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

const policies = [
    "Please be on time for your appointment. If you are more than 20 minutes late, your appointment may be cancelled (depending on availability) or you may be charged a $15 late fee.",
    "Please do not bring any guests with you to your appointment.",
    "Please come to your appointment with clean lashes. Failure to do so will result in a $10 cleaning fee or being charged for removal and a full set if you booked a refill/mini fill.",
    "You must have 40% of your previous set remaining for a refill, otherwise it is a full set.",
    "Having issues with lash retention? All clients are entitled to 2 day lash insurance. Beyond the insured period, a small fee (depending on the set) will apply.",
    "If you are unable to make your appointment, please let us know. Skipping your appointment without notice will result in a ban from booking with KbSpas in the future.",
    "No refunds. All transactions are final.",
    "At this time, we only accept cash."
];

function Policies() { 
    return (
        <div className="container">
            <NavBar />
            <Grid container justifyContent="center" className='starry-background content'>
                <Grid item xs={12} sm={12} md={12} lg={8} sx={{padding: 3.5}}>
                    <Paper sx={{padding: 3.5, background: 'rgba(255, 255, 255, 0.5)'}}>
                        <header className='policies-header' style={{marginLeft: 'auto', marginRight: 'auto', marginTop: '-28px', marginBottom: '-14px'}}></header>
                        <ol style={{listStyleType: 'decimal', paddingLeft: '20px'}}>
                            {policies.map((policy, index) => (
                                <li key={index} style={{paddingLeft: '4px', paddingBottom: '8px'}}>
                                    <Typography>{policy}</Typography>
                                </li>
                            ))}
                        </ol>
                        <Typography align="center" sx={{fontWeight: 700, marginTop: '20px'}}>Thank you for understanding!</Typography>
                    </Paper>
                </Grid>
            </Grid>
            <BottomBar/>
        </div>
    );
}

export default Policies;