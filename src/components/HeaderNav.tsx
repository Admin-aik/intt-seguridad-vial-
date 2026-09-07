import {
  Volume2,
  VolumeX,
  Shield,
  Award,
  Flame,
  Terminal,
  Play,
  Square,
  Compass,
  BookOpen,
  UserCheck,
  LogIn,
  LogOut,
  Car,
  FileText,
} from 'lucide-react';
import { GameHUD, ScreenType } from '../types';
import { soundManager } from '../utils/soundAndTTS';

interface HeaderNavProps {
  hud: GameHUD;
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  isTtsSpeaking: boolean;
  onToggleTts: () => void;
  isAudioMuted: boolean;
  onToggleMute: () => void;
  onOpenJsonModal: () => void;
}

export default function HeaderNav({
  hud,
  currentScreen,
  onNavigate,
  isTtsSpeaking,
  onToggleTts,
  isAudioMuted,
  onToggleMute,
  onOpenJsonModal,
}: HeaderNavProps) {
  const isPortada = currentScreen === 'PORTADA';

  return (
    <header className="sticky top-0 z-50 w-full shadow-lg border-b border-blue-200/80 bg-white">
      {/* Official Venezuelan Tricolor Ribbon */}
      <div className="w-full h-1.5 bg-gradient-to-r from-amber-400 via-blue-600 to-red-600" />

      {/* Main Institutional Bar */}
      <div className="bg-gradient-to-r from-[#002f5e] via-[#004884] to-[#0369a1] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
          {/* INTT Brand & Title */}
          <div
            className="flex items-center gap-3 cursor-pointer select-none"
            onClick={() => onNavigate('PORTADA')}
            title="Ir al Portal INTT"
          >
            {/* INTT Emblem Emblematic Badge */}
            <div className="w-10 h-10 rounded-xl bg-white p-1 shadow-md shadow-blue-950/30 flex items-center justify-center shrink-0 border-2 border-blue-200">
              <Shield className="w-6 h-6 text-[#004884] fill-[#004884]/15" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-orbitron font-extrabold text-base tracking-wider text-white">
                  INTT RUTA SEGURA
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-amber-400 text-blue-950 shadow-sm">
                  15 MISIONES
                </span>
              </div>
              <p className="text-[11px] text-blue-100/90 font-medium tracking-tight">
                Instituto Nacional de Transporte Terrestre • Venezuela
              </p>
            </div>
          </div>

          {/* Quick HUD Metrics (Shown if inside app) */}
          {!isPortada && (
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              {/* Cadet & Rank */}
              <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-xs">
                <span className="text-blue-100">Cadete:</span>
                <span className="font-bold text-amber-300 font-mono">{hud.player_alias}</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-white/20 text-white">
                  {hud.nivel_patrullero}
                </span>
              </div>

              {/* Safety Points */}
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-400/20 border border-amber-300/40 text-xs text-amber-200 font-mono shadow-sm">
                <Award className="w-4 h-4 text-amber-300" />
                <span className="text-white font-medium">Puntos:</span>
                <span className="font-bold text-amber-300 text-sm">{hud.puntos_seguridad}</span>
                <span className="text-[10px] text-amber-200">/ 1500 PTS</span>
              </div>

              {/* Streak */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 border border-white/15 text-xs text-blue-100">
                <Flame className="w-3.5 h-3.5 text-orange-400" />
                <span>Racha:</span>
                <span className="font-bold text-white font-mono">{hud.racha_aciertos}</span>
              </div>
            </div>
          )}

          {/* Audio TTS Controls & Utility */}
          <div className="flex items-center gap-1.5">
            {/* Audio Voice Narration Toggle */}
            <button
              id="btn-toggle-tts-audio"
              onClick={onToggleTts}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
                isTtsSpeaking
                  ? 'bg-amber-400 text-blue-950 font-bold animate-pulse'
                  : 'bg-white/15 hover:bg-white/25 text-white border border-white/20'
              }`}
              title={isTtsSpeaking ? 'Pausar Narrador TTS' : 'Activar Narración en Voz (Español Latino)'}
            >
              {isTtsSpeaking ? <Square className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span className="hidden sm:inline">{isTtsSpeaking ? 'Voz Activa' : 'Narrador'}</span>
            </button>

            {/* Mute Button */}
            <button
              id="btn-toggle-mute"
              onClick={onToggleMute}
              className={`p-2 rounded-lg text-white transition-all cursor-pointer ${
                isAudioMuted ? 'text-red-300 bg-red-900/60' : 'bg-white/15 hover:bg-white/25'
              }`}
              title={isAudioMuted ? 'Activar Sonidos' : 'Silenciar Sonidos'}
            >
              {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Telemetry JSON Modal Trigger */}
            <button
              id="btn-open-telemetry-json"
              onClick={onOpenJsonModal}
              className="px-2.5 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-blue-100 hover:text-white text-xs font-mono flex items-center gap-1 border border-white/15 cursor-pointer"
              title="Ver Telemetría JSON"
            >
              <Terminal className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden md:inline">JSON</span>
            </button>

            {/* Logout / Switch Cadet (Only visible when logged in inside the app) */}
            {!isPortada && (
              <button
                id="btn-nav-logout-portada"
                onClick={() => {
                  soundManager.playClick();
                  onNavigate('PORTADA');
                }}
                className="ml-1 px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-200 hover:text-white text-xs font-semibold flex items-center gap-1.5 border border-red-400/30 transition-all cursor-pointer"
                title="Cerrar Sesión y Volver a Portada"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Cerrar Sesión</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Lower Navigation Tabs: ONLY DISPLAYED WHEN LOGGED IN / OUTSIDE PORTADA */}
      {!isPortada && (
        <div className="bg-blue-50/70 border-t border-blue-100 px-4 sm:px-6 py-2">
          <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto gap-2 scrollbar-none">
            <nav className="flex items-center gap-2 min-w-max">
              {/* Tab 1: 15 Misiones Viales */}
              <button
                id="nav-tab-gameplay"
                onClick={() => {
                  soundManager.playClick();
                  onNavigate('GAMEPLAY');
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  currentScreen === 'GAMEPLAY'
                    ? 'bg-[#004884] text-white shadow-md shadow-blue-900/20 ring-2 ring-blue-300'
                    : 'bg-white hover:bg-blue-100/80 text-blue-900 border border-blue-200'
                }`}
              >
                <Award className="w-4 h-4" />
                <span>15 Misiones Viales (LTT)</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-400 text-blue-950">
                  15 Cap
                </span>
              </button>

              {/* Tab 2: Simulador 3D Realista */}
              <button
                id="nav-tab-simulator"
                onClick={() => {
                  soundManager.playClick();
                  onNavigate('VIRTUAL_STREET_SIM');
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  currentScreen === 'VIRTUAL_STREET_SIM'
                    ? 'bg-[#004884] text-white shadow-md shadow-blue-900/20 ring-2 ring-blue-300'
                    : 'bg-white hover:bg-blue-100/80 text-blue-900 border border-blue-200'
                }`}
              >
                <Compass className="w-4 h-4 text-emerald-600" />
                <span>Simulador 3D Realista</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
                  HD
                </span>
              </button>

              {/* Tab 3: Compendio Legal & Señales INTT */}
              <button
                id="nav-tab-rules"
                onClick={() => {
                  soundManager.playClick();
                  onNavigate('INTT_RULES_HUB');
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  currentScreen === 'INTT_RULES_HUB'
                    ? 'bg-[#004884] text-white shadow-md shadow-blue-900/20 ring-2 ring-blue-300'
                    : 'bg-white hover:bg-blue-100/80 text-blue-900 border border-blue-200'
                }`}
              >
                <BookOpen className="w-4 h-4 text-amber-600" />
                <span>Normas & Señales INTT</span>
              </button>

              {/* Tab 4: Licencia & Perfil */}
              <button
                id="nav-tab-summary"
                onClick={() => {
                  soundManager.playClick();
                  onNavigate('SUMMARY');
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  currentScreen === 'SUMMARY'
                    ? 'bg-[#004884] text-white shadow-md shadow-blue-900/20 ring-2 ring-blue-300'
                    : 'bg-white hover:bg-blue-100/80 text-blue-900 border border-blue-200'
                }`}
              >
                <UserCheck className="w-4 h-4 text-purple-600" />
                <span>Licencia & Credencial</span>
              </button>
            </nav>

            <div className="text-[11px] font-mono text-blue-800/80 font-semibold hidden md:block">
              SISTEMA VIAL DIGITAL // INTT VENEZUELA
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
