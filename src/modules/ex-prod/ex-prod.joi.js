// validation/userValidation.js
import Joi from 'joi';

export const userSchema = {
    body: Joi.object({
        firstName: Joi.object().keys({ar:Joi.string().pattern(/^[A-Z][a-z]+$/).required(),en:Joi.string().required()}).required(),
        lastName: Joi.string().trim().required().messages({
            'string.empty': 'Last name is required',
            'any.required': 'Last name is required'
        }),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        dateOfBirth: Joi.date().optional(),
        isActive: Joi.boolean().default(true),
        roles: Joi.array().items(Joi.string().valid('user', 'admin', 'moderator')).default(['user'])
    })
}
