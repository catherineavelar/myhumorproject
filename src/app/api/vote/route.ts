import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    const supabase = await createClient()

    // Check if user is logged in
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { caption_id, vote_value } = await request.json()

    // Get the user's profile id
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single()

    if (profileError || !profile) {
        return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // Insert the vote
    const { error } = await supabase
        .from('caption_votes')
        .insert({
            caption_id,
            profile_id: profile.id,
            vote_value,
            created_by_user_id: user.id,
            modified_by_user_id: user.id,
            is_from_study: false,
            created_datetime_utc: new Date().toISOString(),
            modified_datetime_utc: new Date().toISOString(),
        })

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
}