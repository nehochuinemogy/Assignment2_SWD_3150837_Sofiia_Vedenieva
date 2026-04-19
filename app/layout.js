import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Appliance Inventory",
  description: "Improved Part BC from previous assignment",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body> 
        <Navbar />
        <main className= "main">
          {children}
        </main>
          <footer className="footer">
          <p>Household Appliance Inventory &copy; {new Date().getFullYear()}</p>
        </footer>
      </body>
    </html>
  );
}
