import {useFormikContext} from 'formik';
import {generateAssignments} from '@truefit/bach';

export default (propertyNames = []) => ({generateNewVariable}) => {
  const contextAlias = generateNewVariable();
  const assignments = generateAssignments(propertyNames, contextAlias);

  return {
    dependencies: {
      useFormikContext,
    },
    initialize: `
      const ${contextAlias} = useFormikContext();
      
      ${assignments}
    `,
    props: propertyNames,
  };
};
