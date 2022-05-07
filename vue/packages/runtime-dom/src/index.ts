import { ref } from '@vue/reactivity';
import { createRenderer, h, Text, Fragment } from '@vue/runtime-core';
import { nodeOps } from './nodeOps';
import { patchProps } from './patchProps';

const renderOptions = Object.assign(nodeOps, { patchProps });

const render = createRenderer(renderOptions).render;

export { ref, render, h, renderOptions as domOps, Text, Fragment };
