import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "../components/Layout";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    const publicPaths = ["/login", "/signup"];
    const isLoggedIn = typeof window !== 'undefined' && localStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn && !publicPaths.includes(router.pathname)) {
      router.replace("/login");
    }
  }, [router.pathname]);

  return (
    <Layout>
      <Component {...pageProps} />
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar newestOnTop closeOnClick pauseOnHover />
    </Layout>
  );
}
