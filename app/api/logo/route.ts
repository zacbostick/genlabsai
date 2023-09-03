import {auth} from "@clerk/nextjs";
import { NextResponse } from "next/server";
import Replicate from 'replicate';
import { increaseApiLimit, checkApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN!
})

export async function POST(
    req: Request
) {
    try {
        const { userId } = auth();
        const body = await req.json();
        const { prompt } = body;
        if (!userId){
            return new NextResponse("Unauthorized", { status: 401 });
        }
        if (!prompt){
            return new NextResponse("Prompt is required!", { status: 400 });
        }
        const freeTrial = await checkApiLimit();
        const isPro = await checkSubscription();

        if (!freeTrial && !isPro){
            return new NextResponse("Free Trial Limit Reached", { status: 403 });
        }
        const response = await replicate.run(
            "laion-ai/erlich:92fa143ccefeed01534d5d6648bd47796ef06847a6bc55c0e5c5b6975f2dcdfb",
            {
              input: {
                prompt: prompt
              }
            }
          );
          if(!isPro){
            await increaseApiLimit();
          }
          
        return NextResponse.json(response);
    } catch(error) {
        console.log("LOGO_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}