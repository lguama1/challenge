import '@styles/bbog-dig-dt-sherpa-lib.css';
import { RquuidProvider } from '@context/RquuidContext';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Plataforma de gestión interna para colaboradores',
  description: 'Gestiona la creación de usuarios, da accesos y otorga laptops'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <RquuidProvider>
            {children}
        </RquuidProvider>
      </body>
    </html>
  );
}
