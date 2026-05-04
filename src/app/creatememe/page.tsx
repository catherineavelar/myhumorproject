'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function CreateMemePage() {
    const [user, setUser] = useState<any>(null)
    const [token, setToken] = useState<string | null>(null)
    const [file, setFile] = useState<File | null>(null)
    const [preview, setPreview] = useState<string | null>(null)
    const [captions, setCaptions] = useState<string[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [step, setStep] = useState<'upload' | 'result'>('upload')
    const router = useRouter()
    const supabase = createClient()
    const [visibleCount, setVisibleCount] = useState(5)

    useEffect(() => {
        async function load() {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) {
                router.push('/login')
                return
            }
            setUser(session.user)
            setToken(session.access_token)
        }
        load()
    }, [])

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const selected = e.target.files?.[0]
        if (!selected) return
        setFile(selected)
        setPreview(URL.createObjectURL(selected))
    }

    async function handleSubmit() {
        if (!file || !token) return
        setLoading(true)
        setError(null)

        try {
            // Step 1: Get presigned URL
            const presignRes = await fetch('https://api.almostcrackd.ai/pipeline/generate-presigned-url', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ contentType: file.type }),
            })
            const { presignedUrl, cdnUrl } = await presignRes.json()

            // Step 2: Upload image to presigned URL
            await fetch(presignedUrl, {
                method: 'PUT',
                headers: { 'Content-Type': file.type },
                body: file,
            })

            // Step 3: Register image
            const registerRes = await fetch('https://api.almostcrackd.ai/pipeline/upload-image-from-url', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ imageUrl: cdnUrl, isCommonUse: false }),
            })
            const { imageId } = await registerRes.json()

            // Step 4: Generate captions
            const captionRes = await fetch('https://api.almostcrackd.ai/pipeline/generate-captions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ imageId }),
            })
            const captionData = await captionRes.json()
            setCaptions(captionData.map((c: any) => c.content))
            setStep('result')
        } catch (err: any) {
            setError('Something went wrong. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    if (!user) return null

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #ff6ec7 0%, #ff9a3c 50%, #ffde59 100%)', position: 'relative', overflow: 'hidden', padding: '2rem' }}>
            <img src="/flower.png" alt="" style={{ position: 'absolute', bottom: '-20px', right: '-20px', width: '280px', opacity: 0.9, pointerEvents: 'none', zIndex: 1 }} />
            <img src="/flower.png" alt="" style={{ position: 'absolute', top: '-30px', left: '-30px', width: '200px', opacity: 0.5, pointerEvents: 'none', zIndex: 1, transform: 'rotate(160deg)' }} />
            <img src="/sparkle.png" alt="" style={{ position: 'absolute', top: '40px', right: '60px', width: '50px', opacity: 0.85, pointerEvents: 'none', zIndex: 1 }} />
            <img src="/sparkle.png" alt="" style={{ position: 'absolute', bottom: '80px', left: '40px', width: '35px', opacity: 0.7, pointerEvents: 'none', zIndex: 1 }} />

            <div style={{ backgroundColor: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', borderRadius: '24px', padding: '2.5rem 2rem', maxWidth: '520px', width: '100%', position: 'relative', zIndex: 2, textAlign: 'center' }}>

                {step === 'upload' && (
                    <>
                        <h1 style={{ fontSize: '2rem', fontWeight: '900', color: 'white', textShadow: '2px 2px 0 #b5005b', marginBottom: '0.5rem' }}>Create Your Meme 📸</h1>
                        <p style={{ color: 'rgba(255,255,255,0.9)', fontFamily: 'Times New Roman, serif', fontStyle: 'italic', marginBottom: '2rem' }}>Upload a photo and let the AI do the rest.</p>

                        <label style={{ display: 'block', border: '2px dashed rgba(255,255,255,0.6)', borderRadius: '16px', padding: '2rem', cursor: 'pointer', marginBottom: '1.5rem' }}>
                            <input type="file" accept="image/jpeg,image/jpg,image/png,image/webp,image/gif,image/heic" onChange={handleFileChange} style={{ display: 'none' }} />
                            {preview ? (
                                <img src={preview} alt="preview" style={{ width: '100%', borderRadius: '12px', maxHeight: '250px', objectFit: 'cover' }} />
                            ) : (
                                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>Click to upload an image 🌸</p>
                            )}
                        </label>

                        {error && <p style={{ color: 'white', marginBottom: '1rem' }}>{error}</p>}

                        <button
                            onClick={handleSubmit}
                            disabled={!file || loading}
                            style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.9)', color: '#ff6ec7', border: 'none', borderRadius: '50px', fontSize: '1rem', fontWeight: '800', cursor: file && !loading ? 'pointer' : 'not-allowed', opacity: file && !loading ? 1 : 0.6 }}
                        >
                            {loading ? 'Generating captions... ✨' : 'Generate Captions 💅'}
                        </button>
                    </>
                )}

                {step === 'result' && (
                    <>
                        <h1 style={{ fontSize: '2rem', fontWeight: '900', color: 'white', textShadow: '2px 2px 0 #b5005b', marginBottom: '0.5rem' }}>Your Captions Are In! 👑</h1>
                        <p style={{ color: 'rgba(255,255,255,0.9)', fontFamily: 'Times New Roman, serif', fontStyle: 'italic', marginBottom: '1.5rem' }}>The AI has spoken. 💋</p>
                        {preview && <img src={preview} alt="your meme" style={{ width: '100%', borderRadius: '12px', maxHeight: '200px', objectFit: 'cover', marginBottom: '1.5rem' }} />}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                            {captions.slice(0, visibleCount).map((caption, i) => (
                                <div key={i} style={{ backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: '12px', padding: '0.75rem 1rem', color: 'white', fontWeight: '600', textAlign: 'left' }}>
                                    {caption}
                                </div>
                            ))}
                        </div>
                        {visibleCount < captions.length && (
                            <button
                                onClick={() => setVisibleCount(prev => prev + 5)}
                                style={{ width: '100%', padding: '0.6rem', background: 'rgba(0,0,0,0.2)', color: 'white', border: '1.5px solid rgba(255,255,255,0.4)', borderRadius: '12px', fontSize: '0.9rem', fontWeight: '700', cursor: 'pointer', marginBottom: '1rem' }}
                            >
                                Show 5 more ✨
                            </button>
                        )}
                        <button
                            onClick={() => { setStep('upload'); setFile(null); setPreview(null); setCaptions([]); setVisibleCount(5) }}
                            style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.9)', color: '#ff6ec7', border: 'none', borderRadius: '50px', fontSize: '1rem', fontWeight: '800', cursor: 'pointer' }}
                        >
                            Try Another Photo 🌸
                        </button>
                    </>
                )}
            </div>
        </div>
    )
}