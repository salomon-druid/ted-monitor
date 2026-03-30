import Link from 'next/link';
import Navigation from '@/components/Navigation';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-44 md:pb-32 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-gold/5 blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="animate-fade-up" style={{ animationDelay: '0.1s' }}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full mb-6">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                Live TED Data — Updated Daily
              </span>
            </div>

            <h1 className="animate-fade-up section-heading mb-6" style={{ animationDelay: '0.2s' }}>
              Find EU Tenders That Match{' '}
              <span className="text-primary">Your Business</span>{' '}
              — Automatically
            </h1>

            <p className="animate-fade-up section-subheading mb-10" style={{ animationDelay: '0.3s' }}>
              Stop wasting hours scrolling through TED. TenderWatch monitors every EU procurement notice,
              matches them to your CPV codes, and delivers high-fit opportunities straight to your inbox.
            </p>

            {/* Search bar / CTA */}
            <div className="animate-fade-up flex flex-col sm:flex-row items-center gap-3 max-w-xl mx-auto" style={{ animationDelay: '0.4s' }}>
              <div className="relative flex-1 w-full">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Try &quot;IT services&quot;, &quot;construction&quot;, &quot;medical equipment&quot;..."
                  className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border border-gray-200 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all placeholder:text-gray-400"
                />
              </div>
              <Link href="/dashboard" className="btn-primary whitespace-nowrap w-full sm:w-auto text-center">
                Start Free Trial
              </Link>
            </div>

            <p className="animate-fade-up text-xs text-gray-400 mt-4" style={{ animationDelay: '0.5s' }}>
              14 days free · No credit card required · Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-8 border-y border-gray-200/60 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
              <span><strong className="text-dark">195+</strong> Active Tenders</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-gold"></div>
              <span><strong className="text-dark">27</strong> EU Countries</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
              <span><strong className="text-dark">Updated</strong> Daily</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-gold"></div>
              <span><strong className="text-dark">50+</strong> SMBs Trust Us</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-heading mb-4">
              Win More Public Contracts in{' '}
              <span className="text-primary">3 Steps</span>
            </h2>
            <p className="section-subheading">
              From setup to your first matched tender — it takes less than 5 minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 max-w-5xl mx-auto">
            {[
              {
                step: '01',
                title: 'Set Your Profile',
                desc: 'Tell us your industry, CPV codes, and regions. We build your tender DNA so you only see relevant opportunities.',
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                ),
              },
              {
                step: '02',
                title: 'Get Matched',
                desc: 'Our algorithm scans every TED notice and scores them against your profile. High-fit tenders land in your inbox daily.',
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                  </svg>
                ),
              },
              {
                step: '03',
                title: 'Win Contracts',
                desc: 'Use our AI summaries and bid-fit scoring to craft winning proposals. Deadline tracking keeps your team on schedule.',
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M18.75 4.236c.982.143 1.954.317 2.916.52A6.003 6.003 0 0016.27 9.728M18.75 4.236V4.5c0 2.108-.966 3.99-2.48 5.228m0 0a6.003 6.003 0 01-2.48-.048m2.48.048c-.982.143-1.954.317-2.916.52" />
                  </svg>
                ),
              },
            ].map((item, i) => (
              <div key={i} className="relative text-center animate-fade-up" style={{ animationDelay: `${0.2 + i * 0.15}s` }}>
                {/* Connector line */}
                {i < 2 && (
                  <div className="hidden md:block absolute top-10 left-[60%] w-[80%] border-t-2 border-dashed border-gray-200"></div>
                )}
                <div className="relative z-10 w-20 h-20 mx-auto mb-6 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                  {item.icon}
                </div>
                <span className="text-xs font-bold text-gold tracking-widest uppercase mb-2 block">Step {item.step}</span>
                <h3 className="text-xl font-bold text-dark mb-3">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-heading mb-4">
              Everything You Need to{' '}
              <span className="text-primary">Win Tenders</span>
            </h2>
            <p className="section-subheading">
              Built for B2B teams who are tired of manual TED searches and missed opportunities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: (
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
                  </svg>
                ),
                title: 'CPV-Matched Alerts',
                desc: 'Set your CPV codes once. Every new TED notice that matches your business profile triggers an instant alert.',
                color: 'primary',
              },
              {
                icon: (
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                  </svg>
                ),
                title: 'Bid-Fit Scoring',
                desc: 'Every tender gets a 0–100% match score. Focus your time on the opportunities you are most likely to win.',
                color: 'gold',
              },
              {
                icon: (
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
                  </svg>
                ),
                title: 'AI Summaries',
                desc: 'Long procurement docs? Our AI extracts the key requirements, timeline, and evaluation criteria in seconds.',
                color: 'primary',
              },
              {
                icon: (
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: 'Deadline Tracking',
                desc: 'Never miss a submission deadline again. Smart reminders at 7 days, 3 days, and 24 hours before closing.',
                color: 'gold',
              },
              {
                icon: (
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                  </svg>
                ),
                title: 'Team Workflows',
                desc: 'Assign tenders to team members, track who is working on what, and collaborate on proposals in one place.',
                color: 'primary',
              },
              {
                icon: (
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                ),
                title: 'Export & Reports',
                desc: 'Export tender data as CSV, PDF, or Excel. Generate weekly reports for management or your bid team.',
                color: 'gold',
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="card p-8 group hover:-translate-y-1 transition-all duration-300 animate-fade-up"
                style={{ animationDelay: `${0.1 + i * 0.08}s` }}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${
                  feature.color === 'primary' ? 'bg-primary/10 text-primary' : 'bg-gold/10 text-gold'
                }`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-dark mb-2">{feature.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card p-8 md:p-12 text-center bg-gradient-to-br from-dark to-dark-light text-white rounded-3xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Trusted by 50+ SMBs Across Europe
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto mb-8">
              From IT consultancies in Berlin to construction firms in Lyon — businesses use TenderWatch to win
              public contracts they would have otherwise missed.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
              {['Berlin', 'Paris', 'Amsterdam', 'Vienna', 'Warsaw'].map((city) => (
                <span key={city} className="text-sm font-medium tracking-wider uppercase">{city}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-heading mb-4">
              Simple, Transparent{' '}
              <span className="text-primary">Pricing</span>
            </h2>
            <p className="section-subheading">
              Start free for 14 days. No credit card required. Upgrade, downgrade, or cancel anytime.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {/* Starter */}
            <div className="card p-8 flex flex-col animate-fade-up" style={{ animationDelay: '0.2s' }}>
              <div className="mb-6">
                <h3 className="text-lg font-bold text-dark">Starter</h3>
                <p className="text-sm text-gray-500 mt-1">For freelancers & solo founders</p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-dark">79€</span>
                <span className="text-gray-500 text-sm">/mo</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {[
                  '1 user account',
                  '1 industry focus',
                  'Daily email alerts',
                  'Basic CPV matching',
                  'Deadline reminders',
                  'CSV export',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-gray-600">
                    <svg className="w-5 h-5 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/dashboard" className="btn-secondary w-full text-center">
                Start Free Trial
              </Link>
            </div>

            {/* Professional — Featured */}
            <div className="card p-8 flex flex-col relative border-primary/30 shadow-lg shadow-primary/5 animate-fade-up ring-2 ring-primary/20" style={{ animationDelay: '0.3s' }}>
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="px-3 py-1 bg-primary text-white text-xs font-bold rounded-full uppercase tracking-wider">
                  Most Popular
                </span>
              </div>
              <div className="mb-6">
                <h3 className="text-lg font-bold text-dark">Professional</h3>
                <p className="text-sm text-gray-500 mt-1">For growing bid teams</p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-dark">199€</span>
                <span className="text-gray-500 text-sm">/mo</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {[
                  '3 user accounts',
                  'All industries',
                  'Real-time alerts',
                  'AI-powered summaries',
                  'Bid-fit scoring (0–100%)',
                  'Deadline tracking',
                  'Team collaboration',
                  'PDF & Excel export',
                  'Priority support',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-gray-600">
                    <svg className="w-5 h-5 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/dashboard" className="btn-primary w-full text-center">
                Start Free Trial
              </Link>
            </div>

            {/* Enterprise */}
            <div className="card p-8 flex flex-col animate-fade-up" style={{ animationDelay: '0.4s' }}>
              <div className="mb-6">
                <h3 className="text-lg font-bold text-dark">Enterprise</h3>
                <p className="text-sm text-gray-500 mt-1">For large organizations</p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-dark">499€</span>
                <span className="text-gray-500 text-sm">/mo</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {[
                  'Unlimited users',
                  'All industries',
                  'Everything in Professional',
                  'REST API access',
                  'SSO / SAML integration',
                  'Custom CPV rules',
                  'Dedicated account manager',
                  'Custom integrations',
                  'SLA guarantee',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-gray-600">
                    <svg className="w-5 h-5 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/dashboard" className="btn-gold w-full text-center">
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 md:py-28">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-heading mb-4">
              Frequently Asked Questions
            </h2>
            <p className="section-subheading">
              Everything you need to know before getting started.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'What is TED and why should I monitor it?',
                a: 'TED (Tenders Electronic Daily) is the EU\'s official procurement journal. Over 250,000 public contracts worth billions of euros are published there every year. If you sell to governments or large organizations in Europe, monitoring TED is essential to finding new business.',
              },
              {
                q: 'How does the CPV matching work?',
                a: 'CPV (Common Procurement Vocabulary) codes classify what a tender is about. You tell us which codes match your business — for example, 72000000 for IT services. Our system scans every new TED notice and filters by your codes, so you only see relevant opportunities.',
              },
              {
                q: 'What does "bid-fit scoring" mean?',
                a: 'Our algorithm analyzes each tender against your profile — considering factors like contract value, location, required qualifications, and competition level — and assigns a 0–100% score indicating how likely you are to win. This helps you focus on the best opportunities.',
              },
              {
                q: 'Can I try TenderWatch before paying?',
                a: 'Absolutely. Every plan comes with a 14-day free trial. No credit card required. You get full access to all features during the trial, so you can evaluate whether TenderWatch is right for your business.',
              },
              {
                q: 'How is this different from just checking TED directly?',
                a: 'TED publishes thousands of notices daily across all EU languages. Manually filtering them is a full-time job. TenderWatch automates the entire process — matching, scoring, summarizing, and alerting — so your team can focus on writing winning proposals instead of searching.',
              },
              {
                q: 'Can I cancel or change my plan anytime?',
                a: 'Yes. There are no long-term contracts. You can upgrade, downgrade, or cancel your subscription at any time. If you cancel, you keep access until the end of your current billing period.',
              },
            ].map((item, i) => (
              <details key={i} className="card group">
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                  <h3 className="text-base font-semibold text-dark pr-4">{item.q}</h3>
                  <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </summary>
                <div className="px-6 pb-6">
                  <p className="text-sm text-gray-600 leading-relaxed">{item.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card p-12 md:p-16 text-center bg-gradient-to-br from-primary to-primary-dark text-white rounded-3xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Stop Missing EU Tenders
            </h2>
            <p className="text-white/80 max-w-lg mx-auto mb-8 text-lg">
              Join 50+ businesses that already use TenderWatch to find, track, and win public contracts across Europe.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/dashboard" className="btn-gold !text-dark !px-8 !py-4 text-base">
                Start Your Free Trial
              </Link>
              <a href="#pricing" className="text-white/80 hover:text-white text-sm font-medium transition-colors">
                View pricing →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-gray-400 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <span className="text-white font-bold text-lg">
                  Tender<span className="text-primary">Watch</span>
                </span>
              </div>
              <p className="text-sm leading-relaxed">
                EU procurement intelligence platform. Find, match, and win public contracts automatically.
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold text-sm mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
                <li><Link href="/notices" className="hover:text-white transition-colors">Notices</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold text-sm mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold text-sm mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">GDPR</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs">
              &copy; {new Date().getFullYear()} TenderWatch. All rights reserved.
            </p>
            <p className="text-xs">
              Data sourced from <a href="https://ted.europa.eu" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-light transition-colors">TED (Tenders Electronic Daily)</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
