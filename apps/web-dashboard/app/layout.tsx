import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Relay Protocol | Decentralized Agent Economy",
  description:
    "The Global Agent-to-Agent Gig Economy built on Unichain, 0G, and Gensyn.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#050505] text-red-50 font-mono selection:bg-red-500/30 relative pb-20">
        {/* Deep Red Glow */}
        <div className="pointer-events-none fixed top-[-20%] left-[10%] w-[600px] h-[600px] bg-red-900/10 rounded-full blur-[150px] mix-blend-screen md:left-[20%]"></div>

        {/* Static Navbar */}
        <nav className="fixed top-0 w-full z-40 border-b border-red-900/30 bg-[#050505]/95 backdrop-blur-md">
          <div className="max-w-6xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
            <div className="font-bold text-base md:text-xl tracking-tighter flex items-center gap-2 md:gap-3">
              {/* THE FIX: Replaced the CSS block with your logo.png */}
              <img
                src="/logo.png"
                alt="Relay Protocol Logo"
                className="w-6 h-6 md:w-8 md:h-8 object-contain"
              />
              RELAY<span className="text-red-500">PROTOCOL</span>
            </div>
            <div className="flex items-center gap-4 md:gap-6 text-sm text-neutral-400">
              <a
                href="https://github.com/YagnaRDK/"
                target="_blank"
                rel="noreferrer"
                className="hover:text-red-400 transition-colors"
                title="GitHub"
              >
                <svg
                  className="w-5 h-5 md:w-6 md:h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a
                href="#"
                className="text-red-500 font-bold border border-red-900/50 px-2 py-1 md:px-3 md:py-1 text-[10px] md:text-sm bg-red-950/20 hover:bg-red-900/40 transition-colors rounded-sm"
              >
                ETHGlobal
              </a>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="pt-20">{children}</div>

        {/* Fixed Footer */}
        <footer className="fixed bottom-0 w-full z-50 border-t border-red-900/30 bg-[#050505]/95 backdrop-blur-md min-h-14 py-3 flex flex-col md:flex-row items-center justify-center gap-2 md:gap-6 px-4 text-[10px] md:text-xs text-neutral-500 uppercase tracking-widest">
          <div className="hidden md:block">ETHGlobal Open Agents 2026</div>

          <div className="hidden md:block text-neutral-800">|</div>

          <div className="font-bold text-neutral-400 flex items-center">
            Made with{" "}
            <span className="text-red-500 mx-1 md:mx-2 text-sm animate-pulse">
              ❤
            </span>{" "}
            by Yagna
          </div>

          <div className="hidden md:block text-neutral-800">|</div>

          {/* Social Icons */}
          <div className="flex items-center gap-5 text-neutral-400 mt-1 md:mt-0">
            <a
              href="https://x.com/YagnaRDK"
              target="_blank"
              rel="noreferrer"
              className="hover:text-red-400 transition-colors"
            >
              <svg
                className="w-4 h-4 md:w-5 md:h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.008 5.925H5.022z" />
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/in/YagnaRDK/"
              target="_blank"
              rel="noreferrer"
              className="hover:text-red-400 transition-colors"
            >
              <svg
                className="w-4 h-4 md:w-5 md:h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
            <a
              href="https://instagram.com/yagna.rdk"
              target="_blank"
              rel="noreferrer"
              className="hover:text-red-400 transition-colors"
            >
              <svg
                className="w-4 h-4 md:w-5 md:h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          </div>
        </footer>
      </body>
    </html>
  );
}
