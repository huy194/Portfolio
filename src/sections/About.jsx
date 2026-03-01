import { Brain, BookOpen, Clock, Users } from "lucide-react";

const highlights = [
    {
        icon: Brain,
        title: "Problem Solving",
        description: "I enjoy breaking down complex problems into simple, logical solutions."
    },
    {
        icon: BookOpen,
        title: "Continuous Learning",
        description: "I constantly improve my skills and explore new tools, frameworks, and best practices."
    },
    {
        icon: Clock,
        title: "Time Management",
        description: "I prioritize tasks effectively and manage deadlines efficiently, ensuring projects are delivered on time."
    },
    {
        icon: Users,
        title: "Team Collaboration",
        description: "I communicate clearly, share ideas openly, and work effectively with others to achieve common goals and build better solutions together."
    },
]

export const About = () => {
    return (
        <section id="about" className="py-32 relative overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left column */}
                    <div className="space-y-8">
                        <div className="animate-fade-in">
                            <span className="text-secondary-foreground text-sm font-medium tracking-medium uppercase">About me</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold leading-tight animate-fade-in animation-delay-100 text-secondary-foreground">
                            Building With Intention, 
                            <span className="font-serif italic font-normal text-white"> Delivering Results</span>
                        </h2>

                        <div className="space-y-4 text-muted-foreground animate-fade-in animation-delay-200">
                            <p>
                                I'm someone who genuinely enjoys building things with code. 
                                What started as curiosity turned into a strong interest in understanding how systems work and how small details shape the overall experience of a product.
                            </p>
                            <p>
                                I like keeping things simple. Clean structure, readable code, and thoughtful design matter to me because I know I'll revisit my own work later — and I want it to make sense. 
                                I'm not chasing complexity; 
                                I'm focused on building things that work well and are easy to maintain.
                            </p>
                            <p>
                                I also value collaboration. I'm comfortable working independently, 
                                but I enjoy being part of a team where ideas are shared openly and feedback is honest. 
                                Some of the best improvements come from simple conversations.
                            </p>
                            <p>
                                Outside of specific technologies or trends, what motivates me most is growth — getting a little better with every project and building things I'm proud to put my name on.
                            </p>
                        </div>

                        <div className="glass rounded-2xl p-6 glow-border animate-fade-in animation-delay-300">
                            <p className="text-lg font-medium italic text-foreground">
                                My goal is to grow as an engineer by building thoughtful, maintainable solutions and being someone teammates can rely on.
                            </p>
                        </div>
                    </div>

                    {/* Right column */}
                    <div className="grid sm:grid-cols-2 gap-6">
                        {highlights.map((item, index) => (
                            <div key={index} className="glass p-6 rounded-2xl animate-fade-in" style={{animationDelay: `${(index+1)* 100}ms`}}>
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 hover:bg-primary/20">
                                    <item.icon className="w-6 h-6 text-primary"/>
                                </div>
                                <h3 className="text-lg font-semibold mb-2">
                                    {item.title}
                                </h3>
                                <p className="text-sm text-muted-foreground">{item.description}</p>
                            </div>
                        ))}
                            
                    </div>
                </div>
            </div>
        </section>
    );
};