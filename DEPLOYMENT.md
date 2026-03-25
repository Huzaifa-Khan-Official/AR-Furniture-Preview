# Deployment Guide - AR Furniture Preview

## Pre-Deployment Checklist

- [ ] All dependencies installed with `pnpm install`
- [ ] Build succeeds with `pnpm build`
- [ ] No TypeScript errors or warnings
- [ ] Tested locally with `pnpm dev`
- [ ] Camera access tested on target devices
- [ ] HTTPS configured (required for production)
- [ ] CSP headers reviewed and configured

## Production Build

### Build Process

```bash
# Install dependencies
pnpm install

# Create optimized production build
pnpm build

# Test production build locally
pnpm start
```

The build process will:
- Compile TypeScript with full type checking
- Optimize React components
- Bundle and minify JavaScript
- Generate optimized CSS
- Create static asset cache

## Deployment Platforms

### Vercel (Recommended)

Vercel is the optimal platform for Next.js applications and provides:
- Automatic deployments from Git
- Built-in HTTPS and CDN
- Edge functions support
- Preview deployments
- Environmental variable management

**Steps:**

1. Connect GitHub repository to Vercel
2. Import the project
3. Configure build settings:
   - Framework: Next.js
   - Build Command: `pnpm build`
   - Output Directory: `.next`
4. Add environment variables (if any)
5. Deploy

### Netlify

**Steps:**

1. Connect GitHub repository to Netlify
2. Configure build settings:
   - Build command: `pnpm build && pnpm start`
   - Publish directory: `.next`
3. Add environment variables
4. Configure function settings (if using API routes)
5. Deploy

### Self-Hosted (VPS/Dedicated)

**Requirements:**
- Node.js 18+ runtime
- HTTPS certificate (Let's Encrypt recommended)
- Process manager (PM2, SystemD)
- Reverse proxy (Nginx, Apache)
- Enough RAM (512MB minimum)

**Setup:**

```bash
# 1. Clone repository
git clone <repo-url>
cd ar-furniture-preview

# 2. Install dependencies
pnpm install

# 3. Build application
pnpm build

# 4. Start with PM2
npm install -g pm2
pm2 start pnpm --name "ar-furniture" -- start
pm2 save
pm2 startup

# 5. Configure Nginx reverse proxy
# /etc/nginx/sites-available/default
server {
    listen 80;
    server_name your-domain.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Compression
    gzip on;
    gzip_types text/plain text/css text/javascript application/json application/javascript;
    gzip_min_length 1000;
    gzip_vary on;

    # Proxy to Node.js
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Static file caching
    location /_next/static/ {
        expires 365d;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # Public static files
    location /public/ {
        expires 30d;
        add_header Cache-Control "public, max-age=2592000";
    }
}
```

### AWS

**Options:**

1. **AWS Amplify** (Recommended for Next.js)
   - Zero-config deployments
   - Automatic HTTPS
   - Git integration
   - Global CDN

2. **EC2 + Load Balancer**
   - Full control
   - More complex setup
   - Better for scale

3. **ECS/Fargate**
   - Container-based
   - Auto-scaling
   - Managed service

### Google Cloud Run

**Steps:**

```bash
# 1. Create Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build
EXPOSE 3000
CMD ["pnpm", "start"]

# 2. Build container
gcloud builds submit --tag gcr.io/PROJECT_ID/ar-furniture

# 3. Deploy to Cloud Run
gcloud run deploy ar-furniture \
  --image gcr.io/PROJECT_ID/ar-furniture \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

### Docker Deployment

**Create Dockerfile:**

```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

# Runtime stage
FROM node:18-alpine
WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN pnpm install --frozen-lockfile --prod

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["pnpm", "start"]
```

**Build and run:**

```bash
docker build -t ar-furniture:latest .
docker run -p 3000:3000 ar-furniture:latest
```

## Environment Variables

### Required for Production

```bash
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### Optional

```bash
# Analytics
NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id

# Feature flags
NEXT_PUBLIC_ENABLE_DEBUG_MODE=false
NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING=false
```

## Security Configuration

### HTTPS Setup

- **Required**: Production deployments must use HTTPS
- **Certificate**: Use Let's Encrypt (free) or commercial
- **Renewal**: Auto-renew certificates before expiration

### Security Headers

The application includes these security headers:
- `Strict-Transport-Security`: Forces HTTPS
- `X-Content-Type-Options`: Prevents MIME sniffing
- `X-Frame-Options`: Prevents clickjacking
- `X-XSS-Protection`: Browser XSS protection
- `Referrer-Policy`: Restricts referrer information

### Content Security Policy

Recommended CSP header:

```
default-src 'self';
script-src 'self' 'unsafe-inline' 'unsafe-eval';
style-src 'self' 'unsafe-inline';
img-src 'self' data: blob:;
media-src 'self' blob:;
frame-ancestors 'self';
base-uri 'self';
form-action 'self';
```

### CORS Configuration

Default: CORS disabled (same-origin only)

To enable CORS:

```javascript
// next.config.mjs
headers: async () => [
  {
    source: '/api/:path*',
    headers: [
      {
        key: 'Access-Control-Allow-Credentials',
        value: 'true',
      },
      {
        key: 'Access-Control-Allow-Origin',
        value: 'https://trusted-domain.com',
      },
      {
        key: 'Access-Control-Allow-Methods',
        value: 'GET,DELETE,PATCH,POST,PUT',
      },
    ],
  },
]
```

## Performance Optimization

### Caching Strategy

- **Static files** (JS, CSS): 1 year cache + immutable
- **Public assets**: 30 days cache
- **HTML**: No cache (dynamic content)

### Image Optimization

Currently using unoptimized images. For optimization:

```javascript
// next.config.mjs
images: {
  unoptimized: false,
  formats: ['image/avif', 'image/webp'],
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
}
```

### Monitoring

Track these metrics:
- **Largest Contentful Paint (LCP)**: < 2.5s
- **First Input Delay (FID)**: < 100ms
- **Cumulative Layout Shift (CLS)**: < 0.1
- **Time to First Byte (TTFB)**: < 600ms

## Rollback Procedure

### Vercel
1. Go to Deployments
2. Select previous deployment
3. Click "Redeploy"

### Manual Deployment
```bash
# Restore previous version from Git
git checkout <previous-commit>
pnpm install
pnpm build
pnpm start
```

## Monitoring and Maintenance

### Health Checks

Test endpoint availability:
```bash
curl -I https://your-domain.com
```

### Error Monitoring

Set up error tracking:
- Sentry
- LogRocket
- Datadog
- New Relic

### Performance Monitoring

Use:
- Google Analytics
- Vercel Analytics
- Web Vitals

### Logs

Monitor:
- Application logs
- Error logs
- Access logs
- Browser console errors

## Troubleshooting

### Build Fails

```bash
# Clear cache and rebuild
rm -rf node_modules .next
pnpm install
pnpm build
```

### Performance Issues

1. Check server resources
2. Review database queries
3. Monitor API response times
4. Check cache hit rates
5. Review error logs

### Camera Access Issues

- Verify HTTPS in production
- Check browser permissions
- Review security headers
- Test on different browsers

## Post-Deployment

1. Test all features
2. Verify HTTPS works
3. Check camera access
4. Monitor error logs
5. Set up alerts
6. Document deployment

## Version Management

Keep track of:
- Application version (package.json)
- Node.js version
- Dependencies versions
- Deployment history
- Database schema version

---

**Last Updated**: 2026-03-25
**Status**: Production Ready
