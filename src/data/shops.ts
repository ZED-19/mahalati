export type Status = 'open' | 'closed' | 'break'

export interface Shop {
  id: string
  name: string
  category: string
  distance: string
  status: Status
  next: string
  updated: string
  phone: string
  onDuty?: boolean
  // ponytail: fake map position in % of the map area
  x: number
  y: number
  // Saturday → Friday
  hours: string[]
}

export interface Question {
  id: string
  shopId: string
  text: string
  time: string
  ago: string
  from: string
  mine: boolean
  answer: 'yes' | 'no' | null
  note?: string
}

// Display order of the week, Saturday first.
export const DAYS = ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة']
// JS getDay(): 0 = Sunday → index in DAYS
export const todayIndex = () => (new Date().getDay() + 1) % 7

const week = (normal: string, friday: string) => [normal, normal, normal, normal, normal, normal, friday]

export const OWNER_SHOP = 'amal'
export const USER_POS = { x: 52, y: 46 }

export const shops: Shop[] = [
  { id: 'amal', name: 'بقالة الأمل', category: 'بقالة', distance: '350 م', status: 'open', next: 'يغلق على 21:00', updated: 'منذ 10 دقائق', phone: '0555000001', x: 70, y: 18, hours: week('من 08:00 إلى 21:00', 'من 14:00 إلى 21:00') },
  { id: 'nour', name: 'صيدلية النور', category: 'صيدلية', distance: '800 م', status: 'open', next: 'مناوبة الليلة حتى الصباح', onDuty: true, updated: 'منذ 5 دقائق', phone: '0555000002', x: 25, y: 40, hours: week('من 08:00 إلى 20:00', 'مناوبة 24 ساعة') },
  { id: 'saada', name: 'مخبزة السعادة', category: 'مخبزة', distance: '1.2 كم', status: 'closed', next: 'يفتح غدًا على 05:30', updated: 'منذ ساعة', phone: '0555000003', x: 74, y: 60, hours: week('من 05:30 إلى 13:00', 'مغلق') },
  { id: 'taleb', name: 'مكتبة الطالب', category: 'مكتبة', distance: '1.5 كم', status: 'break', next: 'يعود بعد 20 دقيقة', updated: 'منذ 10 دقائق', phone: '0555000004', x: 40, y: 28, hours: week('من 09:00 إلى 19:00', 'مغلق') },
  { id: 'baraka', name: 'ملحمة البركة', category: 'ملحمة', distance: '600 م', status: 'open', next: 'يغلق على 19:30', updated: 'منذ 20 دقيقة', phone: '0555000005', x: 26, y: 66, hours: week('من 07:30 إلى 19:30', 'من 07:30 إلى 12:00') },
  { id: 'hay', name: 'مقهى الحي', category: 'مقهى', distance: '450 م', status: 'open', next: 'يغلق على 23:00', updated: 'منذ 3 دقائق', phone: '0555000006', x: 64, y: 68, hours: week('من 06:00 إلى 23:00', 'من 14:00 إلى 23:00') },
  { id: 'shifa', name: 'صيدلية الشفاء', category: 'صيدلية', distance: '2.1 كم', status: 'closed', next: 'يفتح غدًا على 08:30', updated: 'منذ ساعتين', phone: '0555000007', x: 76, y: 34, hours: week('من 08:30 إلى 19:00', 'مغلق') },
  { id: 'rabie', name: 'خضر وفواكه الربيع', category: 'خضر وفواكه', distance: '900 م', status: 'break', next: 'يعود بعد 15 دقيقة', updated: 'منذ 15 دقيقة', phone: '0555000008', x: 30, y: 54, hours: week('من 07:00 إلى 20:00', 'من 07:00 إلى 12:00') },
]

export const questions: Question[] = [
  { id: 'q1', shopId: 'amal', text: 'عندكم حليب الأطفال للرضّع؟', time: '18:40', ago: 'منذ ساعة', from: 'على بعد 350 م', mine: true, answer: 'yes', note: 'موجود، مرحبا بيك' },
  { id: 'q2', shopId: 'amal', text: 'والخبز الكامل؟', time: '18:43', ago: 'منذ ساعة', from: 'على بعد 350 م', mine: true, answer: 'no', note: 'يوصل غدوة الصباح' },
  { id: 'q3', shopId: 'nour', text: 'عندكم دواء الحساسية للأطفال؟', time: '17:10', ago: 'منذ ساعتين', from: 'على بعد 800 م', mine: true, answer: 'yes', note: 'متوفر، تعال قبل منتصف الليل' },
  { id: 'q4', shopId: 'amal', text: 'عندكم بطاريات للريموت؟', time: '19:05', ago: 'منذ 15 دقيقة', from: 'على بعد 400 م', mine: false, answer: null },
  { id: 'q5', shopId: 'amal', text: 'عندكم سكر بالكيلو؟', time: '18:20', ago: 'منذ ساعة', from: 'على بعد 2.3 كم', mine: false, answer: null },
]
