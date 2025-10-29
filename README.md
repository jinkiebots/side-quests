# Ghibli Recipes

This is ghibli recipe

## Studio Ghibli Recipe Box

Shake your phone to discover magical recipes with handwritten notes from the Ghibli Kitchen!

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

### Deploy to Vercel (Recommended)

Vercel is the easiest way to deploy Next.js apps and is built by the creators of Next.js.

#### Option 1: Via Vercel Dashboard (Easiest)

1. Push your code to GitHub
   ```bash
   git add .
   git commit -m "Ready for Vercel deployment"
   git push
   ```

2. Go to [vercel.com](https://vercel.com) and sign up/login with GitHub

3. Click **"Add New Project"** and import your `dust-bunny-collection` repository

4. Vercel will auto-detect Next.js and configure everything automatically

5. Click **"Deploy"** - your site will be live in seconds!

#### Option 2: Via Vercel CLI

```bash
npm i -g vercel
vercel
```

Follow the prompts and your site will be deployed!

**Your site will be available at:** `https://dust-bunny-collection.vercel.app` (or your custom domain)

### Deploy to GitHub Pages

If you prefer GitHub Pages, you'll need to configure static export:

1. Update `next.config.js` to include:
   ```js
   output: 'export',
   basePath: '/dust-bunny-collection',
   ```

2. Follow the GitHub Actions workflow that's already set up in `.github/workflows/deploy.yml`

### Manual Build and Test

To test the build locally:

```bash
npm run build
npm start
```

