export default function Welcome({setPage}) {
    const continueGuest = () => {
        setPage('Content');
    }
    const signUp = () => {
        setPage('SignUp');
    }
    const logIn = () => {
        setPage('Login');
    }

    return (
        <>
            <div className="WelcomeBody">
                <div className="Welcome">
                    <h1>Welcome to Fake Stack Overflow!</h1>
                    <button onClick={logIn}>Login</button>
                    <button onClick={signUp}>Sign Up</button>
                    <button onClick={continueGuest}>Continue As Guest</button>
                </div>
            </div>
            
        </>
        
    );
    
}