import FullScreen from '../Shared/FullScreen';

function RateLimitError() { 
    return (<FullScreen showNavBar={false} text={["You've exceeded your request limit. Please try again in 15 minutes."]}/>);
}

export default RateLimitError;