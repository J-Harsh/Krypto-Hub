import { makeStyles } from '@material-ui/styles'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import AliceCarousel from 'react-alice-carousel';
import { Link } from 'react-router-dom';
import {TrendingCoins} from '../../config/api'; 
import { CryptoState } from '../../CryptoContext';
import { numberWithCommas } from "../CoinsTable";

const useStyles=makeStyles(({
    carousel: {
        height: "50%",
        display: "flex",
        alignItems: "center",
        "& .alice-carousel":{
            "& .alice-carousel__dots-item.__active":{
            background:"gold",
            },
            "& .alice-carousel__dots-item":{
                background:"white"
            }
        }
      },
    carouselItem:{
        display: "flex",
        flexDirection: 'column',
        alignItems: "center",
        cursor: "pointer",
        textTransform: "uppercase",
        color: "white",
    },
}));



const Carousel = () => {
    
    const [trending, setTrending] = useState([]);
    const {currency,symbol}= CryptoState();
    const classes=useStyles();

    const fetchTradingCoins= async ()=>
    {
        const {data}=await axios.get(TrendingCoins(currency))
        setTrending(data);
    }

    useEffect(() => {
     fetchTradingCoins();
    }, [currency]);

    const responsive={
        0:{
            items:2,
        },
        512:{
            items:4,
        },
    };

    const items=trending.map((coin)=>{
        let profit=coin.price_change_percentage_24h>=0;
         return(
            <Link className={classes.carouselItem} to={`/coins/${coin.id}`} >
                <img src={coin.image} alt={coin.name} height="80" style={{marginBottom:10}}/>
                <span>
                    {coin.symbol}
                    &nbsp;
                    <span style={{color: profit>0 ?"lightgreen": "red",fontWeight:500,}}>
                        {profit && "+"} {coin.price_change_percentage_24h.toFixed(2)}%
                    </span>
                </span>

                <span style={{fontSize:22,fontWeight:500}}>
                    {symbol} {numberWithCommas(coin.current_price.toFixed(2))}
                </span>
            </Link>
            
         )
         })

  return (
    <div className={classes.carousel}> 
        <AliceCarousel infinite autoPlayInterval={1500} animationDuration={500} disableButtonsControls responsive={responsive} autoPlay items={items}/>
    </div>
  )
}

export default Carousel