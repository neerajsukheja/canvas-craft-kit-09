import type { Template, BuilderPage } from '@/types/builder';

let idCounter = 0;
const uid = () => `comp-${++idCounter}`;
const sid = () => `section-${++idCounter}`;

export const templates: Template[] = [
  {
    id: 'home',
    name: 'Home Page Template',
    description: 'Hero section, marketing features grid, product cards, CTA section, footer.',
    buildPage: (): BuilderPage => {
      idCounter = 0;
      return {
        id: 'page-home',
        title: 'Home Page',
        templateName: 'Home Page Template',
        sections: [
          {
            id: sid(), name: 'Hero Section', style: 'wf-hero',
            components: [
              { id: uid(), type: 'typography', props: { text: 'Welcome to Wells Fargo', variant: 'h1', align: 'center' } },
              { id: uid(), type: 'typography', props: { text: 'Together we\'ll go far. Explore our financial products designed for your success.', variant: 'body1', align: 'center' } },
              { id: uid(), type: 'button', props: { label: 'Get Started', variant: 'secondary', size: 'lg' } },
            ],
          },
          {
            id: sid(), name: 'Features Grid', style: 'wf-section',
            components: [
              { id: uid(), type: 'typography', props: { text: 'Why Choose Us', variant: 'h2', align: 'center' } },
              { id: uid(), type: 'grid', props: { columns: '3', gap: 'md' } },
              { id: uid(), type: 'card', props: { title: 'Personal Banking', description: 'Checking, savings, and CDs tailored to your needs.' } },
              { id: uid(), type: 'card', props: { title: 'Business Solutions', description: 'Grow your business with our comprehensive financial tools.' } },
              { id: uid(), type: 'card', props: { title: 'Wealth Management', description: 'Expert guidance for building and preserving your wealth.' } },
            ],
          },
          {
            id: sid(), name: 'Product Cards', style: 'wf-section',
            components: [
              { id: uid(), type: 'typography', props: { text: 'Featured Products', variant: 'h2', align: 'center' } },
              { id: uid(), type: 'card', props: { title: 'Active Cash® Card', description: 'Earn unlimited 2% cash rewards on purchases.' } },
              { id: uid(), type: 'card', props: { title: 'Autograph℠ Card', description: 'Earn 3X points on restaurants, travel, and more.' } },
            ],
          },
          {
            id: sid(), name: 'CTA Section', style: 'wf-section',
            components: [
              { id: uid(), type: 'typography', props: { text: 'Ready to take the next step?', variant: 'h3', align: 'center' } },
              { id: uid(), type: 'button', props: { label: 'Open an Account', variant: 'primary', size: 'lg' } },
            ],
          },
          {
            id: sid(), name: 'Footer', style: 'wf-section',
            components: [
              { id: uid(), type: 'divider', props: { thickness: 'thin' } },
              { id: uid(), type: 'typography', props: { text: '© 2026 Templify Builder. All rights reserved.', variant: 'caption', align: 'center' } },
            ],
          },
        ],
      };
    },
  },
  {
    id: 'landing',
    name: 'Landing Page Template',
    description: 'Large hero banner, benefits grid, testimonial section, CTA block.',
    buildPage: (): BuilderPage => {
      idCounter = 100;
      return {
        id: 'page-landing',
        title: 'Landing Page',
        templateName: 'Landing Page Template',
        sections: [
          {
            id: sid(), name: 'Hero Banner', style: 'wf-hero',
            components: [
              { id: uid(), type: 'typography', props: { text: 'Your Financial Future Starts Here', variant: 'h1', align: 'center' } },
              { id: uid(), type: 'typography', props: { text: 'Discover banking solutions built around you.', variant: 'body1', align: 'center' } },
              { id: uid(), type: 'button', props: { label: 'Learn More', variant: 'secondary', size: 'lg' } },
            ],
          },
          {
            id: sid(), name: 'Benefits Grid', style: 'wf-section',
            components: [
              { id: uid(), type: 'typography', props: { text: 'Benefits', variant: 'h2', align: 'center' } },
              { id: uid(), type: 'card', props: { title: 'No Monthly Fees', description: 'Keep more of your money with zero monthly maintenance fees.' } },
              { id: uid(), type: 'card', props: { title: '24/7 Support', description: 'Our team is available around the clock to assist you.' } },
              { id: uid(), type: 'card', props: { title: 'Mobile Banking', description: 'Manage your finances anytime, anywhere from your phone.' } },
            ],
          },
          {
            id: sid(), name: 'Testimonials', style: 'wf-section',
            components: [
              { id: uid(), type: 'typography', props: { text: 'What Our Customers Say', variant: 'h2', align: 'center' } },
              { id: uid(), type: 'card', props: { title: '"Exceptional Service"', description: '— Sarah M., Small Business Owner' } },
              { id: uid(), type: 'card', props: { title: '"Made Investing Easy"', description: '— James T., Retiree' } },
            ],
          },
          {
            id: sid(), name: 'CTA Block', style: 'wf-section',
            components: [
              { id: uid(), type: 'typography', props: { text: 'Join Thousands of Satisfied Customers', variant: 'h3', align: 'center' } },
              { id: uid(), type: 'button', props: { label: 'Sign Up Now', variant: 'primary', size: 'lg' } },
            ],
          },
        ],
      };
    },
  },
  {
    id: 'marketing',
    name: 'Marketing Page Template',
    description: 'Hero section, promotional content sections, feature comparison grid.',
    buildPage: (): BuilderPage => {
      idCounter = 200;
      return {
        id: 'page-marketing',
        title: 'Marketing Page',
        templateName: 'Marketing Page Template',
        sections: [
          {
            id: sid(), name: 'Hero', style: 'wf-hero',
            components: [
              { id: uid(), type: 'typography', props: { text: 'Introducing Premier Checking', variant: 'h1', align: 'center' } },
              { id: uid(), type: 'typography', props: { text: 'The premium checking experience with exclusive benefits.', variant: 'body1', align: 'center' } },
              { id: uid(), type: 'button', props: { label: 'Apply Now', variant: 'secondary', size: 'lg' } },
            ],
          },
          {
            id: sid(), name: 'Promotional Content', style: 'wf-section',
            components: [
              { id: uid(), type: 'typography', props: { text: 'Exclusive Perks', variant: 'h2', align: 'left' } },
              { id: uid(), type: 'list', props: { items: 'No ATM fees worldwide,Complimentary financial planning,Premium rewards program,Priority customer service', ordered: false } },
            ],
          },
          {
            id: sid(), name: 'Comparison Grid', style: 'wf-section',
            components: [
              { id: uid(), type: 'typography', props: { text: 'Compare Our Accounts', variant: 'h2', align: 'center' } },
              { id: uid(), type: 'card', props: { title: 'Everyday Checking', description: '$0 monthly fee · Basic features · Mobile banking' } },
              { id: uid(), type: 'card', props: { title: 'Premier Checking', description: '$25/mo · All features · Priority support · Rewards' } },
              { id: uid(), type: 'card', props: { title: 'Private Bank', description: 'Custom pricing · Dedicated advisor · Full suite' } },
            ],
          },
        ],
      };
    },
  },
  {
    id: 'blog',
    name: 'Blog Page Template',
    description: 'Article layout, content blocks, sidebar widgets, related posts.',
    buildPage: (): BuilderPage => {
      idCounter = 300;
      return {
        id: 'page-blog',
        title: 'Blog Page',
        templateName: 'Blog Page Template',
        sections: [
          {
            id: sid(), name: 'Article Header', style: 'wf-section',
            components: [
              { id: uid(), type: 'typography', props: { text: '5 Smart Strategies for Building Your Emergency Fund', variant: 'h1', align: 'left' } },
              { id: uid(), type: 'typography', props: { text: 'Published March 9, 2026 · 5 min read', variant: 'caption', align: 'left' } },
              { id: uid(), type: 'divider', props: { thickness: 'thin' } },
            ],
          },
          {
            id: sid(), name: 'Article Body', style: 'wf-section',
            components: [
              { id: uid(), type: 'typography', props: { text: 'Building an emergency fund is one of the most important steps toward financial security. Here are five proven strategies to help you get started and stay on track.', variant: 'body1', align: 'left' } },
              { id: uid(), type: 'typography', props: { text: '1. Set a Clear Goal', variant: 'h3', align: 'left' } },
              { id: uid(), type: 'typography', props: { text: 'Aim to save 3-6 months of living expenses. Start small and build consistently over time.', variant: 'body1', align: 'left' } },
              { id: uid(), type: 'typography', props: { text: '2. Automate Your Savings', variant: 'h3', align: 'left' } },
              { id: uid(), type: 'typography', props: { text: 'Set up automatic transfers to your savings account every payday.', variant: 'body1', align: 'left' } },
            ],
          },
          {
            id: sid(), name: 'Related Posts', style: 'wf-section',
            components: [
              { id: uid(), type: 'typography', props: { text: 'Related Articles', variant: 'h3', align: 'left' } },
              { id: uid(), type: 'card', props: { title: 'How to Budget Like a Pro', description: 'Master the 50/30/20 rule for effective budgeting.' } },
              { id: uid(), type: 'card', props: { title: 'Understanding Credit Scores', description: 'What factors affect your score and how to improve it.' } },
            ],
          },
        ],
      };
    },
  },
  {
    id: 'dashboard',
    name: 'Dashboard Style Template',
    description: 'Header, statistics cards, content panels.',
    buildPage: (): BuilderPage => {
      idCounter = 400;
      return {
        id: 'page-dashboard',
        title: 'Dashboard',
        templateName: 'Dashboard Style Template',
        sections: [
          {
            id: sid(), name: 'Dashboard Header', style: 'wf-section',
            components: [
              { id: uid(), type: 'typography', props: { text: 'Account Overview', variant: 'h1', align: 'left' } },
              { id: uid(), type: 'typography', props: { text: 'Welcome back. Here\'s a summary of your accounts.', variant: 'body1', align: 'left' } },
            ],
          },
          {
            id: sid(), name: 'Statistics Cards', style: 'wf-section',
            components: [
              { id: uid(), type: 'card', props: { title: 'Total Balance', description: '$124,532.00' } },
              { id: uid(), type: 'card', props: { title: 'Monthly Spending', description: '$3,247.89' } },
              { id: uid(), type: 'card', props: { title: 'Savings Goal', description: '78% Complete' } },
              { id: uid(), type: 'card', props: { title: 'Credit Score', description: '742 — Good' } },
            ],
          },
          {
            id: sid(), name: 'Recent Transactions', style: 'wf-section',
            components: [
              { id: uid(), type: 'typography', props: { text: 'Recent Transactions', variant: 'h3', align: 'left' } },
              { id: uid(), type: 'list', props: { items: 'Grocery Store — -$85.32,Direct Deposit — +$2500.00,Electric Bill — -$142.00,Restaurant — -$45.67', ordered: false } },
            ],
          },
          {
            id: sid(), name: 'Quick Actions', style: 'wf-section',
            components: [
              { id: uid(), type: 'typography', props: { text: 'Quick Actions', variant: 'h3', align: 'left' } },
              { id: uid(), type: 'button', props: { label: 'Transfer Money', variant: 'primary', size: 'md' } },
              { id: uid(), type: 'button', props: { label: 'Pay Bills', variant: 'outline', size: 'md' } },
              { id: uid(), type: 'button', props: { label: 'View Statements', variant: 'outline', size: 'md' } },
            ],
          },
        ],
      };
    },
  },
];
