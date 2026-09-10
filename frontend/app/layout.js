import "./globals.css";

export const metadata = {
  title: "DHAROHAR — Bharat Guardian",
  description: "Embark on an epic journey through Indian civilization!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
