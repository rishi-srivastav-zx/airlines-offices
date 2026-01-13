"use client";
import { DashboardPage } from "@/dashboardComponents/dashboard";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUserRole } from "@/utils/auth";


export default function Home () {
    const router = useRouter();
    useEffect(() => {
       const role = getUserRole()?.toUpperCase();
       // Middleware already handles role checking, but keep this as backup
       if (role && !["SUPERADMIN", "MANAGER", "EDITOR"].includes(role)) {
        router.push("/unauthorized");
       }
    }, [router]);


    return(
        <>
          <DashboardPage/>
        
        </>
    )
}