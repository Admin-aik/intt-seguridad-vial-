import { AvatarData } from '../types';
import ircarImg from '../assets/images/ircar_avatar_3d_1788438153012.jpg';
import jorgeImg from '../assets/images/jorge_avatar_3d_1788438171754.jpg';
import ivanImg from '../assets/images/ivan_avatar_3d_1788438187069.jpg';
import carlosImg from '../assets/images/carlos_avatar_3d_1788438203347.jpg';

export const AVATARS: AvatarData[] = [
  {
    id: 'ircar',
    name: 'Ircar',
    title: 'Cadete de Movilidad Peatonal & Bici-Ruta Segura',
    description:
      'Cadete líder en movilidad activa, inclusión y pacificación del tránsito. Con su chaleco cian de alta reflectividad y casco homologado, Ircar orienta a peatones, personas con discapacidad y ciclistas urbanos para cruzar siempre por el rayado peatonal (paso cebra) y exigir su preferencia de paso.',
    perk: 'Escudo Reflectivo INTT (+50 PTS en cruces peatonales y ciclovías)',
    stats: {
      prevencion: 90,
      logica_vial: 85,
      reaccion: 80,
      normativa_intt: 85,
    },
    theme_color: '#0284c7',
    glow_class: 'neon-border-cyan text-[#0284c7]',
    image_url: ircarImg,
    render_prompt:
      'Retrato 3D estilo película animada de Ircar con casco aerodinámico de ciclista y chaleco de alta visibilidad cian y azul marino, en un cruce peatonal de Caracas con luz solar cálida.',
    audio_quote:
      '¡Prioridad al peatón y al ciclista! Protejamos nuestras vidas respetando la vía y utilizando los cruces demarcados.',
    role_focus:
      'Prioridad peatonal, movilidad activa en bicicleta, uso de cascos reglamentarios homologados y paso de peatones (paso cebra).',
    badge_name: 'Guardián del Paso Cebra',
  },
  {
    id: 'jorge',
    name: 'Jorge',
    title: 'Especialista en Señalización Vial & Telemetría Urbana',
    description:
      'Joven estratega y monitor vial dotado con visor y escáner digital de señales. Jorge interpreta y audita en tiempo real las señales Reglamentarias, Preventivas e Informativas del INTT, garantizando que conductores y peatones decodifiquen los semáforos, rotondas y límites de velocidad antes de cualquier maniobra.',
    perk: 'Radar Detector de Señales (+50 PTS y lectura instantánea de normas)',
    stats: {
      prevencion: 85,
      logica_vial: 98,
      reaccion: 85,
      normativa_intt: 90,
    },
    theme_color: '#c026d3',
    glow_class: 'neon-border-fuchsia text-[#c026d3]',
    image_url: jorgeImg,
    render_prompt:
      'Render 3D estilo animación Pixar de Jorge sosteniendo un escáner digital de señalización vial reflectiva con gorra oficial del INTT en una intersección semaforizada.',
    audio_quote:
      'Las señales viales no son sugerencias: son normas del INTT diseñadas para salvar vidas en cada segundo.',
    role_focus:
      'Reconocimiento de señalización oficial (R-1, P-1, I-1), ciclo semafórico, preferencia en rotondas e intersecciones complejas.',
    badge_name: 'Maestro de la Señalización Vial',
  },
  {
    id: 'ivan',
    name: 'Ivan',
    title: 'Auditor de Seguridad Pasiva & Prevención de Distracciones',
    description:
      'Riguroso auditor vial enfocado en los dispositivos de protección a bordo. Ivan verifica el anclaje del cinturón de seguridad de tres puntos en todos los asientos, los sistemas de retención infantil y combate con firmeza la conducción con teléfono celular u otros dispositivos distractores.',
    perk: 'Sensor de Cinto & Cero Celular (+20% racha de aciertos en cabina)',
    stats: {
      prevencion: 98,
      logica_vial: 85,
      reaccion: 92,
      normativa_intt: 90,
    },
    theme_color: '#f59e0b',
    glow_class: 'neon-border-amber text-[#f59e0b]',
    image_url: ivanImg,
    render_prompt:
      'Personaje 3D de Ivan mostrando el broche de un cinturón de seguridad de tres puntos con chaleco de seguridad amarillo ámbar y gesto de pulgar arriba.',
    audio_quote:
      'El cinturón de tres puntos y la atención total sin distracciones móviles son nuestra primera e indiscutible línea de defensa.',
    role_focus:
      'Uso universal del cinturón de tres puntos, sillas infantiles homologadas, prohibición total del celular al volante (Art. 169 INTT) y seguridad de pasajeros.',
    badge_name: 'Auditor de Seguridad Pasiva',
  },
  {
    id: 'carlos',
    name: 'Carlos',
    title: 'Inspector Técnico & Perito en Ley de Transporte Terrestre',
    description:
      'Cadete superior y perito en marco regulatorio del INTT. Carlos domina a la perfección los artículos de la Ley de Transporte Terrestre, los protocolos en puntos de control, los límites de velocidad por zona (15 km/h escolar hasta autopista) y las normas de cero alcohol y tolerancia a sustancias.',
    perk: 'Compendio Legal INTT (Doble puntaje en Reglamento y Ley de Tránsito)',
    stats: {
      prevencion: 85,
      logica_vial: 90,
      reaccion: 88,
      normativa_intt: 99,
    },
    theme_color: '#059669',
    glow_class: 'neon-border-emerald text-[#059669]',
    image_url: carlosImg,
    render_prompt:
      'Render 3D de Carlos con uniforme azul oscuro del INTT, detalles esmeralda y gorra de oficial, sosteniendo el manual de la Ley de Transporte Terrestre con orgullo.',
    audio_quote:
      'Conocer la Ley de Transporte Terrestre y sus sanciones nos empodera como ciudadanos ejemplares en cualquier calzada.',
    role_focus:
      'Límites de velocidad reglamentarios, alcoholemia cero, protocolos de inspección vehicular y sanciones según la Ley de Transporte Terrestre.',
    badge_name: 'Perito Legal del INTT',
  },
];
