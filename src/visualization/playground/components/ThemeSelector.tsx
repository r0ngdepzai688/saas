import React from 'react';
import { PLAYGROUND_THEMES } from '../themes/playgroundThemes';
import type { ThemeId } from '../types';
import { Palette, Check, Sun, Moon } from 'lucide-react';

interface ThemeSelectorProps {
  selectedThemeId: ThemeId;
  onSelectTheme: (themeId: ThemeId) => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  selectedThemeId,
  onSelectTheme,
}) => {
  const themes = Object.values(PLAYGROUND_THEMES);

  return (
    <div className="p-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl border border-warm-200/80 dark:border-slate-800 shadow-sm space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-warm-200/60 dark:border-slate-800">
        <div>
          <h3 className="text-sm font-bold text-warm-900 dark:text-slate-100 flex items-center gap-2">
            <Palette className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            Enterprise Visual Theme Switcher
          </h3>
          <p className="text-[11px] text-warm-500 dark:text-slate-400">
            Preview charts under 5 calibrated enterprise design systems without reloading.
          </p>
        </div>
        <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
          5 Systems Ready
        </span>
      </div>

      {/* Theme Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {themes.map((th) => {
          const isSelected = selectedThemeId === th.id;
          return (
            <button
              key={th.id}
              onClick={() => onSelectTheme(th.id)}
              className={`p-3 rounded-2xl text-left transition-all duration-200 relative flex flex-col justify-between ${
                isSelected
                  ? 'ring-2 ring-blue-600 shadow-md border-transparent bg-white dark:bg-slate-800'
                  : 'border border-warm-200/80 dark:border-slate-800 hover:border-warm-300 dark:hover:border-slate-700 bg-warm-50/50 dark:bg-slate-900/60'
              }`}
            >
              {/* Selected Check Badge */}
              {isSelected && (
                <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs">
                  <Check className="w-3 h-3" />
                </div>
              )}

              <div>
                {/* Theme Mode Indicator */}
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-warm-500 dark:text-slate-400 mb-1.5">
                  {th.isDark ? (
                    <span className="flex items-center gap-1 text-slate-400">
                      <Moon className="w-3 h-3 text-indigo-400" /> Dark Surface
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-amber-600">
                      <Sun className="w-3 h-3 text-amber-500" /> Light Surface
                    </span>
                  )}
                </div>

                <div className="text-xs font-bold text-warm-900 dark:text-slate-100">
                  {th.name}
                </div>
                <p className="text-[10px] text-warm-500 dark:text-slate-400 line-clamp-2 mt-1 leading-snug">
                  {th.description}
                </p>
              </div>

              {/* Palette Color Swatches */}
              <div className="mt-3 pt-2.5 border-t border-warm-200/50 dark:border-slate-800">
                <div className="text-[9px] font-bold text-warm-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                  Palette Swatch
                </div>
                <div className="flex items-center gap-1">
                  {th.palette.slice(0, 6).map((color, cIdx) => (
                    <div
                      key={cIdx}
                      style={{ backgroundColor: color }}
                      className="w-4 h-4 rounded-full border border-black/10 dark:border-white/10 shrink-0"
                      title={color}
                    />
                  ))}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
