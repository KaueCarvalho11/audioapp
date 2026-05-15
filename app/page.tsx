"use client"

import { useEffect, useRef, useState } from "react";
import { FaBackward, FaForward, FaPauseCircle, FaPlayCircle, FaStepBackward, FaStepForward, FaVolumeUp } from "react-icons/fa";
import musics from "./data/musics";

export default function Home() {
  const [playing, isPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(1);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [audioIndex, setAudioIndex] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [velocity, setVelocity] = useState<number>(1);

  useEffect(() => {
    if (playing) {
      play();
    }
    const audio = audioRef.current;
    if (!audio) return;
    
    audio.onloadedmetadata = () => {
      setDuration(audio.duration);
    }

    audio.ontimeupdate = () => {
      setCurrentTime(audio.currentTime);
    }

    audio.onended = () => {
      configAudio(audioIndex + 1);
    }
    
    audio.playbackRate = velocity;

  }, [audioIndex]) 

  // Inicialização
  useEffect(()=>{
    configAudio(0);
    const audio = audioRef.current;
    if (!audio) return;
    if(audio.duration) setDuration(audio.duration);
  }, []);

  const formatTime = (time: number) => {
    const minutes = Math.trunc(time/60);
    const seconds = Math.trunc(time % 60);
    return ("0" + minutes).slice(-2) + ":" + ("0" + seconds).slice(-2);
  }

  const play = () => {
    audioRef.current?.play();
  }

  const pause = () => {
    audioRef.current?.pause();
  }

  const playPause = () => {
    if (playing) {
      pause();
    } else {
      play();
    }
    isPlaying(!playing);
  }

  const configVolume = (value: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = value;
    setVolume(value);
  }

  const configAudio = (index: number) => {
    let nextIndex = index;
    if (nextIndex >= musics.length) {
      nextIndex = 0; 
    } else if (nextIndex < 0){
      nextIndex = musics.length - 1;
    }
    setAudioIndex(nextIndex);
    if(playing) {
        setTimeout(() => play(), 50); 
    }
  }

  const configVelocity = () => {
    let newVelocity = velocity + 0.5;
    if (newVelocity > 2) { 
      newVelocity = 1;
    }
    const audio = audioRef.current;
    if (!audio) return;
    audio.playbackRate = newVelocity;
    setVelocity(newVelocity);
  }

  const configCurrentTime = (time: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = time;
    setCurrentTime(time);
  }


  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 p-6 md:p-12 font-sans overflow-hidden flex items-center justify-center">
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 bg-neutral-900 border border-neutral-800 p-8 rounded-3xl shadow-2xl w-full max-w-7xl h-[85vh] lg:h-auto overflow-hidden">
        
        <div className="lg:col-span-1 space-y-6 flex flex-col h-full overflow-hidden">
          <h2 className="text-3xl font-bold text-white tracking-tight">Sua Playlist</h2>
          
          <ul className="space-y-3 overflow-y-auto pr-3 custom-scrollbar flex-grow">
            {musics.map((music, index) => {
              const isCurrent = index === audioIndex;
              return (
                <li 
                  key={index} 
                  onClick={() => configAudio(index)} 
                  className={`
                    flex items-center gap-4 cursor-pointer p-4 rounded-xl 
                    transition-all duration-300 ease-in-out
                    ${isCurrent 
                      ? 'bg-neutral-800 border border-teal-600 shadow-md ring-1 ring-teal-900' 
                      : 'hover:bg-neutral-800 border border-transparent'}
                  `}
                >
                  <img 
                    src={music.imagem} 
                    alt={music.nome} 
                    className={`w-14 h-14 rounded-lg object-cover shadow transition-transform duration-300 ${isCurrent ? 'scale-105' : ''}`}
                  />
                  <div className="flex flex-col flex-grow">
                    <h1 className={`text-base tracking-tight ${isCurrent ? 'font-bold text-teal-400' : 'font-medium text-neutral-100'}`}>
                      {music.nome}
                    </h1>
                    <p className="text-sm text-neutral-400 font-normal">Artista Desconhecido</p>
                  </div>
                  
                  {isCurrent && playing && (
                    <div className="w-3 h-3 bg-teal-500 rounded-full animate-pulse shadow-glow-teal"></div>
                  )}
                </li>
              )
            })}
          </ul>
        </div>

        <div className="lg:col-span-2 bg-neutral-800 p-8 rounded-3xl border border-neutral-700 shadow-inner flex flex-col items-center gap-10">
          
          {/* Elemento de áudio escondido */}
          <audio ref={audioRef} src={musics[audioIndex].url} controls hidden></audio>

          <div className="flex flex-col items-center gap-6 w-full max-w-sm">
            <img 
              src={musics[audioIndex].imagem} 
              alt={musics[audioIndex].nome} 
              className="w-full aspect-square rounded-3xl object-cover shadow-2xl border-4 border-neutral-700/50 transform transition-transform duration-500 hover:scale-105"
            />
            <div className="text-center space-y-1 w-full overflow-hidden">
                <h1 className="text-3xl font-extrabold tracking-tighter text-white truncate px-2">
                    {musics[audioIndex].nome}
                </h1>
                <p className="text-lg text-neutral-400 font-medium tracking-tight">Reproduzindo agora</p>
            </div>
          </div>

          <div className="w-full flex flex-col items-center gap-6 mt-auto">
            
            <div className="w-full flex items-center gap-4 text-xs text-neutral-400 font-mono">
              <span>{formatTime(currentTime)}</span>
              <input 
                type="range"
                min={0}
                step={0.001}
                max={duration || 1} 
                value={currentTime}
                onChange={(e) => configCurrentTime(Number(e.target.value))}
                className="flex-grow h-1.5 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-teal-500 hover:accent-teal-400 transition-colors"
              />
              <span>{formatTime(duration)}</span>
            </div>

            <div className="flex items-center gap-5">
              
              <button onClick={()=>configCurrentTime(currentTime - 10)} className="text-xl text-neutral-400 hover:text-white transition-colors p-2 rounded-full hover:bg-neutral-700">
                <FaBackward />
              </button>

              <button onClick={()=> configAudio(audioIndex - 1)} className="text-2xl text-neutral-300 hover:text-white transition-colors p-2.5 rounded-full hover:bg-neutral-700">
                    <FaStepBackward />
              </button>

              <button onClick={() => playPause()} className="p-1 bg-white text-neutral-950 rounded-full hover:scale-110 transition-transform duration-300 shadow-xl shadow-teal-950/30 text-6xl">
              {
                playing ? <FaPauseCircle /> : <FaPlayCircle />
              }
              </button>

              <button onClick={() => configAudio(audioIndex + 1)} className="text-2xl text-neutral-300 hover:text-white transition-colors p-2.5 rounded-full hover:bg-neutral-700">
                <FaStepForward />
              </button>
              
              <button onClick={() => configCurrentTime(currentTime + 10)} className="text-xl text-neutral-400 hover:text-white transition-colors p-2 rounded-full hover:bg-neutral-700">
                 <FaForward />
              </button>
            </div>

            <div className="flex items-center gap-8 w-full mt-6 border-t border-neutral-700 pt-6">
                
                <div className="flex items-center gap-3 text-neutral-400 flex-grow max-w-xs">
                    <FaVolumeUp className="text-lg"/>
                    <input type="range"
                      min={0}
                      max={1}
                      step={0.001}
                      value={volume}
                      onChange={(e) => configVolume(Number(e.target.value))}
                      className="w-full h-1 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-neutral-300 hover:accent-white"
                    />
                </div>

                <button 
                  onClick={configVelocity} 
                  className="ml-auto text-xs font-mono font-bold bg-teal-600/20 text-teal-300 border border-teal-500/30 rounded-full h-10 w-10 flex items-center justify-center hover:bg-teal-600/40 hover:border-teal-400 transition-all shadow-md"
                >
                    {velocity}x
                </button>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}