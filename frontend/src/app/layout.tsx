import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "HiringAI — AI-Powered Hiring Pipeline",
  description: "Screen resumes, score candidates, and conduct automated voice interviews with AI.",
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased flex flex-col">
        {/* Nav */}
        <nav className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 shadow-sm">
                <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
                </svg>
              </div>
              <span className="text-lg font-bold tracking-tight">
                Hiring<span className="text-violet-600">AI</span>
              </span>
            </Link>
            <div className="flex items-center gap-1">
              <Link
                href="/"
                className="hidden sm:inline-flex rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                Dashboard
              </Link>
              <Link
                href="/candidates"
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                Candidates
              </Link>
              <Link
                href="/architecture"
                className="hidden sm:inline-flex rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                Architecture
              </Link>
              <Link
                href="/jobs"
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                Careers
              </Link>
            </div>
          </div>
        </nav>

        {/* Main */}
        <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t bg-white">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {/* Brand */}
              <div className="sm:col-span-2 lg:col-span-1">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-violet-600 to-indigo-600">
                    <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                    </svg>
                  </div>
                  <span className="text-base font-bold tracking-tight">
                    Hiring<span className="text-violet-600">AI</span>
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                  AI-powered hiring pipeline. Screen resumes, conduct voice interviews, and find the best candidates faster.
                </p>
              </div>

              {/* Product */}
              <div>
                <h3 className="text-sm font-semibold mb-3">Product</h3>
                <ul className="space-y-2">
                  <li><Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link></li>
                  <li><Link href="/candidates" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Candidates</Link></li>
                  <li><Link href="/architecture" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Architecture</Link></li>
                  <li><Link href="/jobs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Careers</Link></li>
                </ul>
              </div>

              {/* Legal */}
              <div>
                <h3 className="text-sm font-semibold mb-3">Legal</h3>
                <ul className="space-y-2">
                  <li><Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms & Conditions</Link></li>
                  <li><Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link></li>
                </ul>
              </div>

              {/* Built with */}
              <div>
                <h3 className="text-sm font-semibold mb-3">Built With</h3>
                <ul className="space-y-2">
                  <li className="text-sm text-muted-foreground">Claude AI by Anthropic</li>
                  <li className="text-sm text-muted-foreground">Vapi Voice Platform</li>
                  <li className="text-sm text-muted-foreground">Next.js + Django</li>
                  <li className="text-sm text-muted-foreground">ElevenLabs TTS</li>
                </ul>
              </div>
            </div>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 border-t pt-6">
              <p className="text-xs text-muted-foreground">
                &copy; {new Date().getFullYear()} HiringAI. All rights reserved.
              </p>
              <div className="flex items-center gap-4">
                <Link href="/terms" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Terms</Link>
                <Link href="/privacy" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Privacy</Link>
                <span className="text-xs text-muted-foreground">
                  Built by <span className="font-medium text-foreground">codewithmuh</span>
                </span>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
