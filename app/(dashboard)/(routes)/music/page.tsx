"use client";

import * as z from "zod";
import axios from "axios";
import { formSchema } from "./constants";
import { Music2Icon } from "lucide-react";
import { Heading } from  "@/components/heading";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter} from "next/navigation";
import { useState, useEffect } from "react";
import { Empty } from "@/components/empty";
import { Loader } from "@/components/loader";
import { useProModal } from "@/hooks/use-pro-modal";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const examplePrompts = [
  "Major C melodies evoking a sunrise, light and hopeful.",
  "Irish folk tune, whimsical, primarily with strings.",
  "E flat major jazz piece, smoky room ambience, soft piano touches.",
  "Minor A, energetic techno beat, nighttime city vibes.",
  "G major ballad, nostalgic and emotional, centered around acoustic guitar.",
  "African rhythms, celebratory, featuring percussion and vocal chants.",
  "F sharp minor tune, mysterious, ideal for a spy thriller scene.",
  "Old Western theme, dusty roads, harmonica lead.",
  "B flat major, electronic chill, evoking neon-lit rain.",
  "Spanish flamenco, passionate and fiery, dominated by rapid guitar."
];

const MusicPage = () => {
  const router = useRouter();
  const proModal = useProModal();
  const [currentMusic, setCurrentMusic] = useState<string | null>(null);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [musics, setMusics] = useState<MusicData[]>(() => {
    const savedMusics = sessionStorage.getItem('generatedMusics');
    return savedMusics ? JSON.parse(savedMusics) : [];
  });
  useEffect(() => {
    const storedMusics = JSON.parse(sessionStorage.getItem('generatedMusics') || '[]');
    if (storedMusics.length > 0) {
      setMusics(storedMusics);
    }
  }, []);

    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        prompt: "",
      }
    });
    const isLoading = form.formState.isSubmitting;
    const fadeIn = {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration: 1.5 } }
  };
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
       const response = await axios.post('/api/music', values);
       setMusics((prevMusics) => {
         const newMusicData: MusicData = {
           audio: response.data,
           prompt: values.prompt
         };
         const newMusics = [...prevMusics, newMusicData];
         sessionStorage.setItem('generatedMusics', JSON.stringify(newMusics));
         return newMusics;
       });
       form.reset();
    } catch (error: any) {
          if(error?.response?.status === 403){
            proModal.onOpen();
          } else{
            toast.error("Something went wrong. Please try again.");
          }
        } finally{
            router.refresh();
        }
    }
    type MusicData = {
      audio: string;
      prompt: string;
    };

    
    return(
      <motion.div className="h-screen p-4 mt-6 flex flex-col "style={{ maxHeight: "80vh" }} initial="hidden"
      animate="visible"
      variants={fadeIn}> 
            <Heading 
                title="MusicGenie"
                description="Turn your text prompt into music."
                icon={Music2Icon}
                iconColor="text-[#007BFF]"
                
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
                    <form onSubmit={form.handleSubmit(onSubmit)}
                    className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid gid-cols-12 gap-2">
                        <FormField 
                          name="prompt"
                          render={({field}) => (
                            <FormItem className="col-span-12 lg:col-span-10">
                            <FormControl className="m-0 p-0">
                                <Input 
                                className="border-0 outline-none  focus-visible:ring-0 focus-visible:ring-transparent" disabled={isLoading} placeholder="Synth Wave Reggae Groove" {...field}/>
                            </FormControl>
                            </FormItem>
                          )}/>
                          <Button className="col-span-12 lg:col-span-2 w-full" variant="generate" disabled={isLoading}>Generate</Button>
                    </form>
                </Form>
                            
            </div>
            <div className="space-y-4 mt-4">
          {isLoading && (
            <div className="p-8 rounded-lg w-full flex items-center justify-center ">
              <Loader />
              
            </div>
          )}
          {!musics && !isLoading && (
            <Empty label="No music prompts written." />
          )}
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mt-4 p-8">
    {musics.map((musicData, idx) => (
        <div 
            key={musicData.audio} 
            className="rounded-lg bg-white shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 ease-in-out"
        >
            <div className="p-4">
                <h3 className="text-gray-700 font-medium mb-2 truncate">{musicData.prompt}</h3>
            </div>
            <div className="relative bg-gray-100 p-4">
                <audio controls className="w-full">
                    <source src={musicData.audio} />
                </audio>
            </div>
        </div>
    ))}
</div>


                </div>
            </motion.div>
        
    )
}
export default MusicPage;