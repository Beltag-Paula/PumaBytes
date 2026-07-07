require('dotenv').config();

const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

const PORT = process.env.PORT || 8000;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const dataPath = path.join(__dirname, 'data.json');
const rawData = fs.readFileSync(dataPath, 'utf-8');
const data = JSON.parse(rawData);
const packageVersion = require('./package.json').version;

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SENDER_USER,
        pass: process.env.SENDER_PASS
    }
});

app.use(async (req, res, next) => {
    if (!req.ghData) {
        const githubResponse = await fetch('https://api.github.com/users/Beltag-Paula');
        req.ghData = await githubResponse.json();
        next();
    } else next();
});

app.get('/', (request, response) => {
    response.render('index', {
        myTitle: data.index.myTitle,
        projects: data.projects,
        navigation: data.navigation,
        packageVersion,
        realName: request.ghData.name
    });
});

app.get('/aboutme', async (request, response) => {
    const myTitle = data.about.myTitle;
    const myIntro = data.about.myIntro;
    const myText = data.about.myText;

    //console.log(ghData);

    response.render('aboutme', { myTitle, myIntro, myText, packageVersion, realName: request.ghData.name });
});

app.get('/blog', (request, response) => {
    response.render('blog', {
        myTitle: data.blog.myTitle, packageVersion, realName: request.ghData.name
    });
});


app.get('/contact', (request, response) => {
    response.render('contact', {
        myTitle: data.contact.myTitle, packageVersion, realName: request.ghData.name
    });
});

app.post('/contact', (request, response) => {
    const { name, email, phone, message } = request.body;
    const mailOptions = {
        from: process.env.SENDER_USER, // Must be your Gmail address
        to: process.env.EMAIL_USER,   // Where you want to receive it
        subject: `New Contact Form Submission from ${name}`,
        html: `
      <h3>New Message Details:</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log("Error sending email:", error);
            return response.status(500).send("Something went wrong.");
        }
        console.log('Email sent: ' + info.response);
        response.send('<h1>Message sent successfully!</h1><a href="/">Back</a>');
    });
});


app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});