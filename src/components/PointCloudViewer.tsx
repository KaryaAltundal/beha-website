import { useCallback, useEffect, useRef, useState } from 'react'
import {
  BufferGeometry,
  Color,
  ColorManagement,
  NoToneMapping,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
  SRGBColorSpace,
  Vector3,
  WebGLRenderer,
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader.js'
import type { Translations } from '../i18n/translations'

/**
 * Minimal PLY point cloud viewer.
 *
 * This module is the only place in the app that imports three, and it is only
 * ever reached through the React.lazy() boundary in PointCloudModal, so the
 * ~600 kB three chunk stays out of the initial page load.
 *
 * Three details are worth knowing before changing anything here:
 *
 * 1. Colour. PLYLoader already converts uchar vertex colours from sRGB into the
 *    renderer's linear working space (it calls Color.setRGB(..., SRGBColorSpace)
 *    per vertex). So the colours only come out right if the rest of the
 *    pipeline agrees: ColorManagement stays enabled, outputColorSpace stays
 *    sRGB, and tone mapping stays off. Switching on ACESFilmic — the usual
 *    reflex when a scene looks flat — is exactly what washes a survey cloud out
 *    to pale grey, because it is a film response curve applied to data that is
 *    already correctly exposed. All three are set explicitly below rather than
 *    left to default, so a future three upgrade cannot silently change them.
 *
 * 2. Up axis. Surveying data is Z-up, three is Y-up. Setting camera.up is
 *    enough: OrbitControls orbits around its object's up vector, so the horizon
 *    stays level and vertical drag tilts instead of rolling.
 *
 * 3. Origin. Cloud coordinates are often absolute (UTM eastings, or the
 *    geographic degrees Metashape wrote here), which float32 cannot hold at
 *    centimetre precision. Every loaded geometry is therefore recentred on its
 *    own bounding-sphere centre before it reaches the GPU.
 */

/** Point size in CSS pixels. Kept small — survey clouds read better sparse. */
const MIN_POINT_SIZE = 0.5
const MAX_POINT_SIZE = 6
const DEFAULT_POINT_SIZE = 1.6

/** Orbit start position, as a direction from the cloud centre in Z-up space. */
const START_DIRECTION = new Vector3(0.62, -0.86, 0.52).normalize()
/** Only used when a geometry somehow has no bounding box to fit against. */
const FALLBACK_DISTANCE = 2.1

type Status =
  | { kind: 'loading'; progress: number }
  | { kind: 'ready' }
  | { kind: 'error'; message: string }

export default function PointCloudViewer({
  src,
  title,
  onClose,
  t,
}: {
  src: string
  title: string
  onClose: () => void
  t: Translations['pointCloud']
}) {
  const hostRef = useRef<HTMLDivElement>(null)
  const cameraRef = useRef<PerspectiveCamera | null>(null)
  const controlsRef = useRef<OrbitControls | null>(null)
  const materialRef = useRef<PointsMaterial | null>(null)
  const pointsRef = useRef<Points | null>(null)
  const sceneRef = useRef<Scene | null>(null)
  const rendererRef = useRef<WebGLRenderer | null>(null)
  /** Bounding-sphere radius of the recentred cloud; drives framing and clipping. */
  const radiusRef = useRef(1)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [status, setStatus] = useState<Status>({ kind: 'loading', progress: 0 })
  const [pointSize, setPointSize] = useState(DEFAULT_POINT_SIZE)
  const [pointCount, setPointCount] = useState(0)
  const [label, setLabel] = useState(title)

  /** Drop a freshly parsed geometry into the scene, replacing whatever is there. */
  const showGeometry = useCallback((geometry: BufferGeometry) => {
    const scene = sceneRef.current
    const camera = cameraRef.current
    const controls = controlsRef.current
    if (!scene || !camera || !controls) return

    geometry.computeBoundingSphere()
    const sphere = geometry.boundingSphere
    const centre = sphere ? sphere.center.clone() : new Vector3()
    const radius = sphere && sphere.radius > 0 ? sphere.radius : 1

    // Recentre on the origin so float32 keeps its precision even for clouds
    // exported in absolute coordinates.
    geometry.translate(-centre.x, -centre.y, -centre.z)
    geometry.computeBoundingSphere()
    geometry.computeBoundingBox()
    radiusRef.current = radius

    const previous = pointsRef.current
    if (previous) {
      scene.remove(previous)
      previous.geometry.dispose()
    }

    const material =
      materialRef.current ??
      new PointsMaterial({ vertexColors: true, sizeAttenuation: false })
    // A cloud without vertex colours (some LiDAR exports) would otherwise draw
    // black on black, so fall back to the brand blue.
    material.vertexColors = geometry.hasAttribute('color')
    // The material colour multiplies the vertex colours, so it has to go back to
    // white when a coloured cloud replaces a colourless one.
    material.color = new Color(material.vertexColors ? '#ffffff' : '#4b83b4')
    materialRef.current = material

    const points = new Points(geometry, material)
    scene.add(points)
    pointsRef.current = points

    setPointCount(geometry.getAttribute('position').count)
    setStatus({ kind: 'ready' })
  }, [])

  /** Frame the whole cloud from the standard oblique surveying viewpoint. */
  const resetCamera = useCallback(() => {
    const camera = cameraRef.current
    const controls = controlsRef.current
    if (!camera || !controls) return

    const radius = radiusRef.current
    camera.near = Math.max(radius / 2000, 0.01)
    camera.far = radius * 60
    camera.updateProjectionMatrix()

    // Fit the frustum to the points themselves rather than to a bounding volume.
    // Neither the bounding sphere nor the bounding box works here: an aerial
    // block is a wide, flat, tilted slab, and survey clouds routinely carry a
    // few strays — a detached cape, noise above the site — that stretch any
    // enclosing volume well past the part anyone wants to look at. Both left
    // the site filling under half the canvas. So compute, per sampled point,
    // the camera distance at which that point would sit exactly on a frustum
    // edge, and take a high percentile of those: the site fills the frame and
    // a handful of outliers are allowed to fall outside it.
    const position = pointsRef.current?.geometry.getAttribute('position')
    let distance = radius * FALLBACK_DISTANCE

    if (position && position.count > 0) {
      const forward = START_DIRECTION.clone().negate()
      const right = new Vector3().crossVectors(forward, camera.up).normalize()
      const up = new Vector3().crossVectors(right, forward)
      const tanV = Math.tan((camera.fov * Math.PI) / 360)
      const tanH = tanV * camera.aspect

      const step = Math.max(1, Math.floor(position.count / FIT_SAMPLE_SIZE))
      const needed: number[] = []
      for (let i = 0; i < position.count; i += step) {
        const x = position.getX(i)
        const y = position.getY(i)
        const z = position.getZ(i)
        const along = x * START_DIRECTION.x + y * START_DIRECTION.y + z * START_DIRECTION.z
        const across = Math.abs(x * right.x + y * right.y + z * right.z) / tanH
        const vertical = Math.abs(x * up.x + y * up.y + z * up.z) / tanV
        needed.push(along + Math.max(across, vertical))
      }

      needed.sort((a, b) => a - b)
      const cut = needed[Math.floor((needed.length - 1) * FIT_PERCENTILE)]
      if (cut > 0) distance = cut * 1.05 // a little breathing room around the block
    }

    camera.position.copy(START_DIRECTION).multiplyScalar(distance)

    controls.target.set(0, 0, 0)
    controls.minDistance = radius * 0.02
    controls.maxDistance = radius * 12
    controls.update()
  }, [])

  // Build the renderer once, then keep it for the lifetime of the modal.
  useEffect(() => {
    const host = hostRef.current
    if (!host) return

    ColorManagement.enabled = true

    const renderer = new WebGLRenderer({ antialias: false, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(host.clientWidth, host.clientHeight)
    renderer.outputColorSpace = SRGBColorSpace
    renderer.toneMapping = NoToneMapping
    renderer.domElement.style.display = 'block'
    renderer.domElement.style.touchAction = 'none'
    host.appendChild(renderer.domElement)
    rendererRef.current = renderer

    const scene = new Scene()
    sceneRef.current = scene

    const camera = new PerspectiveCamera(55, host.clientWidth / host.clientHeight, 0.1, 5000)
    camera.up.set(0, 0, 1) // surveying convention: Z is the height axis
    cameraRef.current = camera

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.06
    controls.screenSpacePanning = true
    controls.zoomToCursor = true
    controls.rotateSpeed = 0.6
    controls.panSpeed = 0.8
    controlsRef.current = controls

    let frame = 0
    // Render only while the camera is actually moving. controls.update() reports
    // whether damping still has momentum, so an idle modal costs nothing.
    let dirty = true
    const markDirty = () => {
      dirty = true
    }
    controls.addEventListener('change', markDirty)

    const tick = () => {
      frame = requestAnimationFrame(tick)
      const moving = controls.update()
      if (moving || dirty) {
        renderer.render(scene, camera)
        dirty = false
      }
    }
    frame = requestAnimationFrame(tick)

    const observer = new ResizeObserver(() => {
      const { clientWidth, clientHeight } = host
      if (clientWidth === 0 || clientHeight === 0) return
      camera.aspect = clientWidth / clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(clientWidth, clientHeight)
      dirty = true
    })
    observer.observe(host)

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      controls.removeEventListener('change', markDirty)
      controls.dispose()
      pointsRef.current?.geometry.dispose()
      materialRef.current?.dispose()
      renderer.dispose()
      renderer.domElement.remove()
      pointsRef.current = null
      materialRef.current = null
    }
  }, [])

  // Fetch the project's cloud. A second effect so swapping in a local file
  // later does not tear down the renderer.
  useEffect(() => {
    let cancelled = false
    const loader = new PLYLoader()

    setStatus({ kind: 'loading', progress: 0 })
    loader.load(
      src,
      (geometry) => {
        if (cancelled) {
          geometry.dispose()
          return
        }
        showGeometry(geometry)
        resetCamera()
      },
      (event) => {
        if (cancelled || !event.lengthComputable) return
        setStatus({ kind: 'loading', progress: event.loaded / event.total })
      },
      () => {
        if (!cancelled) setStatus({ kind: 'error', message: t.loadError })
      },
    )

    return () => {
      cancelled = true
    }
  }, [src, showGeometry, resetCamera, t.loadError])

  // Keep the material in step with the slider. gl_PointSize is in device
  // pixels, so scale by the pixel ratio to make the slider mean CSS pixels.
  useEffect(() => {
    const material = materialRef.current
    const renderer = rendererRef.current
    if (!material || !renderer) return
    material.size = pointSize * renderer.getPixelRatio()
    controlsRef.current?.dispatchEvent({ type: 'change' })
  }, [pointSize, status])

  const openLocalFile = async (file: File) => {
    setStatus({ kind: 'loading', progress: 0 })
    try {
      const buffer = await file.arrayBuffer()
      const geometry = new PLYLoader().parse(buffer)
      showGeometry(geometry)
      resetCamera()
      setLabel(file.name)
    } catch {
      setStatus({ kind: 'error', message: t.parseError })
    }
  }

  const isBusy = status.kind === 'loading'

  return (
    <>
      <div ref={hostRef} className="absolute inset-0" />

      {/* Title, top left */}
      <div className="pointer-events-none absolute left-5 top-5 max-w-[60%]">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60">
          {t.eyebrow}
        </p>
        <p className="mt-1 truncate text-sm font-semibold text-white/95">{label}</p>
        {status.kind === 'ready' && pointCount > 0 && (
          <p className="mt-0.5 font-mono text-[11px] text-white/45">
            {t.pointCount(pointCount)}
          </p>
        )}
      </div>

      {/* Close, top right */}
      <button
        type="button"
        onClick={onClose}
        aria-label={t.close}
        className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white/80 backdrop-blur-md transition-colors duration-200 hover:bg-white/20 hover:text-white"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4" aria-hidden="true">
          <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Loading / error veil */}
      {status.kind !== 'ready' && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="rounded-2xl bg-black/45 px-6 py-5 text-center backdrop-blur-md">
            {status.kind === 'error' ? (
              <p className="text-sm text-white/85">{status.message}</p>
            ) : (
              <>
                <p className="text-sm text-white/85">{t.loading}</p>
                <div className="mt-3 h-1 w-44 overflow-hidden rounded-full bg-white/15">
                  <div
                    className="h-full rounded-full bg-[var(--color-primary-500)] transition-[width] duration-200 ease-out"
                    style={{ width: `${Math.round(status.progress * 100)}%` }}
                  />
                </div>
                <p className="mt-2 font-mono text-[11px] text-white/50">
                  {Math.round(status.progress * 100)}%
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Control bar, bottom */}
      <div className="absolute inset-x-0 bottom-0 flex justify-center px-4 pb-5">
        <div className="flex max-w-full flex-wrap items-center justify-center gap-x-5 gap-y-3 rounded-full border border-white/12 bg-black/45 px-5 py-2.5 backdrop-blur-md">
          <label className="flex items-center gap-3">
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/55">
              {t.pointSize}
            </span>
            <input
              type="range"
              min={MIN_POINT_SIZE}
              max={MAX_POINT_SIZE}
              step={0.1}
              value={pointSize}
              disabled={isBusy}
              onChange={(event) => setPointSize(Number(event.target.value))}
              className="h-1 w-28 cursor-pointer appearance-none rounded-full bg-white/20 accent-[var(--color-primary-500)] disabled:cursor-not-allowed sm:w-36"
            />
            <span className="w-7 font-mono text-[11px] tabular-nums text-white/45">
              {pointSize.toFixed(1)}
            </span>
          </label>

          <span className="hidden h-5 w-px bg-white/12 sm:block" aria-hidden="true" />

          <button
            type="button"
            onClick={resetCamera}
            disabled={isBusy}
            className="flex items-center gap-2 text-xs font-semibold text-white/70 transition-colors duration-200 hover:text-white disabled:opacity-40 disabled:hover:text-white/70"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4" aria-hidden="true">
              <path d="M3 12a9 9 0 1 1 3 6.7" strokeLinecap="round" />
              <path d="M3 20v-5h5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {t.resetView}
          </button>

          <span className="hidden h-5 w-px bg-white/12 sm:block" aria-hidden="true" />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 text-xs font-semibold text-white/70 transition-colors duration-200 hover:text-white"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4" aria-hidden="true">
              <path d="M12 16V4m0 0L8 8m4-4 4 4" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {t.openFile}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".ply"
            className="sr-only"
            onChange={(event) => {
              const file = event.target.files?.[0]
              if (file) void openLocalFile(file)
              event.target.value = ''
            }}
          />
        </div>
      </div>
    </>
  )
}
