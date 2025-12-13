import React, { useContext, useEffect, useRef, useState } from 'react'
import { userDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import aiImg from "../assets/ai.gif"
import { CgMenuRight } from "react-icons/cg";
import { RxCross1 } from "react-icons/rx";
import userImg from "../assets/user.gif"
function Home() {
  const {userData,serverUrl,setUserData,getGeminiResponse}=useContext(userDataContext)
  const navigate=useNavigate()
  const [listening,setListening]=useState(false)
  const [userText,setUserText]=useState("")
  const [aiText,setAiText]=useState("")
  const isSpeakingRef=useRef(false)
  const recognitionRef=useRef(null)
  const [ham,setHam]=useState(false)
  const isRecognizingRef=useRef(false)
  const synth=window.speechSynthesis

  const handleLogOut=async ()=>{
    try {
      const result=await axios.get(`${serverUrl}/api/auth/logout`,{withCredentials:true})
      setUserData(null)
      navigate("/signin")
    } catch (error) {
      setUserData(null)
      console.log(error)
    }
  }

  const startRecognition = () => {
    
   if (!isSpeakingRef.current && !isRecognizingRef.current) {
    try {
      recognitionRef.current?.start();
      console.log("Recognition requested to start");
    } catch (error) {
      if (error.name !== "InvalidStateError") {
        console.error("Start error:", error);
      }
    }
  }
    
  }

  const speak=(text)=>{
    const utterence=new SpeechSynthesisUtterance(text)
    utterence.lang = 'hi-IN';
    const voices =window.speechSynthesis.getVoices()
    const hindiVoice = voices.find(v => v.lang === 'hi-IN');
    if (hindiVoice) {
      utterence.voice = hindiVoice;
    }


    isSpeakingRef.current=true
    utterence.onend=()=>{
        setAiText("");
  isSpeakingRef.current = false;
  setTimeout(() => {
    startRecognition(); // ⏳ Delay se race condition avoid hoti hai
  }, 800);
    }
   synth.cancel(); // 🛑 pehle se koi speech ho to band karo
synth.speak(utterence);
  }

  const handleCommand=(data)=>{
    // Backward compatible fields
    const type = data?.action?.type || data?.type
    const userInput = data?.userInput || data?.action?.params?.query || ""
    const response = data?.speech || data?.response || "Here you go."

    speak(response)

    const encode=(v)=>encodeURIComponent(v||"")

    const open=(url)=>window.open(url,'_blank')

    const handlers={
      'google-search':({q})=>open(`https://www.google.com/search?q=${encode(q)}`),
      'bing-search':({q})=>open(`https://www.bing.com/search?q=${encode(q)}`),
      'duck-search':({q})=>open(`https://duckduckgo.com/?q=${encode(q)}`),
      'image-search':({q})=>open(`https://www.google.com/search?tbm=isch&q=${encode(q)}`),
      'video-search':({q})=>open(`https://www.google.com/search?tbm=vid&q=${encode(q)}`),
      'news-search':({q})=>open(`https://news.google.com/search?q=${encode(q)}`),
      'wiki-search':({q})=>open(`https://en.wikipedia.org/w/index.php?search=${encode(q)}`),
      'shopping-search':({q})=>open(`https://www.google.com/search?tbm=shop&q=${encode(q)}`),

      'amazon-search':({q})=>open(`https://www.amazon.in/s?k=${encode(q)}`),
      'flipkart-search':({q})=>open(`https://www.flipkart.com/search?q=${encode(q)}`),
      'ebay-search':({q})=>open(`https://www.ebay.com/sch/i.html?_nkw=${encode(q)}`),
      'etsy-search':({q})=>open(`https://www.etsy.com/search?q=${encode(q)}`),

      'youtube-search':({q})=>open(`https://www.youtube.com/results?search_query=${encode(q)}`),
      'youtube-play':({q})=>open(`https://www.youtube.com/results?search_query=${encode(q)}`),
      'youtube-channel-open':({q})=>open(`https://www.youtube.com/@${encode(q)}`),

      'maps-search':({q})=>open(`https://www.google.com/maps/search/${encode(q)}`),
      'maps-nearby':({q})=>open(`https://www.google.com/maps/search/${encode(q||'nearby')}+near+me`),
      'maps-directions':({origin,destination})=>open(`https://www.google.com/maps/dir/?api=1&origin=${encode(origin)}&destination=${encode(destination)}&travelmode=driving`),

      'weather-show':({q})=>open(`https://www.google.com/search?q=${encode('weather '+(q||''))}`),
      'weather-forecast':({q})=>open(`https://www.google.com/search?q=${encode('weather forecast '+(q||''))}`),
      'air-quality':({q})=>open(`https://www.google.com/search?q=${encode('air quality '+(q||''))}`),

      'instagram-open':()=>open(`https://www.instagram.com/`),
      'facebook-open':()=>open(`https://www.facebook.com/`),
      'twitter-open':()=>open(`https://x.com/`),
      'linkedin-open':()=>open(`https://www.linkedin.com/`),
      'github-open':()=>open(`https://github.com/`),
      'reddit-open':()=>open(`https://www.reddit.com/`),
      'pinterest-open':()=>open(`https://www.pinterest.com/`),
      'tiktok-open':()=>open(`https://www.tiktok.com/`),
      'snapchat-open':()=>open(`https://web.snapchat.com/`),
      'threads-open':()=>open(`https://www.threads.net/`),
      'discord-open':()=>open(`https://discord.com/app`),
      'telegram-open':()=>open(`https://web.telegram.org/`),
      'whatsapp-open':()=>open(`https://web.whatsapp.com/`),

      'stack-search':({q})=>open(`https://stackoverflow.com/search?q=${encode(q)}`),
      'mdn-search':({q})=>open(`https://developer.mozilla.org/en-US/search?q=${encode(q)}`),
      'devdocs-search':({q})=>open(`https://devdocs.io/#q=${encode(q)}`),

      'spotify-search':({q})=>open(`https://open.spotify.com/search/${encode(q)}`),
      'spotify-play':({q})=>open(`https://open.spotify.com/search/${encode(q)}`),
      'applemusic-search':({q})=>open(`https://music.apple.com/us/search?term=${encode(q)}`),
      'soundcloud-search':({q})=>open(`https://soundcloud.com/search?q=${encode(q)}`),

      'imdb-search':({q})=>open(`https://www.imdb.com/find/?q=${encode(q)}`),
      'netflix-open':()=>open(`https://www.netflix.com/`),
      'primevideo-open':()=>open(`https://www.primevideo.com/`),
      'hotstar-open':()=>open(`https://www.hotstar.com/`),
      'disney-open':()=>open(`https://www.disneyplus.com/`),

      'calendar-open':()=>open(`https://calendar.google.com/`),
      'clock-open':()=>open(`https://www.google.com/search?q=online+clock`),
      'timer-open':()=>open(`https://timer.onlineclock.net/`),
      'stopwatch-open':()=>open(`https://www.online-stopwatch.com/`),
      'calculator-open':()=>open(`https://www.google.com/search?q=calculator`),

      'translate':({q,from,to})=>open(`https://translate.google.com/?sl=${encode(from||'auto')}&tl=${encode(to||'en')}&text=${encode(q)}&op=translate`),
      'unit-convert':({q})=>open(`https://www.google.com/search?q=${encode(q)}`),
      'currency-convert':({q})=>open(`https://www.google.com/search?q=${encode(q)}`),

      'email-compose':({email,subject,body})=>open(`mailto:${email||''}?subject=${encode(subject||'')}&body=${encode(body||'')}`),
      'open-site':({site,q})=>open(`https://${site}${q?('/search?q='+encode(q)):''}`),
      'general':({q})=>open(`https://www.google.com/search?q=${encode(q)}`),
      'get-time':()=>{},
      'get-date':()=>{},
      'get-day':()=>{},
      'get-month':()=>{},
    }

    const params={ q:userInput }
    const handler=handlers[type]
    if(handler){
      try { handler(params) } catch(e){ console.warn(e) }
    }
  }

useEffect(() => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  recognition.continuous = true;
  recognition.lang = 'en-US';
  recognition.interimResults = false;

  recognitionRef.current = recognition;

  let isMounted = true;  // flag to avoid setState on unmounted component

  // Start recognition after 1 second delay only if component still mounted
  const startTimeout = setTimeout(() => {
    if (isMounted && !isSpeakingRef.current && !isRecognizingRef.current) {
      try {
        recognition.start();
        console.log("Recognition requested to start");
      } catch (e) {
        if (e.name !== "InvalidStateError") {
          console.error(e);
        }
      }
    }
  }, 1000);

  recognition.onstart = () => {
    isRecognizingRef.current = true;
    setListening(true);
  };

  recognition.onend = () => {
    isRecognizingRef.current = false;
    setListening(false);
    if (isMounted && !isSpeakingRef.current) {
      setTimeout(() => {
        if (isMounted) {
          try {
            recognition.start();
            console.log("Recognition restarted");
          } catch (e) {
            if (e.name !== "InvalidStateError") console.error(e);
          }
        }
      }, 1000);
    }
  };

  recognition.onerror = (event) => {
    console.warn("Recognition error:", event.error);
    isRecognizingRef.current = false;
    setListening(false);
    if (event.error !== "aborted" && isMounted && !isSpeakingRef.current) {
      setTimeout(() => {
        if (isMounted) {
          try {
            recognition.start();
            console.log("Recognition restarted after error");
          } catch (e) {
            if (e.name !== "InvalidStateError") console.error(e);
          }
        }
      }, 1000);
    }
  };

  recognition.onresult = async (e) => {
    const transcript = e.results[e.results.length - 1][0].transcript.trim();
    if (userData?.assistantName && transcript.toLowerCase().includes(userData.assistantName.toLowerCase())) {
      setAiText("");
      setUserText(transcript);
      recognition.stop();
      isRecognizingRef.current = false;
      setListening(false);
      const data = await getGeminiResponse(transcript);
      
      // Add safety check before accessing data properties
      if (data && data.response) {
        handleCommand(data);
        setAiText(data.response);
      } else {
        setAiText("Sorry, I couldn't process your request. Please try again.");
      }
      setUserText("");
    }
  };


    if (userData?.name) {
      const greeting = new SpeechSynthesisUtterance(`Hello ${userData.name}, what can I help you with?`);
      greeting.lang = 'hi-IN';
      window.speechSynthesis.speak(greeting);
    }
 

  return () => {
    isMounted = false;
    clearTimeout(startTimeout);
    recognition.stop();
    setListening(false);
    isRecognizingRef.current = false;
  };
}, []);




  return (
    <div className='w-full h-[100vh] bg-gradient-to-t from-[black] to-[#02023d] flex justify-center items-center flex-col gap-[15px] overflow-hidden'>
      <CgMenuRight className='lg:hidden text-white absolute top-[20px] right-[20px] w-[25px] h-[25px]' onClick={()=>setHam(true)}/>
      <div className={`absolute lg:hidden top-0 w-full h-full bg-[#00000053] backdrop-blur-lg p-[20px] flex flex-col gap-[20px] items-start ${ham?"translate-x-0":"translate-x-full"} transition-transform`}>
 <RxCross1 className=' text-white absolute top-[20px] right-[20px] w-[25px] h-[25px]' onClick={()=>setHam(false)}/>
 <button className='min-w-[150px] h-[60px]  text-black font-semibold   bg-white rounded-full cursor-pointer text-[19px] ' onClick={handleLogOut}>Log Out</button>
      <button className='min-w-[150px] h-[60px]  text-black font-semibold  bg-white  rounded-full cursor-pointer text-[19px] px-[20px] py-[10px] ' onClick={()=>navigate("/customize")}>Customize your Assistant</button>

<div className='w-full h-[2px] bg-gray-400'></div>
<h1 className='text-white font-semibold text-[19px]'>History</h1>

<div className='w-full h-[400px] gap-[20px] overflow-y-auto flex flex-col truncate'>
  {userData.history?.map((his, index)=>(
    <div key={index} className='text-gray-200 text-[18px] w-full h-[30px]  '>{his}</div>
  ))}

</div>

      </div>
      <button className='min-w-[150px] h-[60px] mt-[30px] text-black font-semibold absolute hidden lg:block top-[20px] right-[20px]  bg-white rounded-full cursor-pointer text-[19px] ' onClick={handleLogOut}>Log Out</button>
      <button className='min-w-[150px] h-[60px] mt-[30px] text-black font-semibold  bg-white absolute top-[100px] right-[20px] rounded-full cursor-pointer text-[19px] px-[20px] py-[10px] hidden lg:block ' onClick={()=>navigate("/customize")}>Customize your Assistant</button>
      <div className='w-[300px] h-[400px] flex justify-center items-center overflow-hidden rounded-4xl shadow-lg'>
<img src={userData?.assistantImage} alt="" className='h-full object-cover'/>
      </div>
      <h1 className='text-white text-[18px] font-semibold'>I'm {userData?.assistantName}</h1>
      {!aiText && <img src={userImg} alt="" className='w-[200px]'/>}
      {aiText && <img src={aiImg} alt="" className='w-[200px]'/>}
    
    <h1 className='text-white text-[18px] font-semibold text-wrap'>{userText?userText:aiText?aiText:null}</h1>
      
    </div>
  )
}

export default Home