import { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Sparkles,
  Shield,
  Award,
  Heart,
  MessageSquare,
  Maximize2,
  Minimize2,
  CheckCircle2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../utils/soundAndTTS';
import seguritoBanner from '../assets/images/segurito_video_banner_1788437807892.jpg';
import seguritoPortrait from '../assets/images/segurito_character_portrait_1788437821219.jpg';

interface SeguritoWelcomeVideoProps {
  onStartGame?: () => void;
  playerAlias?: string;
}

interface CaptionSegment {
  timeStart: number;
  timeEnd: number;
  text: string;
  badge: string;
  actionTip?: string;
}

const CAPTIONS: CaptionSegment[] = [
  {
    timeStart: 0,
    timeEnd: 6,
    text: '¡Hola a todos los amiguitos y futuros patrulleros de Venezuela! Soy Segurito, el niño guardián vial del INTT.',
    badge: '👋 ¡BIENVENIDA OFICIAL!',
    actionTip: '¡Conoce a Segurito y aprende seguridad vial!',
  },
  {
    timeStart: 6,
    timeEnd: 12,
    text: '¡Te doy la bienvenida al Portal Oficial INTT Ruta Segura! Un espacio digital lleno de diversión y aprendizaje.',
    badge: '🚦 PORTAL EDUCATIVO INTT',
    actionTip: 'Educación vial con base en la Ley de Transporte Terrestre.',
  },
  {
    timeStart: 12,
    timeEnd: 18,
    text: 'Aquí aprenderás las 3 reglas de oro: mirar a ambos lados antes de cruzar, usar siempre el casco y cinturón, y respetar los semáforos.',
    badge: '⭐ REGLAS DE ORO',
    actionTip: 'Prevenir accidentes salva vidas todos los días.',
  },
  {
    timeStart: 18,
    timeEnd: 25,
    text: '¡Supera las 15 Misiones de Ley para graduarte y obtener tu Licencia Digital Oficial! ¡Elige tu cadete abajo y vamos juntos!',
    badge: '🏆 ¡OBTÉN TU LICENCIA!',
    actionTip: '15 capítulos interactivos te esperan.',
  },
];

const FULL_SCRIPT =
  '¡Hola a todos los amiguitos y futuros patrulleros de Venezuela! Soy Segurito, el niño guardián vial del INTT. ¡Te doy la bienvenida al Portal Oficial INTT Ruta Segura! Aquí aprenderás las tres reglas de oro: mirar a ambos lados antes de cruzar por el rayado, usar siempre el casco y cinturón de seguridad, y respetar la luz roja del semáforo. ¡Supera las 15 misiones de la Ley de Transporte para graduarte como patrullero y obtener tu licencia digital! ¡Elige a tu cadete abajo y acompáñame a cuidar las calles!';

export default function SeguritoWelcomeVideo({ onStartGame, playerAlias }: SeguritoWelcomeVideoProps) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration] = useState<number>(25);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showCaptions, setShowCaptions] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [likesCount, setLikesCount] = useState<number>(142);
  const [hasLiked, setHasLiked] = useState<boolean>(false);
  const [activeTipIdx, setActiveTipIdx] = useState<number>(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<number | null>(null);

  // Find active caption based on currentTime
  const currentCaption =
    CAPTIONS.find((c) => currentTime >= c.timeStart && currentTime < c.timeEnd) || CAPTIONS[0];

  // Stop video audio when component unmounts
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      soundManager.stopSpeaking();
    };
  }, []);

  // Timer loop for video progress bar
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = window.setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            setIsPlaying(false);
            soundManager.stopSpeaking();
            if (intervalRef.current) clearInterval(intervalRef.current);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, duration]);

  const handleTogglePlay = () => {
    soundManager.playClick();

    if (isPlaying) {
      setIsPlaying(false);
      soundManager.stopSpeaking();
    } else {
      setIsPlaying(true);
      if (!isMuted) {
        soundManager.speak(
          FULL_SCRIPT,
          () => setIsPlaying(true),
          () => {
            setIsPlaying(false);
            setCurrentTime(0);
          }
        );
      }
    }
  };

  const handleRestart = () => {
    soundManager.playClick();
    setCurrentTime(0);
    setIsPlaying(true);
    soundManager.stopSpeaking();
    if (!isMuted) {
      soundManager.speak(
        FULL_SCRIPT,
        () => setIsPlaying(true),
        () => {
          setIsPlaying(false);
          setCurrentTime(0);
        }
      );
    }
  };

  const handleToggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    if (nextMute) {
      soundManager.stopSpeaking();
    } else if (isPlaying) {
      soundManager.speak(currentCaption.text);
    }
  };

  const handleLike = () => {
    if (!hasLiked) {
      soundManager.playCorrect();
      setLikesCount((prev) => prev + 1);
      setHasLiked(true);
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.4 },
        colors: ['#004884', '#fbbf24', '#ef4444', '#10b981'],
      });
    }
  };

  const handleSelectTip = (index: number) => {
    soundManager.playClick();
    setActiveTipIdx(index);
    const targetCaption = CAPTIONS[index];
    if (targetCaption) {
      setCurrentTime(targetCaption.timeStart);
      setIsPlaying(true);
      soundManager.stopSpeaking();
      if (!isMuted) {
        soundManager.speak(targetCaption.text);
      }
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen((prev) => !prev);
  };

  const progressPercent = Math.min(100, Math.round((currentTime / duration) * 100));

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden rounded-3xl bg-white border-2 border-blue-200 shadow-xl shadow-blue-900/10 transition-all duration-300 ${
        isFullscreen ? 'fixed inset-4 z-50 overflow-y-auto max-h-[95vh]' : ''
      }`}
    >
      {/* Official Venezuelan Tricolor Top Ribbon */}
      <div className="h-2 w-full bg-gradient-to-r from-amber-400 via-blue-600 to-red-600" />

      {/* Video Player Header Bar */}
      <div className="bg-gradient-to-r from-[#003366] via-[#004884] to-[#0369a1] text-white px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-400 text-blue-950 flex items-center justify-center font-bold shadow-md shrink-0">
            <Sparkles className="w-5 h-5 fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-orbitron font-extrabold text-sm sm:text-base text-white tracking-wide">
                SEGURITO TE DA LA BIENVENIDA
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-600 text-white flex items-center gap-1 shadow-sm">
                <span className={`w-2 h-2 rounded-full bg-white ${isPlaying ? 'animate-ping' : ''}`} />
                <span>{isPlaying ? 'EN REPRODUCCIÓN' : 'VIDEO ANIMADO'}</span>
              </span>
            </div>
            <p className="text-[11px] text-blue-100 font-medium">
              Mascota Oficial de Educación y Patrulla Vial Escolar // INTT Venezuela
            </p>
          </div>
        </div>

        {/* Video Header Actions */}
        <div className="flex items-center gap-2">
          <button
            id="btn-like-segurito"
            onClick={handleLike}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
              hasLiked
                ? 'bg-rose-500 text-white'
                : 'bg-white/15 hover:bg-white/25 text-white border border-white/20'
            }`}
            title="Dar me gusta al video de Segurito"
          >
            <Heart className={`w-3.5 h-3.5 ${hasLiked ? 'fill-current text-white' : ''}`} />
            <span className="font-mono">{likesCount}</span>
          </button>

          <button
            id="btn-toggle-fullscreen-video"
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-white/15 hover:bg-white/25 text-white transition-all cursor-pointer border border-white/20"
            title={isFullscreen ? 'Reducir pantalla' : 'Pantalla completa'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Video Viewport Canvas */}
      <div className="relative w-full bg-slate-950 aspect-video max-h-[460px] flex items-center justify-center overflow-hidden select-none group">
        {/* Animated Background Video Frame Graphic */}
        <img
          src={seguritoBanner}
          alt="Segurito - El niño patrullero escolar del INTT da la bienvenida al portal vial"
          referrerPolicy="no-referrer"
          className={`w-full h-full object-cover object-center transition-transform duration-700 ${
            isPlaying ? 'scale-[1.03]' : 'scale-100'
          }`}
        />

        {/* Subtle Vignette & Light Grading */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

        {/* Floating Animated Badge Top-Left: Segurito Info */}
        <div className="absolute top-4 left-4 z-20 flex items-center gap-3 p-2 pr-4 rounded-2xl bg-black/60 backdrop-blur-md border border-white/20 text-white shadow-xl">
          <img
            src={seguritoPortrait}
            alt="Segurito avatar"
            referrerPolicy="no-referrer"
            className="w-11 h-11 rounded-xl object-cover border-2 border-amber-400 shadow-md"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-orbitron font-extrabold text-xs text-amber-300">
                SEGURITO
              </span>
              <Shield className="w-3.5 h-3.5 text-blue-400 fill-current" />
            </div>
            <p className="text-[10px] text-blue-100 font-mono">
              Patrullero Escolar Infantil INTT
            </p>
          </div>
        </div>

        {/* Floating Live Audio Waveform (Visible while playing) */}
        {isPlaying && (
          <div className="absolute top-4 right-4 z-20 flex items-center gap-1 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-amber-400/40 text-amber-300 text-xs font-mono shadow-xl">
            <span className="text-[10px] font-bold mr-1">AUDIO VOZ ACTIVA:</span>
            <span className="w-1 h-3 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-1 h-5 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-1 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            <span className="w-1 h-4 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '450ms' }} />
          </div>
        )}

        {/* Big Central Play Button (When Paused) */}
        {!isPlaying && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-4 bg-black/40 backdrop-blur-[2px] transition-all">
            <button
              id="btn-play-segurito-video-hero"
              onClick={handleTogglePlay}
              className="group/btn relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 hover:from-amber-400 hover:to-amber-200 text-blue-950 flex items-center justify-center shadow-2xl shadow-amber-500/40 hover:scale-110 active:scale-95 transition-all cursor-pointer border-4 border-white"
              title="Reproducir video animado de Segurito"
            >
              <Play className="w-9 h-9 sm:w-11 sm:h-11 fill-blue-950 ml-1.5 transition-transform group-hover/btn:scale-110" />
              <span className="absolute -inset-2 rounded-full border-2 border-amber-300/60 animate-ping pointer-events-none" />
            </button>

            <div className="mt-4 px-4 py-2 rounded-2xl bg-black/70 backdrop-blur-md border border-white/20 text-center shadow-lg max-w-sm">
              <span className="font-orbitron font-bold text-xs sm:text-sm text-white block">
                ¡HAZ CLIC PARA ESCUCHAR EL MENSAJE!
              </span>
              <span className="text-[11px] text-amber-300 font-medium">
                Segurito te explica cómo usar el portal y superar las 15 misiones
              </span>
            </div>
          </div>
        )}

        {/* Synced Subtitles / Captions Box (On Bottom of Video) */}
        {showCaptions && (
          <div className="absolute bottom-16 left-4 right-4 z-20 flex justify-center pointer-events-none">
            <div className="max-w-2xl w-full p-3 sm:p-4 rounded-2xl bg-black/85 backdrop-blur-md border border-white/20 text-center shadow-2xl animate-fadeIn">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400 text-blue-950 text-[10px] font-mono font-extrabold mb-1.5">
                <span>{currentCaption.badge}</span>
              </div>
              <p className="text-xs sm:text-sm md:text-base font-semibold text-white leading-snug drop-shadow-md">
                "{currentCaption.text}"
              </p>
            </div>
          </div>
        )}

        {/* Video Player Bottom Controls Overlay Bar */}
        <div className="absolute bottom-0 left-0 right-0 z-30 p-3 sm:p-4 bg-gradient-to-t from-black/95 via-black/80 to-transparent space-y-2">
          {/* Progress Timeline Track */}
          <div className="w-full flex items-center gap-3">
            <span className="text-[10px] font-mono text-white/80 font-bold shrink-0">
              0:{currentTime.toString().padStart(2, '0')}
            </span>

            <div
              className="flex-1 h-2 bg-white/20 hover:h-3 rounded-full cursor-pointer overflow-hidden transition-all relative"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const ratio = Math.max(0, Math.min(1, clickX / rect.width));
                const targetSec = Math.floor(ratio * duration);
                setCurrentTime(targetSec);
              }}
            >
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-amber-300 rounded-full transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <span className="text-[10px] font-mono text-white/80 font-bold shrink-0">
              0:{duration}
            </span>
          </div>

          {/* Controls row */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {/* Play / Pause Toggle */}
              <button
                id="btn-video-play-toggle"
                onClick={handleTogglePlay}
                className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-blue-950 font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
                title={isPlaying ? 'Pausar' : 'Reproducir'}
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                <span className="hidden sm:inline">{isPlaying ? 'Pausar' : 'Reproducir'}</span>
              </button>

              {/* Restart Button */}
              <button
                id="btn-video-restart"
                onClick={handleRestart}
                className="p-2 rounded-xl bg-white/15 hover:bg-white/25 text-white transition-all cursor-pointer"
                title="Reiniciar mensaje de Segurito"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Mute Button */}
              <button
                id="btn-video-audio-mute"
                onClick={handleToggleMute}
                className={`p-2 rounded-xl text-white transition-all cursor-pointer ${
                  isMuted ? 'bg-red-500/40 text-red-200' : 'bg-white/15 hover:bg-white/25'
                }`}
                title={isMuted ? 'Activar voz' : 'Silenciar voz'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>

              {/* Subtitles CC Toggle */}
              <button
                id="btn-video-cc-toggle"
                onClick={() => setShowCaptions((prev) => !prev)}
                className={`px-2.5 py-1.5 rounded-xl text-[11px] font-mono font-bold transition-all cursor-pointer ${
                  showCaptions
                    ? 'bg-blue-600 text-white'
                    : 'bg-white/15 text-white/60 hover:text-white'
                }`}
                title="Activar/Desactivar subtítulos"
              >
                CC
              </button>
            </div>

            {/* Quick Action CTA inside video */}
            {onStartGame && (
              <button
                id="btn-segurito-enter-system"
                onClick={onStartGame}
                className="px-4 py-2 rounded-xl bg-[#004884] hover:bg-[#003366] text-white font-orbitron font-bold text-xs tracking-wider border border-blue-300 shadow-md cursor-pointer flex items-center gap-1.5 transition-all hover:scale-105"
              >
                <Shield className="w-3.5 h-3.5 text-amber-300" />
                <span>IR A LAS 15 MISIONES</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Interactive Segurito Advice Cards Row */}
      <div className="p-4 sm:p-5 bg-gradient-to-b from-blue-50/70 to-white border-t border-blue-200 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#004884]" />
            <h4 className="font-orbitron font-extrabold text-xs sm:text-sm text-[#002f5e]">
              CONSEJOS DE SEGURITO // SELECCIONA UN TEMA PARA ESCUCHARLO:
            </h4>
          </div>
          <span className="text-[11px] font-mono text-slate-500 font-semibold">
            Haz clic en un capítulo para que Segurito lo explique
          </span>
        </div>

        {/* 4 Interactive Topic Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {CAPTIONS.map((cap, idx) => {
            const isSelected = currentTime >= cap.timeStart && currentTime < cap.timeEnd;
            return (
              <button
                key={idx}
                id={`btn-segurito-tip-${idx}`}
                onClick={() => handleSelectTip(idx)}
                className={`p-3 rounded-2xl text-left transition-all duration-200 cursor-pointer border-2 flex flex-col justify-between ${
                  isSelected
                    ? 'bg-blue-100/90 border-[#004884] shadow-md ring-2 ring-blue-200'
                    : 'bg-white hover:bg-blue-50/50 border-blue-200 hover:border-blue-300 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="font-mono text-[10px] font-bold text-[#004884]">
                    PARTE {idx + 1}
                  </span>
                  {isSelected ? (
                    <span className="px-1.5 py-0.2 rounded-full text-[9px] font-mono font-bold bg-[#004884] text-white">
                      SONANDO
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400 font-mono">0:{cap.timeStart}</span>
                  )}
                </div>

                <p className="font-bold text-xs text-[#002f5e] leading-snug line-clamp-1 mb-0.5">
                  {cap.badge}
                </p>
                <p className="text-[11px] text-slate-600 leading-tight line-clamp-2 font-medium">
                  {cap.actionTip}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
