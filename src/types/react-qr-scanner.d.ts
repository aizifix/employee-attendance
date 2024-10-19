// src/types/react-qr-scanner.d.ts
declare module 'react-qr-scanner' {
    interface QRScannerProps {
      delay?: number;
      onError?: (error: any) => void;
      onScan?: (data: any) => void;
      style?: React.CSSProperties;
    }
    const QrScanner: React.FC<QRScannerProps>;
    export default QrScanner;
}
