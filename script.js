document.addEventListener('DOMContentLoaded', () => {
    const articleForm = document.getElementById('articleForm');
    const imageInput = document.getElementById('image');
    const imagePreview = document.getElementById('imagePreview');
    const articlesDisplay = document.getElementById('articlesDisplay');
    const submittedArticles = []; // Array to hold submitted articles (in-memory)

    // Function to display image preview
    imageInput.addEventListener('change', () => {
        const file = imageInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                imagePreview.innerHTML = `<img src="${e.target.result}" class="img-fluid rounded" alt="Image Preview">`;
            };
            reader.readAsDataURL(file);
        } else {
            imagePreview.innerHTML = '';
        }
    });

    // Function to handle form submission
    articleForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent the default form submission

        const title = document.getElementById('title').value;
        const author = document.getElementById('author').value;
        const content = document.getElementById('content').value;
        const imageFile = imageInput.files[0];
        let imageUrl = null;

        if (imageFile) {
            // For this basic example, we'll just store a local URL if available
            // In a real application, you'd upload this to a server and get a URL
            imageUrl = URL.createObjectURL(imageFile);
        }

        const newArticle = {
            title: title,
            author: author,
            content: content,
            image: imageUrl
        };

        submittedArticles.push(newArticle);
        displayArticles();
        articleForm.reset(); // Clear the form
        imagePreview.innerHTML = ''; // Clear the image preview
    });

    // Function to display the submitted articles
    function displayArticles() {
        articlesDisplay.innerHTML = ''; // Clear previous content
        if (submittedArticles.length === 0) {
            articlesDisplay.innerHTML = '<p class="text-muted text-center">No articles submitted yet.</p>';
            return;
        }

        submittedArticles.forEach(article => {
            const articleDiv = document.createElement('div');
            articleDiv.classList.add('card', 'mb-3'); // Bootstrap card styling
            articleDiv.innerHTML = `
                <div class="card-body">
                    <h3 class="card-title text-dark">${article.title}</h3>
                    <h6 class="card-subtitle mb-2 text-muted">Author: ${article.author}</h6>
                    ${article.image ? `<img src="${article.image}" class="card-img-top mb-3 rounded" alt="Article Image">` : ''}
                    <p class="card-text">${article.content}</p>
                </div>
            `;
            articlesDisplay.appendChild(articleDiv);
        });
    }
});