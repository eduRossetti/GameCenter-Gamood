export const metadata = {
  title: "Gamood",
  description: "Gamood Game Center",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
