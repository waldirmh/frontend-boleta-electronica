// 'use client'
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import React from "react";
import { ToastContainer } from 'react-toastify';
import BootstrapClient from '@/components/bootstrap/BootstrapClient';
import "react-toastify/dist/ReactToastify.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./globals.css"
import Footer from "@/components/footer/Footer"
import Header from "@/components/header/Header"
import { AuthProvider } from "@/context/authContext";


const inter = Inter({
  subsets: ["latin"]
})

export const metadata: Metadata = {
  title: "Cars-Center",
  description: "Generated by create next app",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {

  return (
    <html lang="en">
      <body className={inter.className}>
        <BootstrapClient />
        <div className="app d-flex flex-column">
          <Header />
          <AuthProvider>
            <main className="container">
              {children}
            </main>
            <ToastContainer />
          </AuthProvider>
          <Footer />
        </div>

      </body>
    </html>
  );
}
