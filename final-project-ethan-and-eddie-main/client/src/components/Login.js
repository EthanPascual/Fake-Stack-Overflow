
import axios from "axios";
import { useEffect, useState } from "react";

export default function Login({ setPage, setUserId, setUsername, setAdmin, setAdminName, setAdminId }) {

    let [usersList, setUsersList] = useState([]);
    useEffect(() => {
        axios.get('http://localhost:8000/users').then(res => { setUsersList(res.data) });
    }, [])

    


    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(usersList);
        const storedHash = usersList.find(user => (user.email === e.target.email.value)).password;
        const password = e.target.password.value;
        
        
        if (e.target.email.value === '' || e.target.password.value === '') {
            document.getElementById('CheckingInvalidLogin').innerHTML = 'Invalid Input';
        } else if (!usersList.find(user => (user.email === e.target.email.value))) {
            document.getElementById('CheckingInvalidLogin').innerHTML = 'Incorrect Email or Password';
        }
        else {
            const email = e.target.email.value;
            


            try {
                const response = await axios.post('http://localhost:8000/login', { email, password, storedHash }, { withCredentials: true });
                const { _id, username, admin } = response.data;
              
                setUserId(_id);
                setUsername(username);
                setAdmin(admin);
              
                if (admin) {
                  setAdminId(_id);
                  setAdminName(username);
                }
              
                setPage('Content');
              } catch (error) {
                if (error.response && error.response.status === 401) {
                  // Handle 401 Unauthorized error
                  // Set the inner element to display an error message
                  document.getElementById('CheckingInvalidLogin').innerHTML = 'Incorrect Password';
                } else {
                  // Handle other errors
                  console.error(error);
                  // Set the inner element to display a generic error message
                  document.getElementById('CheckingInvalidLogin').innerHTML = 'Error!';
                }
              }
              
        }
    }


    return (
        <>
            <div className="WelcomeBody">
                <div className="Welcome">
                    <h1>Login to your Account</h1>
                    <form onSubmit={handleSubmit}>
                        <p>Email*</p>
                        <input type="text" id="email" name="email" /><br />
                        <p>Password*</p>
                        <input type="password" id="password" name="password" /><br />

                        <p id="CheckingInvalidLogin" className="InvalidCheck"></p>
                        <button type="submit" className="postButton">Login</button>
                    </form>
                </div>
            </div>

        </>

    );

}