import { Button } from '@ui/buttons/button'
import { useToast, ToastAction } from '@ui/toast'

export function ToastWithTitle({
  title,
  description,
  variant,
  btnSize,
  onAction,
  actionText,
}: {
  title: string
  description: string
  variant?: 'default' | 'destructive'
  onAction?: (...args: Array<unknown>) => void
  actionText?: string
  btnSize?: 'default' | 'sm' | 'lg' | 'icon'
}) {
  const { toast } = useToast()

  return (
    <Button
      variant="outline"
      size={`${btnSize || 'default'}`}
      onClick={() => {
        toast({
          variant: variant || 'destructive',
          title,
          description,
          action: onAction && (
            <ToastAction
              altText={`${actionText || 'Try again'}`}
              onClick={onAction}
            >
              {actionText || 'Try again'}
            </ToastAction>
          ),
        })
      }}
    >
      Show Toast
    </Button>
  )
}
