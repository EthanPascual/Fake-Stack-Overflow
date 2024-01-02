import Welcome from './Welcome';
import Login from './Login';
import SignUp from './SignUp';
import Content from './Content';
import axios from "axios";
import { useEffect, useState } from 'react';

export default function FakeStackOverflow() {
  
  const [Pages, setPages] = useState('Welcome');
  const [userId, setUserId] = useState('');
  const [username, setUsername] = useState('');
  const [admin, setAdmin] = useState(false);
  const [adminName, setAdminName] = useState('');
  const [adminId, setAdminId] = useState('');

  
  axios.get('http://localhost:8000/session', { withCredentials: true })
  .then(response => {
    // Handle the session data
    console.log(response.data.username);
    // Do something with the session data 
    

    if(response.data){
      const userId = response.data.userId
      const userName = response.data.username;
      const setAdminBool = response.data.admin;

      setUserId(userId);
      setUsername(userName);

      if(setAdminBool){
        setAdminId(userId);
        setAdminName(userName);
        setAdmin(setAdminBool)
      } 

      setPages('Content')

      
    }
  })
  .catch(error => {
    console.error(error);
    // Handle the error
  }); 

  switch(Pages){
    case 'Welcome':
      return (<Welcome setPage={setPages}/>);
      break;
    case 'Login':
      return (<Login setPage={setPages} setUserId={setUserId} setUsername={setUsername} setAdmin={setAdmin} setAdminId={setAdminId} setAdminName={setAdminName}/>);
      break;
    case 'SignUp':
      return (<SignUp setPage={setPages}/>);
      break;
    case 'Content':
      return (<Content setPage={setPages} setUserId={setUserId} setUsername={setUsername} userId={userId} username={username} admin={admin} adminId={adminId} adminName={adminName} setAdmin={setAdmin} setAdminId={setAdminId} setAdminName={setAdminName}/>);
      break;
  }
}
