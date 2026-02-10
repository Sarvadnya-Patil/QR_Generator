import { useState, useEffect, useRef, useCallback } from 'react';

// Color conversion helpers
const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
};

const rgbToHsv = ({ r, g, b }) => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, v = max;
    const d = max - min;
    s = max === 0 ? 0 : d / max;

    if (max === min) {
        h = 0;
    } else {
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return { h: h * 360, s: s * 100, v: v * 100 };
};

const hsvToRgb = (h, s, v) => {
    s /= 100; v /= 100;
    let r, g, b;
    const i = Math.floor(h / 60);
    const f = h / 60 - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
};

const rgbToHex = ({ r, g, b }) => {
    const toHex = (n) => n.toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

const ColorPicker = ({ label, color, onChange }) => {
    const [hsv, setHsv] = useState(() => rgbToHsv(hexToRgb(color)));
    const [hexInput, setHexInput] = useState(color);
    const satRef = useRef(null);
    const hueRef = useRef(null);
    const isDraggingSat = useRef(false);
    const isDraggingHue = useRef(false);

    // Sync from external color prop
    useEffect(() => {
        const currentHex = rgbToHex(hsvToRgb(hsv.h, hsv.s, hsv.v)).toLowerCase();
        if (color.toLowerCase() !== currentHex) {
            const newHsv = rgbToHsv(hexToRgb(color));
            setHsv(newHsv);
            setHexInput(color);
        }
    }, [color]);

    const updateColor = useCallback((newHsv) => {
        setHsv(newHsv);
        const hex = rgbToHex(hsvToRgb(newHsv.h, newHsv.s, newHsv.v));
        setHexInput(hex);
        onChange(hex);
    }, [onChange]);

    const handleSatMove = useCallback((e) => {
        if (!satRef.current) return;
        const rect = satRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        const y = Math.max(0, Math.min(1, 1 - (e.clientY - rect.top) / rect.height));
        updateColor({ ...hsv, s: x * 100, v: y * 100 });
    }, [hsv, updateColor]);

    const handleHueMove = useCallback((e) => {
        if (!hueRef.current) return;
        const rect = hueRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        updateColor({ ...hsv, h: x * 360 });
    }, [hsv, updateColor]);

    useEffect(() => {
        const onMouseMove = (e) => {
            if (isDraggingSat.current) handleSatMove(e);
            if (isDraggingHue.current) handleHueMove(e);
        };
        const onMouseUp = () => {
            isDraggingSat.current = false;
            isDraggingHue.current = false;
        };
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        };
    }, [handleSatMove, handleHueMove]);

    return (
        <div className="space-y-4">
            <label className="block text-sm font-medium text-white/80">
                {label}
            </label>

            {/* Saturation/Value Area */}
            <div
                ref={satRef}
                className="relative h-32 rounded-xl cursor-crosshair overflow-hidden border-2 border-black"
                style={{ backgroundColor: `hsl(${hsv.h}, 100%, 50%)` }}
                onMouseDown={(e) => {
                    isDraggingSat.current = true;
                    handleSatMove(e);
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-r from-white to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />

                {/* Pointer */}
                <div
                    className="absolute w-4 h-4 border-2 border-white rounded-full shadow-[0_0_5px_rgba(0,0,0,0.5)] -translate-x-1/2 translate-y-1/2 pointer-events-none"
                    style={{ left: `${hsv.s}%`, bottom: `${hsv.v}%` }}
                />
            </div>

            {/* Hue Slider */}
            <div
                ref={hueRef}
                className="relative h-4 rounded-full cursor-pointer border border-black shadow-inner"
                style={{
                    background: 'linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)'
                }}
                onMouseDown={(e) => {
                    isDraggingHue.current = true;
                    handleHueMove(e);
                }}
            >
                {/* Hue Pointer */}
                <div
                    className="absolute top-1/2 w-5 h-5 bg-white border-2 border-white shadow-md rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ left: `${(hsv.h / 360) * 100}%` }}
                />
            </div>

            {/* Color Preview & Hex Input */}
            <div className="flex gap-2 items-center">
                <div
                    className="h-10 w-10 rounded-lg border-2 border-black shadow-inner flex-shrink-0"
                    style={{ backgroundColor: color }}
                />
                <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 font-mono text-xs">#</span>
                    <input
                        type="text"
                        value={hexInput.replace('#', '')}
                        onChange={(e) => {
                            const val = e.target.value;
                            setHexInput('#' + val);
                            if (/^([a-fA-F0-9]{3}|[a-fA-F0-9]{6})$/.test(val)) {
                                onChange('#' + val);
                            }
                        }}
                        className="glass-input w-full pl-6 text-xs font-mono uppercase py-2"
                        placeholder="000000"
                        maxLength={6}
                    />
                </div>
            </div>
        </div>
    );
};

export default ColorPicker;
