# AR Furniture Preview - Production Ready Application

A modern augmented reality web application for visualizing furniture in real-time using your device's camera. Built with Next.js 16, React 19, and Tailwind CSS for a seamless, responsive experience.

## Features

- **Real-time AR Visualization**: Stream camera feed with overlay rendering of placed furniture
- **Multiple Furniture Items**: Choose from 4 modern furniture types (chair, table, sofa, lamp)
- **Full Object Control**: 
  - Place items anywhere in the AR scene
  - Rotate on X, Y, Z axes independently
  - Scale from 0.5x to 2x original size
  - Delete unwanted objects
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Glassmorphism UI**: Modern, transparent panel design with backdrop blur effects
- **Help System**: Built-in tutorial modal with usage instructions
- **Real-time Status**: Live status messages and scene information display

## Tech Stack

- **Frontend Framework**: Next.js 16 with App Router
- **React Version**: React 19.2.4
- **Styling**: Tailwind CSS 4.2 with custom design tokens
- **Icons**: Lucide React
- **Type Safety**: TypeScript 5.7.3
- **State Management**: React Hooks (useARState)
- **Camera Access**: Web Streams API & getUserMedia

## Project Structure

```
/vercel/share/v0-project/
├── app/
│   ├── page.tsx              # Main AR application page
│   ├── layout.tsx            # Root layout with metadata
│   └── globals.css           # Global styles and design tokens
├── components/
│   ├── ARViewer.tsx          # Camera feed and object rendering
│   ├── ControlsPanel.tsx     # Object manipulation controls
│   ├── FurnitureSelector.tsx # Furniture selection interface
│   ├── TopBar.tsx            # Status bar and action buttons
│   └── HelpModal.tsx         # Help/tutorial modal
├── hooks/
│   └── useARState.ts         # AR state management hook
├── public/
│   └── models/               # 3D model representations
│       ├── chair.jpg
│       ├── table.jpg
│       ├── sofa.jpg
│       └── lamp.jpg
└── lib/
    └── utils.ts              # Utility functions (cn for className)
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- Modern browser with WebRTC support (camera access required)
- HTTPS connection (for production camera access)

### Installation

1. **Clone or download the project**
```bash
cd /vercel/share/v0-project
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Run development server**
```bash
pnpm dev
```

4. **Open in browser**
Navigate to `http://localhost:3000`

### Build for Production

```bash
pnpm build
pnpm start
```

## Usage Guide

### Basic Workflow

1. **Select Furniture**: Click a furniture item from the left panel selector
2. **Place Object**: Tap/click on the camera view to place the selected item
3. **Adjust Object**: Click placed objects to select them and use controls to:
   - Rotate using ±15° increment buttons per axis
   - Scale using size adjustment buttons
   - Delete using the trash icon
4. **Reset**: Click the reset button to clear all objects and start fresh

### Controls

| Action | Button | Effect |
|--------|--------|--------|
| Help | Help Icon | Opens tutorial modal |
| Reset | Rotate Icon | Clears all objects |
| Select Object | Click on item | Highlights and enables controls |
| Rotate X/Y/Z | ±/+ buttons | Rotates ±15° per click |
| Scale | Smaller/Larger | Adjusts size ±0.2x |
| Delete | Trash Icon | Removes selected object |

## Design System

### Color Palette

- **Primary**: Deep Charcoal (#1f2937)
- **Accent**: Vibrant Blue (#3b82f6)
- **Neutrals**: White, Light Gray (#f3f4f6), Border Gray (#e5e7eb)
- **Semantic Colors**: Green (active), Blue (selected), Red (delete), Amber (scale)

### Typography

- **Sans Serif**: Geist font family (headings & body text)
- **Mono**: Geist Mono (technical information)
- **Font Sizes**: 12px - 36px with semantic scaling

### Components

All UI elements use:
- Rounded corners (12px border radius)
- Glassmorphic panels with backdrop blur
- Smooth transitions and hover states
- Touch-friendly sizing (min 44px height)
- Semantic color feedback

## AR Functionality

### Camera Integration

- Requests camera permission on app load
- Uses environment-facing camera (rear) on mobile
- Continuous video streaming with canvas overlay
- Graceful degradation if camera unavailable

### Object Rendering

- Canvas-based 2D overlay rendering
- Objects drawn as colored rectangles with labels
- Active selection highlighted in blue
- Position tracking from -0.5 to +0.5 normalized coordinates

### State Management

The `useARState` hook manages:
- `selectedFurniture`: Currently selected furniture type
- `placedObjects`: Array of placed objects with transforms
- `activeObjectId`: Currently selected object for editing
- `cameraReady`: Camera initialization status
- `message`: Real-time feedback messages

## Performance Optimization

- Canvas rendering at device resolution
- RequestAnimationFrame for smooth 60fps updates
- Efficient object lookup on click events
- Minimal re-renders through React state isolation
- Optimized image assets for web

## Accessibility

- Semantic HTML structure
- ARIA labels on buttons
- Keyboard navigation support
- High contrast color schemes
- Screen reader compatible status messages
- Touch-friendly button sizing

## Browser Support

- **Desktop**: Chrome/Edge 90+, Firefox 88+, Safari 14+
- **Mobile**: iOS Safari 13+, Chrome 90+, Firefox 88+
- **Requirements**: WebRTC, Canvas API, getUserMedia API

## Future Enhancements

- 3D model support with model-viewer
- Object export/import functionality
- Camera snapshot saving
- Multi-object placement templates
- Physics-based collision detection
- Lighting adjustments
- Room detection and boundaries
- Real-time collaboration

## Known Limitations

- 2D overlay rendering (not true 3D)
- Mobile camera performance varies by device
- No persistence between sessions
- Single device support (no multi-user)
- Requires HTTPS in production

## Security Considerations

- Camera access requires user permission
- No data sent to external servers
- All processing done locally on device
- HTTPS enforcement in production
- Content Security Policy headers recommended

## Troubleshooting

### Camera won't start
- Check browser permissions for camera access
- Ensure HTTPS is used in production
- Try different browser or device
- Check browser console for error messages

### Poor performance
- Reduce scene complexity (fewer objects)
- Lower browser zoom level
- Close other tabs
- Restart browser
- Try different device with better hardware

### Touch/click not working
- Ensure camera permission is granted
- Check browser JavaScript is enabled
- Try double-tap to ensure input registration
- Verify canvas element is in focus

## Configuration

### Environment Variables

None required - app runs with no external dependencies. All configuration is hardcoded for production-ready state.

### Customization

To customize:
- Edit `globals.css` for design tokens and colors
- Modify `FURNITURE_TYPES` in `useARState.ts` to add/remove furniture
- Adjust canvas rendering logic in `ARViewer.tsx` for different visualization
- Update control increments in `ControlsPanel.tsx`

## Deployment

### Vercel (Recommended)

```bash
vercel deploy
```

### Other Platforms

The project is a standard Next.js application compatible with:
- Netlify
- AWS Amplify
- Railway
- Render
- Any Node.js hosting

Ensure:
- Node.js 18+ runtime
- Environment set to production
- HTTPS enabled
- Allow camera permissions

## License

Production-ready application - free to use and modify.

## Support

For issues or questions:
1. Check the built-in Help modal (? button)
2. Review browser console for errors
3. Ensure camera permission is granted
4. Verify HTTPS connection in production

---

**Status**: Production Ready ✓
**Last Updated**: 2026-03-25
**Version**: 1.0.0
