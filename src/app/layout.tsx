'use client'
import { Geist, Geist_Mono } from "next/font/google";
import { useEffect } from 'react'
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    // easter eggs
  useEffect(() => {
    easterEggs();
  }, []);

  const easterEggs = () => {
    if (typeof window === "undefined") {
      return;
    }

    (window as any).help = () => {
      console.log("%cAvailable commands:", "color: #00ffcc");
      console.log("%cbackflip() %c– BACKFLIP", "color: #ff66cc", "color: #ccc");
      console.log("%ccolorblast() %c– goes full rave mode", "color: #ff66cc", "color: #ccc");
      console.log("%cgolf() %c– summons the gnome 👀", "color: #ff66cc", "color: #ccc");
    };

    (window as any).backflip = () => {
      document.body.style.transition = "transform 0.8s linear";
      document.body.style.transform = "rotate(-360deg)";

      setTimeout(() => {
        document.body.style.transition = "";
        document.body.style.transform = "";
      }, 900);
    }

    setTimeout(() => {
      console.log("%cWelcome golfer! Type help() for secrets 🧠", "color: #00ffcc");
    }, 500);
  }

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
