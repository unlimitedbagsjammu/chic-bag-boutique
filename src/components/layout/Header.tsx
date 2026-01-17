import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { AnimatedLogo } from "@/components/ui/AnimatedLogo";
import ThemeToggle from "@/components/ThemeToggle";

const navLinks = [
  { name: "Shop", href: "/shop" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { totalItems, setIsCartOpen } = useCart();

  return (
    <header
      className="fixed z-50 transition-all duration-500 ease-in-out top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl rounded-full bg-secondary/80 backdrop-blur-xl border border-white/20 shadow-2xl py-3"
    >
      <div className="container-luxury px-6 md:px-12">
        <div className="flex items-center justify-between h-auto min-h-[50px] relative">
          {/* Left Section: Logo Icon + Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <Link to="/" className="-ml-4">
              <img
                src="/logo.png"
                alt="Bags Unlimited"
                className="h-16 w-auto dark:invert transition-all duration-300"
              />
            </Link>

            <nav className="flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={cn(
                    "text-xs tracking-[0.2em] uppercase link-underline transition-colors font-medium",
                    location.pathname === link.href
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Center: Brand Image */}
          <Link to="/" className="absolute left-1/2 -translate-x-1/2 animate-reveal">
            <img
              src="/src/assets/logo-center-final.png"
              alt="Bags Unlimited"
              className="object-contain mix-blend-multiply dark:mix-blend-screen dark:invert transition-all duration-300 h-auto w-80"
            />
          </Link>

          {/* Right side - Mobile Menu + Cart */}
          <div className="flex items-center gap-4 ml-auto lg:ml-0">
            {/* Cart */}
            <button
              className="relative p-2"
              aria-label="Shopping bag"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-primary-foreground text-[10px] font-medium flex items-center justify-center rounded-full">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile Menu Button - Visible only on small screens */}
            <button
              className="lg:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Dark Mode Toggle */}
            <ThemeToggle className="opacity-50 hover:opacity-100 transition-opacity" />
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={cn(
            "lg:hidden overflow-hidden transition-all duration-300",
            isMenuOpen ? "max-h-64 pb-6" : "max-h-0"
          )}
        >
          <nav className="flex flex-col gap-4 pt-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                  "text-sm tracking-wide uppercase py-2 transition-colors",
                  location.pathname === link.href
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
