'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function ProtectedPage() {
    const [user, setUser] = useState<any>(null)
    const [captions, setCaptions] = useState<any[]>([])
    const [current, setCurrent] = useState(0)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const [started, setStarted] = useState(false)
    const [selectedVote, setSelectedVote] = useState<number | null>(null)
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        async function load() {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push('/login')
                return
            }
            setUser(user)

            const { data, error } = await supabase
                .from('captions')
                .select('id, content, like_count, images(url)')
                .eq('is_public', true)
                .not('image_id', 'is', null)
                .order('like_count', { ascending: false })
                .limit(9)

            if (error) setError(error.message)
            else setCaptions(data)
            setLoading(false)
        }
        load()
    }, [])

    async function vote(vote_value: number) {
        const caption = captions[current]
        setSelectedVote(vote_value)
        const res = await fetch('/api/vote', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ caption_id: caption.id, vote_value }),
        })
        if (res.ok) {
            setTimeout(() => {
                setSelectedVote(null)
                setCurrent(prev => prev + 1)
            }, 600)
        }
    }

    if (loading) return <p style={{ textAlign: 'center', marginTop: '4rem' }}>Loading...</p>
    if (error) return <p>Error: {error}</p>
    if (!user) return null

    if (!started) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #ff6ec7 0%, #ff9a3c 50%, #ffde59 100%)', position: 'relative', overflow: 'hidden' }}>
                <img src="/flower.png" alt="" style={{ position: 'absolute', bottom: '-20px', right: '-20px', width: '280px', opacity: 0.9, pointerEvents: 'none', zIndex: 1 }} />
                <img src="/flower.png" alt="" style={{ position: 'absolute', top: '-30px', left: '-30px', width: '200px', opacity: 0.5, pointerEvents: 'none', zIndex: 1, transform: 'rotate(160deg)' }} />
                <img src="/sparkle.png" alt="" style={{ position: 'absolute', top: '40px', right: '60px', width: '50px', opacity: 0.85, pointerEvents: 'none', zIndex: 1 }} />
                <img src="/sparkle.png" alt="" style={{ position: 'absolute', bottom: '80px', left: '40px', width: '35px', opacity: 0.7, pointerEvents: 'none', zIndex: 1 }} />
                <img src="/sparkle.png" alt="" style={{ position: 'absolute', top: '45%', left: '30px', width: '25px', opacity: 0.6, pointerEvents: 'none', zIndex: 1 }} />

                <div style={{ backgroundColor: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(10px)', padding: '4rem 2rem', borderRadius: '24px', textAlign: 'center', maxWidth: '520px', width: '100%', position: 'relative', zIndex: 2 }}>
                    <h1 style={{ fontSize: '2.2rem', fontWeight: '900', color: 'white', textShadow: '2px 2px 0 #b5005b', marginBottom: '1rem', lineHeight: 1.2 }}>The Top 9 Most Liked Captions from the Humor Project</h1>
                    <p style={{ color: 'rgba(255,255,255,0.95)', marginBottom: '2rem', fontFamily: 'Times New Roman, serif', fontStyle: 'italic', lineHeight: 1.6 }}>
                        Real students picked their favorites. Now it's your turn to rate them.
                    </p>
                    <button
                        onClick={(e) => {
                            (e.target as HTMLButtonElement).style.boxShadow = '0 0 24px 8px rgba(255,110,199,0.7)'
                            setTimeout(() => {
                                (e.target as HTMLButtonElement).style.boxShadow = 'none'
                                setStarted(true)
                            }, 600)
                        }}
                        onMouseEnter={e => (e.target as HTMLButtonElement).style.boxShadow = '0 0 16px 4px rgba(255,110,199,0.5)'}
                        onMouseLeave={e => (e.target as HTMLButtonElement).style.boxShadow = 'none'}
                        style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.45), rgba(255,182,213,0.25))', color: '#ff6ec7', border: '1.5px solid rgba(255,255,255,0.7)', borderRadius: '50px', padding: '0.75rem 2.5rem', fontSize: '1rem', fontWeight: '800', cursor: 'pointer', letterSpacing: '1px', backdropFilter: 'blur(12px)', boxShadow: 'none', WebkitBackdropFilter: 'blur(12px)', transition: 'box-shadow 0.2s ease' }}
                    >
                        Meet the Divas 💅
                    </button>
                </div>

                <button
                    onClick={() => router.push('/creatememe')}
                    onMouseEnter={e => (e.target as HTMLButtonElement).style.boxShadow = '0 0 16px 4px rgba(255,110,199,0.5)'}
                    onMouseLeave={e => (e.target as HTMLButtonElement).style.boxShadow = 'none'}
                    style={{ marginTop: '1rem', background: 'rgba(0,0,0,0.25)', color: 'white', border: '1.5px solid rgba(255,255,255,0.3)', borderRadius: '12px', padding: '0.75rem 2.5rem', fontSize: '0.9rem', fontWeight: '700', cursor: 'pointer', letterSpacing: '1px', backdropFilter: 'blur(12px)', boxShadow: 'none', WebkitBackdropFilter: 'blur(12px)', transition: 'box-shadow 0.2s ease', position: 'relative', zIndex: 2, width: '100%', maxWidth: '400px' }}
                >
                    or click here to create your own meme diva 📸
                </button>
            </div>
        )
    }

    if (current >= captions.length) {
        return (
            <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #ff6ec7 0%, #ff9a3c 50%, #ffde59 100%)', position: 'relative', overflow: 'hidden' }}>
                <img src="/flower.png" alt="" style={{ position: 'absolute', bottom: '-20px', right: '-20px', width: '280px', opacity: 0.9, pointerEvents: 'none', zIndex: 1 }} />
                <img src="/flower.png" alt="" style={{ position: 'absolute', top: '-30px', left: '-30px', width: '200px', opacity: 0.5, pointerEvents: 'none', zIndex: 1, transform: 'rotate(160deg)' }} />
                <img src="/sparkle.png" alt="" style={{ position: 'absolute', top: '40px', right: '60px', width: '50px', opacity: 0.85, pointerEvents: 'none', zIndex: 1 }} />
                <img src="/sparkle.png" alt="" style={{ position: 'absolute', bottom: '80px', left: '40px', width: '35px', opacity: 0.7, pointerEvents: 'none', zIndex: 1 }} />
                <img src="/sparkle.png" alt="" style={{ position: 'absolute', top: '45%', left: '30px', width: '25px', opacity: 0.6, pointerEvents: 'none', zIndex: 1 }} />
                <div style={{ backgroundColor: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', padding: '4rem 2rem', borderRadius: '24px', textAlign: 'center', maxWidth: '520px', width: '100%', position: 'relative', zIndex: 2 }}>
                    <h1 style={{ fontSize: '2.2rem', fontWeight: '900', color: 'white', textShadow: '2px 2px 0 #b5005b', marginBottom: '1rem', lineHeight: 1.2 }}>You've Met the Divas!</h1>
                    <p style={{ color: 'rgba(255,255,255,0.95)', fontFamily: 'Times New Roman, serif', fontStyle: 'italic', lineHeight: 1.6, marginBottom: '2rem' }}>
                        Your votes have been submitted 💋
                    </p>
                    <button
                        onClick={() => { setStarted(false); setCurrent(0) }}
                        onMouseEnter={e => (e.target as HTMLButtonElement).style.boxShadow = '0 0 16px 4px rgba(255,110,199,0.5)'}
                        onMouseLeave={e => (e.target as HTMLButtonElement).style.boxShadow = 'none'}
                        style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.45), rgba(255,182,213,0.25))', color: '#ff6ec7', border: '1.5px solid rgba(255,255,255,0.7)', borderRadius: '50px', padding: '0.75rem 2.5rem', fontSize: '1rem', fontWeight: '800', cursor: 'pointer', letterSpacing: '1px', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', transition: 'box-shadow 0.2s ease' }}
                    >
                        Go Back
                    </button>
                </div>
            </div>
        )
    }

    const caption = captions[current]

    return (
        <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #ff6ec7 0%, #ff9a3c 50%, #ffde59 100%)', position: 'relative', overflow: 'hidden' }}>
            <img src="/flower.png" alt="" style={{ position: 'absolute', bottom: '-20px', right: '-20px', width: '280px', opacity: 0.9, pointerEvents: 'none', zIndex: 1 }} />
            <img src="/flower.png" alt="" style={{ position: 'absolute', top: '-30px', left: '-30px', width: '200px', opacity: 0.5, pointerEvents: 'none', zIndex: 1, transform: 'rotate(160deg)' }} />
            <img src="/sparkle.png" alt="" style={{ position: 'absolute', top: '40px', right: '60px', width: '50px', opacity: 0.85, pointerEvents: 'none', zIndex: 1 }} />
            <img src="/sparkle.png" alt="" style={{ position: 'absolute', bottom: '80px', left: '40px', width: '35px', opacity: 0.7, pointerEvents: 'none', zIndex: 1 }} />
            <img src="/sparkle.png" alt="" style={{ position: 'absolute', top: '45%', left: '30px', width: '25px', opacity: 0.6, pointerEvents: 'none', zIndex: 1 }} />

            <div style={{ backgroundColor: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', borderRadius: '24px', padding: '2rem', maxWidth: '480px', width: '100%', position: 'relative', zIndex: 2 }}>
                <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.75rem', letterSpacing: '2px', textTransform: 'uppercase', textAlign: 'center', marginBottom: '1rem' }}>{current + 1} of {captions.length}</p>
                {caption.images?.url && (
                    <img src={caption.images.url} alt="caption" style={{ width: '100%', borderRadius: '16px', marginBottom: '1rem', maxHeight: '300px', objectFit: 'cover' }} />
                )}
                <p style={{ color: 'white', fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.4rem', textShadow: '1px 1px 0 rgba(0,0,0,0.15)' }}>{caption.content}</p>
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>❤️ {caption.like_count} likes</p>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        onClick={() => vote(1)}
                        style={{
                            flex: 1, padding: '0.75rem',
                            background: selectedVote === 1 ? '#ff6ec7' : 'rgba(255,255,255,0.9)',
                            color: selectedVote === 1 ? 'white' : '#ff6ec7',
                            border: 'none', borderRadius: '50px', fontSize: '1rem', fontWeight: '800', cursor: 'pointer',
                            boxShadow: selectedVote === 1 ? '0 0 20px 6px rgba(255,110,199,0.7)' : 'none',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={e => { if (selectedVote !== 1) (e.target as HTMLButtonElement).style.boxShadow = '0 0 16px 4px rgba(255,110,199,0.5)' }}
                        onMouseLeave={e => { if (selectedVote !== 1) (e.target as HTMLButtonElement).style.boxShadow = 'none' }}
                    >
                        👍 Upvote
                    </button>
                    <button
                        onClick={() => vote(-1)}
                        style={{
                            flex: 1, padding: '0.75rem',
                            background: selectedVote === -1 ? '#ff6ec7' : 'rgba(255,255,255,0.9)',
                            color: selectedVote === -1 ? 'white' : '#ff6ec7',
                            border: 'none', borderRadius: '50px', fontSize: '1rem', fontWeight: '800', cursor: 'pointer',
                            boxShadow: selectedVote === -1 ? '0 0 20px 6px rgba(255,110,199,0.7)' : 'none',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={e => { if (selectedVote !== -1) (e.target as HTMLButtonElement).style.boxShadow = '0 0 16px 4px rgba(255,110,199,0.5)' }}
                        onMouseLeave={e => { if (selectedVote !== -1) (e.target as HTMLButtonElement).style.boxShadow = 'none' }}
                    >
                        👎 Downvote
                    </button>
                </div>
            </div>
        </div>
    )
}