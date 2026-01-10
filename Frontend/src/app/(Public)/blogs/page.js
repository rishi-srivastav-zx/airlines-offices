import BlogPage from "@/components/blogspage";
import CallBanner from "@/components/callbanner";

export default function() {
    return(
        <>
         <BlogPage/>
          <div className="pb-10">
         <CallBanner/>
        </div>
        </>
    )
}