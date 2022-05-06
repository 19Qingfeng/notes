import { reactive } from '@vue/reactivity';
import { hasOwn, isFunction } from '@vue/share';
import { initProps } from './componentProps';

/**
 * 创建组件实例
 * @param vnode
 */
export function createComponentInstance(vnode) {
  // 创建组件的实例进行挂载
  const instance = {
    // 组件的数据
    data: null,
    // 类似Vue2中的 $vnode -> 自身的Vnode
    vnode, // 每个组件都拥有自己的虚拟节点(!组件自身的虚拟节点)
    // 类似于Vue2中的_vnode -> 渲染的Vnode
    subTree: null, // 组件渲染的虚拟节点(render中渲染的Vnode)
    // 表示组件是否挂载
    isMounted: false,
    // 强制更新组件方法
    update: null,
    // 组件的render方法
    render: null,
    // 组件接受的Props规则
    propsOptions: vnode.type.props,
    props: {},
    attrs: {},
    // 代理对象 结合props和state和attrs
    proxy: {},
  };
  return instance;
}

// 公共的属性映射表 比如访问 this.$attr 时,等等
const publishPropertyMap = {
  $: (i) => i,
  $attrs: (i) => i.attrs,
};

const publishInstanceProxy = {
  // proxy属性是针对于instance的代理
  // 换句话说当我访问instance.proxy时相当于访问了instance创建的代理对象
  get(target, key, receiver) {
    const { props, data } = target;
    if (hasOwn(data, key)) {
      return data[key];
    } else if (hasOwn(props, key)) {
      return props[key];
    } else {
      // 访问的是否是公用属性
      const getter = publishPropertyMap[key];
      if (getter) {
        return getter(target);
      }
      return Reflect.get(target, key, receiver);
    }
  },
  set(target, key, value) {
    const { props, data } = target;
    if (hasOwn(data, key)) {
      data[key] = value;
      return true;
    } else if (hasOwn(props, key)) {
      // 无法修改
      console.warn("Don't Revise Component Props");
    }
    return false;
  },
};

/**
 * 为组件实例填充属性
 * @param instance
 */
export function setupComponent(instance) {
  const { props, type } = instance.vnode;
  // 初始化Props
  initProps(instance, props);
  //  处理代理生成代理属性 this
  instance.proxy = new Proxy(instance, publishInstanceProxy);

  // 拿到组件的data和render
  const { data = () => ({}), render } = type;
  if (!isFunction(data)) {
    // data 在 Vue3 必须是函数
    console.error('Component Data Must Be Function');
  }
  // 赋值instance.data为响应式数据
  // 同时为data函数中的this修改为instance.proxy
  instance.data = reactive(data.call(instance.proxy));
  // 同时在组件实例上挂载对应的组件render方法
  instance.render = render;
}
