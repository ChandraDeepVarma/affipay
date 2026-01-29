import PluginInit from "@/helper/PluginInit";
import "./font.css";
import "./globals.css";
import "./font.css";
import "./custom-quill.css";
import { UserStatusProvider } from "@/context/UserStatusContext";
import Providers from "./providers";

export const metadata = {
  title: "Effipay-admin",
  description: "Effipay-admin",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <PluginInit />
      <body suppressHydrationWarning={true}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
