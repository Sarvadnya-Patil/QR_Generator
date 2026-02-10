import React, { useEffect, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';

// Simple Error Boundary Component
class QRErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('QR Render Error:', error, errorInfo);
        if (this.props.onError) this.props.onError();
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback;
        }
        return this.props.children;
    }
}

const QRPreview = ({ value, size, fgColor, bgColor, errorLevel }) => {
    const [renderError, setRenderError] = useState(false);

    // Reset error when value changes
    useEffect(() => {
        setRenderError(false);
    }, [value, errorLevel]);

    const errorFallback = (
        <div
            className="glass-card p-12 flex items-center justify-center text-center"
            style={{ width: size + 48, height: size + 48 }}
        >
            <div className="space-y-4 max-w-xs">
                <svg className="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p className="text-white font-semibold">Data Too Large or Invalid</p>
                <p className="text-white/60 text-sm">The content is too big for a QR code or invalid. Please reduce the text length.</p>
            </div>
        </div>
    );

    if (!value) {
        return (
            <div
                className="glass-card p-12 flex items-center justify-center"
                style={{ width: size + 48, height: size + 48 }}
            >
                <div className="text-center space-y-3">
                    <svg
                        className="mx-auto h-16 w-16 text-white/30"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                        />
                    </svg>
                    <p className="text-white/60 font-medium">QR Code Preview</p>
                    <p className="text-white/40 text-sm">Enter content to generate</p>
                </div>
            </div>
        );
    }

    if (value.length > 2500 || renderError) {
        return errorFallback;
    }

    return (
        <div className="glass-card p-6 glow-hover transition-all duration-300">
            <div className="bg-white p-6 rounded-xl inline-block">
                <QRErrorBoundary fallback={errorFallback} onError={() => setRenderError(true)} key={value + errorLevel}>
                    <QRCodeCanvas
                        id="qr-code-canvas"
                        value={value}
                        size={size}
                        bgColor={bgColor}
                        fgColor={fgColor}
                        level={errorLevel}
                        includeMargin={false}
                    />
                </QRErrorBoundary>
            </div>
        </div>
    );
};

export default QRPreview;
