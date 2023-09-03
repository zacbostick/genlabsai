"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { motion } from "framer-motion";
const testimonials = [
  {
    name: "Jay",
    avatar: "/2.jpeg",
    title: "Software Engineer",
    description: "Every second counts in development. The Code Generator not only saves me hours but also ensures that I have clean, efficient code every time. It's my secret weapon for maintaining consistent project momentum.",
  },
  {
    name: "Ashley",
    avatar: "/106.jpg",
    title: "Designer",
    description: "Creative blocks happen, but with the logo generator, I can instantly spark inspiration and present fresh, innovative concepts to my clients. It's like having an infinite well of creativity at my fingertips.",
  },
  {
    name: "Conor",
    avatar: "/4.jpeg",
    title: "Blogger",
    description: "Finding the right image to resonate with my readers used to be a time-consuming task. Now, with the image generator, I have tailor-made visuals that elevate my content and engage my audience like never before.",
  },
  {
    name: "Marissa",
    avatar: "/1562.jpg",
    title: "Entrepreneur",
    description: "Building a business means constantly brainstorming and innovating. The chat generator has become an indispensable tool for me, enabling fresh perspectives and sparking ideas that help propel my ventures forward.",
  },
];

export const LandingContent = () => {
  const cardVariants = {
      hidden: { opacity: 0, scale: 0.95 },
      visible: { opacity: 1, scale: 1 },
  };

  return (
      <div className="px-4 pb-16">
          <motion.h2 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center text-4xl text-white font-extrabold"
          >
              Testimonials
          </motion.h2>
          
          <p className="text-center text-gray-300 mb-8 mt-2">See what our users have to say about us!</p>
          <div className="mx-auto max-w-2xl text-center text-xl space-y-5 text-white mt-4 mb-4">
                <p>Whether it&apos;s drafting a compelling blog, generating captivating visuals, or even composing melodies, the future of content creation is now. And it&apos;s all made possible with our platform.</p>
            </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-20">
              {testimonials.map((item, index) => (
                  <motion.div 
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                      key={item.description}
                      className="h-full"  // added full height class
                  >
                      <Card className="h-full bg-gradient-to-br from-[#192339] to-[#1a2537] border-none text-white shadow-md hover:shadow-lg transition-shadow duration-300">
                          <CardHeader className="flex flex-col items-center p-4">
                              <CardTitle className="flex flex-col items-center text-center mt-2">
                                  <Image className="rounded-full shadow-md" alt={item.name} src={item.avatar} width={150} height={150} />
                                  <p className="text-xl font-semibold mt-3">{item.name}</p>
                                  <p className="text-gray-400 font-medium text-lg mt-1">{item.title}</p>
                              </CardTitle>
                              <CardContent className="pt-3 px-2 text-center">
                                  <p className="text-gray-300">{item.description}</p>
                              </CardContent>
                          </CardHeader>
                      </Card>
                  </motion.div>
              ))}
          </div>
      </div>
  )
}