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
        description: "Technology evolves fast, and so do I. I constantly improve my skills and explore new tools, frameworks, and best practices."
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
            <div>
                <div>
                    {/* Left column */}
                    <div>
                        <span>About me</span>
                    </div>
                </div>
            </div>
        </section>
    );
};