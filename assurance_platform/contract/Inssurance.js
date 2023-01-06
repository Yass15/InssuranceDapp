
import {abi} from "./Inssurance.json"


const inssuranceContract = web3 =>{
    return new web3.eth.Contract(abi, "0xD5e9eD3B20876218A0487402b07Fb3ACB51A7195")
}

export default inssuranceContract


