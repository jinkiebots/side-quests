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

### Deploy to GitHub Pages

If you prefer GitHub Pages, you'll need to configure static export:

1. The `next.config.js` is already configured with:
   ```js
   output: 'export',
   basePath: '/ghibli-recipes',
   ```

2. Follow the GitHub Actions workflow that's already set up in `.github/workflows/deploy.yml`

### Manual Build and Test

To test the build locally:

```bash
npm run build
npm start
```

