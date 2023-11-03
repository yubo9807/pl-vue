import { AnyObj } from '../utils';
import { Children } from '../vdom';
export { Router } from './router';
export { Link } from './link';
export { useRoute, createRouter } from './create-router';
export { useRouter } from './use-router';
export { Helmet } from './ssr';
export { ssrOutlet } from './ssr';

export type PropsType<T extends AnyObj> = T & {
  ref?:      any
  children?: Children
}
