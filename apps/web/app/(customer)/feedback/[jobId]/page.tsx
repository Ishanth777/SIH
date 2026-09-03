'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  StarIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
  LoaderIcon,
  ShieldCheckIcon,
} from '@/components/icons';

export default function CustomerFeedbackPage({ params }: { params: { jobId: string } }) {
  const router = useRouter();
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('accessToken');
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'}/jobs/${params.jobId}/rate`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ rating, comment }),
        },
      ).catch(() => {});

      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#F8FAFC] min-h-[calc(100vh-64px)] flex items-center justify-center p-6">
      <div className="card-base w-full max-w-lg p-8 sm:p-10 shadow-lg">
        <a
          href="/booking"
          className="text-xs font-heading font-bold text-[#475569] hover:text-[#0D1829] flex items-center gap-1.5 mb-6 transition"
        >
          <ArrowLeftIcon className="w-3.5 h-3.5" /> Back to Services
        </a>

        {submitted ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-[#D1FAE5] border border-[#059669]/30 rounded-full flex items-center justify-center mx-auto mb-5 text-[#047857] shadow-sm">
              <CheckCircleIcon className="w-9 h-9" />
            </div>

            <span className="eyebrow block mb-1">Feedback Logged</span>
            <h2 className="font-heading font-black text-2xl sm:text-3xl text-[#0D1829] mb-2 tracking-tight">
              Thank You for Your Review!
            </h2>
            <p className="font-sans text-sm text-[#475569] mb-8 max-w-sm mx-auto">
              Your rating updates the artisan's public cooperative score and reinforces fair-wage excellence.
            </p>

            <button
              onClick={() => router.push('/booking')}
              className="btn-primary w-full py-3.5 px-6 text-sm uppercase tracking-wider font-heading font-bold"
            >
              Back to Home / Booking
            </button>
          </div>
        ) : (
          <div>
            <div className="text-center mb-8">
              <span className="eyebrow block mb-1">Quality Assurance</span>
              <h1 className="font-heading font-black text-2xl text-[#0D1829] tracking-tight">
                Rate Your Artisan Service
              </h1>
              <p className="text-xs text-[#94A3B8] font-mono mt-1 font-semibold">Job #{params.jobId}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Star Rating */}
              <div className="flex justify-center gap-2.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(null)}
                    className="p-1 transition-transform hover:scale-115 focus:outline-none"
                  >
                    <StarIcon
                      className={`w-9 h-9 ${
                        star <= (hoverRating || rating)
                          ? 'text-[#F59E0B] fill-[#F59E0B]'
                          : 'text-[#E2E8F0] fill-transparent'
                      } transition-colors`}
                    />
                  </button>
                ))}
              </div>

              <div className="text-center font-heading text-xs font-extrabold uppercase tracking-wider text-[#475569]">
                {rating === 5 && '🌟 Outstanding & Master Artisan'}
                {rating === 4 && '✨ Good Quality Work'}
                {rating === 3 && '👍 Satisfactory'}
                {rating === 2 && '⚠️ Needs Improvement'}
                {rating === 1 && '❌ Unsatisfactory Work'}
              </div>

              {/* Review Text */}
              <div>
                <label className="label-style block mb-1.5">
                  Share Your Experience (Optional)
                </label>
                <textarea
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Detail punctuality, cleanliness, craftsmanship, and courteousness..."
                  className="input-base w-full text-sm resize-none"
                />
              </div>

              <div className="p-4 bg-[#F8FAFC] rounded-[12px] border border-[#E2E8F0] text-xs text-[#475569] flex items-start gap-2.5">
                <ShieldCheckIcon className="w-4 h-4 text-[#059669] mt-0.5 shrink-0" />
                <span>
                  Ratings are authenticated against verified completed service jobs to prevent spam or artificial manipulation.
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3.5 px-6 font-heading font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2"
              >
                {loading ? <LoaderIcon className="w-4 h-4 animate-spin" /> : 'Submit Verified Rating'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
