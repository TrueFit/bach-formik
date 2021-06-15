import {EnhancerContext, EnhancerResult, isFunction, PROPS, REACT} from '@truefit/bach';
import {useFormik, FormikConfig, FormikProvider} from 'formik';

type FormikConfigParameter<T, P> = FormikConfig<T> | ((props: P) => FormikConfig<T>) | undefined;

export default <T, P>(formikConfig: FormikConfigParameter<T, P>, useContext = true) =>
  ({generateNewVariable}: EnhancerContext): EnhancerResult => {
    const formikConfigAlias = generateNewVariable();
    const resolveFormikConfigAlias = generateNewVariable();
    const resolveFormikConfig = isFunction(formikConfig) ? formikConfig : () => formikConfig;

    return {
      dependencies: {
        FormikProvider,
        useFormik,

        [resolveFormikConfigAlias]: resolveFormikConfig,
      },
      initialize: `
      const ${formikConfigAlias} = ${resolveFormikConfigAlias}(${PROPS});
      const formik = useFormik(${formikConfigAlias});
    `,
      props: ['formik'],

      transformRender: (previousStatement: string): string => {
        if (!useContext) {
          return previousStatement;
        }

        return `${REACT}.createElement(FormikProvider, {value: formik}, ${previousStatement})`;
      },
    };
  };
