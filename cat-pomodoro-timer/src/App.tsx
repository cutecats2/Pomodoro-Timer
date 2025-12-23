import React, {useState, useEffect} from 'react';
import logo from './logo.svg';
import './App.css';

import playImg from "./assets/play.png"; 
import resetImg from "./assets/reset.png"; 
import workBtn from "./assets/work.png";
import workBtnClicked from "./assets/work-clicked.png"; 
import breakBtnClicked from "./assets/break-clicked.png"; 
import breakBtn from "./assets/break.png";
import idleGif from "./assets/idle.gif";
import workGif from "./assets/work.gif"; 
import breakGif from "./assets/break.gif"; 
import meowSound from "./assets/meow.mp3"; 
import closeBtn from "./assets/close.png"; 
import minimizeBtn from "./assets/minimize.png"; 

function App() {
  const [timeLeft, setTimeLeft] = useState(1*60); 
  const [isRunning, setIsRunning] = useState(false);
  const [breakButtonImage, setBreakButtonImage] = useState(breakBtn); 
  const [workButtonImage, setWorkButtonImage] = useState(workBtn); 
  const [gifImage, setGifImage] = useState(idleGif); 
  const [isBreak, setIsBreak] = useState(false); 
  const [motivation, setMotivation] = useState(""); 
  const [image, setImage] = useState(playImg); 
  const meowAudio = new Audio(meowSound);

  const cheerMessages =[
    "You're so awesome!", 
    "Keep going!", 
    "Stay focused!"
  ]; 

  const breakMessages = [
    "Stay hydrated!", 
    "Text me!", 
    "I love you <3"
  ]; 
  //motivation message updater 
  useEffect (()=> {
    let messageInterval: NodeJS.Timer; 

    if (isRunning) {
      const messages = isBreak ? breakMessages : cheerMessages; 
      setMotivation (messages[0]); //set to first message initially
      let index = 1

      messageInterval = setInterval(() => {
        setMotivation(messages[index]); 
        index =(index + 1) % messages.length; 
      }, 4000); //every 4 seconds 
    } else {
      setMotivation(""); 
    }

    return () => clearInterval(messageInterval); 

  }, [isRunning, isBreak]); 

  //countdown timer 
  useEffect ( () => {
    let timer: NodeJS.Timeout; 
    if(isRunning && timeLeft > 0) {
      timer = setInterval ( () => {
        setTimeLeft(prev => prev - 1); 
      }, 1000); 
    }
    return() => clearInterval(timer); 
  }, [isRunning, timeLeft]); 
  // set initial switch mode to false 
  useEffect( () => {
    switchMode(false); 
  }, []); 

  //meow sound 
  useEffect(() => {
    if(timeLeft === 0 && isRunning) {
      meowAudio.play().catch(err => {
        console.error("Audio play failed!", err); 
      }); 
      setIsRunning(false); //auto-stops the timer
      setImage(playImg); //reset to play button 
      setGifImage(idleGif); //reset to idle 
      setTimeLeft(isBreak ? 5 * 60: 1 * 60); 
    }
  })

  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds/60).toString().padStart(2, '0'); 

    const s = (seconds % 60).toString().padStart(2,'0'); 
    return `${m}:${s}`; 

  }; 

  const switchMode = (breakMode: boolean) => {
    setIsBreak(breakMode); 
    setIsRunning(false); 
    setBreakButtonImage(breakMode ? breakBtnClicked: breakBtn); 
    setWorkButtonImage(breakMode ? workBtn : workBtnClicked); 
    setTimeLeft(breakMode ? 5 * 60 : 1 * 60);
    setGifImage(idleGif); 
  }

  const handleClick = () => {
    if (!isRunning){
      setIsRunning(true); 
      setGifImage(isBreak ? breakGif : workGif);
      setImage(resetImg);  
    } else {
      setIsRunning(false); 
      setTimeLeft(1*60); 
      setGifImage(idleGif); 
      setImage(playImg); 
    }
  }
  const handleCloseClick = () => {
    if (window.electronAPI?.closeApp) {
      window.electronAPI.closeApp(); 
    } else {
      console.warn("Electron API not available!"); 
    }
  }
  const handleMinimizeClick = () => {
  if (window.electronAPI?.minimizeApp) {
    window.electronAPI.minimizeApp();
  } else {
    console.warn("Electron API not available!");
  }
};


  
  const containerClass = `home-container ${isRunning ? "background-pink": ""}`;

  return (
    <div className={containerClass} style={{position: 'relative'}}> 
    <div> 
      <button className="close-button" onClick={handleCloseClick}> 
        <img src={closeBtn} alt="Close" /> 
      </button> 
      <button className="minimize-button" onClick={handleMinimizeClick}> 
        <img src={minimizeBtn} alt="Minimize" /> 
      </button> 
    </div> 
    
    <div className="home-content"> 
      <div className="home-controls" > 
        <button className="image-button" onClick={() => switchMode(false)}> 
          <img src={workButtonImage} alt="Work" /> 
        </button>
        <button className="image-button" onClick={() => switchMode(true)}>
          <img src={breakButtonImage} alt="Break" />
        </button>
      </div>  

     <p className={`motivation-text $(!isRunning ? "hidden" : ""}`}> 
        { motivation }
    </p> 

    <h1 className="home-timer">{formatTime(timeLeft)}</h1>
    <img src={gifImage} alt="Timer Status" className="gif-image" /> 
      <button className="home-button" onClick={handleClick}> 
      <img src={image} alt="Button Icon" /> 
    </button> 

    </div> 
    </div>   

  ); 
}

export default App;
