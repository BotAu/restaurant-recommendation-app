import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Restaurant App",
  description: "System rekomendacji restauracji",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pl">
      <body>
        <nav className="bg-gray-950 text-white px-8 py-4 border-b border-gray-800">
          <div className="flex gap-6 items-center">
            <Link href="/" className="font-bold text-xl">
              RestaurantApp
            </Link>

            <Link href="/restaurants" className="hover:text-gray-300">
              Restauracje
            </Link>

            <Link href="/register" className="hover:text-gray-300">
              Rejestracja
            </Link>

            <Link href="/login" className="hover:text-gray-300">
              Logowanie
            </Link>
          </div>
        </nav>

        {children}
      </body>
    </html>
  );
}