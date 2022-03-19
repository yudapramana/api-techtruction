const {
    mongoose
} = require(".");

module.exports = (mongoose) => {
    const schema = mongoose.Schema({
        user_id: String,
        text: String,
        day: String,
        reminder: Boolean,
        completed: Boolean,
    }, {
        timestamps: true
    })

    schema.method("toJSON", function() {
        const {
            __v,
            _id,
            ...object
        } = this.toObject();
        object.id = _id;
        return object;
    })

    const Task = mongoose.model("tasks", schema)

    return Task
}