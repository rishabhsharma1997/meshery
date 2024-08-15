import { fromPromise } from 'xstate';
import Ajv from 'ajv';
import _ from 'lodash';

import { processDesign } from '@/utils/utils';
import { dataValidatorMachine } from '@layer5/sistent';

const ajv = new Ajv({
  allErrors: true,
  strict: false, // allow additional properties like x-kubernetes-attributes ( this is safe the schema is sourced from the component definition and is not ours)
});

// dynamically add schemas to ajv to avoid recompiling the same schema and cache it
const validateSchema = (schema, data, id) => {
  let validate = ajv.getSchema(id);
  if (!validate) {
    ajv.addSchema(schema, id);
    validate = ajv.getSchema(id);
  }
  const valid = validate(data);

  return {
    isValid: valid,
    errors: validate.errors,
  };
};

const validateComponent = (component, validateAnnotations = false, componentDef) => {
  console.log('validating component', component);
  if (!componentDef || (componentDef?.metadata?.isAnnotation && !validateAnnotations)) {
    // skip validation for annotations
    return {
      errors: [],
      componentDefinition: componentDef,
      component,
    };
  }
  const schema = JSON.parse(componentDef.component.schema);
  const results = validateSchema(schema, component.configuration || {}, componentDef.id);

  const validationResults = {
    ...results,
    componentDefinition: componentDef,
    component,
  };
  console.log('component results', validationResults);

  return validationResults;
};

export const componentKey = (component) =>
  `${component.component.kind}-${component.model.name}-${component.component.version}`;

const validateDesign = (design, componentDefsStore) => {
  console.log('validating design in worker', design);

  const configurableComponents = design.components;

  const validationResults = {};

  for (const configurableComponent of configurableComponents) {
    try {
      const componentDef = componentDefsStore?.[componentKey(configurableComponent)];
      const componentValidationResults = validateComponent(
        configurableComponent,
        false,
        componentDef,
      );
      validationResults[configurableComponent.id] = componentValidationResults;
    } catch (error) {
      console.error('Error validating component', error);
    }
  }

  console.log('validationResults', validationResults);
  return validationResults;
};

const SchemaValidateDesignActor = fromPromise(async ({ input }) => {
  const { validationPayload, prevValidationResults } = input;
  const { validationPayloadType } = validationPayload;

  if (validationPayloadType === 'design') {
    const { design, componentDefs } = validationPayload;
    const validationResults = validateDesign(design, componentDefs);
    return {
      validationResults,
    };
  }

  if (validationPayloadType === 'component') {
    const { component, componentDef } = validationPayload;
    const validationResults = validateComponent(
      component,
      validationPayload.validateAnnotations || false,
      componentDef,
    );

    return {
      validationResults: _.set(prevValidationResults || {}, component.name, validationResults),
    };
  }

  throw new Error('Invalid validation payload type', validationPayloadType);
});

export const schemaValidatorMachine = dataValidatorMachine.provide({
  actors: {
    ValidateActor: SchemaValidateDesignActor,
  },
});
