import { Download, Share, SquarePlus, X } from 'lucide-react'
import { useEffect, useState } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
}

// Captured at module load: Chrome can fire it before React mounts.
let deferred: BeforeInstallPromptEvent | null = null
const listeners = new Set<() => void>()
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault()
  deferred = e as BeforeInstallPromptEvent
  listeners.forEach((l) => l())
})
window.addEventListener('appinstalled', () => {
  deferred = null
  listeners.forEach((l) => l())
})

const KEY = 'mahalati-install-dismissed'
const isStandalone = () => matchMedia('(display-mode: standalone)').matches || (navigator as { standalone?: boolean }).standalone === true
const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
const wasDismissed = () => {
  try {
    return localStorage.getItem(KEY) === '1'
  } catch {
    return false
  }
}

export function InstallBanner() {
  const [, rerender] = useState(0)
  const [hidden, setHidden] = useState(() => isStandalone() || wasDismissed())

  useEffect(() => {
    const l = () => rerender((n) => n + 1)
    listeners.add(l)
    return () => void listeners.delete(l)
  }, [])

  if (hidden || (!deferred && !isIOS)) return null

  const dismiss = () => {
    setHidden(true)
    try {
      localStorage.setItem(KEY, '1')
    } catch {
      /* private mode: banner just comes back next visit */
    }
  }

  const install = async () => {
    await deferred?.prompt()
    deferred = null
    setHidden(true)
  }

  return (
    <div className="mx-4 mt-3 flex items-center gap-3 rounded-[18px] bg-ink p-3 ps-4 text-paper">
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="text-[15px] font-bold">أضف محلاتي إلى شاشتك الرئيسية</span>
        {isIOS ? (
          <span className="flex flex-wrap items-center gap-1 text-[13px] text-[#C9D6CF]">
            اضغط <Share size={15} aria-label="مشاركة" /> ثم «إضافة إلى الشاشة الرئيسية» <SquarePlus size={15} aria-hidden />
          </span>
        ) : (
          <span className="text-[13px] text-[#C9D6CF]">يفتح كتطبيق ويعمل بدون إنترنت</span>
        )}
      </span>
      {!isIOS && (
        <button type="button" onClick={install} className="flex h-11 flex-none items-center gap-1.5 rounded-[14px] bg-[#4CC994] px-4 font-bold text-ink">
          <Download size={18} aria-hidden />
          تثبيت
        </button>
      )}
      <button type="button" onClick={dismiss} aria-label="إغلاق" className="flex size-11 flex-none items-center justify-center rounded-[14px] text-[#C9D6CF]">
        <X size={20} aria-hidden />
      </button>
    </div>
  )
}
