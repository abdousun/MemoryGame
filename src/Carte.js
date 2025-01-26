import React from 'react'
import './Carte.css';

export default function Carte({card,handlechoice,flipped}) {
    


    const handleClick = () => {
            handlechoice(card);
          
    } 

  return (
    <div className="card">
      <div className={flipped ? "flipped" : ""} >
      <img className="front" src={card.src} alt="card front"/>
      <img className="back" onClick={handleClick} style={{backgroundColor:'white'}} src="/img/cover.png" alt="card back"/>
      </div>  
    </div>
  )
}
