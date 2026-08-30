import React, { useState } from "react";
import { Modal } from "../common/Modal";
import { Button } from "../common/Button";
import { Input } from "../common/Input";
import { useLanguage } from "../../context/LanguageContext";
import {
  Layers,
  PlusCircle,
  Edit3,
  Trash2,
  AlertCircle,
  Sparkles,
  GlassWater,
  Flame,
  Citrus,
  Wine,
  Beer,
  HeartHandshake,
  Coffee,
} from "lucide-react";

const ICON_OPTIONS = [
  { name: "Sparkles", Icon: Sparkles },
  { name: "GlassWater", Icon: GlassWater },
  { name: "Flame", Icon: Flame },
  { name: "Citrus", Icon: Citrus },
  { name: "Wine", Icon: Wine },
  { name: "Beer", Icon: Beer },
  { name: "HeartHandshake", Icon: HeartHandshake },
  { name: "Coffee", Icon: Coffee },
];

export function CategoryManagerModal({
  isOpen,
  onClose,
  categories = [],
  items = [],
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
}) {
  const { t, getLocalizedField } = useLanguage();

  const [editingCategory, setEditingCategory] = useState(null); // null = List or Add mode, category object = Edit
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name_tr: "",
    name_en: "",
    name_ru: "",
    name_de: "",
    icon: "Sparkles",
    sort_order: categories.length + 1,
  });

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormData({
      name_tr: "",
      name_en: "",
      name_ru: "",
      name_de: "",
      icon: "Sparkles",
      sort_order: categories.length + 1,
    });
    setError("");
    setIsFormOpen(true);
  };

  const handleOpenEdit = (cat) => {
    setEditingCategory(cat);
    setFormData({
      name_tr: cat.name_tr || "",
      name_en: cat.name_en || "",
      name_ru: cat.name_ru || "",
      name_de: cat.name_de || "",
      icon: cat.icon || "Sparkles",
      sort_order: cat.sort_order || 1,
    });
    setError("");
    setIsFormOpen(true);
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();

    if (!formData.name_en.trim() && !formData.name_tr.trim()) {
      setError("Please enter category name in at least English or Turkish.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const payload = {
        name_tr: formData.name_tr || formData.name_en,
        name_en: formData.name_en || formData.name_tr,
        name_ru: formData.name_ru || formData.name_en,
        name_de: formData.name_de || formData.name_en,
        icon: formData.icon,
        sort_order: parseInt(formData.sort_order, 10) || 1,
      };

      if (editingCategory) {
        await onUpdateCategory(editingCategory.id, payload);
      } else {
        await onAddCategory(payload);
      }

      setIsFormOpen(false);
    } catch (err) {
      setError(err.message || "Failed to save category");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingCategory) return;
    try {
      setLoading(true);
      await onDeleteCategory(deletingCategory.id);
      setDeletingCategory(null);
    } catch (err) {
      setError(err.message || "Failed to delete category");
    } finally {
      setLoading(false);
    }
  };

  const getItemCount = (catId) => {
    return items.filter((i) => i.category_id === catId).length;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t("manageCategories")}
      subtitle="Add, edit, reorder, or delete beverage categories"
      maxWidth="max-w-2xl"
    >
      <div className="space-y-5">
        {error && (
          <div className="flex items-center gap-2 p-3 bg-rose-950/50 border border-rose-800 rounded-xl text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Action Header: Add Button */}
        {!isFormOpen && !deletingCategory && (
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">
              Total Categories ({categories.length})
            </span>
            <Button
              variant="primary"
              size="sm"
              icon={PlusCircle}
              onClick={handleOpenAdd}
            >
              {t("addCategory")}
            </Button>
          </div>
        )}

        {/* 1. Category Form (Add / Edit) */}
        {isFormOpen && (
          <form
            onSubmit={handleSubmitForm}
            className="bg-[#131b2a] border border-slate-800 rounded-2xl p-4 space-y-4 animate-scale-up"
          >
            <h4 className="text-sm font-bold text-white font-outfit border-b border-slate-800 pb-2">
              {editingCategory ? t("editCategory") : t("addCategory")}
            </h4>

            {/* Multilingual Name Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="English Name (EN)"
                value={formData.name_en}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, name_en: e.target.value }))
                }
                placeholder="e.g. Signature Cocktails"
                required
              />
              <Input
                label="Turkish Name (TR)"
                value={formData.name_tr}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, name_tr: e.target.value }))
                }
                placeholder="e.g. İmza Kokteyller"
              />
              <Input
                label="Russian Name (RU)"
                value={formData.name_ru}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, name_ru: e.target.value }))
                }
                placeholder="e.g. Фирменные коктейли"
              />
              <Input
                label="German Name (DE)"
                value={formData.name_de}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, name_de: e.target.value }))
                }
                placeholder="e.g. Signatur-Cocktails"
              />
            </div>

            {/* Icon Picker & Sort Order */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
                  {t("categoryIcon")}
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {ICON_OPTIONS.map(({ name, Icon }) => (
                    <button
                      key={name}
                      type="button"
                      onClick={() => setFormData((p) => ({ ...p, icon: name }))}
                      className={`p-2 rounded-xl border flex items-center justify-center transition-all ${
                        formData.icon === name
                          ? "bg-amber-500/20 border-amber-500 text-amber-300"
                          : "bg-[#161f30] border-slate-800 text-slate-400 hover:text-white"
                      }`}
                      title={name}
                    >
                      <Icon className="w-4 h-4" />
                    </button>
                  ))}
                </div>
              </div>

              <Input
                label={t("sortOrder")}
                type="number"
                min="1"
                value={formData.sort_order}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, sort_order: e.target.value }))
                }
                placeholder="1"
              />
            </div>

            {/* Form Buttons */}
            <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-800">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setIsFormOpen(false)}
                disabled={loading}
              >
                {t("cancel")}
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                loading={loading}
              >
                {t("saveChanges")}
              </Button>
            </div>
          </form>
        )}

        {/* 2. Delete Safety Warning Modal Sub-View */}
        {deletingCategory && (
          <div className="bg-rose-950/40 border border-rose-800/80 rounded-2xl p-4 space-y-3 animate-scale-up">
            <div className="flex items-center gap-2 text-rose-300 font-bold text-sm">
              <AlertCircle className="w-5 h-5 text-rose-400" />
              <span>{t("confirmDelete")}</span>
            </div>
            <p className="text-xs text-rose-200/90 leading-relaxed">
              {t("deleteCategoryWarning")}
            </p>
            {getItemCount(deletingCategory.id) > 0 && (
              <p className="text-xs font-bold text-amber-300 bg-amber-950/60 p-2 rounded-lg border border-amber-800/50">
                ⚠️ Warning: {getItemCount(deletingCategory.id)} drink(s) are currently assigned to "{getLocalizedField(deletingCategory, "name")}".
              </p>
            )}
            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setDeletingCategory(null)}
                disabled={loading}
              >
                {t("cancel")}
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleDeleteConfirm}
                loading={loading}
              >
                {t("deleteCategory")}
              </Button>
            </div>
          </div>
        )}

        {/* 3. Category List Table */}
        {!isFormOpen && !deletingCategory && (
          <div className="bg-[#131b2a] border border-slate-800 rounded-2xl overflow-hidden">
            <div className="divide-y divide-slate-800/60">
              {categories.map((cat) => {
                const count = getItemCount(cat.id);
                return (
                  <div
                    key={cat.id}
                    className="p-3.5 flex items-center justify-between gap-3 hover:bg-[#161f30] transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700/60 flex items-center justify-center text-amber-400 flex-shrink-0">
                        <Layers className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-outfit font-bold text-sm text-white truncate">
                          {getLocalizedField(cat, "name")}
                        </h4>
                        <p className="text-[11px] text-slate-400 truncate">
                          Sort Order: {cat.sort_order} • {count} item(s)
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        onClick={() => handleOpenEdit(cat)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-all cursor-pointer"
                        title={t("editCategory")}
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeletingCategory(cat)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/50 text-slate-400 hover:text-rose-300 border border-slate-700/60 transition-all cursor-pointer"
                        title={t("deleteCategory")}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex justify-end pt-3 border-t border-slate-800">
          <Button variant="secondary" size="md" onClick={onClose}>
            {t("close")}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
