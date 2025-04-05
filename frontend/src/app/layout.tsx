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
          <footer>
            
            © 2025 VEFFORRITUN 2
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
