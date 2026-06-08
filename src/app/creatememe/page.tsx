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
    const [visibleCount, setVisibleCount] = useState(5)
    const [selectedCaption, setSelectedCaption] = useState<string | null>(null)
    const [showMeme, setShowMeme] = useState(false)
    const router = useRouter()
    const supabase = createClient()

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

    async function handleDownload() {
        if (!preview || !selectedCaption) return

        const img = new Image()
        img.crossOrigin = 'anonymous'
        img.src = preview

        img.onload = () => {
            const canvas = document.createElement('canvas')
            const captionHeight = 80
            canvas.width = img.width
            canvas.height = img.height + captionHeight

            const ctx = canvas.getContext('2d')!
            ctx.drawImage(img, 0, 0)

            ctx.fillStyle = 'white'
            ctx.fillRect(0, img.height, img.width, captionHeight)

            ctx.fillStyle = '#333'
            ctx.font = `bold ${img.width * 0.04}px sans-serif`
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'
            ctx.fillText(selectedCaption, img.width / 2, img.height + captionHeight / 2)

            const link = document.createElement('a')
            link.download = 'my-meme.png'
            link.href = canvas.toDataURL('image/png')
            link.click()
        }
    }

    async function handleSubmit() {
        if (!file || !token) return
        setLoading(true)
        setError(null)

        try {
            const presignRes = await fetch('https://api.almostcrackd.ai/pipeline/generate-presigned-url', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ contentType: file.type }),
            })
            const { presignedUrl, cdnUrl } = await presignRes.json()

            await fetch(presignedUrl, {
                method: 'PUT',
                headers: { 'Content-Type': file.type },
                body: file,
            })

            const registerRes = await fetch('https://api.almostcrackd.ai/pipeline/upload-image-from-url', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ imageUrl: cdnUrl, isCommonUse: false }),
            })
            const { imageId } = await registerRes.json()

            const captionRes = await fetch('https://api.almostcrackd.ai/pipeline/generate-captions', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
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

            <button
                onClick={() => router.back()}
                style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', background: 'none', border: 'none', color: 'white', fontSize: '0.9rem', fontWeight: '700', cursor: 'pointer', opacity: 0.8, zIndex: 3 }}
            >
                ← Back
            </button>

            <div style={{ backgroundColor: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', borderRadius: '24px', padding: '2.5rem 2rem', maxWidth: '520px', width: '100%', position: 'relative', zIndex: 2, textAlign: 'center' }}>

                {step === 'upload' && (
                    <>
                        <h1 style={{ fontSize: '2rem', fontWeight: '900', color: 'white', textShadow: '2px 2px 0 #b5005b', marginBottom: '0.5rem' }}>Create Your Caption 📸</h1>
                        <p style={{ color: 'rgba(255,255,255,0.9)', fontFamily: 'Times New Roman, serif', fontStyle: 'italic', marginBottom: '2rem' }}>Start with a photo. Leave with something funny.</p>

                        <label style={{ display: 'block', border: '2px dashed rgba(255,255,255,0.6)', borderRadius: '16px', padding: '2rem', cursor: 'pointer', marginBottom: '1.5rem' }}>
                            <input type="file" accept="image/jpeg,image/jpg,image/png,image/webp,image/gif,image/heic" onChange={handleFileChange} style={{ display: 'none' }} />
                            {preview ? (
                                <img src={preview} alt="preview" style={{ width: '100%', borderRadius: '12px', maxHeight: '350px', objectFit: 'contain' }} />
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
                        {!showMeme ? (
                            <>
                                <h1 style={{ fontSize: '2rem', fontWeight: '900', color: 'white', textShadow: '2px 2px 0 #b5005b', marginBottom: '0.5rem' }}>Your Captions Are In! 👑</h1>
                                <p style={{ color: 'rgba(255,255,255,0.9)', fontFamily: 'Times New Roman, serif', fontStyle: 'italic', marginBottom: '1.5rem' }}>Select your favorite caption, then hit Create Meme.</p>
                                {preview && <img src={preview} alt="your meme" style={{ width: '100%', borderRadius: '12px', maxHeight: '270px', objectFit: 'contain', background: 'rgba(0,0,0,0.05)', marginBottom: '1.5rem' }} />}

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                    {captions.slice(0, visibleCount).map((caption, i) => (
                                        <div
                                            key={i}
                                            onClick={() => setSelectedCaption(caption)}
                                            style={{
                                                backgroundColor: selectedCaption === caption ? 'rgba(255,110,199,0.5)' : 'rgba(255,255,255,0.3)',
                                                border: selectedCaption === caption ? '2px solid #ff6ec7' : '2px solid transparent',
                                                borderRadius: '12px', padding: '0.75rem 1rem', color: 'white', fontWeight: '600',
                                                textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s ease'
                                            }}
                                        >
                                            {selectedCaption === caption && <span style={{ marginRight: '0.5rem' }}>✅</span>}
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

                                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                                    <button
                                        onClick={() => setShowMeme(true)}
                                        disabled={!selectedCaption}
                                        onMouseEnter={e => { if (selectedCaption) (e.target as HTMLButtonElement).style.boxShadow = '0 0 16px 4px rgba(255,110,199,0.6)' }}
                                        onMouseLeave={e => (e.target as HTMLButtonElement).style.boxShadow = 'none'}
                                        style={{
                                            flex: 1, padding: '0.75rem',
                                            background: selectedCaption ? 'linear-gradient(135deg, #ff6ec7, #ff9a3c)' : 'rgba(255,255,255,0.3)',
                                            color: selectedCaption ? 'white' : 'rgba(255,255,255,0.5)',
                                            border: 'none', borderRadius: '50px', fontSize: '1rem', fontWeight: '800',
                                            cursor: selectedCaption ? 'pointer' : 'not-allowed',
                                            transition: 'all 0.3s ease',
                                            boxShadow: 'none'
                                        }}
                                    >
                                        Create Meme 🔥
                                    </button>

                                    <button
                                        onClick={() => { setStep('upload'); setFile(null); setPreview(null); setCaptions([]); setVisibleCount(5); setSelectedCaption(null); setShowMeme(false) }}
                                        onMouseEnter={e => (e.target as HTMLButtonElement).style.boxShadow = '0 0 16px 4px rgba(255,110,199,0.5)'}
                                        onMouseLeave={e => (e.target as HTMLButtonElement).style.boxShadow = 'none'}
                                        style={{ flex: 1, padding: '0.75rem', background: 'rgba(255,255,255,0.9)', color: '#ff6ec7', border: 'none', borderRadius: '50px', fontSize: '1rem', fontWeight: '800', cursor: 'pointer', boxShadow: 'none', transition: 'box-shadow 0.2s ease' }}
                                    >
                                        Try Another Photo 🌸
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <h1 style={{ fontSize: '2rem', fontWeight: '900', color: 'white', textShadow: '2px 2px 0 #b5005b', marginBottom: '1rem' }}>Your Meme is Ready! 🔥</h1>

                                <div style={{ backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: '16px', overflow: 'hidden', marginBottom: '1.5rem' }}>
                                    <img src={preview!} alt="meme" style={{ width: '100%', display: 'block', maxHeight: '350px', objectFit: 'contain' }} />
                                    <p style={{ padding: '1rem', fontSize: '1rem', fontWeight: '700', color: '#333', textAlign: 'center', margin: 0 }}>{selectedCaption}</p>
                                </div>

                                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '0.5rem' }}>
                                    <button
                                        onClick={handleDownload}
                                        onMouseEnter={e => (e.target as HTMLButtonElement).style.boxShadow = '0 0 16px 4px rgba(255,110,199,0.6)'}
                                        onMouseLeave={e => (e.target as HTMLButtonElement).style.boxShadow = 'none'}
                                        style={{ width: 'auto', padding: '0.75rem 2.5rem', background: 'linear-gradient(135deg, #ff6ec7, #ff9a3c)', color: 'white', border: 'none', borderRadius: '50px', fontSize: '1rem', fontWeight: '800', cursor: 'pointer', boxShadow: 'none', transition: 'box-shadow 0.2s ease' }}
                                    >
                                        Download Meme
                                    </button>

                                    <button
                                        onClick={() => setShowMeme(false)}
                                        onMouseEnter={e => (e.target as HTMLButtonElement).style.boxShadow = '0 0 16px 4px rgba(255,110,199,0.6)'}
                                        onMouseLeave={e => (e.target as HTMLButtonElement).style.boxShadow = 'none'}
                                        style={{ width: 'auto', padding: '0.75rem 2.5rem', background: 'linear-gradient(135deg, #ff6ec7, #ff9a3c)', color: 'white', border: '1.5px solid rgba(255,255,255,0.7)', borderRadius: '50px', fontSize: '1rem', fontWeight: '800', cursor: 'pointer', boxShadow: 'none', transition: 'box-shadow 0.2s ease' }}
                                    >
                                        Go Back
                                    </button>
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}