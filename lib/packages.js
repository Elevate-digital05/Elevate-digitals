// The four website packages, once. build.mjs bakes these into index.html at
// build time — into the package cards and into the payment calculator — so a
// crawler sees the feature lists in the HTML source rather than only after
// JavaScript runs. They used to be written out by hand in both places and had
// drifted far enough to promise clients an account manager that does not exist.
//
// A feature is a string, or [label, 'new'] to carry the "New" badge.
// `summary` is the one-line description the calculator shows above the chips.

export const PACKAGES = {
  Starter: {
    summary: '3–5 pages · Custom branding · Contact form · Basic SEO · WhatsApp',
    features: [
      '3–5 pages',
      'Custom brand colours & typography',
      'Mobile-responsive design',
      'WhatsApp chat integration',
      'Professional contact form',
      ['Google Business Profile setup', 'new'],
      'Basic on-page SEO',
      '1 round of revisions',
    ],
  },
  Business: {
    summary: '6–8 pages · Full on-page SEO · Copywriting for 3 pages · Maps & Analytics',
    features: [
      'Everything in Starter',
      '6–8 pages',
      ['Copywriting for 3 pages', 'new'],
      'Full on-page SEO',
      'Google Maps + Analytics',
      ['Speed & Core Web Vitals optimisation', 'new'],
      'Priority support: same-day reply on weekdays',
      '2 rounds of revisions',
    ],
  },
  Pro: {
    summary: 'Up to 12 pages · E-commerce or booking · Payment gateway · Full copywriting',
    features: [
      'Everything in Business',
      'Up to 12 pages',
      'E-commerce or booking system',
      ['Payment gateway setup', 'new'],
      ['Full copywriting', 'new'],
      'Blog setup + training',
      'Direct access to the people doing the work',
      '3 rounds of revisions',
    ],
  },
  Premium: {
    summary: 'Discovery workshop · Unlimited pages · Custom functionality & API integrations · Priority support',
    features: [
      ['Discovery & strategy workshop', 'new'],
      'Unlimited pages',
      'Custom functionality / API integrations',
      'Full SEO dominance strategy',
      'Direct line to the founder throughout',
      'Priority support, replies within 24h on weekdays',
    ],
  },
};
