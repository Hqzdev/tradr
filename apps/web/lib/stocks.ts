export const STOCK_TICKERS = ["AAPL", "NVDA", "TSLA", "MSFT", "AMZN", "GOOGL"] as const;

export type StockTicker = (typeof STOCK_TICKERS)[number];

export interface StockProfile {
  ticker: StockTicker;
  name: string;
  exchange: "NASDAQ";
  currency: "USD";
  demoPrice: number;
  demoChangePercent: number;
  color: string;
  logoSrc: string;
  logoTone: "light" | "dark";
  description: string;
}

export interface HeroOrbPlacement {
  id: number;
  ticker: StockTicker;
  labelSide: "left" | "right";
}

export const stockCatalog: Record<StockTicker, StockProfile> = {
  AAPL: {
    ticker: "AAPL",
    name: "Apple Inc.",
    exchange: "NASDAQ",
    currency: "USD",
    demoPrice: 192.45,
    demoChangePercent: 1.84,
    color: "#161616",
    logoSrc: "/stocks/apple.png",
    logoTone: "light",
    description:
      "Apple разрабатывает устройства, программное обеспечение и цифровые сервисы. В учебном рынке TRADR акция используется как основной инструмент для сравнения стратегий агентов.",
  },
  NVDA: {
    ticker: "NVDA",
    name: "NVIDIA Corporation",
    exchange: "NASDAQ",
    currency: "USD",
    demoPrice: 138.72,
    demoChangePercent: 2.1,
    color: "#76B900",
    logoSrc: "/stocks/nvidia.png",
    logoTone: "light",
    description:
      "NVIDIA создаёт вычислительные платформы, графические процессоры и инфраструктуру для искусственного интеллекта. Бумага отличается заметной учебной волатильностью.",
  },
  TSLA: {
    ticker: "TSLA",
    name: "Tesla, Inc.",
    exchange: "NASDAQ",
    currency: "USD",
    demoPrice: 247.18,
    demoChangePercent: -0.62,
    color: "#E82127",
    logoSrc: "/stocks/tesla.png",
    logoTone: "light",
    description:
      "Tesla производит электромобили, энергетические системы и программные продукты. В TRADR инструмент помогает тренироваться на быстрых изменениях цены.",
  },
  MSFT: {
    ticker: "MSFT",
    name: "Microsoft Corporation",
    exchange: "NASDAQ",
    currency: "USD",
    demoPrice: 428.76,
    demoChangePercent: 0.48,
    color: "#E8F1FF",
    logoSrc: "/stocks/microsoft.png",
    logoTone: "dark",
    description:
      "Microsoft развивает облачные сервисы, программное обеспечение и AI-продукты. Акция добавляет в учебный портфель крупную технологическую компанию.",
  },
  AMZN: {
    ticker: "AMZN",
    name: "Amazon.com, Inc.",
    exchange: "NASDAQ",
    currency: "USD",
    demoPrice: 186.42,
    demoChangePercent: 1.06,
    color: "#FFB44A",
    logoSrc: "/stocks/amazon.png",
    logoTone: "dark",
    description:
      "Amazon объединяет электронную коммерцию, облачную инфраструктуру и цифровые сервисы. В симуляции бумага показывает сочетание роста и рыночного риска.",
  },
  GOOGL: {
    ticker: "GOOGL",
    name: "Alphabet Inc.",
    exchange: "NASDAQ",
    currency: "USD",
    demoPrice: 167.28,
    demoChangePercent: -0.31,
    color: "#4285F4",
    logoSrc: "/stocks/google.png",
    logoTone: "light",
    description:
      "Alphabet объединяет поисковые, рекламные, облачные и исследовательские продукты Google. Инструмент используется для сравнения решений на едином рынке.",
  },
};

export const heroOrbPlacements: HeroOrbPlacement[] = [
  { id: 1, ticker: "TSLA", labelSide: "right" },
  { id: 2, ticker: "AAPL", labelSide: "right" },
  { id: 3, ticker: "NVDA", labelSide: "right" },
  { id: 4, ticker: "MSFT", labelSide: "left" },
  { id: 5, ticker: "AMZN", labelSide: "left" },
  { id: 6, ticker: "GOOGL", labelSide: "left" },
  { id: 7, ticker: "MSFT", labelSide: "right" },
  { id: 8, ticker: "NVDA", labelSide: "right" },
  { id: 9, ticker: "TSLA", labelSide: "left" },
  { id: 10, ticker: "GOOGL", labelSide: "left" },
  { id: 11, ticker: "AMZN", labelSide: "right" },
  { id: 12, ticker: "AAPL", labelSide: "left" },
  { id: 13, ticker: "GOOGL", labelSide: "right" },
  { id: 14, ticker: "AMZN", labelSide: "right" },
  { id: 15, ticker: "MSFT", labelSide: "left" },
  { id: 16, ticker: "NVDA", labelSide: "left" },
  { id: 17, ticker: "AAPL", labelSide: "right" },
  { id: 18, ticker: "TSLA", labelSide: "left" },
];

export function isStockTicker(value: string): value is StockTicker {
  return STOCK_TICKERS.includes(value.toUpperCase() as StockTicker);
}

export function getStockProfile(value: string): StockProfile | null {
  const ticker = value.toUpperCase();
  return isStockTicker(ticker) ? stockCatalog[ticker] : null;
}

export function formatDemoPercent(value: number): string {
  return `${Math.abs(value).toFixed(2).replace(".", ",")}%`;
}
