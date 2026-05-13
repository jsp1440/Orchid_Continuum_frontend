import React from 'react';
import {
  Building2,
  GraduationCap,
  HeartHandshake,
  Globe,
  ShieldCheck,
  Mail,
} from 'lucide-react';
import PageShell from '@/components/orchid/PageShell';

/**
 * Partners — institutional, advisor, and funder placeholder page.
 *
 * Real partner records will be served from /api/partners; until then,
 * this page communicates the categories and invites institutions to
 * propose collaboration through the contact CTA.
 */

interface PartnerSlot {
  category: 'institution' | 'advisor' | 'funder' | 'fiscal';
  name: string;
  role: string;
}

const PLACEHOLDER_SLOTS: PartnerSlot[] = [
  {
    category: 'fiscal',
    name: 'EcoLogistics',
    role: 'Fiscal sponsor',
  },
  {
    category: 'institution',
    name: 'Botanical garden',
    role: 'Living collection partner',
  },
  {
    category: 'institution',
    name: 'University herbarium',
    role: 'Specimen + DNA partner',
  },
  {
    category: 'institution',
    name: 'Conservation NGO',
    role: 'Field reintroduction partner',
  },
  {
    category: 'advisor',
    name: 'Taxonomy advisor',
    role: 'Authoritative naming',
  },
  {
    category: 'advisor',
    name: 'Pollination ecologist',
    role: 'Interaction validation',
  },
  {
    category: 'advisor',
    name: 'Mycorrhiza specialist',
    role: 'Symbiosis curation',
  },
  {
    category: 'funder',
    name: 'Biodiversity foundation',
    role: 'Infrastructure grant',
  },
];

const CATEGORY_META: Record<
  PartnerSlot['category'],
  { label: string; icon: React.ComponentType<{ className?: string }> }
> = {
  institution: { label: 'Institution', icon: Building2 },
  advisor: { label: 'Advisor', icon: GraduationCap },
  funder: { label: 'Funder', icon: HeartHandshake },
  fiscal: { label: 'Fiscal sponsor', icon: ShieldCheck },
};

const Partners: React.FC = () => {
  return (
    <PageShell
      eyebrow="Network"
      title="Partners"
      titleAccent="building the Continuum together."
      intro="Orchid Continuum is built in coalition — botanical gardens, herbaria, ecologists, conservation NGOs, and the funders who make open biodiversity infrastructure possible."
    >
      {/* Categories */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            {(
              Object.entries(CATEGORY_META) as Array<
                [PartnerSlot['category'], (typeof CATEGORY_META)['institution']]
              >
            ).map(([key, meta]) => {
              const Icon = meta.icon;
              const count = PLACEHOLDER_SLOTS.filter(
                p => p.category === key,
              ).length;
              return (
                <div
                  key={key}
                  className="rounded-2xl border border-white/10 bg-[#142a1f] p-5"
                >
                  <div className="w-10 h-10 rounded-lg bg-emerald-300/10 border border-emerald-300/20 flex items-center justify-center text-emerald-200 mb-4">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="text-[10px] tracking-[0.2em] uppercase text-emerald-300/70">
                    {meta.label}
                  </div>
                  <div className="font-serif text-2xl mt-1">{count}</div>
                  <div className="text-xs text-white/45 mt-0.5">
                    placeholder slot{count === 1 ? '' : 's'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Slots grid */}
      <section className="pb-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-xs tracking-[0.25em] uppercase text-emerald-300/70 mb-3">
            Placeholder slots · awaiting confirmation
          </div>
          <h2 className="font-serif text-3xl md:text-4xl mb-8 max-w-2xl">
            Each slot becomes a real partner once the agreement is signed.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PLACEHOLDER_SLOTS.map((s, i) => {
              const Icon = CATEGORY_META[s.category].icon;
              return (
                <div
                  key={i}
                  className="rounded-2xl border border-dashed border-white/15 bg-[#142a1f]/60 p-5 hover:border-emerald-300/40 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Icon className="h-4 w-4 text-emerald-300/80" />
                    <span className="text-[10px] tracking-[0.2em] uppercase text-emerald-300/70">
                      {CATEGORY_META[s.category].label}
                    </span>
                  </div>
                  <div className="font-serif text-lg mb-1">{s.name}</div>
                  <div className="text-xs text-white/55">{s.role}</div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 text-[10px] tracking-[0.2em] uppercase text-white/40">
            Live partners will load from <code>GET /api/partners</code> once
            the endpoint ships.
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 border-t border-white/5 bg-[#0a1812]">
        <div className="max-w-4xl mx-auto px-6 lg:px-10">
          <div className="rounded-2xl border border-emerald-300/30 bg-gradient-to-br from-[#142a1f] to-[#0f2218] p-8 md:p-10 text-center">
            <Globe className="h-7 w-7 text-emerald-300 mx-auto mb-4" />
            <h2 className="font-serif text-3xl md:text-4xl mb-4">
              Propose a partnership.
            </h2>
            <p className="text-sm text-white/65 leading-relaxed max-w-2xl mx-auto mb-6">
              Botanical gardens, universities, conservation NGOs, and funders
              — we are actively building this coalition. Tell us what you
              steward, and how the Continuum can help.
            </p>
            <a
              href="mailto:partners@orchidcontinuum.org"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-300/90 text-[#0d1f17] hover:bg-emerald-200 transition-colors font-medium text-sm"
            >
              <Mail className="h-4 w-4" /> partners@orchidcontinuum.org
            </a>
          </div>
        </div>
      </section>
    </PageShell>
  );
};

export default Partners;
