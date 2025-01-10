import { useState } from 'react';
import Admin from './Admin';
import Authentication from '../Shared/Authentication';

function AdminAuthentication() {
  const [authenticated, setAuthenticated] = useState(false);
  if (authenticated) {
    return (<Admin/>);
  } else {
    return (<Authentication authenticated={authenticated} setAuthenticated={setAuthenticated} access={'Admin'}/>);
  }
}

export default AdminAuthentication;