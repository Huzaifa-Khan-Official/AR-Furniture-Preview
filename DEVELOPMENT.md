# Development Guide - AR Furniture Preview

## Project Overview

This is a production-ready Next.js 16 application featuring real-time augmented reality furniture visualization. The codebase is organized for maintainability, scalability, and performance.

## Development Setup

### Prerequisites

- Node.js 18.17+ (check with `node --version`)
- pnpm 8.0+ (install with `npm install -g pnpm`)
- Git

### Initial Setup

```bash
# 1. Clone repository
git clone <repository-url>
cd ar-furniture-preview

# 2. Install dependencies
pnpm install

# 3. Start development server
pnpm dev

# 4. Open browser
# Navigate to http://localhost:3000
```

## Project Structure

```
ar-furniture-preview/
├── app/                          # Next.js app directory
│   ├── page.tsx                 # Main AR application page
│   ├── layout.tsx               # Root layout wrapper
│   └── globals.css              # Global styles and design tokens
├── components/                   # React components
│   ├── ARViewer.tsx             # Canvas-based AR viewer
│   ├── ControlsPanel.tsx        # Object controls UI
│   ├── FurnitureSelector.tsx    # Furniture selection grid
│   ├── TopBar.tsx               # Header with status
│   └── HelpModal.tsx            # Help/tutorial modal
├── hooks/                        # React hooks
│   └── useARState.ts            # AR state management
├── lib/                          # Utility functions
│   └── utils.ts                 # Helper functions (cn for classnames)
├── public/                       # Static assets
│   └── models/                  # Furniture images
│       ├── chair.jpg
│       ├── table.jpg
│       ├── sofa.jpg
│       └── lamp.jpg
├── README.md                     # User documentation
├── DEPLOYMENT.md                 # Deployment guide
├── DEVELOPMENT.md               # This file
├── package.json                 # Dependencies and scripts
├── tsconfig.json                # TypeScript configuration
├── tailwind.config.ts           # Tailwind configuration
└── next.config.mjs              # Next.js configuration
```

## Code Organization

### Components

Each component is self-contained with:
- Clear prop interfaces
- Type-safe implementations
- Single responsibility principle
- Reusable patterns

**Example:**

```tsx
interface ComponentProps {
  prop1: string;
  onAction: (value: string) => void;
}

export function Component({ prop1, onAction }: ComponentProps) {
  // Component logic
  return <div>{prop1}</div>;
}
```

### State Management

Uses React hooks with the custom `useARState` hook:

```tsx
const {
  state,              // Current AR state
  selectFurniture,    // Select furniture type
  placeObject,        // Place object in AR scene
  updateObject,       // Update object properties
  deleteObject,       // Remove object
  setActiveObject,    // Select object for editing
  reset,              // Clear all objects
  setCameraReady,     // Update camera status
  setMessage,         // Update status message
  furnitureTypes,     // Available furniture
} = useARState();
```

### Styling

Uses Tailwind CSS v4 with custom design tokens:

```css
/* globals.css */
:root {
  --primary: oklch(0.22 0.08 260);      /* Brand color */
  --accent: oklch(0.52 0.2 262);        /* Interactive color */
  --background: oklch(0.98 0 0);        /* Background */
  --foreground: oklch(0.15 0 0);        /* Text color */
}
```

## Development Workflow

### Running Locally

```bash
# Development server (with hot reload)
pnpm dev

# Production build
pnpm build

# Test production build
pnpm start

# Type checking
pnpm tsc

# Linting
pnpm lint
```

### Making Changes

1. **Create feature branch**
   ```bash
   git checkout -b feature/your-feature
   ```

2. **Make changes** following the code style

3. **Test locally**
   ```bash
   pnpm dev
   # Test in browser
   ```

4. **Type check**
   ```bash
   pnpm tsc --noEmit
   ```

5. **Build test**
   ```bash
   pnpm build
   ```

6. **Commit and push**
   ```bash
   git add .
   git commit -m "Description of changes"
   git push origin feature/your-feature
   ```

## Adding Features

### Add New Furniture Type

1. **Update `useARState.ts`**:
   ```typescript
   const FURNITURE_TYPES = [
     { id: 'chair', name: 'Chair', icon: '🪑' },
     // Add new type here
     { id: 'desk', name: 'Desk', icon: '📝' },
   ];
   ```

2. **Add furniture image**:
   ```bash
   # Generate or add image to public/models/
   public/models/desk.jpg
   ```

3. **Update types if needed**:
   ```typescript
   // In useARState.ts
   type: 'chair' | 'table' | 'sofa' | 'lamp' | 'desk';
   ```

### Add New Control

1. **Update `ControlsPanel.tsx`**:
   ```tsx
   <button onClick={() => onNewControl()}>
     New Control
   </button>
   ```

2. **Add handler in `page.tsx`**:
   ```tsx
   const handleNewControl = () => {
     // Implementation
   };
   ```

### Add New UI Component

1. **Create component file**:
   ```tsx
   // components/NewComponent.tsx
   export function NewComponent() {
     return <div>New Component</div>;
   }
   ```

2. **Export and use**:
   ```tsx
   import { NewComponent } from '@/components/NewComponent';
   
   // In page.tsx
   <NewComponent />
   ```

## Debugging

### Browser Console

The application uses console for debugging:

```typescript
console.log("[v0] Variable:", variable);
console.error("[v0] Error:", error);
console.warn("[v0] Warning:", warning);
```

### React Developer Tools

1. Install browser extension
2. Inspect components
3. View props and state
4. Track re-renders

### Performance Profiling

```bash
# Chrome DevTools
# 1. Open DevTools
# 2. Performance tab
# 3. Record
# 4. Interact with app
# 5. Stop and analyze
```

### Network Debugging

```bash
# View network requests
# Chrome DevTools > Network tab
# - Monitor camera stream
# - Check asset loading
# - Verify no failed requests
```

## Testing

### Manual Testing Checklist

- [ ] Camera access works
- [ ] Furniture selection works
- [ ] Object placement works
- [ ] Rotation controls work
- [ ] Scale controls work
- [ ] Delete button works
- [ ] Reset button works
- [ ] Help modal opens/closes
- [ ] Messages update correctly
- [ ] Scene summary shows correct counts
- [ ] Responsive on mobile
- [ ] Touch controls work

### Browser Testing

Test across:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

### Device Testing

- Desktop (large screen)
- Tablet (medium screen)
- Phone (small screen)
- Various lighting conditions

## Performance Tips

### Optimization

1. **Minimize re-renders**
   ```tsx
   // Use useCallback for event handlers
   const handleClick = useCallback(() => {
     // handler
   }, []);
   ```

2. **Memoize components**
   ```tsx
   export const MemoComponent = memo(Component);
   ```

3. **Lazy load components**
   ```tsx
   const HelpModal = dynamic(() => import('@/components/HelpModal'));
   ```

4. **Optimize images**
   - Use appropriate formats
   - Compress before adding
   - Use Next.js Image component

### Monitoring

Track metrics:
- First Load JS: < 100kb
- Time to Interactive: < 3s
- Canvas render time: < 16ms

## Accessibility Improvements

### WCAG Compliance

- [ ] Keyboard navigation
- [ ] Screen reader support
- [ ] Color contrast ratios
- [ ] Focus indicators
- [ ] ARIA labels
- [ ] Semantic HTML

### Testing

Use:
- axe DevTools
- Lighthouse
- WAVE extension
- Screen readers (NVDA, JAWS)

## Common Tasks

### Update Design Colors

Edit `globals.css`:
```css
:root {
  --primary: oklch(0.22 0.08 260);
  /* Update other colors */
}
```

### Add Loading State

In component:
```tsx
const [loading, setLoading] = useState(false);

return (
  <div className={loading ? 'opacity-50 pointer-events-none' : ''}>
    {/* Content */}
  </div>
);
```

### Add Error Boundary

```tsx
'use client';

import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export class ErrorBoundary extends React.Component<Props> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong</div>;
    }
    return this.props.children;
  }
}
```

### Handle Camera Permission Denial

```tsx
useEffect(() => {
  const initCamera = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: {} });
    } catch (error) {
      if (error.name === 'NotAllowedError') {
        setMessage('Camera access denied. Check browser permissions.');
      }
    }
  };
}, []);
```

## Best Practices

### Code Style

- Use TypeScript for type safety
- Name components with PascalCase
- Name hooks with usePrefix
- Use semantic variable names
- Add comments for complex logic

### Component Guidelines

- One responsibility per component
- Keep components under 300 lines
- Props over deep nesting
- Use composition over inheritance
- Memoize expensive computations

### Performance

- Avoid inline functions in render
- Use useCallback for handlers
- Implement virtual scrolling for lists
- Monitor bundle size
- Use code splitting

### Security

- Validate all user input
- Sanitize strings for HTML
- Use CSP headers
- Avoid eval and innerHTML
- Keep dependencies updated

## Troubleshooting Development

### Dependencies Won't Install

```bash
rm -rf node_modules
rm pnpm-lock.yaml
pnpm install
```

### Build Errors

```bash
# Clear cache
pnpm clean
rm -rf .next

# Rebuild
pnpm build
```

### Type Errors

```bash
# Run type checker
pnpm tsc --noEmit

# Generate types
pnpm tsc --generateTrace .
```

### Hot Reload Not Working

- Check file changes trigger rebuild
- Restart dev server
- Clear browser cache
- Check for syntax errors

## Resources

### Documentation

- [Next.js 16 Docs](https://nextjs.org)
- [React 19 Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [TypeScript](https://www.typescriptlang.org)
- [Lucide Icons](https://lucide.dev)

### Tools

- VS Code: Recommended IDE
- Prettier: Code formatter
- ESLint: Code linter
- Chrome DevTools: Debugging
- Lighthouse: Performance audit

## Support and Contribution

### Getting Help

1. Check existing documentation
2. Search GitHub issues
3. Review browser console errors
4. Check network tab
5. Test in different browsers

### Contributing

1. Follow code style
2. Add tests for changes
3. Update documentation
4. Create detailed PR description
5. Link related issues

---

**Last Updated**: 2026-03-25
**Status**: Production Ready
