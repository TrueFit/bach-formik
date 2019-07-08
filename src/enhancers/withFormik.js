import React, {useState, useRef, useEffect} from 'react';
import {REACT, COMPONENT, PROPS, isFunction} from '@truefit/bach';
import {Formik} from 'formik';
import isEqual from 'react-fast-compare';

const formikKeys = [
  'values',
  'errors',
  'touched',
  'isSubmitting',
  'isValidating',
  'submitCount',
  'status',
  'dirty',
  'isValid',
  'initialValues',
  'resetForm',
  'validateForm',
  'validateField',
  'setError',
  'setErrors',
  'setFieldError',
  'setFieldTouched',
  'setFieldValue',
  'setStatus',
  'setSubmitting',
  'setTouched',
  'setValues',
  'setFormikState',
  'registerField',
  'unregisterField',
  'handleBlur',
  'handleChange',
  'handleReset',
  'handleSubmit',
  'validateOnChange',
  'validateOnBlur',
];

const trackChanges = [
  'values',
  'errors',
  'touched',
  'isSubmitting',
  'isValidating',
  'submitCount',
  'status',
  'dirty',
  'isValid',
];

const hasChanged = (formikProps, previousFormikProps) => {
  if (!formikProps) {
    return false;
  }

  if (!previousFormikProps) {
    return true;
  }

  return trackChanges.reduce((acc, key) => {
    if (acc) {
      return acc;
    }

    if (!isEqual(formikProps[key], previousFormikProps[key])) {
      return true;
    }
  }, false);
};

const filterToFormikProps = props =>
  formikKeys.reduce((acc, key) => {
    acc[key] = props[key];
    return acc;
  }, {});

const FormikIntercept = ({
  component: Component,
  setFormikProps,
  ...otherProps
}) => {
  const previousProps = useRef(null);

  useEffect(() => {
    const formikProps = filterToFormikProps(otherProps);
    if (
      !previousProps.current ||
      hasChanged(formikProps, previousProps.current)
    ) {
      previousProps.current = formikProps;
      setFormikProps(formikProps);
    }
  });

  return <Component {...otherProps} />;
};

const FormikWrapper = ({generateFormProps, ...otherProps}) => {
  const formProps = generateFormProps(otherProps);

  return (
    <Formik {...formProps}>
      {props => {
        return <FormikIntercept {...props} {...otherProps} />;
      }}
    </Formik>
  );
};

export default formProps => ({generateNewVariable}) => {
  const generateFormPropsAlias = generateNewVariable();
  const generateFormProps = isFunction(formProps) ? formProps : () => formProps;

  return {
    dependencies: {
      useState,
      FormikWrapper,

      [generateFormPropsAlias]: generateFormProps,
    },
    initialize: `
      const [formikProps, setFormikProps] = useState({});
    `,
    props: ['formikProps'],
    render: `
      const renderProps = {
        ...${PROPS},

        generateFormProps: ${generateFormPropsAlias},
        component: ${COMPONENT},
        setFormikProps,
      };

      return ${REACT}.createElement(FormikWrapper, renderProps);
    `,
  };
};
