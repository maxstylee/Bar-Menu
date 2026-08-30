import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  supabase,
  isSupabaseConfigured,
  getLocalCategories,
  saveLocalCategories,
  getLocalMenuItems,
  saveLocalMenuItems,
  uploadImageToStorage,
  deleteImageFromStorage,
} from '../api/supabase';
import { compressImageToWebP } from '../utils/imageCompressor';

export function useMenu() {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Active filters
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dietaryFilter, setDietaryFilter] = useState('all'); // 'all' | 'alcoholic' | 'non_alcoholic'

  // Fetch initial data
  const fetchMenuData = useCallback(async () => {
    setLoading(true);
    setError(null);

    if (isSupabaseConfigured && supabase) {
      try {
        const [catRes, itemRes] = await Promise.all([
          supabase.from('categories').select('*').order('sort_order', { ascending: true }),
          supabase.from('menu_items').select('*').order('created_at', { ascending: false }),
        ]);

        if (catRes.error) throw catRes.error;
        if (itemRes.error) throw itemRes.error;

        setCategories(catRes.data || []);
        setItems(itemRes.data || []);
        setLoading(false);
        return;
      } catch (err) {
        console.warn('Supabase fetch failed, falling back to local dataset:', err);
      }
    }

    // Fallback Local Storage / Mock
    const localCats = getLocalCategories();
    const localItems = getLocalMenuItems();
    setCategories(localCats);
    setItems(localItems);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchMenuData();
  }, [fetchMenuData]);

  // ==========================================================================
  // CATEGORY CRUD OPERATIONS
  // ==========================================================================

  const addCategory = async (categoryData) => {
    const newCategoryPayload = {
      name_tr: categoryData.name_tr || categoryData.name_en,
      name_en: categoryData.name_en || categoryData.name_tr,
      name_ru: categoryData.name_ru || categoryData.name_en,
      name_de: categoryData.name_de || categoryData.name_en,
      icon: categoryData.icon || 'Sparkles',
      sort_order: parseInt(categoryData.sort_order, 10) || (categories.length + 1),
    };

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('categories')
        .insert([newCategoryPayload])
        .select()
        .single();

      if (error) throw error;

      setCategories((prev) => [...prev, data].sort((a, b) => a.sort_order - b.sort_order));
      return data;
    }

    const localNewCat = {
      ...newCategoryPayload,
      id: `cat-local-${Date.now()}`,
    };

    setCategories((prev) => {
      const updated = [...prev, localNewCat].sort((a, b) => a.sort_order - b.sort_order);
      saveLocalCategories(updated);
      return updated;
    });

    return localNewCat;
  };

  const updateCategory = async (catId, categoryData) => {
    const payload = {
      name_tr: categoryData.name_tr,
      name_en: categoryData.name_en,
      name_ru: categoryData.name_ru,
      name_de: categoryData.name_de,
      icon: categoryData.icon,
      sort_order: parseInt(categoryData.sort_order, 10) || 1,
    };

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('categories')
        .update(payload)
        .eq('id', catId)
        .select()
        .single();

      if (error) throw error;

      setCategories((prev) =>
        prev.map((c) => (c.id === catId ? data : c)).sort((a, b) => a.sort_order - b.sort_order)
      );
      return data;
    }

    setCategories((prev) => {
      const updated = prev
        .map((c) => (c.id === catId ? { ...c, ...payload } : c))
        .sort((a, b) => a.sort_order - b.sort_order);
      saveLocalCategories(updated);
      return updated;
    });
  };

  const deleteCategory = async (catId) => {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('categories').delete().eq('id', catId);
      if (error) throw error;
    }

    setCategories((prev) => {
      const updated = prev.filter((c) => c.id !== catId);
      saveLocalCategories(updated);
      return updated;
    });
  };

  // ==========================================================================
  // DUAL-IMAGE SLOT LIFECYCLE ENGINE
  // ==========================================================================

  /**
   * Processes new image file upload with Dual-Image version control
   * - Compress client side (<200KB)
   * - 1st upload: new -> current_image_url
   * - 2nd upload: current -> previous_image_url, new -> current_image_url
   * - 3rd upload: delete old previous from storage, current -> previous, new -> current
   */
  const handleDualImageUpload = async (imageFile, existingCurrentUrl, existingPreviousUrl) => {
    const compression = await compressImageToWebP(imageFile);
    const newPublicUrl = await uploadImageToStorage(compression.file);

    let nextPreviousUrl = existingPreviousUrl || null;
    let nextCurrentUrl = newPublicUrl;

    if (existingCurrentUrl) {
      if (existingPreviousUrl && existingPreviousUrl.startsWith('http') && !existingPreviousUrl.includes('unsplash.com')) {
        await deleteImageFromStorage(existingPreviousUrl);
      }
      nextPreviousUrl = existingCurrentUrl;
    }

    return {
      current_image_url: nextCurrentUrl,
      previous_image_url: nextPreviousUrl,
      compressionStats: compression,
    };
  };

  /**
   * Rollback pointer swap: swaps current_image_url and previous_image_url without re-uploading
   */
  const rollbackImage = async (itemId) => {
    const targetItem = items.find((i) => i.id === itemId);
    if (!targetItem || !targetItem.previous_image_url) {
      throw new Error('No backup image available for rollback');
    }

    const swappedCurrent = targetItem.previous_image_url;
    const swappedPrevious = targetItem.current_image_url;

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from('menu_items')
        .update({
          current_image_url: swappedCurrent,
          previous_image_url: swappedPrevious,
        })
        .eq('id', itemId);

      if (error) throw error;
    }

    setItems((prev) => {
      const updated = prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              current_image_url: swappedCurrent,
              previous_image_url: swappedPrevious,
            }
          : item
      );
      saveLocalMenuItems(updated);
      return updated;
    });

    return { current_image_url: swappedCurrent, previous_image_url: swappedPrevious };
  };

  // ==========================================================================
  // ITEM CRUD OPERATIONS
  // ==========================================================================

  const addItem = async (itemData, newImageFile = null) => {
    let current_image_url = itemData.current_image_url || '';
    let previous_image_url = null;

    if (newImageFile) {
      const slotResult = await handleDualImageUpload(newImageFile, null, null);
      current_image_url = slotResult.current_image_url;
      previous_image_url = slotResult.previous_image_url;
    }

    const newItemPayload = {
      ...itemData,
      current_image_url,
      previous_image_url,
      created_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('menu_items')
        .insert([newItemPayload])
        .select()
        .single();

      if (error) throw error;

      setItems((prev) => [data, ...prev]);
      return data;
    }

    const localNewItem = {
      ...newItemPayload,
      id: `local-item-${Date.now()}`,
    };

    setItems((prev) => {
      const updated = [localNewItem, ...prev];
      saveLocalMenuItems(updated);
      return updated;
    });

    return localNewItem;
  };

  const updateItem = async (itemId, updatedData, newImageFile = null) => {
    const existing = items.find((i) => i.id === itemId) || {};
    let current_image_url = updatedData.current_image_url ?? existing.current_image_url;
    let previous_image_url = updatedData.previous_image_url ?? existing.previous_image_url;

    if (newImageFile) {
      const slotResult = await handleDualImageUpload(
        newImageFile,
        existing.current_image_url,
        existing.previous_image_url
      );
      current_image_url = slotResult.current_image_url;
      previous_image_url = slotResult.previous_image_url;
    }

    const payload = {
      ...updatedData,
      current_image_url,
      previous_image_url,
    };

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('menu_items')
        .update(payload)
        .eq('id', itemId)
        .select()
        .single();

      if (error) throw error;

      setItems((prev) => prev.map((i) => (i.id === itemId ? data : i)));
      return data;
    }

    setItems((prev) => {
      const updated = prev.map((i) => (i.id === itemId ? { ...i, ...payload } : i));
      saveLocalMenuItems(updated);
      return updated;
    });

    return { ...existing, ...payload };
  };

  const deleteItem = async (itemId) => {
    const target = items.find((i) => i.id === itemId);

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('menu_items').delete().eq('id', itemId);
      if (error) throw error;

      if (target?.current_image_url) await deleteImageFromStorage(target.current_image_url);
      if (target?.previous_image_url) await deleteImageFromStorage(target.previous_image_url);
    }

    setItems((prev) => {
      const updated = prev.filter((i) => i.id !== itemId);
      saveLocalMenuItems(updated);
      return updated;
    });
  };

  /**
   * Fast toggle for Stop-List / Availability
   */
  const toggleAvailability = async (itemId) => {
    const target = items.find((i) => i.id === itemId);
    if (!target) return;

    const nextAvailable = !target.is_available;

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from('menu_items')
        .update({ is_available: nextAvailable })
        .eq('id', itemId);

      if (error) throw error;
    }

    setItems((prev) => {
      const updated = prev.map((i) =>
        i.id === itemId ? { ...i, is_available: nextAvailable } : i
      );
      saveLocalMenuItems(updated);
      return updated;
    });
  };

  /**
   * Fast inline price & currency adjustment
   */
  const quickUpdatePrice = async (itemId, newPrice, newCurrency = 'EUR') => {
    const parsedPrice = parseFloat(newPrice);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      throw new Error('Invalid price value');
    }
    const currency = newCurrency || 'EUR';

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from('menu_items')
        .update({ price: parsedPrice, currency })
        .eq('id', itemId);

      if (error) throw error;
    }

    setItems((prev) => {
      const updated = prev.map((i) =>
        i.id === itemId ? { ...i, price: parsedPrice, currency } : i
      );
      saveLocalMenuItems(updated);
      return updated;
    });
  };

  // ==========================================================================
  // FILTERED & SEARCHED MENU COMPUTATION
  // ==========================================================================

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (selectedCategory !== 'all' && item.category_id !== selectedCategory) {
        return false;
      }

      if (dietaryFilter === 'alcoholic' && !item.is_alcoholic) {
        return false;
      }
      if (dietaryFilter === 'non_alcoholic' && item.is_alcoholic) {
        return false;
      }

      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle =
          item.title_tr?.toLowerCase().includes(q) ||
          item.title_en?.toLowerCase().includes(q) ||
          item.title_ru?.toLowerCase().includes(q) ||
          item.title_de?.toLowerCase().includes(q);

        const matchDesc =
          item.description_tr?.toLowerCase().includes(q) ||
          item.description_en?.toLowerCase().includes(q) ||
          item.description_ru?.toLowerCase().includes(q) ||
          item.description_de?.toLowerCase().includes(q);

        const matchTags = Array.isArray(item.tags)
          ? item.tags.some((t) => t.toLowerCase().includes(q))
          : false;

        if (!matchTitle && !matchDesc && !matchTags) {
          return false;
        }
      }

      return true;
    });
  }, [items, selectedCategory, dietaryFilter, searchQuery]);

  return {
    categories,
    items,
    filteredItems,
    loading,
    error,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    dietaryFilter,
    setDietaryFilter,
    addCategory,
    updateCategory,
    deleteCategory,
    addItem,
    updateItem,
    deleteItem,
    toggleAvailability,
    quickUpdatePrice,
    rollbackImage,
    handleDualImageUpload,
    refreshMenu: fetchMenuData,
  };
}
