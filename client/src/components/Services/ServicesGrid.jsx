import Grid from '@mui/material/Grid';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import theme from '../../theme';

const IMG_SIZE = 250;
    
const typographyStyles = {
    fontWeight: 700,
    color: theme.palette.displayText,
};

function ServicesGrid({ loading, placeholders, services }) {
    if (loading) { 
        return (
            placeholders.map((_, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} xl={2.4} key={index} align="center" sx={{ marginBottom: '50px' }}>
                    <Skeleton variant="rectangular" width={IMG_SIZE} height={IMG_SIZE} />
                    <Box sx={{ width: IMG_SIZE, textAlign: 'left' }}>
                        <Skeleton variant="text" width={IMG_SIZE} sx={{ marginTop: '5px' }} />
                        <Skeleton variant="text" width={IMG_SIZE} />
                    </Box>
                </Grid>
            ))
        )
    } else { 
        return (
            services.map((service) => (
                <Grid item xs={12} sm={6} md={4} lg={3} xl={2.4} key={service.name} align="center">
                    <ImageListItem sx={{ width: `${IMG_SIZE}px`, marginBottom: '38px' }}>
                        <img
                            src={`/resources/service imgs/${service.img}`}
                            style={{ width: `${IMG_SIZE}px`, height: `${IMG_SIZE}px` }}
                            className="flip-card"
                        />
                        <ImageListItemBar
                            title={
                                <Typography sx={{ ...typographyStyles, fontSize: '18px', whiteSpace: 'normal' }}>
                                    {service.name}
                                </Typography>
                            }
                            subtitle={
                                <Typography sx={{ ...typographyStyles, fontSize: '14px' }}>
                                    {service.hasRefill 
                                        ? `Full Set: $${service.price} | Refill: $${service.refillPrice}*`
                                        : `$${service.price}`
                                    }
                                </Typography>
                            }
                            position="below"
                            align="left"
                        />
                    </ImageListItem>
                </Grid>
            ))
        )
    }
}

export default ServicesGrid;