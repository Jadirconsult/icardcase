import Image from 'next/image'
import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  variant?: 'light' | 'dark'
  showText?: boolean
}

export function Logo({ className, variant = 'light', showText = true }: LogoProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      {/* Logo oficial (PNG transparente, 50×72 = 2x do tamanho exibido).
          unoptimized: serve o arquivo direto em /logo-icardcase-mark.png, que
          leitores externos conseguem baixar. Sem `priority`: não é o LCP.
          Com o texto ao lado, a imagem é decorativa (alt vazio) — senão o
          leitor de tela anunciaria "Icardcase logo icardcase". */}
      <Image
        src="/logo-icardcase-mark.png"
        alt={showText ? '' : 'Icardcase'}
        aria-hidden={showText ? true : undefined}
        width={25}
        height={36}
        unoptimized
        className="h-9 w-auto"
      />
      {showText && (
        <span
          className={cn(
            'text-lg font-semibold tracking-tight',
            variant === 'dark' ? 'text-ink' : 'text-surface-1',
          )}
        >
          icardcase
        </span>
      )}
    </div>
  )
}
