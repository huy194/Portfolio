
const projects = [
    {
        title: "Multi-vendor E-commerce Platform",
        description: "A full-stack e-commerce platform that supports multiple vendors and a user-friendly interface.",
        tags: ["React", "Javascript", "Node.js", "MongoDB", "Express", "Redis", "TailwindCSS"],
        github: "https://github.com/nxuandat/Shopee-NoSQL",
    },
    {
        title: "Dental Clinic Management System",
        description: "A system for managing dental clinic operations including appointments, patient records, and billing.",
        tags: ["React", "Typescript", "TailwindCSS", "Node.js", "SQL"],
        github: "https://github.com/nxuandat/DBMS-05",
    },
    {
        
        title: "QR generator",
        description: "A simple QR code generator with customizable options and a user-friendly interface.",
        tags: ["React", "QRCode.js", "Javascript", "CSS"],
        github: "https://github.com/huy194/QR_Generator",
    },
    {
        title: "URL Shortener",
        description: "A URL shortening service that generates short, shareable links.",
        tags: ["React", "CSS", "Javascript", "Node.js", "MongoDB"],
        github: "https://github.com/huy194/URL_Shortener",
    },
    {
        title: "Bookstore Management System",
        description: "A system for managing bookstore operations including inventory, sales, and customer records.",
        tags: ["Java", "JavaSwing", "MySQL"],
        github: "https://github.com/nxuandat/Book-Store-G02",
    },
]


export const Projects = () => {
    return (
        <section id="projects" className="py-32 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full">
                {/* BG glows */}
                <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"/>
                <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-highlight/5 rounded-full blur-3xl"/>        
            </div>

            <div className="container mx-auto px-6 relative z-10">
                {/* Section header */}
                <div className="text-center mx-auto max-w-3xl mb-16 ">
                    <span className="text-secondary-foreground text-sm font-medium tracking-wider uppercase animate-fade-in">
                        Featured Projects
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6 animate-fade-in animation-delay-100 text-secondary-foreground">
                        Some projects that
                        <span className="font-serif italic font-normal text-white"> I've worked on</span>
                    </h2>
                    <p className="text-muted-foreground animate-fade-in animation-delay-200">
                        A selection of projects that showcase my skills and experience recently.
                    </p>
                </div>

                {/* Projects grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((project, index) => (
                        <div key={index} className="glass p-6 rounded-2xl animate-fade-in transition-all duration-300 ease-out hover:scale-105 hover:translate-y-1 hover:shadow-xl" style={{animationDelay: `${index * 100}ms`}}>
                            <h3 className="text-2xl font-bold mb-2 hover:text-primary">{project.title}</h3>
                            <p className="text-muted-foreground mb-4">{project.description}</p>
                            <div className="flex flex-wrap gap-2">
                                {project.tags.map((tag, index) => (
                                    <span key={index} className="text-sm text-primary bg-primary/10 px-2 py-1 rounded-full hover:bg-primary/20">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            <div className="mt-4">
                                <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                                    View on GitHub
                                </a>
                            </div>
                        </div>      
                            ))} 
                </div>
            </div>
        </section>
    )
};