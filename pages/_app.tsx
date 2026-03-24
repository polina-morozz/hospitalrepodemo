import { useState } from "react";
import "@/styles/globals.css";
import { AppProvider } from "@/lib/context/AppContext";
import Layout, { LayoutProps } from "@/components/layout/Layout";
import type { AppProps } from "next/app";

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App({ Component, pageProps }: AppProps) {
  // View mode state — shared across all pages via layout props
  const [isProviderView, setIsProviderView] = useState(false);
  const [isFacilitatorView, setIsFacilitatorView] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [providerTab, setProviderTab] = useState("overview");
  const [facilitatorTab, setFacilitatorTab] = useState("overview");

  const layoutProps: LayoutProps = {
    isProviderView, setIsProviderView,
    isFacilitatorView, setIsFacilitatorView,
    showUserProfile, setShowUserProfile,
    providerTab, setProviderTab,
    facilitatorTab, setFacilitatorTab,
  };

  return (
    <AppProvider>
      <Layout layoutProps={layoutProps}>
        <Component
          {...pageProps}
          layoutProps={layoutProps}
        />
      </Layout>
    </AppProvider>
  );
}
