import { IntrinsicElements as PlVueIntrinsicElements } from '~/core/jsx';
import MyComp from './components/MyComp';

declare global {
  namespace JSX {
    interface IntrinsicElements extends PlVueIntrinsicElements {
      "my-comp": Parameters<typeof MyComp>[0]
    }
  }
}
