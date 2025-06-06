import { Toast } from "./toast";

export function ToastContainer({ toasts, onRemove }) {
  return (
    <div className="fixed top-4 right-4 z-[100] space-y-2 max-w-sm w-full">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          title={toast.message}
          variant={toast.type}
          duration={toast.duration}
          onClose={() => onRemove(toast.id)}
        />
      ))}
    </div>
  );
}