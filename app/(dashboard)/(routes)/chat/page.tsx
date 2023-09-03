"use client";

import * as z from "zod";
import axios from "axios";
import { formSchema } from "./constants";
import { MessageSquare } from "lucide-react";
import { Heading } from  "@/components/heading";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter} from "next/navigation";
import OpenAI from "openai" 
import { useState } from "react";
import { Empty } from "@/components/empty";
import { Loader } from "@/components/loader";
import {cn} from "@/lib/utils";
import { UserAvatar } from "@/components/user-avatar";
import { BotAvatar } from "@/components/bot-avatar";
import { useProModal } from "@/hooks/use-pro-modal";
import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { useChat } from 'ai/react';
const ChatbotPage = () => {
    const router = useRouter();
    const proModal = useProModal();
    const endOfMessagesRef = useRef<null | HTMLDivElement>(null);
    const fadeIn = {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration: 1.5 } }
  };
    const [messages, setMessages] = useState<OpenAI.Chat.ChatCompletionMessage []>([]);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prompt: ""
        }
    });
    useEffect(() => {
      if (endOfMessagesRef.current) {
          endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
      }
  }, [messages]);
    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try{
            const userMessage: OpenAI.Chat.ChatCompletionMessage = { role: "user", content: values.prompt };
            const newMessages = [...messages, userMessage];
            const response = await axios.post('/api/chat', { messages: newMessages });
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
    
    return (
      <motion.div className="h-screen p-4 mt-6 flex flex-col " style={{ maxHeight: "80vh" }} initial="hidden"
      animate="visible"
      variants={fadeIn}> 
          <Heading 
              title="ChatGenie"
              description="Our most advanced chat model."
              icon={MessageSquare}
              iconColor="text-[#5BE0E6]"
          />
  
          {/* Input Box */}
          <div className="px-4 lg:px-8 mt-2 mb-6">
              <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)}
                      className="rounded-md border border-gray-300 w-full p-4 grid md:grid-cols-12 gap-2">
                      <FormField 
                        name="prompt"
                        render={({field}) => (
                          <FormItem className="md:col-span-10">
                              <Input 
                                  className="w-full border rounded-md px-3 py-2 outline-none" 
                                  disabled={isLoading} 
                                  placeholder="How do I calculate the radius of a circle" {...field}
                              />
                          </FormItem>
                        )}
                      />
                      <div className="md:col-span-2 mt-4 md:mt-0">
                          <Button className="w-full bg-gray-800 text-white rounded-md" variant="generate" disabled={isLoading}>Generate</Button>
                      </div>
                  </form>
              </Form>
          </div>
  
          {/* Chat Window */}
          <div className="mt-2 px-4 lg:px-8 flex-grow" style={{ maxHeight: "calc(100vh - 350px)" }}>
            <div className="border border-gray-300 rounded-lg p-4 shadow-lg h-full overflow-hidden">
                <div className="overflow-y-auto h-full">
                      {isLoading && (
                          <div className="flex items-center justify-start mb-4">
                              <BotAvatar />
                              <div className="p-2 max-w-1/3 rounded-lg ml-2 bg-gray-100 text-gray-800 rounded-br-none">
                                  Thinking...
                              </div>
                          </div>
                      )}
                      {messages.length === 0 && !isLoading && (
                          <Empty label="No conversation started." />
                      )}
                      <AnimatePresence>
                      {messages.map((message, index) => (
                         <motion.div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} items-start mb-4`} initial={{ y: 10, opacity: 0 }}
                         animate={{ y: 0, opacity: 1, transition: { duration: 0.7 } }} 
                         exit={{ y: -10, opacity: 0, transition: { duration: 0.7 } }} >
                              {message.role !== "user" && <BotAvatar />}
                              <div 
                                  className={`p-4 max-w-2/3 rounded-lg ml-2 mr-2 ${message.role === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800"} 
                                      ${message.role === "user" ? "rounded-bl-none" : "rounded-br-none"}`}
                                  style={{
                                      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)'
                                  }}
                              >
                                  {message.content}
                              </div>
                              {message.role === "user" && <UserAvatar />}
                              </motion.div>
                          
                      ))
                      }
                      </AnimatePresence>
                      <div ref={endOfMessagesRef}></div>
                  </div>
              </div>
          </div>
      </motion.div>
  )
  
  
}
export default ChatbotPage;