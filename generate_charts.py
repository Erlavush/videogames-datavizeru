"""
Video Game Sales - Chart Generator
Generates all visualization charts as images for reference
"""

import pandas as pd
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
import numpy as np
from pathlib import Path

# Set up style for dark theme charts
plt.style.use('dark_background')
plt.rcParams['font.family'] = 'sans-serif'
plt.rcParams['font.size'] = 12
plt.rcParams['axes.titlesize'] = 18
plt.rcParams['axes.titleweight'] = 'bold'
plt.rcParams['figure.facecolor'] = '#0a0a0a'
plt.rcParams['axes.facecolor'] = '#0a0a0a'
plt.rcParams['savefig.facecolor'] = '#0a0a0a'

# Colors
COLORS = {
    'gold': '#ffd700',
    'blue': '#00d4ff',
    'purple': '#a855f7',
    'pink': '#ff2d92',
    'green': '#00ff88',
    'orange': '#ff6b00',
    'ps_blue': '#003087',
    'xbox_green': '#107c10',
    'nintendo_red': '#e60012',
    'gray': '#6b7280'
}

# Create charts directory
charts_dir = Path('charts')
charts_dir.mkdir(exist_ok=True)

# Load data
print("Loading data...")
df = pd.read_csv('vgchartz-2024.csv')

# Clean data
for col in ['total_sales', 'na_sales', 'jp_sales', 'pal_sales', 'other_sales']:
    if col in df.columns:
        df[col] = pd.to_numeric(df[col], errors='coerce').fillna(0)

print(f"Loaded {len(df)} games")
print(f"Total Sales: ${df['total_sales'].sum():.2f}M")

# ============================================
# CHART 1: Top 10 Best-Selling Games
# ============================================
print("\nGenerating Chart 1: Top 10 Games...")

top_games = df.nlargest(10, 'total_sales')[['title', 'console', 'total_sales']].reset_index(drop=True)

fig, ax = plt.subplots(figsize=(14, 8))

# Color based on game title
colors = []
for title in top_games['title']:
    if 'Grand Theft Auto' in title or 'GTA' in title:
        colors.append(COLORS['gold'])
    elif 'Call of Duty' in title or 'CoD' in title:
        colors.append(COLORS['pink'])
    elif 'Red Dead' in title:
        colors.append(COLORS['orange'])
    else:
        colors.append(COLORS['blue'])

labels = [f"{row['title'][:25]}... ({row['console']})" if len(row['title']) > 25 
          else f"{row['title']} ({row['console']})" 
          for _, row in top_games.iterrows()]

bars = ax.barh(range(len(top_games)), top_games['total_sales'], color=colors, height=0.7)
ax.set_yticks(range(len(top_games)))
ax.set_yticklabels(labels, fontsize=11)
ax.invert_yaxis()
ax.set_xlabel('Sales (Millions USD)', fontsize=12)
ax.set_title('Top 10 Best-Selling Games of All Time', fontsize=20, pad=20)

# Add value labels
for bar, val in zip(bars, top_games['total_sales']):
    ax.text(val + 0.3, bar.get_y() + bar.get_height()/2, f'${val:.1f}M', 
            va='center', fontsize=10, color='white')

ax.spines['top'].set_visible(False)
ax.spines['right'].set_visible(False)
ax.spines['left'].set_color('#333')
ax.spines['bottom'].set_color('#333')

plt.tight_layout()
plt.savefig(charts_dir / '01_top_games.png', dpi=150, bbox_inches='tight')
plt.close()
print("  Saved: charts/01_top_games.png")

# ============================================
# CHART 2: Console Wars (Platform Family)
# ============================================
print("\nGenerating Chart 2: Console Wars...")

def get_platform_family(console):
    console = str(console).upper()
    if any(x in console for x in ['PS', 'PLAYSTATION', 'PSP', 'VITA']):
        return 'PlayStation'
    elif any(x in console for x in ['XBOX', 'X360', 'XONE', 'XB', 'XS']):
        return 'Xbox'
    elif any(x in console for x in ['WII', 'SWITCH', 'DS', 'NES', 'SNES', 'N64', 'GC', 'GBA', 'GB', '3DS', 'NS']):
        return 'Nintendo'
    elif 'PC' in console:
        return 'PC'
    else:
        return 'Other'

df['platform_family'] = df['console'].apply(get_platform_family)
platform_sales = df.groupby('platform_family')['total_sales'].sum().sort_values(ascending=False)

# Filter out 'Other' and keep main platforms
main_platforms = ['PlayStation', 'Nintendo', 'Xbox', 'PC']
platform_sales = platform_sales[platform_sales.index.isin(main_platforms)]

fig, ax = plt.subplots(figsize=(10, 10))

platform_colors = [COLORS['ps_blue'], COLORS['nintendo_red'], COLORS['xbox_green'], COLORS['gray']]
explode = (0.05, 0, 0, 0)

wedges, texts, autotexts = ax.pie(
    platform_sales.values, 
    labels=platform_sales.index,
    colors=platform_colors,
    autopct='%1.1f%%',
    pctdistance=0.75,
    explode=explode,
    startangle=90,
    textprops={'fontsize': 14, 'color': 'white'}
)

for autotext in autotexts:
    autotext.set_fontsize(14)
    autotext.set_fontweight('bold')

centre_circle = plt.Circle((0, 0), 0.50, fc='#0a0a0a')
ax.add_patch(centre_circle)

ax.set_title('Console Wars: Market Share by Platform', fontsize=20, pad=20)

plt.tight_layout()
plt.savefig(charts_dir / '02_console_wars.png', dpi=150, bbox_inches='tight')
plt.close()
print("  Saved: charts/02_console_wars.png")

# ============================================
# CHART 3: Top Consoles Breakdown
# ============================================
print("\nGenerating Chart 3: Top Consoles...")

console_sales = df.groupby('console')['total_sales'].sum().sort_values(ascending=False).head(10)

fig, ax = plt.subplots(figsize=(14, 8))

# Color by platform family
console_colors = []
for console in console_sales.index:
    family = get_platform_family(console)
    if family == 'PlayStation':
        console_colors.append(COLORS['ps_blue'])
    elif family == 'Xbox':
        console_colors.append(COLORS['xbox_green'])
    elif family == 'Nintendo':
        console_colors.append(COLORS['nintendo_red'])
    else:
        console_colors.append(COLORS['gray'])

bars = ax.bar(range(len(console_sales)), console_sales.values, color=console_colors, width=0.7)
ax.set_xticks(range(len(console_sales)))
ax.set_xticklabels(console_sales.index, fontsize=12, rotation=45, ha='right')
ax.set_ylabel('Sales (Millions USD)', fontsize=12)
ax.set_title('Top 10 Gaming Consoles by Total Sales', fontsize=20, pad=20)

# Add value labels
for bar, val in zip(bars, console_sales.values):
    ax.text(bar.get_x() + bar.get_width()/2, val + 20, f'${val:.0f}M', 
            ha='center', fontsize=10, color='white')

ax.spines['top'].set_visible(False)
ax.spines['right'].set_visible(False)

plt.tight_layout()
plt.savefig(charts_dir / '03_top_consoles.png', dpi=150, bbox_inches='tight')
plt.close()
print("  Saved: charts/03_top_consoles.png")

# ============================================
# CHART 4: Genre Breakdown
# ============================================
print("\nGenerating Chart 4: Genre Breakdown...")

genre_sales = df.groupby('genre')['total_sales'].sum().sort_values(ascending=False).head(10)

fig, ax = plt.subplots(figsize=(14, 8))

genre_colors = [COLORS['green'], COLORS['orange'], COLORS['pink'], COLORS['gray'], 
                COLORS['blue'], COLORS['purple'], COLORS['blue'], COLORS['pink'],
                COLORS['green'], COLORS['gray']]

bars = ax.bar(range(len(genre_sales)), genre_sales.values, color=genre_colors[:len(genre_sales)], width=0.7)
ax.set_xticks(range(len(genre_sales)))
ax.set_xticklabels(genre_sales.index, fontsize=12, rotation=45, ha='right')
ax.set_ylabel('Sales (Millions USD)', fontsize=12)
ax.set_title('Game Genres by Total Sales', fontsize=20, pad=20)

# Add value labels
for bar, val in zip(bars, genre_sales.values):
    ax.text(bar.get_x() + bar.get_width()/2, val + 20, f'${val:.0f}M', 
            ha='center', fontsize=10, color='white')

ax.spines['top'].set_visible(False)
ax.spines['right'].set_visible(False)

plt.tight_layout()
plt.savefig(charts_dir / '04_genres.png', dpi=150, bbox_inches='tight')
plt.close()
print("  Saved: charts/04_genres.png")

# ============================================
# CHART 5: Regional Sales Distribution
# ============================================
print("\nGenerating Chart 5: Regional Sales...")

regional_data = {
    'North America': df['na_sales'].sum(),
    'Europe': df['pal_sales'].sum(),
    'Japan': df['jp_sales'].sum(),
    'Other': df['other_sales'].sum()
}

fig, ax = plt.subplots(figsize=(10, 10))

region_colors = [COLORS['blue'], COLORS['purple'], COLORS['pink'], COLORS['gray']]

wedges, texts, autotexts = ax.pie(
    regional_data.values(), 
    labels=regional_data.keys(),
    colors=region_colors,
    autopct='%1.1f%%',
    pctdistance=0.75,
    startangle=90,
    textprops={'fontsize': 14, 'color': 'white'}
)

for autotext in autotexts:
    autotext.set_fontsize(14)
    autotext.set_fontweight('bold')

centre_circle = plt.Circle((0, 0), 0.50, fc='#0a0a0a')
ax.add_patch(centre_circle)

ax.set_title('Global Sales Distribution by Region', fontsize=20, pad=20)

plt.tight_layout()
plt.savefig(charts_dir / '05_regional_sales.png', dpi=150, bbox_inches='tight')
plt.close()
print("  Saved: charts/05_regional_sales.png")

# ============================================
# CHART 6: Japan vs North America Preferences
# ============================================
print("\nGenerating Chart 6: Japan vs USA...")

# Top genres in each region
na_genres = df.groupby('genre')['na_sales'].sum().sort_values(ascending=False).head(5)
jp_genres = df.groupby('genre')['jp_sales'].sum().sort_values(ascending=False).head(5)

fig, axes = plt.subplots(1, 2, figsize=(16, 8))

# North America
ax1 = axes[0]
bars1 = ax1.barh(range(len(na_genres)), na_genres.values, color=COLORS['blue'], height=0.6)
ax1.set_yticks(range(len(na_genres)))
ax1.set_yticklabels(na_genres.index, fontsize=12)
ax1.invert_yaxis()
ax1.set_xlabel('Sales (Millions USD)', fontsize=12)
ax1.set_title('🇺🇸 North America', fontsize=18, pad=15)
ax1.spines['top'].set_visible(False)
ax1.spines['right'].set_visible(False)

# Japan
ax2 = axes[1]
bars2 = ax2.barh(range(len(jp_genres)), jp_genres.values, color=COLORS['pink'], height=0.6)
ax2.set_yticks(range(len(jp_genres)))
ax2.set_yticklabels(jp_genres.index, fontsize=12)
ax2.invert_yaxis()
ax2.set_xlabel('Sales (Millions USD)', fontsize=12)
ax2.set_title('🇯🇵 Japan', fontsize=18, pad=15)
ax2.spines['top'].set_visible(False)
ax2.spines['right'].set_visible(False)

plt.suptitle('Genre Preferences: North America vs Japan', fontsize=20, y=1.02)
plt.tight_layout()
plt.savefig(charts_dir / '06_japan_vs_usa.png', dpi=150, bbox_inches='tight')
plt.close()
print("  Saved: charts/06_japan_vs_usa.png")

# ============================================
# CHART 7: Top Franchises
# ============================================
print("\nGenerating Chart 7: Top Franchises...")

# Extract franchise from title (first word or known franchises)
def get_franchise(title):
    title = str(title)
    known_franchises = {
        'Call of Duty': ['Call of Duty', 'CoD'],
        'FIFA': ['FIFA'],
        'Grand Theft Auto': ['Grand Theft Auto', 'GTA'],
        'Madden NFL': ['Madden'],
        'Pokemon': ['Pokemon', 'Pokémon'],
        'Mario': ['Mario', 'Super Mario'],
        'Assassin\'s Creed': ['Assassin\'s Creed'],
        'Need for Speed': ['Need for Speed'],
        'The Sims': ['Sims'],
        'NBA 2K': ['NBA 2K'],
        'Battlefield': ['Battlefield'],
        'LEGO': ['LEGO'],
        'Zelda': ['Zelda', 'Legend of Zelda'],
        'Halo': ['Halo'],
        'Final Fantasy': ['Final Fantasy'],
        'Minecraft': ['Minecraft'],
        'Red Dead': ['Red Dead'],
        'Resident Evil': ['Resident Evil'],
        'Tom Clancy': ['Tom Clancy'],
        'WWE': ['WWE', 'WWF']
    }
    
    for franchise, keywords in known_franchises.items():
        for keyword in keywords:
            if keyword.lower() in title.lower():
                return franchise
    return None

df['franchise'] = df['title'].apply(get_franchise)
franchise_sales = df[df['franchise'].notna()].groupby('franchise')['total_sales'].sum().sort_values(ascending=False).head(10)

fig, ax = plt.subplots(figsize=(14, 8))

franchise_colors = [COLORS['gold'], COLORS['green'], COLORS['orange'], COLORS['orange'],
                   COLORS['blue'], COLORS['pink'], COLORS['orange'], COLORS['green'],
                   COLORS['pink'], COLORS['gray']]

bars = ax.barh(range(len(franchise_sales)), franchise_sales.values, 
               color=franchise_colors[:len(franchise_sales)], height=0.7)
ax.set_yticks(range(len(franchise_sales)))
ax.set_yticklabels(franchise_sales.index, fontsize=12)
ax.invert_yaxis()
ax.set_xlabel('Sales (Millions USD)', fontsize=12)
ax.set_title('Top 10 Gaming Franchises by Total Sales', fontsize=20, pad=20)

# Add value labels
for bar, val in zip(bars, franchise_sales.values):
    ax.text(val + 3, bar.get_y() + bar.get_height()/2, f'${val:.0f}M', 
            va='center', fontsize=10, color='white')

ax.spines['top'].set_visible(False)
ax.spines['right'].set_visible(False)

plt.tight_layout()
plt.savefig(charts_dir / '07_franchises.png', dpi=150, bbox_inches='tight')
plt.close()
print("  Saved: charts/07_franchises.png")

# ============================================
# CHART 8: Sales by Release Year
# ============================================
print("\nGenerating Chart 8: Sales by Year...")

df['release_date'] = pd.to_datetime(df['release_date'], errors='coerce')
df['year'] = df['release_date'].dt.year

yearly_sales = df[df['year'] >= 1990].groupby('year')['total_sales'].sum()
yearly_sales = yearly_sales[yearly_sales.index <= 2023]

fig, ax = plt.subplots(figsize=(16, 8))

ax.fill_between(yearly_sales.index, yearly_sales.values, alpha=0.3, color=COLORS['blue'])
ax.plot(yearly_sales.index, yearly_sales.values, color=COLORS['blue'], linewidth=3)

# Highlight peak year
peak_year = yearly_sales.idxmax()
peak_val = yearly_sales.max()
ax.scatter([peak_year], [peak_val], color=COLORS['gold'], s=200, zorder=5)
ax.annotate(f'Peak: {int(peak_year)}\n${peak_val:.0f}M', 
            xy=(peak_year, peak_val), xytext=(peak_year+2, peak_val+50),
            fontsize=12, color=COLORS['gold'],
            arrowprops=dict(arrowstyle='->', color=COLORS['gold']))

ax.set_xlabel('Year', fontsize=12)
ax.set_ylabel('Sales (Millions USD)', fontsize=12)
ax.set_title('Video Game Sales Over Time', fontsize=20, pad=20)
ax.spines['top'].set_visible(False)
ax.spines['right'].set_visible(False)

plt.tight_layout()
plt.savefig(charts_dir / '08_sales_timeline.png', dpi=150, bbox_inches='tight')
plt.close()
print("  Saved: charts/08_sales_timeline.png")

# ============================================
# CHART 9: Top Publishers
# ============================================
print("\nGenerating Chart 9: Top Publishers...")

publisher_sales = df.groupby('publisher')['total_sales'].sum().sort_values(ascending=False).head(10)

fig, ax = plt.subplots(figsize=(14, 8))

pub_colors = [COLORS['blue'], COLORS['green'], COLORS['purple'], COLORS['orange'],
              COLORS['pink'], COLORS['gold'], COLORS['blue'], COLORS['green'],
              COLORS['purple'], COLORS['orange']]

bars = ax.barh(range(len(publisher_sales)), publisher_sales.values, 
               color=pub_colors, height=0.7)
ax.set_yticks(range(len(publisher_sales)))
ax.set_yticklabels(publisher_sales.index, fontsize=12)
ax.invert_yaxis()
ax.set_xlabel('Sales (Millions USD)', fontsize=12)
ax.set_title('Top 10 Game Publishers by Total Sales', fontsize=20, pad=20)

# Add value labels
for bar, val in zip(bars, publisher_sales.values):
    ax.text(val + 5, bar.get_y() + bar.get_height()/2, f'${val:.0f}M', 
            va='center', fontsize=10, color='white')

ax.spines['top'].set_visible(False)
ax.spines['right'].set_visible(False)

plt.tight_layout()
plt.savefig(charts_dir / '09_publishers.png', dpi=150, bbox_inches='tight')
plt.close()
print("  Saved: charts/09_publishers.png")

# ============================================
# Summary
# ============================================
print("\n" + "="*50)
print("CHART GENERATION COMPLETE!")
print("="*50)
print(f"\nAll charts saved to: {charts_dir.absolute()}")
print("\nGenerated charts:")
print("  1. Top 10 Best-Selling Games")
print("  2. Console Wars (Platform Market Share)")
print("  3. Top 10 Consoles")
print("  4. Genre Breakdown")
print("  5. Regional Sales Distribution")
print("  6. Japan vs USA Preferences")
print("  7. Top 10 Franchises")
print("  8. Sales Over Time")
print("  9. Top 10 Publishers")
print("\nUse these as reference for the web app!")
