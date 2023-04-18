const express = require('express');
const app = express();
const mongoose = require('mongoose');
const User = require('./models/user');
const uri = 'mongodb+srv://adamabouljoud:Adamadam2001@clusterstrategintestada.8szxmll.mongodb.net/?retryWrites=true&w=majority';


// Database Connection
mongoose.connect(uri, { useNewUrlParser: true })
    .then(() => console.log('Successful connection'))
    .catch((error) => console.log('Error connecting to the database:', error));

// Creating a new User
const user1 = new User({
    email: 'johndoe@example.com',
    password: 'mypassword'
});

// Adding the user to the database
user1.save()
    .then(() => console.log('Successfully added the user to the database'))
    .catch((error) => console.log('Error adding the new user to the database:', error));

// Creating a new User
const user2 = new User({
    email: 'adamabouljoud@example.com',
    password: 'adampassword'
});

// Adding the user to the database
user2.save()
    .then(() => console.log('Successfully added the user to the database'))
    .catch((error) => console.log('Error adding the new user to the database:', error));

//print all users documents, and display on port 3000 using express
app.get('/users', (req, res) => {
    User.find()
        .then(users => {
            res.json(users);
        })
        .catch(error => {
            console.log(error);
            res.status(500).send('An error occurred');
        });
});

// Start the server
app.listen(3000, () => console.log('Server started on port 3000'));

