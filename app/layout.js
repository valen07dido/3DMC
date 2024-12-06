import NavBar from "@/Components/NavBar/NavBar";
import "./globals.css";
import { inter } from "@/Utils/fonts";
import Footer from "@/Components/Footer/Footer";

export const metadata = {
  title: "3DMC",
  description: "Soluciones en 3D para todos los rubros",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <NavBar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
