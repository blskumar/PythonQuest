import "./globals.css";

export const metadata = {
  title: "Python Quest | Learn Python by doing",
  description: "A focused, hands-on Python learning path."
};

const themeInitScript = `(function(){try{var t=localStorage.getItem("python-quest-theme");document.documentElement.dataset.theme=t==="dark"?"dark":"light";}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
