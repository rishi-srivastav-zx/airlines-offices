import React from "react";
import Home from "./home";
import Navbar from "./navbar";
import Footer from "./footer";
import CallBanner from "@/components/callbanner";


export default function main() {
    return (
        <div>
          <Navbar/>
           <Home />
           <Footer/>
           <div className="pb-10">

           <CallBanner/>
           </div>
        </div>
    );
}
