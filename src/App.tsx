/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Copy, Check, Info, Sparkles, Filter, Trash2, Smartphone, Monitor, ChevronRight, Hash } from 'lucide-react';
import { generateFonts, FontResult, FONT_CATEGORIES, Category } from './lib/fonts';

export default function App() {
  const [inputText, setInputText] = useState('Type your style here...');
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [isMobilePreview, setIsMobilePreview] = useState(true);

  const fontResults = useMemo(() => generateFonts(inputText), [inputText]);

  const filteredFonts = useMemo(() => {
    if (activeCategory === 'All') return fontResults;
    return fontResults.filter(f => f.category === activeCategory);
  }, [fontResults, activeCategory]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const clearInput = () => setInputText('');

  return (
    <div className="min-h-screen text-white font-sans selection:bg-accent-pink/30">
      {/* Mesh Sphere Background */}
      <div className="mesh-sphere" />

      {/* Side Stats - Desktop Only */}
      <div className="hidden lg:flex fixed right-8 top-1/2 -translate-y-1/2 flex-col gap-4 w-[160px] z-50">
        <div className="frosted-glass p-5 rounded-[20px] shadow-2xl">
          <div className="font-bold text-xl leading-tight">124</div>
          <div className="text-[10px] text-white/50 uppercase tracking-wider font-bold">Fonts Loaded</div>
        </div>
        <div className="frosted-glass p-5 rounded-[20px] shadow-2xl">
          <div className="font-bold text-xl leading-tight">Offline</div>
          <div className="text-[10px] text-white/50 uppercase tracking-wider font-bold">Engine Status</div>
        </div>
        <div className="frosted-glass p-5 rounded-[20px] shadow-2xl border-accent-pink/30">
          <div className="font-bold text-xl leading-tight text-accent-pink">Premium</div>
          <div className="text-[10px] text-white/50 uppercase tracking-wider font-bold">User Tier</div>
        </div>
      </div>

      <div className="relative z-10 max-w-lg mx-auto px-4 py-8 md:py-20">
        <div className="frosted-glass rounded-[40px] p-6 md:p-8 shadow-[0_50px_100px_rgba(0,0,0,0.5)] flex flex-col min-h-[85vh]">
          {/* Header */}
          <header className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tighter">Fontify</h1>
          </header>

          {/* Input Section */}
          <div className="relative bg-black/30 rounded-[20px] p-4 mb-4 border border-white/20 group focus-within:border-accent-pink/50 transition-all">
            <label className="block text-[10px] uppercase tracking-widest text-white/50 mb-1 font-bold">
              Type your text here
            </label>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter text..."
                className="w-full bg-transparent border-none focus:ring-0 text-xl font-medium placeholder:text-gray-600 outline-none"
              />
              {inputText && (
                <button 
                  onClick={clearInput}
                  className="p-1 text-white/30 hover:text-white transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Category Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar shrink-0">
            {FONT_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-300 border ${
                  activeCategory === cat
                    ? 'bg-accent-pink text-white border-transparent'
                    : 'bg-white/10 text-white/70 border-white/10 hover:bg-white/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Font List Container with Scroll */}
          <div className="flex-1 overflow-y-auto no-scrollbar pr-1 -mr-1">
            <div className="grid grid-cols-1 gap-3">
              <AnimatePresence mode="popLayout">
                {filteredFonts.length > 0 ? (
                  filteredFonts.map((font, idx) => (
                    <motion.div
                      layout
                      key={font.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                      className="group relative bg-white/5 border border-white/10 rounded-[16px] p-4 hover:bg-white/10 transition-all cursor-pointer"
                      onClick={() => handleCopy(font.text, font.id)}
                    >
                      <div className="flex flex-col">
                        <span className="text-[9px] uppercase tracking-widest text-white/50 mb-1 font-bold">
                          {font.name}
                        </span>
                        <p className="text-lg font-medium break-words mb-2 pr-16 leading-tight">
                          {font.text || '...'}
                        </p>
                      </div>
                      
                      <button className="absolute bottom-4 right-4 text-[10px] font-bold text-white/40 group-hover:text-accent-pink transition-colors px-2 py-1 rounded bg-white/5">
                        {copiedId === font.id ? 'Copied!' : 'Tap to Copy'}
                      </button>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full py-10 text-center">
                    <p className="text-white/30 text-sm font-medium italic">No results found.</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action / Info */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        <button 
          onClick={() => setShowInfo(!showInfo)}
          className="w-12 h-12 bg-white/5 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors shadow-2xl"
        >
          <Info className="w-6 h-6 text-gray-400" />
        </button>
      </div>

      {/* Info Modal */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowInfo(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#161618] border border-white/10 p-8 rounded-3xl max-w-sm w-full shadow-3xl"
              onClick={e => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-white" />
                </div>
                How to use
              </h2>
              <ul className="space-y-4 text-gray-400 text-sm">
                <li className="flex gap-3">
                  <div className="shrink-0 w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-bold">1</div>
                  <span>Enter your text in the top input field.</span>
                </li>
                <li className="flex gap-3">
                  <div className="shrink-0 w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-bold">2</div>
                  <span>Scroll through categories to find your perfect style.</span>
                </li>
                <li className="flex gap-3">
                  <div className="shrink-0 w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-bold">3</div>
                  <span>Tap any card to instantly copy the text to clipboard.</span>
                </li>
              </ul>
              <button 
                onClick={() => setShowInfo(false)}
                className="w-full mt-8 py-4 bg-white text-black font-bold rounded-2xl hover:bg-gray-200 transition-colors uppercase tracking-widest text-xs"
              >
                Got it
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
