import { Component, inject, signal } from '@angular/core';
import {
  PkIcon,
  PkAccordion,
  PkAccordionItem,
  PkTimeline,
  PkTimelineItem,
  PkTabsModule,
  PkToastrService,
} from 'ngx-pk-ui';

export interface LpFeature {
  icon: string;
  color: string;
  title: string;
  desc: string;
}

export interface LpPlan {
  name: string;
  price: string;
  period: string;
  desc: string;
  features: string[];
  cta: string;
  highlight: boolean;
}

@Component({
  selector: 'app-landing-example',
  imports: [PkIcon, PkAccordion, PkAccordionItem, PkTimeline, PkTimelineItem, PkTabsModule],
  templateUrl: './landing-example.html',
  styleUrl: './landing-example.css',
})
export class LandingExample {
  readonly toastr = inject(PkToastrService);
  email = signal('');
  mobileOpen = signal(false);

  readonly features: LpFeature[] = [
    { icon: 'auto_awesome',             color: '#6366f1', title: 'AI-Powered Automation',  desc: 'Let AI build and optimise workflows based on your actual usage patterns and goals.' },
    { icon: 'integration_instructions', color: '#0ea5e9', title: '500+ Integrations',       desc: 'Connect Slack, GitHub, Jira, Notion, Salesforce, and hundreds more out of the box.' },
    { icon: 'bolt',                     color: '#f59e0b', title: 'Real-time Triggers',      desc: 'React to webhooks, schedule cron jobs, or fire on events in under a millisecond.' },
    { icon: 'bar_chart',                color: '#10b981', title: 'Analytics & Insights',    desc: 'Track run history, error rates, and cost savings with rich built-in dashboards.' },
    { icon: 'lock',                     color: '#ef4444', title: 'Enterprise Security',     desc: 'SOC 2 Type II certified. End-to-end encryption. SAML SSO and SCIM provisioning.' },
    { icon: 'code',                     color: '#8b5cf6', title: 'Developer First',         desc: 'REST API, webhooks, CLI tool, and TypeScript SDK — extend and integrate anything.' },
  ];

  readonly plans: LpPlan[] = [
    {
      name: 'Starter', price: 'Free', period: 'forever',
      desc: 'Perfect for individuals and side projects.',
      features: ['5 active workflows', '1 000 runs / month', '3 integrations', 'Community support'],
      cta: 'Get started', highlight: false,
    },
    {
      name: 'Pro', price: '$1.02', period: '/ month',
      desc: 'For teams who need power and flexibility.',
      features: ['Unlimited workflows', '100K runs / month', 'All 500+ integrations', 'Priority support', 'AI suggestions'],
      cta: 'Start free trial', highlight: true,
    },
    {
      name: 'Enterprise', price: 'Custom', period: '',
      desc: 'Full control, SLA, and dedicated infrastructure.',
      features: ['Unlimited everything', 'Custom run limits', 'SSO / SCIM', 'Dedicated CSM', 'On-premise option'],
      cta: 'Contact sales', highlight: false,
    },
  ];

  readonly mockBars = [40, 65, 30, 80, 55, 90, 45];
  readonly mockIcons = ['dashboard', 'layers', 'bolt', 'bar_chart', 'settings'];
  readonly mockBrands = ['Shopify', 'Notion', 'Figma', 'Vercel', 'Linear', 'Stripe'];
  readonly footerLinks = ['Features', 'Pricing', 'Docs', 'Blog', 'Careers', 'Status'];

  subscribe(): void {
    const v = this.email().trim();
    if (!v || !v.includes('@')) {
      this.toastr.warning('Please enter a valid email address.');
      return;
    }
    this.toastr.success('You are on the list!', 'Subscribed');
    this.email.set('');
  }

  scrollTo(id: string): void {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    this.mobileOpen.set(false);
  }
}
