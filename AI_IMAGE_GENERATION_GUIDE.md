# Studio Ghibli Watercolor Food Images - Generation Guide

## 🎨 **Perfect Prompts for Each Recipe**

### 1. **Ramen Bowl** (Spirited Away Bathhouse Stew)
**Midjourney Prompt:**
```
Studio Ghibli watercolor painting of a traditional Japanese ramen bowl, hand-drawn illustration, blue ceramic bowl with white rim, rich brown-orange broth, soft-boiled egg with bright yellow yolk, pink chashu pork slices, green scallions, wavy noodles, watercolor technique, soft brushstrokes, muted colors, painted on watercolor paper, aged paper texture, magical lighting --ar 1:1 --style raw
```

**DALL-E 3 Prompt:**
```
A Studio Ghibli-style watercolor illustration of a steaming bowl of ramen. The bowl is blue ceramic with a white rim, filled with rich brown-orange broth. It features a soft-boiled egg with a bright yellow yolk, pink chashu pork slices, and green scallions. The noodles are wavy and golden. The illustration is hand-painted in watercolor style with soft brushstrokes, muted colors, and painted on textured watercolor paper with subtle aging effects.
```

### 2. **Toast & Egg** (Howl's Moving Castle Breakfast)
**Midjourney Prompt:**
```
Studio Ghibli watercolor painting of breakfast toast with fried egg, hand-drawn illustration, golden brown toast slice, sunny-side up egg with bright yellow yolk, fresh red berries, honey drizzle, butter pat, watercolor technique, soft brushstrokes, warm colors, painted on watercolor paper, magical morning light --ar 1:1 --style raw
```

**DALL-E 3 Prompt:**
```
A Studio Ghibli-style watercolor illustration of a magical breakfast plate. It shows a thick slice of golden-brown toast with a perfectly fried sunny-side up egg on top, featuring a bright yellow yolk. Fresh red berries are scattered around, and there's a drizzle of golden honey. The illustration is hand-painted in watercolor style with soft brushstrokes, warm colors, and painted on textured watercolor paper.
```

### 3. **Mushroom Soup** (Totoro's Forest Mushroom Soup)
**Midjourney Prompt:**
```
Studio Ghibli watercolor painting of mushroom soup bowl, hand-drawn illustration, earthy brown ceramic bowl, creamy golden soup, wild mushrooms floating, fresh herbs, steam rising, watercolor technique, organic shapes, natural colors, painted on watercolor paper, forest magic --ar 1:1 --style raw
```

**DALL-E 3 Prompt:**
```
A Studio Ghibli-style watercolor illustration of a warm bowl of mushroom soup. The bowl is earthy brown ceramic, filled with creamy golden soup. Wild mushrooms float in the broth, and fresh green herbs are scattered on top. Gentle steam rises from the soup. The illustration is hand-painted in watercolor style with organic shapes, natural colors, and painted on textured watercolor paper with forest-like magical elements.
```

### 4. **Magical Cake** (Kiki's Delivery Service Bread)
**Midjourney Prompt:**
```
Studio Ghibli watercolor painting of magical cake, hand-drawn illustration, golden brown cake layers, pink frosting decoration, sparkles and magical elements, soft watercolor technique, whimsical style, warm pastel colors, painted on watercolor paper, enchanted bakery --ar 1:1 --style raw
```

**DALL-E 3 Prompt:**
```
A Studio Ghibli-style watercolor illustration of a magical cake. The cake has golden-brown layers with pink frosting decorations. Magical sparkles and twinkling lights surround it. The illustration is hand-painted in watercolor style with whimsical elements, warm pastel colors, and painted on textured watercolor paper with enchanted bakery vibes.
```

### 5. **Bento Box** (Princess Mononoke Forest Salad)
**Midjourney Prompt:**
```
Studio Ghibli watercolor painting of Japanese bento box, hand-drawn illustration, red lacquered box with lid slightly open, white rice, small silver fish, dark red pickled plum, green vegetables, traditional Japanese food, watercolor technique, soft colors, painted on watercolor paper, forest spirits --ar 1:1 --style raw
```

**DALL-E 3 Prompt:**
```
A Studio Ghibli-style watercolor illustration of a traditional Japanese bento box. The red lacquered box has its lid slightly open, revealing white rice, a small silver fish, a dark red pickled plum, and green vegetables. The illustration is hand-painted in watercolor style with soft colors, traditional Japanese food elements, and painted on textured watercolor paper with forest spirit influences.
```

## 🛠️ **How to Generate Images**

### **Option 1: Midjourney**
1. Go to [midjourney.com](https://midjourney.com)
2. Join their Discord server
3. Use `/imagine` command with the prompts above
4. Add `--ar 1:1` for square format
5. Add `--style raw` for more artistic control

### **Option 2: DALL-E 3 (via ChatGPT)**
1. Go to [chat.openai.com](https://chat.openai.com)
2. Use GPT-4 with DALL-E 3
3. Paste the DALL-E 3 prompts above
4. Request "watercolor style" and "Studio Ghibli aesthetic"

### **Option 3: Stable Diffusion**
1. Use [Hugging Face Spaces](https://huggingface.co/spaces) or [Replicate](https://replicate.com)
2. Search for "Studio Ghibli" or "watercolor" models
3. Use the Midjourney prompts as reference
4. Adjust parameters for watercolor effect

## 📁 **File Setup**

Once you have the images:

1. **Save as PNG** with transparent backgrounds
2. **Resize to 200x200px** for optimal display
3. **Place in:** `/public/images/food/`
4. **Name them:**
   - `ramen-watercolor.png`
   - `toast-watercolor.png`
   - `soup-watercolor.png`
   - `cake-watercolor.png`
   - `bento-watercolor.png`

## 🔧 **Update the Component**

Replace the emoji placeholders with actual images:

```jsx
{currentRecipe.foodIllustration === 'ramen' && (
  <img 
    src="/images/food/ramen-watercolor.png" 
    alt="Ramen Bowl" 
    className={styles.watercolorFoodImage}
  />
)}
```

## 🎨 **Pro Tips**

- **Generate multiple variations** and pick the best ones
- **Use "watercolor paper texture"** in prompts for authenticity
- **Request "soft brushstrokes"** for hand-drawn feel
- **Add "aged paper"** for notecard authenticity
- **Use "Studio Ghibli style"** for consistent aesthetic

## 📱 **Quick Test**

After generating images, test them by:
1. Saving to `/public/images/food/`
2. Updating the component code
3. Refreshing the page at `http://localhost:3000`
4. Shaking the recipe box to see the new images!

---

**Ready to create beautiful watercolor food illustrations? Use these prompts with your preferred AI tool!** ✨
