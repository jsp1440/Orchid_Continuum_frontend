import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CircleDashed } from 'lucide-react';
import Navbar from '@/components/orchid/Navbar';
import Footer from '@/components/orchid/Footer';
import AtlasFilterPanel from '@/components/atlas/AtlasFilterPanel';
import AtlasLayerToggles, { LAYER_TOGGLES } from '@/components/atlas/AtlasLayerToggles';
import AtlasTemporalSlider from '@/components/atlas/AtlasTemporalSlider';
import AtlasMap from '@/components/atlas/AtlasMap';
import {
  atlasApi,
  ATLAS_PLACEHOLDER_MESSAGE,
  type AtlasFilters,
  type AtlasLayer,
  type AtlasLayerKind,
} from '@/lib/atlas';

/**
 * Atlas page — live, layered geospatial workspace.
 *
 * Architecture:
 *   FilterPanel (AtlasFilters envelope)
 *      │
 *      ▼
 *   Active layer set ──► atlasApi.* ──► AtlasMap (Leaflet)
 *      ▲
 *   LayerToggles + TemporalSlider mutate the same envelope.
 *
 * Every layer is fetched through the typed contracts in `src/lib/atlas.ts`.
 * No coordinates are hard-coded; transparent empty states are shown until
 * the API is reachable.
 */

const TEMPORAL_MIN = 1850;
const TEMPORAL_MAX = new Date().getUTCFullYear();

const Atlas: React.FC = () => {
  const [filters, setFilters] = useState<AtlasFilters>({
    year_from: 1970,
    year_to: TEMPORAL_MAX,
  });
  const [activeLayers, setActiveLayers] = useState<Set<AtlasLayerKind>>(
    new Set(['occurrence']),
  );

  // layerKind -> AtlasLayer
  const [layerData, setLayerData] = useState<
    Record<string, { kind: AtlasLayerKind; features: AtlasLayer['features'] }>
  >({});
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  const toggleLayer = useCallback((kind: AtlasLayerKind) => {
    setActiveLayers(prev => {
      const next = new Set(prev);
      if (next.has(kind)) next.delete(kind);
      else next.add(kind);
      return next;
    });
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({ year_from: 1970, year_to: TEMPORAL_MAX });
  }, []);

  // Fetch each active layer whenever filters or active set changes.
  useEffect(() => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    if (activeLayers.size === 0) {
      setLayerData({});
      setStatusMessage('No layers selected');
      return;
    }

    let cancelled = false;
    setLoading(true);
    setStatusMessage(null);

    const fetchOne = async (
      kind: AtlasLayerKind,
    ): Promise<[AtlasLayerKind, AtlasLayer | null, string | null]> => {
      try {
        if (kind === 'occurrence') {
          const r = await atlasApi.occurrences(filters, controller.signal);
          if (r.unconfigured) return [kind, null, ATLAS_PLACEHOLDER_MESSAGE];
          return [kind, r.data, r.error?.message ?? null];
        }
        if (kind === 'genus') {
          if (!filters.genus) {
            return [kind, null, 'Genus filter required for genus map'];
          }
          const r = await atlasApi.genusMap(filters.genus, controller.signal);
          if (r.unconfigured) return [kind, null, ATLAS_PLACEHOLDER_MESSAGE];
          return [kind, r.data, r.error?.message ?? null];
        }
        if (kind === 'temporal') {
          const r = await atlasApi.temporal(filters, controller.signal);
          if (r.unconfigured) return [kind, null, ATLAS_PLACEHOLDER_MESSAGE];
          return [kind, r.data, r.error?.message ?? null];
        }
        // overlays
        const r = await atlasApi.overlay(
          kind as Exclude<AtlasLayerKind, 'genus' | 'species' | 'occurrence'>,
          filters,
          controller.signal,
        );
        if (r.unconfigured) return [kind, null, ATLAS_PLACEHOLDER_MESSAGE];
        return [kind, r.data, r.error?.message ?? null];
      } catch (e) {
        return [kind, null, (e as Error)?.message ?? 'Layer fetch failed'];
      }
    };

    Promise.all(Array.from(activeLayers).map(fetchOne))
      .then(results => {
        if (cancelled) return;
        const next: Record<
          string,
          { kind: AtlasLayerKind; features: AtlasLayer['features'] }
        > = {};
        const messages: string[] = [];
        for (const [kind, layer, msg] of results) {
          if (layer && Array.isArray(layer.features) && layer.features.length) {
            next[kind] = { kind, features: layer.features };
          } else if (msg) {
            messages.push(`${kind}: ${msg}`);
          }
        }
        setLayerData(next);
        if (Object.keys(next).length === 0) {
          setStatusMessage(messages[0] ?? ATLAS_PLACEHOLDER_MESSAGE);
        } else {
          setStatusMessage(
            `${Object.values(next).reduce((n, l) => n + l.features.length, 0)} features · ${
              Object.keys(next).length
            } layer${Object.keys(next).length === 1 ? '' : 's'}`,
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [filters, activeLayers]);

  const temporalActive = activeLayers.has('temporal');

  const summaryChips = useMemo(() => {
    const chips: string[] = [];
    if (filters.genus) chips.push(`genus: ${filters.genus}`);
    if (filters.species) chips.push(`species: ${filters.species}`);
    if (filters.country) chips.push(`country: ${filters.country}`);
    if (filters.elevation_min != null || filters.elevation_max != null) {
      chips.push(
        `elevation: ${filters.elevation_min ?? '—'}–${filters.elevation_max ?? '—'} m`,
      );
    }
    if (filters.biome) chips.push(`biome: ${filters.biome}`);
    if (filters.year_from || filters.year_to) {
      chips.push(`years: ${filters.year_from ?? TEMPORAL_MIN}–${filters.year_to ?? TEMPORAL_MAX}`);
    }
    return chips;
  }, [filters]);

  return (
    <div
      className="min-h-screen bg-[#0d1f17] text-white antialiased"
      style={{ fontFamily: '"Inter", system-ui, -apple-system, sans-serif' }}
    >
      <style>{`
        .font-serif { font-family: 'Cormorant Garamond', 'Playfair Display', Georgia, serif; font-weight: 500; letter-spacing: -0.01em; }
      `}</style>
      <Navbar />

      <main className="pt-24">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-white/5">
          <div className="absolute inset-0 opacity-30 pointer-events-none">
            <div className="absolute top-1/4 left-10 w-96 h-96 rounded-full bg-emerald-400/20 blur-3xl" />
            <div className="absolute bottom-1/4 right-10 w-96 h-96 rounded-full bg-emerald-200/10 blur-3xl" />
          </div>
          <div className="relative max-w-7xl mx-auto px-6 lg:px-10 py-16">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-emerald-200 transition-colors mb-8"
            >
              <ArrowLeft className="h-4 w-4" /> Return to Continuum
            </Link>

            <div className="text-xs tracking-[0.3em] uppercase text-emerald-200/80 mb-4">
              Geospatial Intelligence Layer
            </div>
            <h1 className="font-serif text-4xl md:text-6xl leading-[1.05] max-w-4xl">
              The Atlas<br />
              <span className="italic text-emerald-200/95">a living map of Orchidaceae.</span>
            </h1>
            <p className="text-base md:text-lg text-white/70 mt-6 max-w-2xl leading-relaxed font-light">
              Toggle layers, refine filters, scrub through time. Every layer
              is fetched through the typed Atlas API contract — no
              coordinates are hard-coded.
            </p>
          </div>
        </section>

        {/* Workspace */}
        <section className="py-10">
          <div className="max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-3">
              <AtlasFilterPanel
                filters={filters}
                onChange={setFilters}
                onReset={resetFilters}
              />
            </div>

            <div className="lg:col-span-9 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <AtlasLayerToggles active={activeLayers} onToggle={toggleLayer} />
                <div className="text-[10px] tracking-[0.25em] uppercase text-white/45">
                  {LAYER_TOGGLES.length} layer contracts · {activeLayers.size} active
                </div>
              </div>

              <AtlasMap
                layers={layerData}
                loading={loading}
                status={statusMessage}
              />

              {temporalActive && (
                <AtlasTemporalSlider
                  min={TEMPORAL_MIN}
                  max={TEMPORAL_MAX}
                  yearFrom={filters.year_from ?? TEMPORAL_MIN}
                  yearTo={filters.year_to ?? TEMPORAL_MAX}
                  onChange={(yearFrom, yearTo) =>
                    setFilters(f => ({ ...f, year_from: yearFrom, year_to: yearTo }))
                  }
                />
              )}

              {summaryChips.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {summaryChips.map(c => (
                    <span
                      key={c}
                      className="px-3 py-1 rounded-full border border-white/15 text-[10px] tracking-[0.15em] uppercase text-white/65"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Architecture footer */}
        <section className="py-16 border-t border-white/5 bg-[#0a1812]">
          <div className="max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-5">
              <div className="text-xs tracking-[0.25em] uppercase text-emerald-300/80 mb-3">
                Filter Envelope
              </div>
              <h2 className="font-serif text-3xl md:text-4xl">
                Every layer accepts the same filter shape.
              </h2>
              <p className="text-sm text-white/60 mt-5 leading-relaxed">
                A consistent <code className="text-emerald-200/90">AtlasFilters</code>{' '}
                envelope lets the UI compose layers at runtime — for
                example, "Bulbophyllum × pollinator overlap in Borneo above
                1,500 m, 1990 – 2024" — without bespoke code per layer.
              </p>
            </div>
            <div className="lg:col-span-7">
              <div className="rounded-2xl border border-white/10 bg-[#142a1f] p-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    'genus',
                    'species',
                    'country',
                    'elevation',
                    'interaction type',
                    'pollinator',
                    'fungal partner',
                    'time range',
                    'biome',
                  ].map(f => (
                    <div
                      key={f}
                      className="px-3 py-2 rounded-full border border-white/15 text-xs tracking-[0.15em] uppercase text-white/75 text-center"
                    >
                      {f}
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-emerald-300/70">
                  <CircleDashed className="h-3.5 w-3.5" />
                  Renderer: Leaflet (CDN). Swappable for MapLibre GL or deck.gl.
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Atlas;
