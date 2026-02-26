import heroBg from "../assets/hero-bg.png";
import { Button } from "../components/Button";
import { ArrowRight, Download } from "lucide-react";
import { AnimatedBorderButton } from "../components/AnimatedBorderButton";

export const Hero = () => {
    return (
    <section className=" relative min-h-screen flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
            <img src={heroBg} className="w-full h-full object-cover opacity-30" alt="Hero image" />
            <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/80 to-background"/>
        </div>
        {/* Dots */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(30)].map((_, index) => (
                <div key={index} className="absolute rounded-full w-1.5 h-1.5 opacity-40" style={{
                    backgroundColor: "#8b5cf6",
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animation: `slow-drift ${15 + Math.random() * 20}s ease-in-out infinite`,
                    animationDelay: `${Math.random() * 5}s`,
                }}/>
            ))}
        </div>

        {/* Content */}
        <div className="container mx-auto px-6 pt-32 pb-20 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Text content */}
                <div className="space-y-8 ">
                    <div className="animate-fade-in">
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-primary">
                            <span className="w-2 h-2 bg-primary rounded-full animate-pulse"/>Software Engineer - Web3 Enthusiast
                        </span>
                    </div>

                    {/* Headlines */}
                    <div className="space-y-4">
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight animate-fade-in animation-delay-100">
                            Engineering <span className="text-primary glow-text">Ideas</span> 
                            <br />
                            Into 
                            <span className="font-serif italic font-normal text-white"> Reality</span>
                        </h1>

                        <p className="text-lg text-muted-foreground max-w-lg animate-fade-in animation-delay-200">
                            Hi, I'm Huy Le, a passionate software engineer specializing in developing innovating web solutions. 
                            With a strong foundation in full-stack development and a keen interest in emerging technologies, 
                            I believe in creating elegant, user-friendly applications. Let's build something amazing together!
                        </p>
                    </div>


                    {/* CTA */}
                    <div className="flex flex-wrap gap-4 animate-fade-in animation-delay-300">
                        <Button size="lg">Contact me <ArrowRight className="w-5 h-5"/></Button>
                        <AnimatedBorderButton />
                    </div>
                </div>
                {/* Profile image */}
            </div>
        </div>

    </section>
    );
};