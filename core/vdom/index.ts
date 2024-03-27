export { h, Fragment } from './h';
export { createApp } from './app';
export { defineExpose } from './instance';
export { onBeforeMount } from './hooks/before-mount';
export { onMounted } from './hooks/mounted';
export { onBeforeUnmount } from './hooks/before-unmount';
export { onUnmounted } from './hooks/unmounted';
export { joinClass } from './utils';
export type { App } from './app';
export type * from './type';

// 不受实例影响渲染
export { render, renderToString, useComponent } from './render';
