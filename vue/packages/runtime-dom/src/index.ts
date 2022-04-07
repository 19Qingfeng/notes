import { createRenderer, h } from '@vue/runtime-core';
import { nodeOps } from './nodeOps';
import { patchProps } from './patchProps';

const renderOptions = Object.assign(nodeOps, { patchProps });

const render = createRenderer(renderOptions).render;

export { render, h, renderOptions as domOps };
