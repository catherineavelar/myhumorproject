import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function ProtectedPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    return (
        <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9f9f9' }}>
            <div style={{ backgroundColor: 'white', padding: '3rem', borderRadius: '12px', border: '1px solid #e4e4e7', textAlign: 'center', maxWidth: '400px', width: '100%' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#b91c1c', marginBottom: '0.5rem' }}>Welcome! 🎉</h1>
                <p style={{ color: '#52525b', marginBottom: '1rem' }}>You are logged in as:</p>
                <p style={{ fontWeight: 'bold', color: '#111' }}>{user.email}</p>
            </div>
        </div>
    )
}
