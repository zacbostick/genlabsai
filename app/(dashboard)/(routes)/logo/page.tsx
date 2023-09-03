"use client";

import * as z from "zod";
import axios from "axios";
import { formSchema } from "./constants";
import { Component, Download } from "lucide-react";
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
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";


const examplePrompts = [
    "Logo for an eco-friendly brand.",
    "Tech company logo with blue theme.",
    "Minimalistic logo for a bakery.",
    "Mascot logo for a sports team.",
    "Vintage logo for a coffee shop."
  ];
  
const LogoPage = () => {
    const router = useRouter();
    const proModal = useProModal();
    const [isModalOpen, setModalOpen] = useState<boolean>(false);
    const [currentLogo, setCurrentLogo] = useState<string | null>(null);
    const [logos, setLogos] = useState<string[]>(() => {
        const savedLogos = sessionStorage.getItem('generatedLogos');
        return savedLogos ? JSON.parse(savedLogos) : [];
    });
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
            setLogos([]);
            const response = await axios.post('/api/logo', values);
            setLogos((prevLogos) => {
                const newLogos = [...prevLogos, ...response.data.flat()];
                sessionStorage.setItem('generatedLogos', JSON.stringify(newLogos));  // Save to sessionStorage
                return newLogos;
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
        const storedLogos = JSON.parse(sessionStorage.getItem('generatedLogos') || '[]');
        if (storedLogos.length > 0) {
            setLogos(storedLogos);
        }
    }, []);
    return (
        <motion.div className="h-screen p-4 mt-6 flex flex-col" style={{ maxHeight: "80vh" }}  initial="hidden" animate="visible" variants={fadeIn}> 
            <Heading 
                title="LogoGenie"
                description="Turn your text prompt into a brand logo."
                icon={Component}
                iconColor="text-[#34D8AC]"
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
                    className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
                >
                    <FormField 
                        name="prompt"
                        render={({ field }) => (
                            <FormItem className="col-span-12 lg:col-span-10">
                                <FormControl className="m-0 p-0">
                                    <Input 
                                        {...field}
                                        className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent" 
                                        placeholder="logo for website, abstract, flat, minimalistic"
                                        disabled={isLoading}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <Button className="col-span-12 lg:col-span-2 w-full" variant="generate" disabled={isLoading}>
                        Generate
                    </Button>
                </form>
            </Form>         
        </div>

        <div className="space-y-4 mt-4">
            {isLoading && (
                <div className="p-8 rounded-lg w-full flex items-center justify-center ">
                    <Loader />
                </div>
            )}

            {!isLoading && logos.length === 0 && (
                <Empty label="No images generated." />
            )}

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-20 p-6">
                {logos.map((logoUrl, index) => (
                    <Card
                        key={index}
                        className="rounded-lg overflow-hidden cursor-pointer"
                        onClick={() => {
                            setCurrentLogo(logoUrl);
                            setModalOpen(true);
                        }}
                    >
                        <div className="relative aspect-square">
                            <Image
                                alt="Generated Image"
                                width={200}
                                height={200}
                                layout="responsive"
                                objectFit="cover"
                                src={logoUrl}
                            />
                        </div>

                        <CardFooter className="p-2">
                            <Button 
                                onClick={() => window.open(logoUrl)} 
                                variant="secondary" 
                                className="w-full"
                            >
                                <Download className="h-4 w-4 mr-2" />
                                Download
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>

    </motion.div>
)

}
export default LogoPage;