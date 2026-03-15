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
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Upload,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { useCartStore } from "../store/cartStore";

interface AgeVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAgeVerified: () => void;
}

type Step = "age" | "id_upload" | "failed";

export default function AgeVerificationModal({
  isOpen,
  onClose,
  onAgeVerified,
}: AgeVerificationModalProps) {
  const [step, setStep] = useState<Step>("age");
  const [idFile, setIdFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { items } = useCartStore();

  const hasAlcohol = items.some((item) => item.containsAlcohol);

  const handleAgeConfirm = (isOfAge: boolean) => {
    if (!isOfAge) {
      setStep("failed");
      return;
    }
    setStep("id_upload");
  };

  const handleFileChange = (file: File | null) => {
    if (file) setIdFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileChange(file);
  };

  const handleClose = () => {
    setStep("age");
    setIdFile(null);
    onClose();
  };

  const handleSubmit = () => {
    setStep("age");
    setIdFile(null);
    onAgeVerified();
  };

  if (!hasAlcohol) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={handleClose}>
      <AlertDialogContent className="max-w-md">
        {/* STEP: Age Confirmation */}
        {step === "age" && (
          <>
            <AlertDialogHeader>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                <AlertTriangle className="h-8 w-8 text-destructive" />
              </div>
              <AlertDialogTitle className="text-center text-2xl">
                Age Verification Required
              </AlertDialogTitle>
              <AlertDialogDescription className="text-center">
                Your cart contains alcohol. You must be 21 years or older to
                complete this purchase.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <Alert className="border-destructive/50 bg-destructive/5">
              <AlertDescription className="text-sm">
                By clicking &ldquo;I am 21 or older&rdquo;, you confirm that you
                meet the legal drinking age requirement.
              </AlertDescription>
            </Alert>

            <AlertDialogFooter className="flex-col gap-2 sm:flex-col">
              <Button
                data-ocid="age_verification.confirm_button"
                className="w-full"
                onClick={() => handleAgeConfirm(true)}
              >
                I am 21 or older
              </Button>
              <Button
                data-ocid="age_verification.cancel_button"
                variant="outline"
                className="w-full"
                onClick={() => handleAgeConfirm(false)}
              >
                I am under 21
              </Button>
            </AlertDialogFooter>
          </>
        )}

        {/* STEP: ID Upload */}
        {step === "id_upload" && (
          <>
            <AlertDialogHeader>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              <AlertDialogTitle className="text-center text-2xl">
                Upload Your ID
              </AlertDialogTitle>
              <AlertDialogDescription className="text-center">
                Please upload a photo of your driver&apos;s license or
                government-issued ID to complete your alcohol purchase.
              </AlertDialogDescription>
            </AlertDialogHeader>

            {/* Use <label> for full a11y: click + keyboard both open file picker */}
            <label
              htmlFor="id-file-input"
              className={`relative block cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition-colors ${
                isDragging
                  ? "border-primary bg-primary/5"
                  : idFile
                    ? "border-green-500/60 bg-green-500/5"
                    : "border-border hover:border-primary/50 hover:bg-muted/30"
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              data-ocid="age_verification.dropzone"
            >
              <input
                id="id-file-input"
                type="file"
                accept="image/*,application/pdf"
                className="hidden"
                onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
                data-ocid="age_verification.upload_button"
              />
              {idFile ? (
                <div className="flex flex-col items-center gap-2">
                  <CheckCircle2 className="h-10 w-10 text-green-500" />
                  <p className="text-sm font-medium text-foreground">
                    {idFile.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {(idFile.size / 1024).toFixed(1)} KB &mdash; Click to change
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Upload className="h-10 w-10 text-muted-foreground" />
                  <p className="text-sm font-medium text-foreground">
                    Drop your ID here or click to browse
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Accepts JPG, PNG, or PDF
                  </p>
                </div>
              )}
            </label>

            <AlertDialogFooter className="flex-col gap-2 sm:flex-col">
              <Button
                data-ocid="age_verification.submit_button"
                className="w-full"
                disabled={!idFile}
                onClick={handleSubmit}
              >
                Continue to Payment
              </Button>
              <Button
                variant="ghost"
                className="w-full gap-1.5"
                onClick={() => setStep("age")}
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            </AlertDialogFooter>
          </>
        )}

        {/* STEP: Failed */}
        {step === "failed" && (
          <>
            <AlertDialogHeader>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                <XCircle className="h-8 w-8 text-destructive" />
              </div>
              <AlertDialogTitle className="text-center text-2xl">
                Verification Failed
              </AlertDialogTitle>
              <AlertDialogDescription className="text-center">
                You must be 21 or older to purchase alcohol. Please remove
                alcohol items from your cart to continue.
              </AlertDialogDescription>
            </AlertDialogHeader>
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
          </>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}
