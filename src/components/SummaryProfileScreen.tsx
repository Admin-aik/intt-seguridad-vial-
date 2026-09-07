import { Shield, Award, CheckCircle2, User, Printer, Sparkles, QrCode, BookmarkCheck, ShieldCheck } from 'lucide-react';
import { GameHUD, AvatarData } from '../types';
import { soundManager } from '../utils/soundAndTTS';

interface SummaryProfileScreenProps {
  hud: GameHUD;
  avatar: AvatarData;
  onResetProgress: () => void;
  onNarrate: (text: string) => void;
}

export default function SummaryProfileScreen({
  hud,
  avatar,
  onResetProgress,
  onNarrate,
}: SummaryProfileScreenProps) {
  const handlePrint = () => {
    soundManager.playClick();
    window.print();
  };

  const allPossibleBadges = [
    { name: 'Guardián del Cruce Cebra', desc: 'Respeto irrestricto al peatón y demarcación vial.', icon: '🚶' },
    { name: 'Experto en Señalización INTT', desc: 'Dominio de señales Reglamentarias, Preventivas e Informativas.', icon: '🛑' },
    { name: 'Casco y Cinto Homologado', desc: 'Compromiso con la seguridad pasiva y elementos certificados.', icon: '🛡️' },
    { name: 'Conductor Cero Celular', desc: 'Conducción preventiva sin distracciones telefónicas.', icon: '📵' },
    { name: 'Preferencia en Rotondas', desc: 'Cesión prioritaria a vehículos dentro del anillo y ambulancias.', icon: '🚑' },
    { name: 'Especialista en Zonas Escolares', desc: 'Límite estricto a 15 km/h en planteles educativos.', icon: '🎒' },
    { name: 'Patrullero Graduado INTT', desc: 'Certificación de las 15 Misiones de la Ley de Transporte.', icon: '🏆' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-white border-2 border-blue-200 shadow-md shadow-blue-900/5">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#004884] text-xs font-mono font-bold mb-2">
            <Award className="w-3.5 h-3.5 text-[#004884]" />
            <span>EXPEDIENTE DIGITAL DE CIUDADANÍA VIAL // INTT</span>
          </div>
          <h2 className="font-orbitron text-xl sm:text-2xl font-extrabold text-[#002f5e]">
            LICENCIA DIGITAL Y EXPEDIENTE DE PATRULLERO VIAL
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 mt-1 max-w-2xl leading-relaxed">
            Certificación ciudadana generada en base a tu desempeño, dominio de la Ley de Transporte Terrestre y prevención vial activa.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="btn-print-license"
            onClick={handlePrint}
            className="px-5 py-3 rounded-2xl bg-[#004884] hover:bg-[#003366] text-white font-orbitron font-bold text-xs tracking-wider shadow-lg shadow-blue-900/20 flex items-center gap-2 cursor-pointer transition-all hover:scale-105"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir Credencial</span>
          </button>
        </div>
      </div>

      {/* Main License Card (Official INTT Credential) */}
      <div className="max-w-2xl mx-auto">
        <div
          id="digital-license-badge"
          className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-white border-2 border-blue-300 shadow-2xl shadow-blue-900/10 space-y-6"
        >
          {/* Official Venezuelan Ribbon */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-400 via-blue-600 to-red-600" />

          {/* Watermark INTT */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none opacity-[0.03] select-none">
            <span className="font-orbitron text-9xl font-black text-blue-950">INTT</span>
          </div>

          {/* Top Header of License */}
          <div className="flex items-center justify-between border-b border-blue-100 pb-4 pt-1">
            <div className="flex items-center gap-3.5">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center border-2 bg-blue-50 shadow-sm"
                style={{ borderColor: avatar.theme_color }}
              >
                <Shield className="w-7 h-7" style={{ color: avatar.theme_color }} />
              </div>
              <div>
                <span className="text-[10px] font-mono text-slate-500 block tracking-wider uppercase font-bold">
                  REPÚBLICA BOLIVARIANA DE VENEZUELA // INTT
                </span>
                <h3 className="font-orbitron font-extrabold text-lg text-[#002f5e]">
                  LICENCIA DE PATRULLERO VIAL URBANO
                </h3>
              </div>
            </div>

            <div className="text-right font-mono">
              <span className="text-[10px] text-slate-400 block font-bold">SERIE REGISTRO</span>
              <span className="text-xs font-bold text-[#004884] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                VE-2026-INTT-0903
              </span>
            </div>
          </div>

          {/* Body of License: Avatar + User Details */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
            {/* Holographic Portrait Box with 3D Avatar */}
            <div className="sm:col-span-4 flex flex-col items-center text-center">
              <div
                className="w-28 h-28 rounded-2xl border-2 flex items-center justify-center bg-blue-50/70 p-1 relative shadow-md overflow-visible"
                style={{ borderColor: avatar.theme_color }}
              >
                <div className="w-full h-full rounded-xl overflow-hidden bg-white border border-blue-100 shadow-sm">
                  <img
                    src={avatar.image_url}
                    alt={avatar.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center"
                  />
                </div>
                <div
                  className="absolute -bottom-2.5 px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase shadow text-white bg-[#004884]"
                >
                  HOMOLOGADO
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold text-slate-700 mt-4">
                Cadete: {avatar.name}
              </span>
            </div>

            {/* Profile Fields */}
            <div className="sm:col-span-8 space-y-3 font-mono">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-blue-50/60 p-3 rounded-xl border border-blue-200">
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">Titular / Alias:</span>
                  <span className="font-orbitron font-bold text-[#002f5e] text-sm">{hud.player_alias}</span>
                </div>
                <div className="bg-blue-50/60 p-3 rounded-xl border border-blue-200">
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">Rango Oficial:</span>
                  <span className="font-orbitron font-bold text-[#004884] text-xs">{hud.nivel_patrullero}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-200">
                  <span className="text-[10px] text-amber-800 block uppercase font-bold">Puntos de Seguridad:</span>
                  <span className="font-orbitron font-bold text-amber-900 text-sm">{hud.puntos_seguridad} PTS</span>
                </div>
                <div className="bg-blue-50/60 p-3 rounded-xl border border-blue-200">
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">Racha de Aciertos:</span>
                  <span className="font-orbitron font-bold text-[#002f5e] text-sm">{hud.racha_aciertos} SEGUIDOS</span>
                </div>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-[11px] text-slate-700">
                <span className="text-slate-500 block uppercase text-[10px] font-bold">Habilidad Especial Activa:</span>
                <span className="text-slate-900 font-semibold">{avatar.perk}</span>
              </div>
            </div>
          </div>

          {/* Footer Bar with QR Code and Signatures */}
          <div className="pt-4 border-t border-blue-100 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-50 border border-blue-200 text-[#004884]">
                <QrCode className="w-8 h-8" />
              </div>
              <div className="text-[10px] font-mono text-slate-600">
                <span className="font-bold text-[#004884] block">CERTIFICADO DIGITAL // INTT VE</span>
                <span>VALIDADO CONFORME A LA LEY DE TRANSPORTE TERRESTRE</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-mono text-slate-400 block font-bold">FECHA DE EMISIÓN</span>
              <span className="text-xs font-mono font-bold text-[#002f5e]">{hud.simulated_date}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Badges & Licences Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Unlocked Licenses */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white border-2 border-blue-200 shadow-sm space-y-4">
          <h3 className="font-orbitron text-base font-extrabold text-[#002f5e] flex items-center gap-2">
            <BookmarkCheck className="w-4 h-4 text-[#004884]" />
            <span>LICENCIAS VIRTUALES DESBLOQUEADAS</span>
          </h3>

          <div className="space-y-2.5">
            {hud.licencias_desbloqueadas.map((lic, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-blue-50/70 border-2 border-blue-200 flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#004884]" />
                  <span className="text-xs font-bold text-slate-900">{lic}</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#004884] text-white shadow-sm">
                  AUTORIZADO
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Badges & Medals */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white border-2 border-blue-200 shadow-sm space-y-4">
          <h3 className="font-orbitron text-base font-extrabold text-[#002f5e] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>INSIGNIAS CIUDADANAS OBTENIDAS</span>
          </h3>

          <div className="space-y-2.5">
            {allPossibleBadges.map((badge, idx) => {
              const isEarned = hud.insignias_recolectadas.includes(badge.name);
              return (
                <div
                  key={idx}
                  className={`p-3.5 rounded-2xl border-2 flex items-center gap-3 transition-all ${
                    isEarned
                      ? 'bg-amber-50/80 border-amber-300 text-amber-950 shadow-sm'
                      : 'bg-slate-50 border-slate-200 opacity-60'
                  }`}
                >
                  <span className="text-2xl">{badge.icon}</span>
                  <div className="flex-1">
                    <span className="text-xs font-bold block text-slate-900">{badge.name}</span>
                    <span className="text-[11px] text-slate-600">{badge.desc}</span>
                  </div>
                  {isEarned ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-amber-400 text-blue-950 font-extrabold shadow-sm">
                      OBTENIDA
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-200 text-slate-600 font-medium">
                      PENDIENTE
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
