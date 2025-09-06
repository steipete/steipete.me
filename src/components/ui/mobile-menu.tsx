import { useEffect, useState } from "react";
import { NAV_LINKS } from "../../consts";

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    if (isOpen) {
      html.classList.add("overflow-hidden");
    } else {
      html.classList.remove("overflow-hidden");
    }
    return () => {
      html.classList.remove("overflow-hidden");
    };
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        className="flex h-9 w-9 items-center justify-center rounded-md p-2 text-muted-foreground transition-colors hover:bg-secondary md:hidden"
        aria-label="Toggle menu"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
          >
            <path d="M18 6 6 18"></path>
            <path d="m6 6 12 12"></path>
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
          >
            <line x1="4" x2="20" y1="12" y2="12"></line>
            <line x1="4" x2="20" y1="6" y2="6"></line>
            <line x1="4" x2="20" y1="18" y2="18"></line>
          </svg>
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 top-[4rem] z-50 grid h-[calc(100vh-4rem)] grid-rows-[auto_1fr] gap-2 bg-background p-6 md:hidden animate-in fade-in slide-in-from-bottom-80">
          <nav className="grid gap-4 text-lg font-medium">
            {NAV_LINKS.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="flex w-full items-center rounded-md py-2 capitalize text-foreground"
                onClick={() => setIsOpen(false)}
              >
                {label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
