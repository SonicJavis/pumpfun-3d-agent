"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import type { AgentStatus } from "@/types";

interface AgentSceneProps {
  status: AgentStatus;
  confidence: number; // 0–1
}

const STATUS_COLORS: Record<AgentStatus, number> = {
  idle: 0x555566,
  scanning: 0x00d4ff,
  evaluating: 0x4466ff,
  waiting_approval: 0xffcc00,
  executing: 0x00ff88,
  paused: 0x888888,
};

export default function AgentScene({ status, confidence }: AgentSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const width = el.clientWidth;
    const height = el.clientHeight;

    // ── Renderer ────────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    el.appendChild(renderer.domElement);

    // ── Scene + Camera ───────────────────────────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 1.8, 5);
    camera.lookAt(0, 0, 0);

    // ── Lights ───────────────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xffffff, 0.3));
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(5, 10, 5);
    scene.add(dirLight);

    const accentColor = STATUS_COLORS[status];
    const pointLight = new THREE.PointLight(accentColor, 2, 8);
    pointLight.position.set(0, 2, 2);
    scene.add(pointLight);

    // ── Grid floor ───────────────────────────────────────────────────────────
    const gridHelper = new THREE.GridHelper(12, 24, 0x1a2a3a, 0x1a2a3a);
    gridHelper.position.y = -1.4;
    scene.add(gridHelper);

    // ── Core sphere (agent "brain") ───────────────────────────────────────────
    const coreGeo = new THREE.IcosahedronGeometry(0.7, 2);
    const coreMat = new THREE.MeshStandardMaterial({
      color: accentColor,
      emissive: accentColor,
      emissiveIntensity: 0.4 * confidence,
      roughness: 0.15,
      metalness: 0.85,
      wireframe: false,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    scene.add(coreMesh);

    // ── Wireframe shell ──────────────────────────────────────────────────────
    const shellGeo = new THREE.IcosahedronGeometry(1.05, 1);
    const shellMat = new THREE.MeshBasicMaterial({
      color: accentColor,
      wireframe: true,
      opacity: 0.18,
      transparent: true,
    });
    const shellMesh = new THREE.Mesh(shellGeo, shellMat);
    scene.add(shellMesh);

    // ── Orbiting data rings ──────────────────────────────────────────────────
    const rings: THREE.Mesh[] = [];
    const ringCount = 3;
    for (let i = 0; i < ringCount; i++) {
      const ringGeo = new THREE.TorusGeometry(1.4 + i * 0.45, 0.018, 8, 80);
      const ringMat = new THREE.MeshBasicMaterial({
        color: accentColor,
        opacity: 0.35 - i * 0.07,
        transparent: true,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2 + (i * Math.PI) / 5;
      ring.rotation.y = (i * Math.PI) / 3;
      scene.add(ring);
      rings.push(ring);
    }

    // ── Floating data nodes ──────────────────────────────────────────────────
    const nodes: THREE.Mesh[] = [];
    const nodeCount = 12;
    for (let i = 0; i < nodeCount; i++) {
      const nodeGeo = new THREE.OctahedronGeometry(0.06, 0);
      const nodeMat = new THREE.MeshBasicMaterial({
        color: accentColor,
        opacity: 0.6,
        transparent: true,
      });
      const node = new THREE.Mesh(nodeGeo, nodeMat);
      const theta = (i / nodeCount) * Math.PI * 2;
      const radius = 2.1 + Math.sin(i * 1.3) * 0.4;
      node.position.set(
        Math.cos(theta) * radius,
        Math.sin(i * 0.7) * 0.8,
        Math.sin(theta) * radius
      );
      scene.add(node);
      nodes.push(node);
    }

    // ── Animation ─────────────────────────────────────────────────────────────
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      coreMesh.rotation.y = t * 0.4;
      coreMesh.rotation.x = Math.sin(t * 0.3) * 0.2;
      shellMesh.rotation.y = -t * 0.2;
      shellMesh.rotation.z = t * 0.15;

      rings.forEach((ring, i) => {
        ring.rotation.y = t * (0.3 + i * 0.15);
        ring.rotation.z = t * (0.1 + i * 0.1);
      });

      nodes.forEach((node, i) => {
        const theta = (i / nodeCount) * Math.PI * 2 + t * 0.25;
        const radius = 2.1 + Math.sin(i * 1.3 + t * 0.4) * 0.4;
        node.position.x = Math.cos(theta) * radius;
        node.position.z = Math.sin(theta) * radius;
        node.position.y = Math.sin(i * 0.7 + t * 0.5) * 0.8;
        node.rotation.y = t * 2;
      });

      // Pulsing emissive based on confidence
      coreMat.emissiveIntensity = 0.2 + Math.sin(t * 2) * 0.15 * confidence;

      renderer.render(scene, camera);
    };
    animate();

    // ── Resize ────────────────────────────────────────────────────────────────
    const handleResize = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      if (el.contains(renderer.domElement)) {
        el.removeChild(renderer.domElement);
      }
    };
  }, [status, confidence]);

  return <div ref={mountRef} className="w-full h-full" />;
}
