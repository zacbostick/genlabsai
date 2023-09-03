"use client";

import * as z from "zod";
import axios from "axios";
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Clapperboard } from "lucide-react";
import { useRouter } from "next/navigation";

import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Loader } from "@/components/loader";
import { Empty } from "@/components/empty";
import { formSchema } from "./constants";
import { useProModal } from "@/hooks/use-pro-modal";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const examplePrompts = [
  "A butterfly emerging from its cocoon and taking its first flight.",
  "A bustling city street transitioning from day to night with lights slowly coming on.",
  "Raindrops hitting a pond, causing ripples, followed by a rainbow forming in the sky.",
  "An old tree in the forest sprouting flowers and fruits as seasons change.",
  "A spaceship taking off, traveling through the stars, and landing on a distant planet.",
  "Waves crashing onto a beach, pulling back and revealing a message in a bottle.",
  "A potter shaping clay on a wheel, transforming it into a beautiful vase.",
  "A clock's hands moving rapidly, showing the passage of time from morning to midnight.",
  "A baby bird in a nest, learning to fly, and eventually soaring in the sky.",
  "A train journey showcasing various landscapes, from snowy mountains to vast deserts."
];

const VideoPage = () => {
  const router = useRouter();
  const proModal = useProModal();
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
const [currentVideo, setCurrentVideo] = useState<string | null>(null);

const [videos, setVideos] = useState<VideoData[]>(() => {
  const savedVideos = sessionStorage.getItem('generatedVideos');
  return savedVideos ? JSON.parse(savedVideos) : [];
});

  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    }
  });
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1.5 } }
};
  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post('/api/video', values);
      setVideos((prevVideos) => {
        const newVideoData: VideoData = {
          src: response.data.flat()[0], // assuming you get one video for now
          prompt: values.prompt
        };
        const newVideos = [...prevVideos, newVideoData];
        sessionStorage.setItem('generatedVideos', JSON.stringify(newVideos));
        return newVideos;
      });
      form.reset();
    } catch(error: any) {
          if(error?.response?.status === 403){
            proModal.onOpen();
          } else{
            toast.error("Something went wrong. Please try again.");
          }
        } finally{
            router.refresh();
        }
    }
    type VideoData = {
      src: string;
      prompt: string;
    };
    
    useEffect(() => {
      const storedVideos = JSON.parse(sessionStorage.getItem('generatedVideos') || '[]');
      if (storedVideos.length > 0) {
        setVideos(storedVideos);
      }
    }, []);
    
  return ( 
    <motion.div className="h-screen p-4 mt-6 flex flex-col " style={{ maxHeight: "80vh" }} initial="hidden"
    animate="visible"
    variants={fadeIn}> 
      <Heading
        title="VideoGenie"
        description="Turn your prompt into video."
        icon={Clapperboard}
        iconColor="text-[#FFA03D]"
      />
      <div className="mb-6 px-4 lg:px-8">
                <h4 className="text-xl font-semibold mb-4">Example Prompts:</h4>
                <div className="flex overflow-x-auto no-scrollbar space-x-6">
              {examplePrompts.map((prompt, idx) => (
                <button 
                  key={idx} 
                  onClick={() => form.setValue("prompt", prompt)}
                  className="text-sm bg-white hover:bg-gray-200 py-2 px-4 rounded-md cursor-pointer whitespace-nowrap shadow-md border border-gray-200 transition-colors duration-200 ease-in-out mb-4"
              >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
      <div className="px-4 lg:px-8">
        <Form {...form}>
          <form 
            onSubmit={form.handleSubmit(onSubmit)} 
            className="
              rounded-lg 
              border 
              w-full 
              p-4 
              px-3 
              md:px-6 
              focus-within:shadow-sm
              grid
              grid-cols-12
              gap-2
            "
          >
            <FormField
              name="prompt"
              render={({ field }) => (
                <FormItem className="col-span-12 lg:col-span-10">
                  <FormControl className="m-0 p-0">
                    <Input
                      className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                      disabled={isLoading} 
                      placeholder="Clown fish swimming in a coral reef" 
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button className="col-span-12 lg:col-span-2 w-full" variant="generate" disabled={isLoading}>Generate</Button>
          </form>
        </Form>
        {isLoading && (
          <div className="p-20">
            <Loader />
          </div>
        )}
        {!videos && !isLoading && (
          <Empty label="No video files generated." />
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mt-4 p-8">
  {videos.map((videoData) => (
    <div 
      key={videoData.src} 
      className="rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-300 ease-in-out"
      onClick={() => {
        setCurrentVideo(videoData.src);
        setModalOpen(true);
      }}
    >
      <p className="bg-gray-100 text-gray-700 p-2 font-semibold truncate">{videoData.prompt}</p>
      <video controls className="w-full bg-black">
        <source src={videoData.src} />
      </video>
    </div>
  ))}
</div>


{isModalOpen && (
  <div 
    className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 flex items-center justify-center z-50"
    onClick={() => setModalOpen(false)}
  >
    <div className="relative w-2/3 h-auto bg-white rounded-lg p-4">
      <video controls className="w-full">
        <source src={currentVideo!} />
      </video>
      <button 
          className="absolute top-2 right-2 text-xl font-bold cursor-pointer" 
          onClick={() => setModalOpen(false)}
      >
          &times;
      </button>
    </div>
  </div>
)}

      </div>
    </motion.div>
   );
}
 
export default VideoPage;