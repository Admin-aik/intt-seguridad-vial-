import { useState } from 'react';
import {
  Shield,
  Sparkles,
  Volume2,
  ArrowRight,
  CheckCircle2,
  User,
  Zap,
  Activity,
  LogIn,
  Fingerprint,
  Radio,
  Compass,
  BookOpen,
  Award,
  Check,
  ShieldCheck,
  IdCard,
} from 'lucide-react';
import { AvatarData, AvatarId } from '../types';
import { AVATARS } from '../data/avatars';
import ThreeMetropolisView from './ThreeMetropolisView';
import SeguritoWelcomeVideo from './SeguritoWelcomeVideo';
import { soundManager } from '../utils/soundAndTTS';

interface AvatarSelectionScreenProps {
  selectedAvatarId: AvatarId;
  playerAlias: string;
  onSelectAvatar: (avatarId: AvatarId) => void;
  onUpdateAlias: (alias: string) => void;
  onStartGame: () => void;
  onPlayQuote: (quote: string) => void;
}

export default function AvatarSelectionScreen({
  selectedAvatarId,
  playerAlias,
  onSelectAvatar,
  onUpdateAlias,
  onStartGame,
  onPlayQuote,
}: AvatarSelectionScreenProps) {
  const currentAvatar = AVATARS.find((a) => a.id === selectedAvatarId) || AVATARS[0];
  const [aliasDraft, setAliasDraft] = useState(playerAlias);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false);

  const handleAliasBlur = () => {
    if (aliasDraft.trim()) {
      onUpdateAlias(aliasDraft.trim());
    } else {
      const defaultName = currentAvatar.name.split(' ')[0];
      setAliasDraft(defaultName);
      onUpdateAlias(defaultName);
    }
  };

  const handleQuickLoginWithAvatar = (avatar: AvatarData) => {
    onSelectAvatar(avatar.id);
    const firstName = avatar.name.split(' ')[0];
    setAliasDraft(firstName);
    onUpdateAlias(firstName);
    handleInitiateLogin(avatar.audio_quote);
  };

  const handleInitiateLogin = (quoteToSpeak?: string) => {
    setIsAuthenticating(true);
    soundManager.playLaserScanSound();

    setTimeout(() => {
      setAuthSuccess(true);
      soundManager.playLevelUp();
      if (quoteToSpeak) {
        onPlayQuote(quoteToSpeak);
      }

      setTimeout(() => {
        setIsAuthenticating(false);
        setAuthSuccess(false);
        onStartGame();
      }, 700);
    }, 600);
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Animated Video Player with Segurito Welcoming to the Portal */}
      <SeguritoWelcomeVideo
        playerAlias={playerAlias}
        onStartGame={() => handleInitiateLogin(currentAvatar.audio_quote)}
      />

      {/* Official INTT Welcome Hero Banner - Light Institutional Style */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-10 bg-white border-2 border-blue-200 shadow-xl shadow-blue-900/5">
        {/* Tricolor decorative top stripe */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-400 via-blue-600 to-red-600" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pt-2">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#004884] text-xs font-bold font-mono">
              <ShieldCheck className="w-4 h-4 text-[#004884]" />
              <span>PORTAL OFICIAL DE LOGUEO Y ACCESO // INTT VENEZUELA</span>
            </div>

            <h1 className="font-orbitron text-2xl sm:text-4xl font-extrabold tracking-tight text-[#003366] leading-tight">
              PORTADA DE ACCESO & SELECCIÓN DE CADETE
            </h1>

            <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
              Inicia sesión seleccionando tu perfil de usuario para ingresar al{' '}
              <strong className="text-[#004884]">Sistema Digital de Educación y Seguridad Vial</strong>. Supera las{' '}
              <span className="inline-block px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold font-mono text-xs border border-amber-300">
                15 MISIONES (15 CAPÍTULOS)
              </span>{' '}
              basadas en la Ley de Transporte Terrestre para certificarte como Patrullero Vial Oficial.
            </p>
          </div>

          {/* Quick Login Action Card */}
          <div className="w-full lg:w-auto p-5 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/60 border border-blue-200 shadow-inner flex flex-col items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-mono text-blue-900">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="font-bold">SERVIDOR INTT EN LÍNEA</span>
            </div>

            <button
              id="btn-login-hero-cta"
              onClick={() => handleInitiateLogin(currentAvatar.audio_quote)}
              disabled={isAuthenticating}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#004884] hover:bg-[#003366] text-white font-orbitron font-extrabold text-sm sm:text-base tracking-wide shadow-lg shadow-blue-900/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
            >
              <LogIn className="w-5 h-5 stroke-[2.5]" />
              <span>{isAuthenticating ? 'VERIFICANDO CREDENCIAL...' : 'INGRESAR AL SISTEMA VIAL'}</span>
              <ArrowRight className="w-5 h-5 stroke-[2.5]" />
            </button>
            <span className="text-[11px] text-blue-800 font-medium">
              Accede a las 15 Misiones, Simulador 3D y Leyes
            </span>
          </div>
        </div>
      </div>

      {/* Prominent Login Avatars Grid (Avatares de Logueo) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-blue-200 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <Fingerprint className="w-5 h-5 text-[#004884]" />
              <h2 className="font-orbitron text-lg sm:text-xl font-extrabold text-[#003366] tracking-wide">
                PERFILES DE PATRULLERO // SELECCIONA TU CADETE DE INGRESO
              </h2>
            </div>
            <p className="text-xs text-slate-600">
              Haz clic en cualquier perfil para seleccionarlo o pulsa el botón «Ingresar» para acceder al sistema.
            </p>
          </div>
          <div className="text-xs font-bold font-mono text-[#004884] bg-blue-100 px-3 py-1 rounded-lg border border-blue-300 self-start sm:self-auto">
            4 CADETES DISPONIBLES
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {AVATARS.map((avatar, index) => {
            const isSelected = avatar.id === selectedAvatarId;
            return (
              <div
                key={avatar.id}
                id={`card-avatar-login-${avatar.id}`}
                onClick={() => {
                  soundManager.playClick();
                  onSelectAvatar(avatar.id);
                  const firstName = avatar.name.split(' ')[0];
                  setAliasDraft(firstName);
                  onUpdateAlias(firstName);
                }}
                className={`relative p-4 sm:p-5 rounded-3xl cursor-pointer transition-all duration-300 bg-white border-2 flex flex-col justify-between group ${
                  isSelected
                    ? 'border-[#004884] shadow-xl shadow-blue-900/15 scale-[1.02] ring-4 ring-blue-100'
                    : 'border-blue-200/80 hover:border-blue-400 hover:shadow-lg shadow-sm'
                }`}
              >
                <div>
                  {/* Header Strip inside Card */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-blue-50 border border-blue-200 text-blue-900">
                      CADETE #{index + 1}
                    </span>

                    {isSelected ? (
                      <div className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-extrabold flex items-center gap-1 bg-[#004884] text-white shadow-sm">
                        <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>SELECCIONADO</span>
                      </div>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-700 font-bold">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span>Disponible</span>
                      </span>
                    )}
                  </div>

                  {/* 3D Character Illustration Frame */}
                  <div
                    className="relative mb-3.5 rounded-2xl overflow-hidden border-2 bg-slate-100 aspect-square shadow-md"
                    style={{ borderColor: avatar.theme_color }}
                  >
                    <img
                      src={avatar.image_url}
                      alt={`Avatar 3D oficial de ${avatar.name} - INTT`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent pointer-events-none" />

                    <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between pointer-events-none">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-black/60 text-white backdrop-blur-sm border border-white/20">
                        3D VIAL
                      </span>
                      <span className="text-[10px] font-mono font-bold text-amber-300 drop-shadow">
                        INTT-VE
                      </span>
                    </div>
                  </div>

                  {/* Avatar Name and Badge */}
                  <div className="mb-2">
                    <div className="flex items-center justify-between gap-1">
                      <h3 className="font-orbitron font-extrabold text-lg text-[#002f5e] leading-tight">
                        {avatar.name}
                      </h3>
                      <span
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: avatar.theme_color }}
                        title={`Color temático: ${avatar.theme_color}`}
                      />
                    </div>
                    <p className="text-xs font-mono font-bold text-[#004884] leading-snug mt-0.5">
                      {avatar.title}
                    </p>
                  </div>

                  {/* Detailed Description */}
                  <p className="text-xs text-slate-700 leading-relaxed mb-3 bg-slate-50/80 p-2.5 rounded-xl border border-slate-200">
                    {avatar.description}
                  </p>

                  {/* Special Perk Tag */}
                  <div className="p-2.5 rounded-xl text-[11px] font-medium leading-tight mb-4 bg-blue-50/70 border border-blue-200/80 text-blue-950">
                    <span className="font-bold block text-[10px] uppercase font-mono text-[#004884] mb-0.5">
                      Habilidad Especial:
                    </span>
                    {avatar.perk}
                  </div>
                </div>

                {/* Bottom Action: Direct Login Button */}
                <button
                  id={`btn-quick-login-${avatar.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleQuickLoginWithAvatar(avatar);
                  }}
                  className={`w-full py-2.5 rounded-xl font-orbitron font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#004884] hover:bg-[#003366] text-white shadow-md shadow-blue-900/20'
                      : 'bg-white hover:bg-blue-50 text-blue-900 border-2 border-blue-300 hover:border-[#004884]'
                  }`}
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>
                    {isSelected
                      ? 'INGRESAR AHORA'
                      : `INGRESAR COMO ${avatar.name.toUpperCase()}`}
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Split: 3D Live Surveillance Metropolis + Active Login Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: 3D Viewport with Metropolis / Scenario */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-orbitron text-base font-bold text-[#003366] flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#004884]" />
              <span>VISTA PREVIA 3D // ESCENARIO DE TRÁNSITO INTT</span>
            </h3>
            <span className="text-xs font-mono font-bold text-[#004884] bg-blue-100 px-2.5 py-1 rounded-lg border border-blue-300">
              Cadete: {currentAvatar.name}
            </span>
          </div>

          <ThreeMetropolisView avatar={currentAvatar} sceneMode="avatar_stage" heightClass="h-[360px] sm:h-[420px]" />

          {/* Prompt 3D Render Description Card */}
          <div className="p-4 rounded-2xl bg-white border border-blue-200 shadow-sm space-y-2">
            <div className="text-[11px] font-mono text-[#004884] font-bold flex items-center gap-1.5 uppercase">
              <Sparkles className="w-3.5 h-3.5 text-[#004884]" />
              <span>Entorno de Simulación 3D:</span>
            </div>
            <p className="text-xs text-slate-700 italic leading-relaxed">
              "{currentAvatar.render_prompt}"
            </p>
          </div>
        </div>

        {/* Right: Active Login Terminal & Cadet Dossier */}
        <div className="lg:col-span-5 space-y-5">
          <div className="p-6 sm:p-7 rounded-3xl bg-white border-2 border-blue-300 shadow-xl shadow-blue-900/5 space-y-5">
            {/* Header Terminal Info with 3D Avatar Portrait */}
            <div className="flex items-center gap-4 border-b border-blue-100 pb-4">
              <div
                className="w-20 h-20 rounded-2xl overflow-hidden border-2 shadow-md shrink-0 bg-slate-100"
                style={{ borderColor: currentAvatar.theme_color }}
              >
                <img
                  src={currentAvatar.image_url}
                  alt={currentAvatar.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-blue-100 text-[#004884] border border-blue-300 truncate">
                    {currentAvatar.badge_name}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-emerald-700 flex items-center gap-1 shrink-0">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    ACTIVO
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-orbitron font-extrabold text-[#002f5e] truncate">
                  {currentAvatar.name}
                </h3>
                <p className="text-xs text-slate-600 font-medium truncate">{currentAvatar.title}</p>
              </div>

              {/* Audio Quote Speaker */}
              <button
                id="btn-play-avatar-quote-terminal"
                onClick={() => {
                  soundManager.playLaserScanSound();
                  onPlayQuote(currentAvatar.audio_quote);
                }}
                className="p-3 rounded-2xl bg-blue-50 border border-blue-200 hover:border-[#004884] text-[#004884] hover:scale-105 transition-all shadow-sm cursor-pointer shrink-0"
                title="Escuchar lema del cadete (TTS Español)"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            {/* Cadet Official Bio / Description */}
            <div className="p-3.5 rounded-2xl text-xs text-slate-700 leading-relaxed bg-blue-50/50 border border-blue-200">
              <span className="font-bold font-mono text-[#004884] block text-[10px] uppercase mb-1">
                Perfil Oficial del Cadete INTT:
              </span>
              {currentAvatar.description}
            </div>

            {/* Audio Quote Banner */}
            <div className="p-3.5 rounded-2xl text-xs text-blue-950 font-medium italic bg-blue-50/80 border border-blue-200/80">
              "{currentAvatar.audio_quote}"
            </div>

            {/* Custom Alias Login Field */}
            <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-200 space-y-2">
              <label htmlFor="input-player-alias" className="block text-xs font-mono font-bold text-blue-950 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#004884]" />
                  <span>Nombre / Alias del Cadete:</span>
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Impreso en Licencia</span>
              </label>

              <div className="flex gap-2">
                <input
                  id="input-player-alias"
                  type="text"
                  value={aliasDraft}
                  onChange={(e) => setAliasDraft(e.target.value)}
                  onBlur={handleAliasBlur}
                  placeholder={currentAvatar.name.split(' ')[0]}
                  maxLength={18}
                  className="flex-1 bg-white border-2 border-blue-200 focus:border-[#004884] rounded-xl px-3 py-2.5 text-sm text-slate-900 font-mono outline-none transition-all shadow-sm"
                />
                <button
                  id="btn-save-alias-terminal"
                  onClick={handleAliasBlur}
                  className="px-4 py-2 rounded-xl bg-[#004884] text-white text-xs font-mono font-bold hover:bg-[#003366] transition-all cursor-pointer flex items-center gap-1 shadow-sm"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Guardar</span>
                </button>
              </div>
            </div>

            {/* Radar / Stats Bars */}
            <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-700 font-bold flex items-center justify-between">
                <span>Evaluación de Competencias INTT</span>
                <span className="text-[#004884] font-bold">RANGO CADETE</span>
              </h4>

              {/* Prevención */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-700">Prevención y Anticipación</span>
                  <span className="font-mono font-bold text-[#004884]">
                    {currentAvatar.stats.prevencion}/100
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500 bg-[#004884]"
                    style={{ width: `${currentAvatar.stats.prevencion}%` }}
                  />
                </div>
              </div>

              {/* Lógica Vial */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-700">Lógica e Interpretación Vial</span>
                  <span className="font-mono font-bold text-[#004884]">
                    {currentAvatar.stats.logica_vial}/100
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500 bg-[#0284c7]"
                    style={{ width: `${currentAvatar.stats.logica_vial}%` }}
                  />
                </div>
              </div>

              {/* Normativa INTT */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-700">Dominio de la Ley de Tránsito</span>
                  <span className="font-mono font-bold text-[#004884]">
                    {currentAvatar.stats.normativa_intt}/100
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500 bg-amber-500"
                    style={{ width: `${currentAvatar.stats.normativa_intt}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Big Launch / Login Button */}
            <button
              id="btn-login-and-start-mission"
              onClick={() => handleInitiateLogin(currentAvatar.audio_quote)}
              disabled={isAuthenticating}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#003366] via-[#004884] to-[#0284c7] hover:from-[#002850] hover:to-[#004884] text-white font-orbitron font-extrabold text-sm sm:text-base tracking-wide shadow-xl shadow-blue-900/25 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
            >
              {authSuccess ? (
                <>
                  <CheckCircle2 className="w-5 h-5 stroke-[2.5] text-amber-300" />
                  <span className="text-white">¡AUTENTICADO! INGRESANDO AL SISTEMA...</span>
                </>
              ) : isAuthenticating ? (
                <>
                  <Activity className="w-5 h-5 animate-spin" />
                  <span>CONECTANDO CON INTT...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5 stroke-[2.5]" />
                  <span>INGRESAR AL SISTEMA (15 MISIONES)</span>
                  <ArrowRight className="w-5 h-5 stroke-[2.5]" />
                </>
              )}
            </button>

            <div className="text-center pt-2">
              <p className="text-[11px] text-slate-500">
                Al ingresar tendrás acceso a las 15 Misiones de Ley, el Simulador 3D Realista y el Compendio Oficial INTT.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
