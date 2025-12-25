import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import {
  ClerkProvider,
  SignedOut,
  SignedIn,
  SignUpButton,
  SignInButton,
} from "@clerk/nextjs";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DocsTalk",
  description: "RAG PDF Assistant",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {/* 🔐 SIGNED OUT UI */}
          <SignedOut>
            <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-white to-indigo-50">
              <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
                <h1 className="text-3xl font-bold text-gray-800 text-center">
                  DocsTalks
                </h1>
                <p className="text-gray-500 text-center mt-2">
                  Chat with your PDFs using AI
                </p>

                <div className="mt-8 space-y-4">
                  <SignUpButton mode="modal">
                    <button className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">
                      Create an account
                    </button>
                  </SignUpButton>

                  <SignInButton mode="modal">
                    <button className="w-full py-3 rounded-xl border border-gray-300 font-medium text-gray-700 hover:bg-gray-100 transition">
                      Sign in to existing account
                    </button>
                  </SignInButton>
                </div>

                <p className="text-xs text-gray-400 text-center mt-6">
                  Secure authentication powered by Clerk
                </p>
              </div>
            </div>
          </SignedOut>

          <SignedIn>{children}</SignedIn>
        </body>
      </html>
    </ClerkProvider>
  );
}
