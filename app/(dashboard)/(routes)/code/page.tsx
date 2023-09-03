"use client";

import * as z from "zod";
import axios from "axios";
import { formSchema } from "./constants";
import { Code2 } from "lucide-react";
import { Heading } from  "@/components/heading";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter} from "next/navigation";
import OpenAI from "openai" 
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Empty } from "@/components/empty";
import { Loader } from "@/components/loader";
import {cn} from "@/lib/utils";
import { UserAvatar } from "@/components/user-avatar";
import { BotAvatar } from "@/components/bot-avatar";
import { useProModal } from "@/hooks/use-pro-modal";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const CodePage = () => {
    const router = useRouter();
    const proModal = useProModal();
    const [messages, setMessages] = useState<OpenAI.Chat.ChatCompletionMessage []>([]);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prompt: ""
        }
    });
    const isLoading = form.formState.isSubmitting;
    const fadeIn = {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration: 1.5 } }
  };
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try{
            const userMessage: OpenAI.Chat.ChatCompletionMessage = { role: "user", content: values.prompt };
            const newMessages = [...messages, userMessage];
            const response = await axios.post('/api/code', { messages: newMessages });

      setMessages((current) => [...current, userMessage, response.data]);
      
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
    return(
        <motion.div className="h-screen p-4 mt-6 flex flex-col "style={{ maxHeight: "80vh" }} initial="hidden"
        animate="visible"
        variants={fadeIn}> 
            <Heading 
                title="CodeGenie"
                description="Create code snippets with ease."
                icon={Code2}
                iconColor="text-[#69E07E]"
                
            />
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
                                className="border-0 outline-none  focus-visible:ring-0 focus-visible:ring-transparent" disabled={isLoading} placeholder="Simple toggle button using react hooks." {...field}/>
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
          {messages.length === 0 && !isLoading && (
            <Empty label="No conversation started." />
          )}
          <div className="flex flex-col-reverse gap-y-4 m-8">
            {messages.map((message) => (
              <div 
                key={message.content} 
                className={cn(
                  "p-8 w-full flex items-start gap-x-8 rounded-lg",
                  message.role === "user" ? "bg-white border border-black/10" : "bg-muted",
                )}
              >
                {message.role === "user" ? <UserAvatar /> : <BotAvatar />}
                <ReactMarkdown
                components ={{
                    pre: ({node, ...props}) => (
                        <div className="overflow-auto w-full my-2 bg-[#334155]/10 rounded-lg p-2">
                            <pre {...props} />
                        </div>
                    ),
                    code: ({node, ...props}) => (
                        <code className="bg-black/10 rounded-lg p-0.5" {...props} />
                    )
                }}
                className="text-sm overflow-hidden leading-7">
                    {message.content || ""}
                </ReactMarkdown>
              </div>
            ))}
                </div>
            </div>
        </motion.div>
    )
}
export default CodePage;