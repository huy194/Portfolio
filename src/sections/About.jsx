import { Brain, BookOpen, Clock, Users } from "lucide-react";
import { motion } from "framer-motion";

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
    const containerVariants = {
        hidden: {},
        show: {
        transition: {
            staggerChildren: 0.15,
        },
        },
    };

    const fadeUp = {
        hidden: { opacity: 0, y: 40 },
        show: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
            },
        },
  };

    return (
        <section id="about" className="py-32 relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Left column */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: false, amount: 0.2 }}
                className="space-y-8 bg-background/50 backdrop-blur-sm rounded-2xl p-6 -m-6"
            >
                <motion.div variants={fadeUp}>
                <span className="text-secondary-foreground text-sm font-medium tracking-medium uppercase">
                    About me
                </span>
                </motion.div>

                <motion.h2
                variants={fadeUp}
                className="text-4xl md:text-5xl font-bold leading-tight text-secondary-foreground"
                >
                Building With Intention,
                <span className="font-serif italic font-normal text-white">
                    {" "}Delivering Results
                </span>
                </motion.h2>

                <motion.div
                variants={fadeUp}
                className="space-y-4 text-muted-foreground"
                >
                <p>
                    I'm someone who genuinely enjoys building things with code.
                    What started as curiosity turned into a strong interest in
                    understanding how systems work and how small details shape
                    the overall experience of a product.
                </p>
                <p>
                    I like keeping things simple. Clean structure, readable code,
                    and thoughtful design matter to me because I know I'll revisit
                    my own work later — and I want it to make sense.
                </p>
                <p>
                    I also value collaboration. I'm comfortable working
                    independently, but I enjoy being part of a team where ideas
                    are shared openly and feedback is honest.
                </p>
                <p>
                    Outside of specific technologies or trends, what motivates me
                    most is growth — getting a little better with every project.
                </p>
                </motion.div>

                <motion.div
                variants={fadeUp}
                className="glass rounded-2xl p-6 glow-border"
                >
                <p className="text-lg font-medium italic text-foreground">
                    My goal is to grow as an engineer by building thoughtful,
                    maintainable solutions and being someone teammates can rely on.
                </p>
                </motion.div>
            </motion.div>

            {/* Right column */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: false, amount: 0.2 }}
                className="grid sm:grid-cols-2 gap-6"
            >
                {highlights.map((item, index) => (
                <motion.div
                    key={index}
                    variants={fadeUp}
                    className="glass p-6 rounded-2xl"
                >
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <item.icon className="w-6 h-6 text-primary" />
                    </div>

                    <h3 className="text-lg font-semibold mb-2">
                    {item.title}
                    </h3>

                    <p className="text-sm text-muted-foreground">
                    {item.description}
                    </p>
                </motion.div>
                ))}
            </motion.div>

            </div>
        </div>
        </section>
    );
};