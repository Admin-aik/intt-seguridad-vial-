import { Challenge } from '../types';

export const CHALLENGES: Challenge[] = [
  {
    id: 1,
    chapter: 'Capítulo 1: El Cruce Peatonal Seguro y la Prioridad Vial',
    chapter_number: 1,
    title: 'Intersección Avenida Bolívar: Peatón en el Paso Cebra',
    intt_article_context: 'Ley de Transporte Terrestre de Venezuela — Artículos 22, 23 y 73',
    visual_scene_3d_description:
      'Cruce urbano 3D con demarcación cebra en el pavimento. Escolares y un adulto mayor inician el cruce mientras un vehículo se aproxima desacelerando a 25 metros de la línea blanca de detención.',
    challenge_type: 'Prioridad de Paso',
    question:
      'Un peatón está iniciando el cruce demarcado (paso cebra) sin semáforo vehicular activo. ¿Cuál es la conducta vial obligatoria amparada por las leyes del INTT?',
    options: [
      {
        id: 1,
        text: 'Acelerar antes de que el peatón ocupe completamente el canal para no detener el flujo vehicular.',
        feedback_immediate:
          'Infracción grave. Tocar corneta o acelerar vulnera la integridad física del peatón y viola la prioridad absoluta consagrada en el Art. 73 de la Ley de Transporte Terrestre.',
        reward_if_correct: { puntos_seguridad: 0 },
      },
      {
        id: 2,
        text: 'Detener por completo el vehículo antes de la línea de parada continua, permitiendo el cruce seguro y libre de intimidación.',
        feedback_immediate:
          '¡Respuesta Correcta y Cívica! Conforme al Artículo 73 del INTT, el peatón goza de prioridad de paso incondicional en pasos de cebra demarcados.',
        reward_if_correct: { puntos_seguridad: 100 },
      },
      {
        id: 3,
        text: 'Esquivar al peatón invadiendo el canal en sentido contrario si está despejado.',
        feedback_immediate:
          'Peligro inminente de colisión frontal. Invadir el canal opuesto en un paso peatonal está expresamente prohibido por el Reglamento de Tránsito.',
        reward_if_correct: { puntos_seguridad: 0 },
      },
    ],
    correct_option_id: 2,
    intt_educational_card: {
      show_card: true,
      topic: 'Preferencia Peatonal y Demarcación Cebra',
      official_rule:
        'Ley de Transporte Terrestre (Art. 73): Los peatones tienen derecho a circular con seguridad. Todo conductor debe ceder el paso en zonas peatonales no semaforizadas y ante escolares o personas de movilidad reducida.',
      key_learnings: [
        'Nunca adelantar a un vehículo que se haya detenido ante un paso de peatones.',
        'Hacer contacto visual con el transeúnte confirmando la detención segura.',
        'La línea continua previa al cebra debe respetarse sin pisarla ni invadirla.',
      ],
    },
    scene_mode: 'pedestrian_crossing',
    applicable_avatar_perk: 'ircar',
  },
  {
    id: 2,
    chapter: 'Capítulo 2: Clasificación Oficial de Señales de Tránsito INTT',
    chapter_number: 2,
    title: 'Visor Radar: Señal Octagonal Roja vs Señal Rombo Amarilla',
    intt_article_context: 'Manual Venezolano de Dispositivos Uniformes para el Tránsito & Art. 67 Ley INTT',
    visual_scene_3d_description:
      'Un visor escanea un poste vial con dos señales: una octagonal roja con letras blancas (R-1) y a 100 metros un rombo amarillo con pictograma de zona escolar (P-11).',
    challenge_type: 'Reconocimiento de Señales',
    question:
      'Según la clasificación oficial del INTT de Venezuela, ¿a qué categoría pertenece la señal roja octagonal "PARE" (R-1) y cuál es su mandato legal?',
    options: [
      {
        id: 1,
        text: 'Es una señal Preventiva; aconseja moderar un poco la marcha únicamente si viene otro vehículo visible.',
        feedback_immediate:
          'Error conceptual. Las señales rojas son REGLAMENTARIAS. No son sugerencias; su desacato constituye infracción sancionada con Unidades Tributarias.',
        reward_if_correct: { puntos_seguridad: 0 },
      },
      {
        id: 2,
        text: 'Es una señal Reglamentaria; exige detención total (0 km/h) obligatoria, verificar ambos lados de la vía y reanudar solo con plena seguridad.',
        feedback_immediate:
          '¡Correcto! Las señales Reglamentarias (Serie R del INTT) son mandatos u órdenes directas para preservar la vida humana en intersecciones.',
        reward_if_correct: { puntos_seguridad: 100 },
      },
      {
        id: 3,
        text: 'Es una señal Informativa que únicamente notifica la proximidad de un módulo policial o peaje.',
        feedback_immediate:
          'Incorrecto. Las señales informativas (Serie I) son de fondo azul o verde y tienen propósitos de guía y servicios.',
        reward_if_correct: { puntos_seguridad: 0 },
      },
    ],
    correct_option_id: 2,
    intt_educational_card: {
      show_card: true,
      topic: 'Trilogía Cromática del Sistema de Señalización INTT',
      official_rule:
        'Norma Técnica INTT: Reglamentarias (Rojo/Blanco: Obligan o Prohíben), Preventivas (Amarillo/Negro: Advierten riesgo próximo), Informativas (Azul/Verde: Servicios y Destinos).',
      key_learnings: [
        'Señales Reglamentarias: Su desacato acarrea multas y retención preventiva del vehículo.',
        'Señales Preventivas: Exigen reducir velocidad a 30 km/h o la fijada para la condición.',
        'La señal de PARE obliga a frenado completo a cero aunque el cruce luzca solitario.',
      ],
    },
    scene_mode: 'traffic_signals',
    applicable_avatar_perk: 'jorge',
  },
  {
    id: 3,
    chapter: 'Capítulo 3: Dispositivos de Seguridad Pasiva & Protección',
    chapter_number: 3,
    title: 'Auditoría Vehicular: Pasajeros Traseros y Casco de Motorizado',
    intt_article_context: 'Ley de Transporte Terrestre — Artículos 168 (numeral 26) y Reglamentación de Seguridad Pasiva',
    visual_scene_3d_description:
      'Inspección en cabina vehicular: en el auto, pasajeros en el asiento trasero dudan sobre colocarse el cinturón; al lado, un motorizado porta un casco suelto sin abrochar.',
    challenge_type: 'Uso de Elementos de Protección',
    question:
      '¿Qué establece la normativa del INTT sobre el uso del cinturón de seguridad y el equipo de protección para motociclistas en Venezuela?',
    options: [
      {
        id: 1,
        text: 'El cinturón es obligatorio únicamente para el piloto en autopistas, y los motorizados pueden usar cualquier tipo de gorra o casco sin abrochar.',
        feedback_immediate:
          'Falso y peligroso. El cinturón protege en todos los asientos contra el impacto interior, y los cascos no homologados carecen de absorción craneal.',
        reward_if_correct: { puntos_seguridad: 0 },
      },
      {
        id: 2,
        text: 'El cinturón de 3 puntos es obligatorio para piloto y TODOS los acompañantes (delanteros y traseros); motorizado y parrillero deben portar casco integral homologado debidamente abrochado.',
        feedback_immediate:
          '¡Preciso y vital! El INTT exige cinturón para todos los ocupantes del vehículo y casco certificado cerrado y abrochado para ambos ocupantes de la moto.',
        reward_if_correct: { puntos_seguridad: 100 },
      },
      {
        id: 3,
        text: 'Los niños menores de 10 años pueden viajar en el asiento delantero si un adulto los sostiene con los brazos.',
        feedback_immediate:
          'Infracción crítica. Los niños menores de 10 años deben viajar en los asientos traseros con sistemas de retención infantil (sillas homologadas).',
        reward_if_correct: { puntos_seguridad: 0 },
      },
    ],
    correct_option_id: 2,
    intt_educational_card: {
      show_card: true,
      topic: 'Sistemas de Retención y Cascos Homologados',
      official_rule:
        'Ley de Transporte Terrestre: Es infracción conducir sin el cinturón de seguridad o permitir que los ocupantes no lo usen. Para motos: obligatorio casco integral con barbiquejo abrochado.',
      key_learnings: [
        'En un impacto a 50 km/h, un pasajero sin cinturón multiplica su peso hasta 40 veces.',
        'El casco de moto no abrochado se desprende milisegundos antes del impacto craneal.',
        'El uso del chaleco reflectivo nocturno reduce la siniestralidad de motociclistas en más del 60%.',
      ],
    },
    scene_mode: 'passenger_seat',
    applicable_avatar_perk: 'ivan',
  },
  {
    id: 4,
    chapter: 'Capítulo 4: Conducción Preventiva, Velocidades y Cero Distracción',
    chapter_number: 4,
    title: 'Avenida Metropolitana: Alerta de Zona Escolar y Notificación Celular',
    intt_article_context: 'Ley de Transporte Terrestre — Artículos 120, 169 y 170 (Sanciones por Imprudencia y Distracción)',
    visual_scene_3d_description:
      'Vista de cabina a través del parabrisas. Se avista un aviso de Zona Escolar (30 km/h). En ese momento, el teléfono móvil del conductor emite una notificación de llamada insistente.',
    challenge_type: 'Cero Distracciones',
    question:
      'A 50 metros de una zona escolar con horario de salida de clases, suena tu celular. ¿Cuál es el procedimiento legal y preventivo según la normativa INTT?',
    options: [
      {
        id: 1,
        text: 'Revisar rápidamente la pantalla manteniendo el volante con una sola mano y reduciendo la velocidad a 45 km/h.',
        feedback_immediate:
          'Grave peligro. Apartar la vista del camino 3 segundos a 45 km/h equivale a avanzar 40 metros a ciegas frente a una escuela. El uso manual del celular está terminantemente prohibido.',
        reward_if_correct: { puntos_seguridad: 0 },
      },
      {
        id: 2,
        text: 'Reducir la marcha a un máximo de 30 km/h o menos, ignorar el teléfono móvil por completo y concentrar el 100% de la atención en la vía.',
        feedback_immediate:
          '¡Conducta Ejemplar de Patrullero! La Ley INTT fija como tope máximo 30 km/h en zonas escolares y prohíbe el uso de dispositivos celulares durante la conducción.',
        reward_if_correct: { puntos_seguridad: 100 },
      },
      {
        id: 3,
        text: 'Tocar la corneta continuamente para despejar la calzada y contestar con altavoz mientras aceleras.',
        feedback_immediate:
          'Doble infracción: exceso de velocidad en zona escolar y uso indebido del claxon prohibido en áreas residenciales y educativas.',
        reward_if_correct: { puntos_seguridad: 0 },
      },
    ],
    correct_option_id: 2,
    intt_educational_card: {
      show_card: true,
      topic: 'Velocidades Reglamentarias del INTT y Cero Celular',
      official_rule:
        'Límites legales en Venezuela: 30 km/h en zonas escolares y residenciales; 40 km/h en calles urbanas; 60 km/h en avenidas; 80-120 km/h en autopistas. Prohibido manipular teléfonos al volante.',
      key_learnings: [
        'A 30 km/h, la probabilidad de supervivencia de un peatón atropellado es del 90%; a 60 km/h es menor al 15%.',
        'La distracción por celular multiplica por 4 el riesgo de colisión vehicular.',
        'Si la llamada es urgente, se debe orillar el auto en un lugar permitido antes de atender.',
      ],
    },
    scene_mode: 'school_zone',
    applicable_avatar_perk: 'carlos',
  },
  {
    id: 5,
    chapter: 'Capítulo 5: Rotondas, Intersecciones y Vehículos de Emergencia',
    chapter_number: 5,
    title: 'Distribuidor Vial 3D: Rotonda con Sirena de Ambulancia',
    intt_article_context: 'Reglamento de la Ley de Tránsito Terrestre — Circulación en Glorietas y Art. 85 Prioridad de Emergencias',
    visual_scene_3d_description:
      'Simulación de una rotonda de dos canales. Un vehículo circula dentro del anillo, otro intenta entrar, y por el canal derecho se aproxima una ambulancia con luces estroboscópicas y sirena audible.',
    challenge_type: 'Prioridad de Paso',
    question:
      'Estás dentro de la rotonda y escuchas la sirena de una ambulancia que se acerca desde la transversal. ¿Cuál es la maniobra legal indicada por el INTT?',
    options: [
      {
        id: 1,
        text: 'Acelerar a fondo para salir de la rotonda antes que la ambulancia y no interrumpir tu propia marcha.',
        feedback_immediate:
          'Peligroso. Intentar ganar el paso a un vehículo de emergencia suele provocar colisiones laterales graves en glorietas.',
        reward_if_correct: { puntos_seguridad: 0 },
      },
      {
        id: 2,
        text: 'Ceder el paso de inmediato orillándose de forma segura hacia el borde derecho, despejando la trayectoria de la ambulancia y deteniendo la marcha si es preciso.',
        feedback_immediate:
          '¡Correcto! Los vehículos de emergencia (ambulancias, bomberos, patrullas con sirena y baliza activa) tienen prioridad absoluta de circulación.',
        reward_if_correct: { puntos_seguridad: 100 },
      },
      {
        id: 3,
        text: 'Frenar de golpe en el medio del canal rápido de la rotonda sin orillarte a ningún lado.',
        feedback_immediate:
          'Frenar abruptamente en medio de la calzada sin advertencia previa crea un obstáculo ciego peligroso para la propia ambulancia.',
        reward_if_correct: { puntos_seguridad: 0 },
      },
    ],
    correct_option_id: 2,
    intt_educational_card: {
      show_card: true,
      topic: 'Prioridad de Paso en Rotondas y Vehículos de Emergencia',
      official_rule:
        'Regla INTT: Tiene preferencia quien circula dentro de la rotonda sobre quien desea incorporarse. Sin embargo, todo conductor DEBE ceder el paso a unidades de auxilio o emergencia con sirena encendida.',
      key_learnings: [
        'En rotondas: Mirar espejos y anticipar la salida con la luz de cruce (direccional) derecha.',
        'Al oír sirenas: Reducir velocidad de inmediato y despejar el carril izquierdo/central.',
        'Nunca bloquear una intersección ante un semáforo si una unidad médica necesita avanzar.',
      ],
    },
    scene_mode: 'checkpoint_inspection',
    applicable_avatar_perk: 'jorge',
  },
  {
    id: 6,
    chapter: 'Capítulo 6: Maniobras de Adelantamiento Seguro y Líneas Viales',
    chapter_number: 6,
    title: 'Carretera Nacional: Línea Continua Amarilla y Curva Próxima',
    intt_article_context: 'Ley de Transporte Terrestre — Artículos 78 y 79 (Maniobras de Adelantamiento y Demarcación)',
    visual_scene_3d_description:
      'Tramo carretero bidireccional en subida con línea central amarilla CONTINUA. Adelante circula un camión de carga pesada a 30 km/h; una curva ciega se aproxima a 70 metros.',
    challenge_type: 'Maniobras y Adelantamientos',
    question:
      'Circulas detrás de un vehículo lento en una vía con línea continua amarilla y curva cercana. ¿Permite la ley del INTT realizar el adelantamiento?',
    options: [
      {
        id: 1,
        text: 'Sí, siempre que toques la corneta tres veces y aceleres rápidamente antes de entrar a la curva.',
        feedback_immediate:
          'Gravísima infracción. La línea continua PROHÍBE taxativamente el adelantamiento debido a visibilidad nula en curvas.',
        reward_if_correct: { puntos_seguridad: 0 },
      },
      {
        id: 2,
        text: 'No. La línea continua prohíbe el sobrepaso; se debe mantener la distancia de seguridad hasta encontrar zona demarcada con línea discontinua y visibilidad despejada.',
        feedback_immediate:
          '¡Excelente decisión preventiva! El adelantamiento en curva o línea continua es una de las principales causas de choque frontal fatal en carreteras.',
        reward_if_correct: { puntos_seguridad: 100 },
      },
      {
        id: 3,
        text: 'Sí, pero solo si el camión saca la mano por la ventana indicando que puedes pasar.',
        feedback_immediate:
          'Falso. Ninguna seña informal anula la demarcación reglamentaria de la línea continua establecida por el INTT.',
        reward_if_correct: { puntos_seguridad: 0 },
      },
    ],
    correct_option_id: 2,
    intt_educational_card: {
      show_card: true,
      topic: 'Reglas de Demarcación Longitudinal y Adelantamiento',
      official_rule:
        'LTT Art. 78: Queda prohibido adelantar en curvas, pendientes, intersecciones o puentes, y en todo tramo donde exista línea longitudinal continua sencilla o doble.',
      key_learnings: [
        'Línea continua: Prohibición absoluta de rebasar o invadir el canal contrario.',
        'Línea discontinua: Permite adelantar solo cuando no se aproxime vehículo en sentido opuesto.',
        'Doble línea (una continua y una discontinua): Solo puede rebasar quien tiene la línea discontinua a su lado.',
      ],
    },
    scene_mode: 'checkpoint_inspection',
    applicable_avatar_perk: 'ircar',
  },
  {
    id: 7,
    chapter: 'Capítulo 7: Conducción Nocturna y Uso Reglamentario de Luces',
    chapter_number: 7,
    title: 'Tramo Nocturno Interurbano: Cruce de Vehículo en Sentido Contrario',
    intt_article_context: 'Ley de Transporte Terrestre — Artículo 82 (Dispositivos de Alumbrado y Visibilidad Nocturna)',
    visual_scene_3d_description:
      'Conducción nocturna con luces altas en carretera abierta. A 150 metros se divisa un automóvil aproximándose en sentido opuesto por su canal.',
    challenge_type: 'Condiciones Adversas y Clima',
    question:
      'Al conducir de noche con luces altas (largas) y aproximarse un vehículo en sentido contrario, ¿cuál es el protocolo exigido por el INTT?',
    options: [
      {
        id: 1,
        text: 'Mantener las luces altas fijas para obligar al otro conductor a reducir su velocidad.',
        feedback_immediate:
          'Infracción peligrosa. Deslumbrar al conductor contrario provoca ceguera temporal de hasta 5 segundos y riesgo inminente de impacto.',
        reward_if_correct: { puntos_seguridad: 0 },
      },
      {
        id: 2,
        text: 'Cambiar de luces altas a luces bajas (cortas) a una distancia mínima de 150 metros, dirigiendo la vista hacia la línea de borde derecha de tu canal.',
        feedback_immediate:
          '¡Correcto! El cambio oportuno a luces bajas evita el encandilamiento y garantiza que ambos conductores mantengan la visibilidad de su carril.',
        reward_if_correct: { puntos_seguridad: 100 },
      },
      {
        id: 3,
        text: 'Apagar completamente las luces durante 3 segundos para que los ojos se acostumbren a la oscuridad.',
        feedback_immediate:
          'Maniobra temeraria y suicida. Conducir a oscuras es causal directa de retención del vehículo por negligencia extrema.',
        reward_if_correct: { puntos_seguridad: 0 },
      },
    ],
    correct_option_id: 2,
    intt_educational_card: {
      show_card: true,
      topic: 'Protocolo de Luces Reglamentarias y Anti-Deslumbramiento',
      official_rule:
        'Art. 82 LTT: Es obligatorio encender las luces bajas desde las 6:00 pm hasta las 6:00 am, o bajo lluvia y niebla. Las luces altas deben sustituirse por bajas al cruzarse con otro vehículo.',
      key_learnings: [
        'La recuperación visual tras un deslumbramiento puede tomar de 3 a 7 segundos.',
        'En zonas urbanas iluminadas está prohibido circular con luces altas permanentes.',
        'Verificar el reglaje de altura de los faros para no apuntar directamente al parabrisas ajeno.',
      ],
    },
    scene_mode: 'traffic_signals',
    applicable_avatar_perk: 'ivan',
  },
  {
    id: 8,
    chapter: 'Capítulo 8: Clima Adverso: Lluvia Torrencial e Hidroplaneo',
    chapter_number: 8,
    title: 'Autopista bajo Lluvia Intensa: Acumulación de Agua en Calzada',
    intt_article_context: 'Ley de Transporte Terrestre — Artículo 119 (Precauciones bajo Factores Meteorológicos)',
    visual_scene_3d_description:
      'Autopista durante un fuerte aguacero tropical. El asfalto muestra charcos profundos reflectantes y la dirección del vehículo se siente flotante o sin tracción (aquaplaning).',
    challenge_type: 'Condiciones Adversas y Clima',
    question:
      'Si el vehículo experimenta hidroplaneo (las ruedas flotan sobre la película de agua perdiendo tracción), ¿cómo se debe actuar?',
    options: [
      {
        id: 1,
        text: 'Frenar a fondo bruscamente y girar con fuerza el volante para salir del charco.',
        feedback_immediate:
          'Error fatal. Bloquear los frenos o girar el volante durante el hidroplaneo causa trompos incontrolables y volcamientos.',
        reward_if_correct: { puntos_seguridad: 0 },
      },
      {
        id: 2,
        text: 'Mantener el volante firme y recto, soltar suavemente el pedal del acelerador sin frenar de golpe hasta que los neumáticos recuperen adherencia con el asfalto.',
        feedback_immediate:
          '¡Maniobra magistral de conductor defensivo! Desacelerar gradualmente sin volantazos permite que el peso del auto rompa la película de agua y retome agarre.',
        reward_if_correct: { puntos_seguridad: 100 },
      },
      {
        id: 3,
        text: 'Acelerar a fondo para que el giro rápido de la rueda expulse el agua hacia los costados.',
        feedback_immediate:
          'Peligrosísimo. Acelerar aumenta la pérdida de adherencia y hace imposible cualquier control direccional.',
        reward_if_correct: { puntos_seguridad: 0 },
      },
    ],
    correct_option_id: 2,
    intt_educational_card: {
      show_card: true,
      topic: 'Física del Hidroplaneo (Aquaplaning) y Lluvia',
      official_rule:
        'LTT Art. 119: Bajo lluvia, niebla o calzada mojada, la distancia de frenado se duplica. La velocidad debe reducirse al menos en un tercio respecto al límite ordinario.',
      key_learnings: [
        'Neumáticos con menos de 1.6 mm de labrado pierden la capacidad de desalojar agua.',
        'Aumentar la distancia con el auto precedente a no menos de 4 a 6 segundos.',
        'Encender luces bajas y limpiaparabrisas de inmediato al iniciar la lluvia.',
      ],
    },
    scene_mode: 'checkpoint_inspection',
    applicable_avatar_perk: 'carlos',
  },
  {
    id: 9,
    chapter: 'Capítulo 9: Normas de Circulación para Motocicletas y Parrilleros',
    chapter_number: 9,
    title: 'Corredor Urbano: Circulación por Canal y Uso de Chaleco',
    intt_article_context: 'Ley de Transporte Terrestre — Artículo 170 y Reglamento de Tránsito para Vehículos de 2 Ruedas',
    visual_scene_3d_description:
      'Tráfico denso en hora pico. Una motocicleta circula zigzagueando entre dos filas de vehículos parados, llevando un acompañante sin chaleco ni casco abrochado.',
    challenge_type: 'Seguridad en Motocicletas y Ciclovías',
    question:
      '¿Qué establece taxativamente el INTT respecto a la circulación de motocicletas en canales vehiculares y transporte de acompañantes?',
    options: [
      {
        id: 1,
        text: 'Las motos tienen derecho preferente a circular por las aceras peatonales si el tráfico de la calle está colapsado.',
        feedback_immediate:
          'Infracción gravísima. Invadir la acera peatonal con una moto atenta contra la vida de los transeúntes y acarrea retención de la unidad.',
        reward_if_correct: { puntos_seguridad: 0 },
      },
      {
        id: 2,
        text: 'Las motocicletas deben ocupar el centro del canal de circulación como cualquier vehículo, prohibiéndose el zigzagueo entre filas; ambos ocupantes deben portar casco y chaleco reflectivo reglamentario.',
        feedback_immediate:
          '¡Correcto! El INTT prohíbe el zigzagueo peligroso entre vehículos en marcha y exige ocupar el canal completo con elementos reflectantes certificados.',
        reward_if_correct: { puntos_seguridad: 100 },
      },
      {
        id: 3,
        text: 'Pueden viajar hasta 3 personas en la motocicleta si son familiares directos y no exceden 60 km/h.',
        feedback_immediate:
          'Estrictamente prohibido. La capacidad máxima de una motocicleta es de 2 personas; transportar niños o más de un pasajero es sanción legal severa.',
        reward_if_correct: { puntos_seguridad: 0 },
      },
    ],
    correct_option_id: 2,
    intt_educational_card: {
      show_card: true,
      topic: 'Seguridad Integral en Motocicletas INTT',
      official_rule:
        'LTT Art. 170: Los conductores de motocicletas deben ocupar el centro del canal, abstenerse de zigzaguear, usar casco abrochado, chaleco reflectante con serial de placa tras las 6:00 pm y transportar solo 1 acompañante.',
      key_learnings: [
        'Prohibido transportar niños menores de 10 años o mujeres embarazadas en motocicletas.',
        'La moto no debe circular por hombrillos ni aceras destinadas exclusivamente a peatones.',
        'El chaleco reflectivo permite ser visto a más de 150 metros en condiciones nocturnas.',
      ],
    },
    scene_mode: 'passenger_seat',
    applicable_avatar_perk: 'ircar',
  },
  {
    id: 10,
    chapter: 'Capítulo 10: Movilidad en Bicicleta, Ciclovías y Respeto al Ciclista',
    chapter_number: 10,
    title: 'Avenida con Ciclista: Adelantamiento y Distancia Lateral',
    intt_article_context: 'Ley de Transporte Terrestre — Artículo 74 (Protección a la Movilidad No Motorizada)',
    visual_scene_3d_description:
      'Un ciclista circula por el margen derecho de la calzada en una vía sin ciclovía segregada. Un automóvil se prepara para rebasarlo mientras viene tráfico en sentido contrario.',
    challenge_type: 'Seguridad en Motocicletas y Ciclovías',
    question:
      'Al adelantar a un ciclista en una vía compartida, ¿cuál es la distancia lateral mínima de seguridad reglamentaria exigida por normas de tránsito?',
    options: [
      {
        id: 1,
        text: 'Pasar a 30 centímetros rozando el pedal para obligar al ciclista a salirse de la vía.',
        feedback_immediate:
          'Conducta intimidatoria y delictiva. La turbulencia del vehículo a corta distancia puede desestabilizar al ciclista y causar su caída bajo las ruedas.',
        reward_if_correct: { puntos_seguridad: 0 },
      },
      {
        id: 2,
        text: 'Guardar una distancia lateral mínima de 1.5 metros, reduciendo la velocidad y ocupando parte del canal contiguo cuando esté despejado.',
        feedback_immediate:
          '¡Exacto y seguro! La distancia de 1.5 metros protege al ciclista de corrientes de aire y permite espacio para maniobras imprevistas ante baches.',
        reward_if_correct: { puntos_seguridad: 100 },
      },
      {
        id: 3,
        text: 'Tocar la corneta a 1 metro de su espalda para asustarlo y que se detenga.',
        feedback_immediate:
          'El uso sorpresivo del claxon tan cerca puede provocar que el ciclista pierda el equilibrio por sobresalto.',
        reward_if_correct: { puntos_seguridad: 0 },
      },
    ],
    correct_option_id: 2,
    intt_educational_card: {
      show_card: true,
      topic: 'Convivencia Vial y Protección del Ciclista',
      official_rule:
        'LTT Art. 74: Los conductores de vehículos a motor deben guardar una separación lateral no menor de 1.5 metros al rebasar a bicicletas o vehículos de tracción humana.',
      key_learnings: [
        'Los ciclistas tienen derecho a circular por el canal derecho en ausencia de ciclovía.',
        'No adelantar al ciclista si no hay visibilidad o viene tráfico opuesto.',
        'Comprobar el retrovisor antes de abrir la puerta del vehículo estacionado (técnica holandesa).',
      ],
    },
    scene_mode: 'pedestrian_crossing',
    applicable_avatar_perk: 'jorge',
  },
  {
    id: 11,
    chapter: 'Capítulo 11: Política de Tolerancia Cero: Alcohol y Sustancias',
    chapter_number: 11,
    title: 'Punto de Control Policial Nocturno: Prueba de Alcoholemia',
    intt_article_context: 'Ley de Transporte Terrestre — Artículos 169 (numeral 1) y 183 (Sanciones por Conducción Bajo Efectos del Alcohol)',
    visual_scene_3d_description:
      'Puesto de control vial con conos iluminados. Funcionarios del INTT y Policía Nacional Bolivariana solicitan al conductor realizar la prueba con alcoholímetro digital.',
    challenge_type: 'Alcohol Cero y Sustancias',
    question:
      '¿Qué establece el ordenamiento jurídico venezolano sobre el límite de alcohol permitido en sangre para conductores y negarse a la prueba?',
    options: [
      {
        id: 1,
        text: 'Se permite conducir con hasta 4 cervezas si se ingieren alimentos pesados antes de encender el motor.',
        feedback_immediate:
          'Mito común y peligroso. El alcohol degrada los reflejos neuromusculares y altera la percepción de profundidad desde el primer trago.',
        reward_if_correct: { puntos_seguridad: 0 },
      },
      {
        id: 2,
        text: 'El límite legal en Venezuela es de 0.08 mg/l en aire (prácticamente cero tolerancia); negarse a la prueba presume culpabilidad y acarrea retención del vehículo y suspensión de licencia.',
        feedback_immediate:
          '¡Respuesta ejemplar! La Ley INTT sanciona con severidad la conducción bajo los efectos del alcohol o sustancias estupefacientes debido al riesgo letal que genera.',
        reward_if_correct: { puntos_seguridad: 100 },
      },
      {
        id: 3,
        text: 'Negarse a la prueba es un derecho libre que no tiene ninguna consecuencia jurídica ni sanción.',
        feedback_immediate:
          'Falso. La ley tipifica la negativa al control de alcoholemia como presunción de infracción con retención preventiva inmediata del vehículo.',
        reward_if_correct: { puntos_seguridad: 0 },
      },
    ],
    correct_option_id: 2,
    intt_educational_card: {
      show_card: true,
      topic: 'Efectos del Alcohol en la Conducción y Marco Legal',
      official_rule:
        'LTT Art. 169 num. 1: Conducir bajo los efectos de bebidas alcohólicas o drogas es infracción gravísima penada con multas máximas, retención del vehículo y suspensión de la licencia de 1 a 3 años.',
      key_learnings: [
        'El alcohol reduce el campo visual (efecto túnel) y duplica el tiempo de reacción ante un obstáculo.',
        'Designar siempre a un conductor sobrio si se va a ingerir alcohol en reuniones.',
        'El café, duchas frías o bebidas energéticas NO eliminan el alcohol en sangre.',
      ],
    },
    scene_mode: 'checkpoint_inspection',
    applicable_avatar_perk: 'ivan',
  },
  {
    id: 12,
    chapter: 'Capítulo 12: Inspección Técnica y Dispositivos de Emergencia Obligatorios',
    chapter_number: 12,
    title: 'Revisión Preventiva: Triángulos de Seguridad, Extintor y Neumáticos',
    intt_article_context: 'Ley de Transporte Terrestre — Artículos 128 y 168 (Equipamiento de Seguridad y Estado Mecánico)',
    visual_scene_3d_description:
      'Vehículo detenido en el hombrillo por falla mecánica. El conductor debe señalizar su posición para no ser impactado por el flujo vehicular que transita a 80 km/h.',
    challenge_type: 'Inspección Técnica Vehicular',
    question:
      'Al sufrir un desperfecto mecánico en carretera, ¿a qué distancia deben colocarse los triángulos reflectivos de emergencia según el INTT?',
    options: [
      {
        id: 1,
        text: 'Pegados justo al parachoques trasero del vehículo para que no se los lleve el viento.',
        feedback_immediate:
          'Inútil. Un triángulo pegado al auto no ofrece tiempo de anticipación a los conductores que vienen a alta velocidad.',
        reward_if_correct: { puntos_seguridad: 0 },
      },
      {
        id: 2,
        text: 'Uno a 50 metros detrás del auto en vías urbanas (o 100-150 metros en autopistas y curvas), y en vías de doble sentido un segundo triángulo 50 metros adelante.',
        feedback_immediate:
          '¡Preciso y reglamentario! Colocar los triángulos a distancia prudencial brinda los segundos necesarios para que otros vehículos cambien de canal con calma.',
        reward_if_correct: { puntos_seguridad: 100 },
      },
      {
        id: 3,
        text: 'Colocar ramas secas y piedras en el medio de la vía en sustitución de los triángulos.',
        feedback_immediate:
          'Práctica prohibida y altamente peligrosa. Dejar piedras o troncos en la calzada provoca accidentes adicionales graves.',
        reward_if_correct: { puntos_seguridad: 0 },
      },
    ],
    correct_option_id: 2,
    intt_educational_card: {
      show_card: true,
      topic: 'Kit de Emergencia y Señalización de Vehículo Avariado',
      official_rule:
        'LTT Art. 128: Todo vehículo debe portar obligatoriamente: extintor cargado y vigente, caucho de repuesto con gato y llave de cruz, botiquín de primeros auxilios y par de triángulos reflectivos.',
      key_learnings: [
        'Activar de inmediato las luces intermitentes (balizas) de emergencia.',
        'Los ocupantes deben descender del auto por el lado de la acera/hombrillo y esperar tras la baranda metálica.',
        'Verificar periódicamente la presión del caucho de repuesto antes de salir a carretera.',
      ],
    },
    scene_mode: 'checkpoint_inspection',
    applicable_avatar_perk: 'carlos',
  },
  {
    id: 13,
    chapter: 'Capítulo 13: Puntos Ciegos y Convivencia con Transporte de Carga',
    chapter_number: 13,
    title: 'Autopista Regional: Posicionamiento Respecto a una Gandola o Camión',
    intt_article_context: 'Ley de Transporte Terrestre — Artículos 91 y 92 (Circulación Cerca de Vehículos Pesados)',
    visual_scene_3d_description:
      'Vista aérea 3D que resalta en color rojo los 4 grandes puntos ciegos (No-Zones) de un camión de carga pesada: directamente atrás, al frente y en los amplios laterales derechos.',
    challenge_type: 'Puntos Ciegos y Vehículos Pesados',
    question:
      'Circulas cerca de una gandola o autobús interurbano. ¿Cuál es la regla de oro para saber si estás fuera de su punto ciego?',
    options: [
      {
        id: 1,
        text: 'Si puedes ver la sombra de la gandola en el pavimento, significa que el chofer te está viendo con claridad.',
        feedback_immediate:
          'Falso. Las sombras no tienen relación alguna con el campo visual de los espejos retrovisores del camión.',
        reward_if_correct: { puntos_seguridad: 0 },
      },
      {
        id: 2,
        text: '"Si no puedes ver los espejos retrovisores del conductor del camión, él tampoco puede verte a ti". Evitar permanecer en sus puntos ciegos laterales y traseros.',
        feedback_immediate:
          '¡Principio fundamental de supervivencia vial! Los vehículos pesados tienen enormes ángulos muertos; si no ves su cara en su espejo, eres invisible para él.',
        reward_if_correct: { puntos_seguridad: 100 },
      },
      {
        id: 3,
        text: 'Pegarte a 1 metro de su parachoques trasero para aprovechar el rebufo aerodinámico y gastar menos combustible.',
        feedback_immediate:
          'Maniobra extremadamente peligrosa. A 1 metro tienes cero visibilidad hacia adelante y en una frenada imprevista quedarás incrustado.',
        reward_if_correct: { puntos_seguridad: 0 },
      },
    ],
    correct_option_id: 2,
    intt_educational_card: {
      show_card: true,
      topic: 'Los Puntos Ciegos en Vehículos de Gran Tonelaje',
      official_rule:
        'LTT Art. 91: Todo conductor debe mantener una distancia de seguimiento mínima no menor de 50 metros con vehículos de carga pesada para garantizar visibilidad y margen de frenado.',
      key_learnings: [
        'El punto ciego derecho de un camión es el más amplio y peligroso.',
        'Una gandola cargada a 80 km/h necesita casi el doble de distancia para detenerse que un automóvil liviano.',
        'Nunca colocarse al lado de un camión que va a girar en una esquina: necesita abrirse para maniobrar.',
      ],
    },
    scene_mode: 'checkpoint_inspection',
    applicable_avatar_perk: 'ircar',
  },
  {
    id: 14,
    chapter: 'Capítulo 14: Cruce de Vías Férreas, Puentes Angostos y Túneles',
    chapter_number: 14,
    title: 'Paso a Nivel Ferroviario: Señal Cruz de San Andrés y Barrera',
    intt_article_context: 'Ley de Transporte Terrestre — Artículos 87 y 103 (Cruce de Pasos a Nivel y Puentes)',
    visual_scene_3d_description:
      'Aproximación a una vía férrea del tren metropolitano. Las luces rojas intermitentes del cruce se activan y la barrera comienza a descender lentamente.',
    challenge_type: 'Cruce Ferroviario y Puentes',
    question:
      'Al aproximarse a un cruce ferroviario con señal de Cruz de San Andrés y barrera en descenso, ¿cuál es el comportamiento obligatorio?',
    options: [
      {
        id: 1,
        text: 'Acelerar rápidamente en zigzag para pasar por debajo de la barrera antes de que termine de bajar.',
        feedback_immediate:
          'Conducta suicida. Un tren no puede frenar a corta distancia (requiere más de 800 metros) y el impacto resulta devastador.',
        reward_if_correct: { puntos_seguridad: 0 },
      },
      {
        id: 2,
        text: 'Detener el vehículo por completo a no menos de 5 metros de la barrera o del riel más cercano, apagar el radio y esperar que el tren pase y la barrera suba totalmente.',
        feedback_immediate:
          '¡Correcto y seguro! En pasos a nivel ferroviarios el tren goza de prioridad absoluta e inapelable en todo momento.',
        reward_if_correct: { puntos_seguridad: 100 },
      },
      {
        id: 3,
        text: 'Cruzar tocando la corneta para que el maquinista del tren reduzca la marcha.',
        feedback_immediate:
          'El tren se desplaza sobre rieles fijos y por inercia de miles de toneladas no puede detenerse a voluntad en pocos metros.',
        reward_if_correct: { puntos_seguridad: 0 },
      },
    ],
    correct_option_id: 2,
    intt_educational_card: {
      show_card: true,
      topic: 'Normas de Cruce en Pasos a Nivel y Puentes',
      official_rule:
        'LTT Art. 87: La señalización ferroviaria impone detención forzosa. Está terminantemente prohibido adelantar o estacionarse en pasos a nivel, puentes o túneles.',
      key_learnings: [
        'En puentes de un solo canal tiene prioridad el vehículo que ya haya ingresado primero.',
        'Dentro de túneles es obligatorio encender las luces bajas y mantener distancia ampliada.',
        'Jamás detenerse sobre la vía del tren en una cola de tráfico: esperar antes de los rieles.',
      ],
    },
    scene_mode: 'traffic_signals',
    applicable_avatar_perk: 'jorge',
  },
  {
    id: 15,
    chapter: 'Capítulo 15: Protocolo PAS ante Siniestros Viales y Deber de Auxilio',
    chapter_number: 15,
    title: 'Escenario de Emergencia: Asistencia y Deber Cívico de Socorro',
    intt_article_context: 'Ley de Transporte Terrestre — Artículos 180 y 181 (Deber de Socorro y Procedimiento en Accidentes)',
    visual_scene_3d_description:
      'Eres el primer conductor en llegar a una colisión vial en la autopista. Hay dos vehículos con daños en la carrocería y una persona afectada en el asiento.',
    challenge_type: 'Primeros Auxilios y Emergencias',
    question:
      'Ante un siniestro vial donde eres testigo o partícipe, ¿cuál es el orden correcto del protocolo de emergencia reconocido internacionalmente (P.A.S.)?',
    options: [
      {
        id: 1,
        text: 'Sacar de inmediato a los heridos jalándolos con fuerza por los brazos y darles agua fría con azúcar.',
        feedback_immediate:
          'Grave error médico. Mover bruscamente a una persona accidentada sin inmovilización cervical puede causarle tetraplejia o lesiones irreversibles.',
        reward_if_correct: { puntos_seguridad: 0 },
      },
      {
        id: 2,
        text: 'Protocolo P.A.S.: 1. PROTEGER el lugar (balizas, triángulos para evitar nuevos choques), 2. AVISAR a los servicios de emergencia (911 / INTT), 3. SOCORRER a las víctimas manteniéndolas tranquilas sin mover su cuello.',
        feedback_immediate:
          '¡Excelente formación ciudadana! El protocolo P.A.S. (Proteger - Avisar - Socorrer) salva miles de vidas organizando la respuesta segura.',
        reward_if_correct: { puntos_seguridad: 100 },
      },
      {
        id: 3,
        text: 'Tomar fotos con el celular para redes sociales y marcharse del lugar sin notificar a las autoridades.',
        feedback_immediate:
          'Delito penal de omisión de socorro contemplado en las leyes venezolanas con penas privativas de libertad.',
        reward_if_correct: { puntos_seguridad: 0 },
      },
    ],
    correct_option_id: 2,
    intt_educational_card: {
      show_card: true,
      topic: 'Protocolo P.A.S. y Deber de Socorro del INTT',
      official_rule:
        'LTT Art. 180: Toda persona implicada o testigo en un accidente vial tiene la obligación legal de detenerse, asegurar el lugar para evitar más colisiones y prestar auxilio a los heridos.',
      key_learnings: [
        'Proteger: Lo primero es estacionar seguro, activar balizas y colocar triángulos reflectivos.',
        'Avisar: Llamar al 911 indicando ubicación exacta, cantidad de autos y estado de heridos.',
        'Socorrer: No remover el casco a motorizados ni trasladar heridos en autos particulares salvo peligro inminente de fuego.',
      ],
    },
    scene_mode: 'checkpoint_inspection',
    applicable_avatar_perk: 'ivan',
  },
];
