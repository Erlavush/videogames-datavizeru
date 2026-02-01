import './style.css';
import { gsap } from 'gsap';
import { Chart, ArcElement, Tooltip, Legend, DoughnutController } from 'chart.js';

Chart.register(ArcElement, Tooltip, Legend, DoughnutController);

// ============================================
// 7-SLIDE PRESENTATION (5 Charts + Title + Conclusion)
// ============================================

const app = document.querySelector<HTMLDivElement>('#app')!;

console.log("🚀 Loaded: Mobile Layout v2.0 (Grid Fixed)");
app.innerHTML = `
  <!-- SLIDE 1: BLANK INTRO -->
  <div class="slide slide-white active" id="slide-1">
    <div class="blank-intro"></div>
  </div>

  <!-- SLIDE 2: TITLE with Typewriter -->
  <div class="slide slide-black" id="slide-2">
    <div class="title-content">
      <p class="title-subtitle hidden">What game should you develop to maximize profit?</p>
      <h1 class="title-main">
        <span class="typewriter hidden" id="title-line-1"></span>
        <span class="typewriter hidden" id="title-line-2"></span>
        <span class="typewriter hidden" id="title-line-3"></span>
      </h1>
      <div class="title-divider hidden"></div>
      <div class="title-stats hidden">
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

  <!-- SLIDE 3: GENRE BREAKDOWN (WHITE) -->
  <div class="slide slide-white" id="slide-3">
    <div class="chart-slide">
      <div class="slide-header">
        <div class="header-left hidden">
          <p class="chart-eyebrow dark">CHART 1 OF 5 • SALES BY CATEGORY</p>
          <div class="accent-line dark"></div>
        </div>
        <h2 class="slide-title-alt dark">
          <span class="title-type" id="genre-title-1"></span>
          <span class="title-type" id="genre-title-2"></span>
        </h2>
      </div>
      <div class="chart-area hidden" id="genre-chart"></div>
      <div class="slide-insight dark hidden" id="genre-insight">
        <span class="insight-key">ACTION + SHOOTER = 32%</span> of total market
      </div>
    </div>
  </div>

  <!-- SLIDE 4: TOP 10 GAMES (BLACK) -->
  <div class="slide slide-black" id="slide-4">
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

  <!-- SLIDE 5: CONSOLE WARS (WHITE) -->
  <div class="slide slide-white" id="slide-5">
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

  <!-- SLIDE 6: REGIONAL SALES (BLACK) -->
  <div class="slide slide-black" id="slide-6">
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

  <!-- SLIDE 7: TOP FRANCHISES (WHITE) -->
  <div class="slide slide-white" id="slide-7">
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

  <!-- SLIDE 8: THE ANSWER (New Winning Formula Layout) -->
  <div class="slide slide-black" id="slide-8">
    <div class="winning-layout hidden">
      <div class="grid-bg"></div>
      
      <header class="winning-header">
        <span class="winning-eyebrow">The Data Speaks</span>
        <h1 class="winning-title">The Winning Formula</h1>
      </header>

      <div class="winning-grid">
        <!-- Card 1 -->
        <div class="winning-card" id="win-card-1">
          <div class="winning-number">32<span>%</span></div>
          <div class="winning-label-group">
            <p class="winning-label-eyebrow">Genre</p>
            <h2 class="winning-label-main">Action /<br>Shooter</h2>
          </div>
          <p class="winning-footer-label">Market Share</p>
        </div>

        <!-- Card 2 -->
        <div class="winning-card" id="win-card-2">
          <div class="winning-number">51<span>%</span></div>
          <div class="winning-label-group">
            <p class="winning-label-eyebrow">Platform</p>
            <h2 class="winning-label-main">PlayStation</h2>
          </div>
          <p class="winning-footer-label">Segment Reach</p>
        </div>

        <!-- Card 3 -->
        <div class="winning-card" id="win-card-3">
          <div class="winning-number">51<span>%</span></div>
          <div class="winning-label-group">
            <p class="winning-label-eyebrow">Target Market</p>
            <h2 class="winning-label-main">North America</h2>
          </div>
          <p class="winning-footer-label">Global Sales</p>
        </div>
      </div>

      <footer class="winning-footer">
        <p class="winning-quote">"Data tells the story."</p>
        <div class="winning-meta">
          <span>VGChartz 2024</span>
          <span class="winning-dot"></span>
          <span>64,016 Games</span>
          <span class="winning-dot"></span>
          <span>$6.6B Total Sales</span>
        </div>
      </footer>
    </div>
  </div>
`;

// ============================================
// ANIMATIONS
// ============================================

// Wrapper to track timeouts
const activeTimeouts: number[] = [];
function setTrackedTimeout(callback: Function, delay: number) {
  const id = window.setTimeout(() => {
    callback();
    // Remove from tracking once done
    const index = activeTimeouts.indexOf(id);
    if (index > -1) activeTimeouts.splice(index, 1);
  }, delay);
  activeTimeouts.push(id);
  return id;
}

// Clear all tracked timeouts
function clearAllTimeouts() {
  activeTimeouts.forEach(id => clearTimeout(id));
  activeTimeouts.length = 0;
}

let currentSlide = 1;
const totalSlides = 8;
const slides = document.querySelectorAll('.slide');
let isTransitioning = false;

// Clean up all slides - reset to initial state
function cleanupAllSlides() {
  // Kill all GSAP animations
  gsap.killTweensOf('*');
  
  // Clear all tracked timeouts
  clearAllTimeouts();
  
  // Reset all slides
  slides.forEach((slide, index) => {
    const el = slide as HTMLElement;
    el.style.zIndex = '';
    el.style.opacity = '';
    
    // Hide all internal content immediately
    const content = el.querySelectorAll('.title-content, .chart-slide, .answer-layout, .winning-layout');
    content.forEach(c => {
      (c as HTMLElement).style.opacity = '0';
      (c as HTMLElement).style.visibility = 'hidden';
      c.classList.add('hidden');
    });

    if (index !== currentSlide - 1) {
      el.classList.remove('active');
    }
  });
  
  // Explicitly reset specific elements
  resetSlide2();
  resetSlide3();
  resetGenericSlides(); // Helper for slides 4-8
}

// Reset generic chart elements for slides 4, 5, 6, 7, 8
function resetGenericSlides() {
  const charts = document.querySelectorAll('.chart-area, .donut-area, .slide-insight, .answer-eyebrow, .answer-title, .answer-card, .answer-closing, .answer-credits, .winning-eyebrow, .winning-title, .winning-card, .winning-footer');
  charts.forEach(el => {
    (el as HTMLElement).style.opacity = '0';
    (el as HTMLElement).style.visibility = 'hidden';
    gsap.set(el, { clearProps: 'all' }); // Clear GSAP props
    (el as HTMLElement).classList.add('hidden');
  });
  
  // Clear charts
  const containers = ['games-chart', 'console-donut', 'regional-donut', 'franchise-chart'];
  containers.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = '';
  });
}

function goToSlide(n: number) {
  if (n < 1 || n > totalSlides || n === currentSlide) return;
  if (isTransitioning) return; // Prevent spam clicking
  
  isTransitioning = true;
  
  // Reset state before transition
  cleanupAllSlides();
  
  const oldSlide = slides[currentSlide - 1] as HTMLElement;
  const newSlide = slides[n - 1] as HTMLElement;
  
  // 1. Fade OUT old slide
  // Make sure old slide stays visible during fade out
  oldSlide.style.zIndex = '1';
  oldSlide.style.opacity = '1';
  
  gsap.to(oldSlide, {
    opacity: 0,
    duration: 0.5,
    ease: 'power2.inOut',
    onComplete: () => {
      oldSlide.classList.remove('active');
      oldSlide.style.zIndex = '';
      
      // 2. Prepare new slide
      newSlide.classList.add('active');
      newSlide.style.opacity = '0'; // Start invisible
      newSlide.style.zIndex = '2';
      
      // 3. Fade IN new slide
      gsap.to(newSlide, {
        opacity: 1,
        duration: 0.5,
        ease: 'power2.inOut',
        onComplete: () => {
          isTransitioning = false; // Unlock navigation
          animateSlide(n);
        }
      });
    }
  });
  
  currentSlide = n;
}

function nextSlide() { if (currentSlide < totalSlides && !isTransitioning) goToSlide(currentSlide + 1); }
function prevSlide() { if (currentSlide > 1 && !isTransitioning) goToSlide(currentSlide - 1); }

// Mobile Navigation (Swipe)
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', e => {
  touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

document.addEventListener('touchend', e => {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
}, { passive: true });

function handleSwipe() {
  const swipeThreshold = 50; // Minimum distance to count as swipe
  const diff = touchStartX - touchEndX;
  
  if (Math.abs(diff) > swipeThreshold) {
    if (diff > 0) {
      // Swiped Left -> Next Slide
      nextSlide();
    } else {
      // Swiped Right -> Previous Slide
      prevSlide();
    }
  }
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); nextSlide(); }
  else if (e.key === 'ArrowLeft') { e.preventDefault(); prevSlide(); }
});

document.addEventListener('click', () => {
  // Only trigger next slide on click if it wasn't a swipe 
  // (simple clicks have diff ~0, but let's be safe: swipes are handled by touchend)
  // On mobile, tap fires click too. We might duplicate, but standard is fine.
  // Ideally, if we swipe, we shouldn't click.
  // Actually, 'click' fires after touchend. 
  // Let's rely on swipes for direction, and Click for "Next" only if not a swipe?
  // For simplicity: Tap is next. Swipe Right is back. Swipe Left is Next.
  // To avoid double triggers, we could prevent default on touch, but that blocks scrolling.
  // Since the app is fixed full screen, scrolling isn't an issue.
  
  // Let's keep click for Desktop mouse users.
  // Mobile users might double trigger "next" if they "tap-swipe". 
  // But standard pure Swipe doesn't trigger click usually if recognized as gestures.
  nextSlide(); 
});

// ============================================
// ANIMATIONS
// ============================================

function animateSlide(n: number) {
  switch(n) {
    case 1: /* Blank slide - no animation */ break;
    case 2: animateTitle(); break;
    case 3: animateGenres(); break;
    case 4: animateTopGames(); break;
    case 5: animateConsoles(); break;
    case 6: animateRegional(); break;
    case 7: animateFranchises(); break;
    case 8: animateAnswer(); break;
  }
}

// SLIDE 2: Title with Sequential Animation (like PowerPoint)
function animateTitle() {
  // Reset elements first
  resetSlide2();
  
  // Unhide the parent container explicitly
  const slide = document.getElementById('slide-2')!;
  const content = slide.querySelector('.title-content') as HTMLElement;
  content.classList.remove('hidden');
  content.style.opacity = '1';
  content.style.visibility = 'visible';
  
  const subtitle = document.querySelector('.title-subtitle') as HTMLElement;
  const line1 = document.getElementById('title-line-1')!;
  const line2 = document.getElementById('title-line-2')!;
  const line3 = document.getElementById('title-line-3')!;
  const divider = document.querySelector('.title-divider') as HTMLElement;
  const stats = document.querySelector('.title-stats') as HTMLElement;
  
  const lines = ['THE BILLION', 'DOLLAR', 'QUESTION'];
  
  // Typewriter function
  function typeWriter(element: HTMLElement, text: string, callback?: () => void) {
    let i = 0;
    element.textContent = '';
    element.classList.remove('hidden');
    element.style.opacity = '1';
    element.style.visibility = 'visible';
    
    function type() {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTrackedTimeout(type, 70); // Speed of typing
      } else if (callback) {
        setTrackedTimeout(callback, 150); // Pause before next line
      }
    }
    type();
  }
  
  // Show helper function
  const showElement = (el: HTMLElement, delay: number = 0) => {
    el.classList.remove('hidden');
    gsap.fromTo(el, { opacity: 0, y: 10 }, { opacity: 1, y: 0, visibility: 'visible', duration: 0.5, delay: delay });
  };
  
  // 1. Show subtitle first
  setTrackedTimeout(() => {
    showElement(subtitle);
    
    // 2. Start typing title after subtitle appears
    setTrackedTimeout(() => {
      typeWriter(line1, lines[0], () => {
        typeWriter(line2, lines[1], () => {
          typeWriter(line3, lines[2], () => {
             // 3. Show divider
             showElement(divider);
             
             // 4. Show stats
             setTrackedTimeout(() => {
               showElement(stats);
               
               // Animate numbers with proper formatting
               const statGames = document.getElementById('stat-games');
               const statSales = document.getElementById('stat-sales');
               
               if (statGames) {
                 const target = { val: 0 };
                 gsap.to(target, { 
                   val: 64016, 
                   duration: 2, 
                   ease: 'power2.out',
                   onUpdate: () => {
                     statGames.innerText = Math.floor(target.val).toLocaleString();
                   }
                 });
               }
               
               if (statSales) {
                 const target = { val: 0 };
                 gsap.to(target, { 
                   val: 6.6, 
                   duration: 2, 
                   ease: 'power2.out',
                   onUpdate: () => {
                     statSales.innerText = target.val.toFixed(1);
                   }
                 });
               }
             }, 400);
          });
        });
      });
    }, 600);
  }, 200);
}

// Reset slide 2 to initial state
function resetSlide2() {
  const subtitle = document.querySelector('.title-subtitle') as HTMLElement;
  const line1 = document.getElementById('title-line-1')!;
  const line2 = document.getElementById('title-line-2')!;
  const line3 = document.getElementById('title-line-3')!;
  const divider = document.querySelector('.title-divider') as HTMLElement;
  const stats = document.querySelector('.title-stats') as HTMLElement;
  
  if (subtitle) { subtitle.classList.add('hidden'); subtitle.style.opacity = '0'; }
  if (line1) { line1.textContent = ''; line1.classList.add('hidden'); }
  if (line2) { line2.textContent = ''; line2.classList.add('hidden'); }
  if (line3) { line3.textContent = ''; line3.classList.add('hidden'); }
  if (divider) { divider.classList.add('hidden'); divider.style.opacity = '0'; }
  if (stats) { stats.classList.add('hidden'); stats.style.opacity = '0'; }
  
  // Reset stat counters
  const statGames = document.getElementById('stat-games');
  const statSales = document.getElementById('stat-sales');
  if (statGames) statGames.textContent = '0';
  if (statSales) statSales.textContent = '0';
}

// SLIDE 3: Genre Breakdown with Typewriter
function animateGenres() {
  // Reset elements first
  resetSlide3();
  
  // Unhide the parent container explicitly
  const slide = document.getElementById('slide-3')!;
  const content = slide.querySelector('.chart-slide') as HTMLElement;
  content.classList.remove('hidden');
  content.style.opacity = '1';
  content.style.visibility = 'visible';
  
  const headerLeft = document.querySelector('#slide-3 .header-left') as HTMLElement;
  const title1 = document.getElementById('genre-title-1')!;
  const title2 = document.getElementById('genre-title-2')!;
  const chartArea = document.getElementById('genre-chart') as HTMLElement;
  const insight = document.getElementById('genre-insight') as HTMLElement;
  
  // Typewriter helper
  function typeText(element: HTMLElement, text: string, callback?: () => void) {
    let i = 0;
    element.textContent = '';
    function type() {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTrackedTimeout(type, 60);
      } else if (callback) {
        setTrackedTimeout(callback, 100);
      }
    }
    type();
  }
  
  // SEQUENCE
  setTrackedTimeout(() => {
    // 1. Show header
    headerLeft.classList.remove('hidden');
    gsap.fromTo(headerLeft, { opacity: 0, x: -20 }, { opacity: 1, x: 0, visibility: 'visible', duration: 0.4 });
    
    // 2. Typewrite title
    setTrackedTimeout(() => {
      typeText(title1, 'GENRE', () => {
        typeText(title2, 'BREAKDOWN', () => {
          // 3. Show chart and build all bars at once
          chartArea.classList.remove('hidden');
          chartArea.style.visibility = 'visible';
          chartArea.style.opacity = '1';
          
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
          
          // 4. Show insight
          setTrackedTimeout(() => {
            insight.classList.remove('hidden');
            gsap.fromTo(insight, { opacity: 0, y: 20 }, { opacity: 1, y: 0, visibility: 'visible', duration: 0.5 });
          }, 1200);
        });
      });
    }, 300);
  }, 200);
}

// Reset slide 3 to initial state
function resetSlide3() {
  const headerLeft = document.querySelector('#slide-3 .header-left') as HTMLElement;
  const title1 = document.getElementById('genre-title-1')!;
  const title2 = document.getElementById('genre-title-2')!;
  const chartArea = document.getElementById('genre-chart') as HTMLElement;
  const insight = document.getElementById('genre-insight') as HTMLElement;
  
  if (headerLeft) { headerLeft.classList.add('hidden'); headerLeft.style.opacity = '0'; }
  if (title1) title1.textContent = '';
  if (title2) title2.textContent = '';
  if (chartArea) { chartArea.classList.add('hidden'); chartArea.innerHTML = ''; chartArea.style.opacity = '0'; }
  if (insight) { insight.classList.add('hidden'); insight.style.opacity = '0'; }
}

// SLIDE 4: Top Games
function animateTopGames() {
  const slide = document.getElementById('slide-4')!;
  slide.querySelector('.chart-slide')!.classList.remove('hidden');
  (slide.querySelector('.chart-slide') as HTMLElement).style.visibility = 'visible';
  (slide.querySelector('.chart-slide') as HTMLElement).style.opacity = '1';
  
  (document.getElementById('games-chart') as HTMLElement).classList.remove('hidden');
  (document.getElementById('games-chart') as HTMLElement).style.visibility = 'visible';
  (document.getElementById('games-chart') as HTMLElement).style.opacity = '1';

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
  
  // Show insight after bars animate
  const insight = document.querySelector('#slide-4 .slide-insight') as HTMLElement;
  if (insight) {
    insight.classList.remove('hidden');
    insight.style.visibility = 'visible';
    gsap.fromTo(insight, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, delay: 1.5 });
  }
}

// SLIDE 5: Console Wars
function animateConsoles() {
  const slide = document.getElementById('slide-5')!;
  slide.querySelector('.chart-slide')!.classList.remove('hidden');
  (slide.querySelector('.chart-slide') as HTMLElement).style.visibility = 'visible';
  (slide.querySelector('.chart-slide') as HTMLElement).style.opacity = '1';
  
  const area = slide.querySelector('.donut-area') as HTMLElement;
  area.classList.remove('hidden');
  area.style.visibility = 'visible';
  area.style.opacity = '1';

  buildDonutChart('console-donut', 'console-legend', [
    { label: 'PLAYSTATION', value: 50.6, sales: '$3.3B' },
    { label: 'NINTENDO', value: 25.8, sales: '$1.6B' },
    { label: 'XBOX', value: 21.1, sales: '$1.4B' },
    { label: 'PC', value: 2.6, sales: '$0.2B' },
  ], 'white');
}

// SLIDE 6: Regional Sales
function animateRegional() {
  const slide = document.getElementById('slide-6')!;
  slide.querySelector('.chart-slide')!.classList.remove('hidden');
  (slide.querySelector('.chart-slide') as HTMLElement).style.visibility = 'visible';
  (slide.querySelector('.chart-slide') as HTMLElement).style.opacity = '1';
  
  const area = slide.querySelector('.donut-area') as HTMLElement;
  area.classList.remove('hidden');
  area.style.visibility = 'visible';
  area.style.opacity = '1';

  buildDonutChart('regional-donut', 'regional-legend', [
    { label: 'NORTH AMERICA', value: 51, sales: '$3.3B' },
    { label: 'EUROPE', value: 29, sales: '$1.9B' },
    { label: 'JAPAN', value: 10, sales: '$0.7B' },
    { label: 'OTHER', value: 10, sales: '$0.7B' },
  ], 'black');
}

// SLIDE 7: Top Franchises
function animateFranchises() {
  const slide = document.getElementById('slide-7')!;
  slide.querySelector('.chart-slide')!.classList.remove('hidden');
  (slide.querySelector('.chart-slide') as HTMLElement).style.visibility = 'visible';
  (slide.querySelector('.chart-slide') as HTMLElement).style.opacity = '1';
  
  (document.getElementById('franchise-chart') as HTMLElement).classList.remove('hidden');
  (document.getElementById('franchise-chart') as HTMLElement).style.visibility = 'visible';
  (document.getElementById('franchise-chart') as HTMLElement).style.opacity = '1';

  buildBarChart('franchise-chart', [
    { name: 'CALL OF DUTY', value: 303 },
    { name: 'FIFA', value: 212 },
    { name: 'LEGO GAMES', value: 156 },
    { name: 'GRAND THEFT AUTO', value: 155 },
    { name: 'MADDEN NFL', value: 130 },
  ], 'white');
  
  // Show insight after bars animate
  const insight = document.querySelector('#slide-7 .slide-insight') as HTMLElement;
  if (insight) {
    insight.classList.remove('hidden');
    insight.style.visibility = 'visible';
    gsap.fromTo(insight, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, delay: 1.2 });
  }
}

// SLIDE 8: Answer
// SLIDE 8: Answer (Winning Formula)
function animateAnswer() {
  const slide = document.getElementById('slide-8')!;
  const layout = slide.querySelector('.winning-layout') as HTMLElement;
  
  // Unhide main container
  layout.classList.remove('hidden');
  layout.style.visibility = 'visible';
  layout.style.opacity = '1';
  
  // Elements to animate
  const eyebrow = slide.querySelector('.winning-eyebrow') as HTMLElement;
  const title = slide.querySelector('.winning-title') as HTMLElement;
  const cards = slide.querySelectorAll('.winning-card');
  const footer = slide.querySelector('.winning-footer') as HTMLElement;

  // Unhide everything first so GSAP can take over
  [eyebrow, title, footer].forEach(el => {
    if (el) {
      el.classList.remove('hidden');
      el.style.visibility = 'visible';
    }
  });
  cards.forEach(card => {
    (card as HTMLElement).classList.remove('hidden');
    (card as HTMLElement).style.visibility = 'visible';
  });

  // GSAP Timeline
  const tl = gsap.timeline();

  tl.from(eyebrow, { opacity: 0, y: -20, duration: 0.5, ease: 'power2.out' })
    .from(title, { opacity: 0, y: 20, duration: 0.7, ease: 'power3.out' }, '-=0.3')
    .from(cards, { 
      opacity: 0, 
      y: 50, 
      duration: 0.6, 
      stagger: 0.2, 
      ease: 'back.out(1.2)' 
    }, '-=0.2')
    .from(footer, { opacity: 0, duration: 1 }, '-=0.1');
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
}

function buildDonutChart(canvasId: string, legendId: string, data: {label: string, value: number, sales: string}[], theme: 'black' | 'white') {
  const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
  if (!canvas) return;
  
  // Destroy existing chart if any
  // Destroy existing chart if any
  const existingChart = Chart.getChart(canvas);
  if (existingChart) {
    existingChart.destroy();
  }
  
  // Set canvas size explicitly
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  
  const ctx = canvas.getContext('2d')!;
  
  const isBlack = theme === 'black';
  const colors = isBlack 
    ? ['#ffffff', '#aaaaaa', '#666666', '#333333']
    : ['#000000', '#444444', '#888888', '#cccccc'];
  const borderColor = isBlack ? '#000000' : '#ffffff';

  // Custom Plugin to draw text in center
  const centerTextPlugin = {
    id: 'centerText',
    beforeDraw: function(chart: any) {
      const width = chart.width,
            height = chart.height,
            ctx = chart.ctx;

      ctx.restore();
      
      const fontSize = (height / 114).toFixed(2);
      ctx.font = "bold " + fontSize + "em sans-serif";
      ctx.textBaseline = "middle";
      ctx.fillStyle = isBlack ? '#ffffff' : '#000000';

      const text = data[0].value + "%",
            textX = Math.round((width - ctx.measureText(text).width) / 2),
            textY = height / 2 - 10;

      ctx.fillText(text, textX, textY);

      // Label below percent
      ctx.font = "bold " + (height / 300).toFixed(2) + "em sans-serif"; // Smaller font
      const text2 = data[0].label.toUpperCase();
      const text2X = Math.round((width - ctx.measureText(text2).width) / 2);
      const text2Y = height / 2 + 25; // Offset below
      
      ctx.fillStyle = isBlack ? '#888888' : '#555555';
      ctx.fillText(text2, text2X, text2Y);

      ctx.save();
    }
  };
  
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
      responsive: true, 
      maintainAspectRatio: false, 
      cutout: '65%', 
      plugins: { 
        tooltip: { enabled: false },
        legend: { display: false }
      }, 
      animation: { 
        animateRotate: true, 
        duration: 1200 
      } 
    },
    plugins: [centerTextPlugin] // Register plugin
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
  
  // Remove old DOM overlay animation logic since plugin handles it
}

// ============================================
// INIT
// ============================================
// Slide 1 is blank, no animation needed on start
