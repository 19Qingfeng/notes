
export interface FormInstance<Values = any> {
  // Origin Form API
  // getFieldValue: (name: NamePath) => StoreValue;
  // getFieldsValue: (() => Values) &
  // ((nameList: NamePath[] | true, filterFunc?: (meta: Meta) => boolean) => any);
  // getFieldError: (name: NamePath) => string[];
  // getFieldsError: (nameList?: NamePath[]) => FieldError[];
  // getFieldWarning: (name: NamePath) => string[];
  // isFieldsTouched: ((nameList?: NamePath[], allFieldsTouched?: boolean) => boolean) &
  // ((allFieldsTouched?: boolean) => boolean);
  // isFieldTouched: (name: NamePath) => boolean;
  // isFieldValidating: (name: NamePath) => boolean;
  // isFieldsValidating: (nameList: NamePath[]) => boolean;
  // resetFields: (fields?: NamePath[]) => void;
  // setFields: (fields: FieldData[]) => void;
  // setFieldValue: (name: NamePath, value: any) => void;
  // setFieldsValue: (values: RecursivePartial<Values>) => void;
  // validateFields: ValidateFields<Values>;

  // New API
  submit: () => void;
}