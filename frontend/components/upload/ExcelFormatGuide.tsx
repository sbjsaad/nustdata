"use client";

import { useState } from "react";
import { Card } from "../ui/Card";
import {
  EXCEL_FILE_INFO,
  EXCEL_SHEET_GUIDES,
  getSheetGuide,
  type ExcelSheetGuide,
} from "@/lib/excelUploadGuide";
import type { SheetType } from "@/lib/types";

function ColumnList({
  title,
  columns,
  variant,
}: {
  title: string;
  columns: string[];
  variant: "required" | "optional";
}) {
  const styles =
    variant === "required"
      ? "border-red-100 bg-red-50 text-red-800"
      : "border-slate-100 bg-slate-50 text-slate-700";

  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</p>
      <ul className={`rounded-lg border p-3 ${styles}`}>
        {columns.map((col) => (
          <li key={col} className="text-sm leading-relaxed">
            • {col}
          </li>
        ))}
      </ul>
    </div>
  );
}

function SheetGuidePanel({ guide }: { guide: ExcelSheetGuide }) {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-indigo-100 bg-indigo-50/60 p-3">
        <p className="text-sm text-indigo-900">{guide.summary}</p>
      </div>

      <div className="grid gap-4 grid-cols-1">
        <ColumnList title="Required columns" columns={guide.requiredColumns} variant="required" />
        <ColumnList title="Optional columns" columns={guide.optionalColumns} variant="optional" />
      </div>

      <p className="rounded-lg border border-amber-100 bg-amber-50 px-3 py-2 text-xs text-amber-900">
        <span className="font-semibold">Auto-detect: </span>
        {guide.detectHint}
      </p>

      {guide.notes && guide.notes.length > 0 && (
        <ul className="space-y-1 text-xs text-slate-600">
          {guide.notes.map((note) => (
            <li key={note}>• {note}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function ExcelFormatGuide({ selectedType }: { selectedType: SheetType }) {
  const [activeTab, setActiveTab] = useState<Exclude<SheetType, "auto">>("student_master");
  const selectedGuide = getSheetGuide(selectedType);
  const displayGuide = selectedType === "auto" ? EXCEL_SHEET_GUIDES.find((g) => g.type === activeTab)! : selectedGuide!;

  return (
    <Card
      title="Supported Excel Formats"
      subtitle="Which files you can upload and which columns each sheet type needs"
      className="h-full"
    >
        <div className="space-y-4">
          <div className="rounded-lg border border-sky-100 bg-sky-50 p-4">
            <p className="text-sm font-medium text-sky-900">
              File types: {EXCEL_FILE_INFO.formatsLabel}
            </p>
            <ul className="mt-2 space-y-1 text-sm text-sky-800">
              <li>• {EXCEL_FILE_INFO.firstSheetOnly}</li>
              <li>• {EXCEL_FILE_INFO.autoDetect}</li>
              <li>• {EXCEL_FILE_INFO.combinedFormat}</li>
            </ul>
          </div>

          <div>
            <p className="mb-2 text-sm font-semibold text-slate-800">
              Three sheet types are supported:
            </p>
            <div className="flex flex-wrap gap-2">
              {EXCEL_SHEET_GUIDES.map((guide) => {
                const isActive =
                  selectedType === "auto"
                    ? activeTab === guide.type
                    : selectedType === guide.type;

                return (
                  <button
                    key={guide.type}
                    type="button"
                    onClick={() => selectedType === "auto" && setActiveTab(guide.type)}
                    disabled={selectedType !== "auto" && selectedType !== guide.type}
                    className={`rounded-lg border px-3 py-2 text-left text-sm transition ${
                      isActive
                        ? "border-indigo-300 bg-indigo-50 text-indigo-900 ring-1 ring-indigo-200"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                    } ${selectedType !== "auto" && selectedType !== guide.type ? "cursor-default opacity-50" : ""}`}
                  >
                    <span className="mr-1.5">{guide.icon}</span>
                    <span className="font-medium">{guide.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {selectedType !== "auto" && selectedGuide && (
            <p className="text-xs font-medium text-indigo-700">
              You selected &quot;{selectedGuide.title}&quot; — the columns below match that sheet type.
            </p>
          )}

          <SheetGuidePanel guide={displayGuide} />
        </div>
    </Card>
  );
}
