export { h, Fragment } from './h';
export { Structure } from './create-element';
export { Static } from './create-html';
export { createApp } from './app';
export { getCurrentComp, defineExpose } from './instance';
export { createContext } from './context';
export { onBeforeMount } from './hooks/before-mount';
export { onMounted } from './hooks/mounted';
export { onBeforeUnmount } from './hooks/before-unmount';
export { onUnmounted } from './hooks/unmounted';
export type { App } from './app';
export type * from './type';

// 不受实例影响渲染
export { render, renderToString, useComponent } from './render';
