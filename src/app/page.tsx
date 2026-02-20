import { supabase } from '@/lib/supabaseClient'

export default async function Home() {
  const { data: posts, error } = await supabase
      .from('sidechat_posts')
      .select('id, content, like_count, post_datetime_utc')
      .order('like_count', { ascending: false })
      .limit(10)

  if (error) {
    return <p>Error loading posts: {error.message}</p>
  }

  return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <main className="flex min-h-screen w-full max-w-3xl flex-col gap-6 py-32 px-16 bg-white dark:bg-black">
          <h1 className="text-6xl font-bold text-red-700">Top SideChat Posts 😂</h1>
          {posts.map((post) => (
              <div key={post.id} className="rounded-xl border border-zinc-200 p-5 dark:border-zinc-800">
                <p className="text-lg text-black dark:text-white">{post.content}</p>
                <p className="mt-2 text-sm text-zinc-500">❤️ {post.like_count} likes · {new Date(post.post_datetime_utc).toLocaleDateString()}</p>
              </div>
          ))}
        </main>
      </div>
  )
}