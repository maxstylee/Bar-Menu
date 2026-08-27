import React, { useState, useEffect } from "react";
import { Modal } from "../common/Modal";
import { Button } from "../common/Button";
import { Input } from "../common/Input";
import { useLanguage } from "../../context/LanguageContext";
import { Euro, DollarSign } from "lucide-react";

export function QuickEditPriceModal({
  item,
  isOpen,
  onClose,
  onSave, // (itemId, newPrice) => Promise<void>
}) {
  const { getLocalizedField, t } = useLanguage();
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (item) {
      setPrice(item.price ? String(item.price) : "");
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
      await onSave(item.id, numPrice);
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
        <Input
          label={t("fieldPrice")}
          type="number"
          step="0.10"
          min="0"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          error={error}
          icon={Euro}
          autoFocus
          required
        />

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
