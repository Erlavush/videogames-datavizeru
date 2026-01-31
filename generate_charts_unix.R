# ============================================
# Video Game Sales - R Data Visualization
# Simple charts using base R and ggplot2
# ============================================

# Load libraries
library(tidyverse)
library(scales)

# Load data
df <- read.csv("vgchartz-2024.csv")

# Clean data
df$total_sales <- as.numeric(df$total_sales)
df$na_sales <- as.numeric(df$na_sales)
df$jp_sales <- as.numeric(df$jp_sales)
df$pal_sales <- as.numeric(df$pal_sales)
df$other_sales <- as.numeric(df$other_sales)

# Replace NA with 0
df[is.na(df)] <- 0

# Create charts folder
dir.create("charts", showWarnings = FALSE)

# ============================================
# CHART 1: Top 10 Best-Selling Games
# ============================================
top_games <- df %>%
  arrange(desc(total_sales)) %>%
  head(10) %>%
  mutate(label = paste0(title, " (", console, ")"))

png("charts/r_01_top_games.png", width = 800, height = 500)
ggplot(top_games, aes(x = reorder(label, total_sales), y = total_sales)) +
  geom_bar(stat = "identity", fill = "steelblue") +
  coord_flip() +
  labs(
    title = "Top 10 Best-Selling Games",
    x = "Game",
    y = "Sales (Millions USD)"
  ) +
  theme_minimal()
dev.off()

# ============================================
# CHART 2: Console Wars (Platform Share)
# ============================================
get_platform <- function(console) {
  console <- toupper(console)
  if (grepl("PS|PLAYSTATION|PSP|VITA", console)) return("PlayStation")
  if (grepl("XBOX|X360|XONE|XB|XS", console)) return("Xbox")
  if (grepl("WII|SWITCH|DS|NES|SNES|N64|GC|GBA|GB|3DS|NS", console)) return("Nintendo")
  if (grepl("PC", console)) return("PC")
  return("Other")
}

df$platform <- sapply(df$console, get_platform)

platform_sales <- df %>%
  group_by(platform) %>%
  summarise(sales = sum(total_sales, na.rm = TRUE)) %>%
  filter(platform %in% c("PlayStation", "Xbox", "Nintendo", "PC"))

png("charts/r_02_console_wars.png", width = 600, height = 600)
ggplot(platform_sales, aes(x = "", y = sales, fill = platform)) +
  geom_bar(stat = "identity", width = 1) +
  coord_polar("y") +
  labs(title = "Console Wars: Market Share") +
  theme_void() +
  theme(legend.position = "right")
dev.off()

# ============================================
# CHART 3: Top 10 Consoles
# ============================================
console_sales <- df %>%
  group_by(console) %>%
  summarise(sales = sum(total_sales, na.rm = TRUE)) %>%
  arrange(desc(sales)) %>%
  head(10)

png("charts/r_03_top_consoles.png", width = 800, height = 500)
ggplot(console_sales, aes(x = reorder(console, sales), y = sales)) +
  geom_bar(stat = "identity", fill = "darkgreen") +
  coord_flip() +
  labs(
    title = "Top 10 Gaming Consoles",
    x = "Console",
    y = "Sales (Millions USD)"
  ) +
  theme_minimal()
dev.off()

# ============================================
# CHART 4: Genre Breakdown
# ============================================
genre_sales <- df %>%
  group_by(genre) %>%
  summarise(sales = sum(total_sales, na.rm = TRUE)) %>%
  arrange(desc(sales)) %>%
  head(10)

png("charts/r_04_genres.png", width = 800, height = 500)
ggplot(genre_sales, aes(x = reorder(genre, -sales), y = sales)) +
  geom_bar(stat = "identity", fill = "coral") +
  labs(
    title = "Game Genres by Total Sales",
    x = "Genre",
    y = "Sales (Millions USD)"
  ) +
  theme_minimal() +
  theme(axis.text.x = element_text(angle = 45, hjust = 1))
dev.off()

# ============================================
# CHART 5: Regional Sales Distribution
# ============================================
regional <- data.frame(
  region = c("North America", "Europe", "Japan", "Other"),
  sales = c(
    sum(df$na_sales, na.rm = TRUE),
    sum(df$pal_sales, na.rm = TRUE),
    sum(df$jp_sales, na.rm = TRUE),
    sum(df$other_sales, na.rm = TRUE)
  )
)

png("charts/r_05_regional.png", width = 600, height = 600)
ggplot(regional, aes(x = "", y = sales, fill = region)) +
  geom_bar(stat = "identity", width = 1) +
  coord_polar("y") +
  labs(title = "Sales by Region") +
  theme_void() +
  theme(legend.position = "right")
dev.off()

# ============================================
# CHART 6: Japan vs USA Genre Preferences
# ============================================
na_genres <- df %>%
  group_by(genre) %>%
  summarise(sales = sum(na_sales, na.rm = TRUE)) %>%
  arrange(desc(sales)) %>%
  head(5) %>%
  mutate(region = "North America")

jp_genres <- df %>%
  group_by(genre) %>%
  summarise(sales = sum(jp_sales, na.rm = TRUE)) %>%
  arrange(desc(sales)) %>%
  head(5) %>%
  mutate(region = "Japan")

comparison <- bind_rows(na_genres, jp_genres)

png("charts/r_06_japan_vs_usa.png", width = 800, height = 500)
ggplot(comparison, aes(x = genre, y = sales, fill = region)) +
  geom_bar(stat = "identity", position = "dodge") +
  labs(
    title = "Genre Preferences: Japan vs North America",
    x = "Genre",
    y = "Sales (Millions USD)"
  ) +
  theme_minimal() +
  theme(axis.text.x = element_text(angle = 45, hjust = 1))
dev.off()

# ============================================
# CHART 7: Top Publishers
# ============================================
publisher_sales <- df %>%
  group_by(publisher) %>%
  summarise(sales = sum(total_sales, na.rm = TRUE)) %>%
  arrange(desc(sales)) %>%
  head(10)

png("charts/r_07_publishers.png", width = 800, height = 500)
ggplot(publisher_sales, aes(x = reorder(publisher, sales), y = sales)) +
  geom_bar(stat = "identity", fill = "purple") +
  coord_flip() +
  labs(
    title = "Top 10 Game Publishers",
    x = "Publisher",
    y = "Sales (Millions USD)"
  ) +
  theme_minimal()
dev.off()

# ============================================
# Print summary
# ============================================
cat("\n========================================\n")
cat("CHARTS GENERATED SUCCESSFULLY!\n")
cat("========================================\n")
