"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { Bus, MapPin, Users, InfoIcon } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const links = [
    { href: "/", label: "MAP", icon: <Bus className="h-4 w-4" /> },
    { href: "/shuttle", label: "SHUTTLES", icon: <Users className="h-4 w-4" /> },
    { href: "/stops", label: "STOPS", icon: <MapPin className="h-4 w-4" /> },
    { href: "/about", label: "ABOUT", icon: <InfoIcon className="h-4 w-4" /> },
  ];

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="w-full border-b fixed top-0 left-0 right-0 z-[100] bg-background shadow-sm">
      <div className="max-w-7xl mx-auto border-x">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 px-6 py-4">
            <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
              <Bus className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg tracking-tight uppercase">Shuttle Tracker</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center divide-x h-full">
            {links.map((link) => {
              const isActive = pathname === link.href;
              
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center justify-center px-6 py-7 font-medium transition-colors ${isActive
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground hover:text-primary hover:bg-accent"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="flex items-center h-full px-4">
              <ThemeToggle />
            </div>
          
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2 mr-4">
            <ThemeToggle />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 hover:bg-accent transition-colors z-50"
              aria-label="Toggle menu"
            >
              <div className="flex flex-col gap-1.5">
                <span
                  className={`w-5 h-0.5 bg-primary transition-transform duration-200 ${isMobileMenuOpen ? "rotate-45 translate-y-1" : ""}`}
                />
                <span
                  className={`w-5 h-0.5 bg-primary transition-transform duration-200 ${isMobileMenuOpen ? "-rotate-45 -translate-y-0.5" : ""}`}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
              onClick={handleMobileMenuClose}
            />
            <div className="fixed top-[60px] left-0 right-0 bg-background border-b z-[100] overflow-y-auto max-h-[calc(100vh-60px)]">
              <nav className="flex flex-col divide-y">
                {links.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={handleMobileMenuClose}
                      className={`flex items-center px-6 py-4 font-medium transition-colors ${isActive
                        ? "text-primary bg-accent"
                        : "text-muted-foreground hover:text-primary hover:bg-accent"
                      }`}
                    >
                      <span className="mr-3">{link.icon}</span>
                      {link.label}
                    </Link>
                  );
                })}
        
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
