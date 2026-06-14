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
import { SHEET_TYPE_LABELS, type SheetType, type UploadProcessResult } from "@/lib/types";

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
  const [result, setResult] = useState<UploadProcessResult | null>(null);
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
      const res = await api.upload<UploadProcessResult>("/upload/excel", buildFormData());
      setResult(res.data);
      setPreview(null);

      if (!res.success) {
        setError(res.message || "No records were imported");
      }
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Upload failed");
      setResult(null);
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
              {preview.headerRowIndex != null && (
                <span className="ml-2 text-slate-500">
                  (header row{Number(preview.headerRowsUsed) > 1 ? "s" : ""}:{" "}
                  {String(preview.headerRowIndex)}
                  {Number(preview.headerRowsUsed) > 1
                    ? ` — ${String(preview.headerRowsUsed)} rows used`
                    : ""}
                  )
                </span>
              )}
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
        <Card
          title="Upload Result"
          subtitle={
            result.status === "success"
              ? "Data saved to database"
              : result.status === "partial"
                ? "Some rows were imported"
                : "Import failed — no records saved"
          }
        >
          <div className="space-y-4 text-sm">
            <div
              className={`rounded-lg border p-4 ${
                result.status === "success"
                  ? "border-green-200 bg-green-50 text-green-900"
                  : result.status === "partial"
                    ? "border-amber-200 bg-amber-50 text-amber-900"
                    : "border-red-200 bg-red-50 text-red-900"
              }`}
            >
              <p className="font-medium capitalize">Status: {result.status || result.log.status}</p>
              <p className="mt-1">
                Sheet type: {String(result.sheetType).replace(/_/g, " ")} · Total rows in file:{" "}
                {result.log.totalRows}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg bg-slate-50 p-3">
                <p className="text-xs text-slate-500">Created</p>
                <p className="text-xl font-bold text-green-700">{result.results.created}</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-3">
                <p className="text-xs text-slate-500">Updated</p>
                <p className="text-xl font-bold text-blue-700">{result.results.updated}</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-3">
                <p className="text-xs text-slate-500">Rejected</p>
                <p className="text-xl font-bold text-amber-700">{result.results.rejected ?? 0}</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-3">
                <p className="text-xs text-slate-500">Errors</p>
                <p className="text-xl font-bold text-red-700">{result.results.skipped}</p>
              </div>
            </div>

            {(result.results.billing || result.results.students) && (
              <div className="grid gap-3 sm:grid-cols-2">
                {result.results.students && (
                  <div className="rounded-lg border border-slate-200 bg-white p-3">
                    <p className="text-xs font-semibold uppercase text-slate-500">Students</p>
                    <p className="mt-1 text-sm text-slate-700">
                      Created {result.results.students.created} · Updated{" "}
                      {result.results.students.updated}
                    </p>
                  </div>
                )}
                {result.results.billing && (
                  <div className="rounded-lg border border-slate-200 bg-white p-3">
                    <p className="text-xs font-semibold uppercase text-slate-500">Billing</p>
                    <p className="mt-1 text-sm text-slate-700">
                      Created {result.results.billing.created} · Updated{" "}
                      {result.results.billing.updated}
                    </p>
                  </div>
                )}
              </div>
            )}

            {(result.results.rejected ?? 0) > 0 && (
              <p className="text-slate-600">
                Rows were rejected because required columns (CMS ID, Reg No, etc.) were missing or
                did not match. Use Preview to check detected headers, or pick the correct sheet type.
              </p>
            )}

            {result.results.errors && result.results.errors.length > 0 && (
              <div>
                <p className="mb-2 font-medium text-slate-800">Details</p>
                <ul className="space-y-1 rounded-lg bg-slate-50 p-3 text-xs text-slate-700">
                  {result.results.errors.slice(0, 10).map((entry, index) => (
                    <li key={index}>• {entry.message}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
