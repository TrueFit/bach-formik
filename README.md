# @truefit/bach-formik

This library allows components composed with [@truefit/bach](https://github.com/truefit/bach) to idiomatically use [Formik](https://jaredpalmer.com/formik/)

## Installation

```
npm install @truefit/bach-formik formik
```

or

```
yarn add @truefit/bach-formik formik
```

## Enhancers

### withFormik

Allows you to specify that the composed component should be wrapped in a Formik element. This enhancer uses the [Formik component](https://jaredpalmer.com/formik/docs/api/formik).

_Helper Signature_

| Parameter | Type                 | Description                                                                                                                          |
| --------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| formProps | js object or js func | a js object (or lazy evaluated function) containing the props to pass to the formik element - see formik documentation for full list |

_Example_

```
import React from 'react';
import {compose} from '@truefit/bach';
import {withFormik} from '@truefit/bach-formik';

const WithFormik = ({values, handleChange, handleBlur, handleSubmit}) => (
  <div>
    <input
      name="name"
      onChange={handleChange}
      onBlur={handleBlur}
      value={values.name}
    />
    <input
      name="address"
      onChange={handleChange}
      onBlur={handleBlur}
      value={values.address}
    />
    <input
      name="age"
      onChange={handleChange}
      onBlur={handleBlur}
      value={values.age}
    />

    <button type="submit" onClick={handleSubmit}>
      Submit
    </button>
  </div>
);

export default compose(
  withFormik({
    initialValues: {name: 'John Doe', address: '', age: ''},
    onSubmit: values => {
      console.log(values); // eslint-disable-line
    },
  }),
)(WithFormik);
```

# withField

Allows you to create your own primitive inputs connected to Formik.

_Helper Signature_

| Parameter  | Type                 | Description                                                                                                                            |
| ---------- | -------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| fieldProps | js object or js func | a js object (or lazy evaluated function) containing the props to pass to formik for the field - see formik documentation for full list |

_Example_

```
import React from 'react';
import {compose} from '@truefit/bach';
import {withFormik, withField} from '@truefit/bach-formik';

const TextField = compose(withField(({name}) => ({name})))(
  ({label, field, meta}) => (
    <>
      <div>
        <label>{label}</label>
        <input {...field} />
        {meta.touched && meta.error ? (
          <div className="error">{meta.error}</div>
        ) : null}
      </div>
    </>
  ),
);

const WithFormik = ({handleSubmit}) => (
  <div>
    <TextField name="name" label="Name:" />
    <TextField name="address" label="Address:" />
    <TextField name="age" label="Age:" />

    <button type="submit" onClick={handleSubmit}>
      Submit
    </button>
  </div>
);

export default compose(
  withFormik({
    initialValues: {name: 'John Doe', address: '', age: ''},
    onSubmit: values => {
      console.log(values); // eslint-disable-line
    },
  }),
)(WithFormik);
```

_ Formik Hook_

[useField](https://jaredpalmer.com/formik/docs/api/useField)

# withFormikContext

Gives you access to the formikContext. Must be inside of a Formik tag or a withFormik HOC.

_Helper Signature_

| Parameter     | Type             | Description                                                                                               |
| ------------- | ---------------- | --------------------------------------------------------------------------------------------------------- |
| propertyNames | array of strings | the names of the props in the formik context that are mapped to the props passed to the wrapped component |

_Example_

```
import React from 'react';
import {compose, withEffect} from '@truefit/bach';
import {withFormik, withFormikContext} from '@truefit/bach-formik';

const MagicSubmit = compose(
  withFormikContext(['values', 'submitForm']),
  withEffect(
    ({values, submitForm}) => {
      if (values.age >= 35) {
        submitForm();
      }
    },
    ['values, submitForm'],
  ),
)(() => null);

const WithFormik = ({values, handleChange, handleBlur}) => (
  <div>
    <div>
      Name:
      <input
        name="name"
        onChange={handleChange}
        onBlur={handleBlur}
        value={values.name}
      />
    </div>
    <div>
      Address:
      <input
        name="address"
        onChange={handleChange}
        onBlur={handleBlur}
        value={values.address}
      />
    </div>
    <div>
      Age:
      <input
        name="age"
        onChange={handleChange}
        onBlur={handleBlur}
        value={values.age}
      />
    </div>

    <MagicSubmit />
  </div>
);

export default compose(
  withFormik({
    initialValues: {name: 'John Doe', address: '', age: ''},
    onSubmit: values => {
      console.log(values); // eslint-disable-line
    },
  }),
)(WithFormik);
```

_ Formik Hook_

[useFormikContext](https://jaredpalmer.com/formik/docs/api/useFormikContext)
