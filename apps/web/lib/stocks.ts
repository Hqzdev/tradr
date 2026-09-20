export const STOCK_TICKERS = [
  "AAPL", "NVDA", "TSLA", "MSFT", "AMZN", "GOOGL",
  "META", "AMD", "NFLX", "INTC", "AVGO", "JPM",
  "V", "KO", "DIS", "PEP", "BAC", "XOM",
] as const;

export type StockTicker = (typeof STOCK_TICKERS)[number];

export interface StockProfile {
  ticker: StockTicker;
  name: string;
  exchange: "NASDAQ" | "NYSE";
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
  META: {
    ticker: "META",
    name: "Meta Platforms, Inc.",
    exchange: "NASDAQ",
    currency: "USD",
    demoPrice: 527.8,
    demoChangePercent: 1.32,
    color: "#0668E1",
    logoSrc: "/stocks/meta.svg",
    logoTone: "light",
    description:
      "Meta развивает социальные платформы, коммуникационные продукты и технологии дополненной реальности. В TRADR акция помогает сравнивать стратегии на крупной технологической компании.",
  },
  AMD: {
    ticker: "AMD",
    name: "Advanced Micro Devices, Inc.",
    exchange: "NASDAQ",
    currency: "USD",
    demoPrice: 154.65,
    demoChangePercent: -0.74,
    color: "#242424",
    logoSrc: "/stocks/amd.svg",
    logoTone: "light",
    description:
      "AMD создаёт процессоры, графические ускорители и вычислительные платформы. Учебный инструмент показывает поведение волатильной полупроводниковой компании.",
  },
  NFLX: {
    ticker: "NFLX",
    name: "Netflix, Inc.",
    exchange: "NASDAQ",
    currency: "USD",
    demoPrice: 119.5,
    demoChangePercent: 0.91,
    color: "#E50914",
    logoSrc: "/stocks/netflix.svg",
    logoTone: "light",
    description:
      "Netflix развивает глобальный стриминговый сервис и производство контента. В симуляции акция добавляет медиасектор и заметную реакцию на новости.",
  },
  INTC: {
    ticker: "INTC",
    name: "Intel Corporation",
    exchange: "NASDAQ",
    currency: "USD",
    demoPrice: 24.36,
    demoChangePercent: -1.18,
    color: "#0071C5",
    logoSrc: "/stocks/intel.svg",
    logoTone: "light",
    description:
      "Intel разрабатывает процессоры и инфраструктуру для вычислительных систем. Инструмент полезен для учебного сравнения разных циклов полупроводникового рынка.",
  },
  AVGO: {
    ticker: "AVGO",
    name: "Broadcom Inc.",
    exchange: "NASDAQ",
    currency: "USD",
    demoPrice: 342.5,
    demoChangePercent: 1.47,
    color: "#CC092F",
    logoSrc: "/stocks/broadcom.svg",
    logoTone: "light",
    description:
      "Broadcom поставляет полупроводниковые и инфраструктурные программные решения. В TRADR акция расширяет набор технологических сценариев.",
  },
  JPM: {
    ticker: "JPM",
    name: "JPMorgan Chase & Co.",
    exchange: "NYSE",
    currency: "USD",
    demoPrice: 303.2,
    demoChangePercent: 0.42,
    color: "#163A5F",
    logoSrc: "/stocks/jpmorgan.svg",
    logoTone: "light",
    description:
      "JPMorgan Chase предоставляет банковские и инвестиционные услуги. Акция добавляет в учебный рынок крупнейший финансовый сектор.",
  },
  V: {
    ticker: "V",
    name: "Visa Inc.",
    exchange: "NYSE",
    currency: "USD",
    demoPrice: 359.1,
    demoChangePercent: -0.22,
    color: "#1434CB",
    logoSrc: "/stocks/visa.svg",
    logoTone: "light",
    description:
      "Visa управляет глобальной платёжной сетью. В учебной среде бумага помогает изучать более устойчивые движения крупной финансовой инфраструктуры.",
  },
  KO: {
    ticker: "KO",
    name: "The Coca-Cola Company",
    exchange: "NYSE",
    currency: "USD",
    demoPrice: 70.15,
    demoChangePercent: 0.18,
    color: "#F40009",
    logoSrc: "/stocks/coca-cola.svg",
    logoTone: "light",
    description:
      "Coca-Cola производит и развивает глобальный портфель напитков. Акция представляет защитный потребительский сектор в учебном портфеле.",
  },
  DIS: {
    ticker: "DIS",
    name: "The Walt Disney Company",
    exchange: "NYSE",
    currency: "USD",
    demoPrice: 115.6,
    demoChangePercent: -0.56,
    color: "#C9E6FF",
    logoSrc: "/stocks/disney.svg",
    logoTone: "dark",
    description:
      "Disney объединяет студии, стриминг, телеканалы и тематические парки. В симуляции инструмент отражает сочетание медиа и потребительского бизнеса.",
  },
  PEP: {
    ticker: "PEP",
    name: "PepsiCo, Inc.",
    exchange: "NASDAQ",
    currency: "USD",
    demoPrice: 145.8,
    demoChangePercent: 0.27,
    color: "#101010",
    logoSrc: "/stocks/pepsi.svg",
    logoTone: "light",
    description:
      "PepsiCo выпускает напитки и продукты питания по всему миру. Акция добавляет потребительский сектор с более спокойной учебной динамикой.",
  },
  BAC: {
    ticker: "BAC",
    name: "Bank of America Corporation",
    exchange: "NYSE",
    currency: "USD",
    demoPrice: 51.2,
    demoChangePercent: -0.34,
    color: "#E31837",
    logoSrc: "/stocks/bank-of-america.svg",
    logoTone: "light",
    description:
      "Bank of America оказывает банковские и инвестиционные услуги. Инструмент расширяет финансовую часть учебного рынка TRADR.",
  },
  XOM: {
    ticker: "XOM",
    name: "Exxon Mobil Corporation",
    exchange: "NYSE",
    currency: "USD",
    demoPrice: 113.45,
    demoChangePercent: 0.39,
    color: "#FFF0F0",
    logoSrc: "/stocks/exxonmobil.svg",
    logoTone: "dark",
    description:
      "ExxonMobil работает в энергетике и нефтехимии. В учебном портфеле акция показывает отраслевое поведение энергетического сектора.",
  },
};

export const heroOrbPlacements: HeroOrbPlacement[] = [
  { id: 1, ticker: "TSLA", labelSide: "right" },
  { id: 2, ticker: "AAPL", labelSide: "right" },
  { id: 3, ticker: "NVDA", labelSide: "right" },
  { id: 4, ticker: "MSFT", labelSide: "left" },
  { id: 5, ticker: "META", labelSide: "left" },
  { id: 6, ticker: "GOOGL", labelSide: "left" },
  { id: 7, ticker: "JPM", labelSide: "right" },
  { id: 8, ticker: "AMD", labelSide: "right" },
  { id: 9, ticker: "NFLX", labelSide: "left" },
  { id: 10, ticker: "V", labelSide: "left" },
  { id: 11, ticker: "KO", labelSide: "right" },
  { id: 12, ticker: "AMZN", labelSide: "left" },
  { id: 13, ticker: "INTC", labelSide: "left" },
  { id: 14, ticker: "AVGO", labelSide: "right" },
  { id: 15, ticker: "DIS", labelSide: "left" },
  { id: 16, ticker: "PEP", labelSide: "left" },
  { id: 17, ticker: "BAC", labelSide: "right" },
  { id: 18, ticker: "XOM", labelSide: "left" },
  { id: 19, ticker: "AAPL", labelSide: "right" },
  { id: 20, ticker: "NVDA", labelSide: "right" },
  { id: 21, ticker: "TSLA", labelSide: "left" },
  { id: 22, ticker: "MSFT", labelSide: "right" },
  { id: 23, ticker: "AMZN", labelSide: "left" },
  { id: 24, ticker: "GOOGL", labelSide: "left" },
  { id: 25, ticker: "META", labelSide: "right" },
  { id: 26, ticker: "AMD", labelSide: "left" },
  { id: 27, ticker: "JPM", labelSide: "right" },
  { id: 28, ticker: "V", labelSide: "left" },
  { id: 29, ticker: "KO", labelSide: "left" },
  { id: 30, ticker: "XOM", labelSide: "right" },
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
