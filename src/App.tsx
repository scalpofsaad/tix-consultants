import React, { useEffect, useState } from 'react';

type CalcMode = 'quickbooks' | 'excel' | 'statements';

interface PricingPackage {
  id: string;
  name: string;
  monthlyFee: string;
  monthlyBookkeeping: string;
  managementAccounts: string;
  annualAfs: string;
}

const PRICING_PACKAGES: PricingPackage[] = [
  {
    id: 'starter',
    name: 'STARTER',
    monthlyFee: '$50',
    monthlyBookkeeping: 'Up to 100 transactions',
    managementAccounts: 'Basic P&L and Balance Sheet',
    annualAfs: 'Up to 200 bank transactions / 100 invoices',
  },
  {
    id: 'growth',
    name: 'GROWTH',
    monthlyFee: '$59',
    monthlyBookkeeping: 'Up to 300 transactions',
    managementAccounts: 'P&L, Balance Sheet and cash flow',
    annualAfs: 'Up to 500 bank transactions / 200 invoices',
  },
  {
    id: 'professional',
    name: 'PROFESSIONAL',
    monthlyFee: '$79',
    monthlyBookkeeping: 'Up to 600 transactions',
    managementAccounts: 'Accounts with financial analysis',
    annualAfs: 'Up to 800 bank transactions / 300 invoices',
  },
  {
    id: 'premium',
    name: 'PREMIUM',
    monthlyFee: '$115',
    monthlyBookkeeping: 'Up to 1,000 transactions',
    managementAccounts: 'Detailed management reporting and analysis',
    annualAfs: 'Up to 2,000 bank transactions / 500 invoices',
  },
];

const FS_TIERS = [
  { value: '50', label: '100 \u2013 200 Bank Transactions | 50 \u2013 100 Invoices ($50)' },
  { value: '70', label: '200 \u2013 500 Bank Transactions | 100 \u2013 200 Invoices ($70)' },
  { value: '80', label: '500 \u2013 800 Bank Transactions | 200 \u2013 300 Invoices ($80)' },
  { value: '100', label: '800 \u2013 1,200 Bank Transactions | 300 \u2013 400 Invoices ($100)' },
  { value: '150', label: '1,200 \u2013 2,000 Bank Transactions | 400 \u2013 500 Invoices ($150)' },
];

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);

  // Cost Estimator State
  const [currentMode, setCurrentMode] = useState<CalcMode>('quickbooks');
  const [txCount, setTxCount] = useState<number>(250);
  const [vatRegistered, setVatRegistered] = useState<boolean>(false);
  const [fsTierValue, setFsTierValue] = useState<string>('50');

  // Contact Form State
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [businessType, setBusinessType] = useState('Growing Business');
  const [serviceInterest, setServiceInterest] = useState('Monthly Bookkeeping on QuickBooks');
  const [clientMessage, setClientMessage] = useState('');
  const [formFeedback, setFormFeedback] = useState('');

  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Compute Cost Estimator output
  let totalText = '';
  let breakdownText = '';
  let summaryForMessage = '';

  if (currentMode === 'quickbooks') {
    const tx = Math.max(1, txCount || 100);
    const blocks = Math.ceil(tx / 100);
    let rate = 7.0;
    let tierName = 'Up to 100 tier';

    if (tx >= 101 && tx <= 500) {
      rate = 5.0;
      tierName = '101\u2013500 tier';
    } else if (tx >= 501) {
      rate = 4.0;
      tierName = tx <= 1000 ? '501\u20131,000 tier' : '501+ volume rate';
    }

    const total = blocks * rate;
    totalText = `$${total.toFixed(2)}`;
    const vatText = vatRegistered ? ' | VAT-registered (same rates apply)' : '';
    breakdownText = `${blocks} block(s) of 100 transactions \u00d7 $${rate.toFixed(2)}/100 (${tierName})${vatText}`;
    summaryForMessage = `QuickBooks Monthly Bookkeeping for ~${tx} transactions${vatRegistered ? ' (VAT-registered)' : ''} \u2014 Estimated: ${totalText}/month.`;
  } else if (currentMode === 'excel') {
    const tx = Math.max(1, txCount || 100);
    const blocks = Math.ceil(tx / 100);
    const rate = 2.5;
    const total = blocks * rate;
    totalText = `$${total.toFixed(2)}`;
    const vatText = vatRegistered ? ' | VAT-registered (same rate applies)' : '';
    breakdownText = `${blocks} block(s) of 100 transactions \u00d7 $2.50/100 (Any volume)${vatText}`;
    summaryForMessage = `Excel Monthly Bookkeeping for ~${tx} transactions${vatRegistered ? ' (VAT-registered)' : ''} \u2014 Estimated: ${totalText}/month.`;
  } else {
    const selectedOption = FS_TIERS.find((t) => t.value === fsTierValue) || FS_TIERS[0];
    const price = parseFloat(selectedOption.value);
    totalText = `$${price.toFixed(0)}`;
    breakdownText = `${selectedOption.label.split(' (')[0]} \u2014 Includes General Ledger & Trial Balance.`;
    summaryForMessage = `Financial Statement Preparation (${selectedOption.label}) \u2014 Estimated: ${totalText}.`;
  }

  const waEstimateHref = `https://wa.me/923246800722?text=${encodeURIComponent(
    `Hello Tix Consultants, I used your website cost estimator and would like to inquire about: ${summaryForMessage}`
  )}`;

  const handlePackageClick = (pkg: PricingPackage) => {
    setSelectedPackage(pkg.id);
    setServiceInterest('Accounting & Consulting Services');
    setClientMessage(
      `Hello Tix Consultants, I am interested in the ${pkg.name} package (Monthly Fee: ${pkg.monthlyFee}):\n` +
        `- Monthly Bookkeeping: ${pkg.monthlyBookkeeping}\n` +
        `- Management Accounts: ${pkg.managementAccounts}\n` +
        `- Annual AFS: ${pkg.annualAfs}`
    );
    const contactEl = document.getElementById('contact');
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handlePackageKeyDown = (e: React.KeyboardEvent<HTMLDivElement>, pkg: PricingPackage) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handlePackageClick(pkg);
    }
  };

  const handlePrefillContact = () => {
    if (currentMode === 'quickbooks') {
      setServiceInterest('Monthly Bookkeeping on QuickBooks');
    } else if (currentMode === 'excel') {
      setServiceInterest('Monthly Bookkeeping on Excel');
    } else {
      setServiceInterest('Financial Statement Preparation');
    }
    setClientMessage(`Hello Tix Consultants, please send me a formal quote for:\n${summaryForMessage}`);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = clientName.trim();
    const email = clientEmail.trim();
    const msg = clientMessage.trim();

    const subject = encodeURIComponent(`New Inquiry: ${serviceInterest} \u2014 ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nClient Type: ${businessType}\nService Interested In: ${serviceInterest}\n\nDetails:\n${msg}`
    );

    window.location.href = `mailto:tixconsultants@outlook.com?subject=${subject}&body=${body}`;
    setFormFeedback('Opening your email client with your pre-filled inquiry to tixconsultants@outlook.com.');
  };

  const handleSendFormWhatsApp = () => {
    const name = clientName.trim();
    const email = clientEmail.trim();
    const msg = clientMessage.trim();

    if (!name || !msg) {
      setFormFeedback('Please enter your name and project details before sending via WhatsApp.');
      return;
    }

    const text = encodeURIComponent(
      `Hello Tix Consultants!\nName: ${name}\nEmail: ${email || 'N/A'}\nClient Type: ${businessType}\nService: ${serviceInterest}\nDetails: ${msg}`
    );
    const url = `https://wa.me/923246800722?text=${text}`;
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    anchor.click();
    setFormFeedback('WhatsApp chat opened with your inquiry details.');
  };

  return (
    <>
      {/* Top Trust Bar */}
      <div className="top-bar">
        <div className="container top-bar-inner">
          <div className="top-bar-left">
            <span className="top-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              Serving Clients Across Africa and Beyond
            </span>
            <span className="top-divider" aria-hidden="true">|</span>
            <span className="top-tagline">Your Trusted Partner for Financial Excellence</span>
          </div>
          <div className="top-bar-right">
            <a href="mailto:tixconsultants@outlook.com" className="top-link">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              tixconsultants@outlook.com
            </a>
            <a href="https://wa.me/923246800722" target="_blank" rel="noopener noreferrer" className="top-link">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              +92 324 6800722
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <header className={`site-header${scrolled ? ' scrolled' : ''}`} id="siteHeader">
        <div className="container nav-inner">
          <a href="#top" className="brand-logo" aria-label="Tix Consultants Home">
            <img src="/assets/logo.svg" alt="Tix Consultants — Accounting, Bookkeeping, Consulting" width={240} height={52} />
          </a>

          <nav className={`nav-links${mobileMenuOpen ? ' open' : ''}`} id="navLinks" aria-label="Primary Navigation">
            <a href="#services" onClick={() => setMobileMenuOpen(false)}>Services</a>
            <a href="#why-us" onClick={() => setMobileMenuOpen(false)}>Why Choose Us</a>
            <a href="#pricing" onClick={() => setMobileMenuOpen(false)}>Pricing</a>
            <a href="#calculator" onClick={() => setMobileMenuOpen(false)}>Cost Estimator</a>
            <a href="#contact" onClick={() => setMobileMenuOpen(false)}>Contact</a>
            <a href="#contact" className="btn btn-primary nav-cta" onClick={() => setMobileMenuOpen(false)}>Get in Touch</a>
          </nav>

          <button
            className="mobile-toggle"
            id="mobileToggle"
            type="button"
            aria-label="Toggle Menu"
            aria-expanded={mobileMenuOpen}
            aria-controls="navLinks"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>

      <main id="top">
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-bg-grid" aria-hidden="true"></div>
          <div className="container hero-grid">
            <div className="hero-content">
              <div className="hero-pill">
                <span className="dot"></span>
                Reliable. Cost-Effective. Globally Focused.
              </div>
              <h1>Professional Accounting &amp; Bookkeeping Support</h1>
              <p className="hero-lead">
                Whether you are a <strong>growing business</strong>, a <strong>CPA firm</strong>, or an <strong>SME</strong>, Tix Consultants provides flexible and professional support to help you stay compliant, improve financial clarity, and focus on what matters most &mdash; growing your business.
              </p>

              <div className="hero-actions">
                <a href="#pricing" className="btn btn-primary btn-lg">
                  View Transparent Pricing
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </a>
                <a
                  href="https://wa.me/923246800722?text=Hello%20Tix%20Consultants%2C%20I%20would%20like%20to%20discuss%20accounting%20and%20bookkeeping%20support."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp btn-lg"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2zm5.79 14.12c-.24.68-1.42 1.3-1.97 1.38-.52.08-1.18.11-1.9-.12-.44-.14-1-.33-1.72-.64-3.02-1.3-4.99-4.34-5.14-4.54-.15-.2-1.23-1.64-1.23-3.13 0-1.49.78-2.22 1.06-2.52.28-.3.6-.38.8-.38.2 0 .4 0 .58.01.19.01.44-.07.69.53.25.6.86 2.09.94 2.24.08.15.13.33.03.53-.1.2-.15.33-.3.5-.15.17-.32.39-.45.52-.15.15-.31.31-.13.61.18.3.79 1.3 1.7 2.11 1.17 1.04 2.15 1.36 2.45 1.51.3.15.48.13.66-.08.18-.2.76-.89.96-1.19.2-.3.4-.25.68-.15.28.1 1.77.83 2.07.98.3.15.5.23.58.36.07.13.07.75-.17 1.43z" />
                  </svg>
                  Chat on WhatsApp
                </a>
              </div>

              <div className="hero-highlights">
                <div className="highlight-item">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  VAT-Registered Clients Welcome (Same Rates)
                </div>
                <div className="highlight-item">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  All Prices Clearly Listed in US$
                </div>
              </div>
            </div>

            {/* Visual Financial Summary Card */}
            <div className="hero-visual">
              <div className="dashboard-card">
                <div className="dashboard-header">
                  <div>
                    <span className="dash-kicker">Transparent USD Packages</span>
                    <h2 className="dash-title">Financial Clarity Snapshot</h2>
                  </div>
                  <img src="/assets/badge.svg" alt="TIXCON Since 2024 Seal" className="seal-badge" width={84} height={84} />
                </div>

                <div className="dash-stats">
                  <div className="stat-box">
                    <span className="stat-label">Excel Bookkeeping</span>
                    <span className="stat-value">$2.50</span>
                    <span className="stat-sub">per 100 transactions</span>
                  </div>
                  <div className="stat-box">
                    <span className="stat-label">QuickBooks Monthly</span>
                    <span className="stat-value">From $4</span>
                    <span className="stat-sub">per 100 transactions</span>
                  </div>
                  <div className="stat-box accent">
                    <span className="stat-label">Financial Statements</span>
                    <span className="stat-value">From $50</span>
                    <span className="stat-sub">incl. GL &amp; Trial Balance</span>
                  </div>
                </div>

                {/* Stylized Analytics Bars */}
                <div className="dash-chart">
                  <div className="chart-header">
                    <span>Monthly Compliance &amp; Reporting</span>
                    <span className="status-pill">On-Time Delivery</span>
                  </div>
                  <div className="bars" aria-hidden="true">
                    <div className="bar-col">
                      <div className="bar" style={{ height: '45%' }}></div>
                      <span>Q1</span>
                    </div>
                    <div className="bar-col">
                      <div className="bar" style={{ height: '62%' }}></div>
                      <span>Q2</span>
                    </div>
                    <div className="bar-col">
                      <div className="bar" style={{ height: '55%' }}></div>
                      <span>Q3</span>
                    </div>
                    <div className="bar-col">
                      <div className="bar" style={{ height: '78%' }}></div>
                      <span>Q4</span>
                    </div>
                    <div className="bar-col">
                      <div className="bar active" style={{ height: '92%' }}></div>
                      <span>GL</span>
                    </div>
                    <div className="bar-col">
                      <div className="bar active" style={{ height: '100%' }}></div>
                      <span>FS</span>
                    </div>
                  </div>
                </div>

                <div className="dash-footer">
                  <span>Serving Growing Businesses, CPA Firms &amp; SMEs</span>
                  <a href="#calculator">Estimate Cost &rarr;</a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Services Section */}
        <section className="section" id="services">
          <div className="container">
            <div className="section-header">
              <span className="section-eyebrow">What We Offer</span>
              <h2>Our Services</h2>
              <p>End-to-end accounting, bookkeeping, and financial advisory tailored to keep your operations compliant and decision-ready.</p>
            </div>

            <div className="services-grid">
              <article className="service-card">
                <div className="service-icon">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                </div>
                <h3>Financial Statement Preparation</h3>
                <p>Comprehensive financial statements prepared accurately along with the General Ledger and Trial Balance for complete reporting clarity.</p>
              </article>

              <article className="service-card">
                <div className="service-icon">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <path d="M3 9h18M9 21V9" />
                  </svg>
                </div>
                <h3>Bookkeeping &amp; Accounting Support</h3>
                <p>Consistent monthly recording, reconciliations, accounts payable/receivable tracking, and reliable back-office accounting assistance.</p>
              </article>

              <article className="service-card">
                <div className="service-icon">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                </div>
                <h3>Auditing &amp; Assurance Assistance</h3>
                <p>Organized working papers, schedule preparation, and audit-ready documentation to support smooth internal and external reviews.</p>
              </article>

              <article className="service-card">
                <div className="service-icon">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <line x1="18" y1="20" x2="18" y2="10" />
                    <line x1="12" y1="20" x2="12" y2="4" />
                    <line x1="6" y1="20" x2="6" y2="14" />
                  </svg>
                </div>
                <h3>Financial Modelling &amp; Analysis</h3>
                <p>Forward-looking cash flow models, variance analysis, and structured financial insights to guide strategic business decisions.</p>
              </article>

              <article className="service-card">
                <div className="service-icon">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                  </svg>
                </div>
                <h3>QuickBooks &amp; Excel Bookkeeping</h3>
                <p>Flexible bookkeeping in QuickBooks or Excel with transparent per-100-transaction rates &mdash; including full support for VAT-registered clients.</p>
              </article>

              <article className="service-card">
                <div className="service-icon">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <h3>Accounting &amp; Consulting Services</h3>
                <p>Dedicated consulting and scalable capacity for growing businesses, CPA firms, and SMEs looking to streamline finance operations.</p>
              </article>
            </div>
          </div>
        </section>

        {/* Why Choose Tix Consultants */}
        <section className="section section-tinted" id="why-us">
          <div className="container">
            <div className="section-header">
              <span className="section-eyebrow">The Tix Consultants Advantage</span>
              <h2>Why Choose Tix Consultants?</h2>
              <p>Built on precision, transparency, and global standards &mdash; serving clients across Africa and beyond.</p>
            </div>

            <div className="pillars-grid">
              <div className="pillar-card">
                <div className="pillar-icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M11 17a4 4 0 0 1-8 0V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2z" />
                    <path d="M16.7 13H19a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H7" />
                    <path d="M7 17h.01" />
                  </svg>
                </div>
                <h3>Reliable &amp; Professional Service</h3>
                <p>Consistent quality and meticulous attention to detail across every ledger, reconciliation, and report.</p>
              </div>

              <div className="pillar-card">
                <div className="pillar-icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
                    <path d="M12 18V6" />
                  </svg>
                </div>
                <h3>Cost-Effective Solutions</h3>
                <p>Competitive, clear US$ pricing tiers designed to maximize value without compromising accounting rigor.</p>
              </div>

              <div className="pillar-card">
                <div className="pillar-icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <h3>On-Time Delivery</h3>
                <p>Dependable turnaround times so your monthly closes, VAT filings, and financial statements stay on schedule.</p>
              </div>

              <div className="pillar-card">
                <div className="pillar-icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <polyline points="9 12 11 14 15 10" />
                  </svg>
                </div>
                <h3>Confidentiality Assured</h3>
                <p>Strict data privacy and secure financial document handling for every client and partner CPA firm.</p>
              </div>

              <div className="pillar-card">
                <div className="pillar-icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                </div>
                <h3>Global Client Focus</h3>
                <p>Seamless remote collaboration supporting businesses and CPA practices across Africa and internationally.</p>
              </div>
            </div>

            {/* Global Audience Banner */}
            <div className="audience-banner">
              <div className="audience-text">
                <span className="audience-tag">Who We Support</span>
                <h3>Flexible Support for Growing Businesses, CPA Firms &amp; SMEs</h3>
                <p>Partner with Tix Consultants to reduce overhead, maintain full compliance, and gain clear financial visibility month after month.</p>
              </div>
              <a href="#contact" className="btn btn-white">Schedule a Discussion</a>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="section" id="pricing">
          <div className="container">
            <div className="section-header">
              <span className="section-eyebrow">Clear &amp; Upfront Rates</span>
              <h2>Pricing</h2>
              <p>Flexible bookkeeping and financial statement packages built around your actual transaction volume.</p>
              <div className="usd-notice">ALL PRICES ARE IN US DOLLARS (US$)</div>
            </div>

            <div className="pricing-packages-grid">
              {PRICING_PACKAGES.map((pkg) => (
                <div
                  key={pkg.id}
                  role="button"
                  tabIndex={0}
                  aria-pressed={selectedPackage === pkg.id}
                  className={`pricing-pkg-card${selectedPackage === pkg.id ? ' selected' : ''}`}
                  onClick={() => handlePackageClick(pkg)}
                  onKeyDown={(e) => handlePackageKeyDown(e, pkg)}
                >
                  <div className="pkg-header">
                    <h3 className="pkg-name">{pkg.name}</h3>
                    <span className="pkg-fee-label">Monthly Fee</span>
                    <div className="pkg-fee-amount">{pkg.monthlyFee}</div>
                  </div>

                  <div className="pkg-details">
                    <div className="pkg-detail-item">
                      <span className="pkg-detail-label">Monthly Bookkeeping</span>
                      <span className="pkg-detail-value">{pkg.monthlyBookkeeping}</span>
                    </div>

                    <div className="pkg-detail-item">
                      <span className="pkg-detail-label">Management Accounts</span>
                      <span className="pkg-detail-value">{pkg.managementAccounts}</span>
                    </div>

                    <div className="pkg-detail-item">
                      <span className="pkg-detail-label">Annual AFS</span>
                      <span className="pkg-detail-value">{pkg.annualAfs}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Interactive Cost Estimator */}
        <section className="section section-tinted" id="calculator">
          <div className="container">
            <div className="section-header">
              <span className="section-eyebrow">Interactive Tool</span>
              <h2>Instant Service Cost Estimator</h2>
              <p>Select a service and enter your monthly volume to estimate your investment in US Dollars.</p>
            </div>

            <div className="calc-wrapper">
              <div className="calc-tabs" role="tablist" aria-label="Service Pricing Calculator">
                <button
                  type="button"
                  className={`calc-tab${currentMode === 'quickbooks' ? ' active' : ''}`}
                  data-tab="quickbooks"
                  role="tab"
                  aria-selected={currentMode === 'quickbooks'}
                  onClick={() => setCurrentMode('quickbooks')}
                >
                  QuickBooks Bookkeeping
                </button>
                <button
                  type="button"
                  className={`calc-tab${currentMode === 'excel' ? ' active' : ''}`}
                  data-tab="excel"
                  role="tab"
                  aria-selected={currentMode === 'excel'}
                  onClick={() => setCurrentMode('excel')}
                >
                  Excel Bookkeeping
                </button>
                <button
                  type="button"
                  className={`calc-tab${currentMode === 'statements' ? ' active' : ''}`}
                  data-tab="statements"
                  role="tab"
                  aria-selected={currentMode === 'statements'}
                  onClick={() => setCurrentMode('statements')}
                >
                  Financial Statements
                </button>
              </div>

              <div className="calc-body">
                <div className="calc-inputs">
                  {/* QuickBooks & Excel Controls */}
                  <div id="txControls" className={currentMode === 'statements' ? 'hidden' : ''}>
                    <label htmlFor="txRange" className="calc-label">
                      Estimated Monthly Transactions:{' '}
                      <strong id="txDisplay">{txCount}</strong>
                    </label>
                    <input
                      type="range"
                      id="txRange"
                      min={50}
                      max={1000}
                      step={50}
                      value={Math.min(1000, txCount)}
                      onChange={(e) => setTxCount(parseInt(e.target.value, 10))}
                    />
                    <div className="range-input-row">
                      <label htmlFor="txNumber">Exact transaction count:</label>
                      <input
                        type="number"
                        id="txNumber"
                        min={1}
                        max={10000}
                        value={txCount}
                        onChange={(e) => {
                          const val = Math.max(1, parseInt(e.target.value || '1', 10));
                          setTxCount(val);
                        }}
                      />
                    </div>

                    <label className="checkbox-row">
                      <input
                        type="checkbox"
                        id="vatToggle"
                        checked={vatRegistered}
                        onChange={(e) => setVatRegistered(e.target.checked)}
                      />
                      <span>
                        My business is VAT-registered (<em>same rates apply</em>)
                      </span>
                    </label>
                  </div>

                  {/* Financial Statement Controls */}
                  <div id="fsControls" className={currentMode === 'statements' ? '' : 'hidden'}>
                    <label htmlFor="fsTier" className="calc-label">Select Bank Transactions &amp; Invoices Volume:</label>
                    <select
                      id="fsTier"
                      className="calc-select"
                      value={fsTierValue}
                      onChange={(e) => setFsTierValue(e.target.value)}
                    >
                      {FS_TIERS.map((tier) => (
                        <option key={tier.value} value={tier.value}>
                          {tier.label}
                        </option>
                      ))}
                    </select>
                    <p className="fs-include-note">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Includes General Ledger &amp; Trial Balance preparation.
                    </p>
                  </div>
                </div>

                <div className="calc-result-card">
                  <span className="result-kicker">Estimated Cost (US$)</span>
                  <div className="result-amount" id="calcTotal">{totalText}</div>
                  <p className="result-breakdown" id="calcBreakdown">{breakdownText}</p>
                  <div className="result-actions">
                    <a
                      href={waEstimateHref}
                      id="whatsappQuoteBtn"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-whatsapp btn-block"
                    >
                      Send Estimate via WhatsApp
                    </a>
                    <a
                      href="#contact"
                      id="prefillContactBtn"
                      className="btn btn-white btn-block"
                      onClick={handlePrefillContact}
                    >
                      Request Formal Quote
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="section contact-section" id="contact">
          <div className="container">
            <div className="contact-grid">
              <div className="contact-info">
                <span className="section-eyebrow">Get in Touch Today</span>
                <h2>Let&rsquo;s Discuss How We Can Support Your Business</h2>
                <p className="contact-lead">
                  Ready for reliable, cost-effective accounting and bookkeeping? Reach out directly via email or WhatsApp, or send us your requirements using the form.
                </p>

                <div className="contact-cards">
                  <a href="mailto:tixconsultants@outlook.com" className="contact-card">
                    <div className="c-icon">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <rect x="2" y="4" width="20" height="16" rx="2" />
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                      </svg>
                    </div>
                    <div>
                      <span className="c-label">Email Us</span>
                      <span className="c-value">tixconsultants@outlook.com</span>
                    </div>
                  </a>

                  <a href="https://wa.me/923246800722" target="_blank" rel="noopener noreferrer" className="contact-card">
                    <div className="c-icon whatsapp">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2zm5.79 14.12c-.24.68-1.42 1.3-1.97 1.38-.52.08-1.18.11-1.9-.12-.44-.14-1-.33-1.72-.64-3.02-1.3-4.99-4.34-5.14-4.54-.15-.2-1.23-1.64-1.23-3.13 0-1.49.78-2.22 1.06-2.52.28-.3.6-.38.8-.38.2 0 .4 0 .58.01.19.01.44-.07.69.53.25.6.86 2.09.94 2.24.08.15.13.33.03.53-.1.2-.15.33-.3.5-.15.17-.32.39-.45.52-.15.15-.31.31-.13.61.18.3.79 1.3 1.7 2.11 1.17 1.04 2.15 1.36 2.45 1.51.3.15.48.13.66-.08.18-.2.76-.89.96-1.19.2-.3.4-.25.68-.15.28.1 1.77.83 2.07.98.3.15.5.23.58.36.07.13.07.75-.17 1.43z" />
                      </svg>
                    </div>
                    <div>
                      <span className="c-label">WhatsApp / Phone</span>
                      <span className="c-value">+92 324 6800722</span>
                    </div>
                  </a>

                  <div className="contact-card">
                    <div className="c-icon">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="2" y1="12" x2="22" y2="12" />
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                      </svg>
                    </div>
                    <div>
                      <span className="c-label">Global Reach</span>
                      <span className="c-value">Serving Clients Across Africa and Beyond</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="contact-form-card">
                <h3>Request a Quote or Consultation</h3>
                <form id="contactForm" onSubmit={handleContactSubmit}>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="clientName">Full Name *</label>
                      <input
                        type="text"
                        id="clientName"
                        name="clientName"
                        placeholder="e.g., Sarah Mensah"
                        required
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="clientEmail">Email Address *</label>
                      <input
                        type="email"
                        id="clientEmail"
                        name="clientEmail"
                        placeholder="you@company.com"
                        required
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="businessType">Client Type</label>
                      <select
                        id="businessType"
                        name="businessType"
                        value={businessType}
                        onChange={(e) => setBusinessType(e.target.value)}
                      >
                        <option value="Growing Business">Growing Business</option>
                        <option value="CPA Firm">CPA Firm</option>
                        <option value="SME">Small &amp; Medium Enterprise (SME)</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="serviceInterest">Service Needed</label>
                      <select
                        id="serviceInterest"
                        name="serviceInterest"
                        value={serviceInterest}
                        onChange={(e) => setServiceInterest(e.target.value)}
                      >
                        <option value="Monthly Bookkeeping on QuickBooks">Monthly Bookkeeping on QuickBooks</option>
                        <option value="Monthly Bookkeeping on Excel">Monthly Bookkeeping on Excel</option>
                        <option value="Financial Statement Preparation">Financial Statement Preparation</option>
                        <option value="Auditing & Assurance Assistance">Auditing &amp; Assurance Assistance</option>
                        <option value="Financial Modelling & Analysis">Financial Modelling &amp; Analysis</option>
                        <option value="Accounting & Consulting Services">Accounting &amp; Consulting Services</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="clientMessage">Project Details / Transaction Volume *</label>
                    <textarea
                      id="clientMessage"
                      name="clientMessage"
                      rows={4}
                      placeholder="Tell us about your monthly transactions, VAT status, or financial statement needs..."
                      required
                      value={clientMessage}
                      onChange={(e) => setClientMessage(e.target.value)}
                    ></textarea>
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="btn btn-primary btn-block">Send Inquiry via Email</button>
                    <button
                      type="button"
                      id="sendFormWhatsApp"
                      className="btn btn-whatsapp btn-block"
                      onClick={handleSendFormWhatsApp}
                    >
                      Send via WhatsApp
                    </button>
                  </div>

                  <div id="formFeedback" className="form-feedback" role="status" aria-live="polite">
                    {formFeedback}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="site-footer">
        <div className="container">
          <div className="footer-top">
            <div className="footer-brand">
              <img src="/assets/logo-white.svg" alt="Tix Consultants" width={230} height={50} />
              <p>Professional Accounting &amp; Bookkeeping Support. Reliable. Cost-Effective. Globally Focused.</p>
            </div>

            <div className="footer-links">
              <h4>Services</h4>
              <ul>
                <li><a href="#services">Financial Statement Preparation</a></li>
                <li><a href="#services">QuickBooks &amp; Excel Bookkeeping</a></li>
                <li><a href="#services">Auditing &amp; Assurance Assistance</a></li>
                <li><a href="#services">Financial Modelling &amp; Analysis</a></li>
              </ul>
            </div>

            <div className="footer-links">
              <h4>Quick Links</h4>
              <ul>
                <li><a href="#why-us">Why Choose Us</a></li>
                <li><a href="#pricing">Pricing (US$)</a></li>
                <li><a href="#calculator">Cost Estimator</a></li>
                <li><a href="#contact">Get in Touch</a></li>
              </ul>
            </div>

            <div className="footer-links">
              <h4>Connect</h4>
              <ul>
                <li><a href="mailto:tixconsultants@outlook.com">tixconsultants@outlook.com</a></li>
                <li><a href="https://wa.me/923246800722" target="_blank" rel="noopener noreferrer">+92 324 6800722</a></li>
                <li><span>Tix Consultants</span></li>
              </ul>
            </div>
          </div>

          <div className="footer-slogan">
            <span></span>
            <p>YOUR GROWTH. OUR COMMITMENT.</p>
            <span></span>
          </div>

          <div className="footer-bottom">
            <p>&copy; <span id="currentYear">{currentYear}</span> Tix Consultants. All rights reserved. Professional Accounting Services Since 2024.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
