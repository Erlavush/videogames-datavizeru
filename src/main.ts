import './style.css'
import gsap from 'gsap'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

// ============================================
// SLIDE DATA
// ============================================
const slideData = {
  topGames: [
    { title: "Grand Theft Auto V (PS3)", sales: 20.32, color: "#ffd700" },
    { title: "Grand Theft Auto V (PS4)", sales: 19.39, color: "#ffd700" },
    { title: "GTA: Vice City (PS2)", sales: 16.15, color: "#ffd700" },
    { title: "Grand Theft Auto V (X360)", sales: 15.86, color: "#ffd700" },
    { title: "Call of Duty: Black Ops 3", sales: 15.09, color: "#ff2d92" },
    { title: "CoD: Modern Warfare 3", sales: 14.82, color: "#ff2d92" },
    { title: "Call of Duty: Black Ops", sales: 14.74, color: "#ff2d92" },
    { title: "Red Dead Redemption 2", sales: 13.94, color: "#ff6b00" },
    { title: "CoD: Black Ops II (X360)", sales: 13.86, color: "#ff2d92" },
    { title: "CoD: Black Ops II (PS3)", sales: 13.80, color: "#ff2d92" }
  ],
  consoleWars: [
    { name: "PlayStation", value: 3266, color: "#003087" },
    { name: "Nintendo", value: 1629, color: "#e60012" },
    { name: "Xbox", value: 1361, color: "#107c10" },
    { name: "PC", value: 169, color: "#6b7280" }
  ],
  genres: [
    { name: "Sports", value: 1188, color: "#00ff88" },
    { name: "Action", value: 1126, color: "#ff6b00" },
    { name: "Shooter", value: 996, color: "#ff2d92" },
    { name: "Misc", value: 558, color: "#6b7280" },
    { name: "Racing", value: 526, color: "#00d4ff" },
    { name: "RPG", value: 427, color: "#a855f7" },
    { name: "Platform", value: 349, color: "#00d4ff" },
    { name: "Fighting", value: 341, color: "#ff2d92" }
  ],
  regional: [
    { name: "North America", value: 3346, color: "#00d4ff", pct: "51%" },
    { name: "Europe", value: 1917, color: "#a855f7", pct: "29%" },
    { name: "Japan", value: 688, color: "#ff2d92", pct: "10%" },
    { name: "Other", value: 651, color: "#6b7280", pct: "10%" }
  ],
  franchises: [
    { name: "Call of Duty", value: 303, color: "#ffd700" },
    { name: "FIFA", value: 212, color: "#00ff88" },
    { name: "LEGO Games", value: 156, color: "#ff6b00" },
    { name: "Grand Theft Auto", value: 155, color: "#ff6b00" },
    { name: "Madden NFL", value: 130, color: "#00d4ff" },
    { name: "Assassin's Creed", value: 107, color: "#ff2d92" },
    { name: "Need for Speed", value: 105, color: "#ff6b00" },
    { name: "The Sims", value: 86, color: "#00ff88" }
  ]
}

// ============================================
// STATE
// ============================================
let currentSlide = 0
const totalSlides = 11
let isAnimating = false
let chartsBuilt: Record<number, boolean> = {}

// ============================================
// SLIDES HTML
// ============================================
const slides = [
  // Slide 0: Title
  `<div class="slide" data-slide="0">
    <div class="title-badge elem">DATA VISUALIZATION PROJECT</div>
    <h1 class="main-title">
      <span class="line elem">The</span>
      <span class="line elem highlight">Billion Dollar</span>
      <span class="line elem">Gaming Industry</span>
    </h1>
    <p class="subtitle elem">A Data-Driven Analysis of Video Game Sales</p>
    <div class="title-stats elem">
      <div class="stat-item">
        <span class="stat-value">64,016</span>
        <span class="stat-label">Games</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">$6.6B</span>
        <span class="stat-label">Total Sales</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">2024</span>
        <span class="stat-label">Dataset</span>
      </div>
    </div>
    <p class="press-hint elem">Press <span>SPACE</span> or <span>→</span> to continue</p>
  </div>`,

  // Slide 1: Audience
  `<div class="slide" data-slide="1">
    <div class="slide-number elem">01 / THE AUDIENCE</div>
    <h2 class="slide-title elem">Who is the <span class="accent">Audience?</span></h2>
    <div class="audience-hero elem">
      <div class="audience-icon">🏢</div>
      <h3>Game Development Companies & Investors</h3>
      <p>Decision-makers seeking to maximize profit in the gaming industry</p>
    </div>
  </div>`,

  // Slide 2: Question
  `<div class="slide" data-slide="2">
    <div class="slide-number elem">02 / TOP GAMES</div>
    <p class="slide-title elem">What games sell the most?</p>
    <div class="big-text gradient elem">Let's find out.</div>
  </div>`,

  // Slide 3: Top 10 Games Chart
  `<div class="slide" data-slide="3">
    <div class="slide-number elem">02 / TOP GAMES</div>
    <h2 class="slide-title elem">The <span class="accent">Champions</span></h2>
    <div class="chart-container chart-glass elem">
      <div class="bar-chart" id="topGamesChart"></div>
    </div>
    <div class="insight-box elem">
      <p class="insight-text">💡 <strong>GTA V appears 3 times</strong> — Cross-platform = Maximum revenue</p>
    </div>
  </div>`,

  // Slide 4: Console Wars Question
  `<div class="slide" data-slide="4">
    <div class="slide-number elem">03 / CONSOLE WARS</div>
    <p class="slide-title elem">PlayStation vs Xbox vs Nintendo</p>
    <div class="big-text gradient elem">Who wins?</div>
  </div>`,

  // Slide 5: Console Wars Chart
  `<div class="slide" data-slide="5">
    <div class="slide-number elem">03 / CONSOLE WARS</div>
    <h2 class="slide-title elem">The <span class="accent">Winner</span></h2>
    <div class="donut-layout elem">
      <div class="donut-wrapper">
        <canvas id="consoleCanvas"></canvas>
      </div>
      <div class="donut-legend" id="consoleLegend"></div>
    </div>
    <div class="winner-card elem">
      <div class="winner-crown">🏆</div>
      <div class="winner-name">PlayStation</div>
      <div class="winner-value">51%</div>
      <div class="winner-label">Market Domination</div>
    </div>
  </div>`,

  // Slide 6: Genre Chart
  `<div class="slide" data-slide="6">
    <div class="slide-number elem">04 / GENRES</div>
    <h2 class="slide-title elem">Where the <span class="accent">Money</span> Goes</h2>
    <div class="chart-container chart-glass elem">
      <div class="bar-chart" id="genreChart"></div>
    </div>
    <div class="insight-box elem">
      <p class="insight-text">🎯 <strong>Action + Shooter = 32%</strong> of all game sales</p>
    </div>
  </div>`,

  // Slide 7: Regional
  `<div class="slide" data-slide="7">
    <div class="slide-number elem">05 / REGIONS</div>
    <h2 class="slide-title elem">Global <span class="accent">Market</span></h2>
    <div class="donut-layout elem">
      <div class="donut-wrapper">
        <canvas id="regionalCanvas"></canvas>
      </div>
      <div class="donut-legend" id="regionalLegend"></div>
    </div>
    <div class="insight-box elem">
      <p class="insight-text">🌎 <strong>North America = 51%</strong> — Target this market!</p>
    </div>
  </div>`,

  // Slide 8: Japan vs USA
  `<div class="slide" data-slide="8">
    <div class="slide-number elem">06 / CULTURE</div>
    <h2 class="slide-title elem">Different <span class="accent">Tastes</span></h2>
    <div class="vs-container elem">
      <div class="vs-card" id="vsLeft">
        <div class="flag">🇺🇸</div>
        <h3>North America</h3>
        <ul class="pref-list">
          <li>#1 Shooter 🔫</li>
          <li>#2 Sports ⚽</li>
          <li>#3 Action 💥</li>
        </ul>
      </div>
      <div class="vs-badge">VS</div>
      <div class="vs-card" id="vsRight">
        <div class="flag">🇯🇵</div>
        <h3>Japan</h3>
        <ul class="pref-list">
          <li>#1 Role-Playing ⚔️</li>
          <li>#2 Action 💥</li>
          <li>#3 Sports ⚽</li>
        </ul>
      </div>
    </div>
  </div>`,

  // Slide 9: Franchise
  `<div class="slide" data-slide="9">
    <div class="slide-number elem">07 / FRANCHISES</div>
    <h2 class="slide-title elem">Franchise <span class="accent">Power</span></h2>
    <div class="chart-container chart-glass elem">
      <div class="bar-chart" id="franchiseChart"></div>
    </div>
    <div class="winner-card elem">
      <div class="winner-crown">👑</div>
      <div class="winner-name">Call of Duty</div>
      <div class="winner-value">$303M</div>
      <div class="winner-label">The King of Gaming</div>
    </div>
  </div>`,

  // Slide 10: Decision
  `<div class="slide" data-slide="10">
    <div class="slide-number elem">08 / THE DECISION</div>
    <div class="decision-container">
      <div class="decision-label elem">💡 DATA-DRIVEN RECOMMENDATION</div>
      <p class="decision-text elem">
        To maximize profit, develop an <span class="highlight">ACTION or SHOOTER</span> game,
        release it on <span class="highlight">PLAYSTATION</span>,
        target <span class="highlight">NORTH AMERICA</span>,
        and build a <span class="highlight">FRANCHISE</span>.
      </p>
      <div class="evidence-grid">
        <div class="evidence-card elem">
          <span class="evidence-area">GENRE</span>
          <span class="evidence-choice">Action/Shooter</span>
          <span class="evidence-why">32% of sales</span>
        </div>
        <div class="evidence-card elem">
          <span class="evidence-area">PLATFORM</span>
          <span class="evidence-choice">PlayStation</span>
          <span class="evidence-why">51% market</span>
        </div>
        <div class="evidence-card elem">
          <span class="evidence-area">REGION</span>
          <span class="evidence-choice">North America</span>
          <span class="evidence-why">51% of sales</span>
        </div>
        <div class="evidence-card elem">
          <span class="evidence-area">STRATEGY</span>
          <span class="evidence-choice">Build Franchise</span>
          <span class="evidence-why">CoD = $303M</span>
        </div>
      </div>
    </div>
  </div>`,
]

// ============================================
// INIT
// ============================================
function init() {
  const app = document.getElementById('app')!
  
  app.innerHTML = `
    <div class="presentation-frame" id="frame">
      ${slides.join('')}
    </div>
  `
  
  scaleToFit()
  window.addEventListener('resize', scaleToFit)
  
  // Show first slide
  showSlide(0)
  
  // Navigation
  document.addEventListener('keydown', handleKeydown)
  document.addEventListener('click', () => {
    if (!isAnimating) goToSlide(currentSlide + 1)
  })
}

// ============================================
// SCALE TO FIT
// ============================================
function scaleToFit() {
  const frame = document.getElementById('frame')
  if (!frame) return
  
  const scale = Math.min(
    window.innerWidth / 1920,
    window.innerHeight / 1080
  )
  frame.style.transform = `scale(${scale})`
}

// ============================================
// KEYBOARD
// ============================================
function handleKeydown(e: KeyboardEvent) {
  if (isAnimating) return
  
  if (e.key === 'ArrowRight' || e.key === ' ') {
    e.preventDefault()
    goToSlide(currentSlide + 1)
  } else if (e.key === 'ArrowLeft') {
    e.preventDefault()
    goToSlide(currentSlide - 1)
  }
}

// ============================================
// NAVIGATION - SINGLE ANIMATION
// ============================================
function goToSlide(newIndex: number) {
  if (newIndex < 0 || newIndex >= totalSlides) return
  if (isAnimating || newIndex === currentSlide) return
  
  isAnimating = true
  
  const oldSlide = document.querySelector(`[data-slide="${currentSlide}"]`) as HTMLElement
  const newSlide = document.querySelector(`[data-slide="${newIndex}"]`) as HTMLElement
  const direction = newIndex > currentSlide ? 1 : -1
  
  // Get transition style for this slide change
  const transitionStyle = getTransitionStyle(currentSlide, newIndex)
  
  // ONE unified animation: exit old + enter new
  animateTransition(oldSlide, newSlide, transitionStyle, direction, () => {
    currentSlide = newIndex
    buildChartsIfNeeded(newIndex)
    isAnimating = false
  })
}

// ============================================
// TRANSITION STYLES - Each unique!
// ============================================
function getTransitionStyle(from: number, to: number): string {
  // Each slide pair has a unique transition
  const styles = [
    'slide-up',      // 0 -> 1
    'zoom-in',       // 1 -> 2
    'slide-right',   // 2 -> 3
    'fade-scale',    // 3 -> 4
    'rotate-y',      // 4 -> 5
    'slide-up',      // 5 -> 6
    'spiral',        // 6 -> 7
    'flip-x',        // 7 -> 8
    'slide-left',    // 8 -> 9
    'zoom-out',      // 9 -> 10
  ]
  
  if (from < to) {
    return styles[from] || 'slide-up'
  } else {
    // Going backwards - reverse the animation
    return styles[to] || 'slide-up'
  }
}

// ============================================
// UNIFIED TRANSITION ANIMATION
// ============================================
function animateTransition(
  oldSlide: HTMLElement,
  newSlide: HTMLElement,
  style: string,
  direction: number,
  onComplete: () => void
) {
  const tl = gsap.timeline({ onComplete })
  
  const oldElems = oldSlide.querySelectorAll('.elem')
  const newElems = newSlide.querySelectorAll('.elem')
  
  // Set new slide visible but elements hidden
  gsap.set(newSlide, { display: 'flex', opacity: 1 })
  gsap.set(newElems, { opacity: 0 })
  
  switch (style) {
    case 'slide-up':
      // Old slides up and out, new slides up from bottom
      tl.to(oldElems, {
        y: -80 * direction,
        opacity: 0,
        duration: 0.5,
        stagger: 0.03,
        ease: 'power3.in'
      })
      .set(oldSlide, { display: 'none' })
      .set(newElems, { y: 80 * direction })
      .to(newElems, {
        y: 0,
        opacity: 1,
        duration: 0.7,
        stagger: 0.05,
        ease: 'power3.out'
      })
      break
      
    case 'slide-right':
      tl.to(oldElems, {
        x: -100 * direction,
        opacity: 0,
        duration: 0.5,
        stagger: 0.03,
        ease: 'power3.in'
      })
      .set(oldSlide, { display: 'none' })
      .set(newElems, { x: 100 * direction })
      .to(newElems, {
        x: 0,
        opacity: 1,
        duration: 0.7,
        stagger: 0.05,
        ease: 'power3.out'
      })
      break
      
    case 'slide-left':
      tl.to(oldElems, {
        x: 100 * direction,
        opacity: 0,
        duration: 0.5,
        stagger: 0.03,
        ease: 'power3.in'
      })
      .set(oldSlide, { display: 'none' })
      .set(newElems, { x: -100 * direction })
      .to(newElems, {
        x: 0,
        opacity: 1,
        duration: 0.7,
        stagger: 0.05,
        ease: 'power3.out'
      })
      break
      
    case 'zoom-in':
      tl.to(oldElems, {
        scale: 1.3,
        opacity: 0,
        duration: 0.5,
        stagger: 0.03,
        ease: 'power2.in'
      })
      .set(oldSlide, { display: 'none' })
      .set(newElems, { scale: 0.7 })
      .to(newElems, {
        scale: 1,
        opacity: 1,
        duration: 0.8,
        stagger: 0.05,
        ease: 'power3.out'
      })
      break
      
    case 'zoom-out':
      tl.to(oldElems, {
        scale: 0.7,
        opacity: 0,
        duration: 0.5,
        stagger: 0.03,
        ease: 'power2.in'
      })
      .set(oldSlide, { display: 'none' })
      .set(newElems, { scale: 1.3 })
      .to(newElems, {
        scale: 1,
        opacity: 1,
        duration: 0.8,
        stagger: 0.05,
        ease: 'power3.out'
      })
      break
      
    case 'fade-scale':
      tl.to(oldElems, {
        scale: 0.95,
        opacity: 0,
        duration: 0.4,
        stagger: 0.02,
        ease: 'power2.in'
      })
      .set(oldSlide, { display: 'none' })
      .set(newElems, { scale: 1.05 })
      .to(newElems, {
        scale: 1,
        opacity: 1,
        duration: 0.6,
        stagger: 0.04,
        ease: 'power2.out'
      })
      break
      
    case 'rotate-y':
      tl.to(oldElems, {
        rotateY: -20 * direction,
        opacity: 0,
        duration: 0.5,
        stagger: 0.03,
        ease: 'power2.in'
      })
      .set(oldSlide, { display: 'none' })
      .set(newElems, { rotateY: 20 * direction })
      .to(newElems, {
        rotateY: 0,
        opacity: 1,
        duration: 0.7,
        stagger: 0.05,
        ease: 'power3.out'
      })
      break
      
    case 'flip-x':
      tl.to(oldElems, {
        rotateX: 15 * direction,
        y: -30 * direction,
        opacity: 0,
        duration: 0.5,
        stagger: 0.03,
        ease: 'power2.in'
      })
      .set(oldSlide, { display: 'none' })
      .set(newElems, { rotateX: -15 * direction, y: 30 * direction })
      .to(newElems, {
        rotateX: 0,
        y: 0,
        opacity: 1,
        duration: 0.7,
        stagger: 0.05,
        ease: 'power3.out'
      })
      break
      
    case 'spiral':
      tl.to(oldElems, {
        rotation: 5 * direction,
        scale: 0.9,
        opacity: 0,
        duration: 0.5,
        stagger: 0.03,
        ease: 'power2.in'
      })
      .set(oldSlide, { display: 'none' })
      .set(newElems, { rotation: -5 * direction, scale: 1.1 })
      .to(newElems, {
        rotation: 0,
        scale: 1,
        opacity: 1,
        duration: 0.7,
        stagger: 0.05,
        ease: 'power3.out'
      })
      break
      
    default:
      // Simple fade
      tl.to(oldElems, { opacity: 0, duration: 0.4, stagger: 0.02 })
        .set(oldSlide, { display: 'none' })
        .to(newElems, { opacity: 1, duration: 0.5, stagger: 0.03 })
  }
}

// ============================================
// SHOW FIRST SLIDE
// ============================================
function showSlide(index: number) {
  const slide = document.querySelector(`[data-slide="${index}"]`) as HTMLElement
  const elems = slide.querySelectorAll('.elem')
  
  gsap.set(slide, { display: 'flex', opacity: 1 })
  gsap.set(elems, { opacity: 0, y: 50 })
  
  gsap.to(elems, {
    opacity: 1,
    y: 0,
    duration: 0.8,
    stagger: 0.08,
    ease: 'power3.out',
    onComplete: () => {
      buildChartsIfNeeded(index)
    }
  })
}

// ============================================
// BUILD CHARTS
// ============================================
function buildChartsIfNeeded(index: number) {
  if (chartsBuilt[index]) return
  
  switch (index) {
    case 3:
      buildBarChart('topGamesChart', slideData.topGames, 20.32)
      chartsBuilt[3] = true
      break
    case 5:
      buildDonutChart('consoleCanvas', slideData.consoleWars, 'consoleLegend')
      chartsBuilt[5] = true
      break
    case 6:
      buildBarChart('genreChart', slideData.genres.map(g => ({ title: g.name, sales: g.value / 1000, color: g.color })), 1.188)
      chartsBuilt[6] = true
      break
    case 7:
      buildDonutChart('regionalCanvas', slideData.regional, 'regionalLegend')
      chartsBuilt[7] = true
      break
    case 9:
      buildBarChart('franchiseChart', slideData.franchises.map(f => ({ title: f.name, sales: f.value, color: f.color })), 303)
      chartsBuilt[9] = true
      break
  }
}

// ============================================
// BAR CHART
// ============================================
function buildBarChart(containerId: string, data: {title: string, sales: number, color: string}[], maxValue: number) {
  const container = document.getElementById(containerId)
  if (!container) return
  
  container.innerHTML = data.map(item => `
    <div class="bar-item">
      <span class="bar-label">${item.title}</span>
      <div class="bar-track">
        <div class="bar-fill" style="background: ${item.color}; width: ${(item.sales / maxValue) * 100}%">
          $${item.sales.toFixed(item.sales < 10 ? 2 : 0)}M
        </div>
      </div>
    </div>
  `).join('')
  
  const bars = container.querySelectorAll('.bar-item')
  const fills = container.querySelectorAll('.bar-fill')
  
  gsap.set(bars, { opacity: 0, x: -50 })
  gsap.set(fills, { scaleX: 0, transformOrigin: 'left' })
  
  gsap.to(bars, { opacity: 1, x: 0, duration: 0.5, stagger: 0.05, ease: 'power2.out' })
  gsap.to(fills, { scaleX: 1, duration: 1, stagger: 0.05, ease: 'power2.out', delay: 0.2 })
}

// ============================================
// DONUT CHART
// ============================================
function buildDonutChart(canvasId: string, data: {name: string, value: number, color: string}[], legendId: string) {
  const canvas = document.getElementById(canvasId) as HTMLCanvasElement
  const legend = document.getElementById(legendId)
  if (!canvas || !legend) return
  
  legend.innerHTML = data.map(item => `
    <div class="legend-item">
      <div class="legend-color" style="background: ${item.color}"></div>
      <span class="legend-text">${item.name}</span>
      <span class="legend-value">$${(item.value / 1000).toFixed(1)}B</span>
    </div>
  `).join('')
  
  gsap.from('.legend-item', { opacity: 0, x: 30, duration: 0.4, stagger: 0.08, ease: 'power2.out', delay: 0.3 })
  
  new Chart(canvas, {
    type: 'doughnut',
    data: {
      labels: data.map(d => d.name),
      datasets: [{
        data: data.map(d => d.value),
        backgroundColor: data.map(d => d.color),
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      cutout: '55%',
      animation: { duration: 1200 },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#1a1a1a',
          padding: 14,
          cornerRadius: 10
        }
      }
    }
  })
}

// ============================================
// START
// ============================================
init()
