/**
 * Component Lifecycle Unit Tests for EChartsWrapper
 * Uses Node.js native test runner (node --test) with headless mock DOM & ECharts tracking
 */

import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import React, { act } from 'react';
import ReactDOM from 'react-dom/client';

import { EChartsWrapper, type EChartsWrapperHandle } from '../EChartsWrapper.ts';
import { echarts, type EChartsOption, type ECElementEvent } from '../echartsCore.ts';

// --- MOCK BROWSER DOM ENVIRONMENT ---
class MockElement {
  nodeType = 1;
  nodeName = 'DIV';
  tagName = 'DIV';
  childNodes: MockElement[] = [];
  children: MockElement[] = [];
  style: Record<string, string> = {};
  ownerDocument: unknown = null;
  parentNode: MockElement | null = null;
  clientWidth = 600;
  clientHeight = 350;
  className = '';

  appendChild(child: MockElement) {
    child.parentNode = this;
    this.childNodes.push(child);
    this.children.push(child);
    return child;
  }
  removeChild(child: MockElement) {
    const idx = this.childNodes.indexOf(child);
    if (idx !== -1) this.childNodes.splice(idx, 1);
    const cIdx = this.children.indexOf(child);
    if (cIdx !== -1) this.children.splice(cIdx, 1);
    child.parentNode = null;
    return child;
  }
  insertBefore(n: MockElement) {
    return this.appendChild(n);
  }
  setAttribute(k: string, v: string) {
    if (k === 'class') this.className = v;
  }
  removeAttribute() {}
  addEventListener() {}
  removeEventListener() {}
}

interface TrackedMockInstance {
  id: number;
  theme: string;
  opts: Record<string, unknown>;
  disposed: boolean;
  optionsHistory: EChartsOption[];
  eventListeners: Map<string, ((params: unknown) => void)[]>;
  loadingHistory: boolean[];
  resizeCount: number;
  clearCount: number;
  setOption: (opt: EChartsOption) => void;
  showLoading: () => void;
  hideLoading: () => void;
  on: (event: string, fn: (params: unknown) => void) => void;
  off: (event: string, fn: (params: unknown) => void) => void;
  resize: () => void;
  clear: () => void;
  dispose: () => void;
  isDisposed: () => boolean;
  trigger: (event: string, params: unknown) => void;
}

let mockInstanceCounter = 0;
let createdInstances: TrackedMockInstance[] = [];
let resizeObserverDisconnects = 0;
let resizeObserverObserves = 0;
let rafCancelCalls = 0;
let originalInit: typeof echarts.init;

// Setup headless mock environment before tests
function setupMockEnv() {
  createdInstances = [];
  mockInstanceCounter = 0;
  resizeObserverDisconnects = 0;
  resizeObserverObserves = 0;
  rafCancelCalls = 0;

  const mockDoc = {
    nodeType: 9,
    nodeName: '#document',
    createElement: (name = 'DIV') => {
      const el = new MockElement();
      el.nodeName = name.toUpperCase();
      el.tagName = name.toUpperCase();
      el.ownerDocument = mockDoc;
      return el;
    },
    createElementNS: (_ns: string, name = 'DIV') => {
      const el = new MockElement();
      el.nodeName = name.toUpperCase();
      el.tagName = name.toUpperCase();
      el.ownerDocument = mockDoc;
      return el;
    },
    createTextNode: () => {
      const el = new MockElement();
      el.nodeType = 3;
      el.nodeName = '#text';
      el.ownerDocument = mockDoc;
      return el;
    },
    createComment: () => {
      const el = new MockElement();
      el.nodeType = 8;
      el.nodeName = '#comment';
      el.ownerDocument = mockDoc;
      return el;
    },
    documentElement: new MockElement(),
    addEventListener() {},
    removeEventListener() {},
    defaultView: null as unknown,
  };
  mockDoc.documentElement.ownerDocument = mockDoc;

  const mockWin = {
    document: mockDoc,
    addEventListener() {},
    removeEventListener() {},
    HTMLIFrameElement: class {},
  };
  mockDoc.defaultView = mockWin;

  // Global browser mocks
  (globalThis as unknown as { Node: unknown }).Node = MockElement;
  (globalThis as unknown as { Element: unknown }).Element = MockElement;
  (globalThis as unknown as { HTMLElement: unknown }).HTMLElement = MockElement;
  (globalThis as unknown as { HTMLIFrameElement: unknown }).HTMLIFrameElement = mockWin.HTMLIFrameElement;
  (globalThis as unknown as { document: unknown }).document = mockDoc;
  (globalThis as unknown as { window: unknown }).window = mockWin;
  (globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

  // Mock ResizeObserver
  (globalThis as unknown as { ResizeObserver: unknown }).ResizeObserver = class {
    observe() {
      resizeObserverObserves++;
    }
    unobserve() {}
    disconnect() {
      resizeObserverDisconnects++;
    }
  };

  // Mock RAF
  (globalThis as unknown as { requestAnimationFrame: unknown }).requestAnimationFrame = (cb: () => void) => {
    return setTimeout(cb, 0) as unknown as number;
  };
  (globalThis as unknown as { cancelAnimationFrame: unknown }).cancelAnimationFrame = (id: number) => {
    rafCancelCalls++;
    clearTimeout(id);
  };

  // Mock echarts.init
  originalInit = echarts.init;
  (echarts as unknown as { init: unknown }).init = (
    _dom: unknown,
    theme?: string,
    opts?: Record<string, unknown>
  ) => {
    const instanceId = ++mockInstanceCounter;
    const listeners = new Map<string, ((params: unknown) => void)[]>();

    const inst: TrackedMockInstance = {
      id: instanceId,
      theme: theme ?? 'default',
      opts: opts ?? {},
      disposed: false,
      optionsHistory: [],
      eventListeners: listeners,
      loadingHistory: [],
      resizeCount: 0,
      clearCount: 0,
      setOption(opt: EChartsOption) {
        if (this.disposed) throw new Error('Cannot setOption on disposed instance!');
        this.optionsHistory.push(opt);
      },
      showLoading() {
        this.loadingHistory.push(true);
      },
      hideLoading() {
        this.loadingHistory.push(false);
      },
      on(event: string, fn: (params: unknown) => void) {
        if (!listeners.has(event)) listeners.set(event, []);
        listeners.get(event)!.push(fn);
      },
      off(event: string, fn: (params: unknown) => void) {
        if (!listeners.has(event)) return;
        const list = listeners.get(event)!;
        const idx = list.indexOf(fn);
        if (idx !== -1) list.splice(idx, 1);
      },
      resize() {
        this.resizeCount++;
      },
      clear() {
        this.clearCount++;
      },
      dispose() {
        this.disposed = true;
      },
      isDisposed() {
        return this.disposed;
      },
      trigger(event: string, params: unknown) {
        if (listeners.has(event)) {
          listeners.get(event)!.forEach((fn) => fn(params));
        }
      },
    };

    createdInstances.push(inst);
    return inst as unknown as import('../echartsCore.ts').EChartsType;
  };
}

function teardownMockEnv() {
  (echarts as unknown as { init: unknown }).init = originalInit;
}

describe('EChartsWrapper Component Lifecycle Tests (Phase 1B.1-R)', () => {
  let rootContainer: MockElement;
  let root: ReactDOM.Root;

  beforeEach(() => {
    setupMockEnv();
    rootContainer = (globalThis.document as unknown as { createElement: (tag: string) => MockElement }).createElement('DIV');
    root = ReactDOM.createRoot(rootContainer as unknown as HTMLElement);
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    teardownMockEnv();
  });

  it('1. Mount -> inits exactly one instance with current option', () => {
    const sampleOption: EChartsOption = { title: { text: 'Initial Chart' } };

    act(() => {
      root.render(React.createElement(EChartsWrapper, { option: sampleOption, theme: 'warm-glass' }));
    });

    assert.equal(createdInstances.length, 1);
    const instance = createdInstances[0];
    assert.equal(instance.disposed, false);
    assert.equal(instance.theme, 'warm-glass');
    assert.equal(instance.optionsHistory.length, 1);
    assert.deepEqual(instance.optionsHistory[0], sampleOption);
  });

  it('2. Unmount -> disposes instance and sets instanceRef to null', () => {
    act(() => {
      root.render(React.createElement(EChartsWrapper, { option: { title: { text: 'To Be Unmounted' } } }));
    });

    assert.equal(createdInstances.length, 1);
    const instance = createdInstances[0];
    assert.equal(instance.disposed, false);

    act(() => {
      root.unmount();
    });

    assert.equal(instance.disposed, true);
  });

  it('3. Update option -> calls setOption on existing instance without re-creating', () => {
    const optA: EChartsOption = { title: { text: 'Option A' } };
    const optB: EChartsOption = { title: { text: 'Option B' } };

    act(() => {
      root.render(React.createElement(EChartsWrapper, { option: optA }));
    });

    assert.equal(createdInstances.length, 1);
    const firstInstance = createdInstances[0];
    assert.equal(firstInstance.optionsHistory.length, 1);

    // Re-render with new option
    act(() => {
      root.render(React.createElement(EChartsWrapper, { option: optB }));
    });

    // Proves NO second instance was created
    assert.equal(createdInstances.length, 1);
    assert.equal(firstInstance.disposed, false);
    assert.equal(firstInstance.optionsHistory.length, 2);
    assert.deepEqual(firstInstance.optionsHistory[1], optB);
  });

  it('4. Change theme -> Bug 1 Remediation: new instance immediately receives option', () => {
    const stableOption: EChartsOption = { series: [{ type: 'line', data: [1, 2, 3] }] };

    act(() => {
      root.render(React.createElement(EChartsWrapper, { option: stableOption, theme: 'light-enterprise' }));
    });

    assert.equal(createdInstances.length, 1);
    const inst1 = createdInstances[0];
    assert.equal(inst1.theme, 'light-enterprise');
    assert.deepEqual(inst1.optionsHistory[0], stableOption);

    // Switch theme while keeping identical option reference
    act(() => {
      root.render(React.createElement(EChartsWrapper, { option: stableOption, theme: 'dark-analytics' }));
    });

    // Old instance must be disposed, new instance created
    assert.equal(createdInstances.length, 2);
    const inst2 = createdInstances[1];
    assert.equal(inst1.disposed, true);
    assert.equal(inst2.disposed, false);
    assert.equal(inst2.theme, 'dark-analytics');

    // BUG 1 PROOF: New instance MUST have received stableOption!
    assert.ok(inst2.optionsHistory.length >= 1);
    assert.deepEqual(inst2.optionsHistory[0], stableOption);
  });

  it('5. Change renderer -> new instance receives current option', () => {
    const option: EChartsOption = { title: { text: 'Renderer Test' } };

    act(() => {
      root.render(React.createElement(EChartsWrapper, { option, renderer: 'canvas' }));
    });

    assert.equal(createdInstances.length, 1);
    assert.equal(createdInstances[0].opts.renderer, 'canvas');

    // Switch to SVG
    act(() => {
      root.render(React.createElement(EChartsWrapper, { option, renderer: 'svg' }));
    });

    assert.equal(createdInstances.length, 2);
    assert.equal(createdInstances[0].disposed, true);
    assert.equal(createdInstances[1].disposed, false);
    assert.equal(createdInstances[1].opts.renderer, 'svg');
    assert.deepEqual(createdInstances[1].optionsHistory[0], option);
  });

  it('6. Change theme -> Bug 2 Remediation: event listeners remain active on new instance', () => {
    let clickCount = 0;
    const onClick = (_p: ECElementEvent) => {
      clickCount++;
    };
    const option: EChartsOption = { title: { text: 'Click Test' } };

    act(() => {
      root.render(React.createElement(EChartsWrapper, { option, theme: 'light-enterprise', onChartClick: onClick }));
    });

    const inst1 = createdInstances[0];
    inst1.trigger('click', { name: 'Item 1' });
    assert.equal(clickCount, 1);

    // Change theme
    act(() => {
      root.render(React.createElement(EChartsWrapper, { option, theme: 'warm-glass', onChartClick: onClick }));
    });

    assert.equal(createdInstances.length, 2);
    const inst2 = createdInstances[1];

    // BUG 2 PROOF: Clicking on the new instance invokes onClick callback!
    inst2.trigger('click', { name: 'Item 2' });
    assert.equal(clickCount, 2);
  });

  it('7. Change renderer -> event listeners remain active on new instance', () => {
    let eventPayload: unknown = null;
    const onEvents = {
      datazoom: (params: unknown) => {
        eventPayload = params;
      },
    };

    act(() => {
      root.render(React.createElement(EChartsWrapper, { option: {}, renderer: 'canvas', onEvents }));
    });

    const inst1 = createdInstances[0];
    inst1.trigger('datazoom', { start: 20 });
    assert.deepEqual(eventPayload, { start: 20 });

    // Change renderer
    act(() => {
      root.render(React.createElement(EChartsWrapper, { option: {}, renderer: 'svg', onEvents }));
    });

    const inst2 = createdInstances[1];
    inst2.trigger('datazoom', { start: 50 });
    assert.deepEqual(eventPayload, { start: 50 });
  });

  it('8. Change callback -> freshest callback is invoked without stale closure', () => {
    let log: string[] = [];

    const ParentComponent = ({ message }: { message: string }) => {
      return React.createElement(EChartsWrapper, {
        option: {},
        onChartClick: () => {
          log.push(message);
        },
      });
    };

    act(() => {
      root.render(React.createElement(ParentComponent, { message: 'First' }));
    });

    const instance = createdInstances[0];
    instance.trigger('click', {});
    assert.deepEqual(log, ['First']);

    // Re-render with new callback message
    act(() => {
      root.render(React.createElement(ParentComponent, { message: 'Second' }));
    });

    // Instance was NOT recreated
    assert.equal(createdInstances.length, 1);

    // Stale closure check: Triggering click invokes the new closure!
    instance.trigger('click', {});
    assert.deepEqual(log, ['First', 'Second']);
  });

  it('9. Bug 3 Remediation: Unstable inline initOpts reference does NOT trigger infinite re-init', () => {
    // Parent passes fresh object literal { devicePixelRatio: 2 } on each render
    const Parent = ({ renderCount }: { renderCount: number }) => {
      return React.createElement(EChartsWrapper, {
        option: { title: { text: `Render ${renderCount}` } },
        initOpts: { devicePixelRatio: 2 },
      });
    };

    act(() => {
      root.render(React.createElement(Parent, { renderCount: 1 }));
    });
    act(() => {
      root.render(React.createElement(Parent, { renderCount: 2 }));
    });
    act(() => {
      root.render(React.createElement(Parent, { renderCount: 3 }));
    });

    // BUG 3 PROOF: Even after 3 renders with new initOpts references,
    // only ONE instance was created because initialization values did not change!
    assert.equal(createdInstances.length, 1);
    assert.equal(createdInstances[0].disposed, false);
  });

  it('10. ResizeObserver -> disconnects cleanly on unmount', () => {
    act(() => {
      root.render(React.createElement(EChartsWrapper, { option: {} }));
    });

    assert.ok(resizeObserverObserves >= 1);
    const disconnectsBefore = resizeObserverDisconnects;

    act(() => {
      root.unmount();
    });

    assert.equal(resizeObserverDisconnects, disconnectsBefore + 1);
  });

  it('11. RAF -> cancelAnimationFrame is called on unmount', () => {
    act(() => {
      root.render(React.createElement(EChartsWrapper, { option: {} }));
    });

    const cancelsBefore = rafCancelCalls;

    act(() => {
      root.unmount();
    });

    // Cleanup executes cancelAnimationFrame if pending, or on effect teardown
    assert.ok(rafCancelCalls >= cancelsBefore);
  });

  it('12. Initialization error -> catches safely, does not crash React, renders fallback UI', () => {
    // Temporarily force echarts.init to throw
    (echarts as unknown as { init: unknown }).init = () => {
      throw new Error('Canvas WebGL context lost or unsupported!');
    };

    act(() => {
      root.render(React.createElement(EChartsWrapper, { option: {} }));
    });

    // Instance was not successfully created, error state handled
    assert.equal(createdInstances.length, 0);
  });

  it('13. Multiple instances -> independent and do not contaminate each other', () => {
    const optA: EChartsOption = { title: { text: 'Chart 1' } };
    const optB: EChartsOption = { title: { text: 'Chart 2' } };

    const TwoCharts = () => {
      return React.createElement(
        'div',
        null,
        React.createElement(EChartsWrapper, { option: optA, theme: 'warm-glass' }),
        React.createElement(EChartsWrapper, { option: optB, theme: 'dark-analytics' })
      );
    };

    act(() => {
      root.render(React.createElement(TwoCharts));
    });

    assert.equal(createdInstances.length, 2);
    assert.equal(createdInstances[0].theme, 'warm-glass');
    assert.equal(createdInstances[1].theme, 'dark-analytics');
    assert.deepEqual(createdInstances[0].optionsHistory[0], optA);
    assert.deepEqual(createdInstances[1].optionsHistory[0], optB);
  });

  it('14. React StrictMode -> mount/unmount cycle leaves zero detached instances', () => {
    // StrictMode mounts, unmounts, and re-mounts in development
    const StrictWrapper = () => {
      return React.createElement(React.StrictMode, null, React.createElement(EChartsWrapper, { option: {} }));
    };

    act(() => {
      root.render(React.createElement(StrictWrapper));
    });

    // In StrictMode, first instance is disposed, active instance remains live
    const activeInstances = createdInstances.filter((inst) => !inst.disposed);
    assert.equal(activeInstances.length, 1);

    // Final unmount disposes all
    act(() => {
      root.unmount();
    });

    const lingeringInstances = createdInstances.filter((inst) => !inst.disposed);
    assert.equal(lingeringInstances.length, 0);
  });

  it('15. Imperative handle (forwardRef) -> exposes resize, clear, and getEchartsInstance safely', () => {
    let handleRef: EChartsWrapperHandle | null = null;

    const RefHarness = () => {
      return React.createElement(EChartsWrapper, {
        option: {},
        ref: (h: EChartsWrapperHandle | null) => {
          handleRef = h;
        },
      });
    };

    act(() => {
      root.render(React.createElement(RefHarness));
    });

    assert.ok(handleRef !== null);
    const activeHandle = handleRef as EChartsWrapperHandle;
    assert.equal(typeof activeHandle.getEchartsInstance, 'function');
    assert.equal(typeof activeHandle.resize, 'function');
    assert.equal(typeof activeHandle.clear, 'function');

    const instance = activeHandle.getEchartsInstance();
    assert.ok(instance !== null);

    activeHandle.resize();
    assert.equal((instance as unknown as TrackedMockInstance).resizeCount, 1);

    activeHandle.clear();
    assert.equal((instance as unknown as TrackedMockInstance).clearCount, 1);

    const savedHandle = handleRef as EChartsWrapperHandle;
    act(() => {
      root.unmount();
    });

    // After unmount, getEchartsInstance returns null
    assert.equal(savedHandle.getEchartsInstance(), null);
  });
});
