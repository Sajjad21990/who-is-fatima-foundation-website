import { Facebook, Instagram, Youtube } from "lucide-react";

export function FloatingSocials() {
    const socialLinks = [
        {
            icon: Youtube,
            href: "https://youtube.com/@whoisfatima_org?si=ou2yq1VMVpkgkhA8",
            label: "YouTube",
            color: "bg-[#FF0000]",
            hex: "#FF0000"
        },
        {
            icon: Facebook,
            href: "https://www.facebook.com/share/1AFBAeJawu/",
            label: "Facebook",
            color: "bg-[#1877F2]",
            hex: "#1877F2"
        },
        {
            icon: Instagram,
            href: "https://www.instagram.com/whoisfatima_org?igsh=YW03d2Y1dDM5anZu",
            label: "Instagram",
            color: "bg-[#E4405F]",
            hex: "#E4405F"
        },
    ];

    return (
        <div
            className="fixed right-0 top-1/2 -translate-y-1/2 z-50 flex flex-col items-end"
            style={{ position: 'fixed', right: 0, top: '50%', transform: 'translateY(-50%)', zIndex: 50 }}
        >
            {socialLinks.map((social, index) => (
                <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="text-white w-12 h-12 flex items-center justify-center transition-all duration-300 hover:w-16 relative group shadow-md border-b-[1px] border-white/10 first:rounded-tl-lg last:rounded-bl-lg"
                    style={{ backgroundColor: social.hex }}
                >
                    <social.icon className="w-6 h-6" />
                </a>
            ))}
        </div>
    );
}
