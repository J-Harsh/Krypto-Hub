import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import Button from "@material-ui/core/Button";
import { CryptoState } from "../../CryptoContext";
import { Avatar, Typography } from "@material-ui/core";
import { signOut } from "firebase/auth";
import { auth, db } from "../../firebase";
import { numberWithCommas } from "../CoinsTable";
import { AiOutlineDelete } from "react-icons/ai";
import { doc, setDoc } from "firebase/firestore";

const useStyles = makeStyles({
  container: {
    width: 350,
    padding: 25,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    fontFamily: "monospace",
  },
  profile: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "20px",
    height: "92%",
  },
  logout: {
    height: "8%",
    width: "100%",
    backgroundColor: "#EEBC1D",
    marginTop: 20,
  },
  picture: {
    width: 100,
    height: 100,
    cursor: "pointer",
    backgroundColor: "#EEBC1D",
    objectFit: "contain",
    marginTop: "32px",
  },
  watchlist: {
    flex: 1,
    width: "100%",
    backgroundColor: "#EEBC1D",
    borderRadius: 10,
    padding: 15,
    paddingTop: 10,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 12,
    overflowY: "visible",
  },
  username: {
    fontSize: 18,
    fontWeight: "light",
    letterSpacing: 1.5,
    marginBottom: "12px",
  },
  coin: {
    padding: 10,
    borderRadius: 5,
    color: "black",
    width: "100%",
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#EEBC1D",
    boxShadow: "0 0 2px black",
  },
});

export default function SideBar() {
  const classes = useStyles();
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const { user, setAlert, watchlist, coins, symbol } = CryptoState();

  const removeFromWatchlist = async(coin)=>{
    const coinRef=doc(db,"watchlist",user.uid);
    try {
      await setDoc(coinRef,{coins: watchlist.filter((watch)=> watch !== coin?.id),},{merge:"true"});

      setAlert({open:true,message:`${coin.name} Removed to the Watchlist!`,type:"success",})
    } catch (error) {
      setAlert({
        open: true,
        message: error.message,
        type: "error",
      });
    }
  }

  const logOut = () => {
    signOut(auth);
    setAlert({ open: true, type: "success", message: "Log Out Successfull!" });
  };

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  return (
    <div>
      {["right"].map((anchor) => (
        <React.Fragment key={anchor}>
          <Avatar
            onClick={toggleDrawer(anchor, true)}
            style={{
              height: 38,
              width: 38,
              marginLeft: 15,
              cursor: "pointer",
              backgroundColor: "#EEBC1D",
            }}
            src={user.photoURL}
            alt={user.displayName || user.email}
          />
          <Drawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
          >
            <div className={classes.container}>
              <div className={classes.profile}>
                <Avatar
                  className={classes.picture}
                  src={user.photoURL}
                  alt={user.displayName || user.email}
                />
                <span
                  style={{
                    width: "100%",
                    fontSize: 25,
                    textAlign: "center",
                    fontWeight: "bolder",
                    wordWrap: "break-word",
                  }}
                >
                  <Typography className={classes.username}>
                    {user.displayName || user.email}
                  </Typography>
                </span>
                <div className={classes.watchlist}>
                  <span>
                    <Typography
                      className={classes.username}
                      style={{
                        color: "black",
                        fontSize: "22px",
                        marginTop: "4px",
                        textShadow: "0 0 1px black",
                      }}
                    >
                      Watchlist
                    </Typography>
                  </span>
                  {coins.map((coin) => {
                    if (watchlist.includes(coin.id)) {
                      return (
                        <div className={classes.coin}>
                          <img
                            src={coin.image}
                            alt={coin.name}
                            style={{ width: 30, marginRight: 16 }}
                          />
                          <Typography>
                            <span>{coin.name}&nbsp;&nbsp;</span>
                          </Typography>

                          <div
                            className={classes.coin}
                            style={{
                              justifyContent: "flex-end",
                              boxShadow: "none",
                            }}
                          >
                            <Typography>
                              <span style={{ fontSize: 14 }}>
                                {symbol}
                                {numberWithCommas(
                                  coin.current_price.toFixed(2)
                                )}
                              </span>
                            </Typography>

                            <AiOutlineDelete
                              style={{ cursor: "pointer" }}
                              fontSize="26"
                              onClick={() => removeFromWatchlist(coin)}
                            />
                          </div>
                        </div>
                      );
                    }
                    else 
                        return(<></>)
                  })}
                </div>
              </div>
              <Button
                variant="contained"
                className={classes.logout}
                onClick={logOut}
              >
                Log Out
              </Button>
            </div>
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}
