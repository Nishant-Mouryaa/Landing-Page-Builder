import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { FirebaseAuthProvider } from "@/context/firebase-auth-provider";
import { StoreProvider } from "@/store/store-provider";
import TopLoadingBar from "@/components/top-loading-bar";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Landerr. | Dashboard",
    description: "Lading page builder",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <StoreProvider>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange>
                        <FirebaseAuthProvider>
                            <TopLoadingBar />
                            <Toaster />
                            {children}
                        </FirebaseAuthProvider>
                    </ThemeProvider>
                </StoreProvider>
            </body>
        </html>
    );
}
