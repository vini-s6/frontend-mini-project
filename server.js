const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs'); // For file system operations

const app = express();
const port = 3000;

// Enable CORS for all origins (for development)
app.use(cors());

// Use body-parser middleware to parse JSON and URL-encoded request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// In-memory storage for articles (replace with a database in production)
const articles = [];

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, 'uploads');
        // Create the 'uploads' directory if it doesn't exist
        fs.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileExtension = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + fileExtension);
    }
});

const upload = multer({ storage: storage });

// Route to handle the submission of a new article (with image upload)
app.post('/api/articles', upload.single('image'), (req, res) => {
    const { title, author, content } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null; // Path to the uploaded image

    const newArticle = {
        id: Date.now(), // Simple way to generate a unique ID
        title,
        author,
        content,
        image: imagePath
    };

    articles.push(newArticle);
    console.log('New article submitted:', newArticle);
    res.status(201).json({ message: 'Article submitted successfully!', article: newArticle });
});

// Route to get all submitted articles
app.get('/api/articles', (req, res) => {
    res.json(articles);
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});