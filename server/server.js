import express from "express"
import cors from "cors"
import morgan from "morgan"
require('dotenv').config()
import fs from 'fs'
import connectDB from './config/db'
import csrf from "csurf";
import cookieParser from 'cookie-parser'
import color from 'colors'


connectDB()

const app = express()


const csrfProtection = csrf({ cookie: true });
app.use(cors())
app.use(cookieParser());
app.use(morgan('dev'))
app.use(express.json({ limit: '10mb' }))

//app.use(csrfProtection);

app.get("/api/csrf-token", (req, res) => {
    res.json({ csrfToken: req.csrfToken });
});




fs.readdirSync('./routes').map((r) => {
    app.use('/api/', require(`./routes/${r}`))
})



const PORT = process.env.PORT || 8000
app.listen(PORT, () => console.log(`server ready on ${PORT}`))