import React from 'react';
import { Database, Microscope, Network, FileText } from 'lucide-react';
import PageShell from '@/components/orchid/PageShell';
import SpeciesGrid from '@/components/orchid/SpeciesGrid';

/**
 * Species — Species Explorer hub page.
 *
 * The grid component already handles search, filtering, and live API
 * loading; this page wraps it in the shared shell and adds context
 * cards explaining what data backs each species profile.
 */

const PILLARS = [
  {
    icon: Database,
    title: 'Authoritative taxonomy',
    body: 'Canonical names reconciled against POWO, WCSP, and Tropicos via the Continuum taxonomy service.',
  },
  {
    icon: Microscope,
    title: 'Trait + ecology',
    body: 'Growth form, habitat, elevation, biome, and ecological partners surfaced through the species profile API.',
  },
  {
    icon: Network,
    title: 'Interaction intelligence',
    body: 'Pollinators and floral visitors aggregated from GloBI through the oc_api interaction views.',
  },
  {
    icon: FileText,
    title: 'Knowledge gaps',
    body: 'Every profile shows what is known, partial, and missing — turning blanks into research opportunities.',
  },
];

const Species: React.FC = () => {
  return (
    <PageShell
      eyebrow="Species Explorer"
      title="The taxonomic spine"
      titleAccent="of the Continuum."
      intro="Search any genus, species epithet, country, or habitat. Every result is a doorway into a living, API-fed species profile — taxonomy, gallery, ecology, and conservation."
    >
      <SpeciesGrid />

      <section className="py-20 border-t border-white/5 bg-[#0a1812]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-xs tracking-[0.25em] uppercase text-emerald-300/70 mb-3">
            What backs every species profile
          </div>
          <h2 className="font-serif text-3xl md:text-4xl max-w-3xl mb-10">
            Four data spines, one cohesive page.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {PILLARS.map(p => {
              const Icon = p.icon;
              return (
                <div
                  key={p.title}
                  className="rounded-2xl border border-white/10 bg-[#142a1f] p-6"
                >
                  <div className="w-10 h-10 rounded-lg bg-emerald-300/10 border border-emerald-300/20 flex items-center justify-center text-emerald-200 mb-4">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="font-serif text-xl mb-2">{p.title}</div>
                  <p className="text-sm text-white/60 leading-relaxed">
                    {p.body}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </PageShell>
  );
};

export default Species;
