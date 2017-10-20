// SITE SETTINGS
var maintenanceMode = false;

const express = require('express');
const fs = require('fs');
const hbs = require('hbs');

const port = process.env.PORT || 3000;
var app = express();

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');

app.use((req, res, next) => {
    var now = new Date().toString();
    var log = `${now}: ${req.method} ${req.url}`;

    fs.appendFile('server.log', log + '\n', (err) => {
        if (err) console.log('Unable to append to server.log!');
    });

    console.log(log);
    next();
});

app.use((req, res, next) => {
    if (maintenanceMode) {
        res.render('maintenance.hbs');
    } else {
        next();
    }
});

app.use(express.static(__dirname + '/public'));

hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase();
});

app.get('/', (req, res) => {
    res.render('home.hbs', {
        tabTitle: 'Homepage',
        pageTitle: 'Home Page',
        welcomeMessage: 'Welcome to my site!'
    });
});

app.get('/about', (req, res) => {
    res.render('about.hbs', {
        pageTitle: 'About Page',
        mainMessage: 'Welcome to the about page!'
    });
});

app.get('/projects', (req, res) => {
    res.render('projects.hbs', {
        tabTitle: 'Projects'
    });
});

app.get('/bad', (req, res) => {
    res.send({
        error_message: 'Unable to handle this request.',
        status: 500
    });
});

app.listen(port, () => {
    console.log(`Express server is listening on port ${port}.`);
});
