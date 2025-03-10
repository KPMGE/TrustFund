import { cn } from '@/utils/tw-merge'
import { Loader2 } from 'lucide-react'

interface LoadingProps {
  /**
   * Tamanho do componente de loading
   * @default "default"
   */
  size?: 'sm' | 'default' | 'lg'

  /**
   * Texto a ser exibido junto com o spinner
   */
  text?: string

  /**
   * Cor do spinner e texto
   * @default "primary"
   */
  variant?: 'primary' | 'white' | 'blue'

  /**
   * Classes CSS adicionais
   */
  className?: string
}

export function Loading({ size = 'default', text, variant = 'primary', className }: LoadingProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    default: 'h-6 w-6',
    lg: 'h-8 w-8',
  }

  const variantClasses = {
    primary: 'text-primary',
    white: 'text-white',
    blue: 'text-blue-500',
  }

  return (
    <div
      className={cn('flex items-center justify-center gap-2', className)}
      role="status"
      aria-live="polite"
    >
      <Loader2 className={cn('animate-spin', sizeClasses[size], variantClasses[variant])} />
      {text && <span className={cn('text-sm font-medium', variantClasses[variant])}>{text}</span>}
      <span className="sr-only">Carregando...</span>
    </div>
  )
}
