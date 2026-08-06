import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-surface-container-lowest border-t border-border-glass mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="stitch-logo text-lg mb-3 inline-block">hiuzdoram</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed mt-3">
              Premium Asian doramalar platformasi. Eng sara koreyscha, yaponcha va xitoycha seriallarni o&apos;zbek subtitrlar bilan tomosha qiling.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-on-surface mb-3 uppercase tracking-wider">
              Navigatsiya
            </h4>
            <ul className="space-y-2">
              {[
                { href: "/browse", label: "Doramalar" },
                { href: "/top-100", label: "Top 100" },
                { href: "/schedule", label: "Jadval" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-on-surface-variant hover:text-primary transition-premium"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-on-surface mb-3 uppercase tracking-wider">
              Yordam
            </h4>
            <ul className="space-y-2">
              {["FAQ", "Bog'lanish", "Maxfiylik siyosati"].map((label) => (
                <li key={label}>
                  <span className="text-sm text-on-surface-variant hover:text-primary transition-premium cursor-pointer">
                    {label}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-sm font-semibold text-on-surface mb-3 uppercase tracking-wider">
              Ijtimoiy tarmoqlar
            </h4>
            <div className="flex gap-3">
              {["telegram", "youtube", "instagram"].map((icon) => (
                <button
                  key={icon}
                  className="w-10 h-10 rounded-full bg-surface-container-high hover:bg-primary/20 flex items-center justify-center text-on-surface-variant hover:text-primary transition-premium hover:scale-110"
                  aria-label={icon}
                >
                  <span className="material-symbols-outlined text-xl">
                    {icon === "telegram" ? "send" : icon === "youtube" ? "play_circle" : "photo_camera"}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border-glass flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-on-surface-variant text-sm text-center md:text-left mt-4 md:mt-0">
            © 2024 hiuzdoram. Barcha huquqlar himoyalangan.
          </p>
        </div>
      </div>
    </footer>
  );
}
