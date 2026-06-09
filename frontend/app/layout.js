import "./globals.css";
import Navbar from "./components/Navbar";

export const metadata = {
  title: "Restaurant App",
  description: "System rekomendacji restauracji",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pl">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}