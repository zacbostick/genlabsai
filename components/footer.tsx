"use client";
import { motion } from "framer-motion";

export const Footer = () => {
    const footerVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <motion.div 
            variants={footerVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5 }}
            className=" text-white px-8 py-4 full-w pb-10 mt-20"
        >
            
            {/* Copyright Section */}
            <div className="mt-16 text-center text-gray-400">
                <p>&copy; {new Date().getFullYear()} GenLabsAI. All rights reserved.</p>
            </div>
        </motion.div>
    )
}

export default Footer;
