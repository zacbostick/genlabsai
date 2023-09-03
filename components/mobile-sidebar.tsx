"use client";

import { Button } from "@/components/ui/button";
import { Menu} from "lucide-react";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";

import {useState, useEffect }from "react";
import { Sidebar }from "@/components/sidebar";

export const MobileSidebar = ({
    apiLimitCount = 0,
    isPro = false
  }: {
    apiLimitCount: number;
    isPro: boolean;
  }) => {
    const [isMounted, setIsMounted] = useState(false);
  
    useEffect(() => {
      setIsMounted(true);
    }, []);
  
    if (!isMounted) {
      return null;
    }
    return(
        <Sheet>
        <SheetTrigger>
        <Button variant="ghost" size="lg" className="md:hidden text-white">
            <Menu />
        </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
        <Sidebar isPro={isPro} apiLimitCount={apiLimitCount} />
        </SheetContent>
        </Sheet>
            );
    }

    export default MobileSidebar;