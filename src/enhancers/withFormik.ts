import {EnhancerContext, EnhancerResult} from '@truefit/bach';
import {useFormik, FormikConfig} from 'formik';

export default <T>(formikConfig: FormikConfig<T>) => ({
  generateNewVariable,
}: EnhancerContext): EnhancerResult => {
  const formikConfigAlias = generateNewVariable();

  return {
    dependencies: {
      useFormik,
      [formikConfigAlias]: formikConfig,
    },
    initialize: `
      const formik = useFormik(${formikConfigAlias});
    `,
    props: ['formik'],
  };
};
