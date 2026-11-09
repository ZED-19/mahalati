import { Bell, Check, Clock, Heart, MessageSquare, Navigation, Phone, SendHorizontal } from 'lucide-react'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link, Navigate, useParams } from 'react-router'
import { BackButton, IconButton, STATUS } from '../components/ui'
import { DAYS, todayIndex } from '../data/shops'
import { useShop, useStore } from '../store'
import { AnswerBadge } from './customer'

export function ShopPage() {
  const { id } = useParams()
  const shop = useShop(id)
  const fav = useStore((s) => !!id && s.favorites.includes(id))
  const toggleFav = useStore((s) => s.toggleFav)
  const toast = useStore((s) => s.toast)
  if (!shop) return <Navigate to="/" replace />
  const st = STATUS[shop.status]
  const today = todayIndex()
  const action = 'flex h-16 flex-1 flex-col items-center justify-center gap-1 rounded-2xl border border-line bg-white text-sm font-bold'

  return (
    <div className="pt-safe flex min-h-0 flex-1 flex-col overflow-y-auto">
      <div className="flex flex-1 flex-col gap-3.5 px-5 pt-4 pb-[max(20px,env(safe-area-inset-bottom))]">
        <div className="flex items-center justify-between">
          <BackButton />
          <span className="text-[15px] text-muted">
            {shop.category} · {shop.distance}
          </span>
          <IconButton label={fav ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'} onClick={() => toggleFav(shop.id)} className="text-closed">
            <Heart size={22} fill={fav ? 'currentColor' : 'none'} aria-hidden />
          </IconButton>
        </div>

        <section className="flex flex-col gap-2.5 rounded-[22px] bg-ink p-5 text-paper">
          <h1 className="font-head text-[26px] leading-tight font-black">{shop.name}</h1>
          <div className="flex flex-wrap items-center gap-3">
            <span className={`rounded-full px-5 py-2 font-head text-xl font-extrabold text-ink ${st.big}`}>{shop.status === 'open' ? 'مفتوح الآن' : st.label}</span>
            <span className="text-base text-[#C9D6CF]">{shop.next}</span>
          </div>
          <span className="flex items-center gap-1.5 text-[13px] text-[#9FB3AA]">
            <Check size={16} aria-hidden />
            حدّثها صاحب المحل {shop.updated}
          </span>
        </section>

        <div className="flex gap-2.5">
          <a href={`tel:${shop.phone}`} className={action}>
            <Phone size={22} className="text-open" aria-hidden />
            اتصال
          </a>
          <Link to={`/map?shop=${shop.id}&route=1`} className={action}>
            <Navigation size={22} className="text-open" aria-hidden />
            الاتجاهات
          </Link>
          <button type="button" onClick={() => toast('سننبّهك عند الفتح')} className={action}>
            <Bell size={22} className="text-open" aria-hidden />
            نبّهني
          </button>
        </div>

        <section className="flex flex-col rounded-[20px] border border-line bg-white px-[18px] py-3.5">
          <h2 className="flex items-center gap-2 pb-1.5 font-head text-[17px] font-extrabold">
            <Clock size={20} className="text-open" aria-hidden />
            أوقات العمل
          </h2>
          {DAYS.map((d, i) =>
            i === today ? (
              <div key={d} className="-mx-2.5 flex justify-between rounded-[10px] bg-open-tint px-2.5 py-[7px] text-[15px] font-bold text-open-dark">
                <span>{d} · اليوم</span>
                <span>{shop.hours[i]}</span>
              </div>
            ) : (
              <div key={d} className="flex justify-between border-b border-[#EFEBE0] py-[7px] text-[15px] last:border-0">
                <span>{d}</span>
                <span className="text-muted">{shop.hours[i]}</span>
              </div>
            ),
          )}
        </section>

        <div className="flex-1" />
        <Link to={`/shop/${shop.id}/ask`} className="flex h-14 flex-none items-center justify-center gap-2.5 rounded-[18px] bg-open font-head text-lg font-extrabold text-white">
          <MessageSquare size={22} aria-hidden />
          اسأل عن منتج
        </Link>
      </div>
    </div>
  )
}

const CHIPS = ['هل هو متوفر؟', 'بكم السعر؟', 'متى يصل؟']

export function AskScreen() {
  const { id } = useParams()
  const shop = useShop(id)
  const questions = useStore((s) => s.questions)
  const ask = useStore((s) => s.ask)
  const [text, setText] = useState('')
  const end = useRef<HTMLDivElement>(null)
  const thread = questions.filter((q) => q.mine && q.shopId === id)

  useEffect(() => {
    end.current?.scrollIntoView({ behavior: 'smooth' })
  }, [thread.length])

  if (!shop) return <Navigate to="/" replace />

  const send = (e: FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return
    ask(shop.id, text.trim())
    setText('')
  }
  const reply = shop.status === 'open' ? 'يرد عادة خلال دقائق' : 'سيرد عند الفتح'

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="pt-safe flex-none border-b border-line bg-white">
        <div className="flex items-center gap-3 px-5 py-4">
          <BackButton className="bg-paper" />
          <span className="flex flex-col gap-0.5">
            <span className="font-head text-lg font-extrabold">{shop.name}</span>
            <span className={`text-[13px] font-bold ${STATUS[shop.status].text}`}>
              {STATUS[shop.status].label} · {reply}
            </span>
          </span>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col gap-3.5 overflow-y-auto px-4 py-[18px]">
        <span className="self-center rounded-full bg-[#E9E4D8] px-3 py-1 text-xs text-muted">اليوم</span>
        {thread.length === 0 && <p className="py-6 text-center text-muted">اسأل {shop.name} إن كان المنتج متوفرًا قبل أن تتنقّل.</p>}
        {thread.map((q) => (
          <div key={q.id} className="flex flex-col gap-3.5">
            <div className="max-w-[78%] self-end rounded-[18px_18px_18px_4px] bg-ink px-3.5 py-3 text-base leading-normal text-paper">
              {q.text}
              <span className="flex items-center gap-1 pt-1 text-[11px] text-[#9FB3AA]">
                {q.answer === null ? (
                  <>
                    <Clock size={12} aria-hidden />
                    في انتظار الرد
                  </>
                ) : (
                  q.time
                )}
              </span>
            </div>
            {q.answer !== null && (
              <div className="flex max-w-[78%] flex-col gap-2 self-start rounded-[18px_18px_4px_18px] border border-line bg-white px-3.5 py-3">
                <AnswerBadge answer={q.answer} />
                {q.note && <span className="text-base leading-normal">{q.note}</span>}
              </div>
            )}
          </div>
        ))}
        <div ref={end} />
      </div>

      <form onSubmit={send} className="pb-safe flex-none border-t border-line bg-white">
        <div className="flex flex-col gap-2.5 px-4 pt-3 pb-4">
          <div className="no-scrollbar flex gap-2 overflow-x-auto">
            {CHIPS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setText((t) => (t.trim() ? `${t.trim()} ${c}` : c))}
                className="h-9 flex-none rounded-full border border-[#CFDDD4] bg-[#EEF3EF] px-3.5 text-sm font-bold text-open-dark"
              >
                {c}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2.5">
            <label className="flex h-12 min-w-0 flex-1 items-center rounded-2xl bg-paper px-4">
              <span className="sr-only">سؤالك</span>
              <input value={text} onChange={(e) => setText(e.target.value)} placeholder="اكتب اسم المنتج أو سؤالك" className="min-w-0 flex-1 bg-transparent text-base outline-none" />
            </label>
            <button type="submit" aria-label="إرسال" disabled={!text.trim()} className="flex size-12 flex-none items-center justify-center rounded-2xl bg-open text-white disabled:opacity-40">
              <SendHorizontal size={22} className="-scale-x-100" aria-hidden />
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
