'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

interface IntroScreenProps {
  onComplete: () => void
}

export default function IntroScreen({ onComplete }: IntroScreenProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [phase, setPhase] = useState<'loading' | 'glitch' | 'reveal' | 'exit'>('loading')
  const [glitchText, setGlitchText] = useState('CL-ALZZ')
  const [skipVisible, setSkipVisible] = useState(false)

  // Three.js particle background
  useEffect(() => {
    if (!canvasRef.current) return
    const canvas = canvasRef.current
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 5

    // Particle field
    const count = 2000
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 20
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const mat = new THREE.PointsMaterial({ 
      color: 0x8B0000, 
      size: 0.03,
      transparent: true,
      opacity: 0.8
    })
    const particles = new THREE.Points(geo, mat)
    scene.add(particles)

    // Floating shards (cracked glass effect)
    const shardCount = 30
    for (let i = 0; i < shardCount; i++) {
      const shardGeo = new THREE.PlaneGeometry(
        Math.random() * 0.5 + 0.1,
        Math.random() * 0.8 + 0.1
      )
      const shardMat = new THREE.MeshBasicMaterial({
        color: Math.random() > 0.5 ? 0x8B0000 : 0x330000,
        transparent: true,
        opacity: Math.random() * 0.4 + 0.1,
        side: THREE.DoubleSide,
      })
      const shard = new THREE.Mesh(shardGeo, shardMat)
      shard.position.set(
        (Math.random() - 0.5) * 16,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 4
      )
      shard.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      )
      scene.add(shard)
    }

    let raf: number
    let t = 0
    const animate = () => {
      raf = requestAnimationFrame(animate)
      t += 0.005
      particles.rotation.y = t * 0.1
      particles.rotation.x = t * 0.05
      renderer.render(scene, camera)
    }
    animate()

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
      geo.dispose()
      mat.dispose()
    }
  }, [])

  // Intro sequence timing
  useEffect(() => {
    const t1 = setTimeout(() => { setPhase('glitch'); setSkipVisible(true) }, 600)
    const t2 = setTimeout(() => setPhase('reveal'), 2200)
    const t3 = setTimeout(() => setPhase('exit'), 4000)
    const t4 = setTimeout(() => onComplete(), 4700)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4) }
  }, [onComplete])

  // Glitch text scramble
  useEffect(() => {
    if (phase !== 'glitch') return
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%'
    const original = 'CL-ALZZ'
    let iter = 0
    const interval = setInterval(() => {
      setGlitchText(original.split('').map((char, idx) => {
        if (char === '-') return '-'
        if (idx < iter) return original[idx]
        return chars[Math.floor(Math.random() * chars.length)]
      }).join(''))
      iter += 0.5
      if (iter > original.length) clearInterval(interval)
    }, 50)
    return () => clearInterval(interval)
  }, [phase])

  return (
    <div className={`fixed inset-0 z-50 bg-alzz-black flex items-center justify-center overflow-hidden transition-opacity duration-700 ${phase === 'exit' ? 'opacity-0' : 'opacity-100'}`}>
      {/* Three.js canvas background */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Red crack lines */}
      <div className="absolute inset-0 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">
          <line x1="960" y1="540" x2="400" y2="100" stroke="#8B0000" strokeWidth="1" opacity="0.4" />
          <line x1="960" y1="540" x2="1600" y2="200" stroke="#8B0000" strokeWidth="0.5" opacity="0.3" />
          <line x1="960" y1="540" x2="200" y2="800" stroke="#6B0000" strokeWidth="0.8" opacity="0.25" />
          <line x1="960" y1="540" x2="1700" y2="900" stroke="#8B0000" strokeWidth="1.2" opacity="0.35" />
          <line x1="960" y1="540" x2="960" y2="0" stroke="#CC0000" strokeWidth="0.5" opacity="0.2" />
          <line x1="960" y1="540" x2="1200" y2="1080" stroke="#8B0000" strokeWidth="0.7" opacity="0.3" />
          {/* Crack fragments */}
          <line x1="400" y1="100" x2="350" y2="60" stroke="#6B0000" strokeWidth="0.5" opacity="0.3" />
          <line x1="400" y1="100" x2="450" y2="80" stroke="#6B0000" strokeWidth="0.5" opacity="0.2" />
          <line x1="1600" y1="200" x2="1650" y2="150" stroke="#6B0000" strokeWidth="0.5" opacity="0.25" />
        </svg>
      </div>

      {/* Scan line effect */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(139,0,0,0.02) 2px, rgba(139,0,0,0.02) 4px)'
        }}
      />

      {/* Main content */}
      <div className="relative z-10 text-center select-none">
        {/* AI badge */}
        <div className={`mb-6 transition-all duration-500 ${phase === 'loading' ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
          <span className="font-mono text-xs tracking-[0.4em] text-alzz-red-bright border border-alzz-border px-4 py-1 uppercase">
            INITIALIZING SYSTEM
          </span>
        </div>

        {/* Main title — glitch effect */}
        <div className="relative mb-2">
          <h1
            className="font-display text-7xl md:text-9xl font-black tracking-wider text-glow-red text-alzz-red-bright"
            style={{
              textShadow: phase === 'glitch'
                ? '4px 0 #FF0000, -4px 0 #8B0000, 0 0 30px #CC0000'
                : '0 0 30px rgba(204,0,0,0.8), 0 0 60px rgba(139,0,0,0.4)',
              filter: phase === 'glitch' ? 'blur(0.5px)' : 'none',
              transition: 'text-shadow 0.1s, filter 0.1s',
            }}
          >
            {phase === 'glitch' ? glitchText : 'CL-ALZZ'}
          </h1>

          {/* Horizontal glitch bars */}
          {phase === 'glitch' && (
            <>
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div
                  className="absolute w-full h-6 bg-alzz-red-bright mix-blend-screen"
                  style={{
                    top: `${Math.random() * 80}%`,
                    opacity: 0.15,
                    transform: `translateX(${(Math.random() - 0.5) * 20}px)`,
                  }}
                />
              </div>
            </>
          )}
        </div>

        <p className={`font-mono text-sm md:text-base tracking-[0.3em] text-alzz-muted uppercase mb-10 transition-all duration-700 ${phase === 'reveal' || phase === 'exit' ? 'opacity-100' : 'opacity-0'}`}>
          AI ASSISTANT · BY ALZZISBACK
        </p>

        {/* Loading bar */}
        <div className={`w-48 md:w-64 h-0.5 bg-alzz-border mx-auto overflow-hidden transition-all duration-500 ${phase === 'loading' ? 'opacity-0' : 'opacity-100'}`}>
          <div
            className="h-full bg-alzz-red-bright transition-all"
            style={{
              width: phase === 'loading' ? '0%' : phase === 'glitch' ? '60%' : '100%',
              transitionDuration: phase === 'glitch' ? '1.5s' : '0.5s',
              boxShadow: '0 0 10px #CC0000',
            }}
          />
        </div>
      </div>

      {/* Skip button */}
      {skipVisible && phase !== 'exit' && (
        <button
          onClick={onComplete}
          className="absolute bottom-8 right-8 font-mono text-xs text-alzz-muted hover:text-alzz-text transition-colors tracking-widest uppercase border border-alzz-border px-4 py-2 hover:border-alzz-red"
        >
          SKIP ▶
        </button>
      )}

      {/* Corner decorations */}
      <div className="absolute top-6 left-6 font-mono text-[10px] text-alzz-red opacity-50 tracking-widest">
        SYS::BOOT<br />
        VER 1.0.0<br />
        OK
      </div>
      <div className="absolute bottom-6 left-6 font-mono text-[10px] text-alzz-muted opacity-40">
        OWNER::ALZZISBACK<br />
        STATUS::ONLINE
      </div>
    </div>
  )
}
