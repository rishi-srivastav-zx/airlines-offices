import Directory from "@/components/Directory";
import Navbar from "../navbar";
import Footer from "../footer";
import CallBanner from "@/components/callbanner";


export default function() {
    return(
        <>
          <Navbar/>
          <Directory/>
          <Footer/>
          <div className="pb-10">
         
          <CallBanner/>
           </div>
        </>
    )
}