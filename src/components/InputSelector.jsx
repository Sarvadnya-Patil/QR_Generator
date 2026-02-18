import { useState } from 'react';

const InputSelector = ({ inputType, setInputType, inputValue, setInputValue }) => {
    return (
        <div className="space-y-6">
            {/* Tab Buttons */}
            <div className="flex gap-2 p-1.5 bg-slate-950/40 backdrop-blur-sm rounded-xl border border-slate-800/60">
                <button
                    onClick={() => setInputType('url')}
                    className={`tab-button flex-1 ${inputType === 'url' ? 'tab-active' : 'tab-inactive'}`}
                >
                    <span className="flex items-center justify-center gap-2 text-sm">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                        URL
                    </span>
                </button>
                <button
                    onClick={() => setInputType('text')}
                    className={`tab-button flex-1 ${inputType === 'text' ? 'tab-active' : 'tab-inactive'}`}
                >
                    <span className="flex items-center justify-center gap-2 text-sm">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Text
                    </span>
                </button>
            </div>

            {/* Input Fields */}
            <div className="animate-slide-up">
                {inputType === 'url' && (
                    <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">
                            Enter URL
                        </label>
                        <input
                            type="url"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="https://example.com"
                            className="glass-input w-full"
                        />
                    </div>
                )}

                {inputType === 'text' && (
                    <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">
                            Enter Text
                        </label>
                        <textarea
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Enter any text to encode in QR code..."
                            rows={4}
                            className="glass-input w-full resize-none"
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default InputSelector;

