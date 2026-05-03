import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { caption_id, vote_value } = await request.json()

    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single()

    if (profileError || !profile) {
        console.error('Profile error:', profileError)
        return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    const { error } = await supabase
        .from('caption_votes')
        .upsert({
            caption_id,
            profile_id: profile.id,
            vote_value,
            created_by_user_id: user.id,
            modified_by_user_id: user.id,
            is_from_study: false,
            created_datetime_utc: new Date().toISOString(),
            modified_datetime_utc: new Date().toISOString(),
        }, { onConflict: 'profile_id,caption_id' })

    if (error) {
        console.error('Insert error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
}