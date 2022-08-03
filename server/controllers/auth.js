import User from "../models/user";
import { hashPassword, comparePassword } from "../utils/auth";
import jwt from 'jsonwebtoken'
import AWS from "aws-sdk";
import { nanoid } from 'nanoid'

const awsConfig = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    apiVersion: process.env.AWS_API_VERSION,
};

const SES = new AWS.SES(awsConfig);



export const register = async (req, res) => {
    try {
        // console.log(req.body);
        const { name, email, password } = req.body;
        // validation
        if (!name) return res.status(400).send("Name is required");
        if (!password || password.length < 6) {
            return res
                .status(400)
                .send("Password is required and should be min 6 characters long");
        }
        let userExist = await User.findOne({ email }).exec();
        if (userExist) return res.status(400).send("Email is taken");

        // hash password
        const hashedPassword = await hashPassword(password);

        // register
        const user = new User({
            name,
            email,
            password: hashedPassword,
        });
        await user.save();
        // console.log("saved user", user);

        return res.json({ ok: true });
    } catch (err) {
        console.log(err);
        return res.status(400).send("Error. Try again.");
    }
};


export const login = async (req, res) => {

    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email })

        if (!user) {
            return res.status(400).send("User does not exist")
        }


        if (await comparePassword(password, user.password)) {
            user.password = undefined

            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

            res.cookie("token", token, { httpOnly: true })

            return res.json(user)
        }

        res.status(400).send("Invalid credentials!!!")




    } catch (err) {
        console.log(err);
        return res.status(400).send("Error. Try again.");
    }
}


export const logout = (req, res) => {
    try {
        res.clearCookie('token')
        res.json({ message: "logged out" })
    } catch (err) {
        console.log(err);
        return res.status(400).send("Error. Try again.");
    }

}


export const currentUser = (req, res) => {
    try {

        res.json({ ok: true })
    } catch (err) {
        console.log(err);
        return res.status(400).send("Error. Try again.");
    }

}


export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        // console.log(email);
        const shortCode = nanoid(6).toUpperCase();
        const user = await User.findOneAndUpdate(
            { email },
            { passwordResetCode: shortCode }
        );
        if (!user) return res.status(400).send("User not found");

        // prepare for email
        const params = {
            Source: process.env.EMAIL_FROM,
            Destination: {
                ToAddresses: [email],
            },
            Message: {
                Body: {
                    Html: {
                        Charset: "UTF-8",
                        Data: `
                  <html>
                    <h1>Reset password</h1>
                    <p>User this code to reset your password</p>
                    <h2 style="color:red;">${shortCode}</h2>
                    <i>edemy.com</i>
                  </html>
                `,
                    },
                },
                Subject: {
                    Charset: "UTF-8",
                    Data: "Reset Password",
                },
            },
        };

        const emailSent = SES.sendEmail(params).promise();
        emailSent
            .then((data) => {
                console.log(data);
                res.json({ ok: true });
            })
            .catch((err) => {
                console.log(err);
            });
    } catch (err) {
        console.log(err);
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { email, code, newPassword } = req.body;
        // console.table({ email, code, newPassword });
        const hashedPassword = await hashPassword(newPassword);

        const user = User.findOneAndUpdate(
            {
                email,
                passwordResetCode: code,
            },
            {
                password: hashedPassword,
                passwordResetCode: "",
            }
        ).exec();
        res.json({ ok: true });
    } catch (err) {
        console.log(err);
        return res.status(400).send("Error! Try again.");
    }
};
