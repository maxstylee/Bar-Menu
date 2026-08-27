import React, { useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { VolumeBadge, Badge } from "../common/Badge";
import { AlertCircle, Eye, Sparkles } from "lucide-react";

export function MenuCard({ item, onClick }) {
  const { getLocalizedField, t } = useLanguage();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const title = getLocalizedField(item, "title");
  const description = getLocalizedField(item, "description");
  const isAvailable = item.is_available !== false;

  // Fallback placeholder image if Unsplash fails
  const fallbackImage =
    "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80";
  const imageUrl =
    imageError || !item.current_image_url
      ? fallbackImage
      : item.current_image_url;

  return (
    <div
      onClick={() => onClick(item)}
      className={`group relative bg-[#161f30] border rounded-2xl overflow-hidden shadow-lounge-card transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl cursor-pointer flex flex-col justify-between ${
        isAvailable
          ? "border-slate-800/90 hover:border-amber-500/40 hover:shadow-amber-900/20"
          : "border-slate-800/50 opacity-75 grayscale-[30%]"
      }`}
    >
      {/* Top Image Container with Fixed 4/3 Aspect Ratio (Zero CLS) */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-900">
        {/* Shimmer skeleton while loading */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-slate-800/80 animate-pulse flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-slate-600 animate-spin" />
          </div>
        )}

        <img
          src={imageUrl}
          alt={title}
          loading="lazy"
          decoding="async"
          onLoad={() => setImageLoaded(true)}
          onError={() => {
            setImageError(true);
            setImageLoaded(true);
          }}
          className={`w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Ambient Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#161f30] via-transparent to-black/30 pointer-events-none" />

        {/* Badges on Image Overlay */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
          <VolumeBadge
            volume_ml={item.volume_ml}
            abv={item.abv}
            is_alcoholic={item.is_alcoholic}
          />

          {!isAvailable && (
            <Badge variant="rose" size="xs" className="font-bold shadow-md">
              <AlertCircle className="w-3 h-3" />
              {t("outOfStock")}
            </Badge>
          )}
        </div>

        {/* Quick View Button on Hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-xs pointer-events-none">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/90 text-slate-950 font-bold text-xs shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Eye className="w-3.5 h-3.5" />
            {t("viewDetails")}
          </span>
        </div>
      </div>

      {/* Card Content Section */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-3">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-outfit font-bold text-base sm:text-lg text-white group-hover:text-amber-400 transition-colors line-clamp-1">
              {title}
            </h3>
          </div>

          {description && (
            <p className="mt-1 text-xs text-slate-400 line-clamp-2 leading-relaxed font-normal">
              {description}
            </p>
          )}
        </div>

        {/* Bottom Price & Tags Section */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
          {/* Price with warm amber glow */}
          <div className="flex items-baseline gap-1">
            <span className="font-outfit font-extrabold text-lg sm:text-xl text-amber-400 tracking-tight">
              {t("currencySymbol")}
              {Number(item.price).toFixed(2)}
            </span>
          </div>

          {/* First tag or category hint */}
          {item.tags && item.tags.length > 0 && (
            <span className="text-[11px] font-medium text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-700/50">
              #{item.tags[0]}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
