import { useState } from 'react';
import { X, Copy, Check, Terminal, FileCode } from 'lucide-react';
import { soundManager } from '../utils/soundAndTTS';

interface JsonTelemetryModalProps {
  isOpen: boolean;
  onClose: () => void;
  jsonData: Record<string, unknown>;
}

export default function JsonTelemetryModal({
  isOpen,
  onClose,
  jsonData,
}: JsonTelemetryModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const jsonString = JSON.stringify(jsonData, null, 2);

  const handleCopy = () => {
    soundManager.playClick();
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl glass-panel border border-cyan-500/40 shadow-2xl overflow-hidden bg-slate-950">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-900/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-orbitron font-bold text-sm text-white">
                MOTOR DE SALIDA TELEMÉTRICA // JSON STRICT
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">
                Estructura de respuesta en tiempo real solicitada por el prompt del sistema
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-copy-json-telemetry"
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-mono text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? '¡Copiado!' : 'Copiar JSON'}</span>
            </button>

            <button
              id="btn-close-json-modal"
              onClick={() => {
                soundManager.playClick();
                onClose();
              }}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Code Content */}
        <div className="flex-1 overflow-auto p-5 font-mono text-xs text-cyan-300/90 leading-relaxed bg-black/90">
          <pre className="whitespace-pre-wrap selection:bg-cyan-500 selection:text-black">
            {jsonString}
          </pre>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-white/10 bg-slate-900/60 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span>Formato: UTF-8 JSON Estricto amparado en INTT Venezuela</span>
          <span className="text-cyan-400">Estado: Sincronizado</span>
        </div>
      </div>
    </div>
  );
}
