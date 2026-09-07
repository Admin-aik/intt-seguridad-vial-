export type ScreenType = 'PORTADA' | 'GAMEPLAY' | 'INTT_RULES_HUB' | 'VIRTUAL_STREET_SIM' | 'SUMMARY';

export type AvatarId = 'ircar' | 'jorge' | 'ivan' | 'carlos';

export interface AvatarStats {
  prevencion: number;
  logica_vial: number;
  reaccion: number;
  normativa_intt: number;
}

export interface AvatarData {
  id: AvatarId;
  name: string;
  title: string;
  perk: string;
  stats: AvatarStats;
  theme_color: string;
  glow_class: string;
  image_url: string;
  description: string;
  render_prompt: string;
  audio_quote: string;
  role_focus: string;
  badge_name: string;
}

export interface ChallengeOption {
  id: number;
  text: string;
  feedback_immediate: string;
  reward_if_correct: {
    puntos_seguridad: number;
  };
}

export interface INTEducationalCard {
  show_card: boolean;
  topic: string;
  official_rule: string;
  key_learnings: string[];
}

export interface Challenge {
  id: number;
  chapter: string;
  chapter_number: number;
  title: string;
  intt_article_context: string;
  visual_scene_3d_description: string;
  challenge_type:
    | 'Reconocimiento de Señales'
    | 'Prioridad de Paso'
    | 'Uso de Elementos de Protección'
    | 'Cero Distracciones'
    | 'Límites de Velocidad & Convivencia'
    | 'Maniobras y Adelantamientos'
    | 'Condiciones Adversas y Clima'
    | 'Seguridad en Motocicletas y Ciclovías'
    | 'Alcohol Cero y Sustancias'
    | 'Inspección Técnica Vehicular'
    | 'Puntos Ciegos y Vehículos Pesados'
    | 'Normas en Autopistas y Canales'
    | 'Cruce Ferroviario y Puentes'
    | 'Primeros Auxilios y Emergencias'
    | 'Documentación y Licencias INTT';
  question: string;
  options: ChallengeOption[];
  correct_option_id: number;
  intt_educational_card: INTEducationalCard;
  scene_mode: 'pedestrian_crossing' | 'traffic_signals' | 'passenger_seat' | 'checkpoint_inspection' | 'school_zone';
  applicable_avatar_perk?: AvatarId;
}

export interface GameHUD {
  active_avatar: string;
  player_alias: string;
  puntos_seguridad: number;
  racha_aciertos: number;
  nivel_patrullero: 'Peatón Consciente' | 'Ciclista Seguro' | 'Conductor Junior' | 'Patrullero Vial Elite';
  insignias_recolectadas: string[];
  licencias_desbloqueadas: string[];
  simulated_date: string;
}

export interface INTTSign {
  id: string;
  code: string;
  name: string;
  category: 'reglamentaria' | 'preventiva' | 'informativa';
  description: string;
  article: string;
  penalty?: string;
  shape: 'octagonal' | 'circular' | 'diamond' | 'rectangular';
  bg_color: string;
  border_color: string;
  symbol: string;
}

export interface INTTLawArticle {
  number: string;
  title: string;
  summary: string;
  official_quote: string;
  category: 'Peatones' | 'Ciclistas' | 'Motociclistas' | 'Conductores' | 'Velocidades' | 'Dispositivos de Seguridad';
}
