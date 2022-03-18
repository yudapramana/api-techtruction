const {
    mongoose
} = require(".");

module.exports = (mongoose) => {
    const schema = new mongoose.Schema({
        name: {
            type: String,
            required: true,
            minlength: 5,
            maxlength: 255,
        },
        email: {
            type: String,
            required: true,
            minlength: 6,
            maxlength: 255
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
            maxlength: 1024
        },
    }, {
        timestamps: true
    })

    schema.method("toJSON", function () {
        const {
            __v,
            _id,
            ...object
        } = this.toObject();
        object.id = _id;
        return object;
    })

    const User = mongoose.model("users", schema)

    return User
}