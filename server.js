const express = require('express');
const app = express();
const PORT = 8000;

app.set('view engine', 'ejs');
app.use(express.static("public"));

app.get('/', (request, response) => {
    response.render('index');
})

app.get('/aboutme', (request, response) => {
    const myTitle = "About"
    const myIntro = "Hi, I'm PumaBytes, the new cat in tech town";
    const myText = [
       "My journey into tech started with the rigid theory of C/C++ and Java in university.",
       "Back then, programming felt less like a creative outlet and more like an academic obligation.",
       "After graduating, I chose to reset my perspective.",
       "I stripped away the coursework and dove into Python and JavaScript on my own terms. ",
       "That's when everything clicked.",
       "JavaScript instantly became my primary language—it's fast, flexible, and perfectly suited for the types of architectures I love to build.",
       "I build with vanilla HTML, CSS, JavaScript, and Node.js (Express).",
       "While the industry rushes to adopt heavy, bloated frameworks, I choose to master the core fundamentals first.",
       "I write lightweight, efficient code because I care about understanding exactly how software works under the hood.",
       "For me, tools like AI aren't a threat or a shortcut—they are a force multiplier for rapid learning, experimentation, and debugging. ",
       "I thrive on breaking things, fixing them, and building fast.",
       "When I’m away from the keyboard, I’m usually hanging out with my two cats, gaming, reading, or sketching."];

    response.render('aboutme', { myTitle, myIntro, myText });
})

app.get('/blog', (request, response) => {
    response.render('blog');
})

app.get('/contact', (request, response) => {
    response.render('contact');
})

app.listen(PORT, () => {
    console.log(`localhost:${PORT}`);
})