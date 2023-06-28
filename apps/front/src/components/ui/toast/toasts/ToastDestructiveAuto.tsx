'use client'

import { useToast } from '@ui/toast'

export function ToastDestructiveAuto({
  isVisible,
  message,
}: {
  isVisible: boolean
  message: {
    title?: string
    description: string
    variant?: 'default' | 'destructive'
  }
}) {
  const { toast } = useToast()

  return isVisible
    ? toast({
        variant: message.variant || 'destructive',
        title: message.title,
        description: message.description,
      })
    : null
}
