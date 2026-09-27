'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronDown, ChevronUp, CheckCircle, Circle, ArrowLeft, ExternalLink, MessageCircle, ChevronRight, ChevronLeft } from 'lucide-react'
import ChatWidget from '@/components/ChatWidget'
import { useSwipe } from '@/hooks/useSwipe'

const STEPS = [
  { id:1, phase:'before', title:'Check your eligibility', description:'You must be an Indian citizen, 18+ years old, and a resident of the constituency.', tip:'Do this first', tipBg:'bg-violet-100', tipText:'text-violet-800', detail:'If you turned 18 before January 1st of the election year, you are eligible. NRIs with Indian passports can also register at their last place of residence.', link:{ label:'Verify on ECI', url:'https://voters.eci.gov.in' }, icon:'✅', accent:'border-l-violet-400', badge:'bg-violet-50 text-violet-700' },
  { id:2, phase:'before', title:'Register to vote', description:"Register on the ECI website using Form 6. You'll need Aadhaar and proof of address.", tip:'Do weeks before', tipBg:'bg-teal-100', tipText:'text-teal-800', detail:'You can register online at voters.eci.gov.in or offline at your local BLO. Form 6 is for new registrations; Form 8 is to update details. Registration deadlines vary by state.', link:{ label:'Register on ECI', url:'https://voters.eci.gov.in' }, icon:'📝', accent:'border-l-teal-400', badge:'bg-teal-50 text-teal-700' },
  { id:3, phase:'before', title:'Get your Voter ID (EPIC card)', description:'After registration your EPIC card will be dispatched. You can also download it digitally.', tip:'Keep it safe', tipBg:'bg-blue-100', tipText:'text-blue-800', detail:"EPIC = Electors Photo Identity Card. If not received, you can use 11 other approved documents: Aadhaar, Passport, Driving License, PAN Card, MNREGA Job Card, Bank Passbook with photo, and more.", link:{ label:'Download e-EPIC', url:'https://www.nvsp.in' }, icon:'🪪', accent:'border-l-blue-400', badge:'bg-blue-50 text-blue-700' },
  { id:4, phase:'before', title:'Find your polling booth', description:'Your polling station is assigned based on your registered address. Find it before election day.', tip:'Know in advance', tipBg:'bg-amber-100', tipText:'text-amber-800', detail:'Your Voter Slip has the polling station address, booth number, and your serial number. You can also check online or call 1950. You can ONLY vote at your assigned booth.', link:{ label:'Find your booth', url:'https://voters.eci.gov.in/search-your-name' }, icon:'📍', accent:'border-l-amber-400', badge:'bg-amber-50 text-amber-700' },
  { id:5, phase:'before', title:'Research candidates & issues', description:'Read about candidates from multiple neutral sources. Vote on what matters most to you.', tip:'Your choice', tipBg:'bg-orange-100', tipText:'text-orange-800', detail:"Candidate assets, education, and criminal records are publicly available on ECI's Candidate Affidavit portal. No one — not family, friends, or employer — can legally force you to vote for anyone.", link:{ label:'View affidavits', url:'https://affidavit.eci.gov.in' }, icon:'🔍', accent:'border-l-orange-400', badge:'bg-orange-50 text-orange-700' },
  { id:6, phase:'election_day', title:'Bring your ID to the booth', description:'Carry your EPIC card or any of the 12 approved documents. Arrive during voting hours (7am–6pm).', tip:'Must carry', tipBg:'bg-green-100', tipText:'text-green-800', detail:'Approved alternatives: Aadhaar, Passport, Driving License, PAN Card, MNREGA Job Card, Service ID with photo, Bank Passbook, Smart card, Pension document, NPR card, or Disability certificate.', link:null, icon:'🪪', accent:'border-l-green-400', badge:'bg-green-50 text-green-700' },
  { id:7, phase:'election_day', title:'Cast your vote on the EVM', description:"Press the blue button next to your candidate's symbol on the EVM. Wait for the beep.", tip:'Private & secret', tipBg:'bg-violet-100', tipText:'text-violet-800', detail:'EVM = Electronic Voting Machine. After pressing, the VVPAT machine shows a slip with your candidate\'s name and symbol for 7 seconds — this confirms your vote. Your vote is completely secret.', link:null, icon:'🖥️', accent:'border-l-violet-400', badge:'bg-violet-50 text-violet-700' },
  { id:8, phase:'election_day', title:"Get your ink mark — you're done!", description:'The officer marks indelible ink on your left index finger. You\'ve cast your first vote!', tip:'You did it!', tipBg:'bg-teal-100', tipText:'text-teal-800', detail:"The ink is indelible and stays for days — it's a proud symbol of civic participation. After your finger is marked, you're free to leave. Results are typically announced 4–6 weeks later.", link:null, icon:'✊', accent:'border-l-teal-400', badge:'bg-teal-50 text-teal-700' },
]

export default function GuidePage() {
  const [completed, setCompleted] = useState<Set<number>>(new Set())
  const [expanded, setExpanded] = useState<number | null>(1)
  const [chatOpen, setChatOpen] = useState(false)
  const [activeStep, setActiveStep] = useState(1)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const progress = Math.round((completed.size / STEPS.length) * 100)

  const toggle = (id: number) => {
    setExpanded(prev => prev === id ? null : id)
    setActiveStep(id)
  }

  const markDone = (id: number, e?: React.MouseEvent) => {
    e?.stopPropagation()
    setCompleted(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id); else next.add(id)
      return next
    })
  }

  // Swipe left/right to navigate steps
  const currentStepIndex = STEPS.findIndex(s => s.id === (expanded ?? 1))
  const swipe = useSwipe({
    onSwipeLeft: () => {
      const next = STEPS[currentStepIndex + 1]
      if (next) { setExpanded(next.id); setActiveStep(next.id) }
    },
    onSwipeRight: () => {
      const prev = STEPS[currentStepIndex - 1]
      if (prev) { setExpanded(prev.id); setActiveStep(prev.id) }
    },
    threshold: 70,
  })

  const beforeSteps = STEPS.filter(s => s.phase === 'before')
  const electionSteps = STEPS.filter(s => s.phase === 'election_day')

  return (
    <div className="min-h-screen bg-gray-50">

      {/* NAV */}
      <nav className="bg-white border-b border-gray-100 sticky top-3 z-40 mx-3 rounded-2xl glass shadow-sm">
        <div className="px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors">
            <ArrowLeft size={16} />
            <span className="font-bold text-gray-900" style={{ fontFamily: 'Plus Jakarta Sans' }}>🗳️ VoteReady</span>
          </Link>
          <button onClick={() => setChatOpen(true)}
            className="flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-xl transition-all active:scale-95"
            style={{ background: 'linear-gradient(135deg,#FF6B00,#FF8C00)', color: 'white', boxShadow: '0 3px 10px rgba(255,107,0,0.3)' }}>
            <MessageCircle size={14} /> Ask AI
          </button>
        </div>
        {/* Progress */}
        <div className="mx-4 mb-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-gray-400 font-medium">
              {completed.size === 0 ? 'Check off steps as you complete them'
                : completed.size === STEPS.length ? '🎉 All done! You\'re ready to vote.'
                : `${completed.size} of ${STEPS.length} steps done`}
            </span>
            <span className="text-xs font-bold text-orange-600">{progress}%</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="progress-fill h-1.5" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-6" {...swipe}>

        {/* Swipe hint */}
        <p className="sm:hidden text-center text-xs text-gray-400 mb-4">← Swipe left/right to navigate steps →</p>

        {/* BEFORE ELECTION DAY */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Before election day</span>
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 font-medium">{beforeSteps.filter(s => completed.has(s.id)).length}/{beforeSteps.length}</span>
          </div>
          <div className="space-y-2.5 stagger">
            {beforeSteps.map(step => (
              <StepCard key={step.id} step={step}
                expanded={expanded === step.id}
                completed={completed.has(step.id)}
                onToggle={() => toggle(step.id)}
                onMark={(e) => markDone(step.id, e)}
                onAsk={() => { setActiveStep(step.id); setChatOpen(true) }}
              />
            ))}
          </div>
        </div>

        {/* ELECTION DAY */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-bold text-orange-500 uppercase tracking-widest">On election day</span>
            <div className="flex-1 h-px bg-orange-100" />
            <span className="text-xs text-gray-400 font-medium">{electionSteps.filter(s => completed.has(s.id)).length}/{electionSteps.length}</span>
          </div>
          <div className="space-y-2.5 stagger">
            {electionSteps.map(step => (
              <StepCard key={step.id} step={step}
                expanded={expanded === step.id}
                completed={completed.has(step.id)}
                onToggle={() => toggle(step.id)}
                onMark={(e) => markDone(step.id, e)}
                onAsk={() => { setActiveStep(step.id); setChatOpen(true) }}
              />
            ))}
          </div>
        </div>

        {/* QUICK LINKS */}
        <div className="card p-5" style={{ background: 'linear-gradient(135deg,#FFF4ED,#FFF8F5)', borderColor: '#FFE0CC' }}>
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2" style={{ fontFamily: 'Plus Jakarta Sans' }}>
            🔗 Official links
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {[
              { label: 'ECI Official Website', url: 'https://voters.eci.gov.in' },
              { label: 'Register to Vote (Form 6)', url: 'https://voters.eci.gov.in' },
              { label: 'Download e-EPIC card', url: 'https://www.nvsp.in' },
              { label: 'Candidate Affidavits', url: 'https://affidavit.eci.gov.in' },
            ].map(l => (
              <a key={l.label} href={l.url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-orange-700 hover:text-orange-900 font-medium group">
                <ExternalLink size={12} className="flex-shrink-0 group-hover:scale-110 transition-transform" />
                {l.label}
              </a>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-orange-200 flex items-center gap-3">
            <span className="text-2xl">📞</span>
            <div>
              <p className="font-bold text-gray-900" style={{ fontFamily: 'Plus Jakarta Sans' }}>Voter Helpline: 1950</p>
              <p className="text-xs text-gray-500">Free · Available in multiple languages</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat widget */}
      <ChatWidget isOpen={chatOpen} onClose={() => setChatOpen(false)} currentStep={activeStep} />

      {/* FAB */}
      {!chatOpen && (
        <button onClick={() => setChatOpen(true)}
          className="fixed bottom-6 right-5 w-14 h-14 rounded-2xl text-white shadow-xl flex items-center justify-center transition-all duration-200 active:scale-90 z-50 animate-fade-up"
          style={{ background: 'linear-gradient(135deg,#FF6B00,#FF8C00)', boxShadow: '0 6px 24px rgba(255,107,0,0.45)' }}
          aria-label="Open AI assistant">
          <MessageCircle size={22} />
        </button>
      )}
    </div>
  )
}

function StepCard({ step, expanded, completed, onToggle, onMark, onAsk }: {
  step: typeof STEPS[0]; expanded: boolean; completed: boolean
  onToggle: () => void; onMark: (e: React.MouseEvent) => void; onAsk: () => void
}) {
  return (
    <div className={`bg-white rounded-2xl border-l-4 ${step.accent} border border-gray-100 shadow-sm transition-all duration-200 animate-fade-up ${completed ? 'opacity-60' : ''}`}>
      <div className="flex items-start gap-3 p-4 cursor-pointer select-none" onClick={onToggle}>
        <button onClick={onMark} className="mt-0.5 flex-shrink-0 active:scale-90 transition-transform">
          {completed
            ? <CheckCircle size={21} className="text-green-500 animate-ink-pop" />
            : <Circle size={21} className="text-gray-300 hover:text-gray-400 transition-colors" />}
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-1.5 mb-1">
            <span>{step.icon}</span>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${step.badge}`}>Step {step.id}</span>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${step.tipBg} ${step.tipText}`}>{step.tip}</span>
          </div>
          <h3 className={`font-semibold text-gray-900 text-sm leading-snug ${completed ? 'line-through text-gray-400' : ''}`} style={{ fontFamily: 'Plus Jakarta Sans' }}>
            {step.title}
          </h3>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">{step.description}</p>
        </div>
        <div className="flex-shrink-0 text-gray-400 mt-1">
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 animate-fade-up">
          <div className="border-t border-gray-100 pt-3">
            <p className="text-sm text-gray-600 leading-relaxed mb-3">{step.detail}</p>
            <div className="flex flex-wrap gap-2">
              {step.link && (
                <a href={step.link.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs font-semibold text-orange-600 hover:text-orange-800 bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-full transition-colors">
                  <ExternalLink size={10} /> {step.link.label}
                </a>
              )}
              <button onClick={onAsk}
                className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-full transition-colors">
                <MessageCircle size={10} /> Ask AI
              </button>
              {!completed && (
                <button onClick={onMark}
                  className="flex items-center gap-1.5 text-xs font-semibold text-green-600 hover:text-green-800 bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-full transition-colors ml-auto">
                  <CheckCircle size={10} /> Mark done
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}