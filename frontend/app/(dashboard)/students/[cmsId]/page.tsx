"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StudentProfileView } from "@/components/students/StudentProfileView";
import { Alert } from "@/components/ui/Alert";
import { api, ApiClientError } from "@/lib/api";
import type { StudentProfile } from "@/lib/types";

function StudentDetailContent({ cmsId }: { cmsId: string }) {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    api
      .get<StudentProfile>(`/dashboard/student/${encodeURIComponent(cmsId)}`)
      .then((data) => {
        if (!cancelled) setProfile(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof ApiClientError ? err.message : "Student not found");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [cmsId]);

  return (
    <>
      {loading && (
        <div className="flex items-center gap-3 py-4">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
          <p className="text-sm text-slate-500">Loading student details...</p>
        </div>
      )}
      {error && <Alert type="error" message={error} />}
      {profile && <StudentProfileView profile={profile} />}
    </>
  );
}

export default function StudentDetailPage() {
  const params = useParams();
  const cmsId = decodeURIComponent(params.cmsId as string);

  return (
    <DashboardLayout
      title={`Student: ${cmsId}`}
      subtitle={`CMS ID: ${cmsId} — Complete billing profile`}
    >
      <StudentDetailContent key={cmsId} cmsId={cmsId} />
    </DashboardLayout>
  );
}
