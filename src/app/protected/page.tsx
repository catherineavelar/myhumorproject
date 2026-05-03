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
        const res = await fetch('/api/vote', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ caption_id: caption.id, vote_value }),
        })
        if (res.ok) {
            setCurrent(prev => prev + 1)
        }
    }

    if (loading) return <p style={{ textAlign: 'center', marginTop: '4rem' }}>Loading...</p>
    if (error) return <p>Error: {error}</p>
    if (!user) return null

    if (current >= captions.length) {
        return (
            <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#b91c1c' }}>You've seen our top 9! 🎉</h1>
                    <p style={{ color: '#52525b', marginTop: '1rem' }}>Thanks for voting!</p>
                </div>
            </div>
        )
    }

    const caption = captions[current]

    return (
        <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9f9f9' }}>
            <div style={{ backgroundColor: 'white', border: '1px solid #e4e4e7', borderRadius: '12px', padding: '2rem', maxWidth: '500px', width: '100%' }}>
                <p style={{ color: '#71717a', fontSize: '0.875rem', marginBottom: '1rem', textAlign: 'center' }}>{current + 1} of {captions.length}</p>
                {caption.images?.url && (
                    <img src={caption.images.url} alt="caption" style={{ width: '100%', borderRadius: '8px', marginBottom: '1rem', maxHeight: '300px', objectFit: 'cover' }} />
                )}
                <p style={{ color: '#111', fontSize: '1.125rem', marginBottom: '0.5rem' }}>{caption.content}</p>
                <p style={{ color: '#71717a', fontSize: '0.875rem', marginBottom: '1.5rem' }}>❤️ {caption.like_count} likes</p>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button onClick={() => vote(1)} style={{ flex: 1, padding: '0.75rem', backgroundColor: '#111', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', cursor: 'pointer' }}>
                        👍 Upvote
                    </button>
                    <button onClick={() => vote(-1)} style={{ flex: 1, padding: '0.75rem', backgroundColor: '#111', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', cursor: 'pointer' }}>
                        👎 Downvote
                    </button>
                </div>
            </div>
        </div>
    )
}