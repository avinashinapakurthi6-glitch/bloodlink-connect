import type { Metadata } from "next";
import "./globals.css";
import VisualEditsMessenger from "../visual-edits/VisualEditsMessenger";
import ErrorReporter from "@/components/ErrorReporter";
import Script from "next/script";
import AuthGuard from "@/components/layout/AuthGuard";

export const metadata: Metadata = {
  title: "BloodLink - Save Lives Together",
  description: "Advanced blood donation management system for efficient inventory tracking and donor coordination",
  keywords: ["blood donation", "donation management", "blood inventory", "healthcare"],
  viewport: "width=device-width, initial-scale=1",
  charSet: "utf-8",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="antialiased">
        <ErrorReporter />
        <Script
          id="google-translate"
          src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
          strategy="afterInteractive"
        />
        <Script id="google-translate-init" strategy="afterInteractive">
          {`
            window.googleTranslateElementInit = function() {
              new window.google.translate.TranslateElement({
                pageLanguage: 'en',
                includedLanguages: 'en,es,fr,hi,bn,te,mr,ta,gu,kn,ml,pa',
                layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
                autoDisplay: false
              }, 'google_translate_element');
            }
            
            // Clean up translate banner
            const style = document.createElement('style');
            style.innerHTML = \`
              .goog-te-banner-frame { display: none !important; }
              body { top: 0 !important; }
              .goog-te-gadget { display: none !important; }
              .goog-tooltip { display: none !important; }
                    .goog-tooltip:hover { display: none !important; }
                    .goog-text-highlight { background-color: transparent !important; border: none !important; box-shadow: none !important; }
                  \`;
                  document.head.appendChild(style);
                `}
              </Script>
            <AuthGuard>
              {children}
            </AuthGuard>
            <div id="google_translate_element" style={{ display: 'none' }}></div>
            <VisualEditsMessenger />
      </body>
    </html>
  );
}
