const configSchema = {
    userRequestModel: {
        id: '/login',
        type: 'object',
        required: ['username', 'password'],
        properties: {
            username: {
                type: 'string'
            },
            password: {
                type: 'string'
            }
        }
    },
    userRegisterModel: {
        id: '/register',
        type: 'object',
        required: ['name', 'username', 'email', 'password'],
        properties: {
            name: {
                type: 'string'
            },
            username: {
                type: 'string'
            },
            email: {
                type: 'string'
            },
            password: {
                type: 'string'
            },
        }
    }
}
module.exports = configSchema;