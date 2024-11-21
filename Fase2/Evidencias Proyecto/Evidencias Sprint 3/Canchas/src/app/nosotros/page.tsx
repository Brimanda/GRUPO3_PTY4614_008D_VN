"use client";

import { useAuth } from "@/components/component/auth/AuthProvider";
import { AboutUsComponent } from "@/components/component/home/about-us";
import { HeaderComponent } from "@/components/component/home/header";
import { FooterComponent } from "@/components/component/home/footer";

export default function Nosotros(){
    return (
        <><><HeaderComponent /><AboutUsComponent /></><FooterComponent /></>
    )
}