"use client";
import React, { useState, useEffect } from 'react';
import {
    Clapperboard, 
    Code2, 
    Component,  
    ImageIcon, 
    MessageSquare, 
    Music2Icon,
    ArrowRight
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Card }from "@/components/ui/card";
import {cn} from "@/lib/utils";
import { motion } from 'framer-motion';

const tools = [
    {
        label: "Chat",
        icon: MessageSquare,
        description: "Our most advanced chat tool.",
        href: "/chat",
        color: "text-[#33A1C4]",
        bgColor: "bg-[#E0F4F8]"
    },
    {
        label: "Images",
        icon: ImageIcon,
        description: "Create stunning images.",
        href: "/image",
        color: "text-[#E94F64]",
        bgColor: "bg-[#FDE5E9]"
    },
    {
        label: "Logos",
        icon: Component,
        description: "Get Inspired by our logo tool.",
        href: "/logo",
        color: "text-[#2EAE8A]",
        bgColor: "bg-[#DFF3EC]"
    },
    {
        label: "Videos",
        icon: Clapperboard,
        description: "Turn your promp into video.",
        href: "/video",
        color: "text-[#E98E29]",
        bgColor: "bg-[#FEEBD7]"
    },
    {
        label: "Music",
        icon: Music2Icon,
        href: "/music",
        description: "Create high quality music.",
        color: "text-[#2A67DB]",
        bgColor: "bg-[#DFE7FA]"
    },
    {
        label: "Code",
        icon: Code2,
        description: "Generate code for your projects.",
        href: "/code",
        color: "text-[#59C451]",
        bgColor: "bg-[#E3F7DC]"
    }
]



const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

const DashboardPage = () => {
    const router = useRouter();
    const [isVisible, setIsVisible] = useState(false);

    // useEffect to add a delay
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true); // After the delay, set content to visible
        }, 500); // 1000ms or 1 second delay. Adjust as needed.

        // Cleanup timer to avoid any potential memory leaks
        return () => clearTimeout(timer);
    }, []);

    if (!isVisible) return null; 
    return (
        <div className="mt-20 space-y-12 md:space-y-20 px-4 md:px-24 lg:px-40">
            <div className="mb-10 space-y-6">
                <h1 className="text-2xl md:text-4xl font-bold text-center">Explore the most powerful AI tools</h1>
                <p className="text-muted-foreground font-light text-sm md:text-md text-center">Get started by selecting a tool below.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                {tools.map((tool, index) => (
                    <motion.div 
                        initial="hidden"
                        animate="visible"
                        variants={fadeInUp}
                        transition={{ duration: 0.4, delay: index * 0.08 }}
                        key={tool.href}
                    >
                        <Card 
    onClick={() => router.push(tool.href)} 
    role="button" 
    aria-label={`Navigate to ${tool.label}`} 
    className="p-4 border border-black/10 flex items-center justify-between hover:shadow-lg transition cursor-pointer space-x-6 md:space-x-6 overflow-hidden"
>
    <div className="flex items-center space-x-4 md:space-x-6">
        <div className={cn("p-3 rounded-full flex-shrink-0", tool.bgColor)}>
            <tool.icon className={cn("w-8 h-8", tool.color)} />
        </div>
        <span className="text-lg md:text-xl font-medium max-w-xs overflow-hidden">
            {tool.label}
            <span className="text-xs flex font-light">
                {tool.description}
            </span>
        </span>
    </div>
    <ArrowRight className="w-6 h-6 text-gray-500 hover:text-gray-600" />
</Card>

                    </motion.div>
                ))}
            </div>
        </div>
    );
}

export default DashboardPage;