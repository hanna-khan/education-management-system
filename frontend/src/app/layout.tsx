import type { Metadata } from "next";
import { Open_Sans, Poppins } from "next/font/google";
import { AppProvider } from "@/hooks/use-app";
import { SchoolEventsProvider } from "@/hooks/use-school-events";
import { ToastProvider } from "@/components/shared/toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Zendrock EMS — Education Management System",
    template: "%s · Zendrock EMS",
  },
  description:
    "Premium multi-tenant Education Operations & Student Lifecycle Management platform for universities and schools.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${openSans.variable} h-full`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var p=localStorage.getItem("ems-theme-preset")||"edu-center";var m=localStorage.getItem("ems-color-mode")||"light";document.documentElement.setAttribute("data-theme-preset",p);document.documentElement.setAttribute("data-theme",m);}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-full antialiased">
        <AppProvider>
          <SchoolEventsProvider>
            <ToastProvider>
              <TooltipProvider>{children}</TooltipProvider>
            </ToastProvider>
          </SchoolEventsProvider>
        </AppProvider>
      </body>
    </html>
  );
}
