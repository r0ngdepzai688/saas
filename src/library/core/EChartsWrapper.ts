/**
 * Visual Design Intelligence Library - Universal ECharts Canvas Wrapper
 *
 * Phase 1B.1-R Remediated Implementation:
 * - Bug 1 Fixed: Synchronous state hydration (option, loading, events) upon instance creation.
 * - Bug 2 Fixed: Stale-closure-free stable event dispatchers with automatic rebinding on new instances.
 * - Bug 3 Fixed: Stable primitive initialization signature preventing re-init loops from inline initOpts literals.
 * - Hardware-accelerated Canvas & SVG rendering
 * - RAF-throttled debounced ResizeObserver
 * - Strict zero-leak lifecycle with guaranteed dispose() on unmount
 * - React 19 forwardRef handle exposing imperative API
 *
 * Note: Implemented using React.createElement so it is valid in pure TypeScript (.ts)
 * allowing native Node 24 type-stripping execution without external JSX transpilers.
 */

import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {
  echarts,
  type ECElementEvent,
  type EChartsInitOpts,
  type EChartsOption,
  type EChartsType,
} from './echartsCore.ts';

export interface EChartsWrapperHandle {
  getEchartsInstance: () => EChartsType | null;
  resize: () => void;
  clear: () => void;
}

export interface EChartsWrapperProps {
  /** Strongly-typed ECharts option object */
  option: EChartsOption;
  /** Height in px or CSS string (e.g. '100%', 320). Default: 320 */
  height?: number | string;
  /** Width in px or CSS string. Default: '100%' */
  width?: number | string;
  /** Additional CSS class names */
  className?: string;
  /** Registered theme ID. Default: 'light-enterprise' */
  theme?: string;
  /** Loading state spinner */
  loading?: boolean;
  /** Custom loading text */
  loadingText?: string;
  /** Preferred renderer. Default: 'canvas' */
  renderer?: 'canvas' | 'svg';
  /** Click event listener on chart elements */
  onChartClick?: (params: ECElementEvent) => void;
  /** Map of additional ECharts events (e.g. { datazoom: fn, legendselectchanged: fn }) */
  onEvents?: Record<string, (params: unknown) => void>;
  /** Whether to replace entire option instead of merging. Default: false */
  notMerge?: boolean;
  /** Additional canvas initialization options */
  initOpts?: Partial<EChartsInitOpts>;
}

export const EChartsWrapper = forwardRef<EChartsWrapperHandle, EChartsWrapperProps>(
  (
    {
      option,
      height = 320,
      width = '100%',
      className = '',
      theme = 'light-enterprise',
      loading = false,
      loadingText = 'Analyzing Telemetry...',
      renderer = 'canvas',
      onChartClick,
      onEvents,
      notMerge = false,
      initOpts,
    },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const instanceRef = useRef<EChartsType | null>(null);
    const [renderError, setRenderError] = useState<string | null>(null);
    const rafIdRef = useRef<number | null>(null);

    // Keep freshest references to callbacks and options to eliminate stale closures
    const latestCallbacksRef = useRef({ onChartClick, onEvents });
    latestCallbacksRef.current = { onChartClick, onEvents };

    const latestOptionRef = useRef(option);
    latestOptionRef.current = option;

    const latestNotMergeRef = useRef(notMerge);
    latestNotMergeRef.current = notMerge;

    const latestLoadingRef = useRef({ loading, loadingText });
    latestLoadingRef.current = { loading, loadingText };

    // Expose imperative API to parent via forwardRef
    useImperativeHandle(
      ref,
      () => ({
        getEchartsInstance: () => instanceRef.current,
        resize: () => {
          if (instanceRef.current && !instanceRef.current.isDisposed()) {
            instanceRef.current.resize();
          }
        },
        clear: () => {
          if (instanceRef.current && !instanceRef.current.isDisposed()) {
            instanceRef.current.clear();
          }
        },
      }),
      []
    );

    // Stable initialization signature: only primitive values that actually affect echarts.init()
    // Prevents inline object literals like initOpts={{ devicePixelRatio: 2 }} from triggering infinite re-inits
    const initSignature = [
      theme,
      renderer,
      initOpts?.devicePixelRatio ?? '',
      initOpts?.useDirtyRect ?? '',
      initOpts?.width ?? '',
      initOpts?.height ?? '',
      initOpts?.locale ?? '',
    ].join('|');

    // Helper: Apply current loading state to an instance
    const applyLoadingState = (chart: EChartsType, isLoading: boolean, text: string) => {
      if (isLoading) {
        chart.showLoading({
          text,
          color: '#2563EB',
          textColor: '#64748B',
          maskColor: 'rgba(255, 255, 255, 0.75)',
          fontSize: 12,
        });
      } else {
        chart.hideLoading();
      }
    };

    // Helper: Attach stable event dispatchers that always delegate to latestCallbacksRef
    const bindEventDispatchers = (chart: EChartsType) => {
      // Click dispatcher
      chart.on('click', (params: ECElementEvent) => {
        latestCallbacksRef.current.onChartClick?.(params);
      });

      // Custom event map dispatchers
      const currentEvents = latestCallbacksRef.current.onEvents;
      if (currentEvents) {
        Object.keys(currentEvents).forEach((eventName) => {
          chart.on(eventName, (params: unknown) => {
            latestCallbacksRef.current.onEvents?.[eventName]?.(params);
          });
        });
      }
    };

    // Track whether initial mount hydration already performed setOption
    const isInitialMountRef = useRef(true);

    // Lifecycle 1: Instance Creation, Disposal & Initial State Hydration
    // Triggers ONLY when initSignature changes (theme, renderer, or actual init parameters)
    useEffect(() => {
      if (!containerRef.current) return;

      let chartInstance: EChartsType | null = null;

      try {
        chartInstance = echarts.init(containerRef.current, theme, {
          renderer,
          ...initOpts,
        });
        instanceRef.current = chartInstance;
        setRenderError(null);

        // BUG 1 FIX: Synchronously hydrate new instance with current option immediately upon creation
        if (latestOptionRef.current) {
          chartInstance.setOption(latestOptionRef.current, {
            notMerge: latestNotMergeRef.current,
            lazyUpdate: true,
          });
        }

        // Apply loading state immediately to new instance
        applyLoadingState(
          chartInstance,
          latestLoadingRef.current.loading,
          latestLoadingRef.current.loadingText
        );

        // BUG 2 FIX: Immediately bind stable event dispatchers to new instance
        bindEventDispatchers(chartInstance);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to initialize ECharts instance.';
        console.error('[EChartsWrapper Init Error]:', err);
        setRenderError(message);
        return;
      }

      // ResizeObserver with RAF debouncing
      const handleResize = () => {
        if (rafIdRef.current !== null) {
          cancelAnimationFrame(rafIdRef.current);
        }
        rafIdRef.current = requestAnimationFrame(() => {
          if (chartInstance && !chartInstance.isDisposed()) {
            const clientWidth = containerRef.current?.clientWidth ?? 0;
            const clientHeight = containerRef.current?.clientHeight ?? 0;
            if (clientWidth > 0 && clientHeight > 0) {
              chartInstance.resize({ animation: { duration: 150 } });
            }
          }
        });
      };

      const resizeObserver = new ResizeObserver(handleResize);
      resizeObserver.observe(containerRef.current);

      // Cleanup on unmount or when initialization signature changes (theme/renderer change)
      return () => {
        if (rafIdRef.current !== null) {
          cancelAnimationFrame(rafIdRef.current);
          rafIdRef.current = null;
        }
        resizeObserver.disconnect();
        if (chartInstance && !chartInstance.isDisposed()) {
          chartInstance.dispose();
        }
        instanceRef.current = null;
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initSignature]);

    // Lifecycle 2: Subsequent Option Updates (does NOT recreate the instance)
    useEffect(() => {
      // Skip redundant setOption on the very first mount since Lifecycle 1 synchronously hydrated it
      if (isInitialMountRef.current) {
        isInitialMountRef.current = false;
        return;
      }

      const chartInstance = instanceRef.current;
      if (!chartInstance || chartInstance.isDisposed() || !option) return;

      try {
        chartInstance.setOption(option, {
          notMerge,
          lazyUpdate: true,
        });
        setRenderError(null);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Chart setOption rendering error.';
        console.error('[EChartsWrapper setOption Error]:', err);
        setRenderError(message);
      }
    }, [option, notMerge]);

    // Lifecycle 3: Subsequent Loading State Updates
    useEffect(() => {
      const chartInstance = instanceRef.current;
      if (!chartInstance || chartInstance.isDisposed()) return;
      applyLoadingState(chartInstance, loading, loadingText);
    }, [loading, loadingText]);

    // Error Fallback UI
    if (renderError) {
      return React.createElement(
        'div',
        {
          style: {
            height: typeof height === 'number' ? `${height}px` : height,
            width: typeof width === 'number' ? `${width}px` : width,
          },
          className:
            'flex flex-col items-center justify-center p-4 rounded-2xl bg-rose-50/80 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-400 text-xs text-center',
        },
        React.createElement('span', { className: 'font-semibold mb-1' }, 'Visualization Render Fallback'),
        React.createElement(
          'span',
          { className: 'font-mono text-[11px] opacity-80 max-w-md break-words' },
          renderError
        )
      );
    }

    return React.createElement('div', {
      ref: containerRef,
      style: {
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
      },
      className: `relative overflow-hidden ${className}`,
    });
  }
);

EChartsWrapper.displayName = 'EChartsWrapper';
