const express = require('express');
const User = require('./models/User');
const uri = 'mongodb+srv://adamabouljoud:Adamadam2001@clusterstrategintestada.8szxmll.mongodb.net/?retryWrites=true&w=majority';
const mongoose = require('mongoose');
const app = express();
const path = require('path');
const bodyParser = require("body-parser")

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'templates'));

// Connect to MongoDB database
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB database'))
    .catch((error) => console.error('Error connecting to MongoDB database:', error));


// /Register
app.get('/register', (req, res) => {
    res.render('register');
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
        return res.render('register',{message: 'Registration succesful'});
    } catch (error) {
        return res.render('register', { message: error.message });
    }
});

// Start the server
app.listen(3000, () => console.log('Server started on port 3000'));
