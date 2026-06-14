import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { StudentForm } from "@/components/students/StudentForm";

export default function NewStudentPage() {
  return (
    <DashboardLayout title="Add Student" subtitle="Create a new student record">
      <Card>
        <StudentForm mode="create" />
      </Card>
    </DashboardLayout>
  );
}
