import { Github, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-border/40 mt-20">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-10">
          
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold mb-3">Huy Le</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Software Engineer.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <div className="flex flex-col gap-2 text-sm">
              <a href="#about" className="hover:text-primary transition-colors">
                About
              </a>
              <a href="#projects" className="hover:text-primary transition-colors">
                Projects
              </a>
              <a href="#contact" className="hover:text-primary transition-colors">
                Contact
              </a>
            </div>
          </div>

          {/* Socials */}
          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/huy194"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg hover:bg-primary/30 transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>

              <a
                href="https://linkedin.com/in/huy-mạnh-lê-2aa696176"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg hover:bg-primary/30 transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>

              <a
                href="mailto:lemanhhuy01@gmail.com"
                className="p-2 rounded-lg hover:bg-primary/30 transition-colors"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-6 border-t border-border/40 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Huy Le. All rights reserved.
        </div>
      </div>
    </footer>
  );
}