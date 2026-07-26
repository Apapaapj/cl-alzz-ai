'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function ThinkingAnimation() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mountRef.current) return

    const container = mountRef.current
    const W = 80
    const H = 80

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(W, H)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    container.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100)
    camera.position.set(0, 0, 4)

    // Robot head (box)
    const headGeo = new THREE.BoxGeometry(1.2, 1.2, 1.2)
    const headMat = new THREE.MeshBasicMaterial({
      color: 0x8B0000,
      wireframe: true,
    })
    const head = new THREE.Mesh(headGeo, headMat)
    scene.add(head)

    // Eyes (small spheres)
    const eyeGeo = new THREE.SphereGeometry(0.12, 8, 8)
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0xFF1A1A })
    const leftEye = new THREE.Mesh(eyeGeo, eyeMat)
    leftEye.position.set(-0.3, 0.1, 0.62)
    const rightEye = new THREE.Mesh(eyeGeo, eyeMat)
    rightEye.position.set(0.3, 0.1, 0.62)
    head.add(leftEye, rightEye)

    // Antenna
    const antennaGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.6, 6)
    const antennaMat = new THREE.MeshBasicMaterial({ color: 0x6B0000 })
    const antenna = new THREE.Mesh(antennaGeo, antennaMat)
    antenna.position.set(0, 0.9, 0)
    scene.add(antenna)

    const antennaTipGeo = new THREE.SphereGeometry(0.08, 8, 8)
    const antennaTipMat = new THREE.MeshBasicMaterial({ color: 0xFF1A1A })
    const antennaTip = new THREE.Mesh(antennaTipGeo, antennaTipMat)
    antennaTip.position.set(0, 1.2, 0)
    scene.add(antennaTip)

    // Thinking particles around head
    const particleCount = 20
    const particleGeos: THREE.Mesh[] = []
    for (let i = 0; i < particleCount; i++) {
      const pGeo = new THREE.SphereGeometry(0.03, 4, 4)
      const pMat = new THREE.MeshBasicMaterial({ color: 0xCC0000, transparent: true, opacity: 0.8 })
      const p = new THREE.Mesh(pGeo, pMat)
      p.userData = {
        angle: (i / particleCount) * Math.PI * 2,
        radius: 1.2 + Math.random() * 0.5,
        speed: 0.3 + Math.random() * 0.5,
        yOff: (Math.random() - 0.5) * 0.8,
      }
      scene.add(p)
      particleGeos.push(p)
    }

    let raf: number
    let t = 0
    const animate = () => {
      raf = requestAnimationFrame(animate)
      t += 0.03

      // Head bob thinking animation
      head.rotation.y = Math.sin(t * 0.8) * 0.3
      head.rotation.x = Math.sin(t * 0.5) * 0.1

      // Antenna tip pulse
      const pulse = 0.5 + Math.sin(t * 3) * 0.5
      ;(antennaTipMat as THREE.MeshBasicMaterial).opacity = pulse
      antennaTip.scale.setScalar(0.8 + pulse * 0.4)

      // Orbit particles
      particleGeos.forEach(p => {
        p.userData.angle += p.userData.speed * 0.02
        p.position.x = Math.cos(p.userData.angle) * p.userData.radius
        p.position.z = Math.sin(p.userData.angle) * p.userData.radius
        p.position.y = p.userData.yOff + Math.sin(t * 2 + p.userData.angle) * 0.15
        ;(p.material as THREE.MeshBasicMaterial).opacity = 0.4 + Math.sin(t * 4 + p.userData.angle) * 0.4
      })

      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(raf)
      renderer.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div className="absolute bottom-0 right-0 mb-2 mr-4 z-10 flex flex-col items-center gap-1 pointer-events-none">
      <div ref={mountRef} style={{ width: 80, height: 80 }} />
      <div className="font-mono text-[9px] text-alzz-red-bright tracking-[0.2em] animate-pulse">
        THINKING...
      </div>
    </div>
  )
}
