import { CalendarDays, Store, User } from 'lucide-react'
import { useState, type CSSProperties } from 'react'
import { Link, useNavigate } from 'react-router'
import { BackButton, STATUS, Title } from '../components/ui'
import { DAYS, OWNER_SHOP, todayIndex, type Status } from '../data/shops'
import { useShop, useStore } from '../store'

export function OwnerHome() {
  const shop = useShop(OWNER_SHOP)!
  const questions = useStore((s) => s.questions)
  const setStatus = useStore((s) => s.setOwnerStatus)
  const toast = useStore((s) => s.toast)
  const pending = questions.filter((q) => q.shopId === OWNER_SHOP && q.answer === null)
  const today = todayIndex()

  const pick = (k: Status) => {
    setStatus(k)
    toast(`أصبح محلك «${STATUS[k].label}» عند الزبائن`)
  }

  return (
    <div className="flex flex-col gap-4 px-5 pt-5 pb-4">
      <div className="flex flex-col gap-0.5">
        <span className="text-sm text-muted">مرحبا، صاحب المحل</span>
        <Title>{shop.name}</Title>
      </div>

      <section className="flex flex-col items-center gap-4 rounded-3xl bg-ink px-[18px] py-[22px] text-paper">
        <span className="text-[15px] text-[#B9C7C0]">حالة محلّي الآن</span>
        <span key={shop.status} className={`animate-pop rounded-full px-12 py-3 font-head text-[44px] leading-tight font-black text-ink ${STATUS[shop.status].big}`}>{STATUS[shop.status].label}</span>
        <span className="text-center text-sm text-[#C9D6CF]">
          يرى الزبائن: {STATUS[shop.status].label} · {shop.next}
        </span>
        <div className="flex gap-2 self-stretch rounded-[18px] bg-[#1F332C] p-1.5" role="group" aria-label="تغيير الحالة">
          {(['open', 'break', 'closed'] as const).map((k) => (
            <button
              key={k}
              type="button"
              aria-pressed={shop.status === k}
              onClick={() => pick(k)}
              className={`h-12 flex-1 rounded-[14px] text-base font-bold transition-colors duration-200 ${shop.status === k ? `${STATUS[k].big} text-ink` : 'text-[#C9D6CF]'}`}
            >
              {STATUS[k].label}
            </button>
          ))}
        </div>
      </section>

      <div className="flex gap-3">
        <Link to="/owner/inbox" className="flex flex-1 flex-col gap-1 rounded-[18px] border border-line bg-white p-4">
          <span key={pending.length} className="animate-pop font-head text-3xl leading-tight font-black text-closed">{pending.length}</span>
          <span className="text-sm font-bold">أسئلة تنتظر ردك</span>
        </Link>
        <div className="flex flex-1 flex-col gap-1 rounded-[18px] border border-line bg-white p-4">
          <span className="font-head text-3xl leading-tight font-black text-open">48</span>
          <span className="text-sm font-bold">زيارة لصفحتك اليوم</span>
        </div>
      </div>

      <section className="flex flex-col gap-2.5 rounded-[18px] border border-line bg-white px-[18px] py-4">
        <h2 className="flex items-center gap-2 font-head text-base font-extrabold">
          <CalendarDays size={20} className="text-open" aria-hidden />
          جدول اليوم
        </h2>
        <span className="text-[15px] text-muted">
          {DAYS[today]} · {shop.hours[today]}
        </span>
        <span className="text-[13px] text-faint">الحالة تتغيّر تلقائيًا حسب الجدول، إلا إذا غيّرتها يدويًا</span>
      </section>

      <section className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h2 className="font-head text-base font-extrabold">آخر الأسئلة</h2>
          <Link to="/owner/inbox" className="flex min-h-11 items-center text-sm font-bold text-open">
            عرض الكل
          </Link>
        </div>
        {pending.slice(-3).reverse().map((q) => (
          <Link key={q.id} to="/owner/inbox" className="flex items-center gap-2.5 rounded-2xl border border-line bg-white px-3.5 py-3">
            <span className="size-2.5 flex-none rounded-full bg-closed" />
            <span className="flex-1 text-[15px]">{q.text}</span>
            <span className="text-xs text-faint">{q.ago}</span>
          </Link>
        ))}
        {pending.length === 0 && <p className="rounded-2xl border border-line bg-white px-3.5 py-3 text-[15px] text-muted">لا توجد أسئلة جديدة</p>}
      </section>
    </div>
  )
}

export function Inbox() {
  const all = useStore((s) => s.questions)
  const answer = useStore((s) => s.answer)
  const [tab, setTab] = useState<'pending' | 'done'>('pending')
  // ponytail: cards answered in this visit stay in the pending tab so "undo" is reachable
  const [touched, setTouched] = useState<string[]>([])
  const mine = all.filter((q) => q.shopId === OWNER_SHOP).reverse()
  const pendingCount = mine.filter((q) => q.answer === null).length
  const list = mine.filter((q) => (tab === 'pending' ? q.answer === null || touched.includes(q.id) : q.answer !== null))

  const reply = (id: string, a: 'yes' | 'no' | null) => {
    answer(id, a)
    setTouched((t) => (t.includes(id) ? t : [...t, id]))
  }
  const tabCls = (on: boolean) => `h-11 rounded-full px-4 text-sm transition-colors ${on ? 'bg-ink font-bold text-paper' : 'border border-line bg-white'}`

  return (
    <div className="flex flex-col gap-3.5 px-5 pt-5 pb-4">
      <div className="flex items-center gap-3">
        <BackButton to="/owner" />
        <Title>أسئلة الزبائن</Title>
      </div>
      <div className="flex gap-2">
        <button type="button" aria-pressed={tab === 'pending'} onClick={() => setTab('pending')} className={tabCls(tab === 'pending')}>
          تنتظر الرد · {pendingCount}
        </button>
        <button type="button" aria-pressed={tab === 'done'} onClick={() => setTab('done')} className={tabCls(tab === 'done')}>
          تم الرد
        </button>
      </div>

      {list.map((q, i) => (
        <article
          key={q.id}
          style={{ '--i': i } as CSSProperties}
          className={`stagger flex animate-rise flex-col gap-3 rounded-[20px] bg-white p-4 transition-colors ${q.answer === null ? 'border-2 border-open' : 'border border-line'}`}>
          <div className="flex items-center justify-between text-[13px] text-faint">
            <span>زبون · {q.from}</span>
            <span className="text-xs">{q.ago}</span>
          </div>
          <span className="font-head text-xl font-extrabold">{q.text}</span>
          {q.answer === null ? (
            <div className="flex gap-2">
              <button type="button" onClick={() => reply(q.id, 'yes')} className="h-[50px] flex-1 rounded-[14px] bg-open text-base font-bold text-white">
                متوفر
              </button>
              <button type="button" onClick={() => reply(q.id, 'no')} className="h-[50px] flex-1 rounded-[14px] bg-closed text-base font-bold text-white">
                غير متوفر
              </button>
            </div>
          ) : (
            <div className="flex animate-pop items-center justify-between rounded-[14px] bg-[#EEF3EF] py-1 ps-3.5 pe-1">
              <span className="text-[15px] font-bold text-open-dark">تم إرسال ردك: {q.answer === 'yes' ? 'متوفر' : 'غير متوفر'}</span>
              <button type="button" onClick={() => reply(q.id, null)} className="h-11 rounded-[10px] px-3 text-sm font-bold text-open">
                تراجع
              </button>
            </div>
          )}
        </article>
      ))}
      {list.length === 0 && <p className="py-12 text-center text-muted">{tab === 'pending' ? 'رددت على كل الأسئلة' : 'لا توجد ردود بعد'}</p>}
    </div>
  )
}

export function SettingsScreen() {
  const role = useStore((s) => s.role)
  const setRole = useStore((s) => s.setRole)
  const navigate = useNavigate()
  const choose = (r: typeof role) => {
    setRole(r)
    navigate(r === 'owner' ? '/owner' : '/')
  }
  const opts = [
    { r: 'customer' as const, label: 'زبون', hint: 'أبحث عن المحلات المفتوحة', Icon: User },
    { r: 'owner' as const, label: 'صاحب محل', hint: 'بقالة الأمل', Icon: Store },
  ]

  return (
    <div className="flex flex-col gap-4 px-5 pt-5 pb-4">
      <div className="flex items-center gap-3">
        {role === 'customer' && <BackButton to="/" />}
        <Title>الإعدادات</Title>
      </div>
      <section className="flex flex-col gap-3 rounded-[20px] border border-line bg-white p-4">
        <h2 className="font-head text-base font-extrabold">استعمل التطبيق كـ</h2>
        <div className="flex gap-1.5 rounded-[18px] bg-paper p-1.5" role="radiogroup" aria-label="نوع الحساب">
          {opts.map(({ r, label, hint, Icon }) => (
            <button
              key={r}
              type="button"
              role="radio"
              aria-checked={role === r}
              onClick={() => choose(r)}
              className={`flex min-h-[72px] flex-1 flex-col items-center justify-center gap-1 rounded-[14px] px-2 transition-colors duration-200 ${role === r ? 'bg-ink text-paper' : 'text-ink'}`}
            >
              <Icon size={22} aria-hidden />
              <span className="font-bold">{label}</span>
              <span className={`text-xs ${role === r ? 'text-[#C9D6CF]' : 'text-muted'}`}>{hint}</span>
            </button>
          ))}
        </div>
        <p className="text-[13px] text-faint">نسخة تجريبية: كل البيانات وهمية وتعود لحالتها الأولى عند إعادة تحميل الصفحة.</p>
      </section>
    </div>
  )
}
