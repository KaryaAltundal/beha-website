import { motion, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '../i18n/LanguageContext'
import { translations } from '../i18n/translations'

const palette = {
  line: '#5CB8F5',
  lineStrong: '#35AAF7',
  node: '#35AAF7',
  nodeSoft: '#8ACCF7',
  contour: '#B9E2FA',
  wash: '#EAF6FD',
}

const timing = {
  contour: 0.15,
  trunk: 0.25,
  branchBase: 0.9,
  branchStep: 0.1,
  tieBase: 1.35,
  tieStep: 0.09,
  nodeBase: 1.15,
  nodeStep: 0.045,
  statBase: 1.5,
  statStep: 0.16,
  countDelay: 1600,
  countDuration: 1700,
}

type Statistic =
  | { kind: 'count'; value: number; suffix: string; label: string }
  | { kind: 'text'; headline: string; label: string }

type Scene = {
  width: number
  height: number
  contours: string[]
  trunk: string
  branches: string[]
  ties: string[]
  nodes: [number, number][]
  labels: { x: number; y: number; text: string }[]
  anchors: [number, number][]
  placement: 'above' | 'right'
}

/** Wide traverse: one main line carrying the three statistic nodes, triangulated with branches. */
const wideScene: Scene = {
  width: 960,
  height: 340,
  contours: [
    'M -20 96 C 160 40, 320 150, 520 96 S 860 20, 1000 84',
    'M -20 168 C 180 118, 340 224, 540 172 S 880 96, 1000 158',
    'M -20 250 C 200 200, 360 300, 560 250 S 900 176, 1000 240',
    'M -20 318 C 220 276, 400 360, 600 318 S 920 250, 1000 306',
  ],
  trunk: 'M 40 264 L 150 232 L 302 268 L 470 120 L 636 176 L 726 226 L 800 226 L 928 190',
  branches: [
    'M 302 268 L 356 198 L 424 210',
    'M 150 232 L 200 300 L 318 310',
    'M 470 120 L 528 214 L 604 232',
    'M 636 176 L 688 104 L 764 88',
    'M 800 226 L 742 288 L 640 296',
    'M 928 190 L 906 258 L 848 282',
  ],
  ties: ['M 200 300 L 302 268', 'M 424 210 L 470 120', 'M 528 214 L 636 176', 'M 640 296 L 604 232'],
  nodes: [
    [40, 264],
    [302, 268],
    [636, 176],
    [726, 226],
    [928, 190],
    [356, 198],
    [424, 210],
    [200, 300],
    [318, 310],
    [528, 214],
    [604, 232],
    [688, 104],
    [764, 88],
    [742, 288],
    [640, 296],
    [906, 258],
    [848, 282],
  ],
  labels: [
    { x: 776, y: 78, text: '39°55′12″N' },
    { x: 330, y: 328, text: '32°51′14″E' },
  ],
  anchors: [
    [150, 232],
    [470, 120],
    [800, 226],
  ],
  placement: 'above',
}

/** Compact traverse: the same net folded into a vertical rail, statistic labels sitting to the right. */
const compactScene: Scene = {
  width: 340,
  height: 540,
  contours: [
    'M -20 120 C 80 80, 200 170, 360 110',
    'M -20 240 C 90 200, 210 290, 360 230',
    'M -20 368 C 80 330, 210 418, 360 356',
    'M -20 486 C 90 450, 200 530, 360 476',
  ],
  trunk: 'M 44 16 L 52 84 L 88 172 L 52 262 L 90 350 L 52 440 L 76 520',
  branches: [
    'M 88 172 L 152 140 L 216 160',
    'M 88 172 L 140 214 L 206 220',
    'M 90 350 L 158 322 L 222 340',
    'M 52 262 L 20 300 L 34 344',
    'M 52 84 L 22 128 L 36 158',
    'M 52 440 L 20 480 L 40 512',
  ],
  ties: ['M 216 160 L 206 220', 'M 152 140 L 140 214'],
  nodes: [
    [44, 16],
    [88, 172],
    [90, 350],
    [76, 520],
    [152, 140],
    [216, 160],
    [140, 214],
    [206, 220],
    [158, 322],
    [222, 340],
    [20, 300],
    [34, 344],
    [22, 128],
    [36, 158],
    [20, 480],
    [40, 512],
  ],
  labels: [{ x: 232, y: 152, text: '39°55′12″N' }],
  anchors: [
    [52, 84],
    [52, 262],
    [52, 440],
  ],
  placement: 'right',
}

/**
 * Owns its own per-frame state so counting up never re-renders the surrounding
 * SVG, which is upwards of sixty elements.
 */
function CountUpValue({
  value,
  suffix,
  isActive,
  isInstant,
}: {
  value: number
  suffix: string
  isActive: boolean
  isInstant: boolean
}) {
  const [count, setCount] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    if (!isActive) {
      setCount(0)
      setIsComplete(false)
      return
    }

    if (isInstant) {
      setCount(value)
      setIsComplete(true)
      return
    }

    let frameId = 0
    let startTime = 0

    const step = (now: number) => {
      if (!startTime) startTime = now

      const progress = Math.min((now - startTime) / timing.countDuration, 1)
      const eased = 1 - (1 - progress) ** 3

      setCount(Math.round(value * eased))

      if (progress < 1) {
        frameId = requestAnimationFrame(step)
      } else {
        setIsComplete(true)
      }
    }

    const startId = window.setTimeout(() => {
      frameId = requestAnimationFrame(step)
    }, timing.countDelay)

    // Guarantee the final number even if rAF is throttled or never fires, so the
    // statistic can never be left sitting at zero.
    const safetyId = window.setTimeout(() => {
      setCount(value)
      setIsComplete(true)
    }, timing.countDelay + timing.countDuration + 1200)

    return () => {
      window.clearTimeout(startId)
      window.clearTimeout(safetyId)
      cancelAnimationFrame(frameId)
    }
  }, [isActive, isInstant, value])

  return (
    <>
      {count}
      {isComplete ? suffix : ''}
    </>
  )
}

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches,
  )

  useEffect(() => {
    const mediaQuery = window.matchMedia(query)
    const update = () => setMatches(mediaQuery.matches)

    update()
    mediaQuery.addEventListener('change', update)

    return () => mediaQuery.removeEventListener('change', update)
  }, [query])

  return matches
}

export function SurveyNetwork() {
  const { language } = useLanguage()
  const t = translations[language]
  const containerRef = useRef<HTMLDivElement | null>(null)
  const prefersReducedMotion = useReducedMotion()
  const isCompact = useMediaQuery('(max-width: 767px)')

  const [isActive, setIsActive] = useState(false)

  const statistics: Statistic[] = [
    { kind: 'count', value: 25, suffix: '+', label: t.surveyNetwork.yearsExperience },
    { kind: 'count', value: 500, suffix: '+', label: t.surveyNetwork.completedProjects },
    { kind: 'text', headline: t.surveyNetwork.internationalProjectHeadline, label: t.surveyNetwork.internationalProjectLabel },
  ]

  const scene = isCompact ? compactScene : wideScene
  const shouldDraw = isActive && !prefersReducedMotion

  // Plays the entrance animation every time the section scrolls into view and
  // resets it every time it scrolls back out, so returning via the navbar
  // (About → Services → About) replays it from the start rather than once
  // per page load.
  useEffect(() => {
    const element = containerRef.current
    if (!element) return

    const observer = new IntersectionObserver(([entry]) => setIsActive(entry.isIntersecting), {
      threshold: 0.2,
    })

    observer.observe(element)

    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative mx-auto mt-16 w-full max-w-[960px]"
      style={{ aspectRatio: `${scene.width} / ${scene.height}` }}
    >
      <svg
        key={isCompact ? 'compact' : 'wide'}
        viewBox={`0 0 ${scene.width} ${scene.height}`}
        preserveAspectRatio="xMidYMid meet"
        className="block h-full w-full"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <radialGradient id="beha-net-wash" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={palette.wash} stopOpacity="0.9" />
            <stop offset="100%" stopColor={palette.wash} stopOpacity="0" />
          </radialGradient>
        </defs>

        <ellipse
          cx={scene.width / 2}
          cy={scene.height / 2}
          rx={scene.width * 0.48}
          ry={scene.height * 0.46}
          fill="url(#beha-net-wash)"
        />

        <g>
          {scene.contours.map((contour, index) => (
            <motion.path
              key={contour}
              d={contour}
              fill="none"
              stroke={palette.contour}
              strokeWidth="1"
              initial={{ opacity: 0 }}
              animate={{ opacity: isActive ? 0.55 : 0 }}
              transition={{ duration: 1.1, delay: timing.contour + index * 0.08, ease: 'easeOut' }}
            />
          ))}
        </g>

        <g>
          <motion.path
            d={scene.trunk}
            fill="none"
            stroke={palette.lineStrong}
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: isActive ? 1 : 0, opacity: isActive ? 0.85 : 0 }}
            transition={{
              pathLength: { duration: shouldDraw ? 1 : 0, delay: shouldDraw ? timing.trunk : 0, ease: 'easeInOut' },
              opacity: { duration: 0.3, delay: shouldDraw ? timing.trunk : 0 },
            }}
          />

          {scene.branches.map((branch, index) => (
            <motion.path
              key={branch}
              d={branch}
              fill="none"
              stroke={palette.line}
              strokeWidth="1.1"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: isActive ? 1 : 0, opacity: isActive ? 0.7 : 0 }}
              transition={{
                duration: shouldDraw ? 0.6 : 0,
                delay: shouldDraw ? timing.branchBase + index * timing.branchStep : 0,
                ease: 'easeInOut',
              }}
            />
          ))}

          {scene.ties.map((tie, index) => (
            <motion.path
              key={tie}
              d={tie}
              fill="none"
              stroke={palette.nodeSoft}
              strokeWidth="0.8"
              strokeLinecap="round"
              strokeDasharray="4 5"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: isActive ? 1 : 0, opacity: isActive ? 0.85 : 0 }}
              transition={{
                duration: shouldDraw ? 0.5 : 0,
                delay: shouldDraw ? timing.tieBase + index * timing.tieStep : 0,
                ease: 'easeOut',
              }}
            />
          ))}
        </g>

        <g>
          {scene.nodes.map(([x, y], index) => (
            <g key={`${x}-${y}`}>
              <motion.circle
                cx={x}
                cy={y}
                fill={palette.node}
                initial={{ r: 0, opacity: 0 }}
                animate={{ r: isActive ? 7 : 0, opacity: isActive ? 0.14 : 0 }}
                transition={{
                  duration: shouldDraw ? 0.45 : 0,
                  delay: shouldDraw ? timing.nodeBase + index * timing.nodeStep : 0,
                  ease: 'easeOut',
                }}
              />
              <motion.circle
                cx={x}
                cy={y}
                fill={palette.node}
                initial={{ r: 0, opacity: 0 }}
                animate={{ r: isActive ? 2.8 : 0, opacity: isActive ? 1 : 0 }}
                transition={{
                  duration: shouldDraw ? 0.4 : 0,
                  delay: shouldDraw ? timing.nodeBase + index * timing.nodeStep : 0,
                  ease: 'easeOut',
                }}
              />
            </g>
          ))}

          {scene.labels.map((label) => (
            <motion.text
              key={label.text}
              x={label.x}
              y={label.y}
              fill={palette.node}
              fontSize="9"
              letterSpacing="0.08em"
              className="font-mono"
              initial={{ opacity: 0 }}
              animate={{ opacity: isActive ? 0.4 : 0 }}
              transition={{ duration: 0.6, delay: shouldDraw ? timing.statBase : 0, ease: 'easeOut' }}
            >
              {label.text}
            </motion.text>
          ))}

          {scene.anchors.map(([x, y], index) => (
            <g key={`anchor-${x}-${y}`}>
              {shouldDraw && (
                <motion.circle
                  cx={x}
                  cy={y}
                  fill="none"
                  stroke={palette.node}
                  strokeWidth="1"
                  initial={{ r: 9, opacity: 0 }}
                  animate={{ r: [9, 22], opacity: [0.35, 0] }}
                  transition={{
                    duration: 2.8,
                    delay: timing.statBase + index * timing.statStep,
                    repeat: Infinity,
                    repeatDelay: 1.2,
                    ease: 'easeOut',
                  }}
                />
              )}
              <motion.circle
                cx={x}
                cy={y}
                fill="#ffffff"
                stroke={palette.node}
                strokeWidth="1.2"
                initial={{ r: 0, opacity: 0 }}
                animate={{ r: isActive ? 8 : 0, opacity: isActive ? 1 : 0 }}
                transition={{
                  duration: shouldDraw ? 0.5 : 0,
                  delay: shouldDraw ? timing.statBase + index * timing.statStep : 0,
                  ease: 'easeOut',
                }}
              />
              <motion.circle
                cx={x}
                cy={y}
                fill={palette.node}
                initial={{ r: 0, opacity: 0 }}
                animate={{ r: isActive ? 3.6 : 0, opacity: isActive ? 1 : 0 }}
                transition={{
                  duration: shouldDraw ? 0.5 : 0,
                  delay: shouldDraw ? timing.statBase + 0.08 + index * timing.statStep : 0,
                  ease: 'easeOut',
                }}
              />
            </g>
          ))}
        </g>
      </svg>

      {statistics.map((statistic, index) => {
        const [x, y] = scene.anchors[index]
        const isAbove = scene.placement === 'above'

        // The placement transform lives on this wrapper because Framer Motion
        // owns `style.transform` on any element it animates with x/y.
        return (
          <div
            key={statistic.label}
            className="absolute"
            style={
              isAbove
                ? {
                    left: `${(x / scene.width) * 100}%`,
                    top: `${(y / scene.height) * 100}%`,
                    transform: 'translate(-50%, -100%)',
                    marginTop: '-30px',
                  }
                : {
                    left: `${((x + 26) / scene.width) * 100}%`,
                    top: `${(y / scene.height) * 100}%`,
                    width: `${((scene.width - x - 34) / scene.width) * 100}%`,
                    transform: 'translateY(-50%)',
                  }
            }
          >
            <motion.div
              className={isAbove ? 'text-center' : 'text-left'}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 10 }}
              transition={{
                duration: shouldDraw ? 0.6 : 0,
                delay: shouldDraw ? timing.statBase + 0.15 + index * timing.statStep : 0,
                ease: 'easeOut',
              }}
            >
              {statistic.kind === 'count' ? (
                <p className="text-[2rem] font-medium leading-none tracking-[-0.03em] text-[#35AAF7] sm:text-[2.25rem] lg:text-[2.5rem]">
                  <CountUpValue
                    value={statistic.value}
                    suffix={statistic.suffix}
                    isActive={isActive}
                    isInstant={Boolean(prefersReducedMotion)}
                  />
                </p>
              ) : (
                <p className="text-lg font-medium leading-tight tracking-[-0.02em] text-[#35AAF7] sm:text-xl lg:text-2xl">
                  {statistic.headline}
                </p>
              )}
              <p className="mt-1.5 text-sm font-medium text-[var(--color-body)] sm:whitespace-nowrap">
                {statistic.label}
              </p>
            </motion.div>
          </div>
        )
      })}
    </div>
  )
}
