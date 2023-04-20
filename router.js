const express = require('express');
const User = require('./models/User');
const uri = 'mongodb+srv://adamabouljoud:Adamadam2001@clusterstrategintestada.8szxmll.mongodb.net/?retryWrites=true&w=majority';
const mongoose = require('mongoose');
const app = express();
const path = require('path');
const bodyParser = require("body-parser");
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'templates'));

// Connect to MongoDB database
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB database'))
    .catch((error) => console.error('Error connecting to MongoDB database:', error));


// Index
app.get('/', (req, res) => {
    res.clearCookie('auth-token');
    res.render('index');
})

// Register
app.get('/register', (req, res) => {
    res.clearCookie('auth-token');
    res.render('register', { message: '' });
});
app.post('/register', async (req, res) => {
    const { email, password } = req.body;
    try {
        // Check if the email already exists in the database
        const user = await User.findOne({email});
        if (user) {
            return res.render('register', { message: 'Email already exists' });
        }

        // Create a new user
        const newUser = new User({ email: email, password: password });
        await newUser.save()
            .then(() => console.log('Successfully added the user to the database'))
            .catch((error) => console.log('Error adding the new user to the database:', error));
        return res.render('register',{message: 'Registration successful'});
    } catch (error) {
        return res.render('register', { message: error.message });
    }
});



// Login
app.get('/login', (req, res) => {
    res.clearCookie('auth-token');
    res.render('login', {message: ''});
});
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the email exists in the database
        const user = await User.findOne({ email });
        if (!user || password !== user.password) {
            res.render('login', { message: 'Invalid email or password' });
        }else {
            // Create and sign a JWT token
            const token = jwt.sign({ _id: user._id }, 'secret');

            res.cookie('auth-token', token);
            res.redirect('/users');
        }


    } catch (error) {
        console.log(error);
        res.render('login', { message: error.message });

    }
});

const verifyToken = (req, res, next) => {
    const token = req.cookies['auth-token'];
    if (!token) return res.status(401).send('Access denied');

    try {
        const verified = jwt.verify(token, 'secret');
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).send('Invalid token');
    }
};

app.get('/users', verifyToken, async (req, res) => {
    try {
        const users = await User.find();
        res.render('users', { users });
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
});


// Start the server
app.listen(3000, () => console.log('Server started on port 3000'));
