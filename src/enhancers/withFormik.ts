import {EnhancerContext, EnhancerResult, isFunction, PROPS} from '@truefit/bach';
import {useFormik, FormikConfig} from 'formik';

type FormikConfigParameter<T, P> = FormikConfig<T> | ((props: P) => FormikConfig<T>) | undefined;

export default <T, P>(formikConfig: FormikConfigParameter<T, P>) => ({
  generateNewVariable,
}: EnhancerContext): EnhancerResult => {
  const formikConfigAlias = generateNewVariable();
  const resolveFormikConfigAlias = generateNewVariable();
  const resolveFormikConfig = isFunction(formikConfig) ? formikConfig : () => formikConfig;

  return {
    dependencies: {
      useFormik,
      [resolveFormikConfigAlias]: resolveFormikConfig,
    },
    initialize: `
      const ${formikConfigAlias} = ${resolveFormikConfigAlias}(${PROPS});
      const formik = useFormik(${formikConfigAlias});
    `,
    props: ['formik'],
  };
};
