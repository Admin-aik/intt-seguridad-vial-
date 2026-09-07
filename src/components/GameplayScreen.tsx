import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Shield,
  HelpCircle,
  CheckCircle,
  XCircle,
  ArrowRight,
  BookOpen,
  Zap,
  RotateCcw,
  Sparkles,
  Volume2,
  AlertTriangle,
  Award,
  ChevronRight,
} from 'lucide-react';
import { Challenge, AvatarData, ChallengeOption } from '../types';
import { CHALLENGES } from '../data/challenges';
import ThreeMetropolisView from './ThreeMetropolisView';
import { soundManager } from '../utils/soundAndTTS';

interface GameplayScreenProps {
  currentChallengeIndex: number;
  avatar: AvatarData;
  playerAlias: string;
  onAnswerChallenge: (isCorrect: boolean, earnedPoints: number, feedback: string) => void;
  onNextChallenge: () => void;
  onSelectChallengeIndex: (index: number) => void;
  onNarrate: (text: string) => void;
}

export default function GameplayScreen({
  currentChallengeIndex,
  avatar,
  playerAlias,
  onAnswerChallenge,
  onNextChallenge,
  onSelectChallengeIndex,
  onNarrate,
}: GameplayScreenProps) {
  const challenge = CHALLENGES[currentChallengeIndex] || CHALLENGES[0];
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [bonusEarned, setBonusEarned] = useState<number>(0);

  // Reset local state when challenge changes
  useEffect(() => {
    setSelectedOptionId(null);
    setHasSubmitted(false);
    setFeedbackMessage('');
    setIsCorrect(false);
    setBonusEarned(0);
  }, [currentChallengeIndex]);

  // Check if avatar perk applies to this challenge
  const hasPerkBonus = challenge.applicable_avatar_perk === avatar.id;
  const isLastChallenge = currentChallengeIndex === CHALLENGES.length - 1;
  const progressPercent = Math.round(((currentChallengeIndex + 1) / CHALLENGES.length) * 100);

  const handleOptionClick = (opt: ChallengeOption) => {
    if (hasSubmitted) return;
    soundManager.playClick();
    setSelectedOptionId(opt.id);
  };

  const handleSubmitAnswer = () => {
    if (selectedOptionId === null || hasSubmitted) return;

    const chosenOption = challenge.options.find((o) => o.id === selectedOptionId);
    if (!chosenOption) return;

    const correct = selectedOptionId === challenge.correct_option_id;
    setIsCorrect(correct);
    setHasSubmitted(true);
    setFeedbackMessage(chosenOption.feedback_immediate);

    const basePoints = correct ? chosenOption.reward_if_correct.puntos_seguridad : 0;
    let perkBonus = 0;

    if (correct && hasPerkBonus) {
      perkBonus = 50; // Special INTT Perk boost
    }
    setBonusEarned(perkBonus);

    const totalEarned = basePoints + perkBonus;

    if (correct) {
      soundManager.playCorrect();
      confetti({
        particleCount: 75,
        spread: 70,
        origin: { y: 0.6 },
        colors: [avatar.theme_color, '#004884', '#fbbf24', '#ffffff'],
      });
    } else {
      soundManager.playError();
    }

    onAnswerChallenge(correct, totalEarned, chosenOption.feedback_immediate);

    // Read out feedback via TTS
    const narrationText = correct
      ? `¡Excelente decisión, Cadete ${playerAlias}! ${chosenOption.feedback_immediate}`
      : `Atención, Cadete: ${chosenOption.feedback_immediate}`;
    onNarrate(narrationText);
  };

  const handleRetry = () => {
    soundManager.playClick();
    setSelectedOptionId(null);
    setHasSubmitted(false);
    setFeedbackMessage('');
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* 15 Chapters Ribbon & Progress Bar */}
      <div className="p-5 rounded-3xl bg-white border-2 border-blue-200 shadow-md shadow-blue-900/5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#004884] text-white flex items-center justify-center font-orbitron font-extrabold text-sm shadow-md shadow-blue-900/20 shrink-0">
              {challenge.chapter_number}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-[#004884] uppercase">
                  {challenge.chapter} de 15
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-blue-100 text-blue-900 border border-blue-200">
                  Progreso: {progressPercent}%
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-orbitron font-extrabold text-[#002f5e] leading-tight">
                {challenge.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5 bg-blue-50/80 px-3 py-1.5 rounded-2xl border border-blue-200">
              <img
                src={avatar.image_url}
                alt={avatar.name}
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-xl object-cover border-2 shadow-sm shrink-0"
                style={{ borderColor: avatar.theme_color }}
              />
              <div className="text-left">
                <div className="text-[10px] font-mono font-bold text-slate-500 uppercase">
                  Cadete en Misión
                </div>
                <div className="text-xs font-orbitron font-extrabold text-[#002f5e]">
                  {avatar.name} ({playerAlias})
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Global 15 Chapters Progress Track */}
        <div className="space-y-1.5">
          <div className="w-full h-2 bg-blue-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-[#004884] to-[#0284c7]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* 15 Chapter Selector Grid / Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 scrollbar-none">
            {CHALLENGES.map((ch, idx) => {
              const isActive = idx === currentChallengeIndex;
              return (
                <button
                  key={ch.id}
                  id={`btn-challenge-tab-${ch.id}`}
                  onClick={() => {
                    soundManager.playClick();
                    onSelectChallengeIndex(idx);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-[#004884] text-white shadow-md shadow-blue-900/25 scale-105 ring-2 ring-blue-300'
                      : 'bg-blue-50/80 hover:bg-blue-100 text-blue-950 border border-blue-200'
                  }`}
                  title={`${ch.chapter}: ${ch.title}`}
                >
                  <span>Cap {ch.chapter_number}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Challenge Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: 3D Environment Scene & Scenario Telemetry */}
        <div className="lg:col-span-6 space-y-4">
          <ThreeMetropolisView
            avatar={avatar}
            sceneMode={challenge.scene_mode}
            heightClass="h-[320px] sm:h-[390px]"
          />

          {/* 3D Scene Environment Hologram Context */}
          <div className="p-5 rounded-3xl bg-white border-2 border-blue-200 shadow-md shadow-blue-900/5 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-[#004884] flex items-center gap-1.5 uppercase font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-[#004884] animate-ping" />
                <span>Simulación Visual 3D del Entorno:</span>
              </span>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-50 text-blue-900 border border-blue-200">
                {challenge.challenge_type}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
              "{challenge.visual_scene_3d_description}"
            </p>

            {/* Legal context tag */}
            <div className="pt-2.5 border-t border-blue-100 flex items-center gap-2 text-xs text-amber-800 font-bold bg-amber-50/80 px-3 py-2 rounded-xl border border-amber-200">
              <BookOpen className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Fundamento Legal: {challenge.intt_article_context}</span>
            </div>
          </div>

          {/* Cadet Perk Bonus Active Indicator */}
          {hasPerkBonus && (
            <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 flex items-center gap-3.5 shadow-sm">
              <div
                className="w-12 h-12 rounded-xl overflow-hidden border-2 shadow-sm shrink-0 bg-white"
                style={{ borderColor: avatar.theme_color }}
              >
                <img
                  src={avatar.image_url}
                  alt={avatar.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-700 animate-bounce" />
                  <span>¡Sinergia de Habilidad Especial Activa!</span>
                </p>
                <p className="text-[11px] text-amber-800">
                  Cadete {avatar.name} activa: <strong className="text-[#004884]">{avatar.perk}</strong> (+50 PTS extra).
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Question Card & Interactive Options */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-6 sm:p-7 rounded-3xl bg-white border-2 border-blue-200 shadow-xl shadow-blue-900/5 space-y-5">
            {/* Header with TTS listen button */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="px-3 py-1 rounded-md text-[10px] font-mono font-bold bg-blue-100 text-[#004884] border border-blue-300">
                  DESAFÍO CIUDADANO // CAPÍTULO {challenge.chapter_number} DE 15
                </span>
                <h3 className="font-orbitron font-extrabold text-base sm:text-lg text-[#002f5e] mt-2 leading-snug">
                  {challenge.question}
                </h3>
              </div>

              <button
                id="btn-narrate-question"
                onClick={() => {
                  soundManager.playLaserScanSound();
                  onNarrate(`${challenge.question} Opciones: ${challenge.options.map((o) => o.text).join('. ')}`);
                }}
                className="p-3 rounded-2xl bg-blue-50 border border-blue-200 hover:border-[#004884] text-[#004884] hover:scale-105 transition-all shadow-sm shrink-0 cursor-pointer"
                title="Escuchar narración de la pregunta"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            {/* Answer Options */}
            <div className="space-y-3">
              {challenge.options.map((option, idx) => {
                const isSelected = selectedOptionId === option.id;
                const isThisCorrect = option.id === challenge.correct_option_id;

                let cardClasses = 'border-2 border-blue-100 hover:border-blue-300 bg-white text-slate-800';

                if (isSelected && !hasSubmitted) {
                  cardClasses = 'border-2 border-[#004884] bg-blue-50/70 shadow-md ring-2 ring-blue-200 text-[#002f5e]';
                } else if (hasSubmitted) {
                  if (isThisCorrect) {
                    cardClasses = 'border-2 border-emerald-500 bg-emerald-50 text-emerald-950 font-medium shadow-md';
                  } else if (isSelected && !isThisCorrect) {
                    cardClasses = 'border-2 border-red-500 bg-red-50 text-red-950';
                  } else {
                    cardClasses = 'opacity-50 border-gray-200 bg-gray-50';
                  }
                }

                return (
                  <div
                    key={option.id}
                    id={`challenge-option-${option.id}`}
                    onClick={() => handleOptionClick(option)}
                    className={`p-4 rounded-2xl transition-all duration-200 cursor-pointer flex items-start gap-3.5 ${cardClasses}`}
                  >
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center font-mono font-bold text-xs shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-[#004884] text-white'
                          : 'bg-blue-100 text-blue-900 border border-blue-200'
                      }`}
                    >
                      {String.fromCharCode(65 + idx)}
                    </div>

                    <div className="flex-1 text-xs sm:text-sm leading-relaxed font-medium">
                      {option.text}
                    </div>

                    {hasSubmitted && isThisCorrect && (
                      <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                    )}
                    {hasSubmitted && isSelected && !isThisCorrect && (
                      <XCircle className="w-5 h-5 text-red-600 shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Submission / Next Buttons */}
            {!hasSubmitted ? (
              <button
                id="btn-submit-answer"
                onClick={handleSubmitAnswer}
                disabled={selectedOptionId === null}
                className={`w-full py-4 rounded-2xl font-orbitron font-extrabold text-sm tracking-wide transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                  selectedOptionId !== null
                    ? 'bg-[#004884] hover:bg-[#003366] text-white shadow-lg shadow-blue-900/25 hover:scale-[1.01]'
                    : 'bg-slate-200 text-slate-500 cursor-not-allowed border border-slate-300'
                }`}
              >
                <Shield className="w-4 h-4" />
                <span>CONFIRMAR ACCIÓN VIAL</span>
              </button>
            ) : (
              <div className="space-y-4">
                {/* Immediate Feedback Banner */}
                <div
                  className={`p-4 rounded-2xl border-2 space-y-2 animate-fadeIn ${
                    isCorrect
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
                      : 'bg-red-50 border-red-400 text-red-950'
                  }`}
                >
                  <div className="flex items-center gap-2 font-orbitron font-bold text-sm">
                    {isCorrect ? (
                      <>
                        <CheckCircle className="w-5 h-5 text-emerald-600" />
                        <span className="text-emerald-900">¡ACIERTO LEGAL Y CÍVICO!</span>
                        {bonusEarned > 0 && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-400 text-blue-950 font-extrabold shadow-sm">
                            +{bonusEarned} PTS PERK
                          </span>
                        )}
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                        <span className="text-red-900">INFRACCIÓN O DECISIÓN INSEGURA</span>
                      </>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm leading-relaxed">{feedbackMessage}</p>
                </div>

                {/* Actions row */}
                <div className="flex items-center gap-3">
                  {!isCorrect && (
                    <button
                      id="btn-retry-challenge"
                      onClick={handleRetry}
                      className="px-4 py-3.5 rounded-2xl bg-white hover:bg-slate-100 border-2 border-slate-300 text-xs font-mono font-bold text-slate-700 flex items-center gap-2 transition-all cursor-pointer shadow-sm"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Reintentar</span>
                    </button>
                  )}

                  <button
                    id="btn-next-challenge"
                    onClick={() => {
                      soundManager.playClick();
                      onNextChallenge();
                    }}
                    className="flex-1 py-3.5 rounded-2xl bg-[#004884] hover:bg-[#003366] text-white font-orbitron font-extrabold text-xs sm:text-sm tracking-wider shadow-lg shadow-blue-900/25 hover:scale-[1.01] transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{isLastChallenge ? 'FINALIZAR EVALUACIÓN Y VER LICENCIA' : 'SIGUIENTE CAPÍTULO'}</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Educational INTT Card */}
          {challenge.intt_educational_card.show_card && (
            <div className="p-5 rounded-3xl bg-amber-50/70 border-2 border-amber-300 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-amber-900 font-orbitron font-bold text-xs uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Tarjeta Didáctica INTT: {challenge.intt_educational_card.topic}</span>
              </div>
              <p className="text-xs sm:text-sm text-amber-950 font-semibold leading-relaxed">
                {challenge.intt_educational_card.official_rule}
              </p>
              <div className="space-y-1.5 pt-2 border-t border-amber-200">
                <span className="text-[11px] font-mono font-bold text-amber-900 uppercase">
                  Reglas de Oro del Patrullero:
                </span>
                <ul className="space-y-1">
                  {challenge.intt_educational_card.key_learnings.map((learning, lIdx) => (
                    <li key={lIdx} className="text-xs text-slate-700 flex items-start gap-2">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>{learning}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
