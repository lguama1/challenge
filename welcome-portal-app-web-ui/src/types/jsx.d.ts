import { JSX as LocalJSX } from '@npm-bbta/bbog-dig-dt-sherpa-lib/loader';
import { DetailedHTMLProps, HTMLAttributes } from 'react';

type StencilProps<T> = {
  [P in keyof T]?: Omit<T[P], 'ref'> | HTMLAttributes<T>;
};

type ReactProps<T> = {
  [P in keyof T]?: DetailedHTMLProps<HTMLAttributes<T[P]>, T[P]>;
};

type StencilToReact<
  T = LocalJSX.IntrinsicElements,
  U = HTMLElementTagNameMap,
> = StencilProps<T> & ReactProps<U>;

declare global {
  namespace React {
    namespace JSX {
      /* eslint-disable  @typescript-eslint/no-empty-object-type */
      interface IntrinsicElements extends StencilToReact {}
    }
  }
}
