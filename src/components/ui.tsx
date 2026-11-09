import { Beef, BookOpen, Carrot, ChevronRight, Coffee, Croissant, Pill, ShoppingBasket, type LucideIcon } from 'lucide-react'
import type { CSSProperties, ReactNode } from 'react'
import { Link, useNavigate } from 'react-router'
import { USER_POS, type Shop, type Status } from '../data/shops'
import { useStore } from '../store'

export const STATUS: Record<Status, { label: string; pill: string; tint: string; text: string; pin: string; big: string }> = {
  open: { label: 'مفتوح', pill: 'bg-open text-white', tint: 'bg-open-tint text-open', text: 'text-open', pin: '#0F7A57', big: 'bg-[#4CC994]' },
  closed: { label: 'مغلق', pill: 'bg-closed text-white', tint: 'bg-closed-tint text-closed', text: 'text-closed', pin: '#C9512A', big: 'bg-[#F08A5D]' },
  break: { label: 'استراحة', pill: 'bg-brk-tint text-[#6B4E0C]', tint: 'bg-brk-tint text-brk-text', text: 'text-brk-text', pin: '#D9A21B', big: 'bg-[#F2C14E]' },
}

const ICONS: Record<string, LucideIcon> = {
  بقالة: ShoppingBasket,
  صيدلية: Pill,
  مخبزة: Croissant,
  مكتبة: BookOpen,
  ملحمة: Beef,
  مقهى: Coffee,
  'خضر وفواكه': Carrot,
}

export function ShopIcon({ shop, size = 48 }: { shop: Shop; size?: number }) {
  const Icon = ICONS[shop.category] ?? ShoppingBasket
  return (
    <span className={`flex flex-none items-center justify-center rounded-[14px] ${STATUS[shop.status].tint}`} style={{ width: size, height: size }}>
      <Icon size={size / 2} strokeWidth={2} aria-hidden />
    </span>
  )
}

export function StatusPill({ status, className = '' }: { status: Status; className?: string }) {
  return <span key={status} className={`flex-none animate-pop rounded-full px-3 py-1 text-[13px] font-bold ${STATUS[status].pill} ${className}`}>{STATUS[status].label}</span>
}

export function ShopRow({ shop, i = 0 }: { shop: Shop; i?: number }) {
  return (
    <Link
      to={`/shop/${shop.id}`}
      style={{ '--i': i } as CSSProperties}
      className="stagger flex animate-rise items-center gap-3 rounded-[18px] border border-line bg-white p-3.5 active:bg-paper"
    >
      <ShopIcon shop={shop} />
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate text-[17px] font-bold">{shop.name}</span>
        <span className="text-[13px] text-muted">
          {shop.category} · {shop.distance}
        </span>
        <span className={`text-[13px] font-bold ${STATUS[shop.status].text}`}>{shop.onDuty && shop.status === 'open' ? 'مناوبة الليلة' : shop.next}</span>
      </span>
      <StatusPill status={shop.status} />
    </Link>
  )
}

export function BackButton({ to, className = 'bg-white border border-line' }: { to?: string; className?: string }) {
  const navigate = useNavigate()
  return (
    <button
      type="button"
      aria-label="رجوع"
      onClick={() => (to ? navigate(to) : history.length > 1 ? navigate(-1) : navigate('/'))}
      className={`flex size-11 flex-none items-center justify-center rounded-[14px] ${className}`}
    >
      <ChevronRight size={22} aria-hidden />
    </button>
  )
}

export function IconButton({ label, onClick, children, className = '' }: { label: string; onClick?: () => void; children: ReactNode; className?: string }) {
  return (
    <button type="button" aria-label={label} onClick={onClick} className={`flex size-11 flex-none items-center justify-center rounded-[14px] border border-line bg-white ${className}`}>
      {children}
    </button>
  )
}

/** Fake illustrated map. Coordinates are % of the area so HTML pins line up with it. */
export function MapArt({ children, route }: { children?: ReactNode; route?: { x: number; y: number } }) {
  const road = { stroke: '#fff', vectorEffect: 'non-scaling-stroke' as const, fill: 'none' }
  return (
    <div className="absolute inset-0 bg-mapbg">
      <svg className="absolute inset-0 size-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
        <rect x="6" y="14" width="26" height="14" rx="2" fill="#CFE0D5" />
        <rect x="58" y="44" width="30" height="12" rx="2" fill="#CFE0D5" />
        <rect x="8" y="56" width="18" height="10" rx="2" fill="#E8E2D2" />
        <rect x="70" y="70" width="22" height="18" rx="2" fill="#E8E2D2" />
        <rect x="36" y="84" width="16" height="10" rx="2" fill="#CFE0D5" />
        <path d="M-2 38 L102 32" {...road} strokeWidth={16} />
        <path d="M-2 72 L102 77" {...road} strokeWidth={12} />
        <path d="M44 -2 L54 102" {...road} strokeWidth={14} />
        <path d="M85 -2 L77 102" {...road} strokeWidth={8} />
        <path d="M15 -2 L23 102" {...road} strokeWidth={7} />
        {route && (
          <path
            d={`M${USER_POS.x} ${USER_POS.y} L${USER_POS.x} ${route.y} L${route.x} ${route.y}`}
            stroke="#2F6FD6"
            strokeWidth={5}
            strokeDasharray="2 10"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            fill="none"
          />
        )}
      </svg>
      <span className="absolute size-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-open/12" style={{ left: `${USER_POS.x}%`, top: `${USER_POS.y}%` }} />
      <span
        aria-label="موقعك"
        className="absolute size-[18px] -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white bg-[#2F6FD6] shadow"
        style={{ left: `${USER_POS.x}%`, top: `${USER_POS.y}%` }}
      />
      {children}
    </div>
  )
}

export function Toast() {
  const msg = useStore((s) => s.toastMsg)
  if (!msg) return null
  return (
    <div role="status" className="pointer-events-none absolute inset-x-4 bottom-28 z-50 flex justify-center">
      <span key={msg} className="animate-rise rounded-2xl bg-ink px-5 py-3 text-center text-[15px] font-bold text-paper shadow-lg">{msg}</span>
    </div>
  )
}

export function Title({ children }: { children: ReactNode }) {
  return <h1 className="font-head text-2xl leading-tight font-black">{children}</h1>
}
