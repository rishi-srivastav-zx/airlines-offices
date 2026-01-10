import Navbar from "@/app/navbar";
import Footer from "@/app/footer";
import CallBanner from "@/components/callbanner";
import Breadcrumb from "@/components/Breadcrumb";
import "@/app/globals.css";
export default function PublicLayout({ children }) {
    return (
        <>
            <Navbar />
            <Breadcrumb/>
            <main className="min-h-screen">{children}</main>
            <Footer />
            <div className="pb-10">
                <CallBanner />
            </div>
        </>
    );
}
