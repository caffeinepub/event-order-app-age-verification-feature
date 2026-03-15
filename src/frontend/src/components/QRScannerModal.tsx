import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Camera,
  CameraOff,
  Check,
  Copy,
  QrCode,
  StopCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useQRScanner } from "../qr-code/useQRScanner";

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function QRScannerModal({
  isOpen,
  onClose,
}: QRScannerModalProps) {
  const [copied, setCopied] = useState(false);

  const scanner = useQRScanner({
    facingMode: "environment",
    scanInterval: 150,
  });

  const handleStartStop = async () => {
    if (scanner.isScanning) {
      await scanner.stopScanning();
    } else {
      const ok = await scanner.startScanning();
      if (!ok) {
        toast.error("Could not access camera. Please check permissions.");
      }
    }
  };

  const handleClose = async () => {
    if (scanner.isScanning) await scanner.stopScanning();
    scanner.reset();
    onClose();
  };

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const latestResult = scanner.qrResults[0];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-sm gap-4" data-ocid="qr_scanner.modal">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5 text-primary" />
            Scan QR Code
          </DialogTitle>
        </DialogHeader>

        {/* Camera preview */}
        <div className="relative aspect-square overflow-hidden rounded-xl bg-black">
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <video
            ref={scanner.videoRef}
            autoPlay
            playsInline
            muted
            className="h-full w-full object-cover"
          />
          <canvas ref={scanner.canvasRef} className="hidden" />

          {/* Overlay when not active */}
          {!scanner.isActive && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/70 text-white">
              {scanner.isLoading ? (
                <>
                  <Camera className="h-10 w-10 animate-pulse text-primary" />
                  <p className="text-sm">Starting camera&hellip;</p>
                </>
              ) : (
                <>
                  <CameraOff className="h-10 w-10 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Camera inactive
                  </p>
                </>
              )}
            </div>
          )}

          {/* Scanning crosshair overlay */}
          {scanner.isActive && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="h-48 w-48 rounded-lg border-2 border-primary/70 shadow-[0_0_0_9999px_rgba(0,0,0,0.35)]" />
            </div>
          )}
        </div>

        {/* Error state */}
        {scanner.error && (
          <div
            className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive"
            data-ocid="qr_scanner.error_state"
          >
            {scanner.isSupported === false
              ? "Camera is not supported on this device."
              : scanner.error.message}
          </div>
        )}

        {/* Controls */}
        <div className="flex gap-2">
          {scanner.isScanning ? (
            <Button
              variant="destructive"
              className="flex-1 gap-2"
              onClick={handleStartStop}
              data-ocid="qr_scanner.stop_button"
            >
              <StopCircle className="h-4 w-4" />
              Stop Scanning
            </Button>
          ) : (
            <Button
              className="flex-1 gap-2"
              onClick={handleStartStop}
              disabled={!scanner.canStartScanning && !scanner.isLoading}
              data-ocid="qr_scanner.start_button"
            >
              <Camera className="h-4 w-4" />
              Start Scanning
            </Button>
          )}
          <Button
            variant="outline"
            onClick={handleClose}
            data-ocid="qr_scanner.close_button"
          >
            Close
          </Button>
        </div>

        {/* Latest scan result */}
        {latestResult && (
          <div className="rounded-xl border border-border bg-muted/30 p-4">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Last Scanned
              </p>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 gap-1 px-2 text-xs"
                onClick={() => handleCopy(latestResult.data)}
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-green-500" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
            <p className="break-all text-sm font-medium text-foreground">
              {latestResult.data}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {new Date(latestResult.timestamp).toLocaleTimeString()}
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
