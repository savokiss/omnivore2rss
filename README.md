# Omnivore2RSS

A simple project to turn your [Omnivore](https://omnivore.app/) inbox into an RSS feed.

This is a cloudflare worker project that can be easily deployed at the edge.

## Features
- Using Cloudflare Workers
- One Click Deployment
- Public Mode, get your feed instantly through <https://o2rss.detools.dev/public?token=yourtoken>

## Deployment

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/savokiss/omnivore2rss)

## Public Mode

You can get your feed instantly through:

```bash
https://o2rss.detools.dev/public?token=<your token>
```

> Please note that we do not store your token, but we also advise against saving any sensitive data in your feed.


## Usage
### Install dependencies

```bash
pnpm i
```

### Replace wrangler config

```bash
cp wrangler.example.toml wrangler.toml
```

Then replace the `OMNIVORE_AUTH_TOKEN` field.

Your omnivore auth token can be found here: <https://omnivore.app/settings/api>

### Deploy your worker

```bash
pnpm run deploy
```

### The Feed URL

```bash
https://<your-worker-domain>/feed
```

Add this url to your RSS reader, then enjoy reading articles in one place!

## Develop
```
pnpm dev
```

## License

[MIT](https://choosealicense.com/licenses/mit/)