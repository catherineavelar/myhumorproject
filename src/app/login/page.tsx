import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function LoginPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
        redirect('/protected')
    }

    const { data } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: 'http://localhost:3000/auth/callback',
        },
    })

    return (
        <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9f9f9' }}>
            <div style={{ backgroundColor: 'white', padding: '3rem', borderRadius: '12px', border: '1px solid #e4e4e7', textAlign: 'center', maxWidth: '400px', width: '100%' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#b91c1c', marginBottom: '0.5rem' }}>I Fear this Ate 😂</h1>
                <p style={{ color: '#52525b', marginBottom: '2rem' }}>Sign in to access the top captions</p>
                <a href={data.url ?? '#'} style={{ display: 'block', backgroundColor: '#111', color: 'white', padding: '0.75rem 2rem', borderRadius: '8px', fontSize: '1rem', textDecoration: 'none', width: '100%', boxSizing: 'border-box' }}>
                    Sign in with Google
                </a>
            </div>
        </div>
    )
}