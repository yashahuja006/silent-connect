# Silent-Connect v3.0 - Next.js 15 SaaS Architecture

## 📁 Complete Project Structure

```
silent-connect-v3/
├── README.md
├── next.config.js
├── package.json
├── tailwind.config.ts
├── tsconfig.json
├── .env.local
├── .env.example
├── .gitignore
├── globals.css
├── middleware.ts
│
├── app/
│   ├── layout.tsx                    # Root layout with providers
│   ├── page.tsx                      # Landing page
│   ├── globals.css                   # Global styles with cyber-glass theme
│   ├── loading.tsx                   # Global loading UI
│   ├── error.tsx                     # Global error boundary
│   ├── not-found.tsx                 # 404 page
│   │
│   ├── (marketing)/                  # Marketing pages (public)
│   │   ├── layout.tsx               # Marketing layout
│   │   ├── page.tsx                 # Home page
│   │   ├── about/
│   │   │   └── page.tsx
│   │   ├── pricing/
│   │   │   └── page.tsx
│   │   └── contact/
│   │       └── page.tsx
│   │
│   ├── (auth)/                       # Authentication pages
│   │   ├── layout.tsx               # Auth layout (centered forms)
│   │   ├── sign-in/
│   │   │   └── page.tsx
│   │   ├── sign-up/
│   │   │   └── page.tsx
│   │   ├── forgot-password/
│   │   │   └── page.tsx
│   │   └── reset-password/
│   │       └── page.tsx
│   │
│   ├── (dashboard)/                  # Protected dashboard
│   │   ├── layout.tsx               # Dashboard layout with sidebar
│   │   ├── page.tsx                 # Dashboard home
│   │   ├── translator/
│   │   │   └── page.tsx             # Gesture translator
│   │   ├── education/
│   │   │   └── page.tsx             # Learning modules
│   │   ├── smart-home/
│   │   │   └── page.tsx             # IoT control
│   │   ├── health/
│   │   │   └── page.tsx             # Health analytics
│   │   ├── ai-trainer/
│   │   │   └── page.tsx             # Custom gesture training
│   │   ├── settings/
│   │   │   ├── page.tsx             # Settings home
│   │   │   ├── profile/
│   │   │   │   └── page.tsx
│   │   │   ├── preferences/
│   │   │   │   └── page.tsx
│   │   │   └── billing/
│   │   │       └── page.tsx
│   │   └── analytics/
│   │       └── page.tsx             # Usage analytics
│   │
│   └── api/                          # API routes
│       ├── auth/
│       │   └── callback/
│       │       └── route.ts         # Supabase auth callback
│       ├── gestures/
│       │   ├── route.ts             # CRUD for custom gestures
│       │   └── [id]/
│       │       └── route.ts
│       ├── health/
│       │   └── route.ts             # Health data endpoints
│       ├── iot/
│       │   └── route.ts             # IoT device control
│       └── webhooks/
│           └── stripe/
│               └── route.ts         # Stripe webhooks
│
├── components/
│   ├── ui/                           # Shadcn/UI primitives
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── select.tsx
│   │   ├── separator.tsx
│   │   ├── sheet.tsx
│   │   ├── sidebar.tsx
│   │   ├── switch.tsx
│   │   ├── tabs.tsx
│   │   ├── toast.tsx
│   │   └── toaster.tsx
│   │
│   ├── vision/                       # AI Vision Components
│   │   ├── camera-feed.tsx          # Main camera component
│   │   ├── hand-tracking-canvas.tsx # Hand skeleton overlay
│   │   ├── gesture-detector.tsx     # Gesture recognition UI
│   │   ├── confidence-meter.tsx     # Real-time confidence display
│   │   ├── particle-trails.tsx      # Visual effects
│   │   └── vision-debug.tsx         # Debug tools
│   │
│   ├── layout/                       # Layout components
│   │   ├── app-sidebar.tsx          # Main navigation sidebar
│   │   ├── header.tsx               # Top navigation
│   │   ├── footer.tsx               # Footer
│   │   ├── breadcrumb.tsx           # Navigation breadcrumbs
│   │   └── theme-provider.tsx       # Theme context
│   │
│   ├── dashboard/                    # Dashboard-specific components
│   │   ├── stats-cards.tsx          # Metric cards
│   │   ├── recent-activity.tsx      # Activity feed
│   │   ├── quick-actions.tsx        # Action buttons
│   │   └── usage-chart.tsx          # Analytics charts
│   │
│   ├── auth/                         # Authentication components
│   │   ├── sign-in-form.tsx
│   │   ├── sign-up-form.tsx
│   │   ├── forgot-password-form.tsx
│   │   └── auth-guard.tsx           # Route protection
│   │
│   ├── modules/                      # Feature modules
│   │   ├── translator/
│   │   │   ├── conversation-log.tsx
│   │   │   ├── voice-controls.tsx
│   │   │   └── language-selector.tsx
│   │   ├── education/
│   │   │   ├── quiz-master.tsx
│   │   │   ├── practice-mode.tsx
│   │   │   └── leaderboard.tsx
│   │   ├── smart-home/
│   │   │   ├── device-grid.tsx
│   │   │   ├── device-card.tsx
│   │   │   └── automation-rules.tsx
│   │   ├── health/
│   │   │   ├── rehab-dashboard.tsx
│   │   │   ├── stability-chart.tsx
│   │   │   └── progress-tracker.tsx
│   │   └── ai-trainer/
│   │       ├── gesture-studio.tsx
│   │       ├── training-interface.tsx
│   │       └── model-manager.tsx
│   │
│   └── shared/                       # Shared components
│       ├── glass-panel.tsx          # Reusable glass effect wrapper
│       ├── loading-spinner.tsx      # Loading states
│       ├── error-boundary.tsx       # Error handling
│       ├── confirmation-dialog.tsx  # Confirmation modals
│       └── data-table.tsx           # Reusable data tables
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts                # Client-side Supabase
│   │   ├── server.ts                # Server-side Supabase
│   │   ├── middleware.ts            # Auth middleware
│   │   └── types.ts                 # Database types
│   │
│   ├── auth/
│   │   ├── config.ts                # Auth configuration
│   │   ├── providers.ts             # OAuth providers
│   │   └── utils.ts                 # Auth utilities
│   │
│   ├── ai/
│   │   ├── gesture-recognition.ts   # Gesture algorithms
│   │   ├── voice-synthesis.ts       # Speech synthesis
│   │   ├── translations.ts          # Multi-language support
│   │   └── performance.ts           # Performance monitoring
│   │
│   ├── utils/
│   │   ├── cn.ts                    # Class name utility
│   │   ├── constants.ts             # App constants
│   │   ├── validations.ts           # Zod schemas
│   │   ├── formatters.ts            # Data formatters
│   │   └── api.ts                   # API utilities
│   │
│   └── db/
│       ├── schema.ts                # Database schema
│       ├── queries.ts               # Database queries
│       └── migrations/              # Database migrations
│
├── hooks/
│   ├── use-hand-tracking.ts         # Hand tracking hook
│   ├── use-voice-synthesis.ts       # Voice synthesis hook
│   ├── use-speech-recognition.ts    # Speech recognition hook
│   ├── use-gesture-trainer.ts       # Custom gesture training
│   ├── use-auth.ts                  # Authentication hook
│   ├── use-supabase.ts              # Supabase client hook
│   ├── use-local-storage.ts         # Local storage hook
│   ├── use-debounce.ts              # Debounce hook
│   └── use-media-query.ts           # Responsive design hook
│
├── workers/
│   ├── vision.worker.ts             # MediaPipe processing worker
│   ├── audio.worker.ts              # Audio processing worker
│   └── types.ts                     # Worker message types
│
├── types/
│   ├── index.ts                     # Global types
│   ├── auth.ts                      # Authentication types
│   ├── vision.ts                    # Vision/AI types
│   ├── database.ts                  # Database types
│   └── api.ts                       # API response types
│
├── styles/
│   └── components.css               # Component-specific styles
│
├── public/
│   ├── favicon.ico
│   ├── logo.svg
│   ├── sounds/                      # Audio files
│   │   ├── pop.mp3
│   │   ├── success.mp3
│   │   └── gameover.mp3
│   └── models/                      # MediaPipe models
│       └── hand_landmarker.task
│
└── docs/
    ├── API.md                       # API documentation
    ├── DEPLOYMENT.md                # Deployment guide
    └── CONTRIBUTING.md              # Contribution guidelines
```

## 🎯 Key Architecture Decisions

### **Route Groups Strategy**
- `(marketing)` - Public pages with marketing layout
- `(auth)` - Authentication pages with centered layout
- `(dashboard)` - Protected pages with sidebar layout

### **Component Organization**
- `ui/` - Shadcn primitives (design system)
- `vision/` - AI/Camera specific components
- `modules/` - Feature-specific components
- `shared/` - Reusable business components

### **Performance Optimizations**
- Web Workers for MediaPipe processing
- Route-based code splitting
- Optimized bundle sizes with Next.js 15

### **Scalability Features**
- Modular architecture
- Type-safe API routes
- Database migrations
- Comprehensive error handling