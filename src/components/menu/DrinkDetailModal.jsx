import React from "react";
import { Modal } from "../common/Modal";
import { VolumeBadge, Badge } from "../common/Badge";
import { useLanguage } from "../../context/LanguageContext";
import { Button } from "../common/Button";
import { Sparkles, AlertCircle, CheckCircle2 } from "lucide-react";

export function DrinkDetailModal({ item, isOpen, onClose }) {
  const { getLocalizedField, t } = useLanguage();

  if (!item) return null;

  const title = getLocalizedField(item, "title");
  const description = getLocalizedField(item, "description");
  const isAvailable = item.is_available !== false;

  const priceTry = item.price_try !== undefined && item.price_try !== null ? item.price_try : Math.round((item.price || 0) * 35);
  const priceUsd = item.price_usd !== undefined && item.price_usd !== null ? item.price_usd : (item.price || 0);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-xl"
      className="p-0 overflow-hidden"
    >
      <div className="flex flex-col gap-5">
        {/* Full Header Image */}
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-slate-900 -mt-1">
          <img
            src={
              item.current_image_url ||
              "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80"
            }
            alt={title}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#161f30] via-transparent to-black/40" />

          {/* Floating Dual Price Tag */}
          <div className="absolute bottom-3 right-3 bg-gradient-to-r from-slate-900 to-[#131b2a] border border-amber-500/50 font-outfit font-extrabold text-lg px-4 py-1.5 rounded-xl shadow-amber-glow flex items-center gap-2">
            <span className="text-amber-400">₺{Number(priceTry).toFixed(0)}</span>
            <span className="text-slate-600 font-normal">/</span>
            <span className="text-emerald-400">${Number(priceUsd).toFixed(2)}</span>
          </div>

          {/* Top Status */}
          <div className="absolute top-3 left-3">
            {isAvailable ? (
              <Badge
                variant="emerald"
                size="sm"
                className="font-semibold shadow-md"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                {t("available")}
              </Badge>
            ) : (
              <Badge
                variant="rose"
                size="sm"
                className="font-semibold shadow-md"
              >
                <AlertCircle className="w-3.5 h-3.5" />
                {t("outOfStock")}
              </Badge>
            )}
          </div>
        </div>

        {/* Details & Tasting Notes */}
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold font-outfit text-white">
              {title}
            </h2>
            <div className="mt-2.5 flex items-center gap-2 flex-wrap">
              <VolumeBadge
                volume_ml={item.volume_ml}
                abv={item.abv}
                is_alcoholic={item.is_alcoholic}
              />
            </div>
          </div>

          {/* Tasting notes / Description */}
          {description && (
            <div className="bg-[#131b2a] border border-slate-800/80 rounded-xl p-4">
              <h4 className="text-xs font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                {t("tastingNotes")}
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed">
                {description}
              </p>
            </div>
          )}

          {/* Tags */}
          {item.tags && item.tags.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap pt-1">
              {item.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="text-xs font-medium text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <Button variant="secondary" onClick={onClose} size="md">
            {t("close")}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
