import { Box, IconButton, useTheme, Button } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { ColorModeContext, tokens } from "../../theme";
import InputBase from "@mui/material/InputBase";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { useEth } from '../../components/EthContext';
import { useMoralis } from 'react-moralis';
import WalletIcon from '@mui/icons-material/Wallet';



const Topbar = () => {
  const {state:{accounts,contract},}= useEth();
  console.log(contract)
  const [a, setA] = useState(false);
  //setA(accounts);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);

  const {
    enableWeb3,
    account,
    isWeb3Enabled,
    isWeb3EnableLoading,
    Moralis,
    deactivateWeb3,
  }=useMoralis();
  /*useEffect(()=>{console.log(window.ethereum.selectedAddress)
    if(contract && accounts==null)window.localStorage.removeItem("Connected")
  }, [accounts, contract])*/

  useEffect(() => {
    if (isWeb3Enabled) return;
    if (window.localStorage.getItem("connected")) {
      enableWeb3();
    }
  }, [isWeb3Enabled]);
  useEffect(() => {
    Moralis.onAccountChanged((account) => {
      console.log(`Account changed to ${account}`);
      if (account == null) {
        window.localStorage.removeItem("connected");
        deactivateWeb3();
        console.log("Null Account found");
      }
    });
  }, []);

  const connectWalletHandler = async () => {
    if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
        try {
            await window.ethereum.request({ method: "eth_requestAccounts" })
            window.localStorage.setItem("Connected", "true")
            console.log(accounts)
            console.log(accounts[0])
            setA(true)
            //getFunders()
            
        } catch (err) {
            console.log(err.message)
        }

    }
    else {
        console.log("install metamask")
    }
}

  return (
    <Box display="flex" justifyContent="space-between" p={2}>
      {/* SEARCH BAR */}
      <Box
        display="flex"
        backgroundColor={colors.primary[400]}
        borderRadius="3px"
      >
        <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" />
        <IconButton type="button" sx={{ p: 1 }}>
          <SearchIcon />
        </IconButton>
      </Box>

      {/* ICONS */}
      <Box display="flex">
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>
        <IconButton>
        <div>
                {account ? (
                    <div>Connected to {account}</div>
                ) : (
                  <Button variant="outlined" color="success"
                  onClick={async () => {
                    await enableWeb3();
                    if (typeof window !== "undefined") {
                      window.localStorage.setItem("connected", "injected");
                    }
                  }}
                  disabled={isWeb3EnableLoading}
                ><WalletIcon />
                  connect
                </Button>
                )
                }
            </div>
            </IconButton>

      </Box>
    </Box>
  );
};

export default Topbar;