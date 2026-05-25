import "./globals.css";

export const metadata = {

  title: "AI Phishing Detection",

  description: "Cybersecurity Web Application",
};

export default function RootLayout({

  children,

}) {

  return (

    <html lang="en">

      <body>

        {children}

      </body>

    </html>
  );
}