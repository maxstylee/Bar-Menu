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
  // DUAL-IMAGE SLOT LIFECYCLE ENGINE
  // ==========================================================================

  /**
   * Processes new image file upload with Dual-Image version control
   * - Compress to WebP (<200KB)
   * - 1st upload: new -> current_image_url
   * - 2nd upload: current -> previous_image_url, new -> current_image_url
   * - 3rd upload: delete old previous from storage, current -> previous, new -> current
   */
  const handleDualImageUpload = async (imageFile, existingCurrentUrl, existingPreviousUrl) => {
    // 1. Compress client-side to WebP
    const compression = await compressImageToWebP(imageFile);
    
    // 2. Upload compressed file to storage
    const newPublicUrl = await uploadImageToStorage(compression.file);

    // 3. Versioning Slot Logic
    let nextPreviousUrl = existingPreviousUrl || null;
    let nextCurrentUrl = newPublicUrl;

    if (existingCurrentUrl) {
      // If there was already a previous image, delete the 3rd replaced image from storage
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

    // Optimistic / Local update
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

    // LocalStorage Fallback
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

    // Local Storage Fallback
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

      // Clean up storage images if uploaded
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
   * Fast inline price adjustment
   */
  const quickUpdatePrice = async (itemId, newPrice) => {
    const parsedPrice = parseFloat(newPrice);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      throw new Error('Invalid price value');
    }

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from('menu_items')
        .update({ price: parsedPrice })
        .eq('id', itemId);

      if (error) throw error;
    }

    setItems((prev) => {
      const updated = prev.map((i) =>
        i.id === itemId ? { ...i, price: parsedPrice } : i
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
      // 1. Category Filter
      if (selectedCategory !== 'all' && item.category_id !== selectedCategory) {
        return false;
      }

      // 2. Dietary Filter
      if (dietaryFilter === 'alcoholic' && !item.is_alcoholic) {
        return false;
      }
      if (dietaryFilter === 'non_alcoholic' && item.is_alcoholic) {
        return false;
      }

      // 3. Multilingual Search Query Filter
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
