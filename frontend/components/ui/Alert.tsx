interface AlertProps {
  type?: "success" | "error" | "info" | "warning";
  title?: string;
  message: string;
  details?: unknown;
  className?: string;
}

const styles = {
  success: "border-green-200 bg-green-50 text-green-800",
  error: "border-red-200 bg-red-50 text-red-800",
  info: "border-blue-200 bg-blue-50 text-blue-800",
  warning: "border-amber-200 bg-amber-50 text-amber-800",
};

export function Alert({ type = "info", title, message, details, className = "" }: AlertProps) {
  return (
    <div className={`rounded-lg border px-4 py-3 text-sm ${styles[type]} ${className}`}>
      {title && <p className="font-semibold">{title}</p>}
      <p>{message}</p>
      {details != null && (
        <pre className="mt-2 overflow-auto rounded bg-white/60 p-2 text-xs">
          {JSON.stringify(details, null, 2)}
        </pre>
      )}
    </div>
  );
}
