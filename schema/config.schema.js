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
        required: ['name', 'lastname', 'username', 'password'],
        properties: {
            name: {
                type: 'string'
            },
            lastname: {
                type: 'string'
            },
            username: {
                type: 'string'
            },
            password: {
                type: 'string'
            }
        }
    }
}
module.exports = configSchema;