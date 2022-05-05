import { reactive } from '@vue/reactivity';
import { isArray, isString, ShapeFlags } from '@vue/share';
import { ReactiveEffect } from 'packages/reactivity/src/effect';
import { queueJob } from './scheduler';
import { getSequence } from './sequence';
import { createVNode, Fragment, isSameVNodeType, Text } from './vnode';

export function createRenderer(renderOptions) {
  const {
    createElement: hostCreateElement,
    createText: hostCreateText,
    insert: hostInsert,
    remove: hostRemove,
    setElementText: hostSetElementText,
    setText: hostSetText,
    querySelector: hostQuerySelector,
    parentNode: hostParentNode,
    nextSibling: hostNextSibling,
    patchProps: hostPatchProps,
  } = renderOptions;

  /**
   * 格式化儿子节点 子节点Vnode有可能是字符串
   * 比如： h('div',{},['123','456'])
   */
  function normalize(vnode) {
    if (isString(vnode)) {
      return createVNode(Text, null, vnode);
    }
    return vnode;
  }

  /**
   * 卸载逻辑
   */
  function unmount(vnode) {
    // 页面卸载对应HTML节点
    hostRemove(vnode.el);
    // 清空引用
    vnode.el = null;
  }

  function mountChildren(el, children) {
    // 这里的children有可能是非array
    children.forEach((vnode, index) => {
      // vnode有可能仅仅只是一个字符串
      let childVNode = (children[index] = normalize(vnode));
      patch(null, childVNode, el);
    });
  }

  function unMountChildren(children) {
    for (let i = 0; i < children.length; i++) {
      // 移除之前所有儿子节点
      unmount(children[i]);
    }
  }

  /**
   * 更新元素属性
   */
  function patchProps(oldProps, newProps, container) {
    // 更新原本节点中newProps中的属性
    for (let newKey in newProps) {
      hostPatchProps(container, newKey, oldProps[newKey], newProps[newKey]);
    }
    // 同时移除已经不存在的属性
    for (let oldKey in oldProps) {
      if (newProps[oldKey] === null) {
        hostPatchProps(container, oldKey, oldProps[oldKey], undefined);
      }
    }
  }

  /**
   * 全量 DOM Diff 函数
   * @param c1 之前的children
   * @param c2 之后的children
   * @param el Dom元素
   */
  function patchKeyedChildren(c1, c2, el) {
    // 四指针算法
    let i = 0;
    let e1 = c1.length - 1;
    let e2 = c2.length - 1;
    // 特殊情况1: sync from start 从头开始处理

    // 直到指针走完任意一个孩子的长度
    while (i <= e1 && i <= e2) {
      const n1 = c1[i];
      const n2 = c2[i];
      if (isSameVNodeType(n1, n2)) {
        // dom diff
        patch(n1, n2, el);
        i++;
      } else {
        // 头部顺序不存在可以进行 dom diff 的元素了
        break;
      }
    }

    // 特殊情况2: 同理 sync from end 从头在寻找对应可以 Dom Diff 的元素
    while (i <= e1 && i <= e2) {
      const n1 = c1[e1];
      const n2 = c2[e2];
      if (isSameVNodeType(n1, n2)) {
        patch(n1, n2, el);
        e1--;
        e2--;
      } else {
        break;
      }
    }

    // 特殊情况3: 将头部或者尾部对比完后，一个为另一个的子集 （i>e1 || e>e2）
    if (i > e1) {
      // 特殊情况3.1: 同序列逻辑 (子集关系) 增加
      // 1.同序列挂载 common sequence + mount
      // 如果 i>e1 表示 Dom diff 有新增的
      // 新增的范围为 i-e2 的区间
      if (i <= e2) {
        // 表示 dom diff 时存在新增
        while (i <= e2) {
          // 究竟往哪里插取决于 e2+1 位置是否存在元素
          // 新增时，如果是尾部插入 那么e2 + 1 后的位置应该没有Vnode 故从i位置appendChild
          // 新增时，如果顶部新增 那么e2 + 1 后的位置节点应该有值，并且是首部第一个元素，那么从i位置元素插入时候每次以e2+1位anchor即可
          const anchor = c2[e2 + 1] ? c2[e2 + 1].el : null;
          const newNode = normalize(c2[i]);
          patch(null, newNode, el, anchor);
          i++;
        }
      }
    } else if (i > e2) {
      // 特殊情况4.1: 同序列逻辑（子集关系）减少
      // 2.同序列挂载 common sequence + unmount
      if (i <= e1) {
        // 意为i将e2走完了，但是e1还有剩余，那么相当于e2为e1的子集
        while (i <= e1) {
          console.log(c1, 'c2');
          const oldNode = normalize(c1[i]);
          unmount(oldNode);
          i++;
        }
      }
    }

    // 非特殊情况:剩下的就是需要进行乱序对比的
    // console.log(`i--${i}`, `el--${e1}`, `e2--${e2}`, 'xx');
    const s1 = i; // 乱序时旧节点的开头指针 s1
    const s2 = i; // 新节点的开头指针 s2

    const toBePatchLength = e2 - s2 + 1; // 乱序对比新元素的总个数
    // 以所有新乱序vnode作为一个映射表 之后循环老的乱序节点 查找映射表中是否存在相同key的元素
    // 如果存在则修改即可 不存在则需要卸载
    const keyedMap = new Map();
    // 记录当前乱序新元素集合的位置对应 c1中老元素的位置（存在则为对应位置+1，不存在则为0）
    const MappingArr = new Array(toBePatchLength).fill(0);

    // 获取当前乱序中最长的递增子序列的索引，保持递增序列位置不变，仅仅改变插入别的元素位置

    for (let i = s2; i <= e2; i++) {
      keyedMap.set(c2[i].key, i);
    }

    // 循环老的元素 查看映射表中是否存在
    // 如果存在相同key则比较差异
    // 如果不存在（老的存在，新的不存在）则需要卸载旧的该节点
    for (let i = s1; i <= e1; i++) {
      const oldVnode = c1[i];
      const newIndex = keyedMap.get(oldVnode.key); // 寻找新的vnode索引
      // 如果newIndex未找到相同key的元素 说明oldVnode存在 但是新的没有了 需要卸载
      if (!newIndex) {
        unmount(oldVnode);
      } else {
        // 表示找到了 也就是老的节点在新的中时存在的（保存对应的位置）
        MappingArr[newIndex - s2] = i + 1;
        patch(oldVnode, c2[newIndex], el);
      }
    }
    // debugger;

    // 获取当前新旧节点列表对应的最长递增子序列的优化
    // MappingArr 下标为新节点位置，值为对应旧节点位置
    // MappingArr 中保存的下标就是乱序比对中新节点的顺序（下标一定是从小到大）
    // 其次 MappingArr 中保存的值，是当前索引位置对应的旧节点的位置
    // 所以查找出 MappingArr 中最长的递增子序列，它表示旧节点重拍后按照新节点的顺序可保持的最大不用移动长度
    // 在进行DOM移动时保持不变即可
    // 需要注意的是 increment 获取的是 MappingArr 中最长递增子序列的索引
    // 换句话说也就是 寻找 MappingArr 中 value 值为递增的最长子序列，之后保存对应的索引（该索引对应的就是新节点不需要插入移动的）
    // !很巧妙呀 获得按照旧的（可复用）节点顺序
    const increment = getSequence(MappingArr);

    let j = increment.length - 1;
    // 这样之后需要移动位置
    for (let i = toBePatchLength - 1; i >= 0; i--) {
      // 倒序插入 insertBefore
      const index = i + s2; // 这个元素应该的位置
      const current = c2[index]; // 当前代表的节点
      const anchor = index + 1 <= c2.length ? c2[index + 1].el : null; // 参照物
      if (MappingArr[i] > 0) {
        // 注意如果对比patch过了后 n1和n2的el是同一个节点，只不过是仍在旧的位置而已
        // 非0表示当前新节点对应的el因为旧的中存在相同key，所以patch过了
        // 旧的已经存在过 将之前的el 进行追加 因为已经patch过（复用了之前的vnode）

        // 倒序插入时 寻找是否在递增序列中
        if (i !== increment[j]) {
          // 不再最长递增子序列中的索引中
          hostInsert(current.el, el, anchor);
        } else {
          j--;
        }
      } else {
        // 如果是新的节点 那么不会存在el 需要新建
        patch(null, current, el, anchor);
      }
    }
  }

  /**
   * 比较两个虚拟节点children的差异
   * @param n1 旧的节点 vnode
   * @param n2 新的节点 vnode
   */
  function patchChildren(n1, n2) {
    const n1Children = n1.children;
    const n2Children = n2.children;

    const prevShapeFlag = n1.shapeFlag;

    const shapeFlag = n2.shapeFlag;

    // 现在是文本 进入
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        // case: 1.新的是文本节点 旧的是数组节点 不需要DOMDiff
        // 卸载元素所有子节点 同时为元素设置文本节点
        unMountChildren(n1Children);
      }
      // 剩下就是说明之前也是文本
      if (n1Children !== n2Children) {
        hostSetElementText(n2.el, n2Children);
      }
    } else {
      // 现在一定非文本 有可能孩子为数组或者null
      if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
          // case: 两次孩子都是数组 DOM Diff
          // 全量DOM Diff 暂时不考虑靶向更新
          patchKeyedChildren(n1Children, n2Children, n2.el);
        } else {
          // case: 旧的是数组 新的是null空 这样的情况卸载之前的就OK
          unMountChildren(n1Children);
        }
      } else {
        // 之前一定不会是数组，
        // 之前不是数组，现在是非文本
        if (prevShapeFlag & ShapeFlags.TEXT_CHILDREN) {
          // 之前是文本 需要清空文本节点
          hostSetElementText(n2.el, '');
        }
        // 现在如果是数组
        if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
          // 将新的孩子元素节点进行挂载
          mountChildren(n2Children, n2.el);
        }
      }
    }
  }

  function mountComponent(vnode, container, anchor) {
    // 这里的type就是组件
    const { type } = vnode;
    // 从组件中拿到data和render
    const { data = () => {}, render } = type;
    // 将data变成响应式数据
    const state = reactive(data());
    // 创建组件的实例进行挂载
    const instance = {
      state,
      // 类似Vue2中的 $vnode -> 自身的Vnode
      vnode, // 每个组件都拥有自己的虚拟节点(!组件自身的虚拟节点)
      // 类似于Vue2中的_vnode -> 渲染的Vnode
      subTree: null, // 组件渲染的虚拟节点(render中渲染的Vnode)
      // 表示组件是否挂载
      isMounted: false,
      // 强制更新组件方法
      update: null,
    };

    const updateComponent = () => {
      console.log('执行');
      if (instance.isMounted) {
        // 当前组件内部State改变组件更新 获取当前组件最新subTree
        const subTree = render.call(state);
        // 调用patch比对当前组件render更新前后渲染的Vnode
        patch(instance.subTree, subTree, container, anchor);
        instance.subTree = subTree;
      } else {
        // 组件还未挂载
        // 调用render将state变为this 获得Vnode
        const subTree = (instance.subTree = render.call(state));
        // 同时将subTree挂载在el上
        patch(null, subTree, container, anchor);
        instance.isMounted = true;
      }
    };

    // 每次组件当前组件的state改变 当前组件重新渲染
    // 利用effect收集组件中使用到的响应式数据
    // !批量更新 并不需要每个State改变都重新渲染组件执行render
    // !而是说每次都要异步批量更新
    const effect = new ReactiveEffect(updateComponent, () => {
      // ! 批量更新
      queueJob(instance.update);
    });
    // 渲染更新 同时调用当前的effect.run会强制更新当前组件
    const update = (instance.update = effect.run.bind(effect));
    update();
  }

  /**
   * 挂载元素
   */
  function mountElement(vnode, container, anchor) {
    const { shapeFlag, type, props, children } = vnode;
    // 1.根据元素类型创建元素
    vnode.el = hostCreateElement(type);
    // 2.属性
    if (props) {
      for (let key in props) {
        hostPatchProps(vnode.el, key, null, props[key]);
      }
    }
    // 3.儿子
    // debugger;
    if (children) {
      if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
        // 文本
        hostSetElementText(vnode.el, children);
      } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        // 数组
        mountChildren(vnode.el, children);
      }
    }
    // 4.插入页面
    hostInsert(vnode.el, container, anchor);
  }

  /**
   * !相同元素（相同key）更新逻辑，涉及DOM Diff
   * @param n1
   * @param n2
   * @param container
   */
  function patchElement(n1, n2) {
    n2.el = n1.el;

    // 1.对比属性
    const n1Props = n1.props || {};
    const n2Props = n2.props || {};
    patchProps(n1Props, n2Props, n2.el);
    // 2.对比children
    patchChildren(n1, n2);
  }

  /**
   * 处理文本节点
   * @param n1
   * @param n2
   * @param container
   */
  function processText(n1, n2, container, anchor) {
    const { children } = n2;
    if (n1 === null) {
      // 创建
      n2.el = hostCreateText(children);
      hostInsert(n2.el, container, anchor);
    } else {
      // 更新
      // 1. 复用上一次的Dom节点 TextNode
      n2.el = n1.el;
      if (n2.children !== n1.children) {
        // 文本内容有更新 更新节点中的内容即可
        hostSetElementText(n2.el, n2.children);
      }
    }
  }

  /**
   * 处理Fragment
   * @param n1 旧节点
   * @param n2 新节点
   * @param container 挂载元素
   */
  function processFragment(n1, n2, container, anchor) {
    if (n1 === null) {
      // 直接挂载对应n2的children
      mountChildren(container, n2.children);
    } else {
      patchChildren(n1.children, n2.children);
    }
  }

  /**
   * 处理元素节点
   * @param n1
   * @param n2
   * @param container
   */
  function processElement(n1, n2, container, anchor) {
    if (n1 === null) {
      mountElement(n2, container, anchor);
    } else {
      // 更新
      patchElement(n1, n2);
    }
  }

  /**
   * 处理组件
   * @param n1
   * @param n2
   * @param container
   * @param anchor
   */
  function processComponent(n1, n2, container, anchor) {
    if (n1 === null) {
      mountComponent(n2, container, anchor);
    } else {
      // 组件更新
    }
  }

  // !核心:DomDiff patch 比对 vnode 方法方法
  function patch(n1, n2, container, anchor = null) {
    const { type, shapeFlag } = n2;
    // 不相同的元素节点 压根不需要DOM Diff
    if (n1 && !isSameVNodeType(n1, n2)) {
      // 删除n2
      unmount(n1);
      // 将n1变为null 接下来相当于重新创建n2进行挂载
      n1 = null;
    }
    switch (type) {
      // 文本: 直接hostCreateText + hostInsert/hostSetElementText
      case Text:
        processText(n1, n2, container, anchor);
        break;
      // Fragment： 本质就是直接mountChildren/patchChildren 到container上
      case Fragment:
        processFragment(n1, n2, container, anchor);
      default:
        // 元素: 多种情况，可能会Dom diff
        if (shapeFlag & ShapeFlags.ELEMENT) {
          processElement(n1, n2, container, anchor);
        } else if (shapeFlag & ShapeFlags.COMPONENT) {
          // 处理组件
          processComponent(n1, n2, container, anchor);
        }
        break;
    }
  }

  return {
    render: (vnode, container) => {
      // debugger;
      // 如果当前vNode可能为空 那么可能为卸载
      // 比如为 render(null, document.getElementById('app'))
      if (vnode === null) {
        // 卸载逻辑
        if (container.__vnode) unmount(container.__vnode);
      } else {
        // 当首次挂载时传入null container下不存在__vnode属性
        // 当更新时，元素内部存在__vnode属性，
        patch(container.__vnode || null, vnode, container);
      }
      // 缓存生成的vnode
      container.__vnode = vnode;
    },
  };
}

/** 
 * 
 * render(h('div', {
      style: {
        color: 'red'
      },
    }, [
      h('span', {
        key: 1
      }, 'a'),
      h('span', {
        key: 2
      }, 'b'),
      h('span', {
        key: 3
      }, 'c'),
      h('span', {
        key: 9
      }, 'c'),
      h('span', {
        key: 10
      }, 'd'),
      h('span', {
        key: 7
      }, 'e'),
      h('span', {
        key: 100
      }, 'last')

    ]), app)


    setTimeout(() => {
      render(h('div', {
        style: {
          color: 'blue'
        }
      }, [
        h('span', {
          key: 1
        }, 'a'),
        h('span', {
          key: 2
        }, 'b'),
        h('span', {
          key: 3
        }, 'c'),
        h('span', {
          key: 7
        }, 'f'),
        h('span', {
          key: 9
        }, 'ff'),
        h('span', {
          key: 10
        }, 'g'),
        h('span', {
          key: 100
        }, 'last')
      ]), app)
 * 这整个过程可以参考 Demo: @vue/runtime-dom/dist/index.html 代码
 * 首先针对于中一个元素el进行首次render时正常进行挂载，当render完成后
 * 会对App Dom 下挂载一个 __vnode 属性，值为传入的vnode节点
 * 
 * 二次渲染时，调用render 会检查app节点是否存在 __vnode 属性
 * 存在 -> 利用新旧vnode进行 patch方法 dom diff
 * 首先 patch 方法检测两个vnode前后key值相同(同为undefined所以根据元素类型进行处理)
 * 该元素为Dom节点 所以进行 processElement -> patchElement(直接复用之前的dom元素)
 * 首先对比属性 patchProps
 * 之后 parchChildren 进行对比儿子节点
 * 对比 children 时发现前后都为数组 所以进行 patchKeyedChildren
 * 进入 Dom diff 四指针方法
 * 1. 特殊情况:先取头尾进行处理，处理相同节点相同key的情况同时进行移动指针
 * 2. 特殊情况:再处理是否存在前后某一个为另一个的子集合
 * 3. 剩下为中间部分乱序 也就是 [9,10,7] -> [7,9,10]
 * 此时，首先会根据新vnode列表做一层key值映射，遍历旧的vnode查看旧的vnode在对应新的列表中是否存在
 * 存在 -> patch 新旧节点
 * 不存在 -> unmount 旧的vnode
 * 之后会根据新的乱序节点vnode列表进行倒序插入
 * （同时之前会记录一个 MappingArr ，MappingArr的顺序为新vnode列表的顺序，按照新的vnode排列顺序来创建一个数组）
 * (MappingArr中key为新vnode的顺序，value为该索引位置对应的旧节点位置。如果旧的不存在则该位置标记为0)
 * 寻找 MappingArr 中的最长递增子序列索引
 * 新的vnode列表中的元素下标如果满足 最长递增子序列索引 ，那么则不需要进行 dom 移动 保持原始顺序即可。（因为其他元素移动就可以满足要求组成新的vnode排列顺序）
 * 新的vnode列表中的元素下标如果不满足 最长递增子序列索引 ，那么它需要找到它的后一个元素，进行 hostInsert 也就是 insertBefore Api 修改元素排列顺序，同时如果之前的元素节点不存在，（也就是 MappingArr 中该位置对应value为0，那么就创建该元素）
 * 同时按照后一个节点，同样插入到它的后一个节点之前。
 * 
 * 至此，Dom Diff 完整过程结束。
*/
