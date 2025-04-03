const { schema } = require("../model/adminModel")
const adminRoute=require("./module/admin/routes/adminRoute")

module.exports = [
    {
        path:'/api/admin',
        schema:'Admin',
        handler: adminRoute
    }
]