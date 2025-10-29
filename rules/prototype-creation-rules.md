# Prototype Creation Rules

## Agent Requested

When I ask you to create a new prototype, make a new prototype, or something similar (e.g., "Create a new prototype", "Make a new prototype", "Create prototype", "Make prototype"), do the following steps:

1. **Ask for prototype name**: If I don't tell you what the prototype will be, ask me to name the prototype before proceeding with creating the files.

2. **Copy template directory**: Always copy the `_template` directory in the `app/prototypes` directory to create the new prototype base.

3. **Create/modify prototype files**: Set up the prototype files including:
   - `page.tsx` (main prototype component)
   - `styles.module.css` (prototype-specific styles)
   - Any other necessary files for the prototype

4. **Install dependencies**: Install any necessary npm packages or dependencies required for the prototype to function.

5. **Add to homepage array**: Add the new prototype to the homepage's prototypes array so it appears in the list of available prototypes.

6. **Test functionality**: Test that both the prototype page and homepage links work correctly.

## Additional Guidelines

- Use TypeScript for all prototype files
- Follow Next.js 14+ App Router conventions
- Keep each prototype self-contained in its own directory
- Use descriptive names for prototypes (kebab-case)
- Include comments in complex prototype logic
- Ensure responsive design for all prototypes
- Test on multiple screen sizes before marking complete

## File Structure
```
app/
  prototypes/
    _template/
      page.tsx
      styles.module.css
    [prototype-name]/
      page.tsx
      styles.module.css
```

## Prototype Naming Convention

- Use kebab-case: `sketch-to-ui`, `todo-app`, `weather-widget`
- Be descriptive but concise
- Avoid generic names like "test" or "demo"

## Testing Checklist

Before completing a prototype, verify:
- [ ] Prototype renders without errors
- [ ] Styles are applied correctly
- [ ] Homepage link navigates to prototype
- [ ] Back navigation works
- [ ] Responsive on mobile and desktop
- [ ] All interactive features function properly
