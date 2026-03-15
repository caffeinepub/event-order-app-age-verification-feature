import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  AlertCircle,
  Bell,
  CheckCircle2,
  CreditCard,
  Lock,
  MapPin,
  Receipt,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useCartStore } from "../store/cartStore";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: () => void;
}

function formatCardNumber(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
}

function formatExpiry(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return digits;
}

function formatCVC(value: string) {
  return value.replace(/\D/g, "").slice(0, 4);
}

function getCardBrand(number: string): string {
  const d = number.replace(/\s/g, "");
  if (/^4/.test(d)) return "Visa";
  if (/^5[1-5]/.test(d) || /^2[2-7]/.test(d)) return "Mastercard";
  if (/^3[47]/.test(d)) return "Amex";
  if (/^6(?:011|5)/.test(d)) return "Discover";
  return "";
}

function generateOrderNumber(): string {
  return `EO-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
}

async function requestAndSendNotification(orderNumber: string) {
  if (!("Notification" in window)) return;

  let permission = Notification.permission;
  if (permission === "default") {
    permission = await Notification.requestPermission();
  }

  if (permission === "granted") {
    // Simulate order ready after ~30 seconds (demo)
    setTimeout(() => {
      new Notification("Your order is ready! 🎉", {
        body: `Order ${orderNumber} is ready for pickup at the venue counter.`,
        icon: "/favicon.ico",
        tag: orderNumber,
      });
    }, 30000);
  }
}

export default function PaymentModal({
  isOpen,
  onClose,
  onPaymentSuccess,
}: PaymentModalProps) {
  const { items, getTotalPrice } = useCartStore();
  const total = getTotalPrice();

  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [nameOnCard, setNameOnCard] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [orderNumber] = useState(generateOrderNumber);
  const [orderTime] = useState(() => new Date().toLocaleString());

  const cardBrand = getCardBrand(cardNumber);

  const isFormValid =
    cardNumber.replace(/\s/g, "").length === 16 &&
    expiry.length === 5 &&
    cvc.length >= 3 &&
    nameOnCard.trim().length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || isProcessing) return;

    setIsProcessing(true);
    setErrorMsg("");

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const success = Math.random() > 0.05;

    if (success) {
      setPaymentStatus("success");
      // Request notification permission and schedule order-ready notification
      requestAndSendNotification(orderNumber);
      setTimeout(() => {
        onPaymentSuccess();
        handleClose();
      }, 6000);
    } else {
      setPaymentStatus("error");
      setErrorMsg(
        "Your card was declined. Please check your details and try again.",
      );
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    if (isProcessing || paymentStatus === "success") return;
    setCardNumber("");
    setExpiry("");
    setCvc("");
    setNameOnCard("");
    setPaymentStatus("idle");
    setErrorMsg("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        data-ocid="payment.modal"
        className="max-w-md p-0 overflow-hidden max-h-[90vh] overflow-y-auto"
        onInteractOutside={(e) => {
          if (isProcessing || paymentStatus === "success") e.preventDefault();
        }}
      >
        {/* Header */}
        <div className="bg-foreground px-6 py-5 sticky top-0 z-10">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary">
                  <CreditCard className="h-4 w-4 text-primary-foreground" />
                </div>
                <DialogTitle className="text-lg font-semibold text-primary-foreground">
                  {paymentStatus === "success"
                    ? "Order Receipt"
                    : "Secure Payment"}
                </DialogTitle>
              </div>
              <button
                data-ocid="payment.close_button"
                type="button"
                onClick={handleClose}
                disabled={isProcessing || paymentStatus === "success"}
                className="rounded-full p-1 text-primary-foreground/60 transition-colors hover:bg-white/10 hover:text-primary-foreground disabled:opacity-40"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </DialogHeader>
        </div>

        <AnimatePresence mode="wait">
          {paymentStatus === "success" ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-5 px-6 py-8"
              data-ocid="payment.success_state"
            >
              {/* Success icon */}
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                <CheckCircle2 className="h-10 w-10 text-green-600" />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-foreground">
                  Payment Confirmed!
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Your order has been placed successfully.
                </p>
              </div>

              {/* Receipt */}
              <div className="w-full rounded-xl border bg-muted/30 overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 bg-muted/60 border-b">
                  <Receipt className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Receipt
                  </span>
                </div>
                <div className="px-4 py-3 space-y-1.5">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Confirmation #</span>
                    <span className="font-mono font-bold text-primary text-sm">
                      {orderNumber}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Date &amp; Time</span>
                    <span className="text-foreground">{orderTime}</span>
                  </div>
                </div>
                <Separator />
                <div className="px-4 py-3 space-y-1.5">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-foreground/80">
                        {item.name}
                        <span className="text-muted-foreground ml-1">
                          x{item.quantity}
                        </span>
                      </span>
                      <span className="font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
                <Separator />
                <div className="flex justify-between px-4 py-3">
                  <span className="font-bold text-foreground">Total Paid</span>
                  <span className="font-bold text-green-600 text-lg">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Notification & Pickup info */}
              <div className="w-full space-y-3">
                <div className="flex items-start gap-3 rounded-xl bg-blue-50 border border-blue-100 px-4 py-3 text-left">
                  <Bell className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-blue-900">
                      You'll be notified when it's ready
                    </p>
                    <p className="text-xs text-blue-700 mt-0.5">
                      Allow notifications when prompted so we can alert you the
                      moment your order is prepared.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl bg-amber-50 border border-amber-100 px-4 py-3 text-left">
                  <MapPin className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-amber-900">
                      Pick up at the venue counter
                    </p>
                    <p className="text-xs text-amber-700 mt-0.5">
                      Head to the pickup area when you receive your
                      notification.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onSubmit={handleSubmit}
              className="px-6 py-5 space-y-5"
            >
              {/* Order Summary */}
              <div className="rounded-xl border bg-muted/40 px-4 py-3">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
                  Order Summary
                </p>
                <div className="space-y-1">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-foreground/80">
                        {item.name} × {item.quantity}
                      </span>
                      <span className="font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold text-primary text-lg">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Card Fields */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="nameOnCard" className="text-sm font-medium">
                    Name on Card
                  </Label>
                  <Input
                    id="nameOnCard"
                    placeholder="Jane Smith"
                    value={nameOnCard}
                    onChange={(e) => setNameOnCard(e.target.value)}
                    disabled={isProcessing}
                    autoComplete="cc-name"
                    className="h-11"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="cardNumber" className="text-sm font-medium">
                    Card Number
                  </Label>
                  <div className="relative">
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={(e) =>
                        setCardNumber(formatCardNumber(e.target.value))
                      }
                      disabled={isProcessing}
                      autoComplete="cc-number"
                      inputMode="numeric"
                      className="h-11 pr-16"
                    />
                    {cardBrand && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">
                        {cardBrand}
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="expiry" className="text-sm font-medium">
                      Expiry
                    </Label>
                    <Input
                      id="expiry"
                      placeholder="MM/YY"
                      value={expiry}
                      onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                      disabled={isProcessing}
                      autoComplete="cc-exp"
                      inputMode="numeric"
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="cvc" className="text-sm font-medium">
                      CVC
                    </Label>
                    <Input
                      id="cvc"
                      placeholder="123"
                      value={cvc}
                      onChange={(e) => setCvc(formatCVC(e.target.value))}
                      disabled={isProcessing}
                      autoComplete="cc-csc"
                      inputMode="numeric"
                      className="h-11"
                    />
                  </div>
                </div>
              </div>

              {/* Error */}
              {errorMsg && (
                <Alert
                  variant="destructive"
                  className="py-2"
                  data-ocid="payment.error_state"
                >
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    {errorMsg}
                  </AlertDescription>
                </Alert>
              )}

              {/* Security note */}
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Lock className="h-3 w-3" />
                <span>Your payment is encrypted and secure</span>
              </div>

              {/* Pay Button */}
              <Button
                data-ocid="payment.submit_button"
                type="submit"
                className="w-full h-12 text-base font-semibold"
                disabled={!isFormValid || isProcessing}
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <svg
                      aria-label="Loading"
                      role="img"
                      className="animate-spin h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z"
                      />
                    </svg>
                    Processing...
                  </span>
                ) : (
                  `Pay $${total.toFixed(2)}`
                )}
              </Button>
            </motion.form>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
