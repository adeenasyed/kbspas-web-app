import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

function Section({ header, body1, listItems, body2 }) {
    return (
        <Grid item xs={12} sx={{ paddingTop: 4 }}>
            <Typography sx={{ fontWeight: 700, fontSize: '20px' }}>{header}</Typography>
            <Typography sx={{ paddingTop: 1 }}>{body1}</Typography>
            {listItems && (
                <ol style={{ listStyleType: 'disc', marginLeft: '48px' }}>
                    {listItems.map((item, index) => (
                        <li key={index}><Typography>{item}</Typography></li>
                    ))}
                </ol>
            )}
            {body2 && <Typography>{body2}</Typography>}
        </Grid>
    );
}

export default Section;