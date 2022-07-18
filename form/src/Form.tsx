import React from 'react';
import { HOOK_MARK } from './constant';
import { useForm } from './useForm';

interface FormProps {
  /**
   * 初始值
   */
  initialValues?: any;
  /**
   * Form 实例
   */
  form?: any;
  /**
   * Form 提交事件
   */
  onSubmit?: (value: any) => void;
}

const Form: React.FC<FormProps> = (props) => {
  const { form } = props;

  const [formInstance] = useForm(form);

  const { getInternalHooks } = (formInstance as any).getInternalHooks(
    HOOK_MARK
  );

  const {} = getInternalHooks();

  // 1. 根据传入的 Form 进行初始化

  return <div>This is Form Component</div>;
};

export { Form };
