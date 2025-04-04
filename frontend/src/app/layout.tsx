import '../../styles/globals.scss';
import { AuthProvider } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="is">
      <body>
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
          <footer className="mt-8 p-4 text-center text-sm text-gray-500 border-t">
            © 2025 VEFFORRITUN 2
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
