import { supabase } from '@/lib/supabaseClient'
import styles from './mystyles.module.css'

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
        <div className="flex min-h-screen justify-center bg-zinc-50 font-sans dark:bg-black">
            <main className="w-full flex flex-col items-center gap-6 py-32 px-10 bg-white dark:bg-black">

                <div style={{ borderLeft: '6px solid #b91c1c', paddingLeft: '1rem' }}>
                    <h1 className="text-6xl font-bold text-red-700">I Fear this Ate 😂</h1>
                    <p style={{ color: '#52525b', fontSize: '1.125rem', marginTop: '0.5rem' }}>
                        The top 9 most liked captions from the Humor Project — voted by real students.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginTop: '2rem'}}>
                    {captions.map((caption: any) => (
                        <div key={caption.id} className={styles.card}>
                            {caption.images?.url && (
                                <img src={caption.images.url} alt="caption image" className="w-full rounded-lg mb-4 object-cover max-h-64" />
                            )}
                            <p className="text-lg text-black dark:text-white">{caption.content}</p>
                            <p className="mt-2 text-sm text-zinc-500">❤️ {caption.like_count} likes</p>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    )
}