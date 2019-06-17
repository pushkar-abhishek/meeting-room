import { Request } from 'express';
import { check } from 'express-validator/check';

export const userRules: any = {

    forSignUser: [
        check('email')
        .not().isEmpty().withMessage('Please enter email address')
        .isEmail().withMessage('Invalid email address'),

        check('password')
        .not().isEmpty().withMessage('Please enter password')
        .isLength({min: 8}).withMessage('Password should be greater than 8 char'),

        check('confirm_password')
        .not().isEmpty().withMessage('Please enter confirm password')
        .custom((value: string, options : { req: Request }) => value === options.req.body.password)
        .withMessage('Password and Confirm password are not same.'),
    ],

    forUpdateUser: [
        check('email')
        .not().isEmpty().withMessage('Please enter email address')
        .isEmail().withMessage('Invalid email address'),
    ],
};
