import { IntrinsicElements as PlVueIntrinsicElements } from '~/core/jsx';

declare global {
  namespace JSX {
    interface IntrinsicElements extends PlVueIntrinsicElements {}
  }
}
