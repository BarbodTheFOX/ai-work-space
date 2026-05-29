import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";
import { OpsProvider } from "./providers";

export const metadata: Metadata = {
  title: "Eventum Ops Cockpit",
  description: "Private internal operations cockpit for the Eventum team.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <OpsProvider>
          <AppShell>{children}</AppShell>
        </OpsProvider>
      </body>
    </html>
  );
}
