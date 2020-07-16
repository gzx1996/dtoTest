const request = {
    username: {
        required: true,
        type: 'string',
        maxLength: 20,
        minLength: 2,
        allowEmpty: false,
    },
    age: {
        required: true,
        type: 'number',
        allowNull: false,
        max: 100,
        min: 18
    },
    phone: {
        required: true,
        type: 'string',
        allowEmpty: false,
        regexp: /^(?:(?:\+|00)86)?1\d{10}$/
    },
    isDelete: {
        type: 'boolean'
    },
    list: {
        type: 'array',
        allowEmpty: false,
        maxLength: 10,
        minLength: 2
    },
    obj: {
        type: 'object',
        allowEmpty: false,
        value: {
            a: {
                required: true,
                type: 'number',  
            },
            b: {
                type: 'object',
                allowEmpty: false,
                value: {
                    c: {
                        required: true,
                        type: 'number',
                        enums: [1,2,3,4,5]  
                    },
                    d: {
                        required: true,
                        type: 'array',  
                    },
                }
                
            }
        }
    }
}

const reponse = {

}
module.exports = {
    request,
    reponse
}