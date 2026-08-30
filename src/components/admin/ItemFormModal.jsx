import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { DualImageUploader } from './DualImageUploader';
import { useLanguage } from '../../context/LanguageContext';
import {
  Wine,
  CheckCircle2,
  AlertCircle,
  Tag,
  Percent,
} from 'lucide-react';

export function ItemFormModal({
  isOpen,
  onClose,
  item = null, // null for Add, object for Edit
  categories = [],
  onSave, // (itemPayload, newImageFile) => Promise<void>
  onRollbackImage, // (itemId) => Promise<void>
}) {
  const { t, getLocalizedField } = useLanguage();

  const [activeLangTab, setActiveLangTab] = useState('en');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [isRollbacking, setIsRollbacking] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    category_id: '',
    title_tr: '',
    title_en: '',
    title_ru: '',
    title_de: '',
    description_tr: '',
    description_en: '',
    description_ru: '',
    description_de: '',
    price: '',
    currency: 'EUR',
    volume_ml: '',
    abv: '',
    is_alcoholic: true,
    is_available: true,
    current_image_url: '',
    previous_image_url: '',
    tags: '',
  });

  useEffect(() => {
    if (item) {
      setFormData({
        category_id: item.category_id || (categories[0]?.id || ''),
        title_tr: item.title_tr || '',
        title_en: item.title_en || '',
        title_ru: item.title_ru || '',
        title_de: item.title_de || '',
        description_tr: item.description_tr || '',
        description_en: item.description_en || '',
        description_ru: item.description_ru || '',
        description_de: item.description_de || '',
        price: item.price !== undefined && item.price !== null ? String(item.price) : '',
        currency: item.currency || 'EUR',
        volume_ml: item.volume_ml !== undefined && item.volume_ml !== null ? String(item.volume_ml) : '',
        abv: item.abv !== undefined && item.abv !== null ? String(item.abv) : '',
        is_alcoholic: item.is_alcoholic ?? true,
        is_available: item.is_available ?? true,
        current_image_url: item.current_image_url || '',
        previous_image_url: item.previous_image_url || '',
        tags: Array.isArray(item.tags) ? item.tags.join(', ') : '',
      });
    } else {
      // Completely empty state for Add New Beverage
      setFormData({
        category_id: categories[0]?.id || '',
        title_tr: '',
        title_en: '',
        title_ru: '',
        title_de: '',
        description_tr: '',
        description_en: '',
        description_ru: '',
        description_de: '',
        price: '',
        currency: 'EUR', // Priority Currency EUR
        volume_ml: '',
        abv: '',
        is_alcoholic: true,
        is_available: true,
        current_image_url: '',
        previous_image_url: '',
        tags: '',
      });
    }
    setSelectedImageFile(null);
    setError('');
  }, [item, categories, isOpen]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRollback = async () => {
    if (!item?.id || !onRollbackImage) return;
    try {
      setIsRollbacking(true);
      const res = await onRollbackImage(item.id);
      setFormData((prev) => ({
        ...prev,
        current_image_url: res.current_image_url,
        previous_image_url: res.previous_image_url,
      }));
    } catch (err) {
      setError(err.message || 'Rollback failed');
    } finally {
      setIsRollbacking(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic Validation
    if (!formData.title_en.trim() && !formData.title_tr.trim()) {
      setError('Please provide at least an English or Turkish title.');
      return;
    }

    const numPrice = parseFloat(formData.price);

    if (isNaN(numPrice) || numPrice < 0) {
      setError('Please enter a valid non-negative price.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const parsedTags = formData.tags
        ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean)
        : [];

      const payload = {
        category_id: formData.category_id,
        title_tr: formData.title_tr || formData.title_en,
        title_en: formData.title_en || formData.title_tr,
        title_ru: formData.title_ru || formData.title_en,
        title_de: formData.title_de || formData.title_en,
        description_tr: formData.description_tr,
        description_en: formData.description_en,
        description_ru: formData.description_ru,
        description_de: formData.description_de,
        price: numPrice,
        currency: formData.currency || 'EUR',
        volume_ml: formData.volume_ml ? parseInt(formData.volume_ml, 10) : null,
        abv: formData.is_alcoholic ? (formData.abv ? parseFloat(formData.abv) : 0) : 0,
        is_alcoholic: formData.is_alcoholic,
        is_available: formData.is_available,
        current_image_url: formData.current_image_url,
        previous_image_url: formData.previous_image_url,
        tags: parsedTags,
      };

      await onSave(payload, selectedImageFile);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save beverage item.');
    } finally {
      setLoading(false);
    }
  };

  const isEditing = Boolean(item);

  // Helper placeholder generators
  const getTitlePlaceholder = (lang) => {
    switch (lang) {
      case 'tr': return 'örn: Amber Sunset Kokteyl';
      case 'ru': return 'напр: Коктейль Янтарный Закат';
      case 'de': return 'z. B. Bernstein Sunset Cocktail';
      default: return 'e.g. Amber Sunset Cocktail';
    }
  };

  const getDescPlaceholder = (lang) => {
    switch (lang) {
      case 'tr': return 'örn: Mürver çiçeği likörü, taze çarkıfelek meyvesi püresi ve prosecco';
      case 'ru': return 'напр: Ликер бузины, пюре из маракуйи и игристое просекко';
      case 'de': return 'z. B. Holunderblütenlikör, frisches Maracujapüree und Prosecco';
      default: return 'e.g. Elderflower liqueur, fresh passionfruit purée, and crisp prosecco';
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? t('editItem') : t('addNewItem')}
      subtitle="TUI BLUE Beverage Catalog"
      maxWidth="max-w-3xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="flex items-center gap-2 p-3 bg-rose-950/50 border border-rose-800 rounded-xl text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Dual-Image Slot System */}
        <DualImageUploader
          currentImageUrl={formData.current_image_url}
          previousImageUrl={formData.previous_image_url}
          onImageSelected={(file) => setSelectedImageFile(file)}
          onRollback={isEditing && formData.previous_image_url ? handleRollback : null}
          isRollbackLoading={isRollbacking}
        />

        {/* Multilingual Tabs (TR, EN, RU, DE) */}
        <div className="bg-[#131b2a] border border-slate-800/80 rounded-2xl p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Multilingual Information (4 Languages)
            </span>
            <div className="flex items-center gap-1 bg-[#161f30] p-1 rounded-xl border border-slate-800">
              {[
                { code: 'en', label: 'EN' },
                { code: 'tr', label: 'TR' },
                { code: 'ru', label: 'RU' },
                { code: 'de', label: 'DE' },
              ].map((tab) => (
                <button
                  key={tab.code}
                  type="button"
                  onClick={() => setActiveLangTab(tab.code)}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                    activeLangTab === tab.code
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Active Language Fields with Clean Placeholders */}
          <div className="space-y-3">
            <Input
              label={`${t('titleLabel')} (${activeLangTab.toUpperCase()})`}
              value={formData[`title_${activeLangTab}`]}
              onChange={(e) => handleChange(`title_${activeLangTab}`, e.target.value)}
              placeholder={getTitlePlaceholder(activeLangTab)}
              required={activeLangTab === 'en'}
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                {t('descLabel')} ({activeLangTab.toUpperCase()})
              </label>
              <textarea
                rows={3}
                value={formData[`description_${activeLangTab}`]}
                onChange={(e) => handleChange(`description_${activeLangTab}`, e.target.value)}
                placeholder={getDescPlaceholder(activeLangTab)}
                className="w-full bg-[#161f30] border border-slate-800 hover:border-slate-700 text-slate-100 placeholder-slate-500 rounded-xl p-3 text-xs sm:text-sm transition-all focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/80 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Pricing (Single Price & EUR Priority Currency Selection), Category & Specifications */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {/* Category */}
          <div className="flex flex-col gap-1.5 sm:col-span-1">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              {t('fieldCategory')}
            </label>
            <select
              value={formData.category_id}
              onChange={(e) => handleChange('category_id', e.target.value)}
              className="w-full bg-[#131b2a] border border-slate-800 hover:border-slate-700 text-slate-100 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/80"
              required
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id} className="bg-[#161f30] text-slate-100">
                  {getLocalizedField(c, 'name')}
                </option>
              ))}
            </select>
          </div>

          {/* Single Price Input (Empty by default) */}
          <Input
            label={t('fieldPrice')}
            type="number"
            step="0.50"
            min="0"
            value={formData.price}
            onChange={(e) => handleChange('price', e.target.value)}
            placeholder="e.g. 18.50"
            required
          />

          {/* Currency Selection Dropdown (EUR as Default Priority) */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              {t('fieldCurrency')}
            </label>
            <select
              value={formData.currency}
              onChange={(e) => handleChange('currency', e.target.value)}
              className="w-full bg-[#131b2a] border border-slate-800 hover:border-slate-700 text-slate-100 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/80 font-bold"
            >
              <option value="EUR" className="bg-[#161f30] text-slate-100">€ EUR (Euro)</option>
              <option value="TRY" className="bg-[#161f30] text-slate-100">₺ TRY (Turkish Lira)</option>
              <option value="USD" className="bg-[#161f30] text-slate-100">$ USD (US Dollars)</option>
            </select>
          </div>

          {/* Volume */}
          <Input
            label={t('fieldVolume')}
            type="number"
            min="0"
            value={formData.volume_ml}
            onChange={(e) => handleChange('volume_ml', e.target.value)}
            placeholder="e.g. 250"
          />
        </div>

        {/* Alcohol & Status Toggles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Alcohol ABV */}
          <div className="bg-[#131b2a] border border-slate-800 rounded-xl p-3 flex items-center justify-between">
            <div>
              <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <Wine className="w-4 h-4 text-amber-400" />
                {t('fieldIsAlcoholic')}
              </label>
              <p className="text-[11px] text-slate-400 mt-0.5">Toggle alcohol classification</p>
            </div>
            <input
              type="checkbox"
              checked={formData.is_alcoholic}
              onChange={(e) => handleChange('is_alcoholic', e.target.checked)}
              className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
            />
          </div>

          {/* Availability Status */}
          <div className="bg-[#131b2a] border border-slate-800 rounded-xl p-3 flex items-center justify-between">
            <div>
              <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                {t('fieldIsAvailable')}
              </label>
              <p className="text-[11px] text-slate-400 mt-0.5">Active / Stop-List on guest menu</p>
            </div>
            <input
              type="checkbox"
              checked={formData.is_available}
              onChange={(e) => handleChange('is_available', e.target.checked)}
              className="w-5 h-5 accent-emerald-500 rounded cursor-pointer"
            />
          </div>
        </div>

        {formData.is_alcoholic && (
          <Input
            label={t('fieldAbv')}
            type="number"
            step="0.1"
            min="0"
            max="100"
            value={formData.abv}
            onChange={(e) => handleChange('abv', e.target.value)}
            icon={Percent}
            placeholder="e.g. 14.5"
          />
        )}

        {/* Tags */}
        <Input
          label={t('fieldTags')}
          value={formData.tags}
          onChange={(e) => handleChange('tags', e.target.value)}
          icon={Tag}
          placeholder="e.g. Signature, Smoky, Fruity, Gold"
        />

        {/* Modal Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
          <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
            {t('cancel')}
          </Button>
          <Button type="submit" variant="primary" loading={loading}>
            {t('saveChanges')}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
