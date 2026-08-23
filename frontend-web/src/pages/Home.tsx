import { ArrowUpRight, Check, MessageCircle } from "lucide-react"

const NAV = [
  { label: "Features", href:"https://github.com/adnankhan46/multi-agent-wa-bot#features" },
  { label: "How it works", href:"https://github.com/adnankhan46/multi-agent-wa-bot#how" },
  { label: "Contact", href:"https://github.com/adnankhan46/multi-agent-wa-bot#contact" },
]

const STATS = [
  { value: "24/7", label: "Always on" },
  { value: "99.9%", label: "Uptime" },
]

const FEATURES = [
  {
    tag: "01",
    title: "Understands context",
    body: "Follows a conversation across messages instead of treating every question as the first one.",
  },
  {
    tag: "02",
    title: "Answers in seconds",
    body: "No app to open, no page to load , replies land in the same thread you already have open.",
  },
  {
    tag: "03",
    title: "Speaks your language",
    body: "Switch between Hindi, English, and more mid-conversation. It keeps up.",
  },
]

const STEPS = [
  { n: "01", text: "Scan the code with your phone's camera" },
  { n: "02", text: "WhatsApp opens with a message ready to send" },
  { n: "03", text: "Send it , Bool replies right away" },
]

function FauxQR() {
  // Deterministic pseudo-QR pattern, drawn once , avoids a placeholder image asset.
  const cells = [
    "1110101011101",
    "1010101010101",
    "1110100011101",
    "0000101010000",
    "1011111010111",
    "0100000010100",
    "1110111011101",
    "0010100010010",
    "1101011101101",
    "0000100010000",
    "1110101011101",
    "0101010101010",
    "1010111010101",
  ]
  const size = 13
  const cell = 12
  return (
    <svg width={size * cell} height={size * cell} viewBox={`0 0 ${size * cell} ${size * cell}`}>
      <rect width={size * cell} height={size * cell} fill="white" />
      {cells.map((row, y) =>
        row.split("").map((c, x) =>
          c === "1" ? (
            <rect key={`${x}-${y}`} x={x * cell} y={y * cell} width={cell} height={cell} fill="#14532d" />
          ) : null
        )
      )}
    </svg>
  )
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-stone-900" style={{ fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif" }}>
      {/* Header */}
      <header className="border-b border-stone-200">
        <nav className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="#" className="flex items-center gap-1.5">
            <span className="text-lg font-semibold tracking-tight">Bool</span>
            <span
              className="text-lg font-semibold tracking-tight text-green-600"
              style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}
            >
              ()
            </span>
          </a>

          <div className="hidden md:flex items-center gap-8">
            {NAV.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm text-stone-600 hover:text-stone-900 transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-5">
            <select
              aria-label="Language"
              className="hidden sm:block bg-transparent text-sm text-stone-500 border-none outline-none cursor-pointer"
            >
              <option>English</option>
              <option>हिंदी</option>
            </select>
            <a
              href="https://github.com/adnankhan46/multi-agent-wa-bot"
              className="inline-flex items-center gap-1.5 text-sm font-medium bg-stone-900 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              Open chat
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </nav>
      </header>

      <main>
        {/* Hero */}
        <section className="max-w-5xl mx-auto px-6 pt-20 pb-16 grid md:grid-cols-2 gap-14 items-center">
          <div>
            <div
              className="inline-block text-xs tracking-widest text-green-700 mb-5"
              style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}
            >
              WHATSAPP &middot; HINDI &amp; ENGLISH &middot; 24/7
            </div>

            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight leading-[1.1] text-stone-900">
              Every question
              <br />
              gets a <span className="text-green-600">straight</span> answer.
            </h1>

            <p className="mt-5 text-base text-stone-600 leading-relaxed max-w-md">
              Bool is an AI assistant that lives inside WhatsApp. Ask it something, get a real answer back
              no new app.
            </p>

            <div className="mt-8 flex items-center gap-6">
              <a
                href="https://github.com/adnankhan46/multi-agent-wa-bot"
                className="inline-flex items-center gap-2 bg-green-600 text-white px-5 py-3 rounded-md text-sm font-medium hover:bg-green-700 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                Message us on WhatsApp
              </a>
              <a href="https://github.com/adnankhan46/multi-agent-wa-bot" className="text-sm font-medium text-stone-700 hover:text-green-700 transition-colors">
                See how it works &rarr;
              </a>
            </div>

            <div className="mt-14 flex items-center divide-x divide-stone-200">
              {STATS.map((s) => (
                <div key={s.label} className="pr-6 mr-6 first:pl-0 last:pr-0 last:mr-0">
                  <div
                    className="text-xl font-semibold text-stone-900"
                    style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}
                  >
                    {s.value}
                  </div>
                  <div className="text-xs text-stone-500 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Signature element: a real-looking WhatsApp-style exchange, not a decorative blob */}
          <div className="border border-stone-200 rounded-lg overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-stone-200 bg-stone-50">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-xs text-stone-500">Bool AI &middot; online</span>
            </div>
            <div className="p-4 space-y-3 text-sm">
              <div className="flex justify-end">
                <div className="bg-green-100 text-stone-800 rounded-lg rounded-tr-sm px-3 py-2 max-w-[80%]">
                  What do above PDF say?
                </div>
              </div>
              <div className="flex justify-start">
                <div className="bg-stone-100 text-stone-800 rounded-lg rounded-tl-sm px-3 py-2 max-w-[85%]">
                  It says 247 = 13 &times; 19 only fails false positives up to its square root, and none divide it.
                  It's prime.
                </div>
              </div>
              <div className="flex justify-end">
                <div className="bg-green-100 text-stone-800 rounded-lg rounded-tr-sm px-3 py-2 max-w-[80%] flex items-center gap-1.5">
                  perfect, thanks
                  <Check className="w-3.5 h-3.5 text-green-600" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="max-w-5xl mx-auto px-6 py-16 border-t border-stone-200">
          <h2 className="text-2xl font-semibold tracking-tight text-stone-900 mb-10">
            What it's actually good at
          </h2>

          <div className="divide-y divide-stone-200 border-t border-stone-200">
            {FEATURES.map((f) => (
              <div key={f.tag} className="py-7 grid md:grid-cols-[3rem_1fr_2fr] gap-4 md:gap-8 items-start">
                <div
                  className="text-sm text-green-600"
                  style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}
                >
                  {f.tag}
                </div>
                <div className="text-base font-medium text-stone-900">{f.title}</div>
                <div className="text-sm text-stone-600 leading-relaxed">{f.body}</div>
              </div>
            ))}
          </div>
        </section>

        {/* QR / how it works */}
        <section id="how" className="max-w-5xl mx-auto px-6 py-16 border-t border-stone-200">
          <div className="border border-stone-200 rounded-lg p-10 grid md:grid-cols-[auto_1fr] gap-10 items-center">
            <div className="border border-stone-200 rounded-md p-3 w-fit mx-auto">
              <FauxQR />
            </div>

            <div>
              <h3 className="text-xl font-semibold tracking-tight text-stone-900 mb-2">
                Start chatting in under a minute
              </h3>
              <p className="text-sm text-stone-600 mb-6">Scan the code to open a WhatsApp chat with Bool.</p>

              <ol className="space-y-3">
                {STEPS.map((s) => (
                  <li key={s.n} className="flex items-baseline gap-3 text-sm">
                    <span
                      className="text-green-600"
                      style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}
                    >
                      {s.n}
                    </span>
                    <span className="text-stone-700">{s.text}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer id="contact" className="border-t border-stone-200">
        <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-semibold tracking-tight">Bool</span>
            <span
              className="text-sm font-semibold tracking-tight text-green-600"
              style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}
            >
              ()
            </span>
            <span className="text-sm text-stone-400 ml-2">&copy; {new Date().getFullYear()}</span>
          </div>
          <div className="flex gap-6 text-xs text-stone-500">
            <a href="https://github.com/adnankhan46/multi-agent-wa-bot" className="hover:text-stone-900 transition-colors">
              Privacy
            </a>
            <a href="https://github.com/adnankhan46/multi-agent-wa-bot" className="hover:text-stone-900 transition-colors">
              Terms
            </a>
            <a href="https://github.com/adnankhan46/multi-agent-wa-bot" className="hover:text-stone-900 transition-colors">
              Support
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}