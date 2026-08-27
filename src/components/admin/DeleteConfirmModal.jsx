import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useLanguage } from '../../context/LanguageContext';
import { AlertTriangle } from 'lucide-react';

export function DeleteConfirmModal({
  item,
  isOpen,
  onClose,
  onConfirm, // (itemId) => Promise<void>
}) {
  const { getLocalizedField, t } = useLanguage();
  const [loading, setLoading] = useState(false);

  if (!item) return null;
  const title = getLocalizedField(item, 'title');

  const handleConfirm = async () => {
    try {
      setLoading(true);
      await onConfirm(item.id);
      onClose();
    } catch (err) {
      console.error('Delete error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('confirmDelete')}
      maxWidth="max-w-md"
    >
      <div className="space-y-4">
        <div className="flex items-start gap-3 bg-rose-950/40 border border-rose-800/60 p-4 rounded-xl text-rose-300">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 text-rose-400 mt-0.5" />
          <div className="text-xs space-y-1">
            <p className="font-semibold text-rose-200">{title}</p>
            <p className="text-slate-400">{t('deleteWarningText')}</p>
          </div>
        </div>

        <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-800">
          <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
            {t('cancel')}
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={handleConfirm}
            loading={loading}
          >
            {t('deleteItem')}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
