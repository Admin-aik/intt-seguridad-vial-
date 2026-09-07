/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import { ScreenType, AvatarId, GameHUD } from './types';
import { AVATARS } from './data/avatars';
import { CHALLENGES } from './data/challenges';
import HeaderNav from './components/HeaderNav';
import AvatarSelectionScreen from './components/AvatarSelectionScreen';
import GameplayScreen from './components/GameplayScreen';
import VirtualStreetSimulator from './components/VirtualStreetSimulator';
import INTTRulesHub from './components/INTTRulesHub';
import SummaryProfileScreen from './components/SummaryProfileScreen';
import JsonTelemetryModal from './components/JsonTelemetryModal';
import { soundManager } from './utils/soundAndTTS';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('PORTADA');
  const [selectedAvatarId, setSelectedAvatarId] = useState<AvatarId>('ircar');
  const [playerAlias, setPlayerAlias] = useState<string>('Ircar');
  const [puntosSeguridad, setPuntosSeguridad] = useState<number>(0);
  const [rachaAciertos, setRachaAciertos] = useState<number>(0);
  const [insignias, setInsignias] = useState<string[]>(['Pase Peatonal Cyber']);
  const [licencias, setLicencias] = useState<string[]>([
    'Pase Peatonal Cyber',
    'Bici-Ruta Segura',
  ]);
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState<number>(0);
  const [isTtsSpeaking, setIsTtsSpeaking] = useState<boolean>(false);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);
  const [isJsonModalOpen, setIsJsonModalOpen] = useState<boolean>(false);
  const [worldEvents, setWorldEvents] = useState<string[]>([
    'Servidor INTT: Módulo de Seguridad y Ley de Transporte Terrestre iniciado',
    'Telemetría 3D: Red urbana activa con 15 Misiones de Capacitación',
  ]);

  const simulatedDate = '2026-09-03';

  const currentAvatar = useMemo(() => {
    return AVATARS.find((a) => a.id === selectedAvatarId) || AVATARS[0];
  }, [selectedAvatarId]);

  // Compute Cadet Rank based on points and streak
  const nivelPatrullero = useMemo(() => {
    if (puntosSeguridad >= 800) return 'Comisionado Vial INTT';
    if (puntosSeguridad >= 500) return 'Patrullero Vial Senior';
    if (puntosSeguridad >= 250) return 'Patrullero Vial Junior';
    if (puntosSeguridad >= 100) return 'Cadete en Instrucción';
    return 'Aspirante a Patrullero';
  }, [puntosSeguridad]);

  // Combined HUD state
  const hud: GameHUD = useMemo(() => {
    return {
      active_avatar: currentAvatar.name,
      player_alias: playerAlias,
      puntos_seguridad: puntosSeguridad,
      racha_aciertos: rachaAciertos,
      nivel_patrullero: nivelPatrullero,
      insignias_recolectadas: insignias,
      licencias_desbloqueadas: licencias,
      simulated_date: simulatedDate,
    };
  }, [currentAvatar, playerAlias, puntosSeguridad, rachaAciertos, nivelPatrullero, insignias, licencias]);

  // TTS narration helper
  const handleSpeak = useCallback((text: string) => {
    soundManager.speak(
      text,
      () => setIsTtsSpeaking(true),
      () => setIsTtsSpeaking(false)
    );
  }, []);

  const handleToggleTts = () => {
    if (isTtsSpeaking) {
      soundManager.stopSpeaking();
      setIsTtsSpeaking(false);
    } else {
      let speechScript = '';
      if (currentScreen === 'PORTADA') {
        speechScript = `Portal de Acceso del Instituto Nacional de Transporte Terrestre. Selecciona a tu cadete de seguridad vial y pulsa ingresar para acceder a las 15 misiones de la Ley de Transporte Terrestre.`;
      } else if (currentScreen === 'GAMEPLAY') {
        const ch = CHALLENGES[currentChallengeIndex];
        speechScript = `${ch.chapter}. ${ch.title}. ${ch.question}`;
      } else if (currentScreen === 'VIRTUAL_STREET_SIM') {
        speechScript = `Simulador 3D en tiempo real con imágenes fotorrealistas. Respeta los límites de velocidad, zonas escolares y prioridad de paso.`;
      } else if (currentScreen === 'INTT_RULES_HUB') {
        speechScript = `Compendio normativo oficial del INTT. Conoce las señales de tránsito y artículos de la Ley de Transporte Terrestre.`;
      } else {
        speechScript = `Expediente y credencial digital oficial para ${playerAlias}. Puntos acumulados: ${puntosSeguridad}. Rango: ${nivelPatrullero}.`;
      }
      handleSpeak(speechScript);
    }
  };

  const handleToggleMute = () => {
    const muted = soundManager.toggleMute();
    setIsAudioMuted(muted);
    if (muted) setIsTtsSpeaking(false);
  };

  // Welcome narration on initial load
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSpeak(
        `Bienvenido al Portal Oficial INTT Ruta Segura. Segurito te da la bienvenida en el video animado de la parte superior. Dale reproducir para escucharlo o selecciona tu cadete para ingresar a las 15 misiones.`
      );
    }, 800);
    return () => clearTimeout(timer);
  }, [handleSpeak]);

  // Handle answering challenge in gameplay
  const handleAnswerChallenge = (isCorrect: boolean, earnedPoints: number, feedback: string) => {
    if (isCorrect) {
      setPuntosSeguridad((prev) => prev + earnedPoints);
      setRachaAciertos((prev) => prev + 1);

      // Unlock badges based on chapters
      const ch = CHALLENGES[currentChallengeIndex];
      const newBadges = [...insignias];
      if (ch.chapter_number === 1 && !newBadges.includes('Guardián del Cruce Cebra')) {
        newBadges.push('Guardián del Cruce Cebra');
      }
      if (ch.chapter_number === 2 && !newBadges.includes('Experto en Señalización INTT')) {
        newBadges.push('Experto en Señalización INTT');
      }
      if (ch.chapter_number === 3 && !newBadges.includes('Casco y Cinto Homologado')) {
        newBadges.push('Casco y Cinto Homologado');
      }
      if (ch.chapter_number === 4 && !newBadges.includes('Conductor Cero Celular')) {
        newBadges.push('Conductor Cero Celular');
      }
      if (ch.chapter_number === 5 && !newBadges.includes('Preferencia en Rotondas')) {
        newBadges.push('Preferencia en Rotondas');
      }
      if (ch.chapter_number === 10 && !newBadges.includes('Especialista en Zonas Escolares')) {
        newBadges.push('Especialista en Zonas Escolares');
      }
      if (ch.chapter_number === 15 && !newBadges.includes('Patrullero Graduado INTT')) {
        newBadges.push('Patrullero Graduado INTT');
      }
      setInsignias(newBadges);

      // Unlock licenses
      const newLic = [...licencias];
      if (puntosSeguridad + earnedPoints >= 200 && !newLic.includes('Certificado de Conducción Básica INTT')) {
        newLic.push('Certificado de Conducción Básica INTT');
        soundManager.playLevelUp();
      }
      if (puntosSeguridad + earnedPoints >= 500 && !newLic.includes('Licencia Oficial de Patrullero Vial Urbano')) {
        newLic.push('Licencia Oficial de Patrullero Vial Urbano');
        soundManager.playLevelUp();
      }
      setLicencias(newLic);

      setWorldEvents([
        `Acierto vial validado: +${earnedPoints} PTS de Seguridad`,
        `Racha de aciertos: ${rachaAciertos + 1}`,
      ]);
    } else {
      setRachaAciertos(0);
      setWorldEvents([
        'Infracción registrada: Revisión de normativa INTT requerida',
        feedback.slice(0, 70) + '...',
      ]);
    }
  };

  const handleNextChallenge = () => {
    if (currentChallengeIndex < CHALLENGES.length - 1) {
      setCurrentChallengeIndex((prev) => prev + 1);
    } else {
      setCurrentScreen('SUMMARY');
      soundManager.playLevelUp();
      handleSpeak(
        `¡Felicidades, Patrullero ${playerAlias}! Has completado las 15 Misiones de la Ley de Transporte Terrestre. Revisa tu credencial y licencia oficial del INTT.`
      );
    }
  };

  // Compile full Strict JSON telemetry object
  const strictJsonTelemetry = useMemo(() => {
    const activeChallenge = CHALLENGES[currentChallengeIndex] || CHALLENGES[0];
    return {
      screen_type: currentScreen,
      audio_narration: isTtsSpeaking
        ? 'Reproducción activa de síntesis vocal en español latino...'
        : `Guion activo para la pantalla ${currentScreen} en contexto de educación y ciudadanía vial amparado en el INTT.`,
      active_date_info: {
        current_date: simulatedDate,
      },
      avatar_selection_screen: {
        title: 'Portada de Acceso & Selección de Cadete INTT',
        avatars: AVATARS.map((av) => ({
          id: av.id,
          name: av.name,
          title: av.title,
          perk: av.perk,
          stats: av.stats,
          theme_color: av.theme_color,
          '3d_render_prompt': av.render_prompt,
          audio_quote: av.audio_quote,
        })),
      },
      hud_update: {
        active_avatar: currentAvatar.name,
        player_alias: playerAlias,
        puntos_seguridad: puntosSeguridad,
        racha_aciertos: rachaAciertos,
        nivel_patrullero: nivelPatrullero,
        insignias_obtenidas: `${insignias.length}/7`,
      },
      main_modal: {
        title: activeChallenge.title,
        chapter_number: activeChallenge.chapter_number,
        total_chapters: CHALLENGES.length,
        intt_article_context: activeChallenge.intt_article_context,
        visual_scene_3d_description: activeChallenge.visual_scene_3d_description,
        challenge_type: activeChallenge.challenge_type,
        question: activeChallenge.question,
        options: activeChallenge.options,
        correct_option_id: activeChallenge.correct_option_id,
      },
      intt_educational_card: activeChallenge.intt_educational_card,
      world_events: worldEvents,
    };
  }, [
    currentScreen,
    isTtsSpeaking,
    simulatedDate,
    currentAvatar,
    playerAlias,
    puntosSeguridad,
    rachaAciertos,
    nivelPatrullero,
    insignias,
    currentChallengeIndex,
    worldEvents,
  ]);

  return (
    <div className="min-h-screen bg-[#f0f6fe] text-slate-900 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Top Header HUD (Conditionally shows tabs only when outside Portada) */}
      <HeaderNav
        hud={hud}
        currentScreen={currentScreen}
        onNavigate={(screen) => {
          soundManager.stopSpeaking();
          setIsTtsSpeaking(false);
          setCurrentScreen(screen);
        }}
        isTtsSpeaking={isTtsSpeaking}
        onToggleTts={handleToggleTts}
        isAudioMuted={isAudioMuted}
        onToggleMute={handleToggleMute}
        onOpenJsonModal={() => setIsJsonModalOpen(true)}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {currentScreen === 'PORTADA' && (
          <AvatarSelectionScreen
            selectedAvatarId={selectedAvatarId}
            playerAlias={playerAlias}
            onSelectAvatar={(id) => {
              setSelectedAvatarId(id);
              const matched = AVATARS.find((a) => a.id === id);
              if (matched) {
                setPlayerAlias(matched.name.split(' ')[0]);
                handleSpeak(matched.audio_quote);
              }
            }}
            onUpdateAlias={(alias) => setPlayerAlias(alias)}
            onStartGame={() => {
              soundManager.stopSpeaking();
              setIsTtsSpeaking(false);
              setCurrentScreen('GAMEPLAY');
            }}
            onPlayQuote={(quote) => handleSpeak(quote)}
          />
        )}

        {currentScreen === 'GAMEPLAY' && (
          <GameplayScreen
            currentChallengeIndex={currentChallengeIndex}
            avatar={currentAvatar}
            playerAlias={playerAlias}
            onAnswerChallenge={handleAnswerChallenge}
            onNextChallenge={handleNextChallenge}
            onSelectChallengeIndex={(idx) => setCurrentChallengeIndex(idx)}
            onNarrate={handleSpeak}
          />
        )}

        {currentScreen === 'VIRTUAL_STREET_SIM' && (
          <VirtualStreetSimulator
            avatar={currentAvatar}
            playerAlias={playerAlias}
            onAddScore={(pts) => setPuntosSeguridad((prev) => prev + pts)}
            onNarrate={handleSpeak}
          />
        )}

        {currentScreen === 'INTT_RULES_HUB' && (
          <INTTRulesHub onNarrate={handleSpeak} />
        )}

        {currentScreen === 'SUMMARY' && (
          <SummaryProfileScreen
            hud={hud}
            avatar={currentAvatar}
            onResetProgress={() => {
              setPuntosSeguridad(0);
              setRachaAciertos(0);
              setCurrentChallengeIndex(0);
            }}
            onNarrate={handleSpeak}
          />
        )}
      </main>

      {/* Strict JSON Telemetry Modal */}
      <JsonTelemetryModal
        isOpen={isJsonModalOpen}
        onClose={() => setIsJsonModalOpen(false)}
        jsonData={strictJsonTelemetry}
      />

      {/* Footer */}
      <footer className="w-full border-t border-blue-200 py-4 px-6 text-center text-xs font-mono text-blue-900 bg-white shadow-inner">
        <p className="font-semibold">
          INTT RUTA SEGURA: EDUCACIÓN Y CIUDADANÍA VIAL • 15 MISIONES REGLAMENTARIAS
        </p>
        <p className="text-[11px] text-slate-500 mt-0.5">
          Instituto Nacional de Transporte Terrestre • Ministerio del Poder Popular para Relaciones Interiores, Justicia y Paz • Venezuela
        </p>
      </footer>
    </div>
  );
}
