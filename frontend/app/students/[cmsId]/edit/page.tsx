"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { StudentForm } from "@/components/students/StudentForm";
import { api, ApiClientError } from "@/lib/api";
import type { Student } from "@/lib/types";

export default function EditStudentPage() {
  const params = useParams();
  const cmsId = decodeURIComponent(params.cmsId as string);
  const [student, setStudent] = useState<Student | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get<Student>(`/students/${cmsId}`)
      .then(setStudent)
      .catch((err) => setError(err instanceof ApiClientError ? err.message : "Failed to load"));
  }, [cmsId]);

  return (
    <DashboardLayout title="Edit Student" subtitle={`CMS ID: ${cmsId}`}>
      {error && <Alert type="error" message={error} />}
      <Card>
        {student ? <StudentForm mode="edit" cmsId={cmsId} initial={student} /> : !error && <p className="text-sm text-slate-500">Loading...</p>}
      </Card>
    </DashboardLayout>
  );
}
