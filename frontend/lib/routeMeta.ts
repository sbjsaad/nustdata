export interface PageMeta {
  title: string;
  subtitle?: string;
}

export function getDefaultPageMeta(pathname: string): PageMeta {
  if (pathname === "/dashboard") {
    return {
      title: "Dashboard",
      subtitle: "Billing overview, student stats, and collection trends",
    };
  }
  if (pathname === "/students") {
    return {
      title: "Students",
      subtitle: "Create, view, update and delete student records",
    };
  }
  if (pathname === "/students/new") {
    return { title: "Add Student", subtitle: "Create a new student record" };
  }
  if (pathname === "/billing") {
    return { title: "Billing", subtitle: "Monthly billing records — full CRUD" };
  }
  if (pathname === "/billing/new") {
    return { title: "Add Billing", subtitle: "Create a new monthly billing record" };
  }
  if (pathname === "/invoices") {
    return { title: "Invoices", subtitle: "Invoice and voucher records — full CRUD" };
  }
  if (pathname === "/invoices/new") {
    return { title: "Add Invoice", subtitle: "Create a new invoice / voucher" };
  }
  if (pathname === "/charges") {
    return { title: "Charges", subtitle: "Manage messing, washing and other charges" };
  }
  if (pathname === "/upload") {
    return {
      title: "Excel Upload",
      subtitle: "Import student master, monthly billing, or invoice data",
    };
  }
  if (pathname === "/categories") {
    return { title: "Categories", subtitle: "NS, GC, PC, AES — create, update, delete" };
  }
  if (pathname === "/tabular-data") {
    return { title: "Tabular Data", subtitle: "Category-wise student registry and details in tabular format" };
  }

  const studentMatch = pathname.match(/^\/students\/([^/]+)(?:\/edit)?$/);
  if (studentMatch) {
    const cmsId = decodeURIComponent(studentMatch[1]);
    if (pathname.endsWith("/edit")) {
      return { title: "Edit Student", subtitle: `CMS ID: ${cmsId}` };
    }
    return {
      title: `Student: ${cmsId}`,
      subtitle: `CMS ID: ${cmsId} — Complete billing profile`,
    };
  }

  const billingMatch = pathname.match(/^\/billing\/([^/]+)(?:\/edit)?$/);
  if (billingMatch) {
    const id = billingMatch[1];
    if (pathname.endsWith("/edit")) {
      return { title: "Edit Billing", subtitle: `ID: ${id}` };
    }
    return { title: "Billing Details", subtitle: id };
  }

  const invoiceMatch = pathname.match(/^\/invoices\/([^/]+)(?:\/edit)?$/);
  if (invoiceMatch) {
    const id = invoiceMatch[1];
    if (pathname.endsWith("/edit")) {
      return { title: "Edit Invoice", subtitle: `ID: ${id}` };
    }
    return { title: "Invoice Details", subtitle: id };
  }

  const chargeMatch = pathname.match(/^\/charges\/([^/]+)\/edit$/);
  if (chargeMatch) {
    return { title: "Edit Charge", subtitle: `ID: ${chargeMatch[1]}` };
  }

  return { title: "NUST EME Billing" };
}
