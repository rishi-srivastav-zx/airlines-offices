import Navbar from "@/app/navbar";
import Footer from "@/app/footer";
import CallBanner from "@/components/callbanner";
import Breadcrumb from "@/components/Breadcrumb";
import "@/app/globals.css";
import { Toaster } from "react-hot-toast";
export default function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      <Breadcrumb />
      <main className="min-h-screen">{children}</main>
      <Toaster />
      <Footer />
      <div className="pb-10">
        <CallBanner />
      </div>
    </>
  );
}
