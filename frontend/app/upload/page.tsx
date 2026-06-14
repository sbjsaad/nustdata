import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ExcelUploadForm } from "@/components/upload/ExcelUploadForm";

export default function UploadPage() {
  return (
    <DashboardLayout
      title="Excel Upload"
      subtitle="Upload Student Master, Monthly Billing, or Invoice sheets"
    >
      <ExcelUploadForm />
    </DashboardLayout>
  );
}
