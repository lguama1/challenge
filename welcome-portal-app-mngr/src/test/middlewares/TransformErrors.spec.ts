import chai from 'chai';
import chaiHttp from 'chai-http';
import TransformErrors from '../../middlewares/TransformErrors';

const expect = chai.expect;

chai.use(chaiHttp);
chai.should();

describe('TransformErrors', () => {
    it(`Given a response with an error structure that does not contain a data.error field,
    When the transform middleware processes the response,
    Then it should correctly parse and handle the error without relying on the data.error property`,
    (done) => {
        const error = {
            message: 'Upss!!! un error',
        };
        const req = {
            headers: {
                'X-RqUID': 'abcdefghi'
            }
        };
        const res = {
            status: (code: number) => {
                expect(code).equal(500);
                return {
                    json: (result: any) => {
                        expect(result.message).equal('Upss!!! un error');
                    }
                };
            }
        };
        TransformErrors.parseErrors(error, req as any, res as any, () => {});
        done();
    });

    it(`Given a response with an error structure that contain a data.error field,
    When the transform middleware processes the response,
    Then it should correctly parse and handle the error.`,
    (done) => {
        const error = {
            statusCode: 400,
            data: [
                {
                    keyword: 'type',
                    instancePath: '/body/nombre',
                    message: 'should be string',
                    params: { type: 'string' },
                    schemaPath: '#/properties/body/properties/nombre/type'
                }
            ]
        };
        const req = {
            headers: {}
        };
        const res = {
            status: (code: number) => {
                expect(code).equal(400);
                return {
                    json: (result: any) => {
                        expect(result.message).equal('');
                    }
                };
            }
        };
        TransformErrors.parseErrors(error, req as any, res as any, () => {});
        done();
    });
});
