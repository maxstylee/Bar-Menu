import React, { useState, useRef } from "react";
import { compressImageToWebP, formatBytes } from "../../utils/imageCompressor";
import { useLanguage } from "../../context/LanguageContext";
import { Button } from "../common/Button";
import { Badge } from "../common/Badge";
import {
  UploadCloud,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ImageIcon,
  Eye,
} from "lucide-react";

export function DualImageUploader({
  currentImageUrl,
  previousImageUrl,
  onImageSelected, // (file, previewUrl, stats) => void
  onRollback, // () => void
  isRollbackLoading = false,
  className = "",
}) {
  const { t } = useLanguage();
  const fileInputRef = useRef(null);

  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionStats, setCompressionStats] = useState(null);
  const [localPreview, setLocalPreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleFile = async (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMsg("Please select a valid image file (JPG, PNG, HEIC).");
      return;
    }

    try {
      setIsCompressing(true);
      setErrorMsg(null);

      // Perform Client-Side Optimization (<200KB)
      const result = await compressImageToWebP(file);

      setLocalPreview(result.previewUrl);
      setCompressionStats(result);

      if (onImageSelected) {
        onImageSelected(result.file, result.previewUrl, result);
      }
    } catch (err) {
      console.error("Compression failed:", err);
      setErrorMsg("Failed to process image. Please try another file.");
    } finally {
      setIsCompressing(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const activeDisplayUrl = localPreview || currentImageUrl;

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          {t("dualImageTitle")}
        </label>
        <Badge variant="emerald" size="xs">
          Auto Image Optimizer
        </Badge>
      </div>

      {/* Main Image Container: Prominent Active Image + Backup Slot */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
        {/* Active Main Image (Noticeably Larger, Centered, Prominent) */}
        <div className="md:col-span-2 bg-[#131b2a] border-2 border-amber-500/50 shadow-amber-glow/20 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5 uppercase tracking-wide">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              {t("activeSlot")}
            </span>
            {compressionStats ? (
              <Badge variant="emerald" size="xs">
                Optimized -{compressionStats.compressionRatio}%
              </Badge>
            ) : (
              <Badge variant="amber" size="xs">
                Live On Menu
              </Badge>
            )}
          </div>

          {/* Centered Large Preview */}
          <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-slate-900 border border-slate-700/80 flex items-center justify-center mx-auto shadow-inner">
            {activeDisplayUrl ? (
              <>
                <img
                  src={activeDisplayUrl}
                  alt="Active Drink"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute top-2.5 left-2.5">
                  <span className="bg-emerald-600/90 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-md flex items-center gap-1 backdrop-blur-xs">
                    <Eye className="w-3.5 h-3.5" /> Active Display
                  </span>
                </div>
              </>
            ) : (
              <div className="text-center p-4 text-slate-500">
                <ImageIcon className="w-10 h-10 mx-auto mb-2 text-slate-600" />
                <span className="text-xs font-medium">No image uploaded yet</span>
              </div>
            )}
          </div>

          {compressionStats && (
            <div className="mt-3 text-[11px] text-slate-400 flex items-center justify-between bg-slate-900/80 px-3 py-2 rounded-xl border border-slate-800">
              <span>
                Original:{" "}
                <strong className="text-slate-300 font-mono">
                  {formatBytes(compressionStats.originalSize)}
                </strong>
              </span>
              <span className="text-emerald-400 font-semibold">
                Optimized:{" "}
                <strong className="font-mono">
                  {formatBytes(compressionStats.compressedSize)}
                </strong>
              </span>
            </div>
          )}
        </div>

        {/* Backup / Rollback Image Slot */}
        <div className="bg-[#131b2a] border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              {t("backupSlot")}
            </span>
            {previousImageUrl ? (
              <Badge variant="slate" size="xs">
                Backup Ready
              </Badge>
            ) : (
              <Badge variant="slate" size="xs">
                Empty
              </Badge>
            )}
          </div>

          <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center">
            {previousImageUrl ? (
              <img
                src={previousImageUrl}
                alt="Previous Backup"
                className="w-full h-full object-cover opacity-75 hover:opacity-100 transition-opacity"
              />
            ) : (
              <div className="text-center p-3 text-slate-600">
                <RotateCcw className="w-6 h-6 mx-auto mb-1 opacity-30" />
                <span className="text-[11px]">{t("noBackupImage")}</span>
              </div>
            )}
          </div>

          {/* Rollback Action Button */}
          {previousImageUrl && onRollback ? (
            <div className="mt-3">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="w-full text-xs font-semibold border-amber-500/40 text-amber-300 hover:bg-amber-500/15"
                onClick={onRollback}
                loading={isRollbackLoading}
                icon={RotateCcw}
              >
                {t("restorePrevious")}
              </Button>
            </div>
          ) : (
            <p className="mt-3 text-[10px] text-slate-500 text-center">
              Replaces backup automatically when you upload new photos
            </p>
          )}
        </div>
      </div>

      {/* Upload Drag & Drop Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all duration-200 ${
          dragActive
            ? "border-amber-500 bg-amber-500/10"
            : "border-slate-700/80 bg-[#161f30]/60 hover:bg-[#161f30] hover:border-slate-600"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png, image/jpeg, image/jpg, image/heic"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFile(e.target.files[0]);
            }
          }}
        />

        {isCompressing ? (
          <div className="py-3 flex flex-col items-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-400 animate-spin" />
            <span className="text-xs font-semibold text-amber-300">
              Optimizing image (&lt;200KB)...
            </span>
          </div>
        ) : (
          <div className="py-2 flex flex-col items-center gap-1.5">
            <UploadCloud className="w-7 h-7 text-amber-400" />
            <p className="text-xs font-bold text-slate-200">
              {t("dragDropText")}
            </p>
            <p className="text-[11px] text-slate-400">{t("fileSupport")}</p>
          </div>
        )}
      </div>

      {errorMsg && (
        <p className="text-xs text-rose-400 font-medium flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5" />
          {errorMsg}
        </p>
      )}
    </div>
  );
}
