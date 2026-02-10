
import { Suspense } from "react";
import Directory from "@/components/Directory";
import CallBanner from "@/components/callbanner";


export default function() {
    return(
        <>
          <Suspense fallback={<div>Loading...</div>}>
            <Directory/>
          </Suspense>
          <div className="pb-10">
         
          <CallBanner/>
           </div>
        </>
    )
}