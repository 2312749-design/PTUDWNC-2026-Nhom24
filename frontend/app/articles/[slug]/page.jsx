import PageClient from '../../PageClient'
import { ArticlePage } from '../../../src/CommunityPages'
import { publicContent } from '../../content-data'
import JsonLd from '../../JsonLd'
import { articleJsonLd } from '../../../src/structured-data'
import { getSiteUrl } from '../../../src/api/config'

export default async function Page({ params }) {
  const { slug } = await params
  const article = await publicContent(`/articles/${encodeURIComponent(slug)}`)
  return <>{article && <JsonLd data={articleJsonLd(article, getSiteUrl())} />}<PageClient><ArticlePage /></PageClient></>
}
