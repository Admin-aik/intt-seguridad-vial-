import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Camera, Compass } from 'lucide-react';
import { AvatarData } from '../types';
import simCockpitImg from '../assets/images/sim_driver_cockpit_1788436981887.jpg';
import simPedestrianImg from '../assets/images/sim_pedestrian_cross_1788436996644.jpg';
import simHighwayImg from '../assets/images/sim_highway_patrol_1788437010365.jpg';
import simTrafficImg from '../assets/images/sim_traffic_signals_1788437036845.jpg';

interface ThreeMetropolisViewProps {
  avatar: AvatarData;
  sceneMode?: 'pedestrian_crossing' | 'traffic_signals' | 'passenger_seat' | 'checkpoint_inspection' | 'school_zone' | 'avatar_stage';
  heightClass?: string;
  interactiveControls?: boolean;
}

// Helper to safely detect if WebGL context can actually be created without throwing
function isWebGLSupported(): boolean {
  try {
    const testCanvas = document.createElement('canvas');
    const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl') || testCanvas.getContext('webgl2');
    return !!gl;
  } catch {
    return false;
  }
}

export default function ThreeMetropolisView({
  avatar,
  sceneMode = 'avatar_stage',
  heightClass = 'h-[360px] md:h-[440px]',
  interactiveControls = true,
}: ThreeMetropolisViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const fallbackCanvasRef = useRef<HTMLCanvasElement>(null);
  const [renderMode, setRenderMode] = useState<'3d_hologram' | 'realistic_photo'>('3d_hologram');
  const [isRotating, setIsRotating] = useState<boolean>(true);
  const [cameraView, setCameraView] = useState<'cinematic' | 'street' | 'birds_eye'>('cinematic');
  const [useFallback2D, setUseFallback2D] = useState<boolean>(!isWebGLSupported());

  const getRealisticScene = () => {
    switch (sceneMode) {
      case 'pedestrian_crossing':
      case 'school_zone':
        return {
          img: simPedestrianImg,
          title: 'Cruce Peatonal Realista & Zona Escolar',
          desc: 'Paso cebra y demarcación vial con prioridad peatonal protegida (Art. 73 LTT)',
          badge: 'PASO CEBRA',
        };
      case 'traffic_signals':
        return {
          img: simTrafficImg,
          title: 'Intersección Semaforizada Realista',
          desc: 'Control luminoso con fase de detención en luz roja y precaución en amarillo',
          badge: 'SEMÁFORO INTT',
        };
      case 'checkpoint_inspection':
        return {
          img: simHighwayImg,
          title: 'Autopista y Control Policial Realista',
          desc: 'Corredor de tránsito rápido (80 km/h) con canal de auxilio y patrulla',
          badge: 'AUTOPISTA 80 KM/H',
        };
      case 'passenger_seat':
      case 'avatar_stage':
      default:
        return {
          img: simCockpitImg,
          title: 'Cabina de Conducción en Primera Persona',
          desc: 'Visión real desde el parabrisas y panel instrumental de navegación vial',
          badge: 'CABINA 1ª PERSONA',
        };
    }
  };
  const realisticScene = getRealisticScene();

  // Three.js WebGL Engine (when WebGL is available)
  useEffect(() => {
    if (useFallback2D) return;

    const container = containerRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer | null = null;
    let animationFrameId: number;
    let resizeObserver: ResizeObserver | null = null;

    try {
      const width = container.clientWidth || 800;
      const height = container.clientHeight || 450;

      const scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x060913, 0.025);

      const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
      camera.position.set(0, 4.5, 12);

      // Attempt to initialize WebGLRenderer
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, failIfMajorPerformanceCaveat: false });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;
      container.appendChild(renderer.domElement);

      // Parse avatar theme color
      const themeColorHex = parseInt(avatar.theme_color.replace('#', '0x'), 16) || 0x00f3ff;

      // Lights
      const ambientLight = new THREE.AmbientLight(0x1e293b, 1.2);
      scene.add(ambientLight);

      const dirLight = new THREE.DirectionalLight(0xffffff, 1.8);
      dirLight.position.set(10, 20, 10);
      dirLight.castShadow = true;
      scene.add(dirLight);

      const avatarSpotLight = new THREE.SpotLight(themeColorHex, 4, 25, Math.PI / 4, 0.3);
      avatarSpotLight.position.set(0, 10, 3);
      avatarSpotLight.target.position.set(0, 1.5, 0);
      scene.add(avatarSpotLight);
      scene.add(avatarSpotLight.target);

      // Ground Grid & Road
      const gridHelper = new THREE.GridHelper(60, 60, themeColorHex, 0x1e293b);
      gridHelper.position.y = -0.01;
      scene.add(gridHelper);

      // Holographic Road Asphalt
      const roadGeometry = new THREE.PlaneGeometry(16, 60);
      const roadMaterial = new THREE.MeshStandardMaterial({
        color: 0x0a0f1d,
        roughness: 0.8,
        metalness: 0.3,
      });
      const road = new THREE.Mesh(roadGeometry, roadMaterial);
      road.rotation.x = -Math.PI / 2;
      road.position.z = 0;
      scene.add(road);

      // Neon Road Edges
      const leftEdgeGeo = new THREE.BoxGeometry(0.2, 0.1, 60);
      const rightEdgeGeo = new THREE.BoxGeometry(0.2, 0.1, 60);
      const neonEdgeMat = new THREE.MeshBasicMaterial({ color: themeColorHex });
      const leftEdge = new THREE.Mesh(leftEdgeGeo, neonEdgeMat);
      leftEdge.position.set(-8, 0.05, 0);
      const rightEdge = new THREE.Mesh(rightEdgeGeo, neonEdgeMat);
      rightEdge.position.set(8, 0.05, 0);
      scene.add(leftEdge);
      scene.add(rightEdge);

      // Zebra Crossing
      const zebraGroup = new THREE.Group();
      for (let i = -6; i <= 6; i += 1.5) {
        const stripeGeo = new THREE.PlaneGeometry(0.9, 5);
        const stripeMat = new THREE.MeshStandardMaterial({
          color: 0xffffff,
          emissive: 0x223344,
          roughness: 0.4,
        });
        const stripe = new THREE.Mesh(stripeGeo, stripeMat);
        stripe.rotation.x = -Math.PI / 2;
        stripe.position.set(i, 0.02, 2);
        zebraGroup.add(stripe);
      }
      scene.add(zebraGroup);

      // 3D Cadet Hologram Representation
      const cadetGroup = new THREE.Group();
      cadetGroup.position.set(0, 0, 2);

      const pedestalGeo = new THREE.CylinderGeometry(1.6, 1.9, 0.3, 32);
      const pedestalMat = new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        metalness: 0.8,
        roughness: 0.2,
        emissive: themeColorHex,
        emissiveIntensity: 0.2,
      });
      const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
      pedestal.position.y = 0.15;
      cadetGroup.add(pedestal);

      const ringGeo = new THREE.TorusGeometry(1.5, 0.03, 16, 64);
      const ringMat = new THREE.MeshBasicMaterial({ color: themeColorHex, transparent: true, opacity: 0.8 });
      const ring1 = new THREE.Mesh(ringGeo, ringMat);
      ring1.rotation.x = Math.PI / 2;
      ring1.position.y = 0.35;
      cadetGroup.add(ring1);

      const ring2 = new THREE.Mesh(ringGeo, ringMat);
      ring2.rotation.x = Math.PI / 2.3;
      ring2.rotation.y = 0.2;
      ring2.position.y = 1.4;
      cadetGroup.add(ring2);

      const bodyGroup = new THREE.Group();
      bodyGroup.position.y = 0.8;

      const torsoGeo = new THREE.CylinderGeometry(0.42, 0.35, 1.1, 16);
      const jacketMat = new THREE.MeshStandardMaterial({
        color: 0x111827,
        metalness: 0.5,
        roughness: 0.4,
        emissive: themeColorHex,
        emissiveIntensity: 0.3,
      });
      const torso = new THREE.Mesh(torsoGeo, jacketMat);
      torso.position.y = 0.9;
      bodyGroup.add(torso);

      const stripeBeltGeo = new THREE.CylinderGeometry(0.43, 0.43, 0.15, 16);
      const reflectiveMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const stripeBelt = new THREE.Mesh(stripeBeltGeo, reflectiveMat);
      stripeBelt.position.y = 0.85;
      bodyGroup.add(stripeBelt);

      const headGeo = new THREE.SphereGeometry(0.32, 24, 24);
      const helmetMat = new THREE.MeshStandardMaterial({
        color: 0x030712,
        roughness: 0.1,
        metalness: 0.9,
        emissive: themeColorHex,
        emissiveIntensity: 0.4,
      });
      const head = new THREE.Mesh(headGeo, helmetMat);
      head.position.y = 1.7;
      bodyGroup.add(head);

      const visorGeo = new THREE.BoxGeometry(0.42, 0.18, 0.25);
      const visorMat = new THREE.MeshStandardMaterial({
        color: themeColorHex,
        emissive: themeColorHex,
        emissiveIntensity: 0.9,
        roughness: 0.1,
      });
      const visor = new THREE.Mesh(visorGeo, visorMat);
      visor.position.set(0, 1.68, 0.2);
      bodyGroup.add(visor);

      const shieldGeo = new THREE.ConeGeometry(0.3, 0.5, 4);
      const shieldMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24, wireframe: true });
      const shield = new THREE.Mesh(shieldGeo, shieldMat);
      shield.rotation.x = Math.PI;
      shield.position.set(0, 2.3, 0);
      bodyGroup.add(shield);

      cadetGroup.add(bodyGroup);
      scene.add(cadetGroup);

      // Traffic Light
      const trafficLightGroup = new THREE.Group();
      trafficLightGroup.position.set(5.5, 0, 2);

      const poleGeo = new THREE.CylinderGeometry(0.08, 0.08, 5, 12);
      const poleMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8 });
      const pole = new THREE.Mesh(poleGeo, poleMat);
      pole.position.y = 2.5;
      trafficLightGroup.add(pole);

      const boxGeo = new THREE.BoxGeometry(0.6, 1.6, 0.5);
      const boxMat = new THREE.MeshStandardMaterial({ color: 0x0f172a });
      const tlBox = new THREE.Mesh(boxGeo, boxMat);
      tlBox.position.set(0, 4.2, 0);
      trafficLightGroup.add(tlBox);

      const redLightGeo = new THREE.SphereGeometry(0.18, 16, 16);
      const redLightMat = new THREE.MeshBasicMaterial({ color: 0xff2222 });
      const redLight = new THREE.Mesh(redLightGeo, redLightMat);
      redLight.position.set(0, 4.6, 0.26);
      trafficLightGroup.add(redLight);

      const yellowLightMat = new THREE.MeshBasicMaterial({ color: 0x443300 });
      const yellowLight = new THREE.Mesh(redLightGeo, yellowLightMat);
      yellowLight.position.set(0, 4.2, 0.26);
      trafficLightGroup.add(yellowLight);

      const greenLightMat = new THREE.MeshBasicMaterial({ color: 0x004411 });
      const greenLight = new THREE.Mesh(redLightGeo, greenLightMat);
      greenLight.position.set(0, 3.8, 0.26);
      trafficLightGroup.add(greenLight);

      scene.add(trafficLightGroup);

      // Cyber Traffic Vehicles
      const vehicles: THREE.Group[] = [];
      const vehicleColors = [0x00f3ff, 0xff007f, 0xfbbf24, 0x34d399, 0x38bdf8];

      for (let i = 0; i < 4; i++) {
        const vGroup = new THREE.Group();
        const bodyColor = vehicleColors[i % vehicleColors.length];

        const chassisGeo = new THREE.BoxGeometry(1.6, 0.6, 3.2);
        const chassisMat = new THREE.MeshStandardMaterial({
          color: 0x090d16,
          metalness: 0.8,
          roughness: 0.2,
        });
        const chassis = new THREE.Mesh(chassisGeo, chassisMat);
        chassis.position.y = 0.5;
        vGroup.add(chassis);

        const cabinGeo = new THREE.BoxGeometry(1.3, 0.45, 1.6);
        const cabinMat = new THREE.MeshStandardMaterial({
          color: bodyColor,
          emissive: bodyColor,
          emissiveIntensity: 0.3,
          roughness: 0.1,
        });
        const cabin = new THREE.Mesh(cabinGeo, cabinMat);
        cabin.position.set(0, 0.9, -0.2);
        vGroup.add(cabin);

        const hlGeo = new THREE.BoxGeometry(0.3, 0.12, 0.05);
        const hlMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const hlLeft = new THREE.Mesh(hlGeo, hlMat);
        hlLeft.position.set(-0.5, 0.5, -1.6);
        const hlRight = new THREE.Mesh(hlGeo, hlMat);
        hlRight.position.set(0.5, 0.5, -1.6);
        vGroup.add(hlLeft);
        vGroup.add(hlRight);

        const tlMat = new THREE.MeshBasicMaterial({ color: 0xff1133 });
        const tlLeft = new THREE.Mesh(hlGeo, tlMat);
        tlLeft.position.set(-0.5, 0.5, 1.6);
        const tlRight = new THREE.Mesh(hlGeo, tlMat);
        tlRight.position.set(0.5, 0.5, 1.6);
        vGroup.add(tlLeft);
        vGroup.add(tlRight);

        const laneX = i % 2 === 0 ? -3.5 : 3.5;
        const initZ = -20 + i * 14;
        vGroup.position.set(laneX, 0, initZ);
        scene.add(vGroup);
        vehicles.push(vGroup);
      }

      // Particles
      const particleCount = 180;
      const particleGeo = new THREE.BufferGeometry();
      const particlePos = new Float32Array(particleCount * 3);
      for (let p = 0; p < particleCount * 3; p += 3) {
        particlePos[p] = (Math.random() - 0.5) * 40;
        particlePos[p + 1] = Math.random() * 14;
        particlePos[p + 2] = (Math.random() - 0.5) * 40;
      }
      particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
      const particleMat = new THREE.PointsMaterial({
        color: themeColorHex,
        size: 0.12,
        transparent: true,
        opacity: 0.6,
      });
      const particleSystem = new THREE.Points(particleGeo, particleMat);
      scene.add(particleSystem);

      // Interactive Drag Controls
      let isDragging = false;
      let prevMouseX = 0;
      let targetAngle = 0;
      let currentAngle = 0;

      const handleMouseDown = (e: MouseEvent) => {
        isDragging = true;
        prevMouseX = e.clientX;
      };

      const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging) return;
        const delta = e.clientX - prevMouseX;
        prevMouseX = e.clientX;
        targetAngle += delta * 0.01;
      };

      const handleMouseUp = () => {
        isDragging = false;
      };

      const handleTouchStart = (e: TouchEvent) => {
        if (e.touches.length === 1) {
          isDragging = true;
          prevMouseX = e.touches[0].clientX;
        }
      };

      const handleTouchMove = (e: TouchEvent) => {
        if (!isDragging || e.touches.length === 0) return;
        const delta = e.touches[0].clientX - prevMouseX;
        prevMouseX = e.touches[0].clientX;
        targetAngle += delta * 0.01;
      };

      const handleTouchEnd = () => {
        isDragging = false;
      };

      const domElement = renderer.domElement;
      if (interactiveControls) {
        domElement.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        domElement.addEventListener('touchstart', handleTouchStart);
        window.addEventListener('touchmove', handleTouchMove);
        window.addEventListener('touchend', handleTouchEnd);
      }

      // Animation Loop
      const clock = new THREE.Clock();

      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        if (cameraView === 'cinematic') {
          const radius = 10;
          if (!isDragging && isRotating) {
            targetAngle += 0.004;
          }
          currentAngle += (targetAngle - currentAngle) * 0.1;
          camera.position.x = Math.sin(currentAngle) * radius;
          camera.position.z = Math.cos(currentAngle) * radius;
          camera.position.y = 4.2 + Math.sin(elapsedTime * 0.5) * 0.5;
          camera.lookAt(0, 1.8, 2);
        } else if (cameraView === 'street') {
          camera.position.set(0, 1.6, 7);
          camera.lookAt(0, 1.6, -10);
        } else if (cameraView === 'birds_eye') {
          camera.position.set(0, 18, 4);
          camera.lookAt(0, 0, 2);
        }

        ring1.rotation.z = elapsedTime * 1.5;
        ring2.rotation.z = -elapsedTime * 1.2;
        shield.rotation.y = elapsedTime * 2;
        bodyGroup.position.y = 0.8 + Math.sin(elapsedTime * 2) * 0.04;

        const lightCycle = Math.floor(elapsedTime / 3) % 3;
        if (lightCycle === 0) {
          redLightMat.color.setHex(0xff2222);
          yellowLightMat.color.setHex(0x332200);
          greenLightMat.color.setHex(0x003311);
        } else if (lightCycle === 1) {
          redLightMat.color.setHex(0x330000);
          yellowLightMat.color.setHex(0xffaa00);
          greenLightMat.color.setHex(0x003311);
        } else {
          redLightMat.color.setHex(0x330000);
          yellowLightMat.color.setHex(0x332200);
          greenLightMat.color.setHex(0x00ff66);
        }

        vehicles.forEach((v, idx) => {
          const speed = 0.12 + (idx % 2) * 0.05;
          v.position.z += speed;
          if (v.position.z > 25) {
            v.position.z = -30;
          }
        });

        particleSystem.rotation.y = elapsedTime * 0.03;

        if (renderer) {
          renderer.render(scene, camera);
        }
      };

      animate();

      // Resize Observer
      resizeObserver = new ResizeObserver(() => {
        if (!container || !renderer) return;
        const newWidth = container.clientWidth;
        const newHeight = container.clientHeight;
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
      });
      resizeObserver.observe(container);

      return () => {
        cancelAnimationFrame(animationFrameId);
        if (resizeObserver) resizeObserver.disconnect();
        if (interactiveControls && domElement) {
          domElement.removeEventListener('mousedown', handleMouseDown);
          window.removeEventListener('mousemove', handleMouseMove);
          window.removeEventListener('mouseup', handleMouseUp);
          domElement.removeEventListener('touchstart', handleTouchStart);
          window.removeEventListener('touchmove', handleTouchMove);
          window.removeEventListener('touchend', handleTouchEnd);
        }
        if (renderer && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
          renderer.dispose();
        }
        gridHelper.dispose();
        roadGeometry.dispose();
      };
    } catch (err) {
      console.warn('WebGL initialization failed or context could not be created, switching seamlessly to 2D Canvas Metropolis Simulation:', err);
      setUseFallback2D(true);
      if (renderer && container && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    }
  }, [avatar, sceneMode, isRotating, cameraView, interactiveControls, useFallback2D]);

  // High-Performance 2D Canvas Engine Fallback (When WebGL is unavailable)
  useEffect(() => {
    if (!useFallback2D) return;

    const canvas = fallbackCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let rotationAngle = 0;
    let targetAngle = 0;
    let isDragging = false;
    let startX = 0;
    let startTime = performance.now();

    // Vehicles for 2D perspective simulation
    const vehicles2D = [
      { z: 0.15, lane: -1, color: '#00f3ff', speed: 0.003 },
      { z: 0.45, lane: 1, color: '#ff007f', speed: 0.004 },
      { z: 0.75, lane: -1, color: '#fbbf24', speed: 0.0025 },
      { z: 0.95, lane: 1, color: '#34d399', speed: 0.0035 },
    ];

    // Dust particles
    const particles = Array.from({ length: 45 }, () => ({
      x: (Math.random() - 0.5) * 600,
      y: (Math.random() - 0.5) * 300,
      z: Math.random() * 400 + 50,
      size: Math.random() * 2 + 1,
      alpha: Math.random() * 0.7 + 0.3,
    }));

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      startX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const delta = clientX - startX;
      startX = clientX;
      targetAngle += delta * 0.015;
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    if (interactiveControls) {
      canvas.addEventListener('mousedown', handlePointerDown);
      window.addEventListener('mousemove', handlePointerMove);
      window.addEventListener('mouseup', handlePointerUp);
      canvas.addEventListener('touchstart', handlePointerDown);
      window.addEventListener('touchmove', handlePointerMove);
      window.addEventListener('touchend', handlePointerUp);
    }

    const render2D = (now: number) => {
      animationId = requestAnimationFrame(render2D);

      const w = canvas.width;
      const h = canvas.height;
      const elapsed = (now - startTime) / 1000;

      if (!isDragging && isRotating) {
        targetAngle += 0.006;
      }
      rotationAngle += (targetAngle - rotationAngle) * 0.1;

      // Clear & Night Sky Background
      ctx.fillStyle = '#060913';
      ctx.fillRect(0, 0, w, h);

      // Perspective horizon
      const horizonY = cameraView === 'birds_eye' ? h * 0.2 : cameraView === 'street' ? h * 0.42 : h * 0.38;
      const vanishX = w / 2 + Math.sin(rotationAngle) * (w * 0.25);

      // Sky gradient with cyber glow
      const skyGrad = ctx.createLinearGradient(0, 0, 0, horizonY);
      skyGrad.addColorStop(0, '#03050b');
      skyGrad.addColorStop(1, '#0d1527');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, horizonY);

      // Distant cyberpunk skyline silhouettes
      ctx.fillStyle = '#0a101f';
      const buildingWidth = w / 16;
      for (let b = 0; b < 16; b++) {
        const bHeight = 35 + ((b * 47) % 65);
        ctx.fillRect(b * buildingWidth, horizonY - bHeight, buildingWidth - 2, bHeight);
        // Distant window lights
        if (b % 2 === 0) {
          ctx.fillStyle = 'rgba(0, 243, 255, 0.4)';
          ctx.fillRect(b * buildingWidth + 4, horizonY - bHeight + 8, 3, 3);
          ctx.fillStyle = '#0a101f';
        }
      }

      // Cyber Ground Grid
      ctx.strokeStyle = 'rgba(30, 41, 59, 0.6)';
      ctx.lineWidth = 1;
      const gridCount = 14;
      for (let g = 0; g <= gridCount; g++) {
        const xOffset = (g / gridCount) * w * 1.6 - w * 0.3;
        ctx.beginPath();
        ctx.moveTo(vanishX, horizonY);
        ctx.lineTo(xOffset, h);
        ctx.stroke();
      }

      // Horizontal ground perspective lines
      for (let yStep = 0.1; yStep <= 1; yStep += 0.15) {
        const py = horizonY + (h - horizonY) * Math.pow(yStep, 2);
        ctx.beginPath();
        ctx.moveTo(0, py);
        ctx.lineTo(w, py);
        ctx.stroke();
      }

      // Roadway Surface
      const roadTopWidth = w * 0.18;
      const roadBottomWidth = w * 0.75;
      const roadLeftTop = vanishX - roadTopWidth / 2;
      const roadRightTop = vanishX + roadTopWidth / 2;
      const roadLeftBottom = w / 2 - roadBottomWidth / 2;
      const roadRightBottom = w / 2 + roadBottomWidth / 2;

      ctx.fillStyle = '#090d18';
      ctx.beginPath();
      ctx.moveTo(roadLeftTop, horizonY);
      ctx.lineTo(roadRightTop, horizonY);
      ctx.lineTo(roadRightBottom, h);
      ctx.lineTo(roadLeftBottom, h);
      ctx.closePath();
      ctx.fill();

      // Neon Road Borders
      ctx.strokeStyle = avatar.theme_color;
      ctx.lineWidth = 3;
      ctx.shadowColor = avatar.theme_color;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.moveTo(roadLeftTop, horizonY);
      ctx.lineTo(roadLeftBottom, h);
      ctx.moveTo(roadRightTop, horizonY);
      ctx.lineTo(roadRightBottom, h);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Animated Center Dashed Line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 2;
      ctx.setLineDash([14, 14]);
      ctx.lineDashOffset = -elapsed * 50;
      ctx.beginPath();
      ctx.moveTo(vanishX, horizonY);
      ctx.lineTo(w / 2, h);
      ctx.stroke();
      ctx.setLineDash([]);

      // Zebra Crossing (Paso Peatonal Cebra)
      const zebraY = horizonY + (h - horizonY) * 0.62;
      const zebraHeight = (h - horizonY) * 0.14;
      const zebraRoadWidth = roadLeftBottom + (roadRightBottom - roadLeftBottom) * 0.8;
      const zebraStartX = roadLeftBottom + 25;
      const stripeW = 16;
      const stripeGap = 12;

      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 8;
      for (let sx = zebraStartX; sx < zebraRoadWidth; sx += stripeW + stripeGap) {
        ctx.fillRect(sx, zebraY, stripeW, zebraHeight);
      }
      ctx.shadowBlur = 0;

      // Stop Line Before Zebra
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(roadLeftBottom + 15, zebraY + zebraHeight + 6);
      ctx.lineTo(roadRightBottom - 15, zebraY + zebraHeight + 6);
      ctx.stroke();

      // Moving Autonomous Vehicles
      vehicles2D.forEach((veh) => {
        veh.z = (veh.z + veh.speed) % 1;
        const vProg = Math.pow(veh.z, 2);
        const vy = horizonY + (h - horizonY) * vProg;
        const currentRoadW = roadTopWidth + (roadBottomWidth - roadTopWidth) * vProg;
        const vx = vanishX + (veh.lane * currentRoadW * 0.26);
        const vScale = 0.3 + vProg * 1.2;
        const vw = 38 * vScale;
        const vh = 20 * vScale;

        // Vehicle Chassis
        ctx.fillStyle = '#0d1322';
        ctx.strokeStyle = veh.color;
        ctx.lineWidth = 1.5;
        ctx.fillRect(vx - vw / 2, vy - vh, vw, vh);
        ctx.strokeRect(vx - vw / 2, vy - vh, vw, vh);

        // Vehicle Roof / Cabin
        ctx.fillStyle = veh.color;
        ctx.fillRect(vx - vw * 0.35, vy - vh * 1.5, vw * 0.7, vh * 0.6);

        // Headlights / Taillights
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 6;
        ctx.fillRect(vx - vw * 0.4, vy - 2, 4 * vScale, 3);
        ctx.fillRect(vx + vw * 0.4 - 4 * vScale, vy - 2, 4 * vScale, 3);
        ctx.shadowBlur = 0;
      });

      // Traffic Light Post on the Right Sidewalk
      const tlX = roadRightTop + (roadRightBottom - roadRightTop) * 0.65 + 30;
      const tlY = horizonY + (h - horizonY) * 0.55;
      ctx.fillStyle = '#334155';
      ctx.fillRect(tlX - 3, tlY - 75, 6, 90);
      ctx.fillStyle = '#0f172a';
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 2;
      ctx.fillRect(tlX - 12, tlY - 95, 24, 52);
      ctx.strokeRect(tlX - 12, tlY - 95, 24, 52);

      // Traffic Light Bulbs cycling
      const cycle = Math.floor(elapsed / 2.8) % 3;
      // Red
      ctx.fillStyle = cycle === 0 ? '#ff2222' : '#330000';
      if (cycle === 0) { ctx.shadowColor = '#ff2222'; ctx.shadowBlur = 10; }
      ctx.beginPath(); ctx.arc(tlX, tlY - 82, 5.5, 0, Math.PI * 2); ctx.fill();
      ctx.shadowBlur = 0;
      // Yellow
      ctx.fillStyle = cycle === 1 ? '#ffbb00' : '#332200';
      if (cycle === 1) { ctx.shadowColor = '#ffbb00'; ctx.shadowBlur = 10; }
      ctx.beginPath(); ctx.arc(tlX, tlY - 69, 5.5, 0, Math.PI * 2); ctx.fill();
      ctx.shadowBlur = 0;
      // Green
      ctx.fillStyle = cycle === 2 ? '#00ff66' : '#003311';
      if (cycle === 2) { ctx.shadowColor = '#00ff66'; ctx.shadowBlur = 10; }
      ctx.beginPath(); ctx.arc(tlX, tlY - 56, 5.5, 0, Math.PI * 2); ctx.fill();
      ctx.shadowBlur = 0;

      // Center Pedestal & Cadet Hologram
      const cadetX = w / 2 + Math.cos(rotationAngle) * 35;
      const cadetY = h * 0.74;

      // Hologram Energy Pedestal
      const pedGrad = ctx.createRadialGradient(cadetX, cadetY + 15, 5, cadetX, cadetY + 15, 65);
      pedGrad.addColorStop(0, avatar.theme_color);
      pedGrad.addColorStop(0.4, 'rgba(15, 23, 42, 0.8)');
      pedGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = pedGrad;
      ctx.beginPath();
      ctx.ellipse(cadetX, cadetY + 15, 65, 22, 0, 0, Math.PI * 2);
      ctx.fill();

      // Rotating Hologram Rings
      ctx.strokeStyle = avatar.theme_color;
      ctx.lineWidth = 2;
      ctx.shadowColor = avatar.theme_color;
      ctx.shadowBlur = 12;

      // Ring 1
      ctx.beginPath();
      ctx.ellipse(cadetX, cadetY + 5, 50, 14, elapsed * 1.5, 0, Math.PI * 2);
      ctx.stroke();

      // Ring 2
      ctx.beginPath();
      ctx.ellipse(cadetX, cadetY - 45, 42, 10, -elapsed * 1.2, 0, Math.PI * 2);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Cadet 3D Figure Silhouette
      const bobbing = Math.sin(elapsed * 3) * 3;
      const cy = cadetY - 45 + bobbing;

      // Torso / Jacket
      ctx.fillStyle = '#0f172a';
      ctx.strokeStyle = avatar.theme_color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(cadetX - 16, cy - 25, 32, 45, [8, 8, 4, 4]);
      ctx.fill();
      ctx.stroke();

      // INTT Reflective Safety Bands
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(cadetX - 15, cy - 10, 30, 6);
      ctx.fillStyle = avatar.theme_color;
      ctx.fillRect(cadetX - 15, cy + 4, 30, 4);

      // Cadet Helmet / Head
      ctx.fillStyle = '#030712';
      ctx.beginPath();
      ctx.arc(cadetX, cy - 38, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = avatar.theme_color;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Illuminated HUD Visor
      ctx.fillStyle = avatar.theme_color;
      ctx.shadowColor = avatar.theme_color;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.roundRect(cadetX - 11, cy - 41, 22, 8, 3);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Floating INTT Badge Shield above head
      ctx.fillStyle = '#fbbf24';
      ctx.shadowColor = '#fbbf24';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.moveTo(cadetX, cy - 65 + Math.sin(elapsed * 4) * 2);
      ctx.lineTo(cadetX - 9, cy - 56);
      ctx.lineTo(cadetX + 9, cy - 56);
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 0;

      // Floating Cyber Dust Telemetry Particles
      ctx.fillStyle = avatar.theme_color;
      particles.forEach((p) => {
        p.y -= 0.6;
        if (p.y < -150) p.y = 150;
        const px = w / 2 + p.x + Math.sin(elapsed + p.z) * 15;
        const py = h / 2 + p.y;
        ctx.globalAlpha = p.alpha * (0.5 + Math.sin(elapsed * 2 + p.x) * 0.3);
        ctx.fillRect(px, py, p.size, p.size);
      });
      ctx.globalAlpha = 1.0;
    };

    // Canvas sizing with ResizeObserver
    const handleResize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    handleResize();
    const observer = new ResizeObserver(handleResize);
    observer.observe(canvas.parentElement || canvas);

    animationId = requestAnimationFrame(render2D);

    return () => {
      cancelAnimationFrame(animationId);
      observer.disconnect();
      if (interactiveControls) {
        canvas.removeEventListener('mousedown', handlePointerDown);
        window.removeEventListener('mousemove', handlePointerMove);
        window.removeEventListener('mouseup', handlePointerUp);
        canvas.removeEventListener('touchstart', handlePointerDown);
        window.removeEventListener('touchmove', handlePointerMove);
        window.removeEventListener('touchend', handlePointerUp);
      }
    };
  }, [useFallback2D, avatar, isRotating, cameraView, interactiveControls]);

  return (
    <div className={`relative w-full ${heightClass} rounded-2xl overflow-hidden glass-card border border-cyan-500/20 shadow-2xl bg-slate-950`}>
      {/* Visual Render: Either 3D Three.js / Canvas OR Photorealistic Scenario */}
      {renderMode === '3d_hologram' ? (
        <>
          {!useFallback2D ? (
            <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
          ) : (
            <canvas
              ref={fallbackCanvasRef}
              className="w-full h-full block cursor-grab active:cursor-grabbing"
            />
          )}
        </>
      ) : (
        /* Photorealistic 3D Scenario View */
        <div className="relative w-full h-full select-none animate-fadeIn">
          <img
            src={realisticScene.img}
            alt={realisticScene.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-black/40 pointer-events-none" />

          {/* Scenario Info Overlay */}
          <div className="absolute bottom-12 left-4 right-4 p-3 rounded-2xl bg-slate-950/85 backdrop-blur-md border border-cyan-400/30 text-xs shadow-xl pointer-events-none">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                {realisticScene.badge}
              </span>
              <span className="font-orbitron font-bold text-white text-xs">{realisticScene.title}</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-snug">{realisticScene.desc}</p>
          </div>
        </div>
      )}

      {/* Cyber Overlay HUD Info */}
      <div className="absolute top-3 left-3 flex flex-wrap items-center gap-2 pointer-events-none">
        <div className="px-2.5 py-1 rounded-md bg-slate-950/80 border border-cyan-400/40 text-[11px] font-mono text-cyan-300 flex items-center gap-1.5 shadow-lg">
          <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>
            {renderMode === '3d_hologram'
              ? `MOTOR 3D // INTT ${useFallback2D ? '(CANVAS HD)' : '(WEBGL)'}`
              : 'ESCENARIO 3D FOTORREALISTA // INTT'}
          </span>
        </div>
        <div className="px-2 py-0.5 rounded bg-black/60 text-[10px] font-mono text-slate-400 border border-white/10 hidden sm:block">
          {renderMode === '3d_hologram' ? 'FPS: 60 • TIEMPO REAL' : 'ALTA DEFINICIÓN VIAL'}
        </div>
      </div>

      {/* Camera and Animation Controls */}
      <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-slate-950/85 backdrop-blur-md p-1.5 rounded-xl border border-white/10 shadow-lg">
        {/* Toggle Mode: 3D Hologram vs Realistic Photo */}
        <button
          id="btn-toggle-render-mode"
          onClick={() => setRenderMode(renderMode === '3d_hologram' ? 'realistic_photo' : '3d_hologram')}
          className="px-2.5 py-1 text-[11px] font-mono font-bold rounded-lg transition-all bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 hover:brightness-110 shadow-md cursor-pointer flex items-center gap-1"
          title="Alternar entre Holograma 3D e Imagen Realista"
        >
          {renderMode === '3d_hologram' ? '📸 Foto Real' : '🌐 3D'}
        </button>

        {renderMode === '3d_hologram' && (
          <>
            <button
              id="btn-cam-cinematic"
              onClick={() => setCameraView('cinematic')}
              className={`px-2.5 py-1 text-[11px] font-mono rounded-lg transition-all cursor-pointer ${
                cameraView === 'cinematic' ? 'bg-cyan-500 text-black font-bold' : 'text-slate-300 hover:text-white'
              }`}
              title="Vista Cinematográfica"
            >
              Órbita
            </button>
            <button
              id="btn-cam-street"
              onClick={() => setCameraView('street')}
              className={`px-2.5 py-1 text-[11px] font-mono rounded-lg transition-all cursor-pointer ${
                cameraView === 'street' ? 'bg-cyan-500 text-black font-bold' : 'text-slate-300 hover:text-white'
              }`}
              title="Vista Nivel de Calle"
            >
              Calle
            </button>
            <button
              id="btn-cam-birds"
              onClick={() => setCameraView('birds_eye')}
              className={`px-2.5 py-1 text-[11px] font-mono rounded-lg transition-all cursor-pointer ${
                cameraView === 'birds_eye' ? 'bg-cyan-500 text-black font-bold' : 'text-slate-300 hover:text-white'
              }`}
              title="Vista Aérea / Cenital"
            >
              Aérea
            </button>
            <button
              id="btn-toggle-spin"
              onClick={() => setIsRotating(!isRotating)}
              className={`p-1.5 text-[11px] rounded-lg transition-all border cursor-pointer ${
                isRotating ? 'border-cyan-400/40 text-cyan-400' : 'border-slate-700 text-slate-500'
              }`}
              title={isRotating ? 'Pausar giro automático' : 'Reanudar giro automático'}
            >
              {isRotating ? '⏸' : '▶'}
            </button>
          </>
        )}
      </div>

      {/* Bottom Floating Telemetry Bar */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
        <div className="px-3 py-1.5 rounded-lg bg-slate-950/85 backdrop-blur-md border border-white/10 text-xs text-slate-300 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: avatar.theme_color }} />
          <span className="font-semibold text-white">{avatar.name}</span>
          <span className="text-slate-500">|</span>
          <span className="font-mono text-cyan-300 text-[11px]">{avatar.title}</span>
        </div>
        <div className="text-[10px] font-mono text-slate-400 bg-black/70 px-2 py-1 rounded border border-white/5 hidden md:block">
          {renderMode === '3d_hologram' ? 'ARRASTRA PARA ROTAR EN 360°' : 'VISUALIZACIÓN REALISTA EN VIVO'}
        </div>
      </div>
    </div>
  );
}
