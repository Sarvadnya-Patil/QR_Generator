import { useState } from 'react'
import QRGenerator from './components/QRGenerator'

function App() {
    return (
        <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12 animate-fade-in">
                    <h1 className="text-5xl sm:text-6xl font-bold mb-4 bg-gradient-to-r from-accent-400 via-accent-300 to-accent-400 bg-clip-text text-transparent animate-gradient">
                        QR Code Generator
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                        Generate professional, high-performance QR codes with precise color control and robust scanning reliability.
                    </p>
                </div>

                {/* Main Content */}
                <QRGenerator />

                {/* Footer */}
                <div className="text-center mt-12 text-slate-600 text-sm relative">
                    <span>Professional QR Generation • Precise Color Control • Cloud Support for Large Data</span>
                    <span className='absolute bottom-0 right-0 opacity-40'>| SarvDev</span>
                </div>
            </div>
        </div>
    )
}

export default App
