"use client";

import { useState } from "react";
import { api, ApiClientError } from "@/lib/api";
import { getSheetGuide } from "@/lib/excelUploadGuide";
import { Card } from "../ui/Card";
import { Select } from "../ui/Select";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { Alert } from "../ui/Alert";
import { ExcelFormatGuide } from "./ExcelFormatGuide";
import { SHEET_TYPE_LABELS, type SheetType } from "@/lib/types";

const sheetOptions = Object.entries(SHEET_TYPE_LABELS).map(([value, label]) => ({
  value,
  label,
}));

export function ExcelUploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [sheetType, setSheetType] = useState<SheetType>("auto");
  const [voucherMonth, setVoucherMonth] = useState("");
  const [voucherYear, setVoucherYear] = useState(new Date().getFullYear().toString());
  const [loading, setLoading] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [preview, setPreview] = useState<Record<string, unknown> | null>(null);

  const selectedGuide = getSheetGuide(sheetType);
  const showVoucherFields =
    sheetType === "auto" || sheetType === "monthly_billing" || sheetType === "invoice";

  const buildFormData = () => {
    const formData = new FormData();
    if (file) formData.append("file", file);
    formData.append("sheetType", sheetType);
    if (voucherMonth) formData.append("voucherMonth", voucherMonth);
    if (voucherYear) formData.append("voucherYear", voucherYear);
    return formData;
  };

  const handlePreview = async () => {
    if (!file) {
      setError("Please select an Excel file");
      return;
    }

    setPreviewLoading(true);
    setError("");
    setPreview(null);

    try {
      const res = await api.upload("/upload/preview", buildFormData());
      setPreview(res.data as Record<string, unknown>);
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Preview failed");
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Please select an Excel file");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await api.upload("/upload/excel", buildFormData());
      setResult(res.data as Record<string, unknown>);
      setPreview(null);
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid items-start gap-6 lg:grid-cols-2">
        <ExcelFormatGuide selectedType={sheetType} />

        <Card
          title="Upload Excel File"
          subtitle="Check the guide to confirm your file type, then upload here"
          className="lg:sticky lg:top-4"
        >
          <form onSubmit={handleUpload} className="space-y-4">
            {error && <Alert type="error" message={error} />}

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
              <p>
                <span className="font-medium text-slate-800">Tip:</span> Click{" "}
                <span className="font-medium">Preview</span> first to see the detected sheet type and
                whether your column headers look correct.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">
                  Excel File *
                </label>
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-indigo-700"
                />
                <p className="text-xs text-slate-500">
                  Supported: .xlsx, .xls, .csv — only the first sheet is imported
                </p>
                {file && (
                  <p className="text-xs font-medium text-indigo-700">
                    Selected: {file.name}
                  </p>
                )}
              </div>

              <div>
                <Select
                  label="Sheet Type"
                  value={sheetType}
                  onChange={(e) => setSheetType(e.target.value as SheetType)}
                  options={sheetOptions}
                />
                <p className="mt-1.5 text-xs text-slate-500">
                  {sheetType === "auto"
                    ? "Auto Detect is recommended — the system will identify the sheet type from headers."
                    : selectedGuide
                      ? `${selectedGuide.title}: required columns — ${selectedGuide.requiredColumns.join(", ")}.`
                      : ""}
                </p>
              </div>

              {showVoucherFields && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    label="Voucher Month"
                    placeholder="e.g. March — if not in the Excel file"
                    value={voucherMonth}
                    onChange={(e) => setVoucherMonth(e.target.value)}
                  />
                  <Input
                    label="Voucher Year"
                    placeholder={new Date().getFullYear().toString()}
                    value={voucherYear}
                    onChange={(e) => setVoucherYear(e.target.value)}
                  />
                </div>
              )}
            </div>

            {sheetType === "student_master" && (
              <p className="text-xs text-slate-500">
                Voucher Month and Year are not needed for Student Master — only for billing and invoice sheets.
              </p>
            )}

            <div className="flex flex-wrap gap-3">
              <Button type="button" variant="secondary" onClick={handlePreview} loading={previewLoading}>
                Preview
              </Button>
              <Button type="submit" loading={loading}>
                Upload & Save to Database
              </Button>
            </div>
          </form>
        </Card>
      </div>

      {preview && (
        <Card title="Preview" subtitle={`Detected type: ${String(preview.sheetType)}`}>
          <div className="space-y-3 text-sm">
            <div className="rounded-lg border border-indigo-100 bg-indigo-50 p-3 text-indigo-900">
              If the detected type looks wrong, change Sheet Type manually and run Preview again.
            </div>
            <p>
              <span className="font-medium">Total Rows:</span> {String(preview.totalRows)}
            </p>
            <p>
              <span className="font-medium">Column Headers Found:</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {(preview.headers as string[])?.map((header) => (
                <span
                  key={header}
                  className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-700"
                >
                  {header}
                </span>
              ))}
            </div>
            <pre className="overflow-auto rounded-lg bg-slate-50 p-4 text-xs">
              {JSON.stringify(preview.preview, null, 2)}
            </pre>
          </div>
        </Card>
      )}

      {result && (
        <Card title="Upload Result" subtitle="Data saved to database">
          <pre className="overflow-auto rounded-lg bg-green-50 p-4 text-xs text-green-900">
            {JSON.stringify(result, null, 2)}
          </pre>
        </Card>
      )}
    </div>
  );
}
