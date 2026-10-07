import React, { useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { formatItemPrice } from "../../utils/translations";
import { resolveAssetUrl } from "../../utils/assetHelper";
import { SUBCATEGORY_DEFAULT_IMAGES } from "../../utils/mockData";
import { Sparkles, Wine, GlassWater, Coffee, Martini } from "lucide-react";

/**
 * Returns the luxury pill badge matching the reference designs:
 * - FEATURED • INCLUDED: Sky cyan glow pill
 * - EXTRA • 10€: Amber glow pill
 * - INCLUDED: Emerald teal glow pill
 * - OUT OF STOCK: Rose warning pill
 */
function DrinkBadge({ item, t }) {
  if (item.is_available === false) {
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border border-rose-500/60 bg-rose-950/40 text-rose-300 shadow-[0_0_10px_rgba(244,63,94,0.25)] shrink-0">
        {t("outOfStock")}
      </span>
    );
  }

  const isExtra = item.is_extra || (Number(item.price) > 0);
  const isFeatured = item.is_featured;

  if (isFeatured && !isExtra) {
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border border-sky-400/60 bg-sky-950/50 text-sky-300 shadow-[0_0_14px_rgba(56,189,248,0.35)] shrink-0">
        {t("badgeFeatured")} • {t("badgeIncluded")}
      </span>
    );
  }

  if (isExtra) {
    const priceText = formatItemPrice(item.price, item.currency || 'EUR');
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border border-amber-500/70 bg-amber-950/50 text-amber-300 shadow-[0_0_14px_rgba(245,158,11,0.35)] shrink-0">
        {t("badgeExtra")} • {priceText}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border border-emerald-400/60 bg-emerald-950/50 text-emerald-300 shadow-[0_0_14px_rgba(52,211,153,0.35)] shrink-0">
      {t("badgeIncluded")}
    </span>
  );
}

function CategoryFallbackIcon({ categoryId }) {
  if (categoryId === 'cocktails') return <Martini className="w-8 h-8 text-sky-400" />;
  if (categoryId === 'alcoholic-drinks') return <Wine className="w-8 h-8 text-amber-400" />;
  if (categoryId === 'cold-drinks') return <GlassWater className="w-8 h-8 text-cyan-400" />;
  return <Coffee className="w-8 h-8 text-orange-400" />;
}

export function MenuCard({ item, onClick }) {
  const { getLocalizedField, t } = useLanguage();
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const title = getLocalizedField(item, "title") || item.title_en || item.name;
  const description = getLocalizedField(item, "description") || item.description_en || "";
  const isAvailable = item.is_available !== false;

  const rawImg =
    item.current_image_url ||
    (item.subcategory && SUBCATEGORY_DEFAULT_IMAGES[item.subcategory]) ||
    null;
  const imageUrl = rawImg ? resolveAssetUrl(rawImg) : null;
  const showFallback = imageError || !imageUrl;

  return (
    <div
      onClick={() => onClick && onClick(item)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick && onClick(item);
        }
      }}
      className={`group relative flex items-center gap-3.5 sm:gap-5 p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl border transition-all duration-300 cursor-pointer text-left select-none w-full min-h-[96px] ${
        isAvailable
          ? "bg-[#0c1420]/75 hover:bg-[#111c2e]/90 border-slate-700/60 hover:border-sky-400/50 shadow-[0_4px_24px_rgba(0,0,0,0.4)] hover:shadow-[0_8px_30px_rgba(3,105,161,0.25)] hover:-translate-y-0.5 active:scale-[0.99]"
          : "bg-[#090e17]/60 border-slate-800/50 opacity-60 grayscale-[40%]"
      } backdrop-blur-md`}
    >
      {/* Circular Image Container with Subtle Glowing Border Ring */}
      <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden shrink-0 border-2 border-slate-600/70 group-hover:border-sky-400/80 group-hover:shadow-[0_0_16px_rgba(56,189,248,0.4)] transition-all bg-[#080d16] flex items-center justify-center">
        {showFallback ? (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
            <CategoryFallbackIcon categoryId={item.category_id} />
          </div>
        ) : (
          <>
            {!imageLoaded && (
              <div className="absolute inset-0 bg-slate-800/80 animate-pulse flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-sky-400/60" />
              </div>
            )}
            <img
              src={imageUrl}
              alt={title}
              loading="lazy"
              decoding="async"
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              className={`w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-110 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
            />
          </>
        )}
      </div>

      {/* Beverage Details & Badge */}
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-outfit font-extrabold text-[15px] sm:text-base text-white tracking-wide uppercase line-clamp-1 group-hover:text-sky-300 transition-colors">
            {title}
          </h3>
          <DrinkBadge item={item} t={t} />
        </div>

        {description && (
          <p className="mt-1 text-xs sm:text-[13px] text-slate-300/85 font-normal line-clamp-2 leading-relaxed">
            {description}
          </p>
        )}

        {item.subcategory && (
          <div className="mt-1.5 flex items-center gap-2">
            <span className="text-[10px] sm:text-[11px] font-semibold text-slate-400/90 tracking-wider uppercase">
              {item.subcategory}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default MenuCard;
