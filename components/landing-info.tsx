"use client";
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";

import {
    Clapperboard, 
    Code2, 
    Component,  
    ImageIcon, 
    MessageSquare, 
    Music2Icon,
    ArrowRight
} from "lucide-react";
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

const LandingInfo = () => {
    return (
        <div className="py-20 text-white space-y-12 mb-20 relative">
            <div className="text-center text-4xl sm:text-5xl font-extrabold mb-6">
                <h2>The Evolution of Content Creation is Here</h2>
            </div>
            <div className="mx-auto max-w-2xl text-center text-xl space-y-5 mb-10">
                <p> Dive into the era where creativity is unbounded, and limitations are a thing of the past. Our platform brings the power of the most advanced AI tools directly to your fingertips, transforming the way your content is crafted. </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {tools.map(tool => (
                    <motion.div 
                        whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)" }}
                        transition={{ duration: 0.25 }}
                        key={tool.label}
                        className="cursor-pointer p-6 space-y-4 rounded-md bg-[#192337] flex items-center"
                    >
                        <tool.icon className={`${tool.color} mr-4`} size={40} />
                        <div>
                            <h3 className="text-xl font-semibold">{tool.label}</h3>
                            <p className="text-gray-400">{tool.description}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
            
        </div>
    );
}

export default LandingInfo;
