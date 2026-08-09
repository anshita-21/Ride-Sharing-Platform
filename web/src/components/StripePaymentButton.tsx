import { PaymentEventSessionCreatedData } from "../contracts"
import { Button } from "./ui/button"
import { loadStripe } from "@stripe/stripe-js"
import { STRIPE_PUBLISHABLE_KEY } from "../constants"

interface StripePaymentButtonProps {
  paymentSession: PaymentEventSessionCreatedData
  isLoading?: boolean
}

const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY)

export const StripePaymentButton = ({
  paymentSession,
  isLoading = false,
}: StripePaymentButtonProps) => {
  const handlePayment = async () => {
    if (!stripePromise) {
      console.error("Stripe publishable key is not set")
      return
    }

    const stripe = await stripePromise
    if (!stripe) {
      console.error("Stripe failed to load")
      return
    }

    // Redirect to Stripe Checkout
    const { error } = await stripe.redirectToCheckout({ sessionId: paymentSession.sessionID })
    if (error) {
      console.error("Payment error:", error)
    }
  }

  if (!STRIPE_PUBLISHABLE_KEY) {
    return (
      <Button disabled className="w-full bg-red-500 text-white">
        Stripe API Key is not set on the Next.js app
      </Button>
    )
  }

  return (
    <Button
      onClick={handlePayment}
      disabled={isLoading}
      className="w-full"
    >
      {isLoading ? "Loading..." : `Pay ₹${paymentSession.amount.toFixed(2)} (${paymentSession.currency})`}
    </Button>
  )
} 