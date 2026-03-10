import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, XCircle } from "lucide-react";
import { useState } from "react";
import { useCartStore } from "../store/cartStore";

interface AgeVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAgeVerified: () => void;
}

export default function AgeVerificationModal({
  isOpen,
  onClose,
  onAgeVerified,
}: AgeVerificationModalProps) {
  const [verificationStatus, setVerificationStatus] = useState<
    "pending" | "failed"
  >("pending");
  const { items } = useCartStore();

  const hasAlcohol = items.some((item) => item.containsAlcohol);

  const handleVerify = (isVerified: boolean) => {
    if (!isVerified) {
      setVerificationStatus("failed");
      return;
    }
    setVerificationStatus("pending");
    onAgeVerified();
  };

  const handleClose = () => {
    setVerificationStatus("pending");
    onClose();
  };

  if (!hasAlcohol) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={handleClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            {verificationStatus === "pending" ? (
              <AlertTriangle className="h-8 w-8 text-destructive" />
            ) : (
              <XCircle className="h-8 w-8 text-destructive" />
            )}
          </div>
          <AlertDialogTitle className="text-center text-2xl">
            {verificationStatus === "pending"
              ? "Age Verification Required"
              : "Verification Failed"}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            {verificationStatus === "pending"
              ? "Your cart contains alcohol. You must be 21 years or older to complete this purchase."
              : "You must be 21 or older to purchase alcohol. Please remove alcohol items from your cart to continue."}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {verificationStatus === "pending" && (
          <>
            <Alert className="border-destructive/50 bg-destructive/5">
              <AlertDescription className="text-sm">
                By clicking "I am 21 or older", you confirm that you meet the
                legal drinking age requirement.
              </AlertDescription>
            </Alert>

            <AlertDialogFooter className="flex-col gap-2 sm:flex-col">
              <Button
                data-ocid="age_verification.confirm_button"
                className="w-full"
                onClick={() => handleVerify(true)}
              >
                I am 21 or older
              </Button>
              <Button
                data-ocid="age_verification.cancel_button"
                variant="outline"
                className="w-full"
                onClick={() => handleVerify(false)}
              >
                I am under 21
              </Button>
            </AlertDialogFooter>
          </>
        )}

        {verificationStatus === "failed" && (
          <AlertDialogFooter>
            <Button
              data-ocid="age_verification.cancel_button"
              variant="outline"
              className="w-full"
              onClick={handleClose}
            >
              Return to Cart
            </Button>
          </AlertDialogFooter>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}
