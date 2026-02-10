import { useState, useEffect } from 'react';
import InputSelector from './InputSelector';
import ColorPicker from './ColorPicker';
import QRPreview from './QRPreview';
import { downloadQRWithLogo, uploadToCloud } from '../utils/qrUtils';

const QRGenerator = () => {
    // Input state
    const [inputType, setInputType] = useState('url');
    const [inputValue, setInputValue] = useState('');
    const [qrValue, setQrValue] = useState('');

    // QR customization state
    const [size, setSize] = useState(256);
    const [fgColor, setFgColor] = useState('#000000');
    const [bgColor, setBgColor] = useState('#ffffff');
    const [errorLevel, setErrorLevel] = useState('M');

    // Cloud upload state
    const [isUploading, setIsUploading] = useState(false);
    const [cloudLink, setCloudLink] = useState('');

    // Update QR value when input changes
    useEffect(() => {
        // If we have a cloud link, use it. Otherwise use the raw input.
        if (cloudLink) {
            setQrValue(cloudLink);
        } else {
            setQrValue(inputValue);
        }
    }, [inputValue, cloudLink]);

    // Reset cloud link when input type or content changes manually
    const handleInputChange = (val) => {
        setInputValue(val);
        setCloudLink('');
    };

    // Handle cloud upload
    const handleCloudUpload = async () => {
        if (!inputValue) return;

        setIsUploading(true);
        try {
            const link = await uploadToCloud(inputValue, 'text');
            setCloudLink(link);
            setQrValue(link);
            alert('Large data uploaded successfully! QR code updated with the cloud link.');
        } catch (error) {
            console.error('Cloud upload error:', error);
            alert('Failed to upload to cloud: ' + error.message);
        } finally {
            setIsUploading(false);
        }
    };

    // Download QR code
    const handleDownload = () => {
        const canvas = document.getElementById('qr-code-canvas');
        if (!canvas) {
            alert('Please generate a QR code first');
            return;
        }

        downloadQRWithLogo(canvas, null, size, bgColor, 'qrcode.png');
    };

    return (
        <div className="grid lg:grid-cols-2 gap-8 animate-slide-up">
            {/* Left Panel - Controls */}
            <div className="space-y-6">
                <div className="glass-card p-6 sm:p-8">
                    <h2 className="text-2xl font-bold mb-6 text-white">Content</h2>
                    <InputSelector
                        inputType={inputType}
                        setInputType={setInputType}
                        inputValue={inputValue}
                        setInputValue={handleInputChange}
                    />
                </div>

                {/* Cloud Upload Action */}
                {(inputValue.length > 2000 || cloudLink) && (
                    <div className="glass-card p-6 sm:p-8 animate-fade-in border-accent-500/30">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-accent-500/10 rounded-lg">
                                <svg className="w-6 h-6 text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-white">Cloud Hosting</h3>
                                <p className="text-sm text-white/60 mb-4">
                                    {cloudLink
                                        ? "Your content is hosted in the cloud. The QR code points to the secure link."
                                        : "This data is quite large. Upload it to the cloud to generate a smaller, more reliable QR code."}
                                </p>

                                {!cloudLink ? (
                                    <button
                                        onClick={handleCloudUpload}
                                        disabled={isUploading}
                                        className="btn-secondary w-full py-2 flex items-center justify-center gap-2"
                                    >
                                        {isUploading ? (
                                            <>
                                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Uploading...
                                            </>
                                        ) : (
                                            "Upload to Cloud & Generate QR"
                                        )}
                                    </button>
                                ) : (
                                    <div className="space-y-2">
                                        <div className="p-2 bg-white/5 rounded border border-white/10 flex items-center justify-between">
                                            <span className="text-xs text-accent-400 truncate mr-2">{cloudLink}</span>
                                            <button
                                                onClick={() => setCloudLink('')}
                                                className="text-white/40 hover:text-red-400 text-xs transition-colors"
                                            >
                                                Reset
                                            </button>
                                        </div>
                                        <p className="text-[10px] text-white/40 italic">Note: Links expire after some time based on the host.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                <div className="glass-card p-6 sm:p-8">
                    <h2 className="text-2xl font-bold mb-6 text-white">Customization</h2>

                    <div className="space-y-6">
                        {/* Size Slider */}
                        <div>
                            <label className="block text-sm font-medium text-white/80 mb-2">
                                Size: {size}px
                            </label>
                            <input
                                type="range"
                                min="128"
                                max="512"
                                step="32"
                                value={size}
                                onChange={(e) => setSize(Number(e.target.value))}
                                className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-accent-500"
                            />
                            <div className="flex justify-between text-xs text-white/50 mt-2">
                                <span>128px</span>
                                <span className={`${qrValue.length > 2000 ? 'text-red-400 font-bold' : qrValue.length > 1500 ? 'text-yellow-400' : ''}`}>
                                    {qrValue.length > 2000 ? 'Cloud Recommended: ' : ''}
                                    Characters: {qrValue.length} / 2500
                                </span>
                                <span>512px</span>
                            </div>
                        </div>

                        {/* Error Correction Level */}
                        <div>
                            <label className="block text-sm font-medium text-white/80 mb-3">
                                Error Correction Level
                            </label>
                            <div className="grid grid-cols-4 gap-2">
                                {['L', 'M', 'Q', 'H'].map((level) => (
                                    <button
                                        key={level}
                                        onClick={() => setErrorLevel(level)}
                                        className={`py-2 px-4 rounded-lg font-medium transition-all duration-300 ${errorLevel === level
                                            ? 'bg-gradient-to-tr from-indigo-900 to-indigo-400 text-white shadow-lg'
                                            : 'bg-white/5 text-white/70 hover:bg-white/10'
                                            }`}
                                    >
                                        {level}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Color Pickers */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-accent-400 uppercase tracking-wider mb-2">Foreground</label>
                                <ColorPicker
                                    color={fgColor}
                                    onChange={setFgColor}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-accent-400 uppercase tracking-wider mb-2">Background</label>
                                <ColorPicker
                                    color={bgColor}
                                    onChange={setBgColor}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Panel - Preview & Download */}
            <div className="space-y-6">
                <div className="glass-card p-6 sm:p-8">
                    <h2 className="text-2xl font-bold mb-6 text-white">Preview</h2>
                    <div className="flex justify-center">
                        <QRPreview
                            value={qrValue}
                            size={size}
                            fgColor={fgColor}
                            bgColor={bgColor}
                            errorLevel={errorLevel}
                        />
                    </div>
                </div>

                {/* Download Button */}
                <button
                    onClick={handleDownload}
                    disabled={!qrValue}
                    className={`w-full btn-primary py-4 text-lg font-bold flex items-center justify-center gap-3 ${!qrValue ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download QR Code
                </button>

                {/* Info Card */}
                <div className="glass-card p-6">
                    <h3 className="text-lg font-semibold text-white mb-3">Quick Tips</h3>
                    <ul className="space-y-2 text-sm text-white/70">
                        <li className="flex items-start gap-2">
                            <svg className="w-5 h-5 text-accent-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>Larger QR codes are easier to scan from a distance</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <svg className="w-5 h-5 text-accent-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>Ensure good contrast between foreground and background</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <svg className="w-5 h-5 text-accent-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>Test your QR code with a scanner before printing</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default QRGenerator;
