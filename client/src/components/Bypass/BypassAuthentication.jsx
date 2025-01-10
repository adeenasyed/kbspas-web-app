import { useState } from 'react';
import BookNow from '../Book Now/BookNow';
import Authentication from '../Shared/Authentication';

function BypassAuthentication() {
  const [authenticated, setAuthenticated] = useState(false); 
  if (authenticated) {
    return (<BookNow bypass={authenticated}/>);
  } else {
    return (<Authentication authenticated={authenticated} setAuthenticated={setAuthenticated} access={'Bypass'}/>);
  }
}

export default BypassAuthentication;