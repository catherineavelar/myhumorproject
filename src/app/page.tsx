import { supabase } from '@/lib/supabaseClient'

export default async function Home() {
    const { data: captions, error } = await supabase
        .from('captions')
        .select('id, content, like_count, images(url)')
        .eq('is_public', true)
        .not('image_id', 'is', null)
        .order('like_count', { ascending: false })
        .limit(9)

    if (error) {
        return <p>Error loading captions: {error.message}</p>
    }

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #ff6ec7 0%, #ff9a3c 50%, #ffde59 100%)', position: 'relative', overflow: 'hidden', padding: '4rem 2rem' }}>
            {/* Flowers */}
            <img src="/flower.png" alt="" style={{ position: 'fixed', bottom: '-20px', right: '-20px', width: '280px', opacity: 0.9, pointerEvents: 'none', zIndex: 0 }} />
            <img src="/flower.png" alt="" style={{ position: 'fixed', top: '-30px', left: '-30px', width: '200px', opacity: 0.5, pointerEvents: 'none', zIndex: 0, transform: 'rotate(160deg)' }} />
            {/* Sparkles */}
            <img src="/sparkle.png" alt="" style={{ position: 'fixed', top: '40px', right: '60px', width: '50px', opacity: 0.85, pointerEvents: 'none', zIndex: 0 }} />
            <img src="/sparkle.png" alt="" style={{ position: 'fixed', bottom: '80px', left: '40px', width: '35px', opacity: 0.7, pointerEvents: 'none', zIndex: 0 }} />
            <img src="/sparkle.png" alt="" style={{ position: 'fixed', top: '45%', left: '30px', width: '25px', opacity: 0.6, pointerEvents: 'none', zIndex: 0 }} />

            <div style={{ position: 'relative', zIndex: 1, maxWidth: '1100px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h1 style={{ fontSize: '3.5rem', fontWeight: '900', color: 'white', textShadow: '2px 2px 0 #b5005b', lineHeight: 1.2, marginBottom: '0.75rem' }}>I Fear this Ate 😂</h1>
                    <p style={{ color: 'rgba(255,255,255,0.95)', fontSize: '1.1rem', fontFamily: 'Times New Roman, serif', fontStyle: 'italic' }}>
                        The top 9 most liked captions from the Humor Project — voted by real students.
                    </p>
                </div>

                {/* Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                    {captions.map((caption: any) => (
                        <div key={caption.id} style={{ backgroundColor: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', borderRadius: '20px', padding: '1rem', display: 'flex', flexDirection: 'column' }}>
                            {caption.images?.url && (
                                <img src={caption.images.url} alt="caption" style={{ width: '100%', borderRadius: '12px', marginBottom: '1rem', maxHeight: '160px', objectFit: 'cover' }} />
                            )}
                            <p style={{ color: 'white', fontSize: '1rem', fontWeight: '700', marginBottom: '0.5rem', textShadow: '1px 1px 0 rgba(0,0,0,0.15)' }}>{caption.content}</p>
                            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem' }}>❤️ {caption.like_count} likes</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}