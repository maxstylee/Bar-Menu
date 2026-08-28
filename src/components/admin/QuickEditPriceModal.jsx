import React, { useState, useEffect } from "react";
import { Modal } from "../common/Modal";
import { Button } from "../common/Button";
import { Input } from "../common/Input";
import { useLanguage } from "../../context/LanguageContext";

export function QuickEditPriceModal({
  item,
  isOpen,
  onClose,
  onSave, // (itemId, priceTry, priceUsd) => Promise<void>
}) {
  const { getLocalizedField, t } = useLanguage();
  const [priceTry, setPriceTry] = useState("");
  const [priceUsd, setPriceUsd] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (item) {
      setPriceTry(item.price_try !== undefined && item.price_try !== null ? String(item.price_try) : (item.price ? String(Math.round(item.price * 35)) : ""));
      setPriceUsd(item.price_usd !== undefined && item.price_usd !== null ? String(item.price_usd) : (item.price ? String(item.price) : ""));
      setError("");
    }
  }, [item, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const numTRY = parseFloat(priceTry);
    const numUSD = parseFloat(priceUsd);

    if (isNaN(numTRY) || numTRY < 0 || isNaN(numUSD) || numUSD < 0) {
      setError("Please enter valid prices for both Turkish Lira (₺) and US Dollars ($).");
      return;
    }

    try {
      setLoading(true);
      await onSave(item.id, numTRY, numUSD);
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
            label={t("priceTRY")}
            type="number"
            step="1"
            min="0"
            value={priceTry}
            onChange={(e) => {
              const val = e.target.value;
              setPriceTry(val);
              if (val && !isNaN(parseFloat(val))) {
                setPriceUsd((parseFloat(val) / 35).toFixed(2));
              }
            }}
            autoFocus
            required
          />

          <Input
            label={t("priceUSD")}
            type="number"
            step="0.50"
            min="0"
            value={priceUsd}
            onChange={(e) => {
              const val = e.target.value;
              setPriceUsd(val);
              if (val && !isNaN(parseFloat(val))) {
                setPriceTry((parseFloat(val) * 35).toFixed(0));
              }
            }}
            required
          />
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
