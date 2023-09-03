import {auth} from "@clerk/nextjs";
import { NextResponse } from "next/server";
import OpenAI from 'openai';
import { increaseApiLimit, checkApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";
import Replicate from 'replicate';
// const openai = new OpenAI({
//     apiKey: process.env.OPENAI_API_KEY
// });
const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN!
})

export async function POST(
    req: Request
) {
    try {
        const { userId } = auth();
        const body = await req.json();
        const { prompt} = body;
        if (!userId){
            return new NextResponse("Unauthorized", { status: 401 });
        }
        if (!prompt){
            return new NextResponse("Prompt Required", { status: 400 });
        }
        
        const freeTrial = await checkApiLimit();
        const isPro = await checkSubscription();

        if (!freeTrial && !isPro){
            return new NextResponse("Free Trial Limit Reached", { status: 403 });
        }
        const response = await replicate.run(
            "stability-ai/sdxl:d830ba5dabf8090ec0db6c10fc862c6eb1c929e1a194a5411852d25fd954ac82",
            {
              input: {
                prompt: prompt,
                
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