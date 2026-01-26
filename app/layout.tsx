import type { Metadata } from 'next'
import { Inter, Orbitron } from 'next/font/google'
import { Toaster } from '@/components/ui/toaster'
import { ThemeProvider } from '@/components/layout/theme-provider'
import { AuthProvider } from '@/lib/auth/providers'
import { cn } from '@/lib/utils/cn'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const orbitron = Orbitron({ 
  subsets: ['latin'],
  variable: '--font-orbitron',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Silent-Connect v3.0 - Universal AI Platform',
    template: '%s | Silent-Connect'
  },
  description: 'Revolutionary Universal AI Platform featuring advanced voice-controlled hand gesture recognition, IoT control, health analytics, and custom AI training across multiple domains.',
  keywords: [
    'hand gesture recognition',
    'voice control',
    'AI platform',
    'MediaPipe',
    'accessibility',
    'sign language',
    'IoT control',
    'health analytics',
    'Next.js',
    'SaaS'
  ],
  authors: [
    {
      name: 'Yash Ahuja',
      url: 'https://github.com/yashahuja006'
    }
  ],
  creator: 'Yash Ahuja',
  publisher: 'Silent-Connect',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://silent-connect.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://silent-connect.vercel.app',
    title: 'Silent-Connect v3.0 - Universal AI Platform',
    description: 'Revolutionary AI-powered gesture recognition platform with IoT control, health analytics, and multi-language support.',
    siteName: 'Silent-Connect',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Silent-Connect - Universal AI Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Silent-Connect v3.0 - Universal AI Platform',
    description: 'Revolutionary AI-powered gesture recognition platform with IoT control, health analytics, and multi-language support.',
    images: ['/og-image.png'],
    creator: '@yashahuja006',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preload critical fonts */}
        <link
          rel="preload"
          href="/fonts/inter-var.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/orbitron-var.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Security headers */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="Referrer-Policy" content="origin-when-cross-origin" />
        <meta httpEquiv="Permissions-Policy" content="camera=(), microphone=(), geolocation=()" />
        
        {/* PWA meta tags */}
        <meta name="application-name" content="Silent-Connect" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Silent-Connect" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#020617" />
        <meta name="theme-color" content="#020617" />
        
        {/* Viewport for optimal mobile experience */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=5, user-scalable=yes, viewport-fit=cover"
        />
      </head>
      <body 
        className={cn(
          'min-h-screen bg-slate-900 font-sans antialiased',
          'neural-bg',
          inter.variable,
          orbitron.variable
        )}
        suppressHydrationWarning={true}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <AuthProvider>
            {/* Main application content */}
            <div className="relative flex min-h-screen flex-col">
              <div className="flex-1">
                {children}
              </div>
            </div>
            
            {/* Global toast notifications */}
            <Toaster />
            
            {/* Background effects */}
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
              {/* Neural network background animation */}
              <div className="absolute inset-0 opacity-30">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyber-500/10 rounded-full blur-3xl animate-neural-flow" />
                <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-neural-flow" style={{ animationDelay: '1s' }} />
                <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-neural-flow" style={{ animationDelay: '2s' }} />
              </div>
              
              {/* Subtle grid pattern */}
              <div 
                className="absolute inset-0 opacity-5"
                style={{
                  backgroundImage: `
                    linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px)
                  `,
                  backgroundSize: '50px 50px'
                }}
              />
            </div>
          </AuthProvider>
        </ThemeProvider>
        
        {/* Browser Extension Compatibility Script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Enhanced browser extension attribute cleanup before React hydration
              (function() {
                if (typeof window !== 'undefined') {
                  // List of known browser extension attributes that cause hydration issues
                  const extensionAttributes = [
                    'bis_skin_checked',
                    'data-bitwarden-watching',
                    'data-lastpass-icon-root',
                    'data-1password-watching',
                    'data-dashlane-watching',
                    'data-keeper-watching'
                  ];
                  
                  // Function to clean attributes from an element
                  function cleanExtensionAttributes(element) {
                    if (element && element.removeAttribute) {
                      extensionAttributes.forEach(attr => {
                        if (element.hasAttribute(attr)) {
                          element.removeAttribute(attr);
                        }
                      });
                    }
                  }
                  
                  // Clean existing attributes immediately
                  function cleanAllElements() {
                    extensionAttributes.forEach(attr => {
                      const elements = document.querySelectorAll('[' + attr + ']');
                      elements.forEach(cleanExtensionAttributes);
                    });
                  }
                  
                  // Set up mutation observer for dynamic attributes
                  const observer = new MutationObserver(function(mutations) {
                    mutations.forEach(function(mutation) {
                      if (mutation.type === 'attributes') {
                        const target = mutation.target;
                        if (extensionAttributes.includes(mutation.attributeName)) {
                          cleanExtensionAttributes(target);
                        }
                      } else if (mutation.type === 'childList') {
                        // Clean attributes on newly added nodes
                        mutation.addedNodes.forEach(function(node) {
                          if (node.nodeType === 1) { // Element node
                            cleanExtensionAttributes(node);
                            // Also clean child elements
                            extensionAttributes.forEach(attr => {
                              const childElements = node.querySelectorAll ? node.querySelectorAll('[' + attr + ']') : [];
                              childElements.forEach(cleanExtensionAttributes);
                            });
                          }
                        });
                      }
                    });
                  });
                  
                  // Start observing
                  observer.observe(document.documentElement, {
                    attributes: true,
                    subtree: true,
                    childList: true,
                    attributeFilter: extensionAttributes
                  });
                  
                  // Clean up existing attributes on DOM ready
                  if (document.readyState === 'loading') {
                    document.addEventListener('DOMContentLoaded', cleanAllElements);
                  } else {
                    cleanAllElements();
                  }
                  
                  // Additional cleanup before React hydration
                  setTimeout(cleanAllElements, 0);
                  setTimeout(cleanAllElements, 100);
                }
              })();
            `,
          }}
        />
        
        {/* Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
        
        {/* Performance monitoring */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Web Vitals monitoring
              function sendToAnalytics(metric) {
                // Send to your analytics service
                console.log('Web Vital:', metric);
              }
              
              // Monitor Core Web Vitals
              if (typeof window !== 'undefined') {
                import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
                  getCLS(sendToAnalytics);
                  getFID(sendToAnalytics);
                  getFCP(sendToAnalytics);
                  getLCP(sendToAnalytics);
                  getTTFB(sendToAnalytics);
                });
              }
            `,
          }}
        />
      </body>
    </html>
  )
}