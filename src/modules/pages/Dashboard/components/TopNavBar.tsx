import { useState } from "react"
import type { User } from "@supabase/supabase-js"
import Row from "@/modules/common/components/Row"
import Box from "@/modules/common/components/Box"
import TextPrimary from "@/modules/common/components/TextPrimary"
import BaseButton from "@/modules/common/components/BaseButton"
import BaseInput from "@/modules/common/components/BaseInput"
import { NavLink } from "@/components/NavLink"

interface TopNavBarProps {
  user: User
  onSignOut: () => Promise<void>
}

export default function TopNavBar({ user, onSignOut }: TopNavBarProps) {
  const [isSigningOut, setIsSigningOut] = useState(false)
  const avatarUrl = user.user_metadata?.avatar_url ?? user.user_metadata?.picture

  return (
    <Box className="w-full sticky top-0 z-40 bg-surface-container-lowest/80 backdrop-blur-xl border-b border-outline-variant/20">
      <Row className="justify-between items-center px-8 py-3">
        {/* Left: Logo + Nav */}
        <Row className="items-center gap-12">
          <TextPrimary text="Signal" className="text-lg font-bold text-primary tracking-tighter" />
          <Row className="items-center gap-6">
            <NavLink
              to="/dashboard"
              className="text-xs font-bold text-on-surface-variant hover:text-primary transition-colors"
              activeClassName="text-primary border-b-2 border-primary pb-0.5"
            >
              Dashboard
            </NavLink>
          </Row>
        </Row>

        {/* Center: Search */}
        <Row className="flex-grow justify-center">
          <Box className="relative">
            <TextPrimary text="search" className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/40 text-sm" />
            <input
              type="text"
              placeholder="Search analytics..."
              className="bg-surface-container-low border-none rounded-md pl-9 pr-4 py-1.5 text-xs focus:ring-1 focus:ring-primary w-64 outline-none"
            />
          </Box>
        </Row>

        {/* Right: Icons + Avatar + Logout */}
        <Row className="items-center gap-6">
          <Row className="gap-4">
            <TextPrimary text="notifications" className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary transition-colors" />
            <TextPrimary text="help" className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary transition-colors" />
          </Row>
          <Row className="items-center gap-3 pl-4 border-l border-outline-variant/20">
            <Box className="h-8 w-8 rounded-full bg-surface-container-high overflow-hidden ring-2 ring-surface-container-lowest">
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
              className="text-[0.625rem] font-black uppercase tracking-widest text-destructive hover:underline px-0 py-0"
              isLoading={isSigningOut}
              onClick={async () => {
                // TODO: Should create function for sign-out logic - performance tuning
                setIsSigningOut(true)
                try {
                  await onSignOut()
                } finally {
                  setIsSigningOut(false)
                }
              }}
            >
              <TextPrimary text="Logout" className="" />
            </BaseButton>
          </Row>
        </Row>
      </Row>
    </Box>
  )
}