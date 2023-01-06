import { useRef, useState, useEffect, useContext } from 'react';
import useAuth from '../../hooks/useAuth';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import React from 'react';
import axios from '../../api/axios';
import { Button, Alert, TextField } from '@mui/material';
const LOGIN_URL = '/auth';


const Login = () => {
    const { setAuth } = useAuth();
    const userRef = useRef();
    const errRef = useRef();
    const [visibleError, setIsVisibleError] = useState(true);

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const [username, setUser] = useState('');
    const [password, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');


    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setErrMsg('');
    }, [username, password])

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(LOGIN_URL,
                JSON.stringify({ username, password }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            console.log(JSON.stringify(response?.data));
            /*console.log(roles.Admin);
            console.log(roles);
            console.log(typeof roles);*/
            // console.log(JSON.stringify(response));
            const accessToken = response?.data?.accessToken;
            const roles = response?.data?.roles;
            console.log(JSON.stringify(response?.data));
            //console.log(roles.Admin);
            /*console.log(roles);
            console.log(roles[0]);
            console.log(typeof roles);*/
            setAuth({ username, password, roles, accessToken });
            setUser('');
            setPwd('');
            // navigate(from, {replace :true});
            if (roles.length == 2) {
                navigate("/users", { replace: true })
            } else {
                navigate("/user", { replace: true })
            }
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
                setTimeout(function () {
                    setIsVisibleError(false);
                    console.log(visibleError);
                }, 5000);
                setIsVisibleError(true);
            } else if (err.response?.status === 400) {
                setErrMsg('Missing Username or Password');
                setTimeout(function () {
                    setIsVisibleError(false);
                    console.log(visibleError);
                }, 5000);
                setIsVisibleError(true);
            } else if (err.response?.status === 401) {
                setErrMsg('Unauthorized');
                setTimeout(function () {
                    setIsVisibleError(false);
                    console.log(visibleError);
                }, 5000);
                setIsVisibleError(true);
            } else {
                setErrMsg('Login Failed');
                setTimeout(function () {
                    setIsVisibleError(false);
                    console.log(visibleError);
                }, 5000);
                setIsVisibleError(true);
            }
            errRef.current.focus();
        }
    }

    return (

        <section>
            <section>{errMsg && visibleError && (
                <Alert severity="error">
                    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p></Alert>
            )}
            </section>
            
            <h1>Sign In</h1>
                <label htmlFor="username">Username:</label><br />
                <TextField id="filled-basic"
                    label="Username"
                    variant="filled"
                    type="text"
                    ref={userRef}
                    autoComplete="off"
                    onChange={(e) => setUser(e.target.value)}
                    value={username}
                    required
                />
                <br />
                <label htmlFor="password">Password:</label><br />
                <TextField id="filled-basic"
                    label="Password"
                    variant="filled"
                    type="password"
                    onChange={(e) => setPwd(e.target.value)}
                    value={password}
                    required
                />
                <br /><br />
                <Button variant='outlined' color='success' onClick={handleSubmit}>Sign In</Button>
            
            <br />
            <p>
                Need an Account?<br />
                <span className="line">
                    {/*put router link here*/}
                    <Link to="/register">Sign Up</Link>
                </span>
            </p>
        </section>


    )
}

export default Login;