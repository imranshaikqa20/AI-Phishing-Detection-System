import "./globals.css";

export const metadata = {
  title: {
    default: "AI Phishing Detector",
    template: "%s · AI Phishing Detector",
  },
  description:
    "AI-powered phishing detection platform. Scan URLs, emails, and suspicious content instantly using Gemini AI.",
  keywords: [
    "phishing detector",
    "AI cybersecurity",
    "URL scanner",
    "email security",
    "Gemini AI",
    "threat detection",
  ],
  authors: [{ name: "AI Phishing Detector" }],
  creator: "AI Phishing Detector",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: dark)",  color: "#080c10" },
    { media: "(prefers-color-scheme: light)", color: "#f9fafb" },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}