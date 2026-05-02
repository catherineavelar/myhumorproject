'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function ProtectedPage() {
    const [user, setUser] = useState<any>(null)
    const [captions, setCaptions] = useState<any[]>([])
    const [error, setError] = useState<string | null>(null)
    const [voted, setVoted] = useState<Record<string, number>>({})
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
        }
        load()
    }, [])

    async function vote(caption_id: string, vote_value: number) {
        if (voted[caption_id]) return
        const res = await fetch('/api/vote', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ caption_id, vote_value }),
        })
        if (res.ok) {
            setVoted(prev => ({ ...prev, [caption_id]: vote_value }))
        }
    }

    if (error) return <p>Error: {error}</p>
    if (!user) return null

    return (
        <div className="flex min-h-screen justify-center bg-zinc-50 font-sans">
            <main className="w-full flex flex-col items-center gap-6 py-32 px-10 bg-white">
                <div style={{ borderLeft: '6px solid #b91c1c', paddingLeft: '1rem' }}>
                    <h1 className="text-6xl font-bold text-red-700">I Fear this Ate 😂</h1>
                    <p style={{ color: '#52525b', fontSize: '1.125rem', marginTop: '0.5rem' }}>
                        Logged in as {user.email} — vote on your favorites!
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginTop: '2rem' }}>
                    {captions.map((caption: any) => (
                        <div key={caption.id} style={{ backgroundColor: 'white', border: '1px solid #e4e4e7', borderRadius: '12px', padding: '1rem' }}>
                            {caption.images?.url && (
                                <img src={caption.images.url} alt="caption" style={{ width: '100%', borderRadius: '8px', marginBottom: '1rem', maxHeight: '200px', objectFit: 'cover' }} />
                            )}
                            <p style={{ color: '#111', marginBottom: '0.5rem' }}>{caption.content}</p>
                            <p style={{ color: '#71717a', fontSize: '0.875rem', marginBottom: '1rem' }}>❤️ {caption.like_count} likes</p>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button
                                    onClick={() => vote(caption.id, 1)}
                                    disabled={!!voted[caption.id]}
                                    style={{ flex: 1, padding: '0.5rem', backgroundColor: voted[caption.id] === 1 ? '#b91c1c' : '#111', color: 'white', border: 'none', borderRadius: '8px', cursor: voted[caption.id] ? 'default' : 'pointer' }}
                                >
                                    👍 Upvote
                                </button>
                                <button
                                    onClick={() => vote(caption.id, -1)}
                                    disabled={!!voted[caption.id]}
                                    style={{ flex: 1, padding: '0.5rem', backgroundColor: voted[caption.id] === -1 ? '#b91c1c' : '#111', color: 'white', border: 'none', borderRadius: '8px', cursor: voted[caption.id] ? 'default' : 'pointer' }}
                                >
                                    👎 Downvote
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    )
}