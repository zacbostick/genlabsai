import { motion } from 'framer-motion';
import Image from 'next/image';

interface EmptyProps {
    label: string;
}

export const Empty = ({ label }: EmptyProps) => {
    return (
        <div className="h-full p-20 flex flex-col items-center justify-center">
            <motion.div
                className="relative h-40 w-40"
                initial={{ y: 0 }}
                animate={{
                    y: ["0%", "5%", "0%"],  // this will move the image up by 5% and then back to its original position
                }}
                transition={{
                    duration: 2, // Adjust this value for speed. Here 2 means 2 seconds for one loop.
                    repeat: Infinity,  // Infinite loops
                    ease: "easeInOut", // Smooth easing in and out
                }}
            >
                <Image
                    src="/empty.png"
                    alt="Empty"
                    layout="fill"
                />
            </motion.div>
            <p className="text-muted-foreground text-sm text-center pt-8">
                {label}
            </p>
        </div>
    );
}
