import { X, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ToastProps {
  type: 'success' | 'error';
  message: string;
  onDismiss: () => void;
}

export function Toast({ type, message, onDismiss }: ToastProps) {
  const icon = type === 'success' ? (
    <CheckCircle className="h-5 w-5 text-green-400" />
  ) : (
    <AlertCircle className="h-5 w-5 text-red-400" />
  );

  return (
    <div
      className={cn(
        'fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-xl animate-slide-in',
        type === 'success'
          ? 'bg-green-950/90 border-green-800 text-green-100'
          : 'bg-red-950/90 border-red-800 text-red-100'
      )}
      role="alert"
    >
      {icon}
      <span className="text-sm font-medium">{message}</span>
      <button
        onClick={onDismiss}
        className={cn(
          'ml-2 p-1 rounded-lg transition-colors',
          type === 'success'
            ? 'hover:bg-green-800 text-green-300'
            : 'hover:bg-red-800 text-red-300'
        )}
        aria-label="Sluiten"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}