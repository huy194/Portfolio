import { Mail, MapPin, Phone, Send, CheckCircle, AlertCircle } from "lucide-react";
import {Button} from "../components/Button";
import { useState } from "react";
import emailjs from "@emailjs/browser";
import { motion, AnimatePresence } from "framer-motion";

const contactInfo = [
    {
        icon: Mail,
        label: "Email",
        value: "lemanhhuy01@gmail.com",
        href: "mailto:lemanhhuy01@gmail.com",
    },
    {
        icon: Phone,
        label: "Phone",
        value: "+84334823367",
        href: "tel:+84334823367",
    },
    {
        icon: MapPin,
        label: "Location",
        value: "Ho Chi Minh City, Vietnam", 
        href: "#",
    }
];


export const Contact = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });

    const [isLoading, setIsLoading] = useState(false);

    const [submitStatus, setSubmitStatus] = useState({
    type: null,
    message: "",
    });

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setSubmitStatus({ type: null, message: "" });

        try {
        const serviceID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
        const templateID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
        const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

        await emailjs.send(
            serviceID,
            templateID,
            {
            name: formData.name,
            email: formData.email,
            message: formData.message,
            },
            publicKey
        );

        setSubmitStatus({
            type: "success",
            message: "Message sent successfully! I'll get back to you soon.",
        });

        setFormData({ name: "", email: "", message: "" });

        } catch (error) {
        setSubmitStatus({
            type: "error",
            message:
            error?.text || "Something went wrong. Please try again later.",
        });
        } finally {
        setIsLoading(false);
        }
    };

    return (
        <section id="contact" className="py-32 relative overflow-hidden">
            
            {/* Background */}
            <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-highlight/5 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                
                {/* Header */}
                <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: false, amount: 0.2 }}
                className="text-center max-w-3xl mx-auto mb-16"
                >
                <motion.span
                    variants={fadeUp}
                    className="text-secondary-foreground text-sm font-medium tracking-wider uppercase"
                >
                    Get in touch
                </motion.span>

                <motion.h2
                    variants={fadeUp}
                    className="text-4xl md:text-5xl font-bold mt-4 mb-6 text-secondary-foreground"
                >
                    Curious about
                    <span className="font-serif italic font-normal text-white">
                    {" "}what we could build?
                    </span>
                </motion.h2>

                <motion.p
                    variants={fadeUp}
                    className="text-muted-foreground"
                >
                    Currently available for freelance work, internships, and
                    interesting side projects.
                </motion.p>
                </motion.div>

                {/* Main Grid */}
                <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">

                {/* Form */}
                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: false, amount: 0.2 }}
                    className="glass p-8 rounded-3xl border border-primary/30"
                >
                    <form className="space-y-6" onSubmit={handleSubmit}>
                    
                    <input
                        type="text"
                        required
                        placeholder="Your name..."
                        value={formData.name}
                        onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-surface rounded-xl border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    />

                    <input
                        type="email"
                        required
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-surface rounded-xl border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    />

                    <textarea
                        rows={5}
                        required
                        placeholder="Your message..."
                        value={formData.message}
                        onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-surface rounded-xl border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none transition-all"
                    />

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 rounded-xl bg-primary text-white hover:opacity-90 transition"
                    >
                        {isLoading ? "Sending..." : "Send Message"}
                    </button>

                    {/* Animated Alert */}
                    <AnimatePresence>
                        {submitStatus.type && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className={`flex items-center gap-3 p-4 rounded-xl ${
                            submitStatus.type === "success"
                                ? "bg-green-500/10 border border-green-500/20 text-green-500"
                                : "bg-red-500/10 border border-red-500/20 text-red-500"
                            }`}
                        >
                            <p className="text-sm">{submitStatus.message}</p>
                        </motion.div>
                        )}
                    </AnimatePresence>
                    </form>
                </motion.div>

                {/* Contact Info */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: false, amount: 0.2 }}
                    className="space-y-6"
                >
                    {contactInfo.map((item, index) => (
                    <motion.a
                        key={index}
                        href={item.href}
                        variants={fadeUp}
                        whileHover={{ y: -6 }}
                        transition={{ type: "spring", stiffness: 200 }}
                        className="glass rounded-3xl p-6 flex items-center gap-4"
                    >
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <item.icon className="w-5 h-5 text-primary" />
                        </div>

                        <div>
                        <div className="text-sm text-muted-foreground">
                            {item.label}
                        </div>
                        <div className="font-medium">{item.value}</div>
                        </div>
                    </motion.a>
                    ))}
                    <motion.div
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: false, amount: 0.2 }}
                        whileHover={{ y: -6 }}
                        transition={{ type: "spring", stiffness: 200, damping: 18 }}
                        className="glass rounded-3xl p-8 border border-primary/30"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            
                            {/* Animated green dot */}
                            <motion.span
                            className="w-3 h-3 bg-green-500 rounded-full"
                            animate={{ scale: [1, 1.3, 1] }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                            />

                            <span className="font-medium">Available</span>
                        </div>

                        <p className="text-muted-foreground text-sm">
                            I'm currently available for opportunities. I'll get back to you as soon as I can.
                        </p>
                    </motion.div>
                </motion.div>
                </div>
            </div>
        </section>
    );
};