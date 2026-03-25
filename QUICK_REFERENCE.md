# AR Furniture Preview - Quick Reference Guide

## Start Here

### First Time Running the App?

```bash
pnpm install        # Install dependencies
pnpm dev            # Start development server
# Open http://localhost:3000 in your browser
```

### Ready to Deploy?

```bash
pnpm build          # Create production build
pnpm start          # Test production build locally
vercel deploy       # Deploy to Vercel (easiest)
# See DEPLOYMENT.md for other options
```

---

## File Quick Reference

### Essential Files

| File | Purpose | Edit? |
|------|---------|-------|
| `app/page.tsx` | Main app logic | Yes |
| `hooks/useARState.ts` | State management | Yes (for features) |
| `components/*.tsx` | UI components | Yes |
| `app/globals.css` | Colors & styles | Yes |
| `next.config.mjs` | Build config | Rarely |
| `package.json` | Dependencies | For new packages |

### Documentation Files

| File | Content |
|------|---------|
| `README.md` | User guide & features |
| `DEPLOYMENT.md` | How to deploy anywhere |
| `DEVELOPMENT.md` | Development guide |
| `PROJECT_SUMMARY.md` | Project overview |
| `QUICK_REFERENCE.md` | This file |

### Asset Files

| File | Purpose |
|------|---------|
| `public/models/chair.jpg` | Chair visualization |
| `public/models/table.jpg` | Table visualization |
| `public/models/sofa.jpg` | Sofa visualization |
| `public/models/lamp.jpg` | Lamp visualization |

---

## Common Tasks

### Add New Furniture Type

1. Open `hooks/useARState.ts`
2. Add to `FURNITURE_TYPES` array:
   ```typescript
   { id: 'desk', name: 'Desk', icon: '📝' }
   ```
3. Add to `PlacedObject` type:
   ```typescript
   type: 'chair' | 'table' | 'sofa' | 'lamp' | 'desk'
   ```
4. Add image: `public/models/desk.jpg`

### Change Colors

Edit `app/globals.css` in the `:root` section:
```css
--primary: oklch(0.22 0.08 260);    /* Main brand color */
--accent: oklch(0.52 0.2 262);      /* Interactive color */
```

### Adjust Control Increments

In `components/ControlsPanel.tsx`:
```typescript
onClick={() => onRotate(axis, 15)}  // Change 15 to desired degrees
onClick={() => onScale(...Math.max(0.5, ...))}  // Change 0.5 for min scale
```

### Update Help Text

Edit `components/HelpModal.tsx` content section

---

## Key Code Patterns

### Using the AR State Hook

```tsx
const {
  state,              // { placedObjects, activeObjectId, message, ... }
  selectFurniture,    // (furnitureId: string) => void
  placeObject,        // (x: number, y: number) => void
  updateObject,       // (id: string, updates: Partial<PlacedObject>) => void
  deleteObject,       // (id: string) => void
  setActiveObject,    // (id: string | null) => void
} = useARState();
```

### Handling Object Updates

```tsx
const handleRotate = (axis: 'x' | 'y' | 'z', angle: number) => {
  if (activeObject) {
    const newRotation = { ...activeObject.rotation };
    newRotation[axis] = (newRotation[axis] + angle) % 360;
    updateObject(activeObject.id, { rotation: newRotation });
  }
};
```

### Creating Glassmorphic Panels

```tsx
<div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20">
  {/* Content */}
</div>
```

---

## Configuration

### Environment Variables

Create `.env.local` (copy from `.env.example`):
```bash
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### TypeScript Config

Editing `tsconfig.json`:
- `strict: true` - Enable strict type checking
- `lib: ["dom", "es2022"]` - DOM + ES2022 features
- `paths: { "@/*": ["./*"] }` - Use @ imports

### Tailwind Config

In `tailwind.config.ts`:
- Design tokens defined as CSS variables
- Used with `@theme` directive
- Extend with `theme.extend`

---

## Development Commands

```bash
# Development
pnpm dev              # Start dev server (hot reload)

# Building
pnpm build            # Create production build
pnpm start            # Run production build

# Type Checking
pnpm tsc              # Type check all files
pnpm tsc --noEmit     # Check without output

# Linting
pnpm lint             # Run ESLint

# Cleaning
pnpm clean            # Clear Next.js cache
rm -rf node_modules   # Remove dependencies
```

---

## Project Structure at a Glance

```
App Page (app/page.tsx)
├── TopBar Component
├── FurnitureSelector Component
├── ControlsPanel Component
└── ARViewer Component
    ├── Canvas (camera + overlay)
    └── Video (camera stream)

State (hooks/useARState.ts)
├── placedObjects[]
├── selectedFurniture
├── activeObjectId
└── cameraReady

Styling (app/globals.css)
├── Design Tokens
├── Color Variables
└── Global Styles

Assets (public/models/)
├── chair.jpg
├── table.jpg
├── sofa.jpg
└── lamp.jpg
```

---

## Performance Checklist

- [ ] Build size < 250kb
- [ ] LCP < 2.5s
- [ ] No console errors
- [ ] Smooth 60fps canvas
- [ ] No memory leaks
- [ ] Camera loads instantly
- [ ] Touch responds immediately
- [ ] No jank on interactions

---

## Security Checklist

- [ ] HTTPS enabled in production
- [ ] Security headers configured
- [ ] No console secrets exposed
- [ ] Input validation in place
- [ ] Camera permission handled
- [ ] Error messages user-safe
- [ ] No external CDN dependencies
- [ ] Dependencies up to date

---

## Deployment Quick Links

- **Vercel**: `vercel deploy` (1 click)
- **Netlify**: Connect repo + auto deploy
- **Docker**: `docker build -t app . && docker run -p 3000:3000 app`
- **PM2**: `pm2 start pnpm --name app -- start`

See DEPLOYMENT.md for full details.

---

## Browser DevTools Tips

### Chrome/Edge
1. F12 to open DevTools
2. Shift+Cmd+C for element picker
3. Network tab to see requests
4. Performance tab to profile
5. Console for debugging

### Mobile Testing
```bash
# Remote debugging for Chrome mobile
# Phone connected via USB
chrome://inspect
```

---

## Troubleshooting Quick Guide

| Problem | Solution |
|---------|----------|
| Camera won't start | Check permissions, try HTTPS |
| Build fails | `rm -rf .next && pnpm build` |
| Slow performance | Check DevTools Performance tab |
| Type errors | `pnpm tsc --noEmit` |
| Hot reload broken | Restart dev server |
| Styles not applying | Check Tailwind config, clear cache |

See README.md and DEVELOPMENT.md for detailed troubleshooting.

---

## Next Steps

1. **Read**: README.md (user guide)
2. **Develop**: DEVELOPMENT.md (dev setup)
3. **Deploy**: DEPLOYMENT.md (go live)
4. **Reference**: This file (quick help)

---

## Quick Links

- **GitHub**: [Project repo]
- **Issues**: Check GitHub issues
- **Docs**: See documentation files
- **Support**: Browser console + DevTools

---

## Key Metrics

| Metric | Target |
|--------|--------|
| Build Time | < 60s |
| Dev Start | < 15s |
| First Load | < 3s |
| Lighthouse | > 90 |
| Bundle Size | < 250kb |

---

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Tailwind Docs](https://tailwindcss.com/docs)
- [MDN Web Docs](https://developer.mozilla.org)

---

**Status**: Production Ready ✓
**Last Updated**: March 25, 2026
**Version**: 1.0.0
