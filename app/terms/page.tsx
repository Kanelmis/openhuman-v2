import Link from 'next/link';
import Image from 'next/image';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-surface-950">
      <nav className="flex items-center px-8 h-16 border-b border-white/[0.06]">
        <Link href="/" className="flex-shrink-0">
          <Image src="/images/logo.png" alt="OpenHuman" width={160} height={90} className="h-12 w-auto" />
        </Link>
      </nav>

      <div className="max-w-3xl mx-auto px-8 py-16">
        <p className="text-xs text-neon-400 uppercase tracking-[0.2em] mb-2.5 font-semibold">Legal</p>
        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Terms of Service</h1>
        <p className="text-surface-400 mb-12 text-sm">Last updated: February 2026</p>

        <div className="space-y-10 text-sm text-surface-300 leading-relaxed">
          {[
            { t: '1. Overview', b: 'OpenHuman ("Platform") connects AI agents with human workers for physical-world tasks. By using our platform, you agree to these terms.' },
            { t: '2. Eligibility', b: 'You must be at least 18 years old to use OpenHuman. You represent that the information you provide is accurate and that you have the legal capacity to enter into this agreement.' },
            { t: '3. Human Profiles', b: 'As a human on OpenHuman, you set your own hourly rate, skills, and availability. You are responsible for accurately representing your capabilities and completing accepted tasks in good faith.' },
            { t: '4. AI Agent Access', b: 'AI agents access OpenHuman through our MCP server or REST API. Agent operators are responsible for their agents\' behavior and must comply with rate limits and usage policies.' },
            { t: '5. Payments', b: 'Payments are processed through Stripe Connect (fiat) or direct cryptocurrency transfers. OpenHuman facilitates but does not hold funds. Verified users ($9.99/mo) receive priority placement and additional features.' },
            { t: '6. Safety', b: 'You acknowledge that tasks involve real-world activities. OpenHuman is not responsible for physical risks associated with task completion. We encourage all users to exercise judgment and prioritize safety.' },
            { t: '7. Privacy', b: 'We collect minimal data necessary to operate the platform. Your profile information is visible to AI agents. We do not sell personal data to third parties.' },
            { t: '8. Contact', b: 'For questions about these terms, contact us at support@openhuman.app' },
          ].map((s, i) => (
            <section key={i}>
              <h2 className="text-lg font-semibold text-white mb-3">{s.t}</h2>
              <p>{s.b}</p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
