import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full py-12 bg-deep-space border-t border-white/10 flex flex-col items-center gap-6 px-margin-mobile md:px-margin-desktop text-center mt-20">
      <div className="w-full max-w-container-max mx-auto flex flex-col items-center gap-6">
        {/* Footer Logo */}
        <Link href="/" className="font-headline-lg text-headline-lg font-bold text-primary hover:opacity-80 transition-all duration-300 ease-in-out">
          hiuzdoram
        </Link>
        
        {/* Links */}
        <div className="flex flex-wrap justify-center gap-6 font-meta-sm-mono text-meta-sm-mono">
          <Link href="#" className="text-on-surface hover:text-secondary transition-colors duration-300 ease-in-out uppercase">Terms of Service</Link>
          <Link href="#" className="text-on-surface hover:text-secondary transition-colors duration-300 ease-in-out uppercase">Privacy Policy</Link>
          <Link href="#" className="text-on-surface hover:text-secondary transition-colors duration-300 ease-in-out uppercase">Help Center</Link>
          <Link href="#" className="text-on-surface hover:text-secondary transition-colors duration-300 ease-in-out uppercase">Contact Us</Link>
        </div>
        
        {/* Copyright */}
        <div className="font-body-md text-body-md text-on-surface/50 mt-4">
          © 2024 hiuzdoram. All rights reserved. Powered by Neon Premium.
        </div>
      </div>
    </footer>
  );
}
