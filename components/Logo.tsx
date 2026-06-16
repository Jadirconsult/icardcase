import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  variant?: 'light' | 'dark'
  showText?: boolean
}

export function Logo({ className, variant = 'light', showText = true }: LogoProps) {
  const textColor = variant === 'dark' ? '#FFFFFF' : '#081F4D'
  const accentColor = '#2563EB'

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <svg width="36" height="36" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Icardcase logo" role="img">
        {/* Stylized 'i' body matching the exact leaf/drop visual identity */}
        <path
          d="M17 16C12.5 16 10.5 20.5 10.5 29C10.5 37.5 12.5 42 17 42H21.5C22.3 42 23 41.3 23 40.5V17.5C23 16.7 22.3 16 21.5 16H17Z"
          fill={textColor}
        />
        {/* Stylized 'i' dot */}
        <circle cx="16.75" cy="9.5" r="4.5" fill={textColor} />
        {/* Technology/Connectivity network lines branching out */}
        <path d="M23 36C26 36 28 34 29 31.5" stroke={accentColor} strokeWidth="2.5" strokeLinecap="round" />
        <path d="M29 31.5L35.5 22.5" stroke={accentColor} strokeWidth="2.5" strokeLinecap="round" />
        <path d="M29 31.5H38.5" stroke={accentColor} strokeWidth="2.5" strokeLinecap="round" />
        <path d="M29 31.5L35 39" stroke={accentColor} strokeWidth="2.5" strokeLinecap="round" />
        {/* Glowing connected node circles */}
        <circle cx="36.5" cy="21.5" r="3.5" fill={accentColor} />
        <circle cx="39.5" cy="31.5" r="3.5" fill={accentColor} />
        <circle cx="36" cy="40" r="3.5" fill={accentColor} />
      </svg>
      {showText && (
        <span className="text-lg font-semibold tracking-tight" style={{ color: textColor }}>
          icardcase
        </span>
      )}
    </div>
  )
}
