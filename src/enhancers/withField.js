import {useField} from 'formik';
import {PROPS, isFunction} from '@truefit/bach';

export default fieldProps => ({generateNewVariable}) => {
  const generateFormPropsAlias = generateNewVariable();
  const generateFieldProps = isFunction(fieldProps)
    ? fieldProps
    : () => fieldProps;

  return {
    dependencies: {
      useField,
      [generateFormPropsAlias]: generateFieldProps,
    },
    initialize: `
      const [field, meta] = useField(${generateFormPropsAlias}(${PROPS}));
    `,
    props: ['field', 'meta'],
  };
};
