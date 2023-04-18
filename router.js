const express = require('express');
const User = require('./models/User');
const uri = 'mongodb+srv://adamabouljoud:Adamadam2001@clusterstrategintestada.8szxmll.mongodb.net/?retryWrites=true&w=majority';
const mongoose = require('mongoose');

const app = express();

// Connect to MongoDB database
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB database'))
    .catch((error) => console.error('Error connecting to MongoDB database:', error));

// Middleware to parse incoming request bodies
app.use(express.json());

// Register endpoint
app.post('/register', async (req, res) => {
    const { email, password } = req.body;
    try {
        // Check if the email already exists in the database
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).send('Email already exists');
        }

        // Create a new user
        const newUser = new User({ email, password });
        await newUser.save();
        return res.send('Registration successful');
    } catch (error) {
        return res.status(500).send(error.message);
    }
});

// Start the server
app.listen(3000, () => console.log('Server started on port 3000'));
