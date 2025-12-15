import { Link } from "react-router-dom";
import { Instagram, Facebook, Twitter } from "lucide-react";

const footerLinks = {
  shop: [
    { name: "All Products", href: "/shop" },
    { name: "Totes", href: "/shop?category=totes" },
    { name: "Crossbody", href: "/shop?category=crossbody" },
    { name: "Clutches", href: "/shop?category=clutches" },
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
    <footer className="bg-primary text-primary-foreground">
      <div className="container-luxury py-16 lg:py-24">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block">
              <h2 className="font-serif text-2xl tracking-widest uppercase mb-6">Maison</h2>
            </Link>
            <p className="text-sm leading-relaxed opacity-80 mb-8 max-w-xs">
              Timeless elegance, meticulously crafted. Each piece tells a story of artisanal excellence.
            </p>
            <div className="flex gap-5">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-70 hover:opacity-100 transition-opacity"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-70 hover:opacity-100 transition-opacity"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-70 hover:opacity-100 transition-opacity"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="text-xs font-medium tracking-widest uppercase mb-6 opacity-60">Shop</h3>
            <ul className="space-y-4">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm opacity-80 hover:opacity-100 transition-opacity"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About Links */}
          <div>
            <h3 className="text-xs font-medium tracking-widest uppercase mb-6 opacity-60">About</h3>
            <ul className="space-y-4">
              {footerLinks.about.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm opacity-80 hover:opacity-100 transition-opacity"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service Links */}
          <div>
            <h3 className="text-xs font-medium tracking-widest uppercase mb-6 opacity-60">Customer Service</h3>
            <ul className="space-y-4">
              {footerLinks.customer.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm opacity-80 hover:opacity-100 transition-opacity"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-16 pt-12 border-t border-primary-foreground/10">
          <div className="max-w-md">
            <h3 className="text-xs font-medium tracking-widest uppercase mb-4 opacity-60">Join Our World</h3>
            <p className="text-sm opacity-80 mb-6">
              Subscribe for exclusive access to new collections and private events.
            </p>
            <form className="flex gap-3">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 bg-transparent border-b border-primary-foreground/30 py-3 text-sm placeholder:opacity-50 focus:outline-none focus:border-primary-foreground/60 transition-colors"
              />
              <button
                type="submit"
                className="text-xs font-medium tracking-widest uppercase hover:opacity-70 transition-opacity"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-16 pt-8 border-t border-primary-foreground/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <p className="text-xs opacity-50">
            © {new Date().getFullYear()} Maison. All rights reserved.
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
