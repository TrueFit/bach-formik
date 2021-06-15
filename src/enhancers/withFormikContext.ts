import {EnhancerResult} from '@truefit/bach';
import {useFormikContext} from 'formik';

export default <T>(propertyNames: Array<keyof T> | undefined) =>
  (): EnhancerResult => {
    const specifiedPropertyNames = propertyNames?.length > 0;
    const leftSide = specifiedPropertyNames ? `{${propertyNames?.join(', ')}}` : 'formik';

    return {
      dependencies: {
        useFormikContext,
      },
      initialize: `
      const ${leftSide} = useFormikContext();
    `,
      props: specifiedPropertyNames ? (propertyNames as string[]) : ['formik'],
    };
  };
