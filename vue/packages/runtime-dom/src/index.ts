import { nodeOps } from './nodeOps';
import { patchProps } from './patchProps';

const renderOptions = Object.assign(nodeOps, { patchProps });

export { renderOptions as domOps };
