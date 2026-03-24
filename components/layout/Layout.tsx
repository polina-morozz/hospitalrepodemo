import Nav from "@/components/layout/Nav";
import FloatingViewSwitcher from "@/components/layout/FloatingViewSwitcher";
import ProviderDashboard from "@/components/dashboards/ProviderDashboard";
import FacilitatorPortal from "@/components/dashboards/FacilitatorPortal";
import { ReactNode } from "react";

// ─── LAYOUT PROPS ─────────────────────────────────────────────────────────────
export interface LayoutProps {
  isProviderView: boolean;
  setIsProviderView: React.Dispatch<React.SetStateAction<boolean>>;
  isFacilitatorView: boolean;
  setIsFacilitatorView: React.Dispatch<React.SetStateAction<boolean>>;
  showUserProfile: boolean;
  setShowUserProfile: React.Dispatch<React.SetStateAction<boolean>>;
  providerTab: string;
  setProviderTab: React.Dispatch<React.SetStateAction<string>>;
  facilitatorTab: string;
  setFacilitatorTab: React.Dispatch<React.SetStateAction<string>>;
}

// ─── LAYOUT ───────────────────────────────────────────────────────────────────
export default function Layout({ children, layoutProps }: { children: ReactNode; layoutProps: LayoutProps }) {
  const {
    isProviderView, setIsProviderView,
    isFacilitatorView, setIsFacilitatorView,
    showUserProfile, setShowUserProfile,
    providerTab, setProviderTab,
    facilitatorTab, setFacilitatorTab,
  } = layoutProps;

  return (
    <>
      <Nav
        isProviderView={isProviderView}
        setIsProviderView={setIsProviderView}
        isFacilitatorView={isFacilitatorView}
        setIsFacilitatorView={setIsFacilitatorView}
        showUserProfile={showUserProfile}
        setShowUserProfile={setShowUserProfile}
        providerTab={providerTab}
        setProviderTab={setProviderTab}
        facilitatorTab={facilitatorTab}
        setFacilitatorTab={setFacilitatorTab}
      />
      <main>
        {isProviderView
          ? <ProviderDashboard tab={providerTab} setTab={setProviderTab} />
          : isFacilitatorView
            ? <FacilitatorPortal tab={facilitatorTab} setTab={setFacilitatorTab} />
            : children}
      </main>
      <FloatingViewSwitcher
        showUserProfile={showUserProfile}
        setShowUserProfile={setShowUserProfile}
        isProviderView={isProviderView}
        setIsProviderView={setIsProviderView}
        isFacilitatorView={isFacilitatorView}
        setIsFacilitatorView={setIsFacilitatorView}
      />
    </>
  );
}
