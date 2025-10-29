# Custom Handwritten Font Setup Instructions

## Quick Setup Steps

### 1. Download Your Font
- Go to the Free Handwritten Fonts collection
- Download the font you want (usually .ttf or .otf format)

### 2. Convert to Web Fonts
- Use an online converter like CloudConvert or Convertio
- Convert to both .woff2 and .woff formats
- .woff2 is preferred for modern browsers
- .woff is fallback for older browsers

### 3. Add Font Files to Project
- Place the converted files in: `public/fonts/`
- Rename them to:
  - `custom-handwritten.woff2`
  - `custom-handwritten.woff`

### 4. Font is Ready!
The CSS is already set up to use your custom font. Once you add the font files, it will automatically be used for:
- Main title ("Studio Ghibli Recipe Box")
- Recipe titles (e.g., "Kiki's Magical Cake")

### 5. Optional: Change Font Name
If you want to use a different font name, update the CSS:
```css
@font-face {
  font-family: 'YourFontName';  /* Change this */
  src: url('/fonts/your-font-name.woff2') format('woff2'),
       url('/fonts/your-font-name.woff') format('woff');
}
```

Then update the font-family references:
```css
.title {
  font-family: 'YourFontName', 'Nothing You Could Do', cursive;
}
```

## Current Font Setup
- **Font files location**: `public/fonts/`
- **Font name**: `CustomHandwritten`
- **Fallback fonts**: `Nothing You Could Do`, `cursive`
- **Applied to**: Titles and recipe titles

## Testing
1. Add your font files to `public/fonts/`
2. Refresh the page at `http://localhost:3000`
3. Navigate to the Studio Ghibli Recipe Box
4. Your custom handwritten font should appear!
