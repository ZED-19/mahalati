import { Heart, List, MapPin, MessageSquare, Navigation, Search, Settings } from 'lucide-react'
import { useMemo, useState, type CSSProperties } from 'react'
import { Link, useSearchParams } from 'react-router'
import { MapArt, ShopIcon, ShopRow, STATUS, StatusPill, Title } from '../components/ui'
import { useStore } from '../store'

export function Home() {
  const shops = useStore((s) => s.shops)
  const [query, setQuery] = useState('')
  const [cat, setCat] = useState('الكل')
  const [openOnly, setOpenOnly] = useState(false)
  const cats = useMemo(() => ['الكل', ...new Set(shops.map((s) => s.category))], [shops])
  const list = shops.filter((s) => s.name.includes(query.trim()) && (cat === 'الكل' || s.category === cat) && (!openOnly || s.status === 'open'))

  return (
    <div className="flex flex-col gap-3.5 px-5 pt-5 pb-4">
      <header className="flex items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <span className="font-head text-[28px] leading-tight font-black text-open-dark">محلاتي</span>
          <span className="flex items-center gap-1 text-sm text-muted">
            <MapPin size={16} aria-hidden />
            موقعك الحالي
          </span>
        </div>
        <Link to="/settings" aria-label="الإعدادات" className="flex size-11 items-center justify-center rounded-[14px] border border-line bg-white">
          <Settings size={22} aria-hidden />
        </Link>
      </header>

      <label className="flex h-[50px] items-center gap-2.5 rounded-2xl border border-line bg-white px-4 text-faint">
        <Search size={20} aria-hidden />
        <span className="sr-only">بحث</span>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ابحث عن محل"
          className="min-w-0 flex-1 bg-transparent text-base text-ink outline-none"
        />
      </label>

      <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5">
        {cats.map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={cat === c}
            onClick={() => setCat(c)}
            className={`h-[38px] flex-none rounded-full px-4 text-[15px] transition-colors ${cat === c ? 'bg-ink font-bold text-paper' : 'border border-line bg-white'}`}
          >
            {c}
          </button>
        ))}
      </div>

      <Link to="/map" className="relative block h-28 flex-none overflow-hidden rounded-[18px] border border-[#CFDDD4]">
        <MapArt>
          {shops.map((s) => (
            <span
              key={s.id}
              className="absolute size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-white"
              style={{ left: `${s.x}%`, top: `${s.y}%`, background: STATUS[s.status].pin }}
            />
          ))}
        </MapArt>
        <span className="absolute bottom-3 left-3 flex h-[34px] items-center rounded-full bg-ink px-3.5 text-sm font-bold text-paper">افتح الخريطة</span>
      </Link>

      <div className="flex items-center justify-between">
        <h2 className="font-head text-lg font-extrabold">قريب منك</h2>
        <label className="flex min-h-11 items-center gap-2 text-sm text-muted">
          مفتوح الآن فقط
          <input type="checkbox" role="switch" checked={openOnly} onChange={(e) => setOpenOnly(e.target.checked)} className="peer sr-only" />
          <span className="relative h-7 w-12 rounded-full bg-line transition peer-checked:bg-open peer-focus-visible:ring-2 peer-focus-visible:ring-open after:absolute after:top-1 after:right-1 after:size-5 after:rounded-full after:bg-white after:shadow after:transition peer-checked:after:-translate-x-5" />
        </label>
      </div>

      <div className="flex flex-col gap-2.5">
        {list.map((s, i) => (
          <ShopRow key={s.id} shop={s} i={i} />
        ))}
        {list.length === 0 && <p className="py-8 text-center text-muted">لا توجد محلات بهذا البحث</p>}
      </div>
    </div>
  )
}

export function MapScreen() {
  const shops = useStore((s) => s.shops)
  const [params, setParams] = useSearchParams()
  const [query, setQuery] = useState('')
  const selectedId = params.get('shop')
  const showRoute = params.get('route') === '1'
  const selected = shops.find((s) => s.id === selectedId)
  const select = (id: string | null, route = false) => setParams(id ? { shop: id, ...(route ? { route: '1' } : {}) } : {}, { replace: true })
  const visible = shops.filter((s) => s.name.includes(query.trim()))

  return (
    <div className="relative min-h-[560px] flex-1">
      <MapArt route={showRoute && selected ? selected : undefined}>
        <button type="button" aria-label="إلغاء التحديد" className="absolute inset-0 cursor-default" onClick={() => select(null)} />
        {visible.map((s) => {
          const on = s.id === selectedId
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => select(s.id)}
              className={`absolute flex -translate-x-1/2 -translate-y-full flex-col items-center gap-1 ${on ? 'z-20' : 'z-10'}`}
              style={{ left: `${s.x}%`, top: `${s.y}%` }}
            >
              <span className={`rounded-[10px] px-2.5 py-1 text-[13px] font-bold whitespace-nowrap shadow-md transition-colors ${on ? 'bg-ink text-paper' : 'bg-white'}`}>
                {s.name} · {STATUS[s.status].label}
              </span>
              <span className={`rounded-full border-white transition-all duration-200 ${on ? 'size-[30px] border-[5px]' : 'size-[22px] border-4'}`} style={{ background: STATUS[s.status].pin }} />
            </button>
          )
        })}
      </MapArt>

      <div className="absolute inset-x-4 top-4 z-30 flex gap-2.5">
        <label className="flex h-[50px] min-w-0 flex-1 items-center gap-2.5 rounded-2xl bg-white px-4 text-faint shadow-lg">
          <Search size={20} aria-hidden />
          <span className="sr-only">بحث</span>
          <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="ابحث في الخريطة" className="min-w-0 flex-1 bg-transparent text-base text-ink outline-none" />
        </label>
        <Link to="/" className="flex h-[50px] flex-none items-center gap-1.5 rounded-2xl bg-ink px-4 text-[15px] font-bold text-paper">
          <List size={20} aria-hidden />
          القائمة
        </Link>
      </div>

      {selected && (
        <div key={selected.id} className="absolute inset-x-4 bottom-4 z-30 flex animate-sheet flex-col gap-3 rounded-[22px] bg-white p-4 shadow-xl">
          <div className="flex items-center gap-3">
            <ShopIcon shop={selected} size={52} />
            <span className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="font-head text-[19px] font-extrabold">{selected.name}</span>
              <span className="text-sm text-muted">
                {selected.distance} · {selected.next}
              </span>
            </span>
            <StatusPill status={selected.status} />
          </div>
          {showRoute && <p className="animate-rise text-sm font-bold text-[#2F6FD6]">الطريق مرسوم على الخريطة · حوالي 6 دقائق مشيًا</p>}
          <div className="flex gap-2.5">
            <Link to={`/shop/${selected.id}`} className="flex h-[46px] flex-1 items-center justify-center rounded-[14px] bg-open font-bold text-white">
              التفاصيل
            </Link>
            <button type="button" onClick={() => select(selected.id, !showRoute)} className="flex h-[46px] flex-1 items-center justify-center gap-1.5 rounded-[14px] bg-paper font-bold">
              <Navigation size={18} aria-hidden />
              {showRoute ? 'إخفاء الطريق' : 'الاتجاهات'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export function Favorites() {
  const shops = useStore((s) => s.shops)
  const favorites = useStore((s) => s.favorites)
  const favs = shops.filter((x) => favorites.includes(x.id))
  return (
    <div className="flex flex-col gap-3.5 px-5 pt-5 pb-4">
      <Title>المفضلة</Title>
      {favs.map((s, i) => (
        <ShopRow key={s.id} shop={s} i={i} />
      ))}
      {favs.length === 0 && (
        <div className="flex flex-col items-center gap-2 py-16 text-center text-muted">
          <Heart size={36} aria-hidden />
          <p>لم تضف أي محل بعد. اضغط على القلب في صفحة المحل.</p>
        </div>
      )}
    </div>
  )
}

export function MyQuestions() {
  const questions = useStore((s) => s.questions)
  const shops = useStore((s) => s.shops)
  const mine = questions.filter((q) => q.mine).reverse()
  return (
    <div className="flex flex-col gap-3.5 px-5 pt-5 pb-4">
      <Title>أسئلتي</Title>
      {mine.map((q, i) => {
        const shop = shops.find((s) => s.id === q.shopId)!
        return (
          <Link
            key={q.id}
            to={`/shop/${shop.id}/ask`}
            style={{ '--i': i } as CSSProperties}
            className="stagger flex animate-rise flex-col gap-2 rounded-[18px] border border-line bg-white p-4">
            <span className="flex items-center justify-between text-[13px] text-faint">
              <span>{shop.name}</span>
              <span>{q.ago}</span>
            </span>
            <span className="font-head text-[17px] font-extrabold">{q.text}</span>
            <AnswerBadge answer={q.answer} />
            {q.note && <span className="text-[15px] text-muted">{q.note}</span>}
          </Link>
        )
      })}
      {mine.length === 0 && (
        <div className="flex flex-col items-center gap-2 py-16 text-center text-muted">
          <MessageSquare size={36} aria-hidden />
          <p>لم تسأل أي محل بعد.</p>
        </div>
      )}
    </div>
  )
}

export function AnswerBadge({ answer }: { answer: 'yes' | 'no' | null }) {
  if (answer === 'yes') return <span className="self-start rounded-full bg-open-tint px-3 py-1 text-sm font-bold text-open-dark">متوفر</span>
  if (answer === 'no') return <span className="self-start rounded-full bg-closed-tint px-3 py-1 text-sm font-bold text-[#9E3D1D]">غير متوفر</span>
  return <span className="self-start rounded-full bg-brk-tint px-3 py-1 text-sm font-bold text-[#6B4E0C]">في انتظار الرد</span>
}
