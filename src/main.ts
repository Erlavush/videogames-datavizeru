import "./style.css";
import gsap from "gsap";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

// ============================================
// CHART DATA
// ============================================
const data = {
  topGames: [
    { name: "GRAND THEFT AUTO V (PS3)", value: 20.3 },
    { name: "GRAND THEFT AUTO V (PS4)", value: 19.4 },
    { name: "GTA: VICE CITY (PS2)", value: 16.2 },
    { name: "GRAND THEFT AUTO V (X360)", value: 15.9 },
    { name: "CALL OF DUTY: BLACK OPS 3", value: 15.1 },
    { name: "COD: MODERN WARFARE 3", value: 14.8 },
    { name: "CALL OF DUTY: BLACK OPS", value: 14.7 },
    { name: "RED DEAD REDEMPTION 2", value: 13.9 },
    { name: "COD: BLACK OPS II (X360)", value: 13.9 },
    { name: "COD: BLACK OPS II (PS3)", value: 13.8 },
  ],
  genres: [
    { name: "SPORTS", value: 1188 },
    { name: "ACTION", value: 1126 },
    { name: "SHOOTER", value: 996 },
    { name: "MISC", value: 558 },
    { name: "RACING", value: 526 },
    { name: "RPG", value: 427 },
    { name: "PLATFORM", value: 349 },
    { name: "FIGHTING", value: 341 },
  ],
  consoleWars: [
    { name: "PLAYSTATION", value: 50.6 },
    { name: "NINTENDO", value: 25.8 },
    { name: "XBOX", value: 21.1 },
    { name: "PC", value: 2.6 },
  ],
  regional: [
    { name: "NORTH AMERICA", value: 51, amount: 3346 },
    { name: "EUROPE", value: 29, amount: 1917 },
    { name: "JAPAN", value: 10, amount: 688 },
    { name: "OTHER", value: 10, amount: 651 },
  ],
  usaGenres: [
    { name: "SHOOTER", value: 85 },
    { name: "SPORTS", value: 72 },
    { name: "ACTION", value: 68 },
    { name: "MISC", value: 45 },
    { name: "RACING", value: 38 },
  ],
  japanGenres: [
    { name: "ROLE-PLAYING", value: 78 },
    { name: "ACTION", value: 55 },
    { name: "SPORTS", value: 42 },
    { name: "PLATFORM", value: 35 },
    { name: "FIGHTING", value: 28 },
  ],
};

// ============================================
// INIT APP
// ============================================
function init() {
  const app = document.getElementById("app")!;

  app.innerHTML = `
    <div class="ambient"></div>
    
    <!-- CHART 1: Horizontal Bar (Top Games) -->
    <section class="section" id="section-hbar">
      <div class="section-header">
        <h2>TOP SELLING<br>GAMES</h2>
        <div class="subtitle">GLOBAL SALES • MILLIONS USD</div>
      </div>
      <div class="h-bar-chart" id="hbar-chart"></div>
    </section>
    
    <!-- CHART 2: Vertical Bar (Genres) -->
    <section class="section" id="section-vbar">
      <div class="section-header">
        <h2>GENRE<br>BREAKDOWN</h2>
        <div class="subtitle">SALES BY CATEGORY • MILLIONS USD</div>
      </div>
      <div class="v-bar-chart" id="vbar-chart"></div>
    </section>
    
    <!-- CHART 3: Donut (Console Wars) -->
    <section class="section" id="section-donut">
      <div class="section-header">
        <h2>CONSOLE<br>WARS</h2>
        <div class="subtitle">MARKET SHARE BY PLATFORM</div>
      </div>
      <div class="donut-container">
        <div class="donut-wrapper">
          <canvas id="donut-canvas"></canvas>
          <div class="donut-center">
            <div class="donut-center-value">51%</div>
            <div class="donut-center-label">PLAYSTATION</div>
          </div>
        </div>
        <div class="donut-legend" id="donut-legend"></div>
      </div>
    </section>
    
    <!-- CHART 4: Donut (Regional) -->
    <section class="section" id="section-regional">
      <div class="section-header">
        <h2>REGIONAL<br>SALES</h2>
        <div class="subtitle">GLOBAL MARKET DISTRIBUTION</div>
      </div>
      <div class="donut-container">
        <div class="donut-wrapper">
          <canvas id="regional-canvas"></canvas>
          <div class="donut-center">
            <div class="donut-center-value">51%</div>
            <div class="donut-center-label">NORTH AMERICA</div>
          </div>
        </div>
        <div class="donut-legend" id="regional-legend"></div>
      </div>
    </section>
    
    <!-- CHART 5: Comparison (Japan vs USA) -->
    <section class="section" id="section-comparison">
      <div class="section-header">
        <h2>CULTURAL<br>PREFERENCES</h2>
        <div class="subtitle">GENRE POPULARITY BY REGION</div>
      </div>
      <div class="comparison-container">
        <div class="comparison-side left" id="comp-usa">
          <div class="comparison-header">
            <div class="comparison-flag">🇺🇸</div>
            <div class="comparison-title">NORTH AMERICA</div>
          </div>
          <div class="comparison-bars" id="usa-bars"></div>
        </div>
        <div class="vs-divider">
          <span class="vs-text">VS</span>
        </div>
        <div class="comparison-side right" id="comp-japan">
          <div class="comparison-header">
            <div class="comparison-flag">🇯🇵</div>
            <div class="comparison-title">JAPAN</div>
          </div>
          <div class="comparison-bars" id="japan-bars"></div>
        </div>
      </div>
    </section>
  `;

  // Build all charts
  buildHorizontalBarChart();
  buildVerticalBarChart();
  buildDonutChart("donut-canvas", "donut-legend", data.consoleWars);
  buildDonutChart("regional-canvas", "regional-legend", data.regional);
  buildComparisonChart();

  // Animate all charts
  animateAll();
}

// ============================================
// HORIZONTAL BAR CHART
// ============================================
function buildHorizontalBarChart() {
  const container = document.getElementById("hbar-chart")!;
  const maxValue = Math.max(...data.topGames.map((d) => d.value));

  container.innerHTML = data.topGames
    .map(
      (item) => `
    <div class="h-bar-row">
      <div class="h-bar-header">
        <div class="h-bar-label">${item.name}</div>
        <div class="h-bar-value">$${item.value}M</div>
      </div>
      <div class="h-bar-track">
        <div class="h-bar-fill" data-width="${(item.value / maxValue) * 100}"></div>
      </div>
    </div>
  `,
    )
    .join("");
}

// ============================================
// VERTICAL BAR CHART
// ============================================
function buildVerticalBarChart() {
  const container = document.getElementById("vbar-chart")!;
  const maxValue = Math.max(...data.genres.map((d) => d.value));

  container.innerHTML = data.genres
    .map(
      (item) => `
    <div class="v-bar-item">
      <div class="v-bar-value">$${item.value}M</div>
      <div class="v-bar-fill" data-height="${(item.value / maxValue) * 100}"></div>
      <div class="v-bar-label">${item.name}</div>
    </div>
  `,
    )
    .join("");
}

// ============================================
// DONUT CHART (Black & White)
// ============================================
function buildDonutChart(canvasId: string, legendId: string, chartData: any[]) {
  const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
  const legendContainer = document.getElementById(legendId)!;

  // Grayscale colors for B&W theme
  const greyColors = ["#ffffff", "#888888", "#555555", "#333333"];
  const barClasses = ["", "light", "mid", "dim"];

  // Build legend
  legendContainer.innerHTML = chartData
    .map(
      (item, i) => `
    <div class="legend-item">
      <div class="legend-bar ${barClasses[i]}"></div>
      <span class="legend-name">${item.name}</span>
      <span class="legend-value">${item.amount ? "$" + (item.amount / 1000).toFixed(1) + "B" : item.value + "%"}</span>
      <span class="legend-pct">${item.value}%</span>
    </div>
  `,
    )
    .join("");

  // Create Chart.js donut
  new Chart(canvas, {
    type: "doughnut",
    data: {
      labels: chartData.map((d) => d.name),
      datasets: [
        {
          data: chartData.map((d) => d.value),
          backgroundColor: greyColors.slice(0, chartData.length),
          borderWidth: 0,
          hoverOffset: 15,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      cutout: "65%",
      animation: {
        animateRotate: true,
        animateScale: true,
        duration: 1500,
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "#1a1a1a",
          titleColor: "#fff",
          bodyColor: "#888",
          padding: 12,
          cornerRadius: 4,
          titleFont: { size: 14, weight: "bold" },
          bodyFont: { size: 12 },
        },
      },
    },
  });
}

// ============================================
// COMPARISON CHART
// ============================================
function buildComparisonChart() {
  const usaContainer = document.getElementById("usa-bars")!;
  const japanContainer = document.getElementById("japan-bars")!;

  const maxUSA = Math.max(...data.usaGenres.map((d) => d.value));
  const maxJP = Math.max(...data.japanGenres.map((d) => d.value));

  usaContainer.innerHTML = data.usaGenres
    .map(
      (item) => `
    <div class="comparison-bar-row">
      <div class="comparison-bar-label">${item.name}</div>
      <div class="comparison-bar-track">
        <div class="comparison-bar-fill" data-width="${(item.value / maxUSA) * 100}"></div>
      </div>
    </div>
  `,
    )
    .join("");

  japanContainer.innerHTML = data.japanGenres
    .map(
      (item) => `
    <div class="comparison-bar-row">
      <div class="comparison-bar-label">${item.name}</div>
      <div class="comparison-bar-track">
        <div class="comparison-bar-fill" data-width="${(item.value / maxJP) * 100}"></div>
      </div>
    </div>
  `,
    )
    .join("");
}

// ============================================
// ANIMATE ALL CHARTS
// ============================================
function animateAll() {
  // Animate horizontal bars
  const hbarRows = document.querySelectorAll(".h-bar-row");
  hbarRows.forEach((row, i) => {
    const fill = row.querySelector(".h-bar-fill") as HTMLElement;
    const value = row.querySelector(".h-bar-value") as HTMLElement;
    const width = fill.dataset.width;

    gsap.to(row, {
      opacity: 1,
      x: 0,
      duration: 0.8,
      delay: 0.3 + i * 0.12,
      ease: "power3.out",
    });

    gsap.to(fill, {
      width: width + "%",
      duration: 1.4,
      delay: 0.5 + i * 0.12,
      ease: "power3.out",
    });

    gsap.to(value, {
      opacity: 1,
      x: 0,
      duration: 0.6,
      delay: 0.7 + i * 0.12,
      ease: "power3.out",
    });
  });

  // Animate vertical bars
  const vbarItems = document.querySelectorAll(".v-bar-item");
  vbarItems.forEach((item, i) => {
    const fill = item.querySelector(".v-bar-fill") as HTMLElement;
    const value = item.querySelector(".v-bar-value") as HTMLElement;
    const height = fill.dataset.height;

    gsap.to(item, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      delay: 2.5 + i * 0.1,
      ease: "power3.out",
    });

    gsap.to(fill, {
      height: height + "%",
      duration: 1.2,
      delay: 2.7 + i * 0.1,
      ease: "power3.out",
    });

    gsap.to(value, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      delay: 3.2 + i * 0.1,
      ease: "power3.out",
    });
  });

  // Animate donut charts
  const donutCanvases = document.querySelectorAll(".donut-wrapper canvas");
  const donutCenters = document.querySelectorAll(".donut-center");
  const legendItems = document.querySelectorAll(".legend-item");

  donutCanvases.forEach((canvas, i) => {
    gsap.to(canvas, {
      opacity: 1,
      scale: 1,
      rotation: 0,
      duration: 1.2,
      delay: 4.5 + i * 2,
      ease: "power3.out",
    });
  });

  donutCenters.forEach((center, i) => {
    gsap.to(center, {
      opacity: 1,
      duration: 0.8,
      delay: 5.2 + i * 2,
      ease: "power3.out",
    });
  });

  legendItems.forEach((item, i) => {
    gsap.to(item, {
      opacity: 1,
      x: 0,
      duration: 0.6,
      delay: 4.8 + i * 0.15,
      ease: "power3.out",
    });
  });

  // Animate comparison chart
  const compLeft = document.querySelector(".comparison-side.left");
  const compRight = document.querySelector(".comparison-side.right");
  const vsDiv = document.querySelector(".vs-divider");
  const compBars = document.querySelectorAll(".comparison-bar-row");
  const compFills = document.querySelectorAll(".comparison-bar-fill");

  gsap.to(compLeft, {
    opacity: 1,
    x: 0,
    duration: 0.8,
    delay: 9,
    ease: "power3.out",
  });

  gsap.to(vsDiv, {
    opacity: 1,
    scale: 1,
    duration: 0.6,
    delay: 9.3,
    ease: "elastic.out(1, 0.5)",
  });

  gsap.to(compRight, {
    opacity: 1,
    x: 0,
    duration: 0.8,
    delay: 9.5,
    ease: "power3.out",
  });

  compBars.forEach((bar, i) => {
    gsap.to(bar, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      delay: 9.8 + i * 0.1,
      ease: "power3.out",
    });
  });

  compFills.forEach((fill, i) => {
    const el = fill as HTMLElement;
    gsap.to(el, {
      width: el.dataset.width + "%",
      duration: 1,
      delay: 10 + i * 0.1,
      ease: "power3.out",
    });
  });
}

// ============================================
// START
// ============================================
init();
