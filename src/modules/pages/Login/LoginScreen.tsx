import { useCallback, useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { lovable } from "@/integrations/lovable/index"
import { toast } from "sonner"
import { useAuth } from "@/hooks/useAuth"
import Col from "@/modules/common/components/Col"
import Row from "@/modules/common/components/Row"
import Box from "@/modules/common/components/Box"
import TextPrimary from "@/modules/common/components/TextPrimary"
import BaseButton from "@/modules/common/components/BaseButton"
import BaseInput from "@/modules/common/components/BaseInput"

const PUBLISHED_APP_URL = "https://code-whisperer-218.lovable.app"

const isPreviewEnvironment = () => {
  const { hostname } = window.location
  return hostname.includes("id-preview--") || hostname.endsWith(".lovableproject.com")
}

const getPublishedGoogleStartUrl = () => {
  const url = new URL("/", PUBLISHED_APP_URL)
  url.searchParams.set("oauth", "google")
  return url.toString()
}

const clearOAuthIntent = () => {
  const url = new URL(window.location.href)

  if (!url.searchParams.has("oauth")) {
    return
  }

  url.searchParams.delete("oauth")
  window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}` || "/")
}

interface IForm {
  email: string
  password: string
}

export default function LoginScreen() {
  const { user, isAuthLoading, session } = useAuth()
  const navigate = useNavigate()
  const [isEmailSubmitting, setIsEmailSubmitting] = useState(false)
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false)
  const hasAutoStartedGoogle = useRef(false)

  const form = useForm<IForm>({
    defaultValues: { email: "", password: "" },
    mode: "onChange",
  })

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (!isAuthLoading && user) {
      navigate("/dashboard", { replace: true })
    }
  }, [isAuthLoading, user, navigate])

  const handleGoogleSignIn = useCallback(async () => {
    setIsGoogleSubmitting(true)

    try {
      if (isPreviewEnvironment()) {
        window.location.assign(getPublishedGoogleStartUrl())
        return
      }

      clearOAuthIntent()

      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      })

      if (result.error) {
        toast.error("Google sign-in failed. Please try again.")
        return
      }

      if (result.redirected) {
        return
      }
    } catch {
      toast.error("Google sign-in failed. Please try again.")
    } finally {
      setIsGoogleSubmitting(false)
    }
  }, [])

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)

    if (
      searchParams.get("oauth") !== "google" ||
      hasAutoStartedGoogle.current ||
      session ||
      isAuthLoading
    ) {
      return
    }

    hasAutoStartedGoogle.current = true
    void handleGoogleSignIn()
  }, [handleGoogleSignIn, isAuthLoading, session])

  return (
    <Col className="login-screen min-h-screen bg-surface font-body text-on-surface relative overflow-hidden">
      {/* Background Architectural Elements */}
      <Box className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <Box className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-primary-fixed/30 rounded-full blur-[7.5rem]" />
        <Box className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-secondary-container/20 rounded-full blur-[6.25rem]" />
        <Box
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(hsl(var(--primary)) 1px, transparent 1px)",
            backgroundSize: "2.5rem 2.5rem",
          }}
        />
      </Box>

      {/* Side Image (Desktop) */}
      <Box className="fixed top-0 right-0 h-screen w-1/4 pointer-events-none opacity-20 hidden lg:block">
        <Box className="w-full h-full relative">
          <Box className="absolute inset-0 bg-gradient-to-l from-transparent to-surface z-10" />
          <img
            alt="Coastal roads in New Zealand mountains"
            className="w-full h-full object-cover grayscale opacity-50"
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80"
          />
        </Box>
      </Box>

      {/* Main Content */}
      <Col className="flex-grow items-center justify-center p-6 z-10 relative">
        <Col className="w-full max-w-[27.5rem] items-center">
          {/* Logo */}
          <Col className="mb-10 items-center gap-3">
            <Row className="w-[3.5rem] h-[3.5rem] bg-primary-container items-center justify-center rounded-xl shadow-xl">
              <TextPrimary text="⊕" className="text-primary-foreground text-2xl" />
            </Row>
            <TextPrimary
              text="SIGNAL"
              className="text-2xl font-black tracking-tighter text-primary"
              uppercase
            />
            <TextPrimary
              text="Fleet & Pricing Intelligence"
              className="text-on-surface-variant font-label text-xs tracking-widest"
              uppercase
            />
          </Col>

          {/* Login Card */}
          <Col className="w-full glass-panel rounded-xl shadow-[0_2rem_4rem_-0.75rem_rgba(0,10,30,0.1)] p-8 md:p-10 gap-8">
              {/* Heading */}
              <Col className="gap-1">
                <TextPrimary
                  text={isAuthLoading ? "Checking session" : "Welcome back"}
                  className="text-2xl font-bold tracking-tight text-on-surface"
                />
                <TextPrimary
                  text={
                    isAuthLoading
                      ? "Restoring your authentication state."
                      : "Please enter your details to access the terminal."
                  }
                  className="text-on-surface-variant text-sm"
                />
              </Col>

              {/* Actions */}
              <Col className="gap-4">
                <BaseButton
                  variant="bordered"
                  size="md"
                  className="w-full py-[0.875rem]"
                  isLoading={isGoogleSubmitting}
                  onClick={() => void handleGoogleSignIn()}
                >
                  <img
                    alt="Google Logo"
                    className="w-5 h-5"
                    src="https://www.google.com/favicon.ico"
                  />
                  <TextPrimary text="Sign in with Google" className="font-semibold text-on-surface text-sm" />
                </BaseButton>

                {/* Divider */}
                <Row className="items-center gap-4 py-2">
                  <Box className="flex-grow h-[1px] bg-outline-variant/30" />
                  <TextPrimary
                    text="or email"
                    className="text-[0.625rem] font-bold text-on-surface-variant/60 tracking-widest"
                    uppercase
                  />
                  <Box className="flex-grow h-[1px] bg-outline-variant/30" />
                </Row>

                {/* Form */}
                <form
                  onSubmit={form.handleSubmit(async (data) => {
                    // TODO: Should create mutation for login - performance tuning
                    setIsEmailSubmitting(true)
                    try {
                      console.log("Login submitted:", data)
                      await new Promise((resolve) => setTimeout(resolve, 1000))
                    } finally {
                      setIsEmailSubmitting(false)
                    }
                  })}
                >
                  <Col className="gap-5">
                    <BaseInput
                      label="Email Address"
                      type="email"
                      placeholder="name@company.com"
                      {...form.register("email", { required: true })}
                    />

                    <Col className="gap-[0.375rem]">
                      <Row className="justify-between items-center px-1">
                        <TextPrimary
                          text="Password"
                          className="text-xs font-bold text-on-surface-variant uppercase tracking-wider"
                        />
                        <a
                          className="text-[0.6875rem] font-semibold text-surface-tint hover:underline cursor-pointer"
                        >
                          <TextPrimary text="Forgot password?" className="" />
                        </a>
                      </Row>
                      <input
                        type="password"
                        placeholder="••••••••"
                        className="w-full bg-surface-container-low border-0 ring-1 ring-outline-variant/50 focus:ring-2 focus:ring-surface-tint rounded-lg py-3 px-4 text-on-surface text-sm transition-all outline-none"
                        {...form.register("password", { required: true })}
                      />
                    </Col>

                    <BaseButton
                      type="submit"
                      variant="filled-gradient"
                      size="lg"
                      className="w-full group"
                      isLoading={isEmailSubmitting}
                    >
                      <TextPrimary text="Sign in to Fleet" className="" />
                      <TextPrimary text="→" className="text-sm group-hover:translate-x-1 transition-transform inline-block" />
                    </BaseButton>
                  </Col>
                </form>
              </Col>

          </Col>

          {/* Bottom Links */}
          <Row className="mt-12 items-center justify-between w-full px-4 text-[0.6875rem] font-bold text-on-surface-variant/40 tracking-widest uppercase">
            <Row className="gap-6">
              <a className="hover:text-primary transition-colors cursor-pointer">
                <TextPrimary text="Privacy" className="" />
              </a>
              <a className="hover:text-primary transition-colors cursor-pointer">
                <TextPrimary text="Terms" className="" />
              </a>
              <a className="hover:text-primary transition-colors cursor-pointer">
                <TextPrimary text="System Status" className="" />
              </a>
            </Row>
            <Row className="items-center gap-1">
              <TextPrimary text="🌐" className="text-[0.875rem]" />
              <TextPrimary text="AU / NZ Network" className="" />
            </Row>
          </Row>
        </Col>
      </Col>
    </Col>
  )
}
