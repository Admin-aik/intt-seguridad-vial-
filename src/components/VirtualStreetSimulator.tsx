import { useState, useEffect, useRef } from 'react';
import {
  Gauge,
  Shield,
  AlertTriangle,
  CheckCircle,
  Play,
  RotateCcw,
  Volume2,
  Compass,
  Zap,
  Eye,
  Camera,
  Car,
  Navigation,
  CloudRain,
  Sun,
  Radio,
  ArrowUpRight,
  ShieldAlert,
  Sliders,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  VolumeX,
} from 'lucide-react';
import { AvatarData } from '../types';
import ThreeMetropolisView from './ThreeMetropolisView';
import { soundManager } from '../utils/soundAndTTS';

// Import photorealistic 3D driving images
import simCockpitImg from '../assets/images/sim_driver_cockpit_1788436981887.jpg';
import simPedestrianImg from '../assets/images/sim_pedestrian_cross_1788436996644.jpg';
import simHighwayImg from '../assets/images/sim_highway_patrol_1788437010365.jpg';
import simTrafficImg from '../assets/images/sim_traffic_signals_1788437036845.jpg';

interface VirtualStreetSimulatorProps {
  avatar: AvatarData;
  playerAlias: string;
  onAddScore: (points: number) => void;
  onNarrate: (text: string) => void;
}

type SimulatorViewMode = 'cockpit' | 'pedestrian' | 'highway' | 'intersection' | 'metropolis_3d';
type GearMode = 'P' | 'R' | 'N' | 'D';
type TurnSignal = 'none' | 'left' | 'right' | 'hazard';

export default function VirtualStreetSimulator({
  avatar,
  playerAlias,
  onAddScore,
  onNarrate,
}: VirtualStreetSimulatorProps) {
  // Simulator View Mode
  const [viewMode, setViewMode] = useState<SimulatorViewMode>('cockpit');

  // Driving & Dynamics
  const [gear, setGear] = useState<GearMode>('D');
  const [speed, setSpeed] = useState<number>(35);
  const [steeringAngle, setSteeringAngle] = useState<number>(0); // -30 to +30 deg
  const [turnSignal, setTurnSignal] = useState<TurnSignal>('none');
  const [isWetAsphalt, setIsWetAsphalt] = useState<boolean>(false);
  const [wipersActive, setWipersActive] = useState<boolean>(false);

  // Environmental and Traffic Conditions
  const [trafficLight, setTrafficLight] = useState<'red' | 'yellow' | 'green'>('green');
  const [pedestrianCrossing, setPedestrianCrossing] = useState<boolean>(false);
  const [isAmbulanceNearby, setIsAmbulanceNearby] = useState<boolean>(false);
  const [yieldedToEmergency, setYieldedToEmergency] = useState<boolean>(false);
  const [zoneType, setZoneType] = useState<'escolar' | 'urbana' | 'autopista'>('urbana');

  // Legal Evaluation and Messages
  const [simMessage, setSimMessage] = useState<string>('Simulación en tiempo real activa. Conduce con atención y respeta la señalización.');
  const [infraction, setInfraction] = useState<string | null>(null);
  const [infractionArticle, setInfractionArticle] = useState<string | null>(null);

  // Speed limits by zone according to Venezuelan Traffic Law (INTT)
  const speedLimits = {
    escolar: 30, // 30 km/h en zonas escolares y residenciales
    urbana: 40,  // 40 km/h en calles y avenidas urbanas
    autopista: 80, // 80 km/h en autopistas y vías rápidas
  };

  const currentLimit = speedLimits[zoneType];

  // Physics Calculations
  // Reaction time: avg 1 second reaction distance = (speed * 1000) / 3600 * 1.0 m
  const reactionDistMeters = Math.round((speed * 1000) / 3600);
  // Braking distance df = v^2 / (2 * friction * g). Dry: mu ~ 0.75; Wet: mu ~ 0.45; g = 9.81
  const frictionCoef = isWetAsphalt ? 0.45 : 0.75;
  const speedMps = (speed * 1000) / 3600;
  const brakingDistMeters = Math.round((speedMps * speedMps) / (2 * frictionCoef * 9.81));
  const totalStoppingDist = reactionDistMeters + brakingDistMeters;

  // Turn signal audio cycle
  useEffect(() => {
    if (turnSignal === 'none') return;
    const interval = setInterval(() => {
      soundManager.playBlinker();
    }, 600);
    return () => clearInterval(interval);
  }, [turnSignal]);

  // Evaluate driving rules & infractions dynamically
  useEffect(() => {
    if (gear === 'P' && speed > 0) {
      setSpeed(0);
    }

    if (speed > currentLimit) {
      const excess = speed - currentLimit;
      setInfraction(`¡Exceso de velocidad (+${excess} km/h)! Límite legal en zona ${zoneType} es ${currentLimit} km/h.`);
      setInfractionArticle('Art. 120 Ley de Transporte Terrestre: Multa de 10 UT por exceder el límite fijado.');
      soundManager.playError();
    } else if (trafficLight === 'red' && speed > 5) {
      setInfraction('¡Infracción Gravísima! Cruzando o circulando con luz ROJA de semáforo.');
      setInfractionArticle('Art. 123 Reglamento de Tránsito: Obligación estricta de detenerse por completo antes de la línea de parada.');
      soundManager.playError();
    } else if (pedestrianCrossing && speed > 10) {
      setInfraction('¡Peligro de Atropello! Peatón en el paso cebra y vehículo sin detenerse.');
      setInfractionArticle('Art. 73 LTT: Preferencia absoluta de paso a peatones en cruces demarcados.');
      soundManager.playError();
    } else if (isAmbulanceNearby && !yieldedToEmergency && speed > 25) {
      setInfraction('¡Obstrucción a Vehículo de Emergencia! Unidad con sirena activa.');
      setInfractionArticle('Art. 85 LTT: Todo conductor debe ceder paso de inmediato orillándose al canal derecho.');
    } else {
      setInfraction(null);
      setInfractionArticle(null);
    }
  }, [speed, currentLimit, trafficLight, isAmbulanceNearby, yieldedToEmergency, pedestrianCrossing, zoneType, gear]);

  // Controls Handlers
  const handleAccelerate = (amount: number = 10) => {
    if (gear === 'P') {
      soundManager.playError();
      setSimMessage('Coloca la marcha en D (Directa) antes de acelerar.');
      return;
    }
    soundManager.playEngineRev();
    setSpeed((prev) => Math.min(prev + amount, zoneType === 'autopista' ? 120 : 70));
    setSimMessage(`Acelerando: +${amount} km/h.`);
  };

  const handleDecelerate = (amount: number = 10) => {
    soundManager.playClick();
    setSpeed((prev) => Math.max(prev - amount, 0));
    setSimMessage(`Reduciendo velocidad: -${amount} km/h.`);
  };

  const handleEmergencyBrake = () => {
    soundManager.playError();
    setSpeed(0);
    setSimMessage('¡Freno de emergencia accionado a fondo! Vehículo detenido por completo.');
  };

  const handleSteer = (direction: 'left' | 'center' | 'right') => {
    soundManager.playClick();
    if (direction === 'left') {
      setSteeringAngle(-22);
      setTurnSignal('left');
    } else if (direction === 'right') {
      setSteeringAngle(22);
      setTurnSignal('right');
    } else {
      setSteeringAngle(0);
      setTurnSignal('none');
    }
  };

  const handleToggleHorn = () => {
    soundManager.playHorn();
    if (zoneType === 'escolar') {
      setSimMessage('Advertencia: El uso del claxon en zonas escolares y hospitalarias está restringido (Art. 133 LTT).');
    } else {
      setSimMessage('Claxon accionado como aviso preventivo reglamentario.');
    }
  };

  const handleCycleTrafficLight = () => {
    soundManager.playClick();
    const cycle: ('green' | 'yellow' | 'red')[] = ['green', 'yellow', 'red'];
    const next = cycle[(cycle.indexOf(trafficLight) + 1) % cycle.length];
    setTrafficLight(next);
  };

  const handleToggleAmbulance = () => {
    soundManager.playSirenChirp();
    const newState = !isAmbulanceNearby;
    setIsAmbulanceNearby(newState);
    setYieldedToEmergency(false);
    if (newState) {
      setSimMessage('🚨 ¡Alerta de emergencia! Sirena de ambulancia en aproximación. Pégate a la derecha.');
    } else {
      setSimMessage('Vía despejada, tráfico normalizado.');
    }
  };

  const handleYieldRight = () => {
    soundManager.playClick();
    soundManager.playCorrect();
    setYieldedToEmergency(true);
    setTurnSignal('right');
    setSteeringAngle(15);
    setSpeed((prev) => Math.min(prev, 15));
    setSimMessage('¡Excelente maniobra preventiva! Te has orillado a la derecha cediendo el paso libre a la ambulancia.');
    onAddScore(35);
  };

  const handleSimulatePedestrianCross = () => {
    soundManager.playLaserScanSound();
    setPedestrianCrossing(true);
    setSimMessage('Peatones cruzando por la calzada cebra. Detén la marcha tras la línea de parada.');

    setTimeout(() => {
      if (speed <= 5) {
        soundManager.playCorrect();
        onAddScore(40);
        setSimMessage('¡Paso peatonal completado con éxito! Prioridad peatonal respetada al 100%.');
      }
      setTimeout(() => setPedestrianCrossing(false), 3500);
    }, 2500);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 rounded-3xl glass-panel border border-cyan-500/30 shadow-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-mono mb-2">
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span>SIMULADOR 3D FOTORREALISTA // INTT VENEZUELA</span>
          </div>
          <h2 className="font-orbitron text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            SIMULADOR 3D CON IMÁGENES REALISTAS & TELEMETRÍA DINÁMICA
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Experimenta la conducción en primera persona y supervisión de calzada con imágenes realistas de alta definición,
            instrumentación HUD activa, cálculo físico de distancia de frenado y verificación de leyes de tránsito en vivo.
          </p>
        </div>

        {/* Audio Guide Button */}
        <button
          id="btn-voice-sim-guide"
          onClick={() => {
            soundManager.playLaserScanSound();
            onNarrate(
              `Simulador 3D en tiempo real, Cadete ${playerAlias}. Alterna entre la cabina de conducción realista, cruces peatonales y autopistas. Vigila la distancia de frenado y respeta el límite legal de ${currentLimit} kilómetros por hora.`
            );
          }}
          className="px-4 py-2.5 rounded-2xl bg-slate-900 border border-white/10 hover:border-cyan-400 text-cyan-300 text-xs font-mono flex items-center gap-2 hover:scale-105 transition-all shadow-lg cursor-pointer"
        >
          <Volume2 className="w-4 h-4 text-cyan-400" />
          <span>Guía de Audio INTT</span>
        </button>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          id="tab-view-cockpit"
          onClick={() => {
            soundManager.playClick();
            setViewMode('cockpit');
          }}
          className={`px-4 py-2 rounded-2xl font-orbitron text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
            viewMode === 'cockpit'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-lg shadow-cyan-500/30 scale-[1.02]'
              : 'bg-slate-900/80 text-slate-300 hover:text-white border border-white/10'
          }`}
        >
          <Car className="w-4 h-4" />
          <span>Cabina 3D Realista (1ª Persona)</span>
        </button>

        <button
          id="tab-view-pedestrian"
          onClick={() => {
            soundManager.playClick();
            setViewMode('pedestrian');
            setZoneType('escolar');
          }}
          className={`px-4 py-2 rounded-2xl font-orbitron text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
            viewMode === 'pedestrian'
              ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 shadow-lg shadow-amber-500/30 scale-[1.02]'
              : 'bg-slate-900/80 text-slate-300 hover:text-white border border-white/10'
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>Cruce Peatonal & Zona Escolar</span>
        </button>

        <button
          id="tab-view-highway"
          onClick={() => {
            soundManager.playClick();
            setViewMode('highway');
            setZoneType('autopista');
          }}
          className={`px-4 py-2 rounded-2xl font-orbitron text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
            viewMode === 'highway'
              ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 shadow-lg shadow-emerald-500/30 scale-[1.02]'
              : 'bg-slate-900/80 text-slate-300 hover:text-white border border-white/10'
          }`}
        >
          <Navigation className="w-4 h-4" />
          <span>Autopista & Control Policial</span>
        </button>

        <button
          id="tab-view-intersection"
          onClick={() => {
            soundManager.playClick();
            setViewMode('intersection');
            setZoneType('urbana');
          }}
          className={`px-4 py-2 rounded-2xl font-orbitron text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
            viewMode === 'intersection'
              ? 'bg-gradient-to-r from-fuchsia-500 to-pink-600 text-slate-950 shadow-lg shadow-fuchsia-500/30 scale-[1.02]'
              : 'bg-slate-900/80 text-slate-300 hover:text-white border border-white/10'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Intersección Semaforizada</span>
        </button>

        <button
          id="tab-view-metropolis"
          onClick={() => {
            soundManager.playClick();
            setViewMode('metropolis_3d');
          }}
          className={`px-4 py-2 rounded-2xl font-orbitron text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
            viewMode === 'metropolis_3d'
              ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg shadow-purple-500/30 scale-[1.02]'
              : 'bg-slate-900/80 text-slate-300 hover:text-white border border-white/10'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Metrópolis 3D Espacial</span>
        </button>
      </div>

      {/* Main Grid: Visualizer & Interactive Telemetry Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Realistic 3D Simulation Stage (Viewport) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative w-full h-[400px] sm:h-[480px] rounded-3xl overflow-hidden glass-card border border-cyan-500/30 shadow-2xl bg-slate-950 select-none">
            {/* VIEW MODE 1: Photorealistic Driver Cockpit (1st Person POV) */}
            {viewMode === 'cockpit' && (
              <div className="relative w-full h-full">
                {/* Background Realistic Driving Image */}
                <img
                  src={simCockpitImg}
                  alt="Vista de cabina 3D realista de conductor"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center filter brightness-95"
                />

                {/* Rain / Wet overlay if active */}
                {isWetAsphalt && (
                  <div className="absolute inset-0 bg-cyan-950/20 backdrop-blur-[0.5px] pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 to-slate-950/40" />
                  </div>
                )}

                {/* Animated Wiper Sweep */}
                {wipersActive && (
                  <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-48 h-1 bg-cyan-200/40 rounded-full animate-spin origin-bottom pointer-events-none" />
                )}

                {/* Heads-Up Display (HUD) Glass Projected on Windshield */}
                <div className="absolute top-4 left-4 right-4 flex items-start justify-between pointer-events-none">
                  {/* Digital HUD Left: Speed & Limit */}
                  <div className="p-3 rounded-2xl bg-slate-950/80 backdrop-blur-md border border-cyan-500/40 shadow-xl space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                      <span className="text-[10px] font-mono text-cyan-300 uppercase tracking-wider font-bold">
                        HUD VIAL INTT // ACTIVO
                      </span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className={`text-3xl font-orbitron font-extrabold ${speed > currentLimit ? 'text-rose-400 animate-pulse' : 'text-white'}`}>
                        {speed}
                      </span>
                      <span className="text-xs font-mono text-cyan-400 font-bold">KM/H</span>
                      <span className="text-xs font-mono text-slate-400">| Límite:</span>
                      <span className="text-xs font-mono font-bold text-amber-300">{currentLimit}</span>
                    </div>
                  </div>

                  {/* AR Traffic Signal Display on Windshield */}
                  <div className="p-2.5 rounded-2xl bg-slate-950/85 backdrop-blur-md border border-white/20 shadow-xl flex items-center gap-3">
                    <div className="flex flex-col gap-1 items-center bg-black/60 p-1.5 rounded-xl border border-white/10">
                      <span className={`w-3.5 h-3.5 rounded-full transition-all ${trafficLight === 'red' ? 'bg-rose-500 shadow-lg shadow-rose-500 ring-2 ring-rose-200 scale-110' : 'bg-rose-950/60'}`} />
                      <span className={`w-3.5 h-3.5 rounded-full transition-all ${trafficLight === 'yellow' ? 'bg-amber-400 shadow-lg shadow-amber-400 ring-2 ring-amber-200 scale-110' : 'bg-amber-950/60'}`} />
                      <span className={`w-3.5 h-3.5 rounded-full transition-all ${trafficLight === 'green' ? 'bg-emerald-400 shadow-lg shadow-emerald-400 ring-2 ring-emerald-200 scale-110' : 'bg-emerald-950/60'}`} />
                    </div>
                    <div className="text-right pr-1">
                      <span className="text-[9px] font-mono text-slate-400 block uppercase">SEÑAL DE VÍA</span>
                      <span className={`text-xs font-orbitron font-extrabold uppercase ${
                        trafficLight === 'red' ? 'text-rose-400' : trafficLight === 'yellow' ? 'text-amber-400' : 'text-emerald-400'
                      }`}>
                        {trafficLight === 'red' ? 'ALTO' : trafficLight === 'yellow' ? 'PRECAUCIÓN' : 'PASO LIBRE'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Emergency Siren Alert Banner Over Windshield */}
                {isAmbulanceNearby && (
                  <div className="absolute top-24 left-4 right-4 p-3 rounded-2xl bg-rose-950/90 border border-rose-500/80 shadow-2xl backdrop-blur-md flex items-center justify-between gap-3 animate-pulse">
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 animate-bounce" />
                      <div>
                        <div className="text-xs font-orbitron font-bold text-rose-200">
                          🚨 AMBULANCIA APROXIMÁNDOSE POR CANAL IZQUIERDO
                        </div>
                        <div className="text-[11px] text-slate-300">
                          Oríllate a la derecha y reduce la velocidad de inmediato (Art. 85 LTT).
                        </div>
                      </div>
                    </div>
                    {!yieldedToEmergency && (
                      <button
                        id="btn-hud-yield-right"
                        onClick={handleYieldRight}
                        className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-orbitron font-extrabold text-xs shadow-lg hover:scale-105 transition-all cursor-pointer shrink-0"
                      >
                        ORILLARSE
                      </button>
                    )}
                  </div>
                )}

                {/* Pedestrian Crossing Alert Banner */}
                {pedestrianCrossing && (
                  <div className="absolute bottom-28 left-4 right-4 p-3 rounded-2xl bg-amber-950/90 border border-amber-500/80 shadow-2xl backdrop-blur-md flex items-center gap-3 animate-fadeIn">
                    <Eye className="w-5 h-5 text-amber-400 shrink-0" />
                    <div>
                      <div className="text-xs font-orbitron font-bold text-amber-200">
                        🚸 PEATONES CRUZANDO EL PASO CEBRA
                      </div>
                      <div className="text-[11px] text-slate-300">
                        Velocidad actual: {speed} km/h. Detén el vehículo tras la línea blanca.
                      </div>
                    </div>
                  </div>
                )}

                {/* Steering Wheel Reactive Overlay at Bottom */}
                <div
                  className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-64 h-36 flex items-center justify-center transition-transform duration-300 pointer-events-none"
                  style={{ transform: `translateX(-50%) rotate(${steeringAngle}deg)` }}
                >
                  <div className="w-48 h-48 rounded-full border-8 border-slate-900/90 shadow-2xl flex items-center justify-center relative bg-gradient-to-b from-slate-800/60 to-black/80">
                    <div className="w-16 h-16 rounded-full bg-slate-950 border-2 border-cyan-400/60 flex items-center justify-center shadow-inner">
                      <Shield className="w-8 h-8 text-cyan-400" />
                    </div>
                    {/* Horizontal Steering Spokes */}
                    <div className="absolute top-1/2 left-2 right-2 h-3.5 bg-slate-900 rounded -translate-y-1/2" />
                    <div className="absolute bottom-2 left-1/2 w-3.5 h-16 bg-slate-900 rounded -translate-x-1/2" />
                  </div>
                </div>

                {/* Turn Signals Arrows Blinking in Cockpit */}
                <div className="absolute bottom-4 left-6 flex items-center gap-1.5">
                  <div
                    className={`p-2 rounded-xl border transition-all ${
                      turnSignal === 'left' || turnSignal === 'hazard'
                        ? 'bg-emerald-500 text-slate-950 border-emerald-300 animate-pulse font-bold'
                        : 'bg-slate-950/80 text-slate-600 border-white/10'
                    }`}
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </div>
                  <div
                    className={`p-2 rounded-xl border transition-all ${
                      turnSignal === 'right' || turnSignal === 'hazard'
                        ? 'bg-emerald-500 text-slate-950 border-emerald-300 animate-pulse font-bold'
                        : 'bg-slate-950/80 text-slate-600 border-white/10'
                    }`}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>

                {/* Gear Indicator on Cockpit Bottom Right */}
                <div className="absolute bottom-4 right-6 flex items-center gap-1 p-1 rounded-xl bg-slate-950/85 backdrop-blur-md border border-white/20">
                  {(['P', 'R', 'N', 'D'] as GearMode[]).map((g) => (
                    <button
                      key={g}
                      id={`btn-gear-hud-${g}`}
                      onClick={() => {
                        soundManager.playClick();
                        setGear(g);
                        if (g === 'P') setSpeed(0);
                      }}
                      className={`px-2.5 py-1 text-xs font-orbitron font-extrabold rounded-lg transition-all cursor-pointer ${
                        gear === g
                          ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/40'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* VIEW MODE 2: Photorealistic Pedestrian Crosswalk & School Zone */}
            {viewMode === 'pedestrian' && (
              <div className="relative w-full h-full">
                <img
                  src={simPedestrianImg}
                  alt="Vista fotorrealista de paso peatonal cebra y zona escolar"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center"
                />

                {/* Dynamic Zebra Crossing Zone Target Box */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/40 pointer-events-none" />

                {/* Overlay Badge Top Left */}
                <div className="absolute top-4 left-4 p-3 rounded-2xl bg-slate-950/85 backdrop-blur-md border border-amber-500/40 shadow-xl space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                    <span className="text-[10px] font-mono text-amber-300 uppercase font-bold">
                      ZONA ESCOLAR // CRUCE PEATONAL CEBRA
                    </span>
                  </div>
                  <div className="text-xs text-slate-200">
                    Límite obligatorio: <span className="font-orbitron font-bold text-amber-300">30 KM/H</span> (Art. 120 LTT)
                  </div>
                </div>

                {/* Live Pedestrian Status Indicator */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/90 backdrop-blur-md border border-white/15">
                  <div className="flex items-center gap-2.5">
                    <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-mono text-slate-200">
                      Estado: {pedestrianCrossing ? '¡Peatón cruzando por la cebra!' : 'Calzada despejada'}
                    </span>
                  </div>
                  <button
                    id="btn-trigger-cross-pedestrian"
                    onClick={handleSimulatePedestrianCross}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 font-orbitron font-bold text-xs shadow-md hover:scale-105 transition-all cursor-pointer"
                  >
                    SIMULAR CRUCE DE PEATÓN
                  </button>
                </div>
              </div>
            )}

            {/* VIEW MODE 3: Photorealistic Highway & INTT Patrol */}
            {viewMode === 'highway' && (
              <div className="relative w-full h-full">
                <img
                  src={simHighwayImg}
                  alt="Vista fotorrealista de autopista y control vial INTT"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30 pointer-events-none" />

                {/* Overlay Badge Top Left */}
                <div className="absolute top-4 left-4 p-3 rounded-2xl bg-slate-950/85 backdrop-blur-md border border-emerald-500/40 shadow-xl space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-[10px] font-mono text-emerald-300 uppercase font-bold">
                      CORREDOR DE AUTOPISTA // CONTROL VIAL INTT
                    </span>
                  </div>
                  <div className="text-xs text-slate-200">
                    Velocidad máxima reglamentaria: <span className="font-orbitron font-bold text-emerald-300">80 KM/H</span>
                  </div>
                </div>

                {/* Highway Telemetry Bottom Bar */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/90 backdrop-blur-md border border-white/15">
                  <div className="text-xs font-mono text-slate-200">
                    Distancia de Frenado Estimada a {speed} km/h:{' '}
                    <span className="font-bold text-cyan-400">{brakingDistMeters} metros</span>
                  </div>
                  <button
                    id="btn-toggle-ambulance-highway"
                    onClick={handleToggleAmbulance}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 text-white font-orbitron font-bold text-xs shadow-md hover:scale-105 transition-all cursor-pointer"
                  >
                    {isAmbulanceNearby ? '🚨 Desactivar Sirena' : '🚨 Simular Sirena de Emergencia'}
                  </button>
                </div>
              </div>
            )}

            {/* VIEW MODE 4: Photorealistic Traffic Signals Intersection */}
            {viewMode === 'intersection' && (
              <div className="relative w-full h-full">
                <img
                  src={simTrafficImg}
                  alt="Vista fotorrealista de intersección semaforizada con asfalto reflectante"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30 pointer-events-none" />

                {/* Live Traffic Light Controls Overlay */}
                <div className="absolute top-4 left-4 p-3.5 rounded-2xl bg-slate-950/85 backdrop-blur-md border border-fuchsia-500/40 shadow-xl space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-fuchsia-400 animate-ping" />
                    <span className="text-[10px] font-mono text-fuchsia-300 uppercase font-bold">
                      SEMAFORIZACIÓN INTELIGENTE
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      id="btn-inter-light-red"
                      onClick={() => setTrafficLight('red')}
                      className={`px-3 py-1 rounded-lg text-xs font-mono font-bold cursor-pointer transition-all ${
                        trafficLight === 'red' ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/50' : 'bg-slate-900 text-slate-400'
                      }`}
                    >
                      ROJO (ALTO)
                    </button>
                    <button
                      id="btn-inter-light-yellow"
                      onClick={() => setTrafficLight('yellow')}
                      className={`px-3 py-1 rounded-lg text-xs font-mono font-bold cursor-pointer transition-all ${
                        trafficLight === 'yellow' ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/50' : 'bg-slate-900 text-slate-400'
                      }`}
                    >
                      AMARILLO
                    </button>
                    <button
                      id="btn-inter-light-green"
                      onClick={() => setTrafficLight('green')}
                      className={`px-3 py-1 rounded-lg text-xs font-mono font-bold cursor-pointer transition-all ${
                        trafficLight === 'green' ? 'bg-emerald-400 text-black shadow-lg shadow-emerald-400/50' : 'bg-slate-900 text-slate-400'
                      }`}
                    >
                      VERDE (PASO)
                    </button>
                  </div>
                </div>

                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/90 backdrop-blur-md border border-white/15">
                  <span className="text-xs font-mono text-slate-300">
                    Cruce de Intersección: Asegúrate de desacelerar antes de entrar al cruce.
                  </span>
                  <button
                    id="btn-cycle-intersection-light"
                    onClick={handleCycleTrafficLight}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-fuchsia-500 to-pink-600 text-slate-950 font-orbitron font-bold text-xs shadow-md hover:scale-105 transition-all cursor-pointer"
                  >
                    CICLAR SEMÁFORO
                  </button>
                </div>
              </div>
            )}

            {/* VIEW MODE 5: 3D Spatial Metropolis (Three.js WebGL / Canvas 2D) */}
            {viewMode === 'metropolis_3d' && (
              <ThreeMetropolisView
                avatar={avatar}
                sceneMode="checkpoint_inspection"
                heightClass="h-full"
                interactiveControls={true}
              />
            )}
          </div>

          {/* Real-time Telemetry & Physics Monitor Panel */}
          <div className="p-4 sm:p-5 rounded-3xl glass-card border border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {/* Speed Gauge */}
            <div className="p-3 rounded-2xl bg-slate-900/90 border border-white/5 space-y-1">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">Velocidad de Marcha</span>
              <div className="flex items-baseline gap-1.5">
                <span className={`text-2xl font-orbitron font-extrabold ${speed > currentLimit ? 'text-rose-400 animate-pulse' : 'text-cyan-400'}`}>
                  {speed}
                </span>
                <span className="text-xs font-mono text-slate-400">km/h</span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                Límite: <span className="text-amber-300 font-bold">{currentLimit} km/h</span>
              </div>
            </div>

            {/* Stopping Distance */}
            <div className="p-3 rounded-2xl bg-slate-900/90 border border-white/5 space-y-1">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">Distancia de Parada Total</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-orbitron font-extrabold text-amber-300">
                  {totalStoppingDist}
                </span>
                <span className="text-xs font-mono text-slate-400">metros</span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                Reacción: {reactionDistMeters}m | Frenos: {brakingDistMeters}m
              </div>
            </div>

            {/* Traffic Light State */}
            <div className="p-3 rounded-2xl bg-slate-900/90 border border-white/5 space-y-1">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">Fase de Semáforo</span>
              <div className="flex items-center gap-2">
                <span className={`w-3.5 h-3.5 rounded-full ${
                  trafficLight === 'red' ? 'bg-rose-500 shadow-md shadow-rose-500 ring-2 ring-rose-200' :
                  trafficLight === 'yellow' ? 'bg-amber-400 shadow-md shadow-amber-400 ring-2 ring-amber-200' :
                  'bg-emerald-400 shadow-md shadow-emerald-400 ring-2 ring-emerald-200'
                }`} />
                <span className="text-base font-orbitron font-extrabold uppercase text-white">
                  {trafficLight}
                </span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                Prioridad: {trafficLight === 'green' ? 'Vehicular' : 'Peatonal/Alto'}
              </div>
            </div>

            {/* Weather & Road Grip */}
            <div className="p-3 rounded-2xl bg-slate-900/90 border border-white/5 space-y-1">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">Adherencia de Asfalto</span>
              <div className="flex items-center gap-2">
                {isWetAsphalt ? (
                  <CloudRain className="w-5 h-5 text-cyan-400" />
                ) : (
                  <Sun className="w-5 h-5 text-amber-400" />
                )}
                <span className="text-sm font-orbitron font-bold text-white">
                  {isWetAsphalt ? 'Mojado (-40%)' : 'Seco (Óptimo)'}
                </span>
              </div>
              <button
                id="btn-toggle-weather-simulator"
                onClick={() => {
                  soundManager.playClick();
                  setIsWetAsphalt(!isWetAsphalt);
                  setWipersActive(!isWetAsphalt);
                }}
                className="text-[10px] font-mono text-cyan-400 hover:text-cyan-300 underline cursor-pointer"
              >
                Cambiar a {isWetAsphalt ? 'Asfalto Seco' : 'Lluvia/Mojado'}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Driving Console & Pedals */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-3xl glass-panel border border-white/10 shadow-2xl space-y-5 bg-slate-950/90">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="font-orbitron font-extrabold text-base text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-cyan-400" />
                <span>MANDOS DE CONDUCCIÓN REALISTA</span>
              </h3>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-lg">
                MODO VIRTUAL EN VIVO
              </span>
            </div>

            {/* Zone Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300 block">Zona y Calzada Legal:</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  id="btn-zone-escolar"
                  onClick={() => {
                    soundManager.playClick();
                    setZoneType('escolar');
                    if (viewMode === 'highway') setViewMode('pedestrian');
                  }}
                  className={`py-2 px-2 text-xs font-mono rounded-xl border transition-all cursor-pointer ${
                    zoneType === 'escolar'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-400 font-bold shadow-md shadow-amber-500/20'
                      : 'bg-slate-900 text-slate-400 border-white/5 hover:text-white'
                  }`}
                >
                  Escolar (30)
                </button>
                <button
                  id="btn-zone-urbana"
                  onClick={() => {
                    soundManager.playClick();
                    setZoneType('urbana');
                  }}
                  className={`py-2 px-2 text-xs font-mono rounded-xl border transition-all cursor-pointer ${
                    zoneType === 'urbana'
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 font-bold shadow-md shadow-cyan-500/20'
                      : 'bg-slate-900 text-slate-400 border-white/5 hover:text-white'
                  }`}
                >
                  Urbana (40)
                </button>
                <button
                  id="btn-zone-autopista"
                  onClick={() => {
                    soundManager.playClick();
                    setZoneType('autopista');
                    if (viewMode === 'pedestrian') setViewMode('highway');
                  }}
                  className={`py-2 px-2 text-xs font-mono rounded-xl border transition-all cursor-pointer ${
                    zoneType === 'autopista'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400 font-bold shadow-md shadow-emerald-500/20'
                      : 'bg-slate-900 text-slate-400 border-white/5 hover:text-white'
                  }`}
                >
                  Autopista (80)
                </button>
              </div>
            </div>

            {/* Accelerator & Brake Pedals Simulator */}
            <div className="space-y-3 p-4 rounded-2xl bg-slate-900/80 border border-white/10">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300">Acelerador y Control de Potencia:</span>
                <span className="text-cyan-400 font-bold">{speed} km/h</span>
              </div>

              <input
                id="range-speed-slider"
                type="range"
                min={0}
                max={zoneType === 'autopista' ? 120 : 70}
                step={5}
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />

              <div className="grid grid-cols-3 gap-2 pt-1">
                <button
                  id="btn-accel-plus-10"
                  onClick={() => handleAccelerate(10)}
                  className="py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-xs font-mono text-cyan-300 font-bold transition-all cursor-pointer"
                >
                  +10 km/h
                </button>
                <button
                  id="btn-decel-minus-10"
                  onClick={() => handleDecelerate(10)}
                  className="py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-xs font-mono text-amber-300 font-bold transition-all cursor-pointer"
                >
                  -10 km/h
                </button>
                <button
                  id="btn-brake-emergency-full"
                  onClick={handleEmergencyBrake}
                  className="py-2.5 rounded-xl bg-rose-950/70 hover:bg-rose-900 border border-rose-500/50 text-xs font-mono text-rose-200 font-extrabold transition-all cursor-pointer shadow-lg"
                >
                  FRENAR (0)
                </button>
              </div>
            </div>

            {/* Steering Wheel & Direction Controls */}
            <div className="space-y-2 p-4 rounded-2xl bg-slate-900/80 border border-white/10">
              <span className="text-xs font-mono text-slate-300 block">Maniobra de Dirección (Volante):</span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  id="btn-steer-left"
                  onClick={() => handleSteer('left')}
                  className={`py-2 px-2 text-xs font-mono rounded-xl border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    steeringAngle < 0 ? 'bg-cyan-500/30 text-cyan-300 border-cyan-400 font-bold' : 'bg-slate-950 text-slate-400 border-white/5'
                  }`}
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Izquierda</span>
                </button>

                <button
                  id="btn-steer-center"
                  onClick={() => handleSteer('center')}
                  className={`py-2 px-2 text-xs font-mono rounded-xl border transition-all cursor-pointer ${
                    steeringAngle === 0 ? 'bg-cyan-500/30 text-cyan-300 border-cyan-400 font-bold' : 'bg-slate-950 text-slate-400 border-white/5'
                  }`}
                >
                  Centrado
                </button>

                <button
                  id="btn-steer-right"
                  onClick={() => handleSteer('right')}
                  className={`py-2 px-2 text-xs font-mono rounded-xl border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    steeringAngle > 0 ? 'bg-cyan-500/30 text-cyan-300 border-cyan-400 font-bold' : 'bg-slate-950 text-slate-400 border-white/5'
                  }`}
                >
                  <span>Derecha</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Special Vehicle Actions: Horn, Blinkers & Hazard */}
            <div className="grid grid-cols-2 gap-2">
              <button
                id="btn-horn-vehicle"
                onClick={handleToggleHorn}
                className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-xs font-mono text-slate-200 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Volume2 className="w-4 h-4 text-cyan-400" />
                <span>Tocar Claxon (Bocina)</span>
              </button>

              <button
                id="btn-hazard-lights"
                onClick={() => {
                  soundManager.playClick();
                  setTurnSignal(turnSignal === 'hazard' ? 'none' : 'hazard');
                }}
                className={`py-2.5 px-3 rounded-xl border text-xs font-mono flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  turnSignal === 'hazard'
                    ? 'bg-amber-500/30 text-amber-300 border-amber-400 font-bold animate-pulse'
                    : 'bg-slate-900 hover:bg-slate-800 border-white/10 text-slate-300'
                }`}
              >
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Intermitentes Baliza</span>
              </button>
            </div>

            {/* Infraction or Compliance Monitor */}
            {infraction ? (
              <div className="p-4 rounded-2xl bg-rose-950/80 border border-rose-500/80 text-rose-200 space-y-1.5 animate-fadeIn shadow-2xl">
                <div className="flex items-center gap-2 text-xs font-mono font-extrabold text-rose-300">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 animate-bounce" />
                  <span>INFRACCIÓN REGISTRADA EN TELEMETRÍA // INTT</span>
                </div>
                <p className="text-xs leading-relaxed font-semibold">{infraction}</p>
                {infractionArticle && (
                  <p className="text-[11px] text-amber-300 font-mono bg-black/40 p-2 rounded-lg border border-amber-500/20">
                    ⚖️ {infractionArticle}
                  </p>
                )}
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-200 space-y-1">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-300">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>CONDUCCIÓN REGLAMENTARIA</span>
                </div>
                <p className="text-xs leading-relaxed">{simMessage}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
