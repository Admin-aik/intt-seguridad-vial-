import { useState } from 'react';
import { BookOpen, Search, Volume2, ShieldAlert, AlertCircle, Info, Gauge, ShieldCheck, FileText } from 'lucide-react';
import { INTT_SIGNS, INTT_ARTICLES, INTT_SPEED_LIMITS } from '../data/inttRules';
import { INTTSign } from '../types';
import { soundManager } from '../utils/soundAndTTS';

interface INTTRulesHubProps {
  onNarrate: (text: string) => void;
}

export default function INTTRulesHub({ onNarrate }: INTTRulesHubProps) {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'reglamentaria' | 'preventiva' | 'informativa' | 'leyes' | 'velocidades'>('all');
  const [selectedSign, setSelectedSign] = useState<INTTSign | null>(null);

  const filteredSigns = INTT_SIGNS.filter((sign) => {
    const matchesSearch =
      sign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sign.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sign.description.toLowerCase().includes(searchTerm.toLowerCase());

    if (activeCategory === 'all') return matchesSearch;
    if (activeCategory === 'leyes' || activeCategory === 'velocidades') return false;
    return matchesSearch && sign.category === activeCategory;
  });

  const filteredArticles = INTT_ARTICLES.filter((art) => {
    const matchesSearch =
      art.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      art.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      art.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      art.category.toLowerCase().includes(searchTerm.toLowerCase());

    if (activeCategory === 'all' || activeCategory === 'leyes') return matchesSearch;
    return false;
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-blue-200 shadow-md shadow-blue-900/5 space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#004884] text-xs font-mono font-bold">
          <BookOpen className="w-3.5 h-3.5 text-[#004884]" />
          <span>MARCO LEGAL Y SEÑALIZACIÓN VIAL // INTT VENEZUELA</span>
        </div>
        <h2 className="font-orbitron text-xl sm:text-2xl font-extrabold text-[#002f5e]">
          COMPENDIO DE LA LEY DE TRANSPORTE TERRESTRE Y REGLAMENTO DE TRÁNSITO
        </h2>
        <p className="text-xs sm:text-sm text-slate-700 max-w-3xl leading-relaxed">
          Consulta la clasificación oficial de señales (Reglamentarias, Preventivas e Informativas),
          los artículos fundamentales de deberes y derechos de peatones y conductores, y la tabla reglamentaria de velocidades en Venezuela.
        </p>

        {/* Search & Tabs */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-2">
          {/* Search box */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              id="input-search-intt"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar señal (ej: PARE, R-1, escolar, casco, velocidad)..."
              className="w-full bg-slate-50 border-2 border-blue-200 focus:border-[#004884] rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 outline-none transition-all shadow-inner"
            />
          </div>

          {/* Filter pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
            <button
              id="tab-filter-all"
              onClick={() => {
                soundManager.playClick();
                setActiveCategory('all');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                activeCategory === 'all'
                  ? 'bg-[#004884] text-white shadow-md shadow-blue-900/20'
                  : 'bg-white hover:bg-blue-50 text-blue-950 border border-blue-200'
              }`}
            >
              Todos
            </button>
            <button
              id="tab-filter-reglamentarias"
              onClick={() => {
                soundManager.playClick();
                setActiveCategory('reglamentaria');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1 cursor-pointer ${
                activeCategory === 'reglamentaria'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-900/20'
                  : 'bg-white hover:bg-rose-50 text-rose-800 border border-rose-200'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Reglamentarias</span>
            </button>
            <button
              id="tab-filter-preventivas"
              onClick={() => {
                soundManager.playClick();
                setActiveCategory('preventiva');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1 cursor-pointer ${
                activeCategory === 'preventiva'
                  ? 'bg-amber-500 text-blue-950 shadow-md shadow-amber-900/20'
                  : 'bg-white hover:bg-amber-50 text-amber-900 border border-amber-200'
              }`}
            >
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Preventivas</span>
            </button>
            <button
              id="tab-filter-informativas"
              onClick={() => {
                soundManager.playClick();
                setActiveCategory('informativa');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1 cursor-pointer ${
                activeCategory === 'informativa'
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-900/20'
                  : 'bg-white hover:bg-sky-50 text-sky-900 border border-sky-200'
              }`}
            >
              <Info className="w-3.5 h-3.5" />
              <span>Informativas</span>
            </button>
            <button
              id="tab-filter-leyes"
              onClick={() => {
                soundManager.playClick();
                setActiveCategory('leyes');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1 cursor-pointer ${
                activeCategory === 'leyes'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/20'
                  : 'bg-white hover:bg-emerald-50 text-emerald-900 border border-emerald-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Artículos Ley</span>
            </button>
            <button
              id="tab-filter-velocidades"
              onClick={() => {
                soundManager.playClick();
                setActiveCategory('velocidades');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1 cursor-pointer ${
                activeCategory === 'velocidades'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-900/20'
                  : 'bg-white hover:bg-purple-50 text-purple-900 border border-purple-200'
              }`}
            >
              <Gauge className="w-3.5 h-3.5" />
              <span>Velocidades</span>
            </button>
          </div>
        </div>
      </div>

      {/* Speed Limits Section */}
      {(activeCategory === 'all' || activeCategory === 'velocidades') && (
        <div className="space-y-3">
          <h3 className="font-orbitron text-base font-extrabold text-[#002f5e] flex items-center gap-2">
            <Gauge className="w-4 h-4 text-purple-600" />
            <span>TABLA REGLAMENTARIA DE VELOCIDADES EN VENEZUELA (ART. 169 INTT)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {INTT_SPEED_LIMITS.map((lim, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white border-2 border-blue-200 space-y-2 hover:border-[#004884] transition-all shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-500 font-bold uppercase">Límite Oficial</span>
                  <div
                    className="w-12 h-12 rounded-full border-4 border-red-600 bg-white text-slate-900 font-orbitron font-extrabold flex items-center justify-center text-sm shadow-md"
                  >
                    {lim.max_kmh}
                  </div>
                </div>
                <h4 className="text-sm font-bold text-[#002f5e] leading-tight">{lim.zone}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{lim.advice}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Traffic Signs Grid */}
      {(activeCategory === 'all' ||
        activeCategory === 'reglamentaria' ||
        activeCategory === 'preventiva' ||
        activeCategory === 'informativa') && (
        <div className="space-y-3">
          <h3 className="font-orbitron text-base font-extrabold text-[#002f5e] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#004884]" />
            <span>CATÁLOGO DE SEÑALIZACIÓN VIAL INTT ({filteredSigns.length} SEÑALES)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSigns.map((sign) => {
              const isSelected = selectedSign?.id === sign.id;
              return (
                <div
                  key={sign.id}
                  id={`sign-card-${sign.id}`}
                  onClick={() => {
                    soundManager.playClick();
                    setSelectedSign(sign);
                  }}
                  className={`p-5 rounded-2xl bg-white border-2 cursor-pointer transition-all duration-200 space-y-3 ${
                    isSelected
                      ? 'border-[#004884] ring-4 ring-blue-100 shadow-lg scale-[1.01]'
                      : 'border-blue-200/80 hover:border-[#004884] hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    {/* Simulated Sign Graphic */}
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center font-bold text-xs shadow-md border-2"
                      style={{
                        backgroundColor: sign.bg_color,
                        borderColor: sign.border_color,
                        color: sign.bg_color === '#ffffff' ? '#dc2626' : '#ffffff',
                      }}
                    >
                      <span className="text-lg">{sign.symbol}</span>
                    </div>

                    <div className="text-right">
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-100 text-[#004884] border border-blue-200">
                        {sign.code}
                      </span>
                      <span className="block text-[10px] font-mono text-slate-500 font-bold uppercase mt-1">
                        {sign.category}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-[#002f5e]">{sign.name}</h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed font-medium">
                      {sign.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-blue-100 flex items-center justify-between text-[11px]">
                    <span className="font-mono font-bold text-[#004884]">{sign.article}</span>
                    <button
                      id={`btn-read-sign-${sign.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        soundManager.playLaserScanSound();
                        onNarrate(
                          `Señal ${sign.code}: ${sign.name}. Categoría ${sign.category}. ${sign.description}. Respaldada por el ${sign.article}.`
                        );
                      }}
                      className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#004884] border border-blue-200 cursor-pointer shadow-sm"
                      title="Escuchar norma de la señal"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Legal Articles Compendium */}
      {(activeCategory === 'all' || activeCategory === 'leyes') && (
        <div className="space-y-3">
          <h3 className="font-orbitron text-base font-extrabold text-[#002f5e] flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-600" />
            <span>ARTÍCULOS DESTACADOS DE LA LEY DE TRANSPORTE TERRESTRE ({filteredArticles.length})</span>
          </h3>

          <div className="space-y-4">
            {filteredArticles.map((art, aIdx) => (
              <div
                key={aIdx}
                className="p-5 sm:p-6 rounded-2xl bg-white border-2 border-blue-200 space-y-3 hover:border-[#004884] transition-all shadow-sm"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md font-mono font-bold text-xs bg-emerald-100 text-emerald-800 border border-emerald-300">
                      {art.number}
                    </span>
                    <h4 className="text-sm sm:text-base font-bold text-[#002f5e]">{art.title}</h4>
                  </div>
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-50 text-blue-900 border border-blue-200">
                    {art.category}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic bg-blue-50/50 p-3 rounded-xl border border-blue-200">
                  "{art.official_quote}"
                </p>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-emerald-800 font-semibold">Resumen Práctico: {art.summary}</span>
                  <button
                    id={`btn-read-article-${aIdx}`}
                    onClick={() => {
                      soundManager.playLaserScanSound();
                      onNarrate(`${art.number}: ${art.title}. ${art.official_quote}`);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#004884] text-white hover:bg-[#003366] flex items-center gap-1.5 text-xs font-mono font-bold shadow-sm cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Escuchar</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
