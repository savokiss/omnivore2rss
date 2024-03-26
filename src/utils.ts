import mime from 'mime'

const sanitizeXML = (str: string) => {
  return str.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    .replace(/&(?!(amp;|lt;|gt;|apos;|quot;))/g, '&amp;')
}

const getImageType = (imageUrl: string) => {
  const urlWithoutParams = imageUrl.split('?')[0]
  return mime.getType(urlWithoutParams)
}

const createRSSItem = (article: any) => {
  const node = article['node']
  const title = sanitizeXML(node['title'])
  const link = sanitizeXML(node['url'])
  const content = sanitizeXML(node['content'])
  const author = node['author'] ? `<author>author@omnivore.app (${node['author']})</author>` : ''
  const imageType = node['image'] ? getImageType(node['image']) : null

  return `<item>
      <title>${title}</title>
      <link>${link}</link>
      <description><![CDATA[${content}]]></description>
      <pubDate>${new Date(node['createdAt']).toUTCString()}</pubDate>
      <guid isPermaLink="false">${node['id']}</guid>
      ${author}
      ${node['image'] ? `<enclosure url="${node['image']}" type="${imageType}" />` : ''}
  </item>`
}

export const convertArticlesToRSS = (articles: any[], reqUrl: string) => {
  const items = articles.map(createRSSItem).join('')
  const requestUrl = sanitizeXML(reqUrl)

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
      <title>Omnivore</title>
      <link>https://omnivore.app</link>
      <description>Articles from Omnivore</description>
      <atom:link href="${requestUrl}" rel="self" type="application/rss+xml" />
      ${items}
  </channel>
</rss>`
}
