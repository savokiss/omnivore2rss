import { Context, Hono } from 'hono'
import { GraphQLFetcher } from './request'
import { convertArticlesToRSS } from './utils'

const defaultUrl = 'https://api-prod.omnivore.app/api/graphql'

type Bindings = {
  OMNIVORE_API_URL: string
  OMNIVORE_AUTH_TOKEN: string
  PUBLIC_MODE: string
}

type OmniOptions = {
  reqUrl: string
  limit?: number
}

const app = new Hono<{ Bindings: Bindings }>()

app.get('/', async (c) => {
  if (c.env.PUBLIC_MODE) {
    return c.text('Public mode enabled, please use the /public?token=<your omnivore token> endpoint.')
  }
  return c.json({
    msg: 'Server is ready.'
  })
})

app.get('/feed', async (c) => {
  if (c.env.PUBLIC_MODE) {
    return c.json({
      msg: 'Public mode enabled, please use the /public endpoint.'
    })
  }
  const { limit } = c.req.query()
  const omniUrl = c.env.OMNIVORE_API_URL ?? defaultUrl
  const token = c.env.OMNIVORE_AUTH_TOKEN
  // singleton
  const api = GraphQLFetcher.getInstance(omniUrl, token)
  const feed = await handleTransform(api, {
    reqUrl: c.req.url,
    limit: parseInt(limit)
  })
  c.header('Content-Type', 'application/xml')
  return c.body(feed)
})

app.get('/public', async (c) => {
  if (!c.env.PUBLIC_MODE) {
    return c.json({
      msg: 'Public mode disabled, please use the /feed endpoint.'
    })
  }
  const { token, limit } = c.req.query()
  if (!token) {
    return c.json({
      msg: 'In public mode, please provide a token, or you can deploy it yourself on cloudflare.'
    })
  }
  const omniUrl = c.env.OMNIVORE_API_URL ?? defaultUrl
  // per request instance
  const api = new GraphQLFetcher(omniUrl, token)
  const feed = await handleTransform(api, {
    reqUrl: c.req.url,
    limit: parseInt(limit)
  })
  c.header('Content-Type', 'application/xml')
  return c.body(feed)
})

async function handleTransform (api: GraphQLFetcher, options: OmniOptions) {
  const { reqUrl, limit = 10 } = options
  const data = await api.request(undefined, limit, '')
  const articles = data.data.search.edges
  const feed = convertArticlesToRSS(articles, reqUrl)
  return feed
}

export default app
