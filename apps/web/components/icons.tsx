import type { SVGProps } from "react";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import {
  Alert02Icon,
  AlertCircleIcon,
  ArrowReloadHorizontalIcon,
  ArrowUpRight01Icon,
  Calendar03Icon,
  Cancel01Icon,
  ChartCandlestickIcon,
  CheckIcon,
  CheckmarkCircle02Icon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloudUploadIcon,
  Copy01Icon,
  DotIcon,
  Download01Icon,
  ExpandIcon,
  File01Icon,
  HistoryIcon,
  Idea01Icon,
  InboxIcon,
  InformationCircleIcon,
  LayoutDashboardIcon,
  Loading03Icon,
  Mail01Icon,
  Medal01Icon,
  MinusSignIcon,
  NewspaperIcon,
  PauseIcon,
  PencilEdit01Icon,
  PlusSignIcon,
  Robot01Icon,
  Search01Icon,
  Settings02Icon,
  ShieldCheckIcon,
  ShuffleIcon,
  SlidersHorizontalIcon,
  StarIcon,
  TrendingUpIcon,
  TrophyIcon,
  Wallet01Icon,
  WifiOff01Icon,
} from "@hugeicons/core-free-icons";

// All icons in this file are rendered through Hugeicons
// (https://hugeicons.com) via @hugeicons/react + @hugeicons/core-free-icons.
// Do not add lucide-react — see CLAUDE.md ("Icon library" section).
type IconProps = SVGProps<SVGSVGElement>;

function huge(icon: IconSvgElement) {
  return function HugeWrapped({ strokeWidth, ...rest }: IconProps) {
    const sw = typeof strokeWidth === "string" ? parseFloat(strokeWidth) : strokeWidth;
    return <HugeiconsIcon icon={icon} strokeWidth={sw ?? 1.75} {...rest} />;
  };
}

// Keep every branded surface tied to the same exported TRADR asset.
// The SVG wrapper preserves the icon API used throughout the interface.
export function IconLogo(props: IconProps) {
  return (
    <svg viewBox="0 0 32 32" fill="none" {...props}>
      <image href="/logo.png" x="-5" y="-5" width="42" height="42" preserveAspectRatio="xMidYMid meet" />
    </svg>
  );
}

export const IconMarket = huge(LayoutDashboardIcon);
export const IconTerminal = huge(ChartCandlestickIcon);
export const IconPortfolio = huge(Wallet01Icon);
export const IconAgents = huge(Robot01Icon);
export const IconSettings = huge(Settings02Icon);
export const IconSearch = huge(Search01Icon);
export const IconChevronDown = huge(ChevronDownIcon);
export const IconChevronLeft = huge(ChevronLeftIcon);
export const IconChevronRight = huge(ChevronRightIcon);
export const IconPlus = huge(PlusSignIcon);
export const IconArrowUpRight = huge(ArrowUpRight01Icon);
export const IconTrendUp = huge(TrendingUpIcon);
export const IconX = huge(Cancel01Icon);
export const IconSliders = huge(SlidersHorizontalIcon);
export const IconPause = huge(PauseIcon);
export const IconTrophy = huge(TrophyIcon);
export const IconShield = huge(ShieldCheckIcon);
export const IconShuffle = huge(ShuffleIcon);
export const IconDownload = huge(Download01Icon);
export const IconHistory = huge(HistoryIcon);
export const IconCheck = huge(CheckIcon);
export const IconDot = huge(DotIcon);
export const IconExpand = huge(ExpandIcon);
export const IconCandles = huge(ChartCandlestickIcon);
export const IconMinus = huge(MinusSignIcon);
export const IconEdit = huge(PencilEdit01Icon);
export const IconUpload = huge(CloudUploadIcon);
export const IconCopy = huge(Copy01Icon);
export const IconMail = huge(Mail01Icon);
export const IconStar = huge(StarIcon);
export const IconNews = huge(NewspaperIcon);
export const IconIdea = huge(Idea01Icon);
export const IconFile = huge(File01Icon);
export const IconCalendar = huge(Calendar03Icon);
export const IconMedal = huge(Medal01Icon);
export const IconAlertCircle = huge(AlertCircleIcon);
export const IconAlertTriangle = huge(Alert02Icon);
export const IconInfoCircle = huge(InformationCircleIcon);
export const IconCheckCircle = huge(CheckmarkCircle02Icon);
export const IconWifiOff = huge(WifiOff01Icon);
export const IconRefresh = huge(ArrowReloadHorizontalIcon);
export const IconLoading = huge(Loading03Icon);
export const IconInbox = huge(InboxIcon);
