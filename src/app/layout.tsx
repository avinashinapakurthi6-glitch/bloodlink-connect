import type { Metadata } from "next";
import "./globals.css";
import VisualEditsMessenger from "../visual-edits/VisualEditsMessenger";
import ErrorReporter from "@/components/ErrorReporter";
import Script from "next/script";
import AuthGuard from "@/components/layout/AuthGuard";

export const metadata: Metadata = {
  title: "BloodLink - Save Lives Together",
  description: "Blood donation management system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Script
          id="orchids-browser-logs"
          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/scripts/orchids-browser-logs.js"
          strategy="afterInteractive"
          data-orchids-project-id="2d93c7e9-6a83-4af2-99ae-dc7bff9cb68f"
        />
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
