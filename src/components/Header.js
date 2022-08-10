import React from 'react'
import {AppBar,Container,createTheme,Toolbar,Typography,Select,MenuItem} from "@material-ui/core";
import { makeStyles, ThemeProvider } from '@material-ui/styles';
import { useHistory } from 'react-router-dom';
import { CryptoState } from '../CryptoContext';
import AuthModal from './Authentication/AuthModal.js';
import SideBar from './Authentication/SideBar';

const useStyles=makeStyles(()=>({
    title:{
        flex:1,
        color: "gold",
        fontFamily: "Montserrat",
        fontWeight:"bold",
        cursor: "pointer",
    },
}));

const Header = () => {
    const classes=useStyles();
    const history=useHistory();
    const {currency,setCurrency,user}=CryptoState();

    const darkTheme=createTheme({
        palette:{
            primary:{
                main:"#fff",
            },
            type:"dark",
        },
    });

  return (
    <ThemeProvider theme={darkTheme}>
    <AppBar color='transparent' position='static'>
        <Container>
            <Toolbar>
                <Typography onClick={()=>history.push("/")} className={classes.title} variant='h6' >Krypto Hub</Typography>
                <Select value={currency} variant="outlined" style={{width:100,height:40,marginRight:15,}} onChange={(e)=>setCurrency(e.target.value)}>
                    <MenuItem value={"USD"}>USD</MenuItem>
                    <MenuItem value={"INR"}>INR</MenuItem>
                </Select>
                {user? <SideBar/>:<AuthModal/>}
                
            </Toolbar>
        </Container>
    </AppBar>
    </ThemeProvider>
  )
}

export default Header