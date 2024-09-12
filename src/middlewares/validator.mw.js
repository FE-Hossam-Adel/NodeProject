const dataMethod = ['body', 'params', 'query', 'headers'];

const errorMessages = {
    en: {
        'string.base': 'First name must be a string',
        'string.empty': 'This field is required',
        'any.required': 'This field is required',
        'string.email': 'Must be a valid email address',
        'string.min': 'Must be at least {limit} characters long',
        'string.max': 'Cannot exceed {limit} characters',
        'string.length': 'Must be exactly {limit} characters long',
        'string.pattern.base': 'Does not match the required format',
        'number.base': 'Must be a number',
        'number.min': 'Must be greater than or equal to {limit}',
        'number.max': 'Must be less than or equal to {limit}',
        'number.integer': 'Must be an integer',
        'date.base': 'Must be a valid date',
        'array.base': 'Must be an array',
        'array.min': 'Must have at least {limit} items',
        'array.max': 'Must have no more than {limit} items',
        'boolean.base': 'Must be a boolean value',
        'any.only': 'Must match one of the allowed values',
        'object.unknown': 'This field is not allowed'
    },
    ar: {
        'string.base': 'يجب أن يكون نصاً',
        'string.empty': 'هذا الحقل مطلوب',
        'any.required': 'هذا الحقل مطلوب',
        'string.email': 'يجب أن يكون عنوان بريد إلكتروني صالح',
        'string.min': 'يجب أن يتكون من {limit} أحرف على الأقل',
        'string.max': 'يجب ألا يتجاوز {limit} حرفًا',
        'string.length': 'يجب أن يحتوي على {limit} حرفًا بالضبط',
        'string.pattern.base': 'لا يتطابق مع التنسيق المطلوب',
        'number.base': 'يجب أن يكون رقمًا',
        'number.min': 'يجب أن يكون أكبر من أو يساوي {limit}',
        'number.max': 'يجب أن يكون أقل من أو يساوي {limit}',
        'number.integer': 'يجب أن يكون عددًا صحيحًا',
        'date.base': 'يجب أن يكون تاريخًا صالحًا',
        'array.base': 'يجب أن يكون مصفوفة',
        'array.min': 'يجب أن تحتوي على {limit} عناصر على الأقل',
        'array.max': 'يجب ألا تحتوي على أكثر من {limit} عناصر',
        'boolean.base': 'يجب أن تكون قيمة منطقية',
        'any.only': 'يجب أن يتطابق مع إحدى القيم المسموح بها',
        'object.unknown': 'هذا الحقل غير مسموح به'
    }
};
const flattenErrors = (errors, parentKey = '') => {
    const flattened = {};

    for (const key in errors) {
        const fullKey = parentKey ? `${parentKey}.${key}` : key;

        if (typeof errors[key] === 'object' && !Array.isArray(errors[key])) {
            Object.assign(flattened, flattenErrors(errors[key], fullKey));
        } else {
            flattened[fullKey] = errors[key];
        }
    }

    return flattened;
};

const formatErrors = (errorDetails, language) => {
    const formattedErrors = {};

    errorDetails.forEach(err => {
        const path = err.path.join('.');
        let errorMessage = errorMessages[language][err.type] || err.message;

        if (err.context.limit) {
            errorMessage = errorMessage.replace('{limit}', err.context.limit);
        }

        // Replace {field} placeholder with the field name
        errorMessage = errorMessage.replace('{field}', path.split('.').pop());

        // Set the error message in the formattedErrors object
        if (!formattedErrors[path]) {
            formattedErrors[path] = [];
        }

        formattedErrors[path].push(errorMessage);
    });

    return formattedErrors;
};

export const validation = (Schema) => {
    return (req, res, next) => {
        try {
            const validationErrors = {};

            // Determine the language from the request query or default to 'en'
            const language = req.query.lang || 'en';

            if (Schema) {
                for (const key of dataMethod) {
                    if (Schema[key]) {
                        const validationResult = Schema[key].validate(req[key], { abortEarly: false });

                        if (validationResult?.error) {
                            const formattedErrors = formatErrors(validationResult.error.details, language);

                            // Group errors by their parent field
                            for (const [field, messages] of Object.entries(formattedErrors)) {
                                const [parentField] = field.split('.');
                                if (!validationErrors[parentField]) {
                                    validationErrors[parentField] = {};
                                }
                                validationErrors[parentField][field.split('.').slice(1).join('.')] = messages.join('; ');
                            }

                            return res.status(400).json({
                                message: language === 'ar' ? 'يرجى تصحيح الأخطاء أدناه' : 'Please correct the errors below',
                                errors: validationErrors
                            });
                        }
                    }
                }
            }

            return next(); // Proceed if no validation errors are found

        } catch (error) {
            return next(new Error("Validation error", { cause: 500 }));
        }
    };
};
