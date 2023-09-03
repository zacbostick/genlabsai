"use client";
import Link from "next/link";
import Image from "next/image";
import { Montserrat } from "next/font/google";
import { cn } from "@/lib/utils";
import { Clapperboard, Code2, CogIcon, Component,  ImageIcon, LayoutGrid, MessageSquare, Music2Icon } from "lucide-react";
import {usePathname} from "next/navigation";
import { FreeCounter } from "./free-counter";
const montserrat = Montserrat({weight: "600", 
subsets: ["latin-ext"]})

const routes = [
    {
        label: "Dashboard",
        icon: LayoutGrid,
        href: "/dashboard",
        color: "text-white/80"
    },
    {
        label: "Chat",
        icon: MessageSquare,
        href: "/chat",
        color: "text-white/80"
        
    },
    {
        label: "Image Generator",
        icon: ImageIcon,
        href: "/image",
        color: "text-white/80"
    },
    {
        label: "Logo Generator",
        icon: Component,
        href: "/logo",
        color: "text-white/80"
    },
    {
        label: "Video Generator",
        icon: Clapperboard,
        href: "/video",
        color: "text-white/80"
    },
    {
        label: "Music Generator",
        icon: Music2Icon,
        href: "/music",
        color: "text-white/80"
    },
    {
        label: "Code Generator",
        icon: Code2,
        href: "/code",
        color: "text-white/80"
    },
    {
        label: "Settings",
        icon: CogIcon,
        href: "/settings",
        color: "text-white/80"
    }
]


export const Sidebar = ({
    apiLimitCount = 0,
    isPro = false
  }: {
    apiLimitCount: number;
  isPro: boolean;

    
  }) => {
    const pathname = usePathname();
    return(
        <div className="space-y-4 py-4 flex flex-col h-full bg-[#111827] text-white">
            <div className="px-3 py-2 flex-1">
                <Link href="/dashboard" className="flex items-center pl-3 mb-14">
                 <div className=" relative w-8 h-8 mr-4">
                    <Image fill alt="Logo" src="/logo.png" />
                 </div>
                 <h1 className={cn("text-2xl font-bold", montserrat.className)}>GenLabs AI</h1>
                </Link>
                <div className="space-y-1">
                    {routes.map((route)=>(
                        <Link href={route.href} key={route.href} className={cn("text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition", pathname === route.href ? "text-white bg-white/10" : "text-white/80")}>
                            <div className="flex items-center flex-1">
                                <route.icon className={cn("w-5 h-5 mr-3", route.color)} />
                                <span>{route.label}</span>
                            </div>
                            
                        </Link>
                    ))}
                </div>
                </div>
                <FreeCounter
                    isPro={isPro}
                    apiLimitCount={apiLimitCount}
                 />
        </div>
    )
}
export default Sidebar;