import { useState, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useRefreshToken from "../hooks/useRefreshToken";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Alert, TextField, Table, TableRow, TableCell, TableHead, TableBody } from '@mui/material';
import { useMoralis } from 'react-moralis'
import { useEth } from '../components/EthContext';

const Users = () => {
    const { state: { accounts, contract }, } = useEth();
    const [paymentSuccessMsg, setPaymentSuccessMsg] = useState('')
    const [visibleSuccess, setIsVisibleSuccess] = useState(true);
    const [visibleError, setIsVisibleError] = useState(true);
    const [users, setUsers] = useState();
    const [error, setError] = useState('');
    const [balance, setBalance] = useState();
    const [amountToWithdraw, setAmountToWithdraw] = useState(null);
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();
    const refresh = useRefreshToken();
    let [tab, setTab] = useState([])

    const {
        account,
    } = useMoralis();

    useEffect(() => {
        getBalanceHandler()
    })
    
    
    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getUsers = async () => {
            try {
                const response = await axiosPrivate.get('/users', {
                    signal: controller.signal
                });
                console.log(response.data);
                isMounted && setUsers(response.data);
            } catch (err) {
                console.error(err);
                navigate('/login', { state: { from: location }, replace: true });
            }
        }

        getUsers();

        return () => {
            isMounted = false;
            // controller.abort();
        }
    }, [])

    const getBalanceHandler = async () => {
        const balance = await contract.methods.getBalance().call() / (10 ** 18)
        setBalance(balance + " ETH")


    }


    const handleWithdraw = async () => {
        try {
            await contract.methods.withdraw(amountToWithdraw).send({
                from: account
            })
            console.log(amountToWithdraw)
            setPaymentSuccessMsg('Amount withdrawn successfuly')
            setTimeout(function () {
                setIsVisibleSuccess(false);
                console.log(visibleError);
            }, 5000);
            setIsVisibleSuccess(true);
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


        <>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell scope="col">Id</TableCell>
                        <TableCell scope="col">Username</TableCell>
                        <TableCell scope="col">Email</TableCell>
                        <TableCell scope="col">Contact</TableCell>
                        <TableCell scope="col">X coordinate</TableCell>
                        <TableCell scope="col">Y coordinate</TableCell>
                    </TableRow>
                </TableHead>

                {users?.length
                    ? (
                        <TableBody>
                            {users.map((element, i) => {
                                return (
                                    <>
                                        <TableRow>
                                            <TableCell>{element._id}</TableCell>
                                            <TableCell >{element.username}</TableCell>
                                            <TableCell >{element.email}</TableCell>
                                            <TableCell >{element.contact}</TableCell>
                                            <TableCell >{element.x_coordinate}</TableCell>
                                            <TableCell >{element.y_coordinate}</TableCell>
                                        </TableRow>
                                    </>
                                );
                            })}
                        </TableBody>

                    ) : <p>No users to display</p>}
            </Table>
            <br />
            <p>  </p>
            <TextField id="filled-basic"
                label="amount to withdraw:"
                variant="filled"
                autoComplete="off"
                onChange={(e) => setAmountToWithdraw(e.target.value)}
                value={amountToWithdraw}
                required
            />
            <p>  </p>
            <Button variant='outlined' color='success' onClick={handleWithdraw}>withdraw</Button>
            <section>{error && visibleError && (
                <Alert severity="error">
                    <p>{error}</p></Alert>
            )}
            </section>
            <section>{paymentSuccessMsg && visibleSuccess && (
                <Alert severity="success">
                    <p>{paymentSuccessMsg}</p></Alert>)}

            </section><p>  </p>

            <section>
                <div className='container'>
                    <p>Contract balance : {balance}</p>
                </div>
            </section>
        </>
    );
};

export default Users;