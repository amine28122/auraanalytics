'use client';

import { useState, useEffect, useActionState, useRef } from 'react';
import { LandingHeader } from '@/components/landing/header';
import Footer from '@/components/landing/footer';
import { Star, Send, Globe, CheckCircle2, Clock, Quote, TrendingUp, Users, Award, Filter, X } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { submitReview, type Review, type ReviewFormState } from '@/lib/actions';
import Script from 'next/script';

const COUNTRY_FLAGS: Record<string, string> = {
    'UAE': '🇦🇪', 'UK': '🇬🇧', 'Spain': '🇪🇸', 'Morocco': '🇲🇦', 'Germany': '🇩🇪',
    'Russia': '🇷🇺', 'Ghana': '🇬🇭', 'China': '🇨🇳', 'Saudi Arabia': '🇸🇦', 'USA': '🇺🇸',
    'France': '🇫🇷', 'Egypt': '🇪🇬', 'Turkey': '🇹🇷', 'Indonesia': '🇮🇩', 'Brazil': '🇧🇷',
    'India': '🇮🇳', 'Pakistan': '🇵🇰', 'Nigeria': '🇳🇬', 'South Africa': '🇿🇦', 'Algeria': '🇩🇿',
    'Tunisia': '🇹🇳', 'Kuwait': '🇰🇼', 'Qatar': '🇶🇦', 'Jordan': '🇯🇴', 'Iraq': '🇮🇶',
    'Canada': '🇨🇦', 'Australia': '🇦🇺', 'Japan': '🇯🇵', 'South Korea': '🇰🇷', 'Mexico': '🇲🇽',
    'Other': '🌍',
};

const AVATAR_COLORS = [
    'from-violet-500 to-purple-700',
    'from-blue-500 to-cyan-600',
    'from-emerald-500 to-teal-600',
    'from-amber-500 to-orange-600',
    'from-rose-500 to-pink-600',
    'from-indigo-500 to-blue-700',
    'from-green-500 to-emerald-700',
    'from-fuchsia-500 to-pink-700',
    'from-cyan-500 to-blue-600',
];

function StarRating({ value, onChange, readonly = false }: {
    value: number; onChange?: (v: number) => void; readonly?: boolean;
}) {
    const [hovered, setHovered] = useState(0);
    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(star => (
                <button
                    key={star}
                    type="button"
                    disabled={readonly}
                    onClick={() => onChange?.(star)}
                    onMouseEnter={() => !readonly && setHovered(star)}
                    onMouseLeave={() => !readonly && setHovered(0)}
                    className={cn('transition-transform', !readonly && 'hover:scale-110 cursor-pointer', readonly && 'cursor-default')}
                >
                    <Star
                        className={cn(
                            'h-6 w-6 transition-colors',
                            (hovered || value) >= star
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-muted-foreground/30'
                        )}
                    />
                </button>
            ))}
        </div>
    );
}

function ReviewCard({ review, index }: { review: Review; index: number }) {
    const initials = review.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
    const colorClass = AVATAR_COLORS[index % AVATAR_COLORS.length];
    const flag = COUNTRY_FLAGS[review.country] || '🌍';

    return (
        <div
            className="group relative flex flex-col gap-4 rounded-2xl border border-white/5 bg-gradient-to-b from-white/[0.04] to-transparent p-6 backdrop-blur-sm transition-all duration-300 hover:border-primary/20 hover:shadow-[0_0_30px_rgba(124,58,237,0.08)] hover:translate-y-[-2px]"
            style={{ animationDelay: `${index * 0.1}s` }}
        >
            {/* Quote Icon */}
            <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Quote className="h-8 w-8 text-primary" />
            </div>

            {/* Stars */}
            <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map(star => (
                    <Star
                        key={star}
                        className={cn(
                            'h-4 w-4',
                            star <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/20'
                        )}
                    />
                ))}
            </div>

            {/* Review Text */}
            <blockquote className="flex-grow text-sm leading-relaxed text-muted-foreground/90 italic">
                &ldquo;{review.review}&rdquo;
            </blockquote>

            {/* Author */}
            <div className="flex items-center gap-3 pt-2 border-t border-white/5">
                <div className={cn('w-10 h-10 rounded-full bg-gradient-to-br flex items-center justify-center text-white font-bold text-sm flex-shrink-0', colorClass)}>
                    {initials}
                </div>
                <div className="flex-grow min-w-0">
                    <p className="font-semibold text-foreground text-sm truncate">{review.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{review.role}</p>
                </div>
                <span className="text-xl flex-shrink-0" title={review.country}>{flag}</span>
            </div>
        </div>
    );
}

const initialFormState: ReviewFormState = { error: null, message: null };

function ReviewForm({ onSuccess }: { onSuccess: () => void }) {
    const [rating, setRating] = useState(5);
    const [state, formAction, isPending] = useActionState(submitReview, initialFormState);
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (state.message) {
            onSuccess();
            formRef.current?.reset();
            setRating(5);
        }
    }, [state.message, onSuccess]);

    return (
        <form ref={formRef} action={formAction} className="flex flex-col gap-5">
            <input type="hidden" name="rating" value={rating} />

            {/* Name & Role */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Full Name *</label>
                    <input
                        name="name"
                        required
                        minLength={2}
                        placeholder="Ahmed Al-Mansouri"
                        className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                    />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Your Role *</label>
                    <input
                        name="role"
                        required
                        minLength={2}
                        placeholder="Full-time Forex Trader"
                        className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                    />
                </div>
            </div>

            {/* Country */}
            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Country *</label>
                <select
                    name="country"
                    required
                    defaultValue=""
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all appearance-none"
                >
                    <option value="" disabled>Select your country...</option>
                    {Object.keys(COUNTRY_FLAGS).map(c => (
                        <option key={c} value={c} className="bg-background">{COUNTRY_FLAGS[c]} {c}</option>
                    ))}
                </select>
            </div>

            {/* Rating */}
            <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Your Rating *</label>
                <div className="flex items-center gap-3">
                    <StarRating value={rating} onChange={setRating} />
                    <span className="text-sm text-muted-foreground">
                        {rating === 5 ? '⭐ Excellent' : rating === 4 ? '👍 Good' : rating === 3 ? '😐 Average' : rating === 2 ? '👎 Below Average' : '❌ Poor'}
                    </span>
                </div>
            </div>

            {/* Review text */}
            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Your Review * (min 20 chars)</label>
                <textarea
                    name="review"
                    required
                    minLength={20}
                    maxLength={1000}
                    rows={4}
                    placeholder="Share your experience with AURA Analytics Pro. What features impressed you most? How has it helped your trading?"
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all resize-none"
                />
            </div>

            {/* Notice */}
            <div className="flex items-start gap-2 rounded-xl bg-primary/5 border border-primary/10 p-3">
                <Clock className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-xs text-muted-foreground">
                    Your review will be reviewed by our team before being published. This usually takes <span className="text-primary font-medium">24–48 hours</span>.
                </p>
            </div>

            {/* Error */}
            {state.error && (
                <div className="flex items-center gap-2 rounded-xl bg-destructive/10 border border-destructive/20 px-4 py-3">
                    <X className="h-4 w-4 text-destructive flex-shrink-0" />
                    <p className="text-sm text-destructive">{state.error}</p>
                </div>
            )}

            <button
                type="submit"
                disabled={isPending}
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-violet-600 px-6 py-3.5 text-sm font-semibold text-white transition-all hover:opacity-90 hover:shadow-lg hover:shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isPending ? (
                    <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                ) : (
                    <Send className="h-4 w-4" />
                )}
                {isPending ? 'Submitting...' : 'Submit Review'}
            </button>
        </form>
    );
}

export default function ReviewsPageClient({
    reviews,
    stats,
}: {
    reviews: Review[];
    stats: { avg: number; total: number; fiveStarPct: number };
}) {
    const [filterRating, setFilterRating] = useState<number | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const filteredReviews = filterRating
        ? reviews.filter(r => r.rating === filterRating)
        : reviews;

    const reviewsSchema = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: 'AURA Analytics Pro',
        aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: stats.avg,
            reviewCount: stats.total,
            bestRating: 5,
        },
        review: reviews.slice(0, 5).map(r => ({
            '@type': 'Review',
            author: { '@type': 'Person', name: r.name },
            reviewRating: { '@type': 'Rating', ratingValue: r.rating, bestRating: 5 },
            reviewBody: r.review,
        })),
    };

    return (
        <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
            <Script
                id="reviews-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewsSchema) }}
            />

            <LandingHeader />

            {/* ── Hero ─────────────────────────────── */}
            <section className="relative pt-36 pb-20 px-4 overflow-hidden">
                {/* Background effects */}
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,hsl(var(--primary)/0.15),transparent)]" />
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(hsl(var(--muted))_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_40%,transparent_100%)] opacity-10" />

                <div className="container mx-auto text-center max-w-3xl">
                    <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary mb-6">
                        <Star className="h-3.5 w-3.5 fill-current" />
                        Trusted by traders worldwide
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/50">
                        What Our Traders Say
                    </h1>
                    <p className="text-lg text-muted-foreground mb-12 max-w-xl mx-auto">
                        Real feedback from real traders who use AURA to get a consistent edge in financial markets.
                    </p>

                    {/* Stats Row */}
                    <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mb-12">
                        <div className="flex flex-col items-center gap-1 rounded-2xl border border-white/5 bg-white/[0.03] p-4">
                            <span className="text-3xl font-bold text-amber-400">{stats.avg}</span>
                            <div className="flex gap-0.5">
                                {[1, 2, 3, 4, 5].map(s => <Star key={s} className={cn('h-3 w-3', s <= Math.round(stats.avg) ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/20')} />)}
                            </div>
                            <span className="text-xs text-muted-foreground">Average Rating</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 rounded-2xl border border-white/5 bg-white/[0.03] p-4">
                            <span className="text-3xl font-bold text-primary">{stats.total}+</span>
                            <div className="flex items-center gap-1 text-primary">
                                <Users className="h-3 w-3" />
                            </div>
                            <span className="text-xs text-muted-foreground">Verified Reviews</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 rounded-2xl border border-white/5 bg-white/[0.03] p-4">
                            <span className="text-3xl font-bold text-emerald-400">{stats.fiveStarPct}%</span>
                            <div className="flex items-center gap-1 text-emerald-400">
                                <TrendingUp className="h-3 w-3" />
                            </div>
                            <span className="text-xs text-muted-foreground">5-Star Ratings</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Filter + Grid ─────────────────────── */}
            <section className="pb-20 px-4">
                <div className="container mx-auto max-w-6xl">

                    {/* Filter Bar */}
                    <div className="flex items-center gap-3 mb-10 flex-wrap">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Filter className="h-3.5 w-3.5" />
                            Filter:
                        </div>
                        <button
                            onClick={() => setFilterRating(null)}
                            className={cn(
                                'rounded-full border px-4 py-1.5 text-xs font-medium transition-all',
                                filterRating === null
                                    ? 'border-primary bg-primary/10 text-primary'
                                    : 'border-white/10 bg-white/5 text-muted-foreground hover:border-primary/30'
                            )}
                        >
                            All ({reviews.length})
                        </button>
                        {[5, 4, 3, 2, 1].map(star => {
                            const count = reviews.filter(r => r.rating === star).length;
                            if (count === 0) return null;
                            return (
                                <button
                                    key={star}
                                    onClick={() => setFilterRating(star === filterRating ? null : star)}
                                    className={cn(
                                        'flex items-center gap-1 rounded-full border px-4 py-1.5 text-xs font-medium transition-all',
                                        filterRating === star
                                            ? 'border-amber-500 bg-amber-500/10 text-amber-400'
                                            : 'border-white/10 bg-white/5 text-muted-foreground hover:border-amber-500/30'
                                    )}
                                >
                                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                    {star} ({count})
                                </button>
                            );
                        })}
                    </div>

                    {/* Reviews Grid */}
                    {filteredReviews.length === 0 ? (
                        <div className="text-center py-20 text-muted-foreground">
                            No reviews match this filter.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {filteredReviews.map((review, i) => (
                                <ReviewCard key={review.id} review={review} index={i} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* ── Submit Review CTA / Form ──────────── */}
            <section className="py-20 px-4">
                <div className="container mx-auto max-w-2xl">
                    {submitted ? (
                        /* Success State */
                        <div className="flex flex-col items-center gap-4 text-center rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-10">
                            <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                <CheckCircle2 className="h-8 w-8 text-emerald-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-foreground">Thank You!</h2>
                            <p className="text-muted-foreground max-w-md">
                                Your review has been received and is pending approval. Our team will review it within 24–48 hours.
                            </p>
                            <button
                                onClick={() => { setSubmitted(false); setShowForm(false); }}
                                className="mt-2 text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
                            >
                                Submit another review
                            </button>
                        </div>
                    ) : showForm ? (
                        /* Form */
                        <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-8">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-foreground">Write a Review</h2>
                                    <p className="text-sm text-muted-foreground mt-1">Share your experience with other traders</p>
                                </div>
                                <button
                                    onClick={() => setShowForm(false)}
                                    className="rounded-xl p-2 hover:bg-white/5 text-muted-foreground transition-colors"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                            <ReviewForm onSuccess={() => setSubmitted(true)} />
                        </div>
                    ) : (
                        /* CTA */
                        <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-violet-500/5 to-transparent p-10 text-center">
                            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_100%,hsl(var(--primary)/0.1),transparent)]" />
                            <div className="relative z-10">
                                <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-5">
                                    <Award className="h-7 w-7 text-primary" />
                                </div>
                                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                                    Experienced AURA?
                                </h2>
                                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                                    Your feedback helps other traders discover the platform and helps us improve. Share your honest experience.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <button
                                        onClick={() => setShowForm(true)}
                                        className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-violet-600 px-8 py-3.5 text-sm font-semibold text-white transition-all hover:opacity-90 hover:shadow-lg hover:shadow-primary/30"
                                    >
                                        <Star className="h-4 w-4" />
                                        Write a Review
                                    </button>
                                    <Link
                                        href="/pricing"
                                        className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-8 py-3.5 text-sm font-semibold text-foreground transition-all hover:border-primary/30 hover:bg-white/10"
                                    >
                                        Get Started Free
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </div>
    );
}
