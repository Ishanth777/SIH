'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  BotIcon,
  SendIcon,
  SparklesIcon,
  ShieldCheckIcon,
  StarIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  XIcon,
} from '../icons';
import { useLanguage } from '../../context/LanguageContext';
import { addBooking } from '@/data/bookings-store';

export interface CandidateWorker {
  id: string;
  name: string;
  avatar: string;
  trade: string;
  society: string;
  experienceYears: number;
  rating: number;
  totalJobs: number;
  distanceKm: number;
  etaMinutes: number;
  nsqfLevel: string;
  hourlyRate: number;
  // Deterministic Scoring Factors (Weights: 40%, 25%, 20%, 15%)
  proximityScore: number; // Max 40
  ratingScore: number; // Max 25
  skillScore: number; // Max 20
  rotationBiasScore: number; // Max 15
  totalScore: number; // Max 100
  rationale: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  analysis?: {
    trade: string;
    urgency: 'EMERGENCY' | 'STANDARD';
    zone: string;
  };
  recommendations?: CandidateWorker[];
}

const SAMPLE_WORKERS: Record<string, CandidateWorker[]> = {
  plumber: [
    {
      id: 'w-plumb-01',
      name: 'Rameshwar Naik',
      avatar: 'RN',
      trade: 'Master Plumber',
      society: 'Bangalore South Labour Cooperative Society #402',
      experienceYears: 11,
      rating: 4.9,
      totalJobs: 342,
      distanceKm: 1.2,
      etaMinutes: 14,
      nsqfLevel: 'NSQF Level 5 (Govt Certified)',
      hourlyRate: 350,
      proximityScore: 39.2, // 1.2km
      ratingScore: 24.5,
      skillScore: 20.0,
      rotationBiasScore: 13.5,
      totalScore: 97.2,
      rationale: 'Top proximity match (1.2km via PostGIS ST_DWithin) with apex Level 5 piping certification and high cooperative tenure.',
    },
    {
      id: 'w-plumb-02',
      name: 'Babu Veerendra',
      avatar: 'BV',
      trade: 'Sanitary Specialist',
      society: 'Karnataka State Labour Cooperative Guild #118',
      experienceYears: 7,
      rating: 4.8,
      totalJobs: 189,
      distanceKm: 2.5,
      etaMinutes: 22,
      nsqfLevel: 'NSQF Level 4',
      hourlyRate: 320,
      proximityScore: 35.0,
      ratingScore: 23.5,
      skillScore: 18.0,
      rotationBiasScore: 14.8, // Higher rotation bias priority
      totalScore: 91.3,
      rationale: 'High anti-monopoly fair-rotation score to balance guild allocations, certified for residential drainage.',
    },
  ],
  electrician: [
    {
      id: 'w-elec-01',
      name: 'Kavitha Sundaram',
      avatar: 'KS',
      trade: 'Licensed Industrial Electrician',
      society: 'Indiranagar Ward Labour Cooperative #209',
      experienceYears: 9,
      rating: 4.95,
      totalJobs: 410,
      distanceKm: 0.9,
      etaMinutes: 10,
      nsqfLevel: 'NSQF Level 5 & Wireman License',
      hourlyRate: 380,
      proximityScore: 39.8,
      ratingScore: 24.8,
      skillScore: 20.0,
      rotationBiasScore: 14.0,
      totalScore: 98.6,
      rationale: 'Closest verified wireman with high MCB fault diagnosis rating and zero safety violations.',
    },
    {
      id: 'w-elec-02',
      name: 'Manjunath Gowda',
      avatar: 'MG',
      trade: 'Residential Electrician',
      society: 'Bengaluru East Cooperative Guild #33',
      experienceYears: 6,
      rating: 4.75,
      totalJobs: 154,
      distanceKm: 2.1,
      etaMinutes: 18,
      nsqfLevel: 'NSQF Level 4',
      hourlyRate: 320,
      proximityScore: 36.2,
      ratingScore: 23.0,
      skillScore: 18.0,
      rotationBiasScore: 14.5,
      totalScore: 91.7,
      rationale: 'Specialist in household wiring, prioritized under fair rotation rules for the current dispatch window.',
    },
  ],
  cleaner: [
    {
      id: 'w-clean-01',
      name: 'Lakshmi Bai',
      avatar: 'LB',
      trade: 'Sanitization & Deep Cleaning Lead',
      society: 'Shramik Mahila Labour Cooperative #501',
      experienceYears: 8,
      rating: 4.9,
      totalJobs: 520,
      distanceKm: 1.4,
      etaMinutes: 16,
      nsqfLevel: 'Certified Hospitality & Hygiene Specialist',
      hourlyRate: 280,
      proximityScore: 38.5,
      ratingScore: 24.5,
      skillScore: 19.5,
      rotationBiasScore: 13.8,
      totalScore: 96.3,
      rationale: 'Cooperative woman lead artisan with comprehensive deep sanitation protocol certification.',
    },
  ],
  caregiver: [
    {
      id: 'w-care-01',
      name: 'Mary Varghese',
      avatar: 'MV',
      trade: 'Certified Geriatric Caregiver',
      society: 'Arogya Labour Cooperative Society #12',
      experienceYears: 10,
      rating: 5.0,
      totalJobs: 215,
      distanceKm: 2.0,
      etaMinutes: 20,
      nsqfLevel: 'Govt Auxiliary Healthcare Certified',
      hourlyRate: 400,
      proximityScore: 37.0,
      ratingScore: 25.0,
      skillScore: 20.0,
      rotationBiasScore: 14.2,
      totalScore: 96.2,
      rationale: 'Top patient care satisfaction rating with verified police check and CPR certification.',
    },
  ],
};

const PROMPT_SUGGESTIONS = [
  'Emergency water pipe burst under bathroom sink',
  'Main electrical circuit breaker sparking and tripping',
  'Deep sanitization and scrub for 3BHK flat',
  'Elderly patient mobility assistance for 8 hours',
];

interface WorkerRecommendationChatbotProps {
  onSelectWorker?: (worker: CandidateWorker) => void;
  isOpen?: boolean;
  onClose?: () => void;
  embedded?: boolean;
}

export function WorkerRecommendationChatbot({
  onSelectWorker,
  isOpen = true,
  onClose,
  embedded = false,
}: WorkerRecommendationChatbotProps) {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-msg',
      sender: 'assistant',
      text: 'Namaste! I am Sahayak AI. Tell me what service or repair you need, and I will analyze your requirements and run our deterministic scoring engine (Proximity 40%, Rating 25%, Skill 20%, Fair Rotation Bias 15%) to recommend the best verified cooperative artisan.',
      timestamp: 'Just now',
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedWorkerId, setSelectedWorkerId] = useState<string | null>(null);
  const [dispatchedBookings, setDispatchedBookings] = useState<Record<string, string>>({});
  const [expandedBreakdownId, setExpandedBreakdownId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    // Analyze intent & determine candidates
    setTimeout(() => {
      const lower = query.toLowerCase();
      let tradeKey = 'plumber';
      let tradeTitle = 'Plumbing Services';
      let urgency: 'EMERGENCY' | 'STANDARD' = 'STANDARD';

      if (lower.includes('electr') || lower.includes('spark') || lower.includes('wire') || lower.includes('mcb') || lower.includes('fan') || lower.includes('light')) {
        tradeKey = 'electrician';
        tradeTitle = 'Electrical & Wiring';
      } else if (lower.includes('clean') || lower.includes('scrub') || lower.includes('maid') || lower.includes('wash')) {
        tradeKey = 'cleaner';
        tradeTitle = 'Sanitization & Deep Cleaning';
      } else if (lower.includes('care') || lower.includes('elder') || lower.includes('nurse') || lower.includes('patient')) {
        tradeKey = 'caregiver';
        tradeTitle = 'Caregiving & Patient Support';
      }

      if (lower.includes('emergency') || lower.includes('urgent') || lower.includes('burst') || lower.includes('spark') || lower.includes('flood')) {
        urgency = 'EMERGENCY';
      }

      const recs = SAMPLE_WORKERS[tradeKey] || SAMPLE_WORKERS.plumber;

      const botReply: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: `I have analyzed your requirement: **${tradeTitle}** (${urgency === 'EMERGENCY' ? 'High Urgency Alert' : 'Standard Booking'}). Running PostGIS geospatial match and deterministic multi-tier scoring across active cooperative members...`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        analysis: {
          trade: tradeTitle,
          urgency,
          zone: 'Koramangala - Indiranagar Sector 4',
        },
        recommendations: recs,
      };

      setMessages((prev) => [...prev, botReply]);
      setIsTyping(false);
    }, 900);
  };

  const handleDispatch = (worker: CandidateWorker) => {
    let bookingId = dispatchedBookings[worker.id];

    if (!bookingId) {
      let category: 'PLUMBER' | 'ELECTRICIAN' | 'CLEANER' | 'CAREGIVER' = 'PLUMBER';
      const t = worker.trade.toLowerCase();
      if (t.includes('electr') || t.includes('wire')) category = 'ELECTRICIAN';
      else if (t.includes('clean') || t.includes('sanit')) category = 'CLEANER';
      else if (t.includes('care') || t.includes('nurse')) category = 'CAREGIVER';

      const newBooking = addBooking({
        serviceName: worker.trade,
        category,
        urgency: 'EMERGENCY',
        customerName: 'Anup Sharma',
        customerPhone: '+91 98451 98210',
        workerName: `${worker.name} (${worker.nsqfLevel.split('(')[0].trim()})`,
        cooperativeName: worker.society,
        scheduledDate: new Date().toLocaleDateString('en-GB'),
        scheduledTime: `Immediate (${worker.etaMinutes}m ETA)`,
        address: 'Jayanagar 4th Block, Bengaluru, Karnataka',
        amount: worker.hourlyRate * 2,
        status: 'IN_PROGRESS',
      });

      bookingId = newBooking.id;
      setDispatchedBookings((prev) => ({ ...prev, [worker.id]: newBooking.id }));

      const botConfirm: ChatMessage = {
        id: `confirm-${Date.now()}`,
        sender: 'assistant',
        text: `✅ **Artisan Dispatched & Booking Registered!**\n\n**${worker.name}** has accepted job **#${newBooking.id}** through **${worker.society}**.\n\n• **ETA**: ${worker.etaMinutes} mins (${worker.distanceKm} km away)\n• **Deterministic Match Score**: ${worker.totalScore}/100\n• **Standard Rate**: ₹${worker.hourlyRate * 2}\n\nYour booking has been saved to **My Service Bookings** and live GPS tracking is active.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botConfirm]);
    }

    setSelectedWorkerId(worker.id);
    if (onSelectWorker) {
      onSelectWorker(worker);
    }
  };

  if (!isOpen && !embedded) return null;

  const content = (
    <div className={`flex flex-col ${embedded ? 'h-[620px] rounded-2xl border border-slate-200 bg-white shadow-sm' : 'h-[640px] w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden'}`}>
      {/* Header */}
      <div className="px-5 py-3.5 bg-gradient-to-r from-[#0E2150] via-[#152B66] to-[#0E2150] text-white flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shadow-inner">
            <BotIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-heading font-black text-sm tracking-tight text-white">Sahayak AI</h3>
              <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-500 text-slate-900 uppercase tracking-wider font-mono">
                Deterministic
              </span>
            </div>
            <p className="text-[11px] text-slate-300">
              Conversational Worker Recommendation & Deterministic Scoring Engine
            </p>
          </div>
        </div>

        {onClose && !embedded && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition"
            aria-label="Close Assistant"
          >
            <XIcon className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Scoring Weight Info Banner */}
      <div className="px-4 py-2 bg-slate-50 border-b border-slate-200/80 text-[11px] text-slate-600 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-1 font-semibold text-slate-700 font-heading">
          <SparklesIcon className="w-3.5 h-3.5 text-amber-500" />
          <span>Deterministic Formula:</span>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-mono font-bold">
          <span className="bg-blue-50 text-blue-800 px-1.5 py-0.5 rounded border border-blue-200">
            📍 Proximity 40%
          </span>
          <span className="bg-amber-50 text-amber-800 px-1.5 py-0.5 rounded border border-amber-200">
            ⭐ Rating 25%
          </span>
          <span className="bg-purple-50 text-purple-800 px-1.5 py-0.5 rounded border border-purple-200">
            📜 NSQF Skill 20%
          </span>
          <span className="bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded border border-emerald-200">
            ⚖️ Fair Rotation 15%
          </span>
        </div>
      </div>

      {/* Message Stream */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[88%] p-3.5 rounded-2xl text-xs leading-relaxed shadow-xs ${
                msg.sender === 'user'
                  ? 'bg-[#0E2150] text-white rounded-br-none'
                  : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
              }`}
            >
              <div className="whitespace-pre-line font-medium">{msg.text}</div>

              {/* Analysis Meta Chips */}
              {msg.analysis && (
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap gap-1.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    Trade: {msg.analysis.trade}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${msg.analysis.urgency === 'EMERGENCY' ? 'bg-rose-100 text-rose-800' : 'bg-blue-100 text-blue-800'}`}>
                    Priority: {msg.analysis.urgency}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Zone: {msg.analysis.zone}
                  </span>
                </div>
              )}
            </div>

            {/* Candidate Worker Cards */}
            {msg.recommendations && (
              <div className="mt-3 w-full space-y-3">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-heading flex items-center gap-1.5">
                  <ShieldCheckIcon className="w-3.5 h-3.5 text-emerald-600" />
                  Top Recommended Cooperative Artisans (Ranked by Deterministic Score)
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {msg.recommendations.map((worker, idx) => {
                    const isSelected = selectedWorkerId === worker.id;
                    const isExpanded = expandedBreakdownId === worker.id;
                    return (
                      <div
                        key={worker.id}
                        className={`p-4 rounded-xl border transition-all ${
                          isSelected
                            ? 'bg-emerald-50/50 border-emerald-500 shadow-md ring-1 ring-emerald-500'
                            : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                        }`}
                      >
                        {/* Worker Top Row */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#0E2150] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                              {worker.avatar}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-heading font-bold text-sm text-slate-900">
                                  {worker.name}
                                </h4>
                                {idx === 0 && (
                                  <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                                    #1 Top Match
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-500 font-medium">
                                {worker.trade} • {worker.experienceYears} yrs exp
                              </p>
                              <p className="text-[11px] text-slate-400 font-medium">
                                {worker.society}
                              </p>
                            </div>
                          </div>

                          {/* Overall Match Score Gauge */}
                          <div className="text-right">
                            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#0E2150] text-white text-xs font-black shadow-xs font-mono">
                              <span>{worker.totalScore.toFixed(1)}%</span>
                              <span className="text-[10px] text-emerald-400">Match</span>
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                              ETA: {worker.etaMinutes} mins ({worker.distanceKm} km)
                            </div>
                          </div>
                        </div>

                        {/* Badges Bar */}
                        <div className="mt-3 flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
                          <div className="flex items-center gap-1.5">
                            <div className="flex items-center text-amber-500 font-bold">
                              <StarIcon className="w-3.5 h-3.5 fill-current" />
                              <span className="ml-1 text-slate-800 font-heading">{worker.rating}</span>
                            </div>
                            <span className="text-slate-400">•</span>
                            <span className="text-slate-600">{worker.totalJobs} jobs</span>
                            <span className="text-slate-400">•</span>
                            <span className="font-bold text-[#059669]">₹{worker.hourlyRate}/hr base</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setExpandedBreakdownId(isExpanded ? null : worker.id)}
                              className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold underline font-heading"
                            >
                              {isExpanded ? 'Hide Formula' : 'View Score Breakdown'}
                            </button>

                            {dispatchedBookings[worker.id] ? (
                              <div className="flex items-center gap-1.5">
                                <Link
                                  href={`/job-tracking/${dispatchedBookings[worker.id]}`}
                                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#059669] hover:bg-[#047857] text-white shadow-xs transition flex items-center gap-1"
                                >
                                  <span>Track GPS</span>
                                  <ArrowRightIcon className="w-3 h-3" />
                                </Link>
                                <Link
                                  href="/customer/bookings"
                                  className="px-2 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 transition"
                                >
                                  Bookings
                                </Link>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleDispatch(worker)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                                  isSelected
                                    ? 'bg-emerald-600 text-white shadow-xs'
                                    : 'bg-[#0E2150] hover:bg-[#1A3470] text-white shadow-xs'
                                }`}
                              >
                                {isSelected ? (
                                  <>
                                    <CheckCircleIcon className="w-3.5 h-3.5" />
                                    <span>Selected for Dispatch</span>
                                  </>
                                ) : (
                                  <>
                                    <span>Dispatch Artisan</span>
                                    <ArrowRightIcon className="w-3 h-3" />
                                  </>
                                )}
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Deterministic Score Breakdown Drawer */}
                        {isExpanded && (
                          <div className="mt-3 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-2.5 animate-in fade-in duration-150">
                            <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider font-heading flex justify-between">
                              <span>Deterministic Scoring Breakdown</span>
                              <span className="text-emerald-700 font-mono">
                                Total: {worker.totalScore}/100
                              </span>
                            </div>

                            <div className="space-y-1.5 font-mono text-[11px]">
                              <div>
                                <div className="flex justify-between text-slate-600 mb-0.5">
                                  <span>📍 Geospatial Proximity (PostGIS ST_DWithin, max 40):</span>
                                  <span className="font-bold text-slate-900">{worker.proximityScore} / 40</span>
                                </div>
                                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                                  <div
                                    className="bg-blue-600 h-full rounded-full"
                                    style={{ width: `${(worker.proximityScore / 40) * 100}%` }}
                                  />
                                </div>
                              </div>

                              <div>
                                <div className="flex justify-between text-slate-600 mb-0.5">
                                  <span>⭐ Cooperative Tenure & Star Rating (max 25):</span>
                                  <span className="font-bold text-slate-900">{worker.ratingScore} / 25</span>
                                </div>
                                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                                  <div
                                    className="bg-amber-500 h-full rounded-full"
                                    style={{ width: `${(worker.ratingScore / 25) * 100}%` }}
                                  />
                                </div>
                              </div>

                              <div>
                                <div className="flex justify-between text-slate-600 mb-0.5">
                                  <span>📜 Skill India & NSQF Guild Verification (max 20):</span>
                                  <span className="font-bold text-slate-900">{worker.skillScore} / 20</span>
                                </div>
                                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                                  <div
                                    className="bg-purple-600 h-full rounded-full"
                                    style={{ width: `${(worker.skillScore / 20) * 100}%` }}
                                  />
                                </div>
                              </div>

                              <div>
                                <div className="flex justify-between text-slate-600 mb-0.5">
                                  <span>⚖️ Fair Rotation & Anti-Monopoly Bias (max 15):</span>
                                  <span className="font-bold text-slate-900">{worker.rotationBiasScore} / 15</span>
                                </div>
                                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                                  <div
                                    className="bg-emerald-600 h-full rounded-full"
                                    style={{ width: `${(worker.rotationBiasScore / 15) * 100}%` }}
                                  />
                                </div>
                              </div>
                            </div>

                            <p className="text-[11px] text-slate-500 italic pt-1 border-t border-slate-200/60 font-sans">
                              {worker.rationale}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <span className="text-[9px] text-slate-400 mt-1 font-mono">{msg.timestamp}</span>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 p-3 bg-white border border-slate-200 rounded-2xl w-fit shadow-xs">
            <BotIcon className="w-4 h-4 text-[#0E2150] animate-bounce" />
            <span className="text-xs text-slate-500 font-medium">
              Sahayak AI is analyzing trade category and computing deterministic scores...
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Chips */}
      <div className="px-4 py-2 border-t border-slate-100 bg-white flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        <span className="text-[10px] font-bold text-slate-400 uppercase font-heading shrink-0">
          Try:
        </span>
        {PROMPT_SUGGESTIONS.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => handleSendMessage(suggestion)}
            className="text-[11px] px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 whitespace-nowrap transition font-medium shrink-0"
          >
            {suggestion}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <div className="p-3 bg-white border-t border-slate-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tell Sahayak AI what service you need (e.g. 'Leaking pipe under sink' or in Hindi)..."
            className="flex-1 px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0E2150] text-slate-900 font-medium"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="px-4 py-2.5 rounded-xl bg-[#0E2150] hover:bg-[#1A3470] disabled:opacity-50 text-white font-bold text-xs shadow-xs transition flex items-center gap-1.5"
          >
            <span>Match</span>
            <SendIcon className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );

  if (embedded) {
    return content;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      {content}
    </div>
  );
}
