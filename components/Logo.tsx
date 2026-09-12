import Image from 'next/image'
import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  variant?: 'light' | 'dark'
  showText?: boolean
}

export function Logo({ className, variant = 'light', showText = true }: LogoProps) {
  const textColor = variant === 'dark' ? '#FFFFFF' : '#081F4D'

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {/* Logo oficial (PNG transparente, 152×216). unoptimized: serve o arquivo
          direto em /logo-icardcase-mark.png, que leitores externos conseguem baixar. */}
      <Image
        src="/logo-icardcase-mark.png"
        alt="Icardcase logo"
        width={25}
        height={36}
        unoptimized
        priority
        className="h-9 w-auto"
      />
      {showText && (
        <span className="text-lg font-semibold tracking-tight" style={{ color: textColor }}>
          icardcase
        </span>
      )}
    </div>
  )
}
