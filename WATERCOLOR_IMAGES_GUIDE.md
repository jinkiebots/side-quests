# How to Create Watercolor Food Images for Recipe Cards

## Option 1: Use AI Image Generation Tools

### Recommended Tools:
1. **Midjourney** - Excellent for watercolor styles
2. **DALL-E 3** - Good for food illustrations
3. **Stable Diffusion** - Free option with watercolor models
4. **Adobe Firefly** - Professional quality

### Prompts to Use:

**For Ramen Bowl:**
```
"Studio Ghibli style watercolor painting of a ramen bowl, hand-drawn illustration, soft watercolor washes, blue ceramic bowl with white rim, rich brown broth, soft-boiled egg with yellow yolk, pink chashu pork slices, green scallions, traditional Japanese style, painted on watercolor paper, organic brushstrokes, muted colors, aged paper texture"
```

**For Toast & Egg:**
```
"Studio Ghibli watercolor illustration of breakfast toast with fried egg, hand-painted, golden brown toast slice, sunny-side up egg with bright yellow yolk, fresh berries, honey drizzle, watercolor technique, soft brushstrokes, warm colors, painted on textured paper"
```

**For Mushroom Soup:**
```
"Studio Ghibli style watercolor painting of mushroom soup bowl, hand-drawn, earthy brown ceramic bowl, creamy golden soup, wild mushrooms floating, fresh herbs, steam rising, watercolor washes, organic shapes, natural colors, aged paper texture"
```

**For Magical Cake:**
```
"Studio Ghibli watercolor illustration of magical cake, hand-painted, golden brown cake layers, pink frosting decoration, sparkles and magical elements, soft watercolor technique, whimsical style, warm pastel colors, painted on watercolor paper"
```

**For Bento Box:**
```
"Studio Ghibli style watercolor painting of Japanese bento box, hand-drawn, red lacquered box with lid slightly open, white rice, small fish, pickled plum, green vegetables, traditional Japanese food, watercolor technique, soft colors, aged paper texture"
```

## Option 2: Use CSS Filters (Quick Solution)

Add these CSS filters to make any food image look more watercolor-like:

```css
.watercolorImage img {
  filter: 
    sepia(0.3) 
    saturate(1.2) 
    contrast(0.9) 
    brightness(1.1) 
    hue-rotate(10deg)
    blur(0.5px);
  mix-blend-mode: multiply;
}
```

## Option 3: Use Existing Watercolor Images

Search for:
- "Studio Ghibli food watercolor"
- "Japanese food watercolor illustration"
- "Hand-painted food watercolor"
- "Vintage food illustration"

## Implementation

Once you have the images:

1. Save them as PNG files with transparent backgrounds
2. Place them in `/public/images/` folder
3. Update the component to use actual images instead of emojis

Example:
```jsx
<img 
  src="/images/ramen-watercolor.png" 
  alt="Ramen Bowl" 
  className={styles.watercolorFoodImage}
/>
```

## Current Status

Right now the recipe cards use emoji placeholders with watercolor-style backgrounds. The cards now look more like actual notecards with:
- Cream/off-white notecard color
- Proper notecard proportions (400px wide, 500px tall)
- Slight rotation (-1deg) for organic feel
- Enhanced aging effects (stains, rips, dark spots)
- Watercolor-style image placeholders

To complete the look, replace the emoji placeholders with actual watercolor food illustrations using the prompts above.
