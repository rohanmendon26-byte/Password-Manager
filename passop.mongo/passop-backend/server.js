// server.js
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// =========================
// MIDDLEWARE
// =========================
app.use(cors()); // Enable CORS for React frontend
app.use(bodyParser.json()); // Parse JSON bodies
app.use(express.json());

// =========================
// MONGODB CONFIGURATION
// =========================
const url = process.env.MONGO_URL || 'mongodb://localhost:27017';
const client = new MongoClient(url);
const dbName = 'passop';

let db;
let collection;

// =========================
// CONNECT TO DATABASE
// =========================
async function connectDB() {
    try {
        await client.connect();
        console.log('✅ Connected to MongoDB');
        
        db = client.db(dbName);
        collection = db.collection('passwords'); // Changed from 'documents' to 'passwords'
        
        return true;
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
}

// =========================
// ROUTES
// =========================

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

// GET - Get all passwords
app.get('/api/passwords', async (req, res) => {
    try {
        const passwords = await collection.find({}).toArray();
        res.json({ success: true, data: passwords });
    } catch (error) {
        console.error('Error fetching passwords:', error);
        res.status(500).json({ success: false, message: 'Error fetching passwords' });
    }
});

// GET - Get single password by ID
app.get('/api/passwords/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const password = await collection.findOne({ id: id });
        
        if (!password) {
            return res.status(404).json({ success: false, message: 'Password not found' });
        }
        
        res.json({ success: true, data: password });
    } catch (error) {
        console.error('Error fetching password:', error);
        res.status(500).json({ success: false, message: 'Error fetching password' });
    }
});

// POST - Add new password
app.post('/api/passwords', async (req, res) => {
    try {
        const { site, username, password, id } = req.body;
        
        // Validation
        if (!site || !username || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Site, username, and password are required' 
            });
        }
        
        const newPassword = {
            id: id,
            site: site.trim(),
            username: username.trim(),
            password: password,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        const result = await collection.insertOne(newPassword);
        
        res.status(201).json({ 
            success: true, 
            message: 'Password saved successfully',
            data: newPassword 
        });
    } catch (error) {
        console.error('Error saving password:', error);
        res.status(500).json({ success: false, message: 'Error saving password' });
    }
});

// PUT - Update password
app.put('/api/passwords/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { site, username, password } = req.body;
        
        // Validation
        if (!site || !username || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Site, username, and password are required' 
            });
        }
        
        const updatedPassword = {
            site: site.trim(),
            username: username.trim(),
            password: password,
            updatedAt: new Date()
        };
        
        const result = await collection.updateOne(
            { id: id },
            { $set: updatedPassword }
        );
        
        if (result.matchedCount === 0) {
            return res.status(404).json({ success: false, message: 'Password not found' });
        }
        
        res.json({ 
            success: true, 
            message: 'Password updated successfully',
            data: { id, ...updatedPassword }
        });
    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({ success: false, message: 'Error updating password' });
    }
});

// DELETE - Delete password
app.delete('/api/passwords/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const result = await collection.deleteOne({ id: id });
        
        if (result.deletedCount === 0) {
            return res.status(404).json({ success: false, message: 'Password not found' });
        }
        
        res.json({ 
            success: true, 
            message: 'Password deleted successfully' 
        });
    } catch (error) {
        console.error('Error deleting password:', error);
        res.status(500).json({ success: false, message: 'Error deleting password' });
    }
});

// =========================
// START SERVER
// =========================
async function startServer() {
    await connectDB();
    
    app.listen(port, () => {
        console.log(`🚀 Server is running on http://localhost:${port}`);
    });
}

// =========================
// GRACEFUL SHUTDOWN
// =========================
process.on('SIGINT', async () => {
    console.log('\n⏳ Shutting down gracefully...');
    await client.close();
    console.log('✅ MongoDB connection closed');
    process.exit(0);
});

// Start the server
startServer();