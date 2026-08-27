import { createClient } from '@supabase/supabase-js';
import { mockCategories, mockMenuItems } from '../utils/mockData';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if valid Supabase environment variables are provided
export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'https://your-project-id.supabase.co' &&
  !supabaseUrl.includes('your-project-id')
);

// Initialize Supabase Client
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// ============================================================================
// RESILIENT LOCAL STORAGE DATA LAYER (Active in Demo / Fallback Mode)
// ============================================================================

const STORAGE_KEY_CATEGORIES = 'tui_blue_categories_v1';
const STORAGE_KEY_ITEMS = 'tui_blue_menu_items_v1';

export function getLocalCategories() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CATEGORIES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(mockCategories));
      return mockCategories;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.warn('LocalStorage error reading categories, returning mock:', e);
    return mockCategories;
  }
}

export function saveLocalCategories(categories) {
  try {
    localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(categories));
  } catch (e) {
    console.error('Failed to save categories to localStorage:', e);
  }
}

export function getLocalMenuItems() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ITEMS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(mockMenuItems));
      return mockMenuItems;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.warn('LocalStorage error reading items, returning mock:', e);
    return mockMenuItems;
  }
}

export function saveLocalMenuItems(items) {
  try {
    localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save menu items to localStorage:', e);
  }
}

/**
 * Upload Image to Supabase Storage 'menu-images' bucket with fallback
 */
export async function uploadImageToStorage(file) {
  if (!isSupabaseConfigured || !supabase) {
    // Return a local Object URL or Data URL for preview/demo mode
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(file);
    });
  }

  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `item-${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `items/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('menu-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type || 'image/webp',
      });

    if (uploadError) {
      throw uploadError;
    }

    const { data: publicUrlData } = supabase.storage
      .from('menu-images')
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  } catch (err) {
    console.error('Supabase storage upload error:', err);
    throw err;
  }
}

/**
 * Delete image file from Supabase storage bucket
 */
export async function deleteImageFromStorage(imageUrl) {
  if (!isSupabaseConfigured || !supabase || !imageUrl) {
    return true;
  }

  try {
    // Extract relative path from public URL
    const urlParts = imageUrl.split('/menu-images/');
    if (urlParts.length > 1) {
      const filePath = urlParts[1];
      const { error } = await supabase.storage.from('menu-images').remove([filePath]);
      if (error) console.warn('Supabase storage delete warning:', error);
    }
    return true;
  } catch (err) {
    console.warn('Failed to delete image from storage:', err);
    return false;
  }
}
