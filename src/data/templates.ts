import type { Template, BuilderPage, BuilderSection, BuilderComponent, LayoutProps, SectionLayout } from '@/types/builder';

let idCounter = 0;
const uid = () => `comp-${++idCounter}`;
const sid = () => `section-${++idCounter}`;

const L = (colSpan: number, extra?: Partial<LayoutProps>): LayoutProps => ({
  colSpan,
  padding: 'none',
  margin: 'none',
  alignSelf: 'stretch',
  ...extra,
});

const SL = (overrides?: Partial<SectionLayout>): SectionLayout => ({
  columns: 12,
  gap: 'md',
  padding: 'md',
  background: 'white',
  maxWidth: 'xl',
  minHeight: 'auto',
  ...overrides,
});

export const templates: Template[] = [
  {
    id: 'home',
    name: 'Home Page Template',
    description: 'Wells Fargo-style home page: red navbar, hero banner with promo, 4-column feature cards, product cards, CTA, footer.',
    buildPage: (): BuilderPage => {
      idCounter = 0;
      return {
        id: 'page-home',
        title: 'Home Page',
        templateName: 'Home Page Template',
        sections: [
          // Red Navbar
          {
            id: sid(), name: 'Navigation', style: '',
            layout: SL({ padding: 'none', background: 'transparent', maxWidth: 'full' }),
            components: [
              { id: uid(), type: 'navbar', props: { brand: 'WELLS FARGO', links: 'Personal,Investing & Wealth,Business,Commercial,Corporate', navStyle: 'primary' }, layout: L(12) },
            ],
          },
          // Sub Navigation
          {
            id: sid(), name: 'Sub Nav', style: '',
            layout: SL({ padding: 'sm', background: 'white', maxWidth: 'full' }),
            components: [
              { id: uid(), type: 'navbar', props: { brand: '', links: 'Checking,Savings & CDs,Credit Cards,Home Loans,Personal Loans,Auto Loans,Premier,Education & Tools', navStyle: 'white' }, layout: L(12) },
            ],
          },
          // Hero Section with side-by-side layout
          {
            id: sid(), name: 'Hero Banner', style: '',
            layout: SL({ padding: 'xl', background: 'light', columns: 12, gap: 'lg', minHeight: 'md' }),
            components: [
              // Sign On form (left side)
              { id: uid(), type: 'typography', props: { text: 'Good morning', variant: 'h3', align: 'left', color: 'default', weight: 'semibold' }, layout: L(4) },
              // Promo (right side)
              { id: uid(), type: 'typography', props: { text: '$325 checking bonus on us', variant: 'h1', align: 'left', color: 'default', weight: 'bold' }, layout: L(8) },
              { id: uid(), type: 'textfield', props: { label: 'Username', placeholder: 'Username', type: 'text' }, layout: L(4) },
              { id: uid(), type: 'typography', props: { text: 'New customers open an eligible checking account with qualifying direct deposits', variant: 'body1', align: 'left', color: 'muted', weight: 'normal' }, layout: L(8) },
              { id: uid(), type: 'textfield', props: { label: 'Password', placeholder: 'Password', type: 'password' }, layout: L(4) },
              { id: uid(), type: 'button', props: { label: 'Get started >>', variant: 'outline', size: 'lg', fullWidth: false }, layout: L(8) },
              { id: uid(), type: 'button', props: { label: 'Sign On', variant: 'primary', size: 'md', fullWidth: true }, layout: L(4) },
            ],
          },
          // 4-Column Feature Cards (like WF homepage)
          {
            id: sid(), name: 'Featured Offers', style: '',
            layout: SL({ padding: 'lg', background: 'white', columns: 4, gap: 'lg' }),
            components: [
              { id: uid(), type: 'icon-card', props: { title: 'Earn a $200 cash rewards bonus', description: 'Plus, earn unlimited 2% cash rewards on purchases with $0 annual fee. Terms apply.', linkText: 'Learn more', icon: 'credit-card' }, layout: L(1) },
              { id: uid(), type: 'icon-card', props: { title: 'New customer? Say hello to a $125 bonus', description: 'Open a Clear Access Banking account, great for students & more, complete offer requirements.', linkText: 'See offer details', icon: 'dollar-sign' }, layout: L(1) },
              { id: uid(), type: 'icon-card', props: { title: 'Open a savings account', description: 'Explore our savings accounts and find the right fit for you.', linkText: 'Get started', icon: 'piggy-bank' }, layout: L(1) },
              { id: uid(), type: 'icon-card', props: { title: 'Interest rates today', description: 'Check current rates for savings, CDs, mortgages and more.', linkText: 'Check rates', icon: 'percent' }, layout: L(1) },
            ],
          },
          // Products section
          {
            id: sid(), name: 'Products & Services', style: '',
            layout: SL({ padding: 'lg', background: 'light', columns: 3, gap: 'md' }),
            components: [
              { id: uid(), type: 'typography', props: { text: 'Products & Services', variant: 'h2', align: 'center', color: 'default', weight: 'bold' }, layout: L(12) },
              { id: uid(), type: 'typography', props: { text: 'Explore our banking solutions designed for your financial success.', variant: 'body1', align: 'center', color: 'muted', weight: 'normal' }, layout: L(12) },
              { id: uid(), type: 'card', props: { title: 'Active Cash® Card', description: 'Earn unlimited 2% cash rewards on purchases. No annual fee.', cardStyle: 'elevated', icon: 'credit-card' }, layout: L(1) },
              { id: uid(), type: 'card', props: { title: 'Autograph℠ Card', description: 'Earn 3X points on restaurants, travel, gas stations, transit, and more.', cardStyle: 'elevated', icon: 'star' }, layout: L(1) },
              { id: uid(), type: 'card', props: { title: 'Reflect® Card', description: 'Long intro APR period. Take your time to pay down balances.', cardStyle: 'elevated', icon: 'shield' }, layout: L(1) },
            ],
          },
          // CTA Section
          {
            id: sid(), name: 'CTA Section', style: '',
            layout: SL({ padding: 'xl', background: 'primary', columns: 12, minHeight: 'sm' }),
            components: [
              { id: uid(), type: 'typography', props: { text: 'Ready to take the next step?', variant: 'h2', align: 'center', color: 'white', weight: 'bold' }, layout: L(12) },
              { id: uid(), type: 'typography', props: { text: 'Open an account online in minutes. No appointment needed.', variant: 'body1', align: 'center', color: 'white', weight: 'normal' }, layout: L(12, { padding: 'sm' }) },
              { id: uid(), type: 'button', props: { label: 'Open an Account', variant: 'secondary', size: 'lg', fullWidth: false }, layout: L(12) },
            ],
          },
          // Footer
          {
            id: sid(), name: 'Footer', style: '',
            layout: SL({ padding: 'lg', background: 'dark', columns: 4, gap: 'lg' }),
            components: [
              { id: uid(), type: 'list', props: { items: 'Privacy Policy,Terms of Use,Security,Ad Choices', ordered: false, listStyle: 'none' }, layout: L(1) },
              { id: uid(), type: 'list', props: { items: 'Sitemap,Careers,About Wells Fargo,Diversity', ordered: false, listStyle: 'none' }, layout: L(1) },
              { id: uid(), type: 'list', props: { items: 'Investor Relations,Government Relations,Financial Education', ordered: false, listStyle: 'none' }, layout: L(1) },
              { id: uid(), type: 'typography', props: { text: '© 2026 Wells Fargo Bank, N.A. All rights reserved. NMLSR ID 399801', variant: 'caption', align: 'left', color: 'muted', weight: 'normal' }, layout: L(1) },
            ],
          },
        ],
      };
    },
  },
  {
    id: 'landing',
    name: 'Landing Page Template',
    description: 'Wells Fargo-style landing: hero with split layout, benefits grid, testimonials, sign-up CTA.',
    buildPage: (): BuilderPage => {
      idCounter = 100;
      return {
        id: 'page-landing',
        title: 'Landing Page',
        templateName: 'Landing Page Template',
        sections: [
          {
            id: sid(), name: 'Navigation', style: '',
            layout: SL({ padding: 'none', background: 'transparent', maxWidth: 'full' }),
            components: [
              { id: uid(), type: 'navbar', props: { brand: 'WELLS FARGO', links: 'Personal,Business,Wealth Management,About', navStyle: 'primary' }, layout: L(12) },
            ],
          },
          // Hero
          {
            id: sid(), name: 'Hero', style: '',
            layout: SL({ padding: 'xl', background: 'light', columns: 12, gap: 'lg', minHeight: 'md' }),
            components: [
              { id: uid(), type: 'typography', props: { text: 'Your Financial Future Starts Here', variant: 'h1', align: 'left', color: 'default', weight: 'extrabold' }, layout: L(7) },
              { id: uid(), type: 'image', props: { src: 'https://placehold.co/600x400/f5f5f0/333333?text=Financial+Planning', alt: 'Financial planning', objectFit: 'cover', rounded: 'lg' }, layout: L(5) },
              { id: uid(), type: 'typography', props: { text: 'Discover banking solutions built around your goals. From everyday checking to expert wealth management.', variant: 'body1', align: 'left', color: 'muted', weight: 'normal' }, layout: L(7) },
              { id: uid(), type: 'button', props: { label: 'Get Started', variant: 'primary', size: 'lg', fullWidth: false }, layout: L(3) },
              { id: uid(), type: 'button', props: { label: 'Learn More', variant: 'outline', size: 'lg', fullWidth: false }, layout: L(3) },
            ],
          },
          // Benefits
          {
            id: sid(), name: 'Benefits', style: '',
            layout: SL({ padding: 'lg', background: 'white', columns: 3, gap: 'lg' }),
            components: [
              { id: uid(), type: 'typography', props: { text: 'Why Choose Wells Fargo?', variant: 'h2', align: 'center', color: 'default', weight: 'bold' }, layout: L(12) },
              { id: uid(), type: 'icon-card', props: { title: 'No Monthly Fees', description: 'Keep more of your money with zero monthly maintenance fees on select accounts.', linkText: 'Learn more', icon: 'dollar-sign' }, layout: L(1) },
              { id: uid(), type: 'icon-card', props: { title: '24/7 Support', description: 'Our team is available around the clock to assist you with any question.', linkText: 'Contact us', icon: 'phone' }, layout: L(1) },
              { id: uid(), type: 'icon-card', props: { title: 'Mobile Banking', description: 'Manage your finances anytime, anywhere from your phone or tablet.', linkText: 'Download app', icon: 'globe' }, layout: L(1) },
            ],
          },
          // Testimonials
          {
            id: sid(), name: 'Testimonials', style: '',
            layout: SL({ padding: 'lg', background: 'light', columns: 2, gap: 'lg' }),
            components: [
              { id: uid(), type: 'typography', props: { text: 'What Our Customers Say', variant: 'h2', align: 'center', color: 'default', weight: 'bold' }, layout: L(12) },
              { id: uid(), type: 'card', props: { title: '"Exceptional Service"', description: 'Wells Fargo made my home buying process smooth and stress-free. Their advisors are incredibly knowledgeable. — Sarah M., Small Business Owner', cardStyle: 'elevated', icon: 'star' }, layout: L(1) },
              { id: uid(), type: 'card', props: { title: '"Made Investing Easy"', description: 'I was new to investing, and their wealth management team guided me every step of the way. — James T., Retiree', cardStyle: 'elevated', icon: 'star' }, layout: L(1) },
            ],
          },
          // CTA
          {
            id: sid(), name: 'CTA', style: '',
            layout: SL({ padding: 'xl', background: 'primary' }),
            components: [
              { id: uid(), type: 'typography', props: { text: 'Join Thousands of Satisfied Customers', variant: 'h2', align: 'center', color: 'white', weight: 'bold' }, layout: L(12) },
              { id: uid(), type: 'typography', props: { text: 'Open your account today and experience the Wells Fargo difference.', variant: 'body1', align: 'center', color: 'white', weight: 'normal' }, layout: L(12) },
              { id: uid(), type: 'button', props: { label: 'Sign Up Now', variant: 'secondary', size: 'lg', fullWidth: false }, layout: L(12) },
            ],
          },
        ],
      };
    },
  },
  {
    id: 'marketing',
    name: 'Marketing Page Template',
    description: 'Product marketing page with hero, feature comparison, pricing tiers, and promotional content.',
    buildPage: (): BuilderPage => {
      idCounter = 200;
      return {
        id: 'page-marketing',
        title: 'Marketing Page',
        templateName: 'Marketing Page Template',
        sections: [
          {
            id: sid(), name: 'Navigation', style: '',
            layout: SL({ padding: 'none', background: 'transparent', maxWidth: 'full' }),
            components: [
              { id: uid(), type: 'navbar', props: { brand: 'WELLS FARGO', links: 'Checking,Savings,Credit Cards,Loans,Investing', navStyle: 'primary' }, layout: L(12) },
            ],
          },
          // Hero
          {
            id: sid(), name: 'Hero', style: '',
            layout: SL({ padding: 'xl', background: 'primary', minHeight: 'md' }),
            components: [
              { id: uid(), type: 'typography', props: { text: 'INTRODUCING', variant: 'overline', align: 'center', color: 'white', weight: 'semibold' }, layout: L(12) },
              { id: uid(), type: 'typography', props: { text: 'Premier Checking', variant: 'h1', align: 'center', color: 'white', weight: 'extrabold' }, layout: L(12) },
              { id: uid(), type: 'typography', props: { text: 'The premium checking experience with exclusive benefits and personalized service.', variant: 'body1', align: 'center', color: 'white', weight: 'normal' }, layout: L(12) },
              { id: uid(), type: 'button', props: { label: 'Apply Now', variant: 'secondary', size: 'lg', fullWidth: false }, layout: L(12) },
            ],
          },
          // Perks
          {
            id: sid(), name: 'Exclusive Perks', style: '',
            layout: SL({ padding: 'lg', background: 'white', columns: 12, gap: 'lg' }),
            components: [
              { id: uid(), type: 'typography', props: { text: 'Exclusive Perks', variant: 'h2', align: 'left', color: 'default', weight: 'bold' }, layout: L(6) },
              { id: uid(), type: 'image', props: { src: 'https://placehold.co/500x300/f5f5f0/d71e28?text=Premier+Benefits', alt: 'Premier benefits', objectFit: 'cover', rounded: 'lg' }, layout: L(6) },
              { id: uid(), type: 'list', props: { items: 'No ATM fees worldwide — use any ATM for free,Complimentary financial planning with a dedicated advisor,Premium rewards program — earn points on every purchase,Priority customer service — skip the wait', ordered: false, listStyle: 'checkmark' }, layout: L(6) },
            ],
          },
          // Comparison
          {
            id: sid(), name: 'Compare Accounts', style: '',
            layout: SL({ padding: 'lg', background: 'light', columns: 3, gap: 'lg' }),
            components: [
              { id: uid(), type: 'typography', props: { text: 'Compare Our Accounts', variant: 'h2', align: 'center', color: 'default', weight: 'bold' }, layout: L(12) },
              { id: uid(), type: 'card', props: { title: 'Everyday Checking', description: '$0 monthly fee · Basic features · Mobile banking · Bill pay · Zelle®', cardStyle: 'bordered', icon: 'none' }, layout: L(1) },
              { id: uid(), type: 'card', props: { title: 'Premier Checking', description: '$25/mo (waivable) · All features · Priority support · Rewards · No ATM fees', cardStyle: 'elevated', icon: 'star' }, layout: L(1) },
              { id: uid(), type: 'card', props: { title: 'Private Bank', description: 'Custom pricing · Dedicated advisor · Full investment suite · Concierge', cardStyle: 'bordered', icon: 'briefcase' }, layout: L(1) },
            ],
          },
          // CTA
          {
            id: sid(), name: 'CTA', style: '',
            layout: SL({ padding: 'xl', background: 'gold-light' }),
            components: [
              { id: uid(), type: 'typography', props: { text: 'Ready to upgrade your banking experience?', variant: 'h3', align: 'center', color: 'default', weight: 'bold' }, layout: L(12) },
              { id: uid(), type: 'button', props: { label: 'Open Premier Checking', variant: 'primary', size: 'lg', fullWidth: false }, layout: L(12) },
            ],
          },
        ],
      };
    },
  },
  {
    id: 'blog',
    name: 'Blog Page Template',
    description: 'Article layout with sidebar, content blocks, related posts, and financial tips.',
    buildPage: (): BuilderPage => {
      idCounter = 300;
      return {
        id: 'page-blog',
        title: 'Blog Page',
        templateName: 'Blog Page Template',
        sections: [
          {
            id: sid(), name: 'Navigation', style: '',
            layout: SL({ padding: 'none', background: 'transparent', maxWidth: 'full' }),
            components: [
              { id: uid(), type: 'navbar', props: { brand: 'WELLS FARGO', links: 'Financial Education,Planning,Investing,Security,Tools', navStyle: 'primary' }, layout: L(12) },
            ],
          },
          // Breadcrumb
          {
            id: sid(), name: 'Breadcrumb', style: '',
            layout: SL({ padding: 'sm', background: 'light' }),
            components: [
              { id: uid(), type: 'typography', props: { text: 'Home  ›  Financial Education  ›  Saving & Budgeting', variant: 'caption', align: 'left', color: 'muted', weight: 'normal' }, layout: L(12) },
            ],
          },
          // Article Header + Sidebar
          {
            id: sid(), name: 'Article', style: '',
            layout: SL({ padding: 'lg', background: 'white', columns: 12, gap: 'lg' }),
            components: [
              // Main article area
              { id: uid(), type: 'typography', props: { text: '5 Smart Strategies for Building Your Emergency Fund', variant: 'h1', align: 'left', color: 'default', weight: 'bold' }, layout: L(8) },
              // Sidebar
              { id: uid(), type: 'card', props: { title: 'Quick Tools', description: 'Budget Calculator · Savings Goal Tracker · Credit Score Check', cardStyle: 'flat', icon: 'none' }, layout: L(4) },
              { id: uid(), type: 'typography', props: { text: 'Published March 9, 2026  ·  5 min read', variant: 'caption', align: 'left', color: 'muted', weight: 'normal' }, layout: L(8) },
              { id: uid(), type: 'card', props: { title: 'Related Topics', description: 'Emergency Savings · Budgeting Tips · Financial Planning · Retirement', cardStyle: 'bordered', icon: 'none' }, layout: L(4) },
              { id: uid(), type: 'divider', props: { thickness: 'thin', color: 'default' }, layout: L(8) },
              { id: uid(), type: 'typography', props: { text: 'Building an emergency fund is one of the most important steps toward financial security. Here are five proven strategies to help you get started and stay on track.', variant: 'body1', align: 'left', color: 'default', weight: 'normal' }, layout: L(8) },
              { id: uid(), type: 'typography', props: { text: '1. Set a Clear Goal', variant: 'h3', align: 'left', color: 'default', weight: 'semibold' }, layout: L(8) },
              { id: uid(), type: 'typography', props: { text: 'Aim to save 3-6 months of living expenses. Start small — even $500 provides a meaningful cushion — and build consistently over time.', variant: 'body1', align: 'left', color: 'default', weight: 'normal' }, layout: L(8) },
              { id: uid(), type: 'typography', props: { text: '2. Automate Your Savings', variant: 'h3', align: 'left', color: 'default', weight: 'semibold' }, layout: L(8) },
              { id: uid(), type: 'typography', props: { text: 'Set up automatic transfers to your savings account every payday. Treat it like a bill — your future self will thank you.', variant: 'body1', align: 'left', color: 'default', weight: 'normal' }, layout: L(8) },
            ],
          },
          // Related posts
          {
            id: sid(), name: 'Related Articles', style: '',
            layout: SL({ padding: 'lg', background: 'light', columns: 3, gap: 'lg' }),
            components: [
              { id: uid(), type: 'typography', props: { text: 'Related Articles', variant: 'h3', align: 'left', color: 'default', weight: 'bold' }, layout: L(12) },
              { id: uid(), type: 'icon-card', props: { title: 'How to Budget Like a Pro', description: 'Master the 50/30/20 rule for effective budgeting and financial freedom.', linkText: 'Read article', icon: 'dollar-sign' }, layout: L(1) },
              { id: uid(), type: 'icon-card', props: { title: 'Understanding Credit Scores', description: 'What factors affect your score and actionable steps to improve it.', linkText: 'Read article', icon: 'trending-up' }, layout: L(1) },
              { id: uid(), type: 'icon-card', props: { title: 'Retirement Planning 101', description: 'It\'s never too early to start. Learn the basics of retirement planning.', linkText: 'Read article', icon: 'briefcase' }, layout: L(1) },
            ],
          },
        ],
      };
    },
  },
  {
    id: 'dashboard',
    name: 'Dashboard Style Template',
    description: 'Account dashboard with stats cards, recent transactions, quick actions, and navigation sidebar.',
    buildPage: (): BuilderPage => {
      idCounter = 400;
      return {
        id: 'page-dashboard',
        title: 'Dashboard',
        templateName: 'Dashboard Style Template',
        sections: [
          {
            id: sid(), name: 'Navigation', style: '',
            layout: SL({ padding: 'none', background: 'transparent', maxWidth: 'full' }),
            components: [
              { id: uid(), type: 'navbar', props: { brand: 'WELLS FARGO', links: 'Accounts,Transfer,Pay Bills,Invest,More', navStyle: 'primary' }, layout: L(12) },
            ],
          },
          // Header
          {
            id: sid(), name: 'Dashboard Header', style: '',
            layout: SL({ padding: 'lg', background: 'light', columns: 12 }),
            components: [
              { id: uid(), type: 'typography', props: { text: 'Account Overview', variant: 'h1', align: 'left', color: 'default', weight: 'bold' }, layout: L(8) },
              { id: uid(), type: 'button', props: { label: 'Open New Account', variant: 'primary', size: 'md', fullWidth: false }, layout: L(4, { alignSelf: 'end' }) },
              { id: uid(), type: 'typography', props: { text: 'Welcome back, John. Here\'s a summary of your accounts as of March 9, 2026.', variant: 'body1', align: 'left', color: 'muted', weight: 'normal' }, layout: L(12) },
            ],
          },
          // Stats Cards
          {
            id: sid(), name: 'Account Summary', style: '',
            layout: SL({ padding: 'lg', background: 'white', columns: 4, gap: 'md' }),
            components: [
              { id: uid(), type: 'card', props: { title: 'Total Balance', description: '$124,532.00', cardStyle: 'elevated', icon: 'dollar-sign' }, layout: L(1) },
              { id: uid(), type: 'card', props: { title: 'Monthly Spending', description: '$3,247.89', cardStyle: 'elevated', icon: 'credit-card' }, layout: L(1) },
              { id: uid(), type: 'card', props: { title: 'Savings Goal', description: '78% Complete', cardStyle: 'elevated', icon: 'trending-up' }, layout: L(1) },
              { id: uid(), type: 'card', props: { title: 'Credit Score', description: '742 — Good', cardStyle: 'elevated', icon: 'shield' }, layout: L(1) },
            ],
          },
          // Transactions + Quick Actions
          {
            id: sid(), name: 'Activity', style: '',
            layout: SL({ padding: 'lg', background: 'white', columns: 12, gap: 'lg' }),
            components: [
              { id: uid(), type: 'typography', props: { text: 'Recent Transactions', variant: 'h3', align: 'left', color: 'default', weight: 'semibold' }, layout: L(8) },
              { id: uid(), type: 'typography', props: { text: 'Quick Actions', variant: 'h3', align: 'left', color: 'default', weight: 'semibold' }, layout: L(4) },
              { id: uid(), type: 'list', props: { items: 'Grocery Store — -$85.32,Direct Deposit — +$2500.00,Electric Bill — -$142.00,Restaurant — -$45.67,Gas Station — -$52.10', ordered: false, listStyle: 'arrow' }, layout: L(8) },
              { id: uid(), type: 'button', props: { label: 'Transfer Money', variant: 'primary', size: 'md', fullWidth: true }, layout: L(4) },
              { id: uid(), type: 'button', props: { label: 'Pay Bills', variant: 'outline', size: 'md', fullWidth: true }, layout: L(4) },
              { id: uid(), type: 'button', props: { label: 'View Statements', variant: 'outline', size: 'md', fullWidth: true }, layout: L(4) },
              { id: uid(), type: 'button', props: { label: 'Send with Zelle®', variant: 'outline', size: 'md', fullWidth: true }, layout: L(4) },
            ],
          },
          // Footer
          {
            id: sid(), name: 'Footer', style: '',
            layout: SL({ padding: 'md', background: 'dark' }),
            components: [
              { id: uid(), type: 'typography', props: { text: '© 2026 Wells Fargo Bank, N.A. All rights reserved. Member FDIC. NMLSR ID 399801', variant: 'caption', align: 'center', color: 'muted', weight: 'normal' }, layout: L(12) },
            ],
          },
        ],
      };
    },
  },
];
