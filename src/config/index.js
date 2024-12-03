const projectCategories = ['impact', 'at-large', 'incubation', 'emeritus']

const defaultValues = {
    projectCategories
}
const testEnvironment = {
    projectCategories
}

const getConfig = env => {
    // NOTE: env variable should override the NODE_ENV
    const environment = env || process.env.NODE_ENV
    const config = environment === 'test' ? testEnvironment : defaultValues
    return config
}
  
module.exports = {
    getConfig
}