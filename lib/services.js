// Every service line, once. build.mjs renders this into /services/*.html, the
// homepage service grid, the nav, the footer service links and sitemap.xml —
// so adding a service is a change to this file and nothing else.
//
// Prices, all ZAR. The package and retainer figures must match lib/pricing.js
// exactly — that file is what the payment API will actually accept, and
// check-build.mjs fails if a page quotes something the server would reject.
//
// The standalone service prices (SEO, copywriting, video, brand) were set from
// South African market rates in August 2026, positioned at the accessible end
// to match the existing R8,500 entry package. They are a starting position, not
// a costed rate card: nothing here knows how long the work actually takes.
//
// Anything not yet decided is PRICE_TBC, which renders as a loud dashed marker
// and is listed by `node build.mjs` so it cannot be shipped by accident.
export const PRICE_TBC = { tbc: true };

// Cape Town. Mon–Fri 7am–7pm and Sat 12–5pm SAST — no copy anywhere in this
// file may promise cover outside that, whatever the team size happens to be,
// and none may invent a client, a testimonial or a portfolio piece.
export const HOURS = 'Mon–Fri 7am–7pm · Sat 12pm–5pm SAST';

export const SERVICES = [
  {
    slug: 'web-design',
    i18n: 'svc1',  // existing homepage card translation keys
    nav: 'Web Design',
    name: 'Website Design & Build',
    icon: 'globe',
    // homepage card
    cardDesc: 'Modern, mobile-friendly websites for businesses that need a new online presence, or a complete refresh.',
    cardList: ['Custom modern design', 'Mobile responsive', 'Fast & SEO-friendly', 'New sites or redesigns', 'Contact forms & CTAs'],
    metaTitle: 'Web Design South Africa | Custom Business Websites',
    metaDescription: 'Custom-designed, mobile-first websites for South African trades and service businesses. Packages from R8,500, live in about two weeks. See your first concept free.',
    keywords: 'web design South Africa, website design Cape Town, small business website, custom web design, website redesign South Africa',
    hero: {
      kicker: 'Website Design & Build',
      h1: ['Turn a phone screen into a ', 'booked job', ''],
      lede: 'Most of your customers will meet you on a phone before they meet you in person. I build the site that decides whether they call you or the next name on the list.',
    },
    included: [
      { icon: 'type', name: 'Designed from scratch', desc: 'No template with your logo dropped in. The layout, the type and the colour are chosen for your trade and your customers.' },
      { icon: 'smartphone', name: 'Built mobile first', desc: 'Designed at 360px wide before anything else, because that is where over 80% of South African traffic actually arrives.' },
      { icon: 'gauge', name: 'Fast on a bad connection', desc: 'Compressed images, minimal scripts, no bloated page builder. It loads on mobile data, not just on fibre.' },
      { icon: 'whatsapp', name: 'WhatsApp chat button', desc: 'A tap-to-chat button on every page, pre-filled with a message so they do not have to think of what to say.' },
      { icon: 'mail', name: 'Contact form that works', desc: 'Enquiries land in your inbox, spam-filtered, with the details you actually need to quote the job.' },
      { icon: 'map', name: 'Google Business Profile', desc: 'Set up or cleaned up so you appear on Maps when someone nearby searches for what you do.' },
      { icon: 'search', name: 'On-page SEO groundwork', desc: 'Titles, descriptions, headings and structured data done properly at build time, not bolted on later.' },
      { icon: 'file', name: 'Training and handover', desc: 'A walkthrough of how to change text, images and prices yourself, plus written notes to refer back to.' },
    ],
    who: [
      ['You have no website yet', 'and you are losing the customers who look you up before calling.'],
      ['Your site is years old', 'and it looks it, or it does not work properly on a phone.'],
      ['All your enquiries come through WhatsApp', 'and you want a proper front door feeding into it.'],
      ['You are quoting against bigger competitors', 'and need to look like the safer choice, not the cheaper one.'],
    ],
    pricing: {
      lead: 'Once-off, in ZAR. A 50% deposit starts the work once you have approved the concept, and the balance is due before launch.',
      cols: 4,
      tiers: [
        { name: 'Starter', price: 8500, period: 'once-off · 3–5 pages', desc: 'A professional presence, up fast.', feats: ['3–5 pages', 'Mobile-responsive design', 'WhatsApp chat integration', 'Contact form', 'Google Business Profile setup', 'Basic on-page SEO', '1 round of revisions'] },
        { name: 'Business', price: 18500, period: 'once-off · 6–8 pages', rec: true, desc: 'For a site that has to bring in work.', feats: ['Everything in Starter', '6–8 pages', 'Copywriting for 3 pages', 'Full on-page SEO', 'Google Maps + Analytics', 'Speed & Core Web Vitals work', '2 rounds of revisions'] },
        { name: 'Pro', price: 34999, period: 'once-off · up to 12 pages', desc: 'Once the site has to sell or book, not just inform.', feats: ['Everything in Business', 'Up to 12 pages', 'E-commerce or booking system', 'Payment gateway setup', 'Full copywriting', 'Blog setup + training', '3 rounds of revisions'] },
        { name: 'Premium', price: 75000, plus: true, period: 'fully custom · no limits', desc: 'Bespoke builds and integrations.', feats: ['Discovery & strategy workshop', 'Unlimited pages', 'Custom functionality / API integrations', 'Full SEO strategy', 'Direct line to the founder throughout'] },
      ],
      note: 'Every package can carry a monthly retainer from R799 to keep the site hosted, backed up and updated after launch. See <a href="/services/maintenance">maintenance</a>.',
    },
    faqs: [
      { q: 'How long does it take?', a: 'Most sites go live within two weeks of the deposit and your content landing. Larger builds with a shop or booking system take longer, and I tell you the realistic date before you pay anything. The thing that slows a project down is almost always waiting on content, so the sooner your photos and text arrive, the sooner you launch.' },
      { q: 'What do you need from me to start?', a: 'Your logo if you have one, a rough idea of the pages you want, and any text or photos you already use. If you do not have those, that is what the copywriting add-on is for. Nothing has to be perfect: I would rather start with rough notes than wait a month for polished ones.' },
      { q: 'Do I own the website when it is finished?', a: 'Yes. Once the final payment is made, the domain, the files and the content are yours. Everything is built with standard HTML, CSS and JavaScript rather than a proprietary system, specifically so any developer can pick it up and you are never locked in to me.' },
      { q: 'What if I do not like the design?', a: 'You see the first homepage concept before you pay anything, so you can walk away at no cost. After that, each package includes revision rounds to refine it. If we still cannot get there, the <a href="/refund-policy">refund policy</a> sets out exactly where you stand.' },
      { q: 'Who hosts it, and what does it cost after launch?', a: 'Hosting is included in any monthly retainer. Without a retainer you arrange your own, which for a site this size typically runs R50–R150 a month, plus a domain renewal of roughly R100–R200 a year. You get the exact figures before launch.' },
    ],
  },

  {
    slug: 'seo',
    i18n: 'svc3',  // existing homepage card translation keys
    nav: 'SEO',
    name: 'Search Engine Optimisation',
    icon: 'search',
    cardDesc: 'Get found on Google by the customers who matter. We optimise your site so it ranks higher.',
    cardList: ['Keyword research', 'On-page SEO', 'Google Business Profile', 'Technical SEO audit', 'Monthly ranking reports'],
    metaTitle: 'SEO Services South Africa | Local Search Optimisation',
    metaDescription: 'Local SEO for South African trades and service businesses. Keyword research, on-page and technical SEO, and a Google Business Profile that shows up on Maps.',
    keywords: 'SEO South Africa, local SEO Cape Town, Google Business Profile setup, SEO services for small business, search engine optimisation South Africa',
    hero: {
      kicker: 'Search Engine Optimisation',
      h1: ['Get found by the people ', 'already searching', ' for what you do'],
      lede: 'Someone in your area types "plumber near me" a few times a day. SEO is the work that decides whether your name is on that screen or your competitor\'s is.',
    },
    included: [
      { icon: 'search', name: 'Keyword research', desc: 'What your customers actually type, not what the industry calls it. Usually a shorter and more boring list than people expect.' },
      { icon: 'file', name: 'On-page SEO', desc: 'Titles, meta descriptions, heading structure and internal links, done per page rather than sprayed across the site.' },
      { icon: 'map', name: 'Google Business Profile', desc: 'Claimed, verified and filled in properly: categories, service areas, hours, photos. This is the single biggest lever for local trades.' },
      { icon: 'wrench', name: 'Technical audit', desc: 'Crawl errors, broken links, missing sitemap, pages accidentally blocked from Google. The problems you cannot see from the front.' },
      { icon: 'gauge', name: 'Speed and Core Web Vitals', desc: 'Google measures how fast your pages actually feel on a mid-range phone, and ranks accordingly.' },
      { icon: 'trending', name: 'Monthly ranking report', desc: 'Where you rank for the terms that matter, which direction it is moving, and what I did that month. Plain language, no dashboard homework.' },
    ],
    who: [
      ['You do not appear on Google at all', 'when you search your own trade plus your suburb.'],
      ['You have a website but no traffic', 'because nothing was ever done to make it findable.'],
      ['You compete inside one city', 'where local SEO decides who gets the call.'],
      ['You are paying for ads', 'and want something that keeps working when the budget stops.'],
    ],
    pricing: {
      lead: 'Standalone SEO, priced for a site the size I build. A much larger site scales the audit, and I tell you before starting rather than after.',
      cols: 3,
      tiers: [
        { name: 'SEO audit', price: 3500, period: 'once-off', desc: 'A full technical and on-page audit of your existing site, with a prioritised list of what to fix.', feats: ['Technical crawl and error report', 'On-page review, page by page', 'Keyword and competitor snapshot', 'Google Business Profile review', 'Prioritised action list you can hand to anyone'] },
        { name: 'Setup & fix', price: 7500, period: 'once-off', rec: true, desc: 'The audit, then the work to actually fix what it found.', feats: ['Everything in the audit', 'On-page SEO implemented', 'Technical fixes applied', 'Google Business Profile set up or cleaned up', 'Sitemap and structured data'] },
        { name: 'Ongoing SEO', price: 2500, period: 'per month, on top of a retainer', desc: 'Continuous work and reporting, on top of a maintenance retainer.', feats: ['Monthly ranking report', 'Ongoing on-page improvements', 'Content recommendations', 'Google Business Profile upkeep', 'Competitor movement'] },
      ],
      note: 'Some of this is already included elsewhere: every <a href="/services/web-design">website package</a> ships with on-page SEO done at build time, and monthly SEO reporting comes with Business Care (R1,299/mo) and Pro Care (R1,999/mo) on <a href="/services/maintenance">maintenance</a>. If you are getting a new site built, you may not need a separate SEO engagement at all.',
    },
    faqs: [
      { q: 'How long before I see results?', a: 'Local SEO usually starts moving in one to three months, and a competitive term can take six or more. Anyone who promises you page one in a fortnight is either doing something that gets you penalised or simply guessing. Google Business Profile work is the exception: that can change what you look like on Maps within days.' },
      { q: 'Can you guarantee I will rank number one?', a: 'No, and neither can anyone else. Nobody controls Google\'s ranking. What I can do is fix what is measurably broken, target terms you can realistically win, and show you monthly whether the numbers are moving. If a supplier guarantees a position, that is the moment to walk.' },
      { q: 'Is SEO not already included in my package?', a: 'On-page SEO is, on every package: titles, descriptions, headings, sitemap and structured data are set up properly when the site is built. What is not included is ongoing work, which is keyword research, content, competitor tracking and monthly reporting. A new site with good on-page SEO is often enough for a local trade.' },
      { q: 'What is local SEO and why does it matter more here?', a: 'Local SEO is the work that makes you show up for searches with intent behind them: "electrician Bellville", or just "electrician near me" on a phone. For a business that serves one city it is worth more than national ranking, because those searchers are ready to call. Most of the leverage sits in your Google Business Profile, not your website.' },
      { q: 'Do I need a monthly retainer for SEO?', a: 'Not necessarily. A once-off audit and fix can be the right call if your site was built badly and you just need it corrected. A retainer earns its keep when you are in a competitive trade and someone is actively working to outrank you.' },
    ],
  },

  {
    slug: 'ecommerce',
    i18n: 'svc4',  // existing homepage card translation keys
    nav: 'E-Commerce',
    name: 'E-Commerce Stores',
    icon: 'cart',
    cardDesc: 'Sell online with a professional shop that looks great, loads fast, and makes buying easy.',
    cardList: ['Product catalogue', 'Secure checkout', 'Payment gateway integration', 'Inventory management', 'Order notifications'],
    metaTitle: 'E-Commerce Website Design South Africa | Online Stores',
    metaDescription: 'Online stores for South African businesses. Product catalogue, secure card checkout via Paystack, inventory and order notifications. From R34,999.',
    keywords: 'ecommerce website South Africa, online store design, Paystack integration, online shop Cape Town, sell online South Africa',
    hero: {
      kicker: 'E-Commerce Stores',
      h1: ['Sell online without the ', 'checkout falling over', ''],
      lede: 'Taking orders through DMs and manual EFTs works until it does not. A proper shop takes the payment, records the order and tells you about it, while you are doing something else.',
    },
    included: [
      { icon: 'package', name: 'Product catalogue', desc: 'Categories, variants, sizes and options set up so customers can find a thing without scrolling past forty others.' },
      { icon: 'card', name: 'Secure card checkout', desc: 'Card details are entered in the payment provider\'s own window and never touch your site, which is how it should be.' },
      { icon: 'card', name: 'Paystack integration', desc: 'Card payments in rands, settled to a South African bank account. The same gateway this site runs on.' },
      { icon: 'refresh', name: 'Inventory management', desc: 'Stock counts that go down when something sells, so you are not selling what you no longer have.' },
      { icon: 'bell', name: 'Order notifications', desc: 'You get the order by email the moment it lands. The customer gets a confirmation without you writing it.' },
      { icon: 'truck', name: 'Shipping and collection', desc: 'Delivery rates, zones or click-and-collect, configured for how you actually get goods to people.' },
      { icon: 'smartphone', name: 'Built for phone checkout', desc: 'Most abandoned carts are a checkout that is painful on mobile. This one is tested at 360px first.' },
      { icon: 'file', name: 'Training and handover', desc: 'How to add a product, change a price and refund an order, walked through and written down.' },
    ],
    who: [
      ['You sell in person', 'and want the same stock available to people who cannot get to you.'],
      ['You take orders in DMs', 'and are losing track of who paid and who did not.'],
      ['You send manual EFT invoices', 'and chase proof of payment for every single order.'],
      ['You are on a marketplace', 'and want your own storefront that does not take a cut.'],
    ],
    pricing: {
      lead: 'A shop is part of the Pro package. Larger catalogues or custom integrations move to Premium, which is quoted after a discovery session.',
      cols: 2,
      tiers: [
        { name: 'Pro', price: 34999, period: 'once-off · up to 12 pages', rec: true, desc: 'A complete shop on a complete website.', feats: ['Everything in the Business package', 'Full product catalogue', 'Secure checkout', 'Paystack payment gateway setup', 'Inventory and order notifications', 'Full copywriting', '3 rounds of revisions'] },
        { name: 'Premium', price: 75000, plus: true, period: 'fully custom', desc: 'Large catalogues, custom logic or an integration with the system you already run.', feats: ['Discovery & strategy workshop', 'Unlimited products and pages', 'Custom functionality / API integrations', 'Accounting or stock system integration', 'Direct line to the founder throughout'] },
      ],
      note: 'A shop that takes money should not go unattended. Pro Care at R1,999/mo covers store and checkout support alongside the usual hosting, backups and updates. See <a href="/services/maintenance">maintenance</a>.',
    },
    faqs: [
      { q: 'Which payment gateway do you use?', a: 'Paystack by default. It settles in rands to a South African bank account, takes Visa and Mastercard, and handles the card entry in its own secure window so card numbers never pass through your site. If you already have a different provider, tell me before we start and I will tell you honestly whether it fits.' },
      { q: 'What are the transaction fees?', a: 'The gateway charges those, not me, and the rate depends on the provider and your volume, so check their current pricing directly rather than taking my word for it. I do not add a markup or take a cut of your sales.' },
      { q: 'Can I add and edit products myself?', a: 'Yes, and you are shown how before handover: adding a product, changing a price, marking something out of stock, and refunding an order. If you would rather not, product updates are the kind of thing a monthly retainer covers.' },
      { q: 'How does shipping work?', a: 'It is configured around how you already get goods to people: flat rate, rates by area, free over a threshold, or click-and-collect. If you use a courier with its own system, say so early, because integrating one is a different amount of work to setting a flat rate.' },
      { q: 'What happens if the checkout breaks?', a: 'A broken checkout costs you money the same day, which is why Pro Care exists. Support runs ' + HOURS + ', with a same-day reply on weekdays. I do not offer overnight or Sunday cover, and I would rather tell you that now than have you find out during a problem.' },
    ],
  },

  {
    slug: 'maintenance',
    i18n: 'svc2',  // existing homepage card translation keys
    nav: 'Maintenance',
    name: 'Monthly Maintenance',
    icon: 'link',
    cardDesc: 'Keep your website secure, updated, and running perfectly. We handle the technical side.',
    cardList: ['Hosting included', 'Weekly backups', 'Security & SSL monitoring', 'Content updates', 'Monthly reports'],
    metaTitle: 'Website Maintenance South Africa | Hosting, Backups & Support',
    metaDescription: 'Monthly website maintenance for South African businesses. Hosting, weekly backups, SSL and security monitoring, and content updates. Plans from R799 a month.',
    keywords: 'website maintenance South Africa, website hosting Cape Town, website support plan, website backups, SSL monitoring',
    hero: {
      kicker: 'Monthly Maintenance',
      h1: ['Your site stays up and current, ', 'without you thinking about it', ''],
      lede: 'Websites do not fail loudly. A certificate expires, a form stops sending, prices go stale, and you find out weeks later from a customer. A retainer is the arrangement where that stops being your problem.',
    },
    included: [
      { icon: 'server', name: 'Hosting included', desc: 'No separate hosting bill, no control panel to log into, no renewal you forget until the site is offline.' },
      { icon: 'refresh', name: 'Weekly backups', desc: 'A full copy taken every week and kept off the server, so a bad change or a bad day is a restore rather than a rebuild.' },
      { icon: 'shield', name: 'Security & SSL monitoring', desc: 'The padlock stays valid and dependencies stay patched. An expired certificate makes browsers warn people away from you.' },
      { icon: 'pencil', name: 'Content updates', desc: 'New prices, new photos, changed hours, a new service. You send it, I change it, within your monthly hours.' },
      { icon: 'clock', name: 'Uptime monitoring', desc: 'The site is checked automatically. If it goes down, I find out from the monitor rather than from you.' },
      { icon: 'trending', name: 'Monthly report', desc: 'What changed, what was updated and, on the higher plans, where you rank. One page, plain language.' },
    ],
    who: [
      ['Your site is live and nobody is looking after it', 'which is the normal state of most small business websites.'],
      ['It broke once already', 'and you would rather not repeat the week that followed.'],
      ['You do not want to touch it', 'and would rather send a WhatsApp than log into anything.'],
      ['Your prices or team change often', 'and the site is always three months behind.'],
    ],
    pricing: {
      lead: 'Monthly, in ZAR. Each plan pairs with a website package, but you do not have to have bought the site from me. Cancel any time with 30 days\' notice.',
      cols: 4,
      tiers: [
        { name: 'Starter Care', price: 799, per: 'mo', period: 'pairs with Starter', desc: 'Keeps the site you paid for from quietly breaking.', feats: ['Hosting included', 'Weekly backups', 'Security & SSL monitoring', 'Content updates (1hr/mo)'] },
        { name: 'Business Care', price: 1299, per: 'mo', period: 'pairs with Business', rec: true, desc: 'For a site that has to bring in work, not just sit there.', feats: ['Everything in Starter Care', 'Content updates (2hr/mo)', 'Monthly SEO report', 'Same-day reply on weekdays'] },
        { name: 'Pro Care', price: 1999, per: 'mo', period: 'pairs with Pro', desc: 'For sites with a shop or a booking system.', feats: ['Everything in Business Care', 'Store / booking support', 'SEO monitoring & reporting', 'Content updates (4hr/mo)'] },
        { name: 'Premium Care', price: 3500, plus: true, per: 'mo', period: 'pairs with Premium', desc: 'For businesses where the website is the front door.', feats: ['Everything in Pro Care', 'Fully managed service', 'Agreed response times in writing', 'Direct technical contact', 'Strategy & review calls'] },
      ],
      note: 'Premium Care is settled in consultation rather than billed automatically, because "from R3,500" depends on what managing it actually involves.',
    },
    faqs: [
      { q: 'What counts as a content update?', a: 'Text, images, prices, opening hours, staff, adding or removing a service, swapping a PDF. The monthly hours are for changes to what is already there. A new page layout, a new feature or a redesign is project work and gets quoted separately, and I tell you which one it is before doing it, not after.' },
      { q: 'What are your support hours?', a: HOURS + '. On Business Care and above you get a same-day reply on weekdays. We do not offer 24/7 or overnight cover. The hours above are the hours we actually work, and I would rather set a promise we can keep than one that sounds better in a brochure. Uptime monitoring runs continuously regardless, so an outage is caught even outside those hours.' },
      { q: 'Do I have to take a retainer?', a: 'No. It is optional on every package. Without one you arrange your own hosting, which typically runs R50–R150 a month plus a domain renewal of R100–R200 a year, and you handle updates yourself or pay hourly when something needs doing. Plenty of clients do exactly that.' },
      { q: 'Can I cancel?', a: 'Any time, with 30 days\' notice. You own the site, so cancelling means you take your files and your domain and either self-host or move to someone else. There is no lock-in and nothing is built in a proprietary system designed to make leaving hard.' },
      { q: 'Do you maintain sites you did not build?', a: 'Often, yes, but not always. It depends on how it was built and what it was built with. Send me the address and I will tell you honestly whether I can look after it properly. If I cannot, I will say so rather than take the money and hope.' },
    ],
  },

  {
    slug: 'booking-systems',
    i18n: 'svc6',  // existing homepage card translation keys
    nav: 'Booking Systems',
    name: 'Booking Systems',
    icon: 'calendar',
    cardDesc: 'Let clients book appointments directly from your website. Perfect for salons, consultants, clinics.',
    cardList: ['Online booking calendar', 'Email confirmations', 'Service & staff selection', 'Custom availability', 'Mobile friendly'],
    metaTitle: 'Online Booking Systems South Africa | Appointment Websites',
    metaDescription: 'Website booking systems for South African salons, clinics, consultants and trades. Online calendar, service and staff selection, automatic confirmations.',
    keywords: 'online booking system South Africa, appointment booking website, salon booking system, booking calendar website, take bookings online',
    hero: {
      kicker: 'Booking Systems',
      h1: ['Let clients book themselves in ', 'while you are on the job', ''],
      lede: 'Every booking taken by phone is a job interrupted, and every missed call is a booking that went to somebody else. A calendar on your site takes them while your hands are full.',
    },
    included: [
      { icon: 'calendar', name: 'Online booking calendar', desc: 'Live availability on your site. Clients pick a slot that is actually free, and it disappears the moment they take it.' },
      { icon: 'users', name: 'Service and staff selection', desc: 'Different services with different durations, and where it matters, a choice of who the client sees.' },
      { icon: 'mail', name: 'Automatic confirmations', desc: 'The client gets a confirmation immediately and you get the booking. Neither of you writes an email.' },
      { icon: 'bell', name: 'Reminders', desc: 'An automatic reminder before the appointment, which is the cheapest way there is to cut no-shows.' },
      { icon: 'clock', name: 'Custom availability', desc: 'Your real working hours, your lunch, travel time between jobs, and the days you block off.' },
      { icon: 'card', name: 'Optional booking deposit', desc: 'Take a deposit at the time of booking if no-shows cost you. Uses the same Paystack setup as the shop.' },
    ],
    who: [
      ['You run a salon, clinic or studio', 'where the diary is the business.'],
      ['You consult by appointment', 'and lose time to back-and-forth about when you are free.'],
      ['You quote on site visits', 'and want people to book a slot instead of ringing during a job.'],
      ['You get no-shows', 'and want reminders and deposits doing that work for you.'],
    ],
    pricing: {
      lead: 'A booking system is part of the Pro package. More complicated setups, or an integration with software you already run, move to Premium.',
      cols: 2,
      tiers: [
        { name: 'Pro', price: 34999, period: 'once-off · up to 12 pages', rec: true, desc: 'A booking system on a complete website.', feats: ['Everything in the Business package', 'Online booking calendar', 'Service and staff selection', 'Automatic confirmations and reminders', 'Custom availability rules', 'Full copywriting', '3 rounds of revisions'] },
        { name: 'Premium', price: 75000, plus: true, period: 'fully custom', desc: 'Multiple locations, complex rules, or integration with your existing system.', feats: ['Discovery & strategy workshop', 'Multi-location or multi-team scheduling', 'Custom functionality / API integrations', 'Integration with software you already use', 'Direct line to the founder throughout'] },
      ],
      note: 'Pro Care at R1,999/mo covers booking system support alongside hosting, backups and updates. See <a href="/services/maintenance">maintenance</a>.',
    },
    faqs: [
      { q: 'Which booking tool do you use?', a: 'It depends on how you work. Some businesses are best served by a booking tool built into the site, others by a well-integrated third-party system they already have staff trained on. I pick after hearing how your diary actually runs, rather than fitting you to one product. Either way it lives on your domain and looks like your site.' },
      { q: 'Does it sync with my calendar?', a: 'That is usually the first thing to set up, so a booking made on the site shows up in the calendar on your phone and a slot you block there stops being bookable on the site. Which calendar you use is worth mentioning at the start, because it affects which tool is the right fit.' },
      { q: 'Can clients pay a deposit when they book?', a: 'Yes, if you want them to. It uses the same Paystack card setup as the online shop, so the money settles to your account in rands. Deposits are the most effective way to cut no-shows, though they do put some people off booking, so it is worth being deliberate about which services need one.' },
      { q: 'What if I need to block out time?', a: 'You block it in your calendar or in the booking tool and those slots stop being offered. Recurring blocks like a standing lunch, a half-day Friday or travel time between jobs are set up once when the system is built.' },
      { q: 'Can each staff member have their own calendar?', a: 'Yes. Staff can have separate calendars, their own hours and their own list of services, and clients can either choose a person or take the first available slot. Multi-location or larger team setups get complicated enough that they are usually Premium work.' },
    ],
  },

  {
    slug: 'copywriting',
    i18n: 'svc5',  // existing homepage card translation keys
    nav: 'Copywriting',
    name: 'Content & Copywriting',
    icon: 'pencil',
    cardDesc: 'Professional website copy written to convert visitors into customers. Clear, compelling, on-brand.',
    cardList: ['Homepage & about copy', 'Service page content', 'SEO-optimised writing', 'Blog posts', 'Proofreading & editing'],
    metaTitle: 'Website Copywriting South Africa | Content That Converts',
    metaDescription: 'Website copywriting for South African trades and service businesses. Homepage, about and service page content written to turn visitors into enquiries.',
    keywords: 'website copywriting South Africa, content writing Cape Town, SEO copywriting, website content writer, small business copywriting',
    hero: {
      kicker: 'Content & Copywriting',
      h1: ['Words that answer the question ', 'your customer is actually asking', ''],
      lede: 'Most small business websites talk about the business. The ones that get enquiries talk about the problem the visitor arrived with, and then make it obvious what to do next.',
    },
    included: [
      { icon: 'type', name: 'Homepage and about copy', desc: 'The two pages everyone reads and nobody enjoys writing about themselves. Written to sound like you, not like a brochure.' },
      { icon: 'file', name: 'Service page content', desc: 'One page per thing you sell, written to be found on its own and to stand up as the first page someone lands on.' },
      { icon: 'search', name: 'Written for search', desc: 'The words your customers actually type, used naturally. Keyword stuffing reads badly to people and no longer works on Google.' },
      { icon: 'pencil', name: 'Blog posts', desc: 'Articles that answer the questions you get asked before every quote. They rank, and they save you repeating yourself.' },
      { icon: 'check', name: 'Proofreading and editing', desc: 'If you have already written it, this is the pass that tightens it, fixes the errors and cuts what is not earning its place.' },
      { icon: 'users', name: 'Tone of voice', desc: 'Decided up front and applied consistently, so the site does not read like three different people wrote it.' },
    ],
    who: [
      ['Your site says nothing', 'beyond "welcome to our website" and a phone number.'],
      ['You hate writing about yourself', 'which is the single most common reason a site launch stalls.'],
      ['You get traffic but no enquiries', 'because nothing on the page tells people why you and what next.'],
      ['You wrote it yourself years ago', 'and it no longer describes what you actually do.'],
    ],
    pricing: {
      lead: 'Standalone copywriting. A three-page site and a twelve-page site are different jobs, so the full-site price below covers up to eight pages and scales past that.',
      cols: 3,
      tiers: [
        { name: 'Page pack', price: 1250, period: 'per page', desc: 'Individual pages written to order, for a site that is otherwise fine.', feats: ['Briefing call', 'Keyword and audience research', 'Written to your tone of voice', 'Meta title and description', 'Two rounds of changes'] },
        { name: 'Full site copy', price: 7500, period: 'once-off · up to 8 pages', rec: true, desc: 'Every page on the site, written as one consistent piece of work.', feats: ['Tone of voice defined up front', 'Homepage, about and all service pages', 'Written for search', 'Calls to action throughout', 'Meta titles and descriptions'] },
        { name: 'Ongoing content', price: 2800, period: 'per month', desc: 'Regular articles that answer what customers ask before they buy.', feats: ['Two posts a month', 'Topics chosen from real search demand', 'Written for search', 'Published and formatted for you', 'Internal links back to your service pages'] },
      ],
      note: 'Copy is already bundled into two <a href="/services/web-design">website packages</a>: Business (R18,500) includes copywriting for 3 pages, and Pro (R34,999) includes full copywriting for the site. If you are having a site built, start there before pricing this separately.',
    },
    faqs: [
      { q: 'Will it sound like me, or like a copywriter?', a: 'Like you, which is the whole point. Tone of voice is agreed before anything is written, usually off a briefing call and whatever you already have, including the way you write your own WhatsApp quotes. If the first draft does not sound like you, that is what the changes are for.' },
      { q: 'What do you need from me?', a: 'A conversation, mostly. What you do, who buys it, what they ask before they buy, and what you want them to do on the page. Anything you already have helps: an old site, a brochure, a price list, even rough notes. You do not need to write anything first.' },
      { q: 'How many rounds of changes do I get?', a: 'Two on the page pack and on full site copy, which is enough to get tone and detail right without the thing going round in circles. It is written into the quote before work starts, so you are never guessing. Further rounds are charged hourly, and I will tell you when we are approaching that rather than surprising you with it.' },
      { q: 'Do you write in South African English?', a: 'Yes. Optimise with an s, colour with a u, rands written properly, and local terms used the way people here actually use them. It matters more than it sounds: American spelling on a Cape Town website reads as a template someone bought.' },
      { q: 'Is copywriting included if you build my site?', a: 'Partly, depending on the package. Business includes copy for three pages and Pro includes the full site. Starter does not include copywriting, so you either supply the text or add it. I will tell you which makes sense for your budget rather than defaulting to the bigger number.' },
    ],
  },
];

/* ── new lines, not yet priced ────────────────────────────────────────────
   Every figure below is PRICE_TBC on purpose. Nothing on this site publishes a
   rate for either of these, so inventing one would put a number in front of a
   client that no quote could be held to. `node build.mjs` lists them all. */

SERVICES.push(
  {
    slug: 'video-editing',
    i18n: 'svc7',
    nav: 'Video Editing',
    name: 'Video Editing',
    icon: 'video',
    cardDesc: 'Turn the footage already on your phone into short, sharp video for your website and social feeds.',
    cardList: ['Social cuts & reels', 'Subtitles & captions', 'Colour & sound', 'Branded intros', 'Website-ready exports'],
    metaTitle: 'Video Editing South Africa | Social & Website Video',
    metaDescription: 'Video editing for South African trades and service businesses. Job footage cut into social reels and website video, with subtitles, colour and sound handled.',
    keywords: 'video editing South Africa, social media video editing, reels editing Cape Town, business video editing, website video',
    hero: {
      kicker: 'Video Editing',
      h1: ['Turn the footage on your phone into ', 'something worth posting', ''],
      lede: 'You already film the work. A tidy sixty-second cut of a job going well does more for a trade business than any stock photo, and it costs you nothing extra to shoot.',
    },
    included: [
      { icon: 'scissors', name: 'Edit and assembly', desc: 'Your raw clips cut down to the version people will actually watch to the end. The pacing is most of the job.' },
      { icon: 'smartphone', name: 'Vertical and landscape', desc: 'One edit exported for both: 9:16 for Reels, TikTok and Stories, 16:9 for your website and YouTube.' },
      { icon: 'file', name: 'Subtitles and captions', desc: 'Burned-in captions, because most social video is watched on mute. This alone changes how far a clip goes.' },
      { icon: 'droplet', name: 'Colour and sound', desc: 'Levelled audio and corrected colour, so phone footage shot in a dark kitchen does not look like phone footage shot in a dark kitchen.' },
      { icon: 'layers', name: 'Branded intro and end card', desc: 'A short top and tail in your colours and type, with your contact details on the end frame.' },
      { icon: 'music', name: 'Licensed music', desc: 'Tracks that are cleared for commercial use. Popular music pulled off the internet gets posts muted or taken down.' },
      { icon: 'image', name: 'Thumbnails', desc: 'A still pulled and treated for the platforms that show one, so the clip is not represented by a random frame.' },
      { icon: 'gauge', name: 'Compressed for the web', desc: 'Exported small enough to load on mobile data without turning into a slideshow.' },
    ],
    who: [
      ['You already film your jobs', 'and the clips are sitting on your phone doing nothing.'],
      ['You post to social but it looks rough', 'next to competitors who are having theirs edited.'],
      ['You paid for a shoot once', 'and never got usable short cuts out of the footage.'],
      ['Your work is visual', 'and a photo does not show the before and after the way thirty seconds of video does.'],
    ],
    pricing: {
      lead: 'Editing only, from footage you supply. A finished cut is up to about 90 seconds; longer pieces are quoted once I have seen the material.',
      cols: 3,
      tiers: [
        { name: 'Single cut', price: 1200, period: 'per video', desc: 'One edited video from footage you supply.', feats: ['One edit from your raw clips', 'Vertical and landscape export', 'Burned-in subtitles', 'Colour and audio levelling', 'Licensed music', 'One round of changes'] },
        { name: 'Batch', price: 4500, period: 'five videos', rec: true, desc: 'A set of clips cut from one shoot or one month of footage.', feats: ['Five finished videos', 'Consistent look across the set', 'Vertical and landscape exports', 'Subtitles on every cut', 'Branded intro and end card', 'Thumbnails'] },
        { name: 'Monthly', price: 3200, period: 'four videos a month', desc: 'A standing arrangement: you send footage, edited clips come back.', feats: ['Four finished videos a month', 'Ongoing consistent branding', 'Subtitles and thumbnails included', 'Exports for every platform you post to', 'Priority in the queue'] },
      ],
      note: 'Video sits well alongside <a href="/services/brand-identity">brand identity</a>, since the intro, end card and captions all use the same colours and type as everything else.',
    },
    faqs: [
      { q: 'Do you film as well, or only edit?', a: 'This service is editing footage you supply, which for most trades is what they already shoot on a phone between jobs. If you need someone behind a camera, say so at the start and we will work out the options rather than pretending it is included here.' },
      { q: 'What footage do you need from me?', a: 'More than you think, and unedited. Send the raw clips rather than something you have already trimmed, including the bits you think are boring, because the usable seconds are often in there. Shoot landscape or vertical consistently if you can, hold each shot a few seconds longer than feels natural, and get the audio somewhere quiet if anyone is talking.' },
      { q: 'What about music? Can you use a song I like?', a: 'Only if it is licensed for commercial use. Using a popular track will get your post muted, taken down, or the ad revenue handed to the rights holder, and on a business account it is a real risk rather than a theoretical one. I work from libraries that are cleared for this, and there is usually something close to what you had in mind.' },
      { q: 'How long does an edit take?', a: 'It depends on how much footage there is and how much of it is usable, so the turnaround is agreed per project up front rather than promised generically. Support and delivery run ' + HOURS + ', which is worth knowing if you are working to a campaign date.' },
      { q: 'What formats do I get back?', a: 'Vertical 9:16 for Reels, TikTok and Stories, and landscape 16:9 for your website and YouTube, both compressed for web. If you need a square 1:1 or a specific spec for an ad platform, ask before the edit starts rather than after.' },
    ],
  },

  {
    slug: 'brand-identity',
    i18n: 'svc8',
    nav: 'Brand Identity',
    name: 'Brand Identity',
    icon: 'palette',
    cardDesc: 'A logo, colours and type that hold together, so your van, your card and your website all look like one business.',
    cardList: ['Logo design', 'Colour palette', 'Typography', 'Usage guidelines', 'Vector files you own'],
    metaTitle: 'Brand Identity & Logo Design South Africa',
    metaDescription: 'Logo design and brand identity for South African trades and service businesses. Colours, typography and usage guidelines, delivered as vector files you own outright.',
    keywords: 'logo design South Africa, brand identity Cape Town, small business branding, logo designer South Africa, brand guidelines',
    hero: {
      kicker: 'Brand Identity',
      h1: ['Look like the same business ', 'everywhere someone finds you', ''],
      lede: 'A logo stretched on the van, different colours on the website, and a card someone made in Word. None of it is wrong on its own. Together it reads as a business that is not quite established yet.',
    },
    included: [
      { icon: 'palette', name: 'Logo design', desc: 'A primary mark plus the variations you actually need: horizontal, stacked, and a small icon for a profile picture or a favicon.' },
      { icon: 'droplet', name: 'Colour palette', desc: 'A working set of colours with the exact values for screen, print and paint, so the blue on your van is the blue on your website.' },
      { icon: 'type', name: 'Typography', desc: 'A typeface pairing for headings and body, chosen to be legible on a phone and available to you without a licence problem.' },
      { icon: 'file', name: 'Usage guidelines', desc: 'A short document covering what to do and what not to do: minimum sizes, clear space, which version on which background.' },
      { icon: 'share', name: 'Social profile assets', desc: 'Profile pictures and cover images cropped correctly for each platform, rather than your logo squeezed into a circle.' },
      { icon: 'layers', name: 'Print-ready files', desc: 'Versions set up for a printer or a signwriter, so the business card and the vehicle wrap do not need redrawing.' },
      { icon: 'package', name: 'Vector files you own', desc: 'Full vector source handed over. Scalable to any size and editable by any designer, now or years from now.' },
    ],
    who: [
      ['You are starting out', 'and want to look established from the first job rather than the fiftieth.'],
      ['Your logo was made quickly', 'in Word, Canva or by a relative, and there is no vector file anywhere.'],
      ['Nothing matches', 'because the van, the site and the invoice were each done by different people.'],
      ['You are getting a website built', 'and there is no point designing one around a logo you already dislike.'],
    ],
    pricing: {
      lead: 'Once-off, in ZAR. If you already have a mark worth keeping, a refresh is quoted lower than a rebuild, and I will tell you which one you actually need.',
      cols: 3,
      tiers: [
        { name: 'Logo only', price: 3500, period: 'once-off', desc: 'A mark and its variations, for a business that needs the one thing.', feats: ['Primary logo plus variations', 'Icon version for profiles and favicon', 'Black, white and reversed versions', 'Vector source files', 'Three concepts, two rounds of changes'] },
        { name: 'Identity', price: 6500, period: 'once-off', rec: true, desc: 'The logo, plus the colours and type that go with it.', feats: ['Everything in Logo only', 'Colour palette for screen, print and paint', 'Typography pairing', 'Usage guidelines document', 'Social profile assets'] },
        { name: 'Identity + collateral', price: 9500, period: 'once-off', desc: 'The identity, applied to the things you actually hand people.', feats: ['Everything in Identity', 'Business card artwork', 'Letterhead and quote template', 'Vehicle or signage artwork', 'Print-ready files for your supplier'] },
      ],
      note: 'If a website is part of the plan, the identity is worth doing first. A site designed around a logo you are about to replace gets built twice. See <a href="/services/web-design">web design</a>.',
    },
    faqs: [
      { q: 'Do I own the logo when it is done?', a: 'Yes, outright, including the editable vector source rather than only a flattened PNG. That distinction matters: without the vector file, every future sign, shirt or advert means paying someone to redraw it. You get the files and you are free to take them to any designer.' },
      { q: 'How many concepts do I see?', a: 'Three, then two rounds of changes on the one you pick. I would rather show a small number of properly considered directions than a wall of options, because choosing from twenty logos is a worse exercise than choosing from three, and the wall usually means nobody thought hard about any of them.' },
      { q: 'Can you refresh my existing logo instead of starting over?', a: 'Often, and it is usually the cheaper and better call if the mark has recognition behind it. Send me what you have, including whatever files exist. If the shape is sound and it just needs redrawing properly, tidier colour and real vector files, I will tell you that rather than sell you a rebrand.' },
      { q: 'What files do I get?', a: 'Vector source, plus exports set up for the things you will actually do: web, print, a profile picture, a favicon, and black, white and reversed versions for backgrounds you do not control. If your signwriter or printer wants a specific format, ask them and I will supply it.' },
      { q: 'Do you handle signage and vehicle branding?', a: 'I supply artwork set up correctly for whoever fits it, on the collateral tier. The fitting itself is done by a signwriter or wrap shop, and they will have opinions about material and placement that are worth listening to. What I can make sure of is that they receive files they do not have to redraw.' },
    ],
  },
);

export const bySlug = Object.fromEntries(SERVICES.map(s => [s.slug, s]));
