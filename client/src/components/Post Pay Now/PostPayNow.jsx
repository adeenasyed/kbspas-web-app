import { useState, useEffect } from 'react';
import FullScreen from '../Shared/FullScreen';

function PostPayNow({redirect}) {
    let text;
    if (redirect) {
        const [countdown, setCountdown] = useState(10);
        useEffect(() => {
            if (redirect) { 
                if (countdown > 0) {
                    const timerId = setTimeout(() => setCountdown(countdown - 1), 1000);
                    return () => clearTimeout(timerId);
                } else {
                    window.location.reload();           
                }
            }
        }, [countdown]);

        text = [`Sorry, we ran into an issue booking your appointment.`, `Please try again in ${countdown} seconds.`]
    } else { 
        text = [`Your appointment is booked! Details will be sent to your email shortly.`, `Thank you for booking with KbSpas!`];
    }
    return (<FullScreen showNavBar={true} text={text}/>);
}

export default PostPayNow;