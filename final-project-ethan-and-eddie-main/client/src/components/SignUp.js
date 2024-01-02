import axios from "axios";
import { useEffect, useState } from "react";
export default function SignUp({ setPage }) {

    let [usersList, setUsersList] = useState([]);
    useEffect(() => {
        axios.get('http://localhost:8000/users').then(res => { setUsersList(res.data) });
    }, [])

    function isValidEmail(email) {
        // Regular expression for email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function containsEmailOrUser(username, email, password) {
        const emailBeforeAtSymbol = email.split('@')[0]; // Get the email before the "@"
        return password.toLowerCase().includes(username.toLowerCase()) || password.toLowerCase().includes(emailBeforeAtSymbol.toLowerCase());
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (
            e.target.userNameResponse.value == '' ||
            e.target.password.value == '' ||
            e.target.email.value == '' ||
            e.target.password.value != e.target.passwordCheck.value
        ) {
            console.log('invalid input');
            document.getElementById('CheckingInvalidUser').innerHTML = 'Invalid Input';
        } else if (!isValidEmail(e.target.email.value)) {
            document.getElementById('CheckingInvalidUser').innerHTML =
                'Please provide a correct email';
        } else if (
            containsEmailOrUser(
                e.target.userNameResponse.value,
                e.target.email.value,
                e.target.password.value
            )
        ) {
            document.getElementById('CheckingInvalidUser').innerHTML =
                'Please provide a stronger password';
        } else if (usersList.find((user) => user.email == e.target.email.value)) {
            document.getElementById('CheckingInvalidUser').innerHTML =
                'There is already an account with entered email';
        } else {
            document.getElementById('CheckingInvalidUser').innerHTML = '';
            console.log('Submitting new user');
            console.log(e.target.userNameResponse.value);
            try {
                await axios.post('http://localhost:8000/newUsers', {
                    username: e.target.userNameResponse.value,
                    password: e.target.password.value,
                    email: e.target.email.value,
                });
                setPage('Login');
            } catch (error) {
                console.log(error);
                // Handle error
            }
        }
    };
    return (
        <>
            <div className="WelcomeBody">
                <div className="Welcome">
                    <h1>Create a New Account</h1>
                    <form onSubmit={handleSubmit}>
                        <p>Username*</p>
                        <input type="text" id="userNameResponse" name="userNameResponse" /><br />
                        <p>Email*</p>
                        <input type="text" id="email" name="email" /><br />
                        <p>Password*</p>
                        <input type="password" id="password" name="password" /><br />
                        <p>Retype Password*</p>
                        <input type="password" id="passwordCheck" name="passwordCheck" /><br />

                        <p id="CheckingInvalidUser" className="InvalidCheck"></p>
                        <button type="submit" className="postButton">Sign Up</button>
                    </form>
                </div>
            </div>

        </>

    );

}