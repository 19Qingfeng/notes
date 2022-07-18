import React, { useState } from 'react'
import { HOOK_MARK } from './constant';
import { FormInstance } from './interface';


/**
 * Form 状态管理
 */
class FormStore {
  /**
   * 标记该 Form 是否被使用
   * 当使用 useForm 创建 FormStore 实例时
   * 如果被 Form 组件使用的话，该属性会被置为 true
   */
  private formHooked: boolean = false;
  /**
   * 刷新 Form 组件
   */
  private forceUpdate: React.Dispatch<React.SetStateAction<{}>>

  constructor(forceUpdate: React.Dispatch<React.SetStateAction<{}>>) {
    this.forceUpdate = forceUpdate
  }

  /**
   * 获取 FormStore 内部的 Hook 
   */
  private getInternalHooks = (key: string) => {
    if (key === HOOK_MARK) {
      // 标记该 Form 关联了对应的 Form（Form 组件内部会调用该方法getInternalHooks ）
      this.formHooked = true;
      return {
        // 一系列表单方法
        // dispatch: this.dispatch,
        // initEntityValue: this.initEntityValue,
        // registerField: this.registerField,
        // useSubscribe: this.useSubscribe,
        // setInitialValues: this.setInitialValues,
        // destroyForm: this.destroyForm,
        // setCallbacks: this.setCallbacks,
        // setValidateMessages: this.setValidateMessages,
        // getFields: this.getFields,
        // setPreserve: this.setPreserve,
        // getInitialValue: this.getInitialValue,
        // registerWatch: this.registerWatch,
      }
    }

    // 不允许外部调用
    console.warn('`getInternalHooks` is internal usage. Should not call directly.');
    return null;
  }

  public getForm = () => ({
    getInternalHooks: this.getInternalHooks
  })
}

/**
 * Form 的状态管理 Hook
 * @param form 
 */
const useForm = <Values = any>(form?: any): [FormInstance<Values>] => {
  // form 内部数据改变时 需要刷新组件
  const [, forceUpdate] = useState({})

  const formRef = React.useRef<any>()
  if (!formRef.current) {
    if (form) {
      formRef.current = form
    } else {
      // 初始化新的 Form 赋值给对应的 ref
      const formInstance = new FormStore(forceUpdate)
      formRef.current = formInstance.getForm()
    }
  }

  return [formRef.current]
}

export {
  useForm
}