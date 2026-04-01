import type { User } from "@supabase/supabase-js"
import BaseButton from "@/modules/common/components/BaseButton"
import Col from "@/modules/common/components/Col"
import Row from "@/modules/common/components/Row"
import TextPrimary from "@/modules/common/components/TextPrimary"

interface AuthenticatedStateProps {
  isSigningOut: boolean
  onSignOut: () => Promise<void>
  user: User
}

export default function AuthenticatedState({ isSigningOut, onSignOut, user }: AuthenticatedStateProps) {
  const displayName = user.user_metadata?.full_name ?? user.user_metadata?.name ?? user.email ?? "Authenticated User"

  return (
    <Col className="w-full glass-panel rounded-xl shadow-[0_2rem_4rem_-0.75rem_rgba(0,10,30,0.1)] p-8 md:p-10 gap-8">
      <Col className="gap-1">
        <TextPrimary
          text="You’re signed in"
          className="text-2xl font-bold tracking-tight text-on-surface"
        />
        <TextPrimary
          text="Google authentication is active for this workspace."
          className="text-on-surface-variant text-sm"
        />
      </Col>

      <Col className="gap-4 rounded-xl bg-surface-container-low/70 ring-1 ring-outline-variant/30 p-5">
        <Row className="items-center justify-between gap-4 flex-wrap">
          <Col className="gap-1">
            <TextPrimary text={displayName} className="text-lg font-semibold text-on-surface" />
            {user.email ? <TextPrimary text={user.email} className="text-sm text-on-surface-variant" /> : null}
          </Col>
          <TextPrimary
            text="Authenticated"
            className="text-[0.6875rem] font-bold tracking-[0.2em] uppercase text-primary"
          />
        </Row>
      </Col>

      <BaseButton variant="bordered" size="md" className="w-full py-[0.875rem]" isLoading={isSigningOut} onClick={() => void onSignOut()}>
        <TextPrimary text="Sign out" className="font-semibold text-on-surface text-sm" />
      </BaseButton>
    </Col>
  )
}