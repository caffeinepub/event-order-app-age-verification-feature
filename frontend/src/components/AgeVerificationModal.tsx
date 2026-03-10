import { useState } from 'react';
import { AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useCartStore } from '../store/cartStore';
import { useVerifyAgeAndCheckout } from '../hooks/useQueries';
import { toast } from 'sonner';

interface AgeVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AgeVerificationModal({ isOpen, onClose }: AgeVerificationModalProps) {
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'failed'>('pending');
  const { items, clearCart } = useCartStore();
  const verifyMutation = useVerifyAgeAndCheckout();

  const hasAlcohol = items.some((item) => item.containsAlcohol);

  const handleVerify = async (isVerified: boolean) => {
    if (!isVerified) {
      setVerificationStatus('failed');
      return;
    }

    try {
      const cartItems: Array<[bigint, bigint]> = items.map((item) => [
        BigInt(item.id),
        BigInt(item.quantity),
      ]);

      await verifyMutation.mutateAsync({
        cartItems,
        isAgeVerified: true,
      });

      setVerificationStatus('success');
      
      setTimeout(() => {
        clearCart();
        toast.success('Order placed successfully!');
        handleClose();
      }, 2000);
    } catch (error) {
      setVerificationStatus('failed');
      toast.error('Checkout failed. Please try again.');
    }
  };

  const handleClose = () => {
    setVerificationStatus('pending');
    onClose();
  };

  if (!hasAlcohol && isOpen) {
    // If no alcohol, proceed directly
    handleVerify(true);
    return null;
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={handleClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            {verificationStatus === 'pending' && <AlertTriangle className="h-8 w-8 text-destructive" />}
            {verificationStatus === 'success' && <CheckCircle2 className="h-8 w-8 text-green-600" />}
            {verificationStatus === 'failed' && <XCircle className="h-8 w-8 text-destructive" />}
          </div>
          <AlertDialogTitle className="text-center text-2xl">
            {verificationStatus === 'pending' && 'Age Verification Required'}
            {verificationStatus === 'success' && 'Verification Successful'}
            {verificationStatus === 'failed' && 'Verification Failed'}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            {verificationStatus === 'pending' &&
              'Your cart contains alcohol. You must be 21 years or older to complete this purchase.'}
            {verificationStatus === 'success' && 'Your order has been placed successfully!'}
            {verificationStatus === 'failed' &&
              'You must be 21 or older to purchase alcohol. Please remove alcohol items from your cart to continue.'}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {verificationStatus === 'pending' && (
          <>
            <Alert className="border-destructive/50 bg-destructive/5">
              <AlertDescription className="text-sm">
                By clicking "I am 21 or older", you confirm that you meet the legal drinking age requirement.
              </AlertDescription>
            </Alert>

            <AlertDialogFooter className="flex-col gap-2 sm:flex-col">
              <Button
                className="w-full"
                onClick={() => handleVerify(true)}
                disabled={verifyMutation.isPending}
              >
                {verifyMutation.isPending ? 'Processing...' : 'I am 21 or older'}
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleVerify(false)}
                disabled={verifyMutation.isPending}
              >
                I am under 21
              </Button>
            </AlertDialogFooter>
          </>
        )}

        {verificationStatus === 'failed' && (
          <AlertDialogFooter>
            <Button variant="outline" className="w-full" onClick={handleClose}>
              Return to Cart
            </Button>
          </AlertDialogFooter>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}
