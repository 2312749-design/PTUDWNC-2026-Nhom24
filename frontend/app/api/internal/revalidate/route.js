import { timingSafeEqual } from 'node:crypto'
import { revalidatePath } from 'next/cache'
import { publicContent } from '../../../content-data'

export async function POST(request) {
  const expected = process.env.INTERNAL_REVALIDATE_SECRET
  const supplied = request.headers.get('authorization')?.replace(/^Bearer /, '') || ''
  if (!expected || supplied.length !== expected.length || !timingSafeEqual(Buffer.from(supplied), Buffer.from(expected))) {
    return new Response(null, { status: 404 })
  }
  if (!await publicContent('/categories')) return new Response(null, { status: 503 })
  revalidatePath('/')
  revalidatePath('/categories')
  return Response.json({ revalidated: true })
}
