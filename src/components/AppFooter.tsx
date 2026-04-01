export default function AppFooter() {
  const year = new Date().getFullYear()

  return (
    <footer
      role="contentinfo"
      className="shrink-0 border-t border-outline-variant/20 bg-surface-container-lowest/90 text-on-surface-variant"
    >
      <div className="mx-auto max-w-[1400px] px-4 py-3 text-center md:px-8">
        <p className="text-[0.6875rem] leading-relaxed">
          © {year} Signal · Rental dynamic pricing
        </p>
      </div>
    </footer>
  )
}
