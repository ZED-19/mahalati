import { Heart, House, Map, MessageSquare, Settings, Store } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router'
import { OWNER_SHOP } from '../data/shops'
import { useStore } from '../store'
import { InstallBanner } from './InstallBanner'
import { Toast } from './ui'

/** Phone-sized column; on a laptop it sits centered on the dark background. */
export function Shell() {
  return (
    <div className="min-h-dvh md:flex md:items-center md:justify-center md:p-6">
      <div dir="rtl" className="relative mx-auto flex h-dvh w-full max-w-[430px] flex-col overflow-hidden bg-paper md:h-[min(calc(100dvh-48px),900px)] md:rounded-[36px] md:shadow-2xl">
        <Outlet />
        <Toast />
      </div>
    </div>
  )
}

const CUSTOMER_TABS = [
  { to: '/', label: 'الرئيسية', Icon: House },
  { to: '/map', label: 'الخريطة', Icon: Map },
  { to: '/favorites', label: 'المفضلة', Icon: Heart },
  { to: '/questions', label: 'أسئلتي', Icon: MessageSquare },
]
const OWNER_TABS = [
  { to: '/owner', label: 'محلي', Icon: Store },
  { to: '/owner/inbox', label: 'الأسئلة', Icon: MessageSquare },
  { to: '/settings', label: 'الإعدادات', Icon: Settings },
]

export function TabsLayout() {
  const role = useStore((s) => s.role)
  const pending = useStore((s) => s.questions.filter((q) => q.shopId === OWNER_SHOP && q.answer === null).length)
  const tabs = role === 'owner' ? OWNER_TABS : CUSTOMER_TABS
  const { pathname } = useLocation()
  const main = useRef<HTMLElement>(null)
  // The scroll area is shared by all tabs: start each screen at the top.
  useEffect(() => {
    main.current?.scrollTo(0, 0)
  }, [pathname])
  return (
    <>
      <main ref={main} className="pt-safe relative flex min-h-0 flex-1 flex-col overflow-y-auto">
        <InstallBanner />
        <div key={pathname} className="flex flex-1 animate-page flex-col">
          <Outlet />
        </div>
      </main>
      <nav className="pb-safe flex-none border-t border-line bg-white">
        <div className="flex h-[68px]">
          {tabs.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              end
              className={({ isActive }) => `relative flex flex-1 flex-col items-center justify-center gap-1 text-xs transition-colors ${isActive ? 'font-bold text-open' : 'text-muted'}`}
            >
              <Icon size={24} strokeWidth={2} aria-hidden />
              {label}
              {to === '/owner/inbox' && pending > 0 && (
                <span key={pending} className="absolute top-2 left-1/2 -translate-x-4 animate-pop rounded-full bg-closed px-1.5 text-[11px] leading-[18px] font-bold text-white">{pending}</span>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  )
}
