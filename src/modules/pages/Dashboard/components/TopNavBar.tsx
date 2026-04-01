import { useState } from "react";
import { Link } from "react-router-dom";
import type { User } from "@supabase/supabase-js";
import Row from "@/modules/common/components/Row";
import Col from "@/modules/common/components/Col";
import Box from "@/modules/common/components/Box";
import TextPrimary from "@/modules/common/components/TextPrimary";
import { NavLink } from "@/components/NavLink";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import signalLogo from "@/images/signal_img.png";

interface TopNavBarProps {
  user: User | null;
  onSignOut: () => Promise<void>;
}

export default function TopNavBar({ user, onSignOut }: TopNavBarProps) {
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isLoggedIn = user != null;
  const avatarUrl =
    user?.user_metadata?.avatar_url ?? user?.user_metadata?.picture;
  const isAdmin = user?.user_metadata?.is_admin === true;
  /** Forward Pricing route is always Consumer Price Intelligence (including for admins). */
  const forwardPricingNavLabel = "Consumer Price Intelligence";
  const homePath = !isLoggedIn ? "/" : isAdmin ? "/" : "/forward-pricing";
  const fullName =
    user &&
    typeof user.user_metadata?.full_name === "string" &&
    user.user_metadata.full_name.trim()
      ? user.user_metadata.full_name.trim()
      : (user?.email ?? "");

  return (
    <Box className="w-full sticky top-0 z-40 bg-surface-container-lowest/80 backdrop-blur-xl border-b border-outline-variant/20">
      <Row className="justify-between items-center px-4 md:px-6 h-11 md:h-12">
        {/* Left: Logo + Nav */}
        <Row className="items-center gap-6 md:gap-8">
          <Link
            to={homePath}
            className="flex items-center shrink-0 rounded-lg focus-visible:outline focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            aria-label={
              !isLoggedIn
                ? `Signal — ${forwardPricingNavLabel}`
                : isAdmin
                  ? "Signal — Home"
                  : `Signal — ${forwardPricingNavLabel}`
            }
          >
            <Box className="flex items-center rounded-md bg-white px-2 py-1 shadow-sm ring-1 ring-black/[0.06] dark:ring-white/15">
              <img
                src={signalLogo}
                alt=""
                className="h-6 sm:h-6 md:h-7 w-auto object-contain object-left"
                width={120}
                height={39}
                decoding="async"
              />
            </Box>
          </Link>
          <Row className="hidden md:flex items-center gap-1">
            {isAdmin ? (
              <NavLink
                to="/"
                className="text-sm font-medium text-on-surface-variant hover:bg-surface-container-low px-3 py-1 rounded transition-colors"
                activeClassName="text-primary border-b-2 border-primary"
              >
                Home
              </NavLink>
            ) : null}
            <NavLink
              to="/forward-pricing"
              className="text-sm font-medium text-on-surface-variant hover:bg-surface-container-low px-3 py-1 rounded transition-colors"
              activeClassName="text-primary border-b-2 border-primary"
            >
              {forwardPricingNavLabel}
            </NavLink>
          </Row>
        </Row>

        {/* Center: Search */}
        {/* <Row className="hidden lg:flex items-center bg-surface-container-low px-3 py-1.5 rounded-lg border border-transparent focus-within:border-surface-tint transition-all">
          <TextPrimary text="search" className="material-symbols-outlined text-on-surface-variant text-sm mr-2" />
          <input
            type="text"
            placeholder="Search analytics..."
            className="bg-transparent border-none focus:ring-0 text-sm w-48 text-on-surface outline-none"
          />
        </Row> */}

        {/* Right: user menu or sign in + mobile hamburger */}
        <Row className="items-center gap-1 sm:gap-2 min-w-0 shrink-0">
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-0.5 rounded-full p-0.5 outline-none transition-colors hover:bg-surface-container-low focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                  aria-label="Open user menu"
                >
                  <Box className="h-8 w-8 shrink-0 rounded-full bg-surface-container-high overflow-hidden border border-outline-variant/20">
                    {avatarUrl ? (
                      <img
                        alt=""
                        className="h-full w-full object-cover"
                        src={avatarUrl}
                      />
                    ) : (
                      <Row className="h-full w-full items-center justify-center">
                        <TextPrimary
                          text="person"
                          className="material-symbols-outlined text-on-surface-variant text-base"
                        />
                      </Row>
                    )}
                  </Box>
                  <TextPrimary
                    text="expand_more"
                    className="material-symbols-outlined text-on-surface-variant text-lg leading-none hidden sm:block"
                  />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 z-[100]">
                <DropdownMenuLabel className="font-normal">
                  <Col className="gap-0.5 py-0.5">
                    <span className="text-sm font-semibold text-foreground leading-tight truncate">
                      {fullName}
                    </span>
                    {user.email ? (
                      <span className="text-xs text-muted-foreground leading-tight truncate">
                        {user.email}
                      </span>
                    ) : null}
                  </Col>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive focus:bg-destructive/10"
                  disabled={isSigningOut}
                  onSelect={() => {
                    void (async () => {
                      setIsSigningOut(true);
                      try {
                        await onSignOut();
                      } finally {
                        setIsSigningOut(false);
                      }
                    })();
                  }}
                >
                  {isSigningOut ? "Signing out…" : "Log out"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              to="/"
              className="text-sm font-medium text-primary hover:opacity-90 px-2 py-1 rounded-md focus-visible:outline focus-visible:ring-2 focus-visible:ring-primary/40"
            >
              Sign in
            </Link>
          )}
          {/* Mobile hamburger */}
          <button
            className="md:hidden p-1"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <TextPrimary
              text={mobileMenuOpen ? "close" : "menu"}
              className="material-symbols-outlined text-on-surface"
            />
          </button>
        </Row>
      </Row>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <Col className="md:hidden px-4 pb-4 gap-3 border-t border-outline-variant/10 bg-surface-container-lowest">
          {isAdmin ? (
            <NavLink
              to="/"
              className="text-sm font-bold text-on-surface-variant hover:text-primary py-2"
              activeClassName="text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </NavLink>
          ) : null}
          <NavLink
            to="/forward-pricing"
            className="text-sm font-bold text-on-surface-variant hover:text-primary py-2"
            activeClassName="text-primary"
            onClick={() => setMobileMenuOpen(false)}
          >
            {forwardPricingNavLabel}
          </NavLink>
          {!isLoggedIn ? (
            <Link
              to="/"
              className="text-sm font-bold text-primary py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Sign in
            </Link>
          ) : null}
        </Col>
      )}
    </Box>
  );
}
