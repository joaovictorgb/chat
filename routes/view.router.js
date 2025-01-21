import express from 'express';
const router = express.Router();

// Fake users data
const users = [
    { name: "Alice Smith", online: false, messages: 0 },
    { name: "Bob Johnson", online: true, messages: 1 },
    { name: "Emma Wilson", online: true, messages: 5 },
    { name: "Michael Brown", online: false, messages: 2 }
];

// Fake messages data
const messages = [
    { user: "John Doe", time: "14:30", content: "Hey, how are you?", sent: false },
    { user: "You", time: "14:31", content: "I'm doing great, thanks! How about you?", sent: true },
    { user: "John Doe", time: "14:32", content: "Pretty good! Working on that new project.", sent: false },
    { user: "You", time: "14:33", content: "That's awesome! Need any help with it?", sent: true }
];

// Main route
router.get('/', (req, res) => {
    res.render('index', {
        users: users,
        messages: messages
    });
});

// Search route (optional - for server-side filtering)
router.get('/search', (req, res) => {
    const searchTerm = req.query.term.toLowerCase();
    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm)
    );
    res.json(filteredUsers);
});
router.post('/send-message', (req, res) => {
    const {user, content}= req.body;

    //criar uma nova mensagem
    const newMessage= {user,time,content,sent:true};
    messages.push(newMessage);
    res.json(newMessage);
});

export default router;
