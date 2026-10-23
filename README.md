# mikecann.app

Mike's Apps, the page at [mikecann.app](https://mikecann.app) listing the apps I've built that are still running.

## Development

```sh
npm install
npm run dev
npm run check   # asset names, types and a deploy dry run
```

## Adding an app

Add one entry to `apps` in `src/apps.ts`. The page and its per-app CSS are generated from that list.

- Apps for other people (`status: "open"`, or `"soon"` while they wait on the App Store) get a polaroid print in "Things you can use". Give them a `kind`, an `image` and a `print` (its desktop width out of 12 columns, tilt, tape or pin colour and kind-sticker colours). Each row of prints should add up to 12 columns.
- Apps just for me and the family get a pinned index card with their `icon`. Use `status: "personal"` if anyone can open it (the card gets an arrow) or `status: "private"` if it needs a sign-in (the card gets a lock). List the personal ones first: on desktop they share the top row of cards, with the private ones three to a row underneath.
- Links in the Elsewhere section are in `elsewhere`, in the same file.

Poddle's App Store badge is plain "Coming soon" text until `APP_STORE_LIVE` in `src/apps.ts` is set to `true`.

## Images

Images and icons live in `public/assets` and are served with Workers static assets. Screenshots go in `shots/` (WebP, about 2x the size they're shown at) and icons in `icons/`.

Files are cached for a year, so every filename includes a hash of its contents. After adding or changing an image, run:

```sh
npm run assets
```

It renames new or changed files (`foo.webp` becomes `foo.1a2b3c4d.webp`) and updates their paths in `src/`. `npm run check` fails if a file is unhashed, missing or unused.

## Deployment

Cloudflare Workers hosts the site at `mikecann.app`, with `www.mikecann.app` redirected to the apex domain.
