const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');

const ajv = new Ajv();

const TOOL_MANIFEST_FILENAME = '.mosaia';

function validateToolMetadataName(name) {
  let errors = [];
  const validName = /^(?! )[A-Za-z0-9]+( [A-Za-z0-9]+)*(?<! )$/;
  if (typeof name !== 'string' || name.length < 5) {
    errors.push('`name` must be a string (min length 5)');
  } else if (!validName.test(name)) {
    errors.push(`\`name\` must conform to the following regex: ${validName.toString()}`);
  }
  return errors;
}

function validateToolMetadataDescription(description) {
  let errors = [];
  if (typeof description !== 'string' || description.length < 30) {
    errors.push('`description` must be a string (min length 30)');
  }
  return errors;
}

function validateToolMetadataSchema(schema) {
  let errors = [];
  if (typeof schema !== 'object' || schema === null || schema.constructor.name !== 'Object') {
    errors.push('`schema` must be an object');
    return errors;
  } else {
    if (!('type' in schema) || typeof schema.type !== 'string' || schema.type !== 'function') {
      errors.push('`schema.type` must have the value `function`');
    }
    if (!('function' in schema) || typeof schema.function !== 'object' || schema.function === null || schema.function.constructor.name !== 'Object') {
      errors.push('`schema.function` must be an object');
      return errors;
    } else {
      if (!('name' in schema.function) || typeof schema.function.name !== 'string' || schema.function.name.length < 5) {
        errors.push('`schema.function.name` must be a string (min length 5)');
      }
      if (!('description' in schema.function) || typeof schema.function.description !== 'string' || schema.function.description.length < 30) {
        errors.push('`schema.function.description` must be a string (min length 30)');
      }
      if (('strict' in schema.function) && typeof schema.function.strict !== 'boolean') {
        errors.push('`schema.function.strict` must be boolean (optional value)');
      }
      if (!('parameters' in schema.function) || typeof schema.function.parameters !== 'object' || schema.function.parameters === null || schema.function.parameters.constructor.name !== 'Object') {
        errors.push('`schema.function.parameters` must be an object');
        return errors;
      } else {
        try {
          ajv.compile(schema.function.parameters)
        } catch (error) {
          errors.push(`\`schema.function.parameters\` has the following errors: ${error.message}`);
        }
      }
    }
  }
  return errors;
}

const isArray = (obj) => obj !== undefined && obj !== null && typeof obj === 'object' && obj.constructor.name === 'Array'
const isArrayOfStrings = (arr) => arr.filter(v => typeof v === 'string').length === arr.length;

function validateToolMetadataEnvVars(envVars) {
  let errors = [];
  if (envVars !== undefined) {
    if (!isArray(envVars)) {
      errors.push('`envVars` must be an array (optional value)');
    } else if (!isArrayOfStrings(envVars)) {
      errors.push('`envVars` must be an array of strings');
    }
  }
  return errors;
}

function validateToolMetadata() {
  let errors = [];
  const manifestPath = path.join(process.cwd(), TOOL_MANIFEST_FILENAME);
  if (!fs.existsSync(manifestPath)) {
    errors.push('Repo missing `.mosaia` manifest file in root of project');
    return errors;
  }
  let manifestFileBuffer;
  try {
    manifestFileBuffer = fs.readFileSync(manifestPath);
  } catch (error) {
    errors.push('Failed to read existing .mosaia manifest file');
    return errors;
  }
  const manifestFileStr = manifestFileBuffer.toString();
  let manifestJson;
  try {
    manifestJson = JSON.parse(manifestFileStr)
  } catch (error) {
    errors.push('`.mosaia` manifest file not valid JSON');
    return errors;
  }
  const { name, description, schema, envVars } = manifestJson;
  errors.push(...validateToolMetadataName(name));
  errors.push(...validateToolMetadataDescription(description));
  errors.push(...validateToolMetadataSchema(schema));
  errors.push(...validateToolMetadataEnvVars(envVars));
  return errors;
}

function main() {
  console.log('Validating .mosaia manifest file...\n');
  const errors = validateToolMetadata();
  if (errors.length > 0) {
    console.error('❌ Validation failed with the following errors:');
    errors.forEach(error => {
      console.error(`  - ${error}`);
    });
    process.exit(1);
  } else {
    console.log('✅ .mosaia manifest file is valid!');
    process.exit(0);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  validateToolMetadata,
  validateToolMetadataName,
  validateToolMetadataDescription,
  validateToolMetadataSchema,
  validateToolMetadataEnvVars
};


