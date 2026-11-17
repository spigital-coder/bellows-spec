import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  ImageOff,
  ExternalLink,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import { PRODUCT_PHOTOS, ProductPhoto } from '../data/productPhotos';

interface ProductPhotoGalleryProps {
  onNavigateToConfigurator: () => void;
}

const normalizeSearchText = (text: string): string =>
  text
    .toLowerCase()
    .replace(/[-_"',./()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

interface GalleryImageProps {
  photo: ProductPhoto;
}

const GalleryImage: React.FC<GalleryImageProps> = ({ photo }) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-slate-100 p-4 text-center text-slate-400">
        <ImageOff size={24} className="text-slate-300" />
        <span className="text-xs font-medium text-slate-500 line-clamp-2">
          {photo.title}
        </span>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full bg-white">
      <img
        src={photo.url}
        alt={photo.title}
        referrerPolicy="no-referrer"
        onError={() => setHasError(true)}
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
    </div>
  );
};

export const ProductPhotoGallery: React.FC<ProductPhotoGalleryProps> = ({
  onNavigateToConfigurator,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [autoLoadedCount, setAutoLoadedCount] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Start at 0 photos on page open and automatically load all photos in batches
  useEffect(() => {
    if (autoLoadedCount >= PRODUCT_PHOTOS.length) return;

    const delay = autoLoadedCount === 0 ? 180 : 120;
    const timer = window.setTimeout(() => {
      setAutoLoadedCount((prev) => Math.min(prev + 6, PRODUCT_PHOTOS.length));
    }, delay);

    return () => window.clearTimeout(timer);
  }, [autoLoadedCount]);

  const isSearching = searchQuery.trim().length > 0;

  const filteredPhotos = useMemo(() => {
    const normalizedQuery = normalizeSearchText(searchQuery);
    if (!normalizedQuery) return PRODUCT_PHOTOS;

    const terms = normalizedQuery.split(' ').filter(Boolean);

    return PRODUCT_PHOTOS.filter((photo) => {
      const filename = photo.url.split('/').pop() || '';
      const searchable = normalizeSearchText(
        `${photo.title} ${photo.category} ${photo.keywords} ${filename}`
      );
      const compactSearchable = searchable.replace(/\s+/g, '');

      return terms.every(
        (term) => searchable.includes(term) || compactSearchable.includes(term)
      );
    });
  }, [searchQuery]);

  // When searching, show all relevant results immediately; otherwise show auto-loaded photos (0 -> 31)
  const displayedPhotos = useMemo(() => {
    if (isSearching) {
      return filteredPhotos;
    }
    return filteredPhotos.slice(0, autoLoadedCount);
  }, [isSearching, filteredPhotos, autoLoadedCount]);

  const isAutoLoading = !isSearching && autoLoadedCount < PRODUCT_PHOTOS.length;

  const activePhoto =
    lightboxIndex !== null && displayedPhotos[lightboxIndex]
      ? displayedPhotos[lightboxIndex]
      : null;

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  const showPrevPhoto = useCallback(() => {
    setLightboxIndex((prev) => {
      if (prev === null || displayedPhotos.length === 0) return null;
      return (prev - 1 + displayedPhotos.length) % displayedPhotos.length;
    });
  }, [displayedPhotos.length]);

  const showNextPhoto = useCallback(() => {
    setLightboxIndex((prev) => {
      if (prev === null || displayedPhotos.length === 0) return null;
      return (prev + 1) % displayedPhotos.length;
    });
  }, [displayedPhotos.length]);

  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowLeft') {
        showPrevPhoto();
      } else if (e.key === 'ArrowRight') {
        showNextPhoto();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [lightboxIndex, closeLightbox, showPrevPhoto, showNextPhoto]);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <section className="flex flex-col gap-6 border-b border-slate-200 pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <span className="font-semibold text-brand">Bellows Systems</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums font-medium text-slate-700">
              {PRODUCT_PHOTOS.length} Total Photos
            </span>
            <span aria-hidden="true">·</span>
            <span>Houston, Texas</span>
          </div>
          <h1 className="font-sans text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl text-balance">
            Photo Gallery
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-slate-500">
            Explore our complete engineering catalog of metallic bellows, gimbal and hinged assemblies, rectangular fabric expansion joints, and engine exhaust connectors. Click any photo to open the lightbox viewer.
          </p>
        </div>

        {/* Live Photo Count Summary */}
        <div className="flex items-baseline gap-6 border-t border-slate-200 pt-4 lg:border-t-0 lg:pt-0">
          <div>
            <span className="block text-xs font-medium text-slate-500">
              {isSearching
                ? 'Matching Photos'
                : isAutoLoading
                  ? 'Loading Photos'
                  : 'Total Photos'}
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="font-sans text-3xl font-bold tabular-nums text-slate-900">
                {displayedPhotos.length}
              </span>
              <span className="text-sm font-medium text-slate-400 tabular-nums">
                / {PRODUCT_PHOTOS.length} Photos
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Search Bar */}
      <section aria-label="Search product photos" className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-2xl">
          <Search
            size={18}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setLightboxIndex(null);
            }}
            placeholder="Search photos (e.g. Copper, Inconel, Exhaust, Fabric, Actuator, 30-Inch...)"
            aria-label="Search product photos"
            className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-11 text-sm text-slate-900 placeholder:text-slate-400 shadow-xs transition-colors focus:border-brand focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/20"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setLightboxIndex(null);
              }}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 text-sm text-slate-500 tabular-nums">
          {isAutoLoading ? (
            <span className="flex items-center gap-2 text-slate-600 font-medium">
              <Loader2 size={15} className="animate-spin text-brand" />
              Loading {displayedPhotos.length} of {PRODUCT_PHOTOS.length} photos...
            </span>
          ) : isSearching ? (
            <span>
              Found <strong className="text-slate-900">{displayedPhotos.length}</strong> relevant{' '}
              {displayedPhotos.length === 1 ? 'photo' : 'photos'}
            </span>
          ) : (
            <span>
              Showing all <strong className="text-slate-900">{displayedPhotos.length}</strong> photos
            </span>
          )}
        </div>
      </section>

      {/* Gallery Grid */}
      {isSearching && displayedPhotos.length === 0 ? (
        <section className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-20 text-center">
          <Search size={32} className="mb-4 text-slate-300" />
          <h2 className="text-lg font-semibold text-slate-900">
            No matching product photos found
          </h2>
          <p className="mt-2 max-w-md text-sm text-slate-500">
            We couldn&apos;t find any photos matching &ldquo;{searchQuery}&rdquo;. Try another keyword like &ldquo;Copper&rdquo;, &ldquo;Inconel&rdquo;, &ldquo;Exhaust&rdquo;, or &ldquo;Fabric&rdquo;.
          </p>
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="mt-6 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800 cursor-pointer"
          >
            Show All {PRODUCT_PHOTOS.length} Photos
          </button>
        </section>
      ) : (
        <section aria-label="Product photo gallery" className="space-y-6">
          {/* Profile Header Strip */}
          <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-900 p-2.5">
                <img
                  src="https://www.bellows-systems.com/wp-content/uploads/2020/04/BS-Logo-White.png.webp"
                  alt="Bellows Systems"
                  className="h-auto w-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-slate-900">
                    bellows.systems
                  </h2>
                  <span aria-hidden="true" className="text-slate-300">·</span>
                  <span className="text-xs font-medium text-slate-500">
                    Industrial Manufacturing
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-slate-500">
                  Metallic &amp; Fabric Expansion Joints · Engineered in Houston, TX since 1974
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6 border-t border-slate-100 pt-3 sm:border-t-0 sm:pt-0">
              <div className="text-left sm:text-right">
                <span className="block text-lg font-bold tabular-nums text-slate-900">
                  {displayedPhotos.length}
                </span>
                <span className="text-xs text-slate-500">
                  {isSearching ? 'Search Results' : 'Loaded'}
                </span>
              </div>
              <div className="text-left sm:text-right">
                <span className="block text-lg font-bold tabular-nums text-slate-900">
                  {PRODUCT_PHOTOS.length}
                </span>
                <span className="text-xs text-slate-500">Total Photos</span>
              </div>
            </div>
          </div>

          {/* 3-Column Square Photo Grid */}
          {displayedPhotos.length === 0 ? (
            <div className="grid grid-cols-3 gap-1.5 sm:gap-3 md:gap-4" aria-busy="true">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={idx}
                  className="aspect-square w-full animate-pulse rounded-lg sm:rounded-xl border border-slate-200 bg-slate-100"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-1.5 sm:gap-3 md:gap-4">
              {displayedPhotos.map((photo, index) => (
                <motion.button
                  key={photo.id}
                  type="button"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => openLightbox(index)}
                  aria-label={`Open ${photo.title} in lightbox`}
                  className="group relative aspect-square w-full overflow-hidden rounded-lg sm:rounded-xl border border-slate-200 bg-white text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-brand cursor-pointer"
                >
                  <GalleryImage photo={photo} />
                  <div className="absolute inset-0 flex flex-col justify-between bg-gradient-to-t from-black/80 via-black/25 to-transparent p-2.5 sm:p-4 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
                    <div className="flex justify-end">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-xs">
                        <Maximize2 size={14} />
                      </span>
                    </div>
                    <div>
                      <p className="text-[11px] sm:text-xs font-medium text-slate-300 line-clamp-1">
                        {photo.category}
                      </p>
                      <p className="text-xs sm:text-sm font-semibold text-white line-clamp-2">
                        {photo.title}
                      </p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Bottom CTA Banner */}
      <section className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-slate-200 bg-white p-6 sm:flex-row sm:items-center sm:p-8">
        <div className="space-y-1.5">
          <h2 className="text-xl font-semibold text-slate-900">
            Need a Custom Expansion Joint?
          </h2>
          <p className="text-sm text-slate-500">
            Submit your ducting dimensions, operating temperature, and movement requirements directly to our engineering team.
          </p>
        </div>
        <button
          type="button"
          onClick={onNavigateToConfigurator}
          className="flex items-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark whitespace-nowrap shrink-0 cursor-pointer"
        >
          Open Spec Configurator
          <ArrowRight size={16} />
        </button>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activePhoto && lightboxIndex !== null && (
          <motion.div
            key="photo-lightbox"
            role="dialog"
            aria-modal="true"
            aria-label={activePhoto.title}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={closeLightbox}
            className="fixed inset-0 z-50 flex flex-col justify-between bg-black/95 p-4 sm:p-6 backdrop-blur-sm"
          >
            {/* Top Lightbox Header */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 text-white"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="tabular-nums font-semibold text-white">
                    {String(lightboxIndex + 1).padStart(2, '0')} /{' '}
                    {String(displayedPhotos.length).padStart(2, '0')}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{activePhoto.category}</span>
                </div>
                <h2 className="mt-0.5 truncate text-base font-semibold text-white sm:text-lg">
                  {activePhoto.title}
                </h2>
              </div>

              <button
                type="button"
                onClick={closeLightbox}
                aria-label="Close lightbox"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition-colors hover:bg-white hover:text-slate-900 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Center Image Stage */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative mx-auto my-4 flex w-full max-w-5xl flex-1 items-center justify-center overflow-hidden"
            >
              {displayedPhotos.length > 1 && (
                <button
                  type="button"
                  onClick={showPrevPhoto}
                  aria-label="Previous photo"
                  className="absolute left-2 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/70 text-white transition-colors hover:bg-white hover:text-slate-900 sm:left-4 cursor-pointer"
                >
                  <ChevronLeft size={22} />
                </button>
              )}

              <motion.div
                key={activePhoto.id}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.16 }}
                className="flex max-h-[72vh] max-w-full items-center justify-center overflow-hidden rounded-2xl bg-white p-3 sm:p-6 shadow-2xl"
              >
                <img
                  src={activePhoto.url}
                  alt={activePhoto.title}
                  referrerPolicy="no-referrer"
                  className="max-h-[65vh] w-auto max-w-full object-contain"
                />
              </motion.div>

              {displayedPhotos.length > 1 && (
                <button
                  type="button"
                  onClick={showNextPhoto}
                  aria-label="Next photo"
                  className="absolute right-2 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/70 text-white transition-colors hover:bg-white hover:text-slate-900 sm:right-4 cursor-pointer"
                >
                  <ChevronRight size={22} />
                </button>
              )}
            </div>

            {/* Bottom Lightbox Footer */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-4 text-sm text-slate-300"
            >
              <p className="text-xs text-slate-400">
                Use <span className="text-white font-medium">←</span> /{' '}
                <span className="text-white font-medium">→</span> arrow keys to navigate or{' '}
                <span className="text-white font-medium">ESC</span> to close
              </p>

              <div className="flex items-center gap-3">
                <a
                  href={activePhoto.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-lg border border-white/20 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-white/10 whitespace-nowrap"
                >
                  Open Image
                  <ExternalLink size={13} />
                </a>
                <button
                  type="button"
                  onClick={() => {
                    closeLightbox();
                    onNavigateToConfigurator();
                  }}
                  className="flex items-center gap-1.5 rounded-lg bg-brand px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-brand-dark whitespace-nowrap cursor-pointer"
                >
                  Request Spec Quote
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
