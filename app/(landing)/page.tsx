import { LandingNavbar } from "@/components/landing-navbar";
import { LandingHero } from "@/components/landing-hero";
import { LandingContent } from "@/components/landing-content";
import LandingInfo from "@/components/landing-info"; // Import the new component
import { Footer } from "@/components/footer";
const LandingPage = () => {
    return (
        <div className="h-full w-full">
            <LandingNavbar />
            <LandingHero />
            <LandingInfo />   {/* Embed the new component here */}
            <LandingContent />
            <Footer />
        </div>
    );
}

export default LandingPage;
