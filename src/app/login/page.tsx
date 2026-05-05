export default function LoginPage() {
    return (
        <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #ff6ec7 0%, #ff9a3c 50%, #ffde59 100%)', position: 'relative', overflow: 'hidden' }}>
            <img src="/flower.png" alt="" style={{ position: 'absolute', top: '-30px', left: '-30px', width: '200px', opacity: 0.5, pointerEvents: 'none', zIndex: 1, transform: 'rotate(160deg)' }} />
            <img src="/sparkle.png" alt="" style={{ position: 'absolute', top: '40px', right: '60px', width: '50px', opacity: 0.85, pointerEvents: 'none', zIndex: 1 }} />
            <img src="/sparkle.png" alt="" style={{ position: 'absolute', bottom: '80px', left: '40px', width: '35px', opacity: 0.7, pointerEvents: 'none', zIndex: 1 }} />
            <img src="/sparkle.png" alt="" style={{ position: 'absolute', top: '45%', left: '30px', width: '25px', opacity: 0.6, pointerEvents: 'none', zIndex: 1 }} />
            <img src="/princess.png" alt="" style={{ position: 'absolute', bottom: '0px', right: '0px', width: '420px', pointerEvents: 'none', zIndex: 1 }} />
            <img src="/secondprincess.png" alt="" style={{ position: 'absolute', bottom: '0px', left: '0px', width: '380px', pointerEvents: 'none', zIndex: 1, transform: 'scaleX(-1)' }} />
            <div style={{ backgroundColor: 'rgba(0,0,0,0.15)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', padding: '4rem 2rem', borderRadius: '24px', textAlign: 'center', maxWidth: '460px', width: '100%', position: 'relative', zIndex: 2, border: '1px solid rgba(255,255,255,0.2)' }}>
                <h1 style={{ fontSize: '2.2rem', fontWeight: '900', color: 'white', textShadow: '1px 1px 0 rgba(180,0,90,0.8)', marginBottom: '2rem', lineHeight: 1.2, fontFamily: 'Georgia, serif' }}>Babes… you need to log in.</h1>
                <form action="/auth/login" method="POST">
                    <button
                        type="submit"
                        style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.45), rgba(255,182,213,0.25))', color: '#ff2d78', border: '1.5px solid rgba(255,255,255,0.7)', borderRadius: '50px', padding: '0.75rem 3rem', fontSize: '1rem', fontWeight: '800', cursor: 'pointer', letterSpacing: '1px', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', marginBottom: '1rem' }}
                    >
                        Sign in with Google 💋
                    </button>
                </form>
                <p style={{ color: 'rgba(255,255,255,0.90)', fontFamily: 'Times New Roman, serif', fontStyle: 'italic', lineHeight: 1.6, fontSize: '0.95rem', letterSpacing: '0.5px' }}>
                    Do not make her ask twice
                </p>
            </div>
        </div>
    )
}