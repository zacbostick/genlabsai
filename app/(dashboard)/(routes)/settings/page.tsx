import { Settings } from "lucide-react";

import { Heading } from "@/components/heading";
import { SubscriptionButton } from "@/components/subscription-button";
import { checkSubscription } from "@/lib/subscription";
import { absoluteUrl } from "@/lib/utils";

const settingsUrl = absoluteUrl("/settings");
const logUrl = async () =>{
  console.log(settingsUrl);
  return settingsUrl
}
const SettingsPage = async () => {
  const isPro = await checkSubscription();

  return ( 
    <div className="h-screen p-4 mt-12 flex flex-col " style={{ maxHeight: "80vh" }}>
      <Heading
        title="Settings"
        description="Manage account settings."
        icon={Settings}
        iconColor="text-gray-700"
        bgColor="bg-gray-700/10"
      />
      <div className="px-4 lg:px-8 space-y-4">
        <div className="text-muted-foreground text-sm">
          {isPro ? "You are currently on a Pro plan." : "You are currently on a free plan."}
        </div>
        <SubscriptionButton isPro={isPro} {...logUrl} />
      </div>
    </div>
   );
}
 
export default SettingsPage;