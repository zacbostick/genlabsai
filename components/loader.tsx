import Image from "next/image";

export const Loader = () => {
    return (
        <div className="h-full p-20 flex flex-col items-center justify-center">
            <div className="w-20 h-20 relative animate-bounce">
            <Image alt="logo" fill src="/logo.png" />
            </div>
            <p className="text-lg text-muted-foreground pt-10">
                Genie is thinking...
            </p>
            <p className="mt-10 text-muted-foreground">Depending on the generator, your first request may take up to 5 minutes to complete. </p>
        </div>
    )
};