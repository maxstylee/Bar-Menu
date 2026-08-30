import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import logoSvg from "../assets/logo.svg";
import { useMenu } from "../hooks/useMenu";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { useToast } from "../context/ToastContext";
import { AdminBeverageTable } from "../components/admin/AdminBeverageTable";
import { ItemFormModal } from "../components/admin/ItemFormModal";
import { DeleteConfirmModal } from "../components/admin/DeleteConfirmModal";
import { QuickEditPriceModal } from "../components/admin/QuickEditPriceModal";
import { LanguageSwitcher } from "../components/common/LanguageSwitcher";
import { Button } from "../components/common/Button";
import {
  PlusCircle,
  LogOut,
  Search,
  Eye,
  CheckCircle2,
  AlertCircle,
  Wine,
  Layers,
} from "lucide-react";

export function AdminDashboard() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { getLocalizedField, t } = useLanguage();
  const { success, error: toastError } = useToast();

  const {
    items,
    categories,
    addItem,
    updateItem,
    deleteItem,
    toggleAvailability,
    quickUpdatePrice,
    rollbackImage,
  } = useMenu();

  // Local Table Search & Category Filter
  const [adminSearch, setAdminSearch] = useState("");
  const [adminCategoryFilter, setAdminCategoryFilter] = useState("all");

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null); // null for Add, item for Edit
  const [deletingItem, setDeletingItem] = useState(null);
  const [priceEditingItem, setPriceEditingItem] = useState(null);

  // Filtered items in admin table
  const adminFilteredItems = useMemo(() => {
    return items.filter((item) => {
      if (
        adminCategoryFilter !== "all" &&
        item.category_id !== adminCategoryFilter
      ) {
        return false;
      }
      if (adminSearch.trim() !== "") {
        const q = adminSearch.toLowerCase().trim();
        const matchTitle =
          item.title_tr?.toLowerCase().includes(q) ||
          item.title_en?.toLowerCase().includes(q) ||
          item.title_ru?.toLowerCase().includes(q) ||
          item.title_de?.toLowerCase().includes(q);

        const matchTags = Array.isArray(item.tags)
          ? item.tags.some((tag) => tag.toLowerCase().includes(q))
          : false;

        if (!matchTitle && !matchTags) return false;
      }
      return true;
    });
  }, [items, adminCategoryFilter, adminSearch]);

  // Statistics calculation
  const stats = useMemo(() => {
    const total = items.length;
    const active = items.filter((i) => i.is_available !== false).length;
    const stopListed = total - active;
    const catCount = categories.length;
    return { total, active, stopListed, catCount };
  }, [items, categories]);

  // Handlers
  const handleOpenAddModal = () => {
    setEditingItem(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setEditingItem(item);
    setIsFormModalOpen(true);
  };

  const handleSaveItem = async (payload, newImageFile) => {
    try {
      if (editingItem) {
        await updateItem(editingItem.id, payload, newImageFile);
        success(t("toastItemUpdated"));
      } else {
        await addItem(payload, newImageFile);
        success(t("toastItemAdded"));
      }
    } catch (err) {
      console.error("Save item error:", err);
      toastError(err.message || t("toastError"));
      throw err;
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      await deleteItem(itemId);
      success(t("toastItemDeleted"));
    } catch (err) {
      toastError(err.message || t("toastError"));
      throw err;
    }
  };

  const handleToggleAvailability = async (itemId) => {
    try {
      await toggleAvailability(itemId);
      success(t("toastStatusToggled"));
    } catch (err) {
      toastError(err.message || t("toastError"));
    }
  };

  const handleQuickSavePrice = async (itemId, newPrice, newCurrency) => {
    try {
      await quickUpdatePrice(itemId, newPrice, newCurrency);
      success(t("toastPriceUpdated"));
    } catch (err) {
      toastError(err.message || t("toastError"));
      throw err;
    }
  };

  const handleRollbackImage = async (itemId) => {
    try {
      const result = await rollbackImage(itemId);
      success(t("toastImageRestored"));
      return result;
    } catch (err) {
      toastError(err.message || t("toastError"));
      throw err;
    }
  };

  const handleSignOut = async () => {
    await signOut();
    success(t("logoutSuccess"));
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#0c1017] text-slate-100 flex flex-col selection:bg-amber-500/30 selection:text-amber-300">
      {/* Mobile-Optimized Top Admin Navigation Header */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-[#0c1017]/90 border-b border-slate-800 shadow-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-2">
          {/* Brand & User Info */}
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#131b2a] border border-amber-500/30 flex items-center justify-center p-1.5 shadow-amber-glow flex-shrink-0">
              <img
                src={logoSvg}
                alt="TUI BLUE Logo"
                className="w-full h-full"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="font-outfit font-extrabold text-sm sm:text-base text-white truncate">
                {t("brandTitle")}
              </h1>
              <p className="text-[10px] sm:text-[11px] text-slate-400 truncate">
                {user?.email || "admin@tuiblue.com"}
              </p>
            </div>
          </div>

          {/* Action Controls: Compact and Overflow-Free */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
            <LanguageSwitcher variant="dropdown" />

            <Link
              to="/"
              className="flex items-center gap-1 sm:gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#161f30] hover:bg-[#1e293b] text-slate-300 hover:text-white border border-slate-700/80 text-xs font-semibold transition-all"
              title="View live guest menu"
            >
              <Eye className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">{t("guestMenu")}</span>
            </Link>

            <button
              onClick={handleSignOut}
              className="flex items-center gap-1 sm:gap-1.5 px-2.5 py-1.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/50 text-xs font-semibold transition-all cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{t("logout")}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-3 sm:px-6 lg:px-8 py-6 space-y-6 overflow-x-hidden">
        {/* Page Title & Hero */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-outfit font-extrabold text-xl sm:text-3xl text-white">
              {t("dashboardTitle")}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              {t("dashboardSubtitle")}
            </p>
          </div>

          <Button
            variant="primary"
            size="md"
            icon={PlusCircle}
            onClick={handleOpenAddModal}
            className="shadow-amber-glow self-start sm:self-auto"
          >
            {t("addNewItem")}
          </Button>
        </div>

        {/* 4-Card Stats Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Total */}
          <div className="bg-[#161f30] border border-slate-800 rounded-2xl p-3.5 sm:p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400">
                {t("statTotalItems")}
              </p>
              <p className="text-xl sm:text-2xl font-extrabold font-outfit text-white mt-1">
                {stats.total}
              </p>
            </div>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-amber-400">
              <Wine className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>

          {/* Active Live */}
          <div className="bg-[#161f30] border border-slate-800 rounded-2xl p-3.5 sm:p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400">
                {t("statActiveItems")}
              </p>
              <p className="text-xl sm:text-2xl font-extrabold font-outfit text-emerald-400 mt-1">
                {stats.active}
              </p>
            </div>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>

          {/* Stop Listed */}
          <div className="bg-[#161f30] border border-slate-800 rounded-2xl p-3.5 sm:p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400">
                {t("statStopListed")}
              </p>
              <p className="text-xl sm:text-2xl font-extrabold font-outfit text-rose-400 mt-1">
                {stats.stopListed}
              </p>
            </div>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>

          {/* Categories */}
          <div className="bg-[#161f30] border border-slate-800 rounded-2xl p-3.5 sm:p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400">
                {t("statCategories")}
              </p>
              <p className="text-xl sm:text-2xl font-extrabold font-outfit text-amber-300 mt-1">
                {stats.catCount}
              </p>
            </div>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Layers className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
        </div>

        {/* Filter Controls Toolbar */}
        <div className="bg-[#161f30] border border-slate-800 rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Live Search */}
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={adminSearch}
              onChange={(e) => setAdminSearch(e.target.value)}
              placeholder="Search by title or tag..."
              className="w-full bg-[#131b2a] border border-slate-800 text-slate-100 placeholder-slate-500 rounded-xl pl-10 pr-4 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {/* Category Filter Dropdown */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-slate-400 whitespace-nowrap">
              Filter Category:
            </span>
            <select
              value={adminCategoryFilter}
              onChange={(e) => setAdminCategoryFilter(e.target.value)}
              className="bg-[#131b2a] border border-slate-800 text-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 w-full sm:w-auto"
            >
              <option value="all">All Categories ({items.length})</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {getLocalizedField(cat, "name")}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Beverage Management Table */}
        <AdminBeverageTable
          items={adminFilteredItems}
          categories={categories}
          onEditItem={handleOpenEditModal}
          onDeleteItem={(item) => setDeletingItem(item)}
          onQuickEditPrice={(item) => setPriceEditingItem(item)}
          onToggleAvailability={handleToggleAvailability}
          onRollbackImage={handleRollbackImage}
        />
      </main>

      {/* Modals */}
      {/* 1. Item Form Modal (Add / Edit) */}
      <ItemFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        item={editingItem}
        categories={categories}
        onSave={handleSaveItem}
        onRollbackImage={handleRollbackImage}
      />

      {/* 2. Quick Edit Price Modal */}
      <QuickEditPriceModal
        isOpen={Boolean(priceEditingItem)}
        onClose={() => setPriceEditingItem(null)}
        item={priceEditingItem}
        onSave={handleQuickSavePrice}
      />

      {/* 3. Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(deletingItem)}
        onClose={() => setDeletingItem(null)}
        item={deletingItem}
        onConfirm={handleDeleteItem}
      />
    </div>
  );
}
