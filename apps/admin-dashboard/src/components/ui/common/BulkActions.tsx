import { useState } from 'react';
import { Button } from '../Button';
import { Dialog } from '../Dialog';

export interface BulkAction<T> {
  key: string;
  label: string;
  icon: string;
  variant?:
    | 'primary'
    | 'secondary'
    | 'danger'
    | 'success'
    | 'warning'
    | 'ghost';
  action: (items: T[]) => Promise<void> | void;
  confirmationRequired?: boolean;
  confirmationTitle?: string;
  confirmationMessage?: (items: T[]) => string;
  disabled?: (items: T[]) => boolean;
  visible?: (items: T[]) => boolean;
}

export interface BulkActionsProps<T> {
  selectedItems: T[];
  actions: BulkAction<T>[];
  onClearSelection: () => void;
  className?: string;
  loading?: boolean;
}

export function BulkActions<T>({
  selectedItems,
  actions,
  onClearSelection,
  className = '',
  loading = false,
}: BulkActionsProps<T>) {
  const [confirmingAction, setConfirmingAction] =
    useState<BulkAction<T> | null>(null);
  const [executing, setExecuting] = useState(false);

  if (selectedItems.length === 0) return null;

  const visibleActions = actions.filter(
    (action) => action.visible?.(selectedItems) ?? true
  );

  const handleActionClick = (action: BulkAction<T>) => {
    if (action.confirmationRequired) {
      setConfirmingAction(action);
    } else {
      executeAction(action);
    }
  };

  const executeAction = async (action: BulkAction<T>) => {
    setExecuting(true);
    try {
      await action.action(selectedItems);
      onClearSelection();
    } catch (error) {
      console.error(`Bulk action ${action.key} failed:`, error);
    } finally {
      setExecuting(false);
      setConfirmingAction(null);
    }
  };

  const getConfirmationMessage = (action: BulkAction<T>): string => {
    if (action.confirmationMessage) {
      return action.confirmationMessage(selectedItems);
    }
    return `Are you sure you want to ${action.label.toLowerCase()} ${
      selectedItems.length
    } item(s)?`;
  };

  return (
    <>
      <div
        className={`bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 ${className}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-blue-700 dark:text-blue-300 font-medium">
              {selectedItems.length} item(s) selected
            </span>

            <div className="flex space-x-2">
              {visibleActions.map((action) => (
                <Button
                  key={action.key}
                  variant={action.variant || 'secondary'}
                  size="sm"
                  icon={action.icon}
                  onClick={() => handleActionClick(action)}
                  disabled={
                    loading ||
                    executing ||
                    (action.disabled?.(selectedItems) ?? false)
                  }
                  loading={executing}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            icon="times"
            onClick={onClearSelection}
            disabled={loading || executing}
          >
            Clear Selection
          </Button>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {confirmingAction && (
        <Dialog
          isOpen={!!confirmingAction}
          onClose={() => setConfirmingAction(null)}
          onConfirm={() => executeAction(confirmingAction)}
          title={
            confirmingAction.confirmationTitle ||
            `Confirm ${confirmingAction.label}`
          }
          message={getConfirmationMessage(confirmingAction)}
          confirmText={confirmingAction.label}
          variant={confirmingAction.variant === 'danger' ? 'danger' : 'default'}
          loading={executing}
        />
      )}
    </>
  );
}
