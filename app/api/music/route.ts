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
            "facebookresearch/musicgen:7a76a8258b23fae65c5a22debb8841d1d7e816b75c2f24218cd2bd8573787906",
            {
              input: {
                prompt: prompt,
                duration: 20,

              }
            }
          );
        if(!isPro){
            await increaseApiLimit();
        }
        console.log("response", response)
        return NextResponse.json(response);
    } catch(error) {
        console.log("[CHAT_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}