import './style.css';
import { gsap } from 'gsap';
import { Chart, ArcElement, Tooltip, Legend, DoughnutController } from 'chart.js';

Chart.register(ArcElement, Tooltip, Legend, DoughnutController);

// ============================================
// 7-SLIDE PRESENTATION (5 Charts + Title + Conclusion)
// ============================================

const app = document.querySelector<HTMLDivElement>('#app')!;

app.innerHTML = `
  <!-- SLIDE 1: TITLE -->
  <div class="slide slide-black active" id="slide-1">
    <div class="title-content">
      <div class="title-eyebrow">DATA VISUALIZATION ACTIVITY</div>
      <h1 class="title-main">THE BILLION<br>DOLLAR<br>QUESTION</h1>
      <div class="title-divider"></div>
      <p class="title-subtitle">What game should you develop to maximize profit?</p>
      <div class="title-stats">
        <div class="stat">
          <span class="stat-value" id="stat-games">0</span>
          <span class="stat-label">GAMES ANALYZED</span>
        </div>
        <div class="stat">
          <span class="stat-value">$<span id="stat-sales">0</span>B</span>
          <span class="stat-label">TOTAL SALES</span>
        </div>
      </div>
    </div>
  </div>

  <!-- SLIDE 2: GENRE BREAKDOWN (WHITE) -->
  <div class="slide slide-white" id="slide-2">
    <div class="chart-slide">
      <div class="slide-header">
        <div class="header-left">
          <p class="chart-eyebrow dark">CHART 1 OF 5 • SALES BY CATEGORY</p>
          <div class="accent-line dark"></div>
        </div>
        <h2 class="slide-title-alt dark">GENRE<br>BREAKDOWN</h2>
      </div>
      <div class="chart-area" id="genre-chart"></div>
      <div class="slide-insight dark">
        <span class="insight-key">ACTION + SHOOTER = 32%</span> of total market
      </div>
    </div>
  </div>

  <!-- SLIDE 3: TOP 10 GAMES (BLACK) -->
  <div class="slide slide-black" id="slide-3">
    <div class="chart-slide">
      <div class="slide-header">
        <div class="header-left">
          <p class="chart-eyebrow">CHART 2 OF 5 • GLOBAL SALES</p>
          <div class="accent-line"></div>
        </div>
        <h2 class="slide-title-alt">TOP SELLING<br>GAMES</h2>
      </div>
      <div class="chart-area" id="games-chart"></div>
      <div class="slide-insight">
        <span class="insight-key">GTA V appears 3 TIMES</span> — cross-platform wins
      </div>
    </div>
  </div>

  <!-- SLIDE 4: CONSOLE WARS (WHITE) -->
  <div class="slide slide-white" id="slide-4">
    <div class="chart-slide">
      <div class="slide-header">
        <div class="header-left">
          <p class="chart-eyebrow dark">CHART 3 OF 5 • PLATFORM SHARE</p>
          <div class="accent-line dark"></div>
        </div>
        <h2 class="slide-title-alt dark">CONSOLE<br>WARS</h2>
      </div>
      <div class="donut-area">
        <div class="donut-wrap">
          <canvas id="console-donut" width="320" height="320"></canvas>
          <div class="donut-center dark">
            <span class="donut-pct">51%</span>
            <span class="donut-lbl">PLAYSTATION</span>
          </div>
        </div>
        <div class="donut-legend" id="console-legend"></div>
      </div>
    </div>
  </div>

  <!-- SLIDE 5: REGIONAL SALES (BLACK) -->
  <div class="slide slide-black" id="slide-5">
    <div class="chart-slide">
      <div class="slide-header">
        <div class="header-left">
          <p class="chart-eyebrow">CHART 4 OF 5 • MARKET DISTRIBUTION</p>
          <div class="accent-line"></div>
        </div>
        <h2 class="slide-title-alt">REGIONAL<br>SALES</h2>
      </div>
      <div class="donut-area">
        <div class="donut-wrap">
          <canvas id="regional-donut" width="320" height="320"></canvas>
          <div class="donut-center">
            <span class="donut-pct">51%</span>
            <span class="donut-lbl">NORTH AMERICA</span>
          </div>
        </div>
        <div class="donut-legend" id="regional-legend"></div>
      </div>
    </div>
  </div>

  <!-- SLIDE 6: TOP FRANCHISES (WHITE) -->
  <div class="slide slide-white" id="slide-6">
    <div class="chart-slide">
      <div class="slide-header">
        <div class="header-left">
          <p class="chart-eyebrow dark">CHART 5 OF 5 • FRANCHISE POWER</p>
          <div class="accent-line dark"></div>
        </div>
        <h2 class="slide-title-alt dark">TOP<br>FRANCHISES</h2>
      </div>
      <div class="chart-area" id="franchise-chart"></div>
      <div class="slide-insight dark">
        <span class="insight-key">BUILD A FRANCHISE</span> = recurring revenue
      </div>
    </div>
  </div>

  <!-- SLIDE 7: THE ANSWER -->
  <div class="slide slide-black" id="slide-7">
    <div class="answer-layout">
      <p class="answer-eyebrow">THE DATA SPEAKS</p>
      <h2 class="answer-title">THE WINNING FORMULA</h2>
      <div class="answer-cards">
        <div class="answer-card" id="card-1">
          <div class="card-icon">🎮</div>
          <div class="card-label">GENRE</div>
          <div class="card-value">ACTION / SHOOTER</div>
          <div class="card-stat">32% of market</div>
        </div>
        <div class="answer-card" id="card-2">
          <div class="card-icon">🕹️</div>
          <div class="card-label">PLATFORM</div>
          <div class="card-value">PLAYSTATION</div>
          <div class="card-stat">51% market share</div>
        </div>
        <div class="answer-card" id="card-3">
          <div class="card-icon">🌎</div>
          <div class="card-label">TARGET MARKET</div>
          <div class="card-value">NORTH AMERICA</div>
          <div class="card-stat">51% of global sales</div>
        </div>
      </div>
      <p class="answer-closing">"Data tells the story."</p>
      <p class="answer-credits">VGChartz 2024 • 64,016 Games • $6.6B Total Sales</p>
    </div>
  </div>

  <!-- NAVIGATION -->
  <div class="nav-hint" id="nav-hint">
    <span class="nav-counter"><span id="current-slide">1</span> / 7</span>
    <span class="nav-text">Press SPACE or → to continue</span>
  </div>
`;

// ============================================
// NAVIGATION
// ============================================

let currentSlide = 1;
const totalSlides = 7;
const slides = document.querySelectorAll('.slide');
const slideCounter = document.getElementById('current-slide')!;
const navHint = document.getElementById('nav-hint')!;

function goToSlide(n: number) {
  if (n < 1 || n > totalSlides || n === currentSlide) return;
  
  const direction = n > currentSlide ? 1 : -1;
  const oldSlide = slides[currentSlide - 1];
  const newSlide = slides[n - 1];
  
  gsap.to(oldSlide, {
    x: direction * -100 + '%',
    opacity: 0,
    duration: 0.5,
    ease: 'power2.inOut',
    onComplete: () => oldSlide.classList.remove('active')
  });
  
  gsap.fromTo(newSlide, 
    { x: direction * 100 + '%', opacity: 0 },
    { 
      x: '0%', 
      opacity: 1, 
      duration: 0.5, 
      ease: 'power2.inOut',
      onStart: () => newSlide.classList.add('active'),
      onComplete: () => animateSlide(n)
    }
  );
  
  currentSlide = n;
  slideCounter.textContent = String(n);
  
  // Theme for nav hint
  navHint.className = (n === 2 || n === 4 || n === 6) ? 'nav-hint dark' : 'nav-hint';
}

function nextSlide() { if (currentSlide < totalSlides) goToSlide(currentSlide + 1); }
function prevSlide() { if (currentSlide > 1) goToSlide(currentSlide - 1); }

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); nextSlide(); }
  else if (e.key === 'ArrowLeft') { e.preventDefault(); prevSlide(); }
});

document.addEventListener('click', nextSlide);

// ============================================
// ANIMATIONS
// ============================================

function animateSlide(n: number) {
  switch(n) {
    case 1: animateTitle(); break;
    case 2: animateGenres(); break;
    case 3: animateTopGames(); break;
    case 4: animateConsoles(); break;
    case 5: animateRegional(); break;
    case 6: animateFranchises(); break;
    case 7: animateAnswer(); break;
  }
}

// SLIDE 1: Title
function animateTitle() {
  gsap.timeline()
    .from('.title-eyebrow', { opacity: 0, y: -20, duration: 0.5 })
    .from('.title-main', { opacity: 0, y: 30, duration: 0.8 }, '-=0.2')
    .from('.title-divider', { scaleX: 0, duration: 0.5 }, '-=0.3')
    .from('.title-subtitle', { opacity: 0, duration: 0.5 }, '-=0.2')
    .from('.stat', { opacity: 0, y: 20, stagger: 0.2, duration: 0.5 });
  
  gsap.to({ val: 0 }, { val: 64016, duration: 2, delay: 1.5, ease: 'power2.out',
    onUpdate: function() { document.getElementById('stat-games')!.textContent = Math.floor(this.targets()[0].val).toLocaleString(); }
  });
  gsap.to({ val: 0 }, { val: 6.6, duration: 2, delay: 1.7, ease: 'power2.out',
    onUpdate: function() { document.getElementById('stat-sales')!.textContent = this.targets()[0].val.toFixed(1); }
  });
}

// SLIDE 2: Genre Breakdown
function animateGenres() {
  buildBarChart('genre-chart', [
    { name: 'SPORTS', value: 1188 },
    { name: 'ACTION', value: 1126 },
    { name: 'SHOOTER', value: 996 },
    { name: 'MISC', value: 558 },
    { name: 'RACING', value: 526 },
    { name: 'RPG', value: 427 },
    { name: 'PLATFORM', value: 349 },
    { name: 'FIGHTING', value: 341 },
  ], 'white');
}

// SLIDE 3: Top Games
function animateTopGames() {
  buildBarChart('games-chart', [
    { name: 'GTA V (PS3)', value: 20.3 },
    { name: 'GTA V (PS4)', value: 19.4 },
    { name: 'GTA: VICE CITY', value: 16.2 },
    { name: 'GTA V (X360)', value: 15.9 },
    { name: 'COD: BLACK OPS 3', value: 15.1 },
    { name: 'COD: MW3', value: 14.8 },
    { name: 'COD: BLACK OPS', value: 14.7 },
    { name: 'RED DEAD 2', value: 13.9 },
    { name: 'COD: BO2 (X360)', value: 13.9 },
    { name: 'COD: BO2 (PS3)', value: 13.8 },
  ], 'black');
}

// SLIDE 4: Console Wars
function animateConsoles() {
  buildDonutChart('console-donut', 'console-legend', [
    { label: 'PLAYSTATION', value: 50.6, sales: '$3.3B' },
    { label: 'NINTENDO', value: 25.8, sales: '$1.6B' },
    { label: 'XBOX', value: 21.1, sales: '$1.4B' },
    { label: 'PC', value: 2.6, sales: '$0.2B' },
  ], 'white');
}

// SLIDE 5: Regional Sales
function animateRegional() {
  buildDonutChart('regional-donut', 'regional-legend', [
    { label: 'NORTH AMERICA', value: 51, sales: '$3.3B' },
    { label: 'EUROPE', value: 29, sales: '$1.9B' },
    { label: 'JAPAN', value: 10, sales: '$0.7B' },
    { label: 'OTHER', value: 10, sales: '$0.7B' },
  ], 'black');
}

// SLIDE 6: Top Franchises
function animateFranchises() {
  buildBarChart('franchise-chart', [
    { name: 'CALL OF DUTY', value: 303 },
    { name: 'FIFA', value: 212 },
    { name: 'LEGO GAMES', value: 156 },
    { name: 'GRAND THEFT AUTO', value: 155 },
    { name: 'MADDEN NFL', value: 130 },
  ], 'white');
}

// SLIDE 7: Answer
function animateAnswer() {
  gsap.timeline()
    .from('.answer-eyebrow', { opacity: 0, y: -20, duration: 0.4 })
    .from('.answer-title', { opacity: 0, y: -30, duration: 0.6 }, '-=0.2')
    .from('#card-1', { opacity: 0, y: 50, rotateX: -20, duration: 0.6, ease: 'back.out(1.4)' }, '-=0.2')
    .from('#card-2', { opacity: 0, y: 50, rotateX: -20, duration: 0.6, ease: 'back.out(1.4)' }, '-=0.3')
    .from('#card-3', { opacity: 0, y: 50, rotateX: -20, duration: 0.6, ease: 'back.out(1.4)' }, '-=0.3')
    .from('.answer-closing', { opacity: 0, duration: 0.8 }, '-=0.2')
    .from('.answer-credits', { opacity: 0, duration: 0.5 });
}

// ============================================
// CHART BUILDERS
// ============================================

function buildBarChart(containerId: string, data: {name: string, value: number}[], theme: 'black' | 'white') {
  const container = document.getElementById(containerId)!;
  container.innerHTML = '';
  
  const maxValue = Math.max(...data.map(d => d.value));
  const isBlackTheme = theme === 'black';
  const unit = data[0].value > 100 ? 'M' : 'M';
  
  data.forEach((item, i) => {
    const row = document.createElement('div');
    row.className = 'bar-row';
    
    const width = (item.value / maxValue) * 100;
    const barClass = isBlackTheme ? 'gradient-bar' : 'black-bar';
    
    row.innerHTML = `
      <div class="bar-label ${isBlackTheme ? '' : 'dark'}">${item.name}</div>
      <div class="bar-track ${isBlackTheme ? '' : 'light'}">
        <div class="bar-fill ${barClass}" style="width: 0%"></div>
      </div>
      <div class="bar-value ${isBlackTheme ? '' : 'dark'}">$${item.value}${unit}</div>
    `;
    
    container.appendChild(row);
    
    gsap.to(row.querySelector('.bar-fill'), { width: width + '%', duration: 1, delay: 0.2 + i * 0.1, ease: 'power3.out' });
    gsap.from(row.querySelector('.bar-value'), { opacity: 0, x: -20, duration: 0.4, delay: 0.6 + i * 0.1 });
  });
  
  const insightEl = container.closest('.chart-slide')?.querySelector('.slide-insight');
  if (insightEl) {
    gsap.from(insightEl, { opacity: 0, y: 20, duration: 0.5, delay: 1.5 });
  }
}

function buildDonutChart(canvasId: string, legendId: string, data: {label: string, value: number, sales: string}[], theme: 'black' | 'white') {
  const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
  if (!canvas) return;
  
  // Destroy existing chart if any
  const existingChart = Chart.getChart(canvas);
  if (existingChart) {
    existingChart.destroy();
  }
  
  // Set canvas size explicitly
  canvas.width = 320;
  canvas.height = 320;
  
  const ctx = canvas.getContext('2d')!;
  
  const isBlack = theme === 'black';
  const colors = isBlack 
    ? ['#ffffff', '#aaaaaa', '#666666', '#333333']
    : ['#000000', '#444444', '#888888', '#cccccc'];
  const borderColor = isBlack ? '#000000' : '#ffffff';
  
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: data.map(d => d.label),
      datasets: [{ 
        data: data.map(d => d.value), 
        backgroundColor: colors, 
        borderColor: borderColor, 
        borderWidth: 3 
      }]
    },
    options: { 
      responsive: false, 
      maintainAspectRatio: true,
      cutout: '65%', 
      plugins: { 
        tooltip: { enabled: false },
        legend: { display: false }
      }, 
      animation: { 
        animateRotate: true, 
        duration: 1200 
      } 
    }
  });
  
  // Build legend
  const legend = document.getElementById(legendId)!;
  if (legend) {
    legend.innerHTML = '';
    
    data.forEach((item, i) => {
      const row = document.createElement('div');
      row.className = `legend-row ${isBlack ? '' : 'dark'}`;
      row.innerHTML = `
        <div class="legend-color" style="background: ${colors[i]}; ${!isBlack && i === 0 ? 'border: 2px solid #000;' : ''}"></div>
        <div class="legend-name">${item.label}</div>
        <div class="legend-sales">${item.sales}</div>
        <div class="legend-pct">${item.value}%</div>
      `;
      legend.appendChild(row);
      gsap.from(row, { opacity: 0, x: 30, duration: 0.4, delay: 0.8 + i * 0.12 });
    });
  }
  
  // Animate center
  const centerEl = document.querySelector(`#slide-${theme === 'white' ? '4' : '5'} .donut-center`);
  if (centerEl) {
    gsap.from(centerEl, { opacity: 0, scale: 0.5, duration: 0.5, delay: 0.6, ease: 'back.out(1.7)' });
  }
}

// ============================================
// INIT
// ============================================
setTimeout(animateTitle, 300);
