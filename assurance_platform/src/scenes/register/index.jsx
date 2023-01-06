import { useRef, useState, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from '../../api/axios';
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useEth } from '../../components/EthContext'
import { useMoralis } from 'react-moralis'
import { Button, Alert, TextField } from '@mui/material';


const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const phoneRegExp = /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;
const email_regex = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
const REGISTER_URL = '/register';

const Register = () => {
    const { state: { accounts, contract }, } = useEth();
    const userRef = useRef();
    const [visibleError, setIsVisibleError] = useState(true);
    const errRef = useRef();
    const [error, setError] = useState('')
    let [farmerAddress, setFarmerAddress] = useState([])



    const [x_coordinate, setxCoordinate] = useState('');
    const [y_coordinate, setyCoordinate] = useState('');

    const [user, setUser] = useState('');
    const [validName, setValidName] = useState(false);
    const [userFocus, setUserFocus] = useState(false);

    const [email, setEmail] = useState('');
    const [validEmail, setValidEmail] = useState(false);
    const [emailFocus, setEmailFocus] = useState(false);

    const [contact, setContact] = useState('');
    const [validContact, setValidContact] = useState(false);
    const [ContactFocus, setContactFocus] = useState(false);


    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    const {
        account,
    } = useMoralis();

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setValidName(USER_REGEX.test(user));
    }, [user])
    useEffect(() => {
        setValidEmail(email_regex.test(email));
    }, [email])
    useEffect(() => {
        setValidContact(phoneRegExp.test(contact));
    }, [contact])



    useEffect(() => {
        setValidPwd(PWD_REGEX.test(pwd));
        setValidMatch(pwd === matchPwd);
    }, [pwd, matchPwd])

    useEffect(() => {
        setErrMsg('');
    }, [user, email, contact, pwd, matchPwd])



    const handleSubmit = async (e) => {
        e.preventDefault();
        // if button enabled with JS hack
        const v1 = USER_REGEX.test(user);
        const v2 = PWD_REGEX.test(pwd);
        // const v3 = email_regex.test(email);
        const v4 = phoneRegExp.test(contact);
        if (!v1 || !v2 || !v4) {
            setErrMsg("Invalid Entry");
            setTimeout(function () {
                setIsVisibleError(false);
                console.log(visibleError);
            }, 5000);
            setIsVisibleError(true);
            return;
        }
        try {
            
            await contract.methods.register(user, email, contact, x_coordinate, y_coordinate).send({
                from: account
            })
            const yass = window.localStorage.getItem('farmers')
            if(yass){
            const yas = JSON.parse(yass)
            yas.push(account)
            console.log(yas)
            window.localStorage.setItem('farmers', JSON.stringify(yas))}
            else{
                setFarmerAddress(farmerAddress.push(account))
                window.localStorage.setItem('farmers', JSON.stringify(farmerAddress))
            }
            

            try {
                const response = await axios.post(REGISTER_URL,
                    JSON.stringify({ user, pwd, email, contact, x_coordinate, y_coordinate }),
                    {
                        headers: { 'Content-Type': 'application/json' },
                        withCredentials: true
                    }
                );
                // TODO: remove console.logs before deployment
                console.log(JSON.stringify(response?.data));
                //console.log(JSON.stringify(response))
                setSuccess(true);
                //clear state and controlled inputs
                setUser('');
                setEmail('');
                setContact('');
                setxCoordinate('');
                setyCoordinate('');
                setPwd('');
                setMatchPwd('');
            } catch (err) {
                if (!err?.response) {
                    setErrMsg('No Server Response');
                    setTimeout(function () {
                        setIsVisibleError(false);
                        console.log(visibleError);
                    }, 5000);
                    setIsVisibleError(true);
                } else if (err.response?.status === 409) {
                    setErrMsg('Username Taken');
                    setTimeout(function () {
                        setIsVisibleError(false);
                        console.log(visibleError);
                    }, 5000);
                    setIsVisibleError(true);
                } else {
                    setErrMsg('Registration Failed')
                    setTimeout(function () {
                        setIsVisibleError(false);
                        console.log(visibleError);
                    }, 5000);
                    setIsVisibleError(true);
                }
                errRef.current.focus();
            }
        } catch (err) {
            setError(err.message)
            setTimeout(function () {
                setIsVisibleError(false);
                console.log(visibleError);
            }, 5000);
            setIsVisibleError(true);
        }
    }
    const store = function(){
        const o = window.localStorage.getItem("farmers")
        console.log(o)
        if(o){
            farmerAddress = JSON.parse(o)
            console.log(farmerAddress)
        }
    }
    store()

    return (
        <>
            {success ? (
                <section>
                    <h1>Success!</h1>
                    <p>
                        <Link to="/login">Sign in</Link>
                    </p>
                </section>
            ) : (
                <section>
                    <section>{errMsg && visibleError && (
                <Alert severity="error">
                    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                    </Alert>
            )}
            </section>
                    <h1>Register</h1>
                        <label htmlFor="username">
                            Username:
                            <FontAwesomeIcon icon={faCheck} className={validName ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validName || !user ? "hide" : "invalid"} />
                        </label>
                        <br />
                        <TextField id="filled-basic"
                    label="Username"
                    variant="filled"
                            type="text"
                            ref={userRef}
                            autoComplete="off"
                            onChange={(e) => setUser(e.target.value)}
                            value={user}
                            required
                            aria-invalid={validName ? "false" : "true"}
                            aria-describedby="uidnote"
                            onFocus={() => setUserFocus(true)}
                            onBlur={() => setUserFocus(false)}
                        />
                        <br />
                        <p id="uidnote" className={userFocus && user && !validName ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            4 to 24 characters.<br />
                            Must begin with a letter.<br />
                            Letters, numbers, underscores, hyphens allowed.
                        </p>
                        <br />
                        <label htmlFor="email">
                            Email:
                            <FontAwesomeIcon icon={faCheck} className={validEmail ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validEmail || !email ? "hide" : "invalid"} />
                        </label>
                        <br />
                        <TextField id="filled-basic"
                    label="Email"
                    variant="filled"
                            type="text"
                            ref={userRef}
                            autoComplete="off"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            required
                            aria-invalid={validEmail ? "false" : "true"}
                            aria-describedby="uidnote"
                            onFocus={() => setEmailFocus(true)}
                            onBlur={() => setEmailFocus(false)}
                        />
                        <br /><br />
                        <label htmlFor="contact">
                            Contact:
                            <FontAwesomeIcon icon={faCheck} className={validContact ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validContact || !contact ? "hide" : "invalid"} />
                        </label>
                        <br />
                        <TextField id="filled-basic"
                    label="Contact"
                    variant="filled"
                            type="text"
                            ref={userRef}
                            autoComplete="off"
                            onChange={(e) => setContact(e.target.value)}
                            value={contact}
                            required
                            aria-invalid={validContact ? "false" : "true"}
                            aria-describedby="uidnote"
                            onFocus={() => setContactFocus(true)}
                            onBlur={() => setContactFocus(false)}
                        />
                        <br /><br />
                        <label htmlFor="x_coordinate">
                            x coordinate:
                        </label>
                        <br />
                        <TextField id="filled-basic"
                    label="x coordinate"
                    variant="filled"
                            type="text"
                            ref={userRef}
                            autoComplete="off"
                            onChange={(e) => setxCoordinate(e.target.value)}
                            value={x_coordinate}
                            required
                        />
                        <br /><br />
                        <label htmlFor="y_coordinate">
                            y coordinate:
                        </label>
                        <br />
                        <TextField id="filled-basic"
                    label="y coordinate"
                    variant="filled"
                            type="text"
                            ref={userRef}
                            autoComplete="off"
                            onChange={(e) => setyCoordinate(e.target.value)}
                            value={y_coordinate}
                            required
                        />
                        <br /><br />
                        <label htmlFor="password">
                            Password:
                            <FontAwesomeIcon icon={faCheck} className={validPwd ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validPwd || !pwd ? "hide" : "invalid"} />
                        </label>
                        <br />
                        <TextField id="filled-basic"
                    label="Password"
                    variant="filled"
                            type="password"
                            onChange={(e) => setPwd(e.target.value)}
                            value={pwd}
                            required
                            aria-invalid={validPwd ? "false" : "true"}
                            aria-describedby="pwdnote"
                            onFocus={() => setPwdFocus(true)}
                            onBlur={() => setPwdFocus(false)}
                        />
                        <br />
                        <p id="pwdnote" className={pwdFocus && !validPwd ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            8 to 24 characters.<br />
                            Must include uppercase and lowercase letters, a number and a special character.<br />
                            Allowed special characters: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
                        </p>
                        <br />
                        <label htmlFor="confirm_pwd">
                            Confirm Password:
                            <FontAwesomeIcon icon={faCheck} className={validMatch && matchPwd ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validMatch || !matchPwd ? "hide" : "invalid"} />
                        </label>
                        <br />
                        <TextField id="filled-basic"
                    label="Confirm Password"
                    variant="filled"
                            type="password"
                            onChange={(e) => setMatchPwd(e.target.value)}
                            value={matchPwd}
                            required
                            aria-invalid={validMatch ? "false" : "true"}
                            aria-describedby="confirmnote"
                            onFocus={() => setMatchFocus(true)}
                            onBlur={() => setMatchFocus(false)}
                        />
                        <p id="confirmnote" className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            Must match the first password input field.
                        </p>

                        <Button variant='outlined' color='success' onClick={handleSubmit} disabled={!validName || !validPwd || !validMatch ? true : false}>Sign Up</Button>
                    
                    <section>{error && visibleError && (
                <Alert severity="error">
                            <p>{error}</p></Alert>
            )}
                        
                    </section>
                    <p>
                        Already registered?<br />
                        <span className="line">
                            {/*put router link here*/}
                            <Link to="/login">Sign in</Link>
                        </span>
                    </p>
                </section>

            )}

        </>
    )
}

export default Register;