import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import User from './components/user'
// import Bar from "./scenes/bar";
// import Line from "./scenes/line";
// import Pie from "./scenes/pie";
// import Geography from "./scenes/geography";
// import Calendar from "./scenes/calendar/calendar";
// import Geography from "./scenes/geography";
// import Calendar from "./scenes/calendar/calendar";

import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Login from "./scenes/login";
import RequireAuth from './components/RequireAuth';
import Register from "./scenes/register";
import Users from "./components/Users";
import { EthProvider } from "./components/EthContext";
import {MoralisProvider} from 'react-moralis';


const ROLES = {
  'User': 2001,
  'Editor': 1984,
  'Admin': 5150
}
function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  return (
    <EthProvider>
    <MoralisProvider initializeOnMount={false}>
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Sidebar isSidebar={isSidebar} />
          <main className="content">
            <Topbar setIsSidebar={setIsSidebar} />
            <Routes>
              {/* <Route path="/" element={<Login />} /> */}
              <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
                <Route path="/" element={<Dashboard />} />
              </Route>
              
              {/* <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}></Route> */}
              {/* <Route path="/dashboard" element={<Dashboard />} /> */}
              {/* <Route path="/team" element={<Team />} /> */}
              {/* <Route path="/contacts" element={<Contacts />} /> */}
              {/* <Route path="/invoices" element={<Invoices />} /> */}
              {/* <Route path="/form" element={<Form />} /> */}
              
              
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/users" element={<Users />} />
              <Route path="/user" element={<User />} />
              {/* <Route path="/bar" element={<Bar />} /> */}
              {/* <Route path="/pie" element={<Pie />} /> */}
              {/* <Route path="/line" element={<Line />} /> */}
  
              {/* <Route path="/calendar" element={<Calendar />} /> */}
              {/* <Route path="/geography" element={<Geography />} /> */}
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider></MoralisProvider></EthProvider>
  );
}

export default App;