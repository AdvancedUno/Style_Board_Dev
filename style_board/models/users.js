import mongoose,{ Schema } from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true, }
});

// Hash the password before saving the user
userSchema.pre("save", async function (next) {
    if (this.isModified("password") || this.isNew) {
        try {
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
        } catch (error) {
            return next(error);
        }
    }
    next();
});

const Users = mongoose.models.Users || mongoose.model("Users", userSchema);

export default Users;