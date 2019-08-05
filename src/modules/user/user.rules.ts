import { Request } from 'express';
import { check } from 'express-validator/check';

export const userRules: any = {
  forSignIn: [
    check('email')
      .not()
      .isEmpty()
      .withMessage('Please enter email address')
      .isEmail()
      .withMessage('Invalid email address'),

    check('password')
      .not()
      .isEmpty()
      .withMessage('Please enter password')
      .isLength({ min: 8 })
      .withMessage('Password should be greater than 8 character'),
  ],
  forSignUser: [
    check('email')
      .not()
      .isEmpty()
      .withMessage('Please enter email address')
      .isEmail()
      .withMessage('Invalid email address')
      .matches(/@(neosofttech|wwindia)\.com$/i)
      .withMessage('Email must be for Neosoft Organisation'),

    check('password')
      .not()
      .isEmpty()
      .withMessage('Please enter password')
      .isLength({ min: 8 })
      .withMessage('Password should be greater than 8 char'),

    check('confirm_password')
      .not()
      .isEmpty()
      .withMessage('Please enter confirm password')
      .custom(
        (value: string, options: { req: Request }) =>
          value === options.req.body.password,
      )
      .withMessage('Password and Confirm password are not same.'),

    check('first_name')
      .not()
      .isEmpty()
      .withMessage('Please enter first name'),
  ],

  forUpdateUser: [
    check('email')
      .not()
      .isEmpty()
      .withMessage('Please enter email address')
      .isEmail()
      .withMessage('Invalid email address')
      .matches(/@(neosofttech|wwindia)\.com$/i)
      .withMessage('Email must be for Neosoft Organisation'),
  ],

  resetPassword: [
    check('password')
      .not()
      .isEmpty()
      .withMessage('Password cannot be blank')
      .isLength({ min: 8 })
      .withMessage('Password should be greater than 8 character'),
  ],
};
