'use client'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
    const handleLogin = async () => {
        const supabase = createClient()
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        })
    }

    return (
        <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9f9f9' }}>
            <div style={{ backgroundColor: 'white', padding: '3rem', borderRadius: '12px', border: '1px solid #e4e4e7', textAlign: 'center', maxWidth: '400px', width: '100%' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#b91c1c', marginBottom: '0.5rem' }}>I Fear this Ate 😂</h1>
                <p style={{ color: '#52525b', marginBottom: '2rem' }}>Sign in to access the top captions</p>
                <button onClick={handleLogin} style={{ backgroundColor: '#111', color: 'white', padding: '0.75rem 2rem', borderRadius: '8px', border: 'none', fontSize: '1rem', cursor: 'pointer', width: '100%' }}>
                    Sign in with Google
                </button>
            </div>
        </div>
    )
}