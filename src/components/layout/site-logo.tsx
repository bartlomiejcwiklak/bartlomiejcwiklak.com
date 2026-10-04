// The logo is a single-color mark, so it is drawn as a mask filled with the current text color
// and follows each page's theme (see src/lib/theme.ts).
export function SiteLogo({ className = '' }: { className?: string }) {
  return (
    <span
      role="img"
      aria-label="Bartlomiej Cwiklak logo"
      className={`block aspect-[320/205] bg-current text-ash ${className}`}
      style={{
        maskImage: 'url(/images/logo-mask.png)',
        maskSize: 'contain',
        maskRepeat: 'no-repeat',
        WebkitMaskImage: 'url(/images/logo-mask.png)',
        WebkitMaskSize: 'contain',
        WebkitMaskRepeat: 'no-repeat'
      }}
    />
  );
}
