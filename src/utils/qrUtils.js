/**
 * Download QR code as PNG
 * @param {string} elementId - ID of the canvas element containing the QR code
 * @param {string} filename - Name for the downloaded file
 */
export const downloadQRCode = (elementId, filename = 'qrcode.png') => {
    const canvas = document.getElementById(elementId);
    if (!canvas) {
        console.error('Canvas element not found');
        return;
    }

    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = filename;
    link.href = url;
    link.click();
};

/**
 * Download QR code with logo overlay and aesthetic padding
 * @param {HTMLCanvasElement} qrCanvas - The QR code canvas
 * @param {string} logoDataUrl - Base64 data URL of the logo
 * @param {number} qrSize - Size of the QR code
 * @param {string} bgColor - Background color of the QR code
 * @param {string} filename - Name for the downloaded file
 */
export const downloadQRWithLogo = (qrCanvas, logoDataUrl, qrSize, bgColor = '#ffffff', filename = 'qrcode.png') => {
    // Add padding (20% on each side)
    const padding = Math.floor(qrSize * 0.2);
    const totalSize = qrSize + (padding * 2);

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = totalSize;
    canvas.height = totalSize;

    // Fill background with white or specified color
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, totalSize, totalSize);

    // Draw QR code with padding offset
    ctx.drawImage(qrCanvas, padding, padding, qrSize, qrSize);

    // Download
    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = filename;
    link.href = url;
    link.click();
};

/**
 * Validate URL format
 * @param {string} url - URL to validate
 * @returns {boolean} True if valid URL
 */
export const isValidUrl = (url) => {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};

/**
 * Upload data to anonymous cloud storage via multi-service fallback
 * @param {string} data - Data string to upload
 * @returns {Promise<string>} Link to the uploaded content
 */
export const uploadToCloud = async (data) => {
    const formData = new FormData();
    const blob = new Blob([data], { type: 'text/plain' });
    formData.append('file', blob, 'content.txt');

    const services = [
        {
            name: 'file.io',
            url: 'https://file.io',
            method: 'POST',
            body: formData,
            handleResponse: async (res) => {
                const json = await res.json();
                if (json.success) return json.link;
                throw new Error(json.message || 'Upload failed');
            }
        },
        {
            name: '0x0.st',
            url: 'https://0x0.st',
            method: 'POST',
            body: formData,
            handleResponse: async (res) => {
                const text = await res.text();
                if (text && text.startsWith('http')) return text.trim();
                throw new Error('Invalid response');
            }
        },
        {
            name: 'uguu.se',
            url: 'https://uguu.se/api.php?d=upload-tool',
            method: 'POST',
            body: (() => {
                const fd = new FormData();
                fd.append('files[]', blob, 'content.txt');
                return fd;
            })(),
            handleResponse: async (res) => {
                const text = await res.text();
                if (text && text.startsWith('http')) return text.trim();
                throw new Error('Invalid response');
            }
        }
    ];

    console.log(`Starting cloud upload...`);

    for (const service of services) {
        try {
            console.log(`Attempting upload to ${service.name}...`);
            const response = await fetch(service.url, {
                method: service.method,
                body: service.body,
                mode: 'cors'
            });

            if (response.ok) {
                const link = await service.handleResponse(response);
                console.log(`Upload successful via ${service.name}: ${link}`);
                return link;
            } else {
                console.warn(`${service.name} returned status: ${response.status}`);
            }
        } catch (error) {
            console.warn(`${service.name} upload failed:`, error.message);
        }
    }

    throw new Error('All cloud storage services are currently unreachable from your browser. Please try a smaller text or check your internet connection.');
};

