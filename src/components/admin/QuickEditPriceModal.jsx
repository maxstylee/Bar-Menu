import React, { useState, useEffect } from "react";
import { Modal } from "../common/Modal";
import { Button } from "../common/Button";
import { Input } from "../common/Input";
import { useLanguage } from "../../context/LanguageContext";

export function QuickEditPriceModal({
  item,
  isOpen,
  onClose,
  onSave, // (itemId, newPrice, newCurrency) => Promise<void>
}) {
  const { getLocalizedField, t } = useLanguage();
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState("EUR");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (item) {
      setPrice(item.price !== undefined && item.price !== null ? String(item.price) : "");
      setCurrency(item.currency || "EUR");
      setError("");
    }
  }, [item, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const numPrice = parseFloat(price);

    if (isNaN(numPrice) || numPrice < 0) {
      setError("Please enter a valid non-negative price.");
      return;
    }

    try {
      setLoading(true);
      await onSave(item.id, numPrice, currency);
      onClose();
    } catch (err) {
      setError(err.message || "Failed to update price");
    } finally {
      setLoading(false);
    }
  };

  if (!item) return null;
  const title = getLocalizedField(item, "title");

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t("quickEditPrice")}
      subtitle={title}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <p className="text-xs text-rose-400 font-medium">{error}</p>
        )}

        <div className="grid grid-cols-2 gap-3">
          <Input
            label={t("fieldPrice")}
            type="number"
            step="0.50"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            autoFocus
            required
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              {t("fieldCurrency")}
            </label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full bg-[#131b2a] border border-slate-800 hover:border-slate-700 text-slate-100 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/80 font-bold"
            >
              <option value="EUR" className="bg-[#161f30] text-slate-100">€ EUR</option>
              <option value="TRY" className="bg-[#161f30] text-slate-100">₺ TRY</option>
              <option value="USD" className="bg-[#161f30] text-slate-100">$ USD</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-800">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={loading}
          >
            {t("cancel")}
          </Button>
          <Button type="submit" variant="primary" loading={loading}>
            {t("saveChanges")}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
