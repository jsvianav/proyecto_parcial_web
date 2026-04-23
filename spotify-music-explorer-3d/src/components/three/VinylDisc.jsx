import { useRef, useEffect } from 'react'
import * as THREE from 'three'

function makeGrooveTex(size = 1024, tint = '#070709') {
  const gc = document.createElement('canvas')
  gc.width = gc.height = size
  const gx = gc.getContext('2d')
  const CX = size / 2, CY = size / 2, MAX = size * 0.487

  gx.fillStyle = tint
  gx.fillRect(0, 0, size, size)

  for (let r = size * 0.082; r <= MAX; r += 1.9) {
    gx.beginPath()
    gx.arc(CX, CY, r, 0, Math.PI * 2)
    const phase = r % 3.8
    if (phase < 1.9) {
      gx.strokeStyle = 'rgba(255,255,255,0.11)'
      gx.lineWidth = 1.0
    } else {
      gx.strokeStyle = 'rgba(0,0,0,0.55)'
      gx.lineWidth = 0.9
    }
    gx.stroke()
  }

  const sheen = gx.createRadialGradient(CX * 0.55, CY * 0.52, 10, CX, CY, MAX * 1.1)
  sheen.addColorStop(0,    'rgba(255,255,255,0.22)')
  sheen.addColorStop(0.18, 'rgba(255,255,255,0.08)')
  sheen.addColorStop(0.50, 'rgba(255,255,255,0.02)')
  sheen.addColorStop(0.80, 'rgba(0,0,0,0.05)')
  sheen.addColorStop(1,    'rgba(0,0,0,0.18)')
  gx.fillStyle = sheen
  gx.beginPath(); gx.arc(CX, CY, size / 2, 0, Math.PI * 2); gx.fill()

  for (let i = 0; i < 6; i++) {
    const hue = i * 60
    const rArc = MAX * (0.45 + i * 0.06)
    gx.beginPath()
    gx.arc(CX, CY, rArc, -0.9, -0.1)
    gx.strokeStyle = `hsla(${hue},80%,75%,0.06)`
    gx.lineWidth = 14
    gx.stroke()
  }

  return new THREE.CanvasTexture(gc)
}

function makeLabelTex(size = 512, color = '#1DB954', secondColor = '#169c40') {
  const lc = document.createElement('canvas')
  lc.width = lc.height = size
  const lx = lc.getContext('2d')
  const CX = size / 2, CY = size / 2

  const bg = lx.createRadialGradient(CX, CY, 0, CX, CY, size / 2)
  bg.addColorStop(0, color)
  bg.addColorStop(1, secondColor)
  lx.fillStyle = bg
  lx.beginPath(); lx.arc(CX, CY, size / 2, 0, Math.PI * 2); lx.fill()

  for (let r = 20; r < size * 0.45; r += 18) {
    lx.beginPath(); lx.arc(CX, CY, r, 0, Math.PI * 2)
    lx.strokeStyle = 'rgba(0,0,0,0.12)'; lx.lineWidth = 1; lx.stroke()
  }

  lx.fillStyle = 'rgba(0,0,0,0.55)'
  lx.font = `bold ${size * 0.072}px Inter, sans-serif`
  lx.textAlign = 'center'
  lx.textBaseline = 'middle'
  lx.fillText('SPOTIFY', CX, CY - size * 0.07)
  lx.font = `${size * 0.052}px Inter, sans-serif`
  lx.fillText('EXPLORER', CX, CY + size * 0.05)

  lx.fillStyle = 'rgba(0,0,0,0.35)'
  lx.beginPath(); lx.arc(CX, CY, size * 0.042, 0, Math.PI * 2); lx.fill()

  return new THREE.CanvasTexture(lc)
}

export default function VinylDisc({ imageUrl, size = 300, spinning = true }) {
  const mountRef = useRef(null)
  const rafRef   = useRef(null)

  useEffect(() => {
    const el = mountRef.current
    if (!el) return

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
    renderer.setSize(size, size)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type    = THREE.PCFSoftShadowMap
    renderer.toneMapping       = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.35
    renderer.setClearColor(0x000000, 0)
    el.appendChild(renderer.domElement)

    const scene  = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 50)
    camera.position.set(0, 1.4, 6.4)
    camera.lookAt(0, 0.1, 0)

    scene.add(new THREE.AmbientLight(0xffffff, 0.22))

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.8)
    keyLight.position.set(3.5, 5, 4)
    keyLight.castShadow = true
    keyLight.shadow.mapSize.set(1024, 1024)
    scene.add(keyLight)

    const underLight = new THREE.DirectionalLight(0x334455, 1.0)
    underLight.position.set(-1, -4, 2)
    scene.add(underLight)

    const greenPt = new THREE.PointLight(0x1DB954, 7, 9)
    greenPt.position.set(-1.5, -1, 3)
    scene.add(greenPt)

    const rimLight = new THREE.PointLight(0x6688ff, 1.4, 16)
    rimLight.position.set(-3.5, 2.5, -2)
    scene.add(rimLight)

    const warmBack = new THREE.PointLight(0xffaa44, 0.6, 10)
    warmBack.position.set(3, -1, -3)
    scene.add(warmBack)

    const grooveTex  = makeGrooveTex(1024, '#070709')
    const grooveTexB = makeGrooveTex(1024, '#0a0508')
    const defaultLabelTex = imageUrl ? null : makeLabelTex(512, '#1DB954', '#0d7a36')
    const albumTex = imageUrl ? new THREE.TextureLoader().load(imageUrl) : null
    const topLabelTex = albumTex || defaultLabelTex
    const botLabelTex = makeLabelTex(512, '#169c40', '#0d5c28')

    const vg = new THREE.Group()
    vg.rotation.x = -0.12
    scene.add(vg)

    const DISC_H = 0.20
    const discGeo = new THREE.CylinderGeometry(2, 2, DISC_H, 128, 1)
    const sideMat = new THREE.MeshPhysicalMaterial({
      color: 0x0e0e14, roughness: 0.25, metalness: 0.15,
      clearcoat: 0.8, clearcoatRoughness: 0.12,
    })
    const topMat = new THREE.MeshPhysicalMaterial({
      map: grooveTex, roughness: 0.16, metalness: 0.04,
      clearcoat: 1.0, clearcoatRoughness: 0.04,
    })
    const botMat = new THREE.MeshPhysicalMaterial({
      map: grooveTexB, roughness: 0.18, metalness: 0.04,
      clearcoat: 1.0, clearcoatRoughness: 0.05,
    })
    const disc = new THREE.Mesh(discGeo, [sideMat, topMat, botMat])
    disc.castShadow = true
    vg.add(disc)

    const edgeMesh = new THREE.Mesh(
      new THREE.TorusGeometry(2, 0.048, 14, 128),
      new THREE.MeshPhysicalMaterial({ color: 0x222228, roughness: 0.20, metalness: 0.25, clearcoat: 0.7 })
    )
    edgeMesh.rotation.x = Math.PI / 2
    vg.add(edgeMesh)

    const topLabelMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.66, 0.66, DISC_H + 0.005, 64),
      [
        new THREE.MeshStandardMaterial({ color: 0x1a1a1e }),
        new THREE.MeshStandardMaterial({ map: topLabelTex, roughness: 0.52 }),
        new THREE.MeshStandardMaterial({ color: 0x111114 }),
      ]
    )
    vg.add(topLabelMesh)

    const botLabelMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.66, 0.66, DISC_H + 0.005, 64),
      [
        new THREE.MeshStandardMaterial({ color: 0x1a1a1e }),
        new THREE.MeshStandardMaterial({ color: 0x111114 }),
        new THREE.MeshStandardMaterial({ map: botLabelTex, roughness: 0.52 }),
      ]
    )
    vg.add(botLabelMesh)

    const goldMat = new THREE.MeshStandardMaterial({ color: 0xc4952a, roughness: 0.18, metalness: 0.95 })
    const makeRing = (y) => {
      const r = new THREE.Mesh(new THREE.TorusGeometry(0.66, 0.026, 6, 64), goldMat)
      r.rotation.x = Math.PI / 2; r.position.y = y; return r
    }
    vg.add(makeRing( DISC_H / 2 + 0.002))
    vg.add(makeRing(-DISC_H / 2 - 0.002))

    vg.add(new THREE.Mesh(
      new THREE.CylinderGeometry(0.054, 0.054, DISC_H + 0.04, 16),
      new THREE.MeshBasicMaterial({ color: 0x08080a })
    ))

    const shadowPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(12, 12),
      new THREE.ShadowMaterial({ opacity: 0.35 })
    )
    shadowPlane.rotation.x = -Math.PI / 2
    shadowPlane.position.y = -2.6
    shadowPlane.receiveShadow = true
    scene.add(shadowPlane)

    const N   = 120
    const pos = new Float32Array(N * 3)
    for (let i = 0; i < N; i++) {
      const a = Math.random() * Math.PI * 2
      const r = 2.6 + Math.random() * 2.6
      pos[i*3]   = Math.cos(a) * r
      pos[i*3+1] = (Math.random() - 0.5) * 3.2
      pos[i*3+2] = Math.sin(a) * r
    }
    const sGeo = new THREE.BufferGeometry()
    sGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    const sMat   = new THREE.PointsMaterial({ color: 0x1DB954, size: 0.058, transparent: true, opacity: 0.7, sizeAttenuation: true })
    const sparks = new THREE.Points(sGeo, sMat)
    scene.add(sparks)

    let mx = 0, my = 0, tmx = 0, tmy = 0
    const onMM = e => {
      const rect = el.getBoundingClientRect()
      mx = ((e.clientX - rect.left) / rect.width  - 0.5) * 2
      my = -((e.clientY - rect.top)  / rect.height - 0.5) * 2
    }
    document.addEventListener('mousemove', onMM)

    let clickTilt = 0
    const onClick = () => { clickTilt = 1.0 }
    el.addEventListener('click', onClick)

    let t = 0
    function animate() {
      rafRef.current = requestAnimationFrame(animate)
      t += 0.013

      tmx += (mx - tmx) * 0.042
      tmy += (my - tmy) * 0.042

      vg.position.y = Math.sin(t * 0.78) * 0.24

      if (spinning) vg.rotation.y += 0.009

      const baseX = -0.12
      vg.rotation.x = baseX + tmy * 0.28 - (clickTilt > 0.01 ? clickTilt * 0.40 : 0)
      vg.rotation.z = -tmx * 0.12
      clickTilt *= 0.88

      sparks.rotation.y += 0.005
      sparks.position.y  = vg.position.y * 0.2
      sMat.opacity = 0.38 + Math.sin(t * 1.8) * 0.30
      sMat.size    = 0.036 + Math.sin(t * 2.7) * 0.024

      greenPt.intensity  = 4.5 + Math.sin(t * 2.1) * 2.0
      greenPt.position.x = Math.sin(t * 0.62) * 2.4 - 0.8
      greenPt.position.z = Math.cos(t * 0.62) * 1.9 + 2.5

      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(rafRef.current)
      document.removeEventListener('mousemove', onMM)
      el.removeEventListener('click', onClick)
      renderer.dispose()
      grooveTex.dispose(); grooveTexB.dispose()
      if (defaultLabelTex) defaultLabelTex.dispose()
      botLabelTex.dispose()
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement)
    }
  }, [imageUrl, spinning, size])

  return (
    <div
      ref={mountRef}
      style={{
        width: size, height: size, flexShrink: 0, cursor: 'pointer',
        position: 'relative', overflow: 'visible',
        filter: 'drop-shadow(0 0 72px rgba(29,185,84,0.30))',
      }}
    />
  )
}
