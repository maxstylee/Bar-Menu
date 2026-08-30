import React from "react";
import { useLanguage } from "../../context/LanguageContext";
import { formatItemPrice } from "../../utils/translations";
import { Badge, VolumeBadge } from "../common/Badge";
import {
  Edit3,
  Trash2,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
} from "lucide-react";

export function AdminBeverageTable({
  items = [],
  categories = [],
  onEditItem,
  onDeleteItem,
  onQuickEditPrice,
  onToggleAvailability,
  onRollbackImage,
}) {
  const { getLocalizedField, t } = useLanguage();

  const getCategoryName = (catId) => {
    const cat = categories.find((c) => c.id === catId);
    return cat ? getLocalizedField(cat, "name") : "General";
  };

  if (items.length === 0) {
    return (
      <div className="bg-[#161f30] border border-slate-800 rounded-2xl p-12 text-center">
        <ImageIcon className="w-12 h-12 mx-auto mb-3 text-slate-600" />
        <h4 className="text-base font-bold text-slate-300 font-outfit">
          {t("noItemsInAdmin")}
        </h4>
        <p className="text-xs text-slate-500 mt-1">
          Add your first beverage using the button above.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#161f30] border border-slate-800 rounded-2xl overflow-hidden shadow-lounge-card">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#131b2a] border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="py-3.5 px-4">{t("colImage")}</th>
              <th className="py-3.5 px-4">{t("colTitle")}</th>
              <th className="py-3.5 px-4">{t("colCategory")}</th>
              <th className="py-3.5 px-4">{t("colPrice")}</th>
              <th className="py-3.5 px-4">{t("colVolume")}</th>
              <th className="py-3.5 px-4">{t("colStatus")}</th>
              <th className="py-3.5 px-4 text-right">{t("colActions")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs text-slate-200 font-medium">
            {items.map((item) => {
              const title = getLocalizedField(item, "title");
              const isAvailable = item.is_available !== false;
              const hasBackupImage = Boolean(item.previous_image_url);

              return (
                <tr
                  key={item.id}
                  className="hover:bg-[#1c283e]/60 transition-colors group"
                >
                  {/* Thumbnail */}
                  <td className="py-3 px-4">
                    <div className="relative w-14 h-11 rounded-lg overflow-hidden bg-slate-900 border border-slate-800 flex-shrink-0">
                      <img
                        src={
                          item.current_image_url ||
                          "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80"
                        }
                        alt={title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      {hasBackupImage && (
                        <div
                          title="Backup image slot ready"
                          className="absolute bottom-0.5 right-0.5 bg-amber-500 rounded-full w-2.5 h-2.5 border border-slate-900 shadow-sm"
                        />
                      )}
                    </div>
                  </td>

                  {/* Title & Tags */}
                  <td className="py-3 px-4 max-w-xs">
                    <div className="font-outfit font-bold text-sm text-slate-100 group-hover:text-amber-400 transition-colors line-clamp-1">
                      {title}
                    </div>
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex gap-1 mt-1 flex-wrap">
                        {item.tags.slice(0, 2).map((tag, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] text-slate-400 bg-slate-800/80 px-1.5 py-0.5 rounded border border-slate-700/50"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>

                  {/* Category */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <Badge variant="slate" size="xs">
                      {getCategoryName(item.category_id)}
                    </Badge>
                  </td>

                  {/* Price with Quick Edit Trigger */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <button
                      onClick={() => onQuickEditPrice(item)}
                      className="group/price flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#131b2a] hover:bg-amber-500/10 border border-slate-800 hover:border-amber-500/40 text-amber-400 font-extrabold text-sm transition-all"
                      title="Click to quick-edit price and currency"
                    >
                      <span>{formatItemPrice(item.price, item.currency)}</span>
                      <Edit3 className="w-3 h-3 text-slate-500 group-hover/price:text-amber-400 opacity-0 group-hover/price:opacity-100 transition-opacity" />
                    </button>
                  </td>

                  {/* Volume & Alcohol */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <VolumeBadge
                      volume_ml={item.volume_ml}
                      abv={item.abv}
                      is_alcoholic={item.is_alcoholic}
                    />
                  </td>

                  {/* Availability / Stop-List Toggle */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <button
                      onClick={() => onToggleAvailability(item.id)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold transition-all border ${
                        isAvailable
                          ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/25"
                          : "bg-rose-500/15 text-rose-300 border-rose-500/30 hover:bg-rose-500/25"
                      }`}
                    >
                      {isAvailable ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{t("inStockStatus")}</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                          <span>{t("outOfStockStatus")}</span>
                        </>
                      )}
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Rollback Image Button */}
                      {hasBackupImage && (
                        <button
                          onClick={() => onRollbackImage(item.id)}
                          className="p-2 rounded-xl bg-slate-800/80 hover:bg-amber-500/20 text-slate-400 hover:text-amber-300 border border-slate-700/60 hover:border-amber-500/40 transition-all"
                          title={t("restorePrevious")}
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {/* Edit Button */}
                      <button
                        onClick={() => onEditItem(item)}
                        className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-all"
                        title={t("editItem")}
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => onDeleteItem(item)}
                        className="p-2 rounded-xl bg-slate-800/80 hover:bg-rose-900/50 text-slate-400 hover:text-rose-300 border border-slate-700/60 hover:border-rose-800/50 transition-all"
                        title={t("deleteItem")}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
