import Link from 'next/link'
import { ArrowRight, MessageCircle, ShieldCheck, ListChecks } from 'lucide-react'

const FEATURES = [
  { icon: ListChecks, title: '8 simple steps', text: 'From checking eligibility to getting your ink mark.' },
  { icon: MessageCircle, title: 'AI assistant', text: 'Ask anything about registration, documents, EVMs or election day.' },
  { icon: ShieldCheck, title: 'Strictly neutral', text: 'No parties, no candidates, no opinions — just the process.' },
]

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <div className="h-1.5 flex">
        <div className="flex-1 bg-[#FF9933]" /><div className="flex-1 bg-white" /><div className="flex-1 bg-[#138808]" />
      </div>
      <section className="flex-1 max-w-2xl mx-auto px-5 pt-16 pb-10 text-center">
        <p className="text-5xl mb-5">🗳️</p>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight" style={{ fontFamily: 'Plus Jakarta Sans' }}>
          Your first vote,<br /><span className="text-orange-600">step by step.</span>
        </h1>
        <p className="mt-4 text-gray-600 text-base sm:text-lg">
          A beginner-friendly guide for first-time Indian voters (18–25). Know exactly what to do before and on election day.
        </p>
        <Link href="/guide"
          className="inline-flex items-center gap-2 mt-8 px-6 py-3.5 rounded-2xl text-white font-semibold transition-transform active:scale-95"
          style={{ background: 'linear-gradient(135deg,#FF6B00,#FF8C00)', boxShadow: '0 6px 24px rgba(255,107,0,0.35)' }}>
          Start the guide <ArrowRight size={18} />
        </Link>

        <div className="grid gap-3 sm:grid-cols-3 mt-14 text-left">
          {FEATURES.map(({ icon: Icon, title, text }) => (
            <div key={title} className="card p-4 shadow-sm">
              <Icon size={20} className="text-orange-600 mb-2" />
              <h2 className="font-semibold text-gray-900 text-sm" style={{ fontFamily: 'Plus Jakarta Sans' }}>{title}</h2>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </section>
      <footer className="text-center text-xs text-gray-400 pb-6 px-5">
        Not affiliated with the Election Commission of India · Always verify at{' '}
        <a href="https://voters.eci.gov.in" target="_blank" rel="noopener noreferrer" className="underline">voters.eci.gov.in</a> · Helpline 1950
      </footer>
    </main>
  )
}
