import { useState } from "react"
import type { User } from "@supabase/supabase-js"
import Row from "@/modules/common/components/Row"
import Col from "@/modules/common/components/Col"
import Box from "@/modules/common/components/Box"
import TextPrimary from "@/modules/common/components/TextPrimary"
import BaseButton from "@/modules/common/components/BaseButton"
import { NavLink } from "@/components/NavLink"

interface TopNavBarProps {
  user: User
  onSignOut: () => Promise<void>
}

export default function TopNavBar({ user, onSignOut }: TopNavBarProps) {
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const avatarUrl = user.user_metadata?.avatar_url ?? user.user_metadata?.picture

  return (
    <Box className="w-full sticky top-0 z-40 bg-surface-container-lowest/80 backdrop-blur-xl border-b border-outline-variant/20">
      <Row className="justify-between items-center px-4 md:px-6 h-16">
        {/* Left: Logo + Nav */}
        <Row className="items-center gap-6 md:gap-8">
          <TextPrimary text="Signal" className="text-xl font-bold text-primary tracking-tighter" />
          <Row className="hidden md:flex items-center gap-1">
            <NavLink
              to="/"
              className="text-sm font-medium text-on-surface-variant hover:bg-surface-container-low px-3 py-1 rounded transition-colors"
              activeClassName=""
            >
              Home
            </NavLink>
            <NavLink
              to="/dashboard"
              className="text-sm font-semibold text-on-surface-variant hover:bg-surface-container-low px-3 py-1 rounded transition-colors"
              activeClassName="text-primary border-b-2 border-primary"
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/forward-pricing"
              className="text-sm font-medium text-on-surface-variant hover:bg-surface-container-low px-3 py-1 rounded transition-colors"
              activeClassName="text-primary border-b-2 border-primary"
            >
              Market Pricing
            </NavLink>
          </Row>
        </Row>

        {/* Center: Search */}
        <Row className="hidden lg:flex items-center bg-surface-container-low px-3 py-1.5 rounded-lg border border-transparent focus-within:border-surface-tint transition-all">
          <TextPrimary text="search" className="material-symbols-outlined text-on-surface-variant text-sm mr-2" />
          <input
            type="text"
            placeholder="Search analytics..."
            className="bg-transparent border-none focus:ring-0 text-sm w-48 text-on-surface outline-none"
          />
        </Row>

        {/* Right: Icons + Avatar + Logout */}
        <Row className="items-center gap-2 md:gap-4">
          <button className="hidden sm:flex material-symbols-outlined text-on-surface p-2 hover:bg-surface-container-low rounded-full transition-colors">
            notifications
          </button>
          <button className="hidden sm:flex material-symbols-outlined text-on-surface p-2 hover:bg-surface-container-low rounded-full transition-colors">
            help
          </button>
          <Box className="h-8 w-8 rounded-full bg-surface-container-high overflow-hidden border border-outline-variant/20">
            {avatarUrl ? (
              <img alt="User Profile" className="h-full w-full object-cover" src={avatarUrl} />
            ) : (
              <Row className="h-full w-full items-center justify-center">
                <TextPrimary text="person" className="material-symbols-outlined text-on-surface-variant text-base" />
              </Row>
            )}
          </Box>
          <BaseButton
            variant="light"
            size="sm"
            className="hidden sm:inline-flex text-xs font-bold uppercase tracking-widest text-destructive hover:underline px-0 py-0"
            isLoading={isSigningOut}
            onClick={async () => {
              setIsSigningOut(true)
              try { await onSignOut() } finally { setIsSigningOut(false) }
            }}
          >
            <TextPrimary text="Logout" className="" />
          </BaseButton>
          {/* Mobile hamburger */}
          <button className="md:hidden p-1" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <TextPrimary text={mobileMenuOpen ? "close" : "menu"} className="material-symbols-outlined text-on-surface" />
          </button>
        </Row>
      </Row>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <Col className="md:hidden px-4 pb-4 gap-3 border-t border-outline-variant/10 bg-surface-container-lowest">
          <NavLink to="/" className="text-sm font-bold text-on-surface-variant hover:text-primary py-2" activeClassName="text-primary" onClick={() => setMobileMenuOpen(false)}>Home</NavLink>
          <NavLink to="/dashboard" className="text-sm font-bold text-on-surface-variant hover:text-primary py-2" activeClassName="text-primary" onClick={() => setMobileMenuOpen(false)}>Dashboard</NavLink>
          <NavLink to="/forward-pricing" className="text-sm font-bold text-on-surface-variant hover:text-primary py-2" activeClassName="text-primary" onClick={() => setMobileMenuOpen(false)}>Market Pricing</NavLink>
          <BaseButton
            variant="light"
            size="sm"
            className="sm:hidden text-xs font-bold uppercase tracking-widest text-destructive hover:underline px-0 py-0 justify-start"
            isLoading={isSigningOut}
            onClick={async () => { setIsSigningOut(true); try { await onSignOut() } finally { setIsSigningOut(false) } }}
          >
            <TextPrimary text="Logout" className="" />
          </BaseButton>
        </Col>
      )}
    </Box>
  )
}
