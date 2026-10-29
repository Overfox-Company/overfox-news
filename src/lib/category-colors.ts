import type { CSSProperties } from "react";

const palette = [
  "#FF4245", "#FF9230", "#FFD600", "#A0CC33",
  "#30D158", "#00DAC3", "#00D2E0", "#3CD3FE",
  "#0091FF", "#6B5DFF", "#DB34F2", "#FF375F",
] as const;

const categoryColors: Record<string, string> = {
  "inteligencia artificial": "#6B5DFF",
  desarrollo: "#00DAC3",
  negocios: "#FF9230",
  productos: "#3CD3FE",
};

// Keep each category's color stable across filters, cards and article pages.
export function categoryStyle(category: string): CSSProperties {
  const key = category.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  let hash = 0;
  for (const character of key) hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
  return { "--category-color": categoryColors[key] ?? palette[hash % palette.length] } as CSSProperties;
}
