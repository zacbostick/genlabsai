import { Dialog, DialogHeader, DialogContent, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { useProModal } from "@/hooks/use-pro-modal"
import { Badge } from "@/components/ui/badge"
import { DialogDescription } from "@radix-ui/react-dialog";
import { Check, Clapperboard, Code2, CogIcon, Component,  ImageIcon, LayoutGrid, MessageSquare, Music2Icon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Zap } from "lucide-react";
import axios from "axios";
import { useState } from "react";
import { set } from "zod";
const tools = [
    {
        label: "Chat",
        icon: MessageSquare,
        href: "/chat",
        color: "text-[#33A1C4]",
        bgColor: "bg-[#E0F4F8]"
    },
    {
        label: "Images",
        icon: ImageIcon,
        href: "/image",
        color: "text-[#E94F64]",
        bgColor: "bg-[#FDE5E9]"
    },
    {
        label: "Logos",
        icon: Component,
        href: "/logo",
        color: "text-[#2EAE8A]",
        bgColor: "bg-[#DFF3EC]"
    },
    {
        label: "Videos",
        icon: Clapperboard,
        href: "/video",
        color: "text-[#E98E29]",
        bgColor: "bg-[#FEEBD7]"
    },
    {
        label: "Music",
        icon: Music2Icon,
        href: "/music",
        color: "text-[#2A67DB]",
        bgColor: "bg-[#DFE7FA]"
    },
    {
        label: "Code",
        icon: Code2,
        href: "/code",
        color: "text-[#59C451]",
        bgColor: "bg-[#E3F7DC]"
    }
]

export const ProModal = () => {
    const proModal = useProModal();
    const [loading, setLoading] = useState(false);
    const onSubscribe = async () => {
        try {
            setLoading(true);
            const response = await axios.get("/api/stripe");
            window.location.href = response.data.url;
        } catch (error) {
            console.log(error, "STRIPE_CLIENT_ERROR");
        } finally{
            setLoading(false);
        }
    }
    return(
        <Dialog open={proModal.isOpen} onOpenChange={proModal.onClose} >
        <DialogContent>
            <DialogHeader>
                <DialogTitle className="flex justify-center items-center flex-col gap-y-4 pb-2">
                   <div className="flex items-center gap-x-2 font-bold py-2">Upgrade to GenLabs
                    <Badge className="uppercase text-sm py-1 bg-gradient-to-r from-[#34D8AC] via-[#4EDDD1] to-[#5BE0E6] text-[#101727]" >
                        Pro
                    </Badge>
                    </div> 
                </DialogTitle>
                <DialogDescription className="text-center pt-2 space-y-2 text-zinc-900 font-medium">
            {tools.map((tool) => (
              <Card key={tool.href} className="p-3 border-black/5 flex items-center justify-between">
                <div className="flex items-center gap-x-4">
                  <div className={cn("p-2 w-fit rounded-md", tool.bgColor)}>
                    <tool.icon className={cn("w-6 h-6", tool.color)} />
                  </div>
                  <div className="font-semibold text-sm">
                    {tool.label}
                  </div>
                </div>
                            <Check className={cn("w-5 h-5 text-[#34D8AC]")} />
                        </Card>
                        ))}
                </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex justify-center items-center flex-col gap-y-4 pt-4">
                <Button
                disabled={loading}
                onClick={onSubscribe}
                size="lg"
                className="w-full bg-gradient-to-r from-[#34D8AC] via-[#4EDDD1] to-[#5BE0E6] text-[#101727] p-1  border-0"
                >
                    Upgrade <Zap className="w-4 h-4 ml-2 fill-white"/>
                </Button>
            </DialogFooter>
        </DialogContent>
        </Dialog>
    )
}