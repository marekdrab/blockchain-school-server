const infrastructure = require('../../fabcar/api/api');

module.exports = {
    getLatestID: async function (entity_name) {
        let result = await infrastructure.getAllEntities('admin', entity_name)
        return result.result[result.result.length-1]
    },
    putAddress: async function (address) {
        address.entity_name = 'address'
        let result = await infrastructure.putEntity('admin', address)
        address_id = await this.getLatestID('address')
        address.id = address_id 
        return address
    },
    getAddress: async function (address_id) {
        let result = await infrastructure.getEntity('admin',address_id)
        return result
    },
    getSystemCredibilities: async function (system_credibilities) {
        let result = []
        for (let id in system_credibilities) {
            let output = await infrastructure.getEntity('admin',system_credibilities[id])
            result.push(output)
        }
        return result
    }
}