import BlogPage from "@/components/blogspage";
import Navbar from "../navbar";
import Footer from "../footer";
import CallBanner from "@/components/callbanner";

export default function() {
    return(
        <>
         <Navbar/>
         <BlogPage/>
         <Footer/>
          <div className="pb-10">
         <CallBanner/>
        </div>
        </>
    )
}