/**
 * Backward-Compatibility Facade for EChartsWrapper
 *
 * Delegates to the modernized, tree-shaken, zero-leak canvas wrapper
 * in `src/library/core/EChartsWrapper.tsx`.
 */

import type { FC } from 'react';
import {
  EChartsWrapper as CoreEChartsWrapper,
  type EChartsWrapperProps as CoreEChartsWrapperProps,
  type EChartsOption,
  type ECElementEvent,
} from '../../library/core/index.ts';

export type { EChartsOption };
export type { ECElementEvent };

export interface EChartsWrapperProps extends CoreEChartsWrapperProps {}

export const EChartsWrapper: FC<EChartsWrapperProps> = (props) => {
  return <CoreEChartsWrapper {...props} />;
};
