import { create } from 'zustand'
import { OWNER_SHOP, questions, shops, type Question, type Shop, type Status } from './data/shops'

// What customers see after the owner picks a status by hand.
export const OWNER_NEXT: Record<Status, string> = {
  open: 'يغلق على 21:00',
  break: 'يعود بعد 30 دقيقة',
  closed: 'يفتح غدًا على 08:00',
}

interface Store {
  role: 'customer' | 'owner'
  shops: Shop[]
  questions: Question[]
  favorites: string[]
  toastMsg: string | null
  setRole: (role: Store['role']) => void
  toggleFav: (id: string) => void
  ask: (shopId: string, text: string) => void
  answer: (id: string, answer: Question['answer']) => void
  setOwnerStatus: (status: Status) => void
  toast: (msg: string) => void
}

let toastTimer: ReturnType<typeof setTimeout>

// ponytail: memory only, a reload resets the demo
export const useStore = create<Store>((set, get) => ({
  role: 'customer',
  shops,
  questions,
  favorites: ['nour'],
  toastMsg: null,
  setRole: (role) => set({ role }),
  toggleFav: (id) => {
    const on = get().favorites.includes(id)
    set({ favorites: on ? get().favorites.filter((f) => f !== id) : [...get().favorites, id] })
    get().toast(on ? 'أُزيل من المفضلة' : 'أُضيف إلى المفضلة')
  },
  ask: (shopId, text) => {
    const time = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
    const q: Question = { id: 'q' + Date.now(), shopId, text, time, ago: 'الآن', from: 'على بعد 350 م', mine: true, answer: null }
    set({ questions: [...get().questions, q] })
  },
  answer: (id, answer) =>
    set({
      questions: get().questions.map((q) =>
        q.id === id ? { ...q, answer, note: answer === 'yes' ? 'متوفر، مرحبا بيك' : answer === 'no' ? 'غير متوفر حاليًا' : undefined } : q,
      ),
    }),
  setOwnerStatus: (status) =>
    set({ shops: get().shops.map((s) => (s.id === OWNER_SHOP ? { ...s, status, next: OWNER_NEXT[status], updated: 'الآن' } : s)) }),
  toast: (msg) => {
    clearTimeout(toastTimer)
    set({ toastMsg: msg })
    toastTimer = setTimeout(() => set({ toastMsg: null }), 2600)
  },
}))

export const useShop = (id?: string) => useStore((s) => s.shops.find((x) => x.id === id))
