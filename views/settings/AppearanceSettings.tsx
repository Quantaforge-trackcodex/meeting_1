import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const AppearanceSettings = () => {
  const {
    mode, setMode,
    isHighContrast, setIsHighContrast,
    fontTheme, setFontTheme,
    animationDensity, setAnimationDensity
  } = useTheme();

  return (
    <div className="space-y-8">
      <header className="border-b border-gh-border pb-6">
        <h1 className="text-2xl font-black text-white tracking-tight">Appearance</h1>
        <p className="text-sm text-gh-text-secondary mt-1">
          Customize the look and feel of your TrackCodex interface.
        </p>
      </header>

      <section className="p-6 bg-gh-bg-secondary border border-gh-border rounded-xl">
        <h2 className="text-lg font-bold text-white mb-4">Theme</h2>
        <div className="space-y-4">
          <p className="text-sm text-gh-text-secondary">Select your preferred color theme.</p>
          <div className="flex items-center gap-4">
            {['light', 'dark', 'system'].map((themeMode) => (
              <label key={themeMode} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="theme"
                  value={themeMode}
                  checked={mode === themeMode}
                  onChange={() => setMode(themeMode as any)}
                  className="form-radio bg-gh-bg border-gh-border text-primary focus:ring-primary"
                />
                <span className="text-sm font-medium text-white capitalize">{themeMode}</span>
              </label>
            ))}
          </div>
        </div>
      </section>

      <section className="p-6 bg-gh-bg-secondary border border-gh-border rounded-xl">
        <h2 className="text-lg font-bold text-white mb-4">Typography</h2>
        <div className="space-y-4">
          <p className="text-sm text-gh-text-secondary">Choose the global font style.</p>
          <div className="flex gap-4">
            <button
              onClick={() => setFontTheme('inter')}
              className={`flex-1 py-3 px-4 rounded-lg border text-sm font-medium transition-all ${fontTheme === 'inter' ? 'bg-primary/10 border-primary text-primary ring-1 ring-primary' : 'bg-gh-bg border-gh-border text-white hover:border-slate-500'}`}
            >
              <span className="block mb-1 text-xs opacity-60">Modern</span>
              Inter
            </button>
            <button
              onClick={() => setFontTheme('system')}
              className={`flex-1 py-3 px-4 rounded-lg border text-sm font-medium transition-all ${fontTheme === 'system' ? 'bg-primary/10 border-primary text-primary ring-1 ring-primary' : 'bg-gh-bg border-gh-border text-white hover:border-slate-500'}`}
            >
              <span className="block mb-1 text-xs opacity-60">Classic</span>
              System
            </button>
            <button
              onClick={() => setFontTheme('mono')}
              className={`flex-1 py-3 px-4 rounded-lg border text-sm font-mono transition-all ${fontTheme === 'mono' ? 'bg-primary/10 border-primary text-primary ring-1 ring-primary' : 'bg-gh-bg border-gh-border text-white hover:border-slate-500'}`}
            >
              <span className="block mb-1 text-xs opacity-60">Geek</span>
              Monospace
            </button>
          </div>
        </div>
      </section>

      <section className="p-6 bg-gh-bg-secondary border border-gh-border rounded-xl">
        <h2 className="text-lg font-bold text-white mb-4">Animations</h2>
        <div className="space-y-4">
          <p className="text-sm text-gh-text-secondary">Control the density and speed of interface animations.</p>
          <div className="grid grid-cols-3 gap-4">
            {[
              { id: 'standard', label: 'Standard', desc: 'Smooth & Fluid' },
              { id: 'fast', label: 'Fast', desc: 'Snappy' },
              { id: 'none', label: 'None', desc: 'Instant' }
            ].map(opt => (
              <button
                key={opt.id}
                onClick={() => setAnimationDensity(opt.id as any)}
                className={`py-3 px-4 rounded-lg border text-left transition-all ${animationDensity === opt.id ? 'bg-primary/10 border-primary text-primary ring-1 ring-primary' : 'bg-gh-bg border-gh-border text-white hover:border-slate-500'}`}
              >
                <div className="text-sm font-bold">{opt.label}</div>
                <div className="text-xs opacity-60 mt-0.5">{opt.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="p-6 bg-gh-bg-secondary border border-gh-border rounded-xl">
        <h2 className="text-lg font-bold text-white mb-4">Accessibility</h2>
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-bold text-white text-sm">High Contrast Mode</h4>
            <p className="text-xs text-gh-text-secondary mt-1">Increase UI contrast for better visibility.</p>
          </div>
          <button
            onClick={() => setIsHighContrast(!isHighContrast)}
            className={`w-10 h-5 rounded-full relative transition-all ${isHighContrast ? 'bg-primary' : 'bg-slate-700'}`}
          >
            <div className={`absolute top-1 size-3 bg-white rounded-full transition-all ${isHighContrast ? 'left-6' : 'left-1'}`} />
          </button>
        </div>
      </section>
    </div>
  );
};

export default AppearanceSettings;
