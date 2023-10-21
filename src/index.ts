import { Hono } from 'hono'
import { GraphQLFetcher } from './request'
import { convertArticlesToRSS } from './utils'

const defaultUrl = 'https://api-prod.omnivore.app/api/graphql'

type Bindings = {
  OMNIVORE_API_URL: string
  OMNIVORE_AUTH_TOKEN: string
}

const app = new Hono<{ Bindings: Bindings }>()

app.get('/', async (c) => {
  return c.json({
    msg: 'Server is ready.'
  })
})

app.get('/feed', async (c) => {
  const omniUrl = c.env.OMNIVORE_API_URL ?? defaultUrl
  const apiToken = c.env.OMNIVORE_AUTH_TOKEN
  const api = GraphQLFetcher.getInstance(omniUrl, apiToken)
  const data = await api.request(undefined, 10, '')
  const articles = data.data.search.edges
  const feed = convertArticlesToRSS(articles, c.req.url)
  c.header('Content-Type', 'application/xml')
  return c.body(feed)
})

export default app
