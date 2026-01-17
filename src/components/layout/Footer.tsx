import { Link } from "react-router-dom";
import { Instagram, Facebook, Twitter } from "lucide-react";

const footerLinks = {
  shop: [
    { name: "All Products", href: "/shop" },
    { name: "Handbags", href: "/shop?category=Handbags" },
    { name: "Tote Bags", href: "/shop?category=Tote+Bags" },
    { name: "Luggage", href: "/shop?category=Luggage’s" },
    { name: "Men's Collection", href: "/shop?category=men+Wallets" },
  ],
  about: [
    { name: "Our Story", href: "/about" },
    { name: "Craftsmanship", href: "/about#craftsmanship" },
    { name: "Sustainability", href: "/about#sustainability" },
  ],
  customer: [
    { name: "Contact Us", href: "/contact" },
    { name: "Shipping & Returns", href: "/contact#shipping" },
    { name: "Care Guide", href: "/contact#care" },
  ],
};

export function Footer() {
  return (
    <footer className="relative bg-gradient-to-b from-[hsl(var(--footer-start))] to-[hsl(var(--footer-end))] text-foreground border-t border-border mt-12">
      <div className="relative container-luxury py-16 lg:py-24">
        {/* Top Border Logo Seal - Left Aligned */}
        <div className="absolute top-0 left-30 -translate-y-1/6">
          <img
            src="/src/assets/logo-center-final.png"
            alt="Bags Unlimited"
            className="h-48 w-auto object-contain mix-blend-multiply dark:mix-blend-screen dark:invert"
          />
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block mb-4 pointer-events-none">
              {/* Hidden Text to preserve exact layout spacing */}
              <h2 className="font-serif text-2xl tracking-widest font-bold uppercase text-transparent select-none">
                Bags Unlimited
              </h2>
            </Link>
            <p className="text-sm leading-relaxed opacity-80 mb-8 max-w-xs text-muted-foreground">
              Timeless elegance, meticulously crafted. Each piece tells a story of artisanal excellence.
            </p>
            <div className="mb-8 text-sm text-muted-foreground space-y-2">
              <p>Gole Market, Gandhi nagar, Jammu.</p>
              <p>7006895341, 9086071415</p>
              <p>Bagsunlimitedjammu@gmail.com</p>
            </div>
            <div className="flex gap-5">
              <a
                href="https://instagram.com/bagsunlimitedjammu"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {[
            { title: "Shop", links: footerLinks.shop },
            { title: "About", links: footerLinks.about },
            { title: "Customer Service", links: footerLinks.customer }
          ].map((column) => (
            <div key={column.title}>
              <h3 className="text-xs font-medium tracking-widest uppercase mb-6 text-muted-foreground">{column.title}</h3>
              <ul className="space-y-4">
                {column.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-sm text-foreground/80 hover:text-primary transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>



        {/* Copyright */}
        <div className="mt-16 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <p className="text-xs opacity-50">
            © {new Date().getFullYear()} Bags Unlimited. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-xs opacity-50 hover:opacity-80 transition-opacity">
              Privacy Policy
            </a>
            <a href="#" className="text-xs opacity-50 hover:opacity-80 transition-opacity">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
