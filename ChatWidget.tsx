'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import { X, Send, RotateCcw, Bot, ChevronDown } from 'lucide-react'
import { useBottomSheet } from '@/hooks/useBottomSheet'
import { useSwipe } from '@/hooks/useSwipe'

interface Message { role: 'user' | 'assistant'; content: string }

const STEP_PROMPTS: Record<number, string> = {
  1: 'Tell me about voter eligibility in India',
  2: 'How do I register to vote using Form 6?',
  3: 'How do I get or download my EPIC voter ID card?',
  4: 'How do I find my polling booth location?',
  5: 'Where can I research candidates neutrally?',
  6: 'What ID documents are accepted at the polling booth?',
  7: 'How does the EVM and VVPAT work?',
  8: 'What happens after I get my ink mark?',
}

const QUICK_QUESTIONS = [
  'What documents do I need?',
  'How do I register?',
  'What is VVPAT?',
  'Is my vote secret?',
  'Name missing from list?',
]

interface Props {
  isOpen: boolean
  onClose: () => void
  currentStep?: number
}

export default function ChatWidget({ isOpen, onClose, currentStep }: Props) {
  const [messages, setMessages] = useState<Message[]>([{
    role: 'assistant',
    content: "Hi! I'm your VoteReady assistant 🗳️\n\nAsk me anything about voting in India — registration, documents, EVMs, or election day. I'm here to help!",
  }])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [closing, setClosing] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const sheetRef = useRef<HTMLDivElement>(null)
  const dragY = useRef(0)
  const startY = useRef(0)
  const isDragging = useRef(false)

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

  const handleClose = useCallback(() => {
    setClosing(true)
    setTimeout(() => { setClosing(false); onClose() }, 280)
  }, [onClose])

  // Swipe down to close
  const swipe = useSwipe({ onSwipeDown: handleClose, threshold: 80 })

  // Handle drag on sheet
  const onDragStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY
    isDragging.current = true
  }
  const onDragMove = (e: React.TouchEvent) => {
    if (!isDragging.current || !sheetRef.current) return
    const dy = Math.max(0, e.touches[0].clientY - startY.current)
    dragY.current = dy
    sheetRef.current.style.transform = `translateY(${dy}px)`
  }
  const onDragEnd = () => {
    isDragging.current = false
    if (!sheetRef.current) return
    if (dragY.current > 120) {
      handleClose()
    } else {
      sheetRef.current.style.transform = ''
      sheetRef.current.style.transition = 'transform 0.3s cubic-bezier(0.32,0.72,0,1)'
      setTimeout(() => { if (sheetRef.current) sheetRef.current.style.transition = '' }, 300)
    }
    dragY.current = 0
  }

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus()
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 350)
    }
  }, [isOpen])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const send = async (text?: string) => {
    const userText = (text || input).trim()
    if (!userText || loading) return
    const userMsg: Message = { role: 'user', content: userText }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)
    try {
      const res = await fetch(`${apiUrl}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg], current_step: currentStep }),
      })
      if (!res.ok) throw new Error()
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Having trouble connecting right now. Please try again or call the voter helpline at **1950**.',
      }])
    } finally {
      setLoading(false)
    }
  }

  const reset = () => setMessages([{
    role: 'assistant',
    content: 'Chat cleared! What would you like to know about voting in India?',
  }])

  if (!isOpen && !closing) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className={`bottom-sheet-backdrop ${closing ? 'animate-fade-out' : 'animate-fade-in'}`}
        onClick={handleClose}
        style={{ animation: closing ? 'fadeOut 0.28s ease forwards' : 'fadeIn 0.2s ease forwards' }}
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        className={`bottom-sheet ${closing ? 'animate-slide-out-down' : 'animate-slide-in-up'}`}
        {...swipe}
        style={{ willChange: 'transform' }}
      >
        {/* Drag handle */}
        <div
          className="bottom-sheet-handle"
          onTouchStart={onDragStart}
          onTouchMove={onDragMove}
          onTouchEnd={onDragEnd}
        />

        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg" style={{ background: 'linear-gradient(135deg,#FF6B00,#FF8C00)' }}>
            🗳️
          </div>
          <div className="flex-1">
            <p className="font-semibold text-gray-900 text-sm">VoteReady AI</p>
            <p className="text-xs text-gray-400">
              {currentStep ? `Helping with Step ${currentStep}` : 'Ask anything about voting'}
            </p>
          </div>
          <div className="flex gap-1">
            <button onClick={reset} className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400 hover:text-gray-600" title="Clear">
              <RotateCcw size={15} />
            </button>
            <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400 hover:text-gray-600">
              <ChevronDown size={18} />
            </button>
          </div>
        </div>

        {/* Step context */}
        {currentStep && STEP_PROMPTS[currentStep] && (
          <div className="mx-4 mt-3 px-3 py-2.5 bg-orange-50 border border-orange-100 rounded-xl flex items-center justify-between">
            <span className="text-xs text-orange-700 font-medium">On Step {currentStep} — want help with it?</span>
            <button onClick={() => send(STEP_PROMPTS[currentStep])} className="text-xs font-semibold text-orange-600 underline underline-offset-2">Ask</button>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3" style={{ maxHeight: '45vh', minHeight: '200px' }}>
          {messages.map((msg, i) => (
            <div key={i} className={`flex items-end gap-2 animate-fade-up ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded-lg bg-orange-100 flex items-center justify-center text-sm flex-shrink-0 mb-0.5">🗳️</div>
              )}
              <div className={`max-w-[80%] px-4 py-2.5 text-sm leading-relaxed ${msg.role === 'user' ? 'chat-user' : 'chat-bot'}`} style={{ whiteSpace: 'pre-wrap' }}>
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex items-end gap-2">
              <div className="w-7 h-7 rounded-lg bg-orange-100 flex items-center justify-center text-sm">🗳️</div>
              <div className="chat-bot px-4 py-3 flex gap-1 items-center">
                <span className="typing-dot w-2 h-2 bg-gray-400 rounded-full" />
                <span className="typing-dot w-2 h-2 bg-gray-400 rounded-full" />
                <span className="typing-dot w-2 h-2 bg-gray-400 rounded-full" />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Quick questions */}
        {messages.length <= 2 && (
          <div className="px-4 pb-2">
            <p className="text-xs text-gray-400 mb-2">Common questions</p>
            <div className="flex flex-wrap gap-2">
              {QUICK_QUESTIONS.map(q => (
                <button key={q} onClick={() => send(q)}
                  className="text-xs bg-gray-100 hover:bg-orange-50 hover:text-orange-700 hover:border-orange-200 border border-transparent text-gray-600 px-3 py-1.5 rounded-full transition-all duration-150">
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="flex gap-2 px-4 py-3 border-t border-gray-100">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
            placeholder="Ask anything about voting..."
            disabled={loading}
            className="flex-1 bg-gray-50 rounded-xl px-4 py-2.5 text-sm outline-none border border-gray-200 focus:border-orange-300 focus:ring-2 focus:ring-orange-100 transition-all"
          />
          <button
            onClick={() => send()}
            disabled={!input.trim() || loading}
            className="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-150 active:scale-90 flex-shrink-0 disabled:opacity-30"
            style={{ background: 'linear-gradient(135deg,#FF6B00,#FF8C00)' }}
          >
            <Send size={16} className="text-white" />
          </button>
        </div>

        {/* Disclaimer */}
        <p className="text-center text-xs text-gray-400 pb-4 px-4">
          Politically neutral · Verify at{' '}
          <a href="https://voters.eci.gov.in" target="_blank" className="underline underline-offset-2">voters.eci.gov.in</a>
          {' '}· Helpline: 1950
        </p>
      </div>

      <style jsx>{`
        @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
        @keyframes fadeOut { from{opacity:1} to{opacity:0} }
      `}</style>
    </>
  )
}