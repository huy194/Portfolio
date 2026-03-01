import { Mail, MapPin, Phone, Send, CheckCircle, AlertCircle } from "lucide-react";
import {Button} from "../components/Button";
import { useState } from "react";
import emaijs  from "@emailjs/browser";

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
        type: null, // success or error
        message: "",
    });


    const handleSubmit = async (e) => {
        e.preventDefault();

        setIsLoading(true);
        setSubmitStatus({ type: null, message: "" });

        try {
            const serviceID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
            const templateID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
            const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

            await emaijs.send(serviceID, templateID, {
                name: formData.name,
                email: formData.email,
                message: formData.message
            }, publicKey);

            setSubmitStatus({
                type: "success",
                message: "Message sent successfully! I'll get back to you soon.",
            })
            setFormData({
                name: "",
                email: "",
                message: "",
            });

        } catch (error) {
            console.log("Emailjs error",error);
            setSubmitStatus({
                type: "error",
                message: error.text || "Something went wrong. Please try again later.",
            })
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <section id="contact" className="py-32 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full">
                {/* BG glows */}
                <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"/>
                <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-highlight/5 rounded-full blur-3xl"/>        
            </div>

            <div className="container mx-auto px-6 relative z-10">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-secondary-foreground text-sm font-medium tracking-wider uppercase animate-fade-in">
                        Get in touch
                    </span>

                    <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6 animate-fade-in animation-delay-100 text-secondary-foreground">
                        Curious about
                        <span className="font-serif italic font-normal text-white"> what we could build?</span>
                    </h2>

                    <p className="text-muted-foreground animate-fade-in animation-delay-200">
                        Currently available for freelance work, internships, and interesting side projects. Send me a message and let's discuss together!
                    </p>

                </div>

                <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
                    <div className="glass p-8 rounded-3xl border border-primary/30 animate-fade-in animation-delay-300">
                        <form className="space-y-6 " onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium mb-2">Name</label>
                                <input 
                                    id="name" 
                                    type="text" 
                                    required
                                    placeholder="Your name..."
                                    value={formData.name}
                                    onChange={(e) => {
                                        setFormData({
                                            ...formData,
                                            name: e.target.value,
                                        });
                                    }}
                                    className="w-full px-4 py-3 bg-surface rounded-xl border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"/>
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
                                <input 
                                    id="email" 
                                    type="text" 
                                    required
                                    placeholder="your@email.com"
                                    value={formData.email}
                                    onChange={(e) => {
                                        setFormData({
                                            ...formData,
                                            email: e.target.value,
                                        });
                                    }}
                                    className="w-full px-4 py-3 bg-surface rounded-xl border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium mb-2">Message</label>
                                <textarea 
                                    id="message" 
                                    required
                                    rows={5}
                                    placeholder="Your message..."
                                    value={formData.message}        
                                    onChange={(e) => {
                                        setFormData({
                                            ...formData,
                                            message: e.target.value,
                                        });     
                                    }}
                                    className="w-full px-4 py-3 bg-surface rounded-xl border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none" />
                            </div>

                            <Button className="w-full " type="submit" disabled={isLoading}>
                                
                                { isLoading ? (
                                        <>
                                            Sending...
                                        </>
                                ) : (
                                        <>
                                            Send Message
                                            <Send className="w-5 h-5"/>
                                        </>
                                    )
                                }
                                
                            </Button>

                            {submitStatus.type && (
                                <div
                                    className={`flex items-center gap-3 p-4 rounded-xl ${
                                    submitStatus.type === "success"
                                        ? "bg-green-500/10 border border-green-500/20 text-green-500"
                                        : "bg-red-500/10 border border-red-500/20 text-red-500"
                                    }`}
                                >
                                    {submitStatus.type === "success" ? (
                                    <CheckCircle className="w-5 h-5 flex-shrink-0" />
                                    ) : (
                                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                    )}
                                    <p className="text-sm">{submitStatus.message}</p>
                                </div>
                                )}
                        </form>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-6 animate-fade-in animation-delay-400">
                        <div className="glass rounded-3xl p-8">
                            <h3 className="text-xl font-semibold mb-6">Contact Infomation</h3>
                            <div className="space-y-4">
                                {contactInfo.map((item, index) => (
                                    <a href="item.href" key={index} className="flex items-center gap-4 p-4 rounded-xl hover:bg-surface transition-color group-hover:bg-primary/20">
                                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                            <item.icon className="w-5 h-5 text-primary"/>   
                                        </div>
                                        <div>
                                            <div className="text-sm text-muted-foreground">
                                                {item.label}
                                            </div>
                                            <div className="font-medium">{item.value}</div>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Availability card */}
                        <div className="glass rounded-3xl p-8 border border-primary/30">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"/>
                                <span className="font-medium">Available</span>
                            </div>
                            <p className="text-muted-foreground text-sm">
                                I'm currently available for opportunities. I'll get back to you as soon as I can.   
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};