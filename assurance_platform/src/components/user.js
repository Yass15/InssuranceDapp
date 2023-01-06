import PaidIcon from '@mui/icons-material/Paid';
import WalletIcon from '@mui/icons-material/Wallet';
import { NavLink } from 'react-router-dom';
import { useMoralis } from 'react-moralis'
import { useRef, useState, useEffect } from "react";
import { useEth } from '../components/EthContext';
import { Button, Alert } from '@mui/material';
import axios from '../api/axios';
import { format } from "date-fns";

import ReactDOM from "react-dom";
import Countdown from "react-countdown";

const REGISTER_URL = '/user';



const User = () => {


    //console.log("0x951FffF35e7ef647E41eA18946281c6E877fDFb0"===account)
    //console.log(new Date().valueOf()+5000)
    const [visibleError, setIsVisibleError] = useState(true);
    const [visibleSuccess, setIsVisibleSuccess] = useState(true);
    const [error, setError] = useState('')
    const [expirationDate, setExpirationDate] = useState('You have not payed yet')
    const [amountFunded, setAmountFunded] = useState('')
    const [amountReimbourssed, setAmountReimbourssed] = useState('')
    const [userName, setUserName] = useState('')
    const [email, setEmail] = useState('')
    const [number, setNumber] = useState('')
    const [x, setX] = useState('')
    const [y, setY] = useState('')
    const [register, setRegister] = useState('')
    const [payment, setPayment] = useState(null)
    const [showDetails, setShowDetails] = useState('')
    const MINUTE_MS = 10000;
    const addressToDate = {}



    const [paymentSuccessMsg, setPaymentSuccessMsg] = useState('')
    const { state: { accounts, contract }, } = useEth();




    const {
        account,
    } = useMoralis();
    useEffect(() => {
        getFarmerDetails()
    })
    const show = () => {
        getFarmerDetails()
        setShowDetails(!showDetails)
    }
    useEffect(() => {
        const interval = setInterval(() => {

            handleUnregister()
        }, MINUTE_MS);

        return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
    }, [])
    /*const s = account;
    const addressToDate=[];
    const a = {account:1670698371196}
    addressToDate.push(a)
    //const addressToDate = {s:1670698371196};
    console.log(addressToDate)*/



    async function handleUnregister() {

        const farmer = await contract.methods.getFarmer(account).call()
        /*console.log(String(0x951FffF35e7ef647E41eA18946281c6E877fDFb0)===String(account))
        console.log(typeof 0x951FffF35e7ef647E41eA18946281c6E877fDFb0)
        console.log(account)*/
        /*console.log((farmer.t))
        console.log(new Date().valueOf())
        console.log((farmer.t)- (new Date().valueOf()))*/
        if ((Number(farmer.t) < Number(new Date().valueOf())) && (farmer.payed)) {
            await contract.methods.unregister(account).send({
                from: "0xbE3364e02B2f555Eba5670c4168e7100FF799913"
            })
        }
    }





    const getFarmerDetails = async () => {
        const farmer = await contract.methods.getFarmer(account).call()
        console.log(farmer)

        const userName = farmer.name
        setUserName(userName)

        const email = farmer.email
        setEmail(email)

        const number = farmer.number
        setNumber(number)

        const x = farmer.x
        setX(x)

        const y = farmer.y
        setY(y)

        const register = farmer.registred
        setRegister(String(register))

        const payement = farmer.payed
        setPayment(payement)

        const amountFunded = farmer.amountFunded / 10 ** 18
        setAmountFunded(amountFunded + " ETH")

        const amountReimbourssed = farmer.amountReimb / 10 ** 18
        setAmountReimbourssed(amountReimbourssed + " ETH")

        if (farmer.payed) {
            let expirationnnnDate = new Date(Number(farmer.t))
            /*console.log(farmer.t)
            console.log(expirationnnnDate)
            console.log(Number(farmer.t))
            console.log(new Date(Number(farmer.t)))*/
            setExpirationDate(String(new Date(expirationnnnDate)))
            //console.log(expirationDate)
        }
        else {
            setExpirationDate('You have not payed yet')
        }
        /*console.log(typeof expirationDate)*/

    }




    /*const getAmountReimbourssed = async () => {
        const farmer = await contract.methods.getFarmer(account).call()
        const amountReimbourssed = farmer.amountReimb / 10**18
        setAmountReimbourssed(amountReimbourssed + " ETH")        
    }*/
    const paymentHandler = async () => {
        try {
            if (!payment) {
                const exp = (new Date()).valueOf() -3000 //31536000000
                console.log(exp)
                await contract.methods.pay(exp).send({
                    from: account,
                    value: 1000000000000000000
                })


                /*try {
                    const response = await axios.put(REGISTER_URL,
                        JSON.stringify({ payment_status:{paied:"Paid"} }),
                        {
                            headers: { 'Content-Type': 'application/json' },
                            withCredentials: true
                        }
                    );
                    // TODO: remove console.logs before deployment
                    console.log(JSON.stringify(response?.data));
                    //console.log(JSON.stringify(response))
                    setSuccess(true);
                    
                } catch (err) {
                    if (!err?.response) {
                        setErrMsg('No Server Response');
                    } else if (err.response?.status === 409) {
                        setErrMsg('Username Taken');
                    } else {
                        setErrMsg('Registration Failed')
                    }
                }*/
                setPaymentSuccessMsg('Thank you for completing your payement')
                setTimeout(function () {
                    setIsVisibleSuccess(false);
                    console.log(visibleError);
                }, 5000);
                setIsVisibleSuccess(true);
            }
            //if(contract && accounts)getAmountFunded()

        } catch (err) {
            setExpirationDate("You have not payed yet")
            setError(err.message)
            setTimeout(function () {
                setIsVisibleError(false);
                console.log(visibleError);
            }, 5000);
            setIsVisibleError(true);
        }
    }
    console.log(addressToDate)

    const reimbHandler = async () => {
        let damage = Math.floor(Math.random() * 11);
        console.log(damage)
        try {
            await contract.methods.remboursser(damage).send({
                from: account
            })
            setPaymentSuccessMsg('success : you are reimbourssed check your balance')

            //if(contract && accounts)getAmountFunded()

        } catch (err) {
            setError(err.message)
            setTimeout(function () {
                setIsVisibleError(false);
                console.log(visibleError);
            }, 5000);
            setIsVisibleError(true);
        }
    }

    return (
        <><p>logged in</p>
            <div>
                <Button variant='outlined' color='success' onClick={reimbHandler}><WalletIcon />Reimbourse</Button>
                <p>  </p>
                <Button variant='outlined' color='success' onClick={paymentHandler}><PaidIcon />Pay</Button>
            </div>
            <p>  </p>
            <section><Button variant='outlined' color='success' onClick={show}>Show details</Button></section>

            <section>
                {showDetails && account && (<>
                    <section>
                        <div className='container'>
                            <p>userName : {userName}</p>
                        </div>
                    </section>
                    <section>
                        <div className='container'>
                            <p>email : {email}</p>
                        </div>
                    </section>
                    <section>
                        <div className='container'>
                            <p>number : {number}</p>
                        </div>
                    </section>
                    <section>
                        <div className='container'>
                            <p>x_coordinate : {x}</p>
                        </div>
                    </section>
                    <section>
                        <div className='container'>
                            <p>y_coordinate : {y}</p>
                        </div>
                    </section>
                    <section>
                        <div className='container'>
                            <p>registration state : {register}</p>
                        </div>
                    </section>
                    <section>
                        <div className='container'>
                            <p>payment state : {String(payment)}</p>
                        </div>
                    </section>
                    <section>
                        <div className='container'>
                            <p>Account's Amount funded : {amountFunded}</p>
                        </div>
                    </section>
                    <section>
                        <div className='container'>
                            <p>Account's Amount reimbourssed : {amountReimbourssed}</p>
                        </div>
                    </section>
                    <section>
                        <div className='container'>
                            <p>Account expiration date : {expirationDate}</p>
                        </div>
                    </section>

                </>



                )}
            </section>


            <section>{error && visibleError && (
                <Alert severity="error">
                    <p>{error}</p></Alert>
            )}
            </section>
            <section>{paymentSuccessMsg && visibleSuccess && (
                <Alert severity="success">
                    <p>{paymentSuccessMsg}</p></Alert>)}

            </section>

        </>
    );
};

export default User;