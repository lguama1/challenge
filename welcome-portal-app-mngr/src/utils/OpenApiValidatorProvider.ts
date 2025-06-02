import fs from 'fs';
import path from 'path';
import { OpenApiValidator } from 'express-openapi-validate';
import debugLib from 'debug';
const debug = debugLib('bdb:OpenApiValidatorProvider');

export default class OpenApiValidatorProvider {
    public static getValidator() {
        const openApiSpecificationFile = path.join(__dirname, '../../static/oas.json');
        const openApiSpecification = fs.readFileSync(openApiSpecificationFile, 'utf-8');
        const openApiDocument = JSON.parse(openApiSpecification);
        debug('openApiDocument: %j', openApiDocument);
        return new OpenApiValidator(openApiDocument);
    }
}
