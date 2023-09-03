"use client";

import * as z from "zod";
import axios from "axios";
import { formSchema } from "./constants";
import { Download, ImageIcon } from "lucide-react";
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
import { Card, CardFooter } from "@/components/ui/card";
import Image from "next/image";
import { useProModal } from "@/hooks/use-pro-modal";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

const examplePrompts = [
  "A sunset over the ocean with dolphins jumping.",
  "A futuristic city in the rain.",
  "A serene mountain landscape in autumn.",
  "A sci-fi robot playing a musical instrument.",
  "A medieval knight facing a dragon."
];


const ImagePage = () => {
    const router = useRouter();
    const proModal = useProModal();
    const [images, setImages] = useState<string[]>(() => {
      const savedImages = sessionStorage.getItem('generatedImages');
      return savedImages ? JSON.parse(savedImages) : [];
  });
  
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
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
        try{
            const response = await axios.post('/api/image', values);
            setImages((prevImages) => {
              const newImages = [...prevImages, ...response.data.flat()];
              sessionStorage.setItem('generatedImages', JSON.stringify(newImages));
              return newImages;
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
    useEffect(() => {
      const storedImages = JSON.parse(sessionStorage.getItem('generatedImages') || '[]');
      if (storedImages.length > 0) {
          setImages(storedImages);
      }
  }, []);

      return(
        <motion.div className="h-screen p-4 mt-6 flex flex-col "
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          style={{ maxHeight: "80vh" }} > 
            <Heading 
                title="ImageGenie"
                description="AI Image Generation."
                icon={ImageIcon}
                iconColor="text-[#FE5857]"
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
                    className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid gid-cols-12 gap-2 ">
                        <FormField 
                          name="prompt"
                          render={({field}) => (
                            <FormItem className="col-span-12 lg:col-span-10">
                            <FormControl className="m-0 p-0">
                                <Input 
                                className="border-0 outline-none  focus-visible:ring-0 focus-visible:ring-transparent" disabled={isLoading} placeholder="A picture of a dog surfing." {...field}/>
                            </FormControl>
                            </FormItem>
                          )}/>
                          <Button className="col-span-12 lg:col-span-2 w-full" variant="generate" disabled={isLoading}>Generate</Button>
                    </form>
                </Form>       
            </div>
            <div className="space-y-4 mt-2">
              {isLoading && (
            <div className="p">
              <Loader />
            </div>
            )}
              {images.length === 0 && !isLoading && (
                <Empty label="No images generated." />
              )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-4 p-8">
            {images.map((src: string) => (
              <Card
              key={src}
              className="rounded-lg overflow-hidden cursor-pointer"
              onClick={() => {
                  setCurrentImage(src);
                  setModalOpen(true);
              }}
          >
                <div className="relative aspect-square">
                  <Image
                    alt="Generated Image"
                    fill
                    src={src}
                  /> 
                  </div>
                  <CardFooter className="p-2">
                    <Button  onClick= {() => window.open(src)} variant="secondary" className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </CardFooter>
              </Card>
              ))}
          </div>
          {isModalOpen && (
            <div 
              className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 flex items-center justify-center z-50"
              onClick={() => setModalOpen(false)}
            >
            <div className="relative w-2/3 h-auto bg-white rounded-lg p-4">
            <Image 
                alt="Expanded Generated Image" 
                src={currentImage!} 
                layout="responsive" 
                width={500}
                height={500}
            />
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
    )
}
export default ImagePage;