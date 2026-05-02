import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

async function signIn(request: Request) {
    const supabase = await createClient()
    const { origin } = new URL(request.url)

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${origin}/auth/callback`,
        },
    })

    if (error) {
        return NextResponse.redirect(`${origin}/login?error=Could not authenticate`)
    }

    return NextResponse.redirect(data.url)
}

export async function GET(request: Request) {
    return signIn(request)
}

export async function POST(request: Request) {
    return signIn(request)
}