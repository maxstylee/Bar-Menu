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
  FileCheck,
  ImageIcon,
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
      setErrorMsg("Please select a valid image file (JPG, PNG, WebP, HEIC).");
      return;
    }

    try {
      setIsCompressing(true);
      setErrorMsg(null);

      // Perform Client-Side WebP Compression (<200KB)
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
        <Badge variant="amber" size="xs">
          Auto WebP Engine
        </Badge>
      </div>

      {/* Slots Grid: Active Slot (1) & Backup Slot (2) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Slot 1: Active Image */}
        <div className="bg-[#131b2a] border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              {t("activeSlot")}
            </span>
            {compressionStats && (
              <Badge variant="emerald" size="xs">
                -{compressionStats.compressionRatio}%
              </Badge>
            )}
          </div>

          <div className="relative aspect-[4/3] w-full rounded-lg overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center">
            {activeDisplayUrl ? (
              <img
                src={activeDisplayUrl}
                alt="Active Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center p-3 text-slate-500">
                <ImageIcon className="w-8 h-8 mx-auto mb-1 text-slate-600" />
                <span className="text-xs">No active image</span>
              </div>
            )}
          </div>

          {compressionStats && (
            <div className="mt-2 text-[11px] text-slate-400 space-y-0.5 bg-slate-900/60 p-2 rounded-lg border border-slate-800">
              <div className="flex justify-between">
                <span>Original:</span>
                <span className="text-slate-300 font-mono">
                  {formatBytes(compressionStats.originalSize)}
                </span>
              </div>
              <div className="flex justify-between font-semibold text-emerald-400">
                <span>WebP Payload:</span>
                <span className="font-mono">
                  {formatBytes(compressionStats.compressedSize)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Slot 2: Backup / Previous Image */}
        <div className="bg-[#131b2a] border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              {t("backupSlot")}
            </span>
            {previousImageUrl ? (
              <Badge variant="slate" size="xs">
                Saved Backup
              </Badge>
            ) : (
              <Badge variant="slate" size="xs">
                Empty
              </Badge>
            )}
          </div>

          <div className="relative aspect-[4/3] w-full rounded-lg overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center">
            {previousImageUrl ? (
              <img
                src={previousImageUrl}
                alt="Previous Backup"
                className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity"
              />
            ) : (
              <div className="text-center p-3 text-slate-600">
                <RotateCcw className="w-8 h-8 mx-auto mb-1 opacity-40" />
                <span className="text-xs">{t("noBackupImage")}</span>
              </div>
            )}
          </div>

          {/* Rollback Action Button */}
          {previousImageUrl && onRollback && (
            <div className="mt-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="w-full text-xs font-semibold border-amber-500/30 hover:border-amber-500 hover:text-amber-300"
                onClick={onRollback}
                loading={isRollbackLoading}
                icon={RotateCcw}
              >
                {t("restorePrevious")}
              </Button>
            </div>
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
        className={`relative border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all duration-200 ${
          dragActive
            ? "border-amber-500 bg-amber-500/10"
            : "border-slate-700/80 bg-[#161f30]/60 hover:bg-[#161f30] hover:border-slate-600"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png, image/jpeg, image/jpg, image/webp, image/heic"
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
              Compressing to optimized WebP (&lt;200KB)...
            </span>
          </div>
        ) : (
          <div className="py-2 flex flex-col items-center gap-1.5">
            <UploadCloud className="w-7 h-7 text-amber-400/90" />
            <p className="text-xs font-semibold text-slate-200">
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
