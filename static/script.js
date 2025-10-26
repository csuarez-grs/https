//  const params = new URLSearchParams(window.location.search);
// const msg = params.get("msg") || "No message provided";
// document.getElementById("message").textContent = msg;

// Fetch and display posts
fetch('/posts')
  .then(response => response.json())
  .then(posts => {
    const postsContainer = document.getElementById('posts-container');
    posts.forEach(post => {
      const postDiv = document.createElement('div');
        postDiv.className = 'post';
      postDiv.innerHTML = `
        <h3>${post.title}</h3>
        <p>${post.content}</p>
      `;
      postsContainer.appendChild(postDiv);
    });
  })
  .catch(error => {
    console.error('Error fetching posts:', error);
  });

// Function to fetch a specific post by ID
function fetchPostById(postId) {    
    fetch(`/posts/${postId}`, {
        headers: {
            'X-Role': 'admin' // Example header for role-based access
        } 
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(post => {
        console.log('Fetched post:', post);
    })
    .catch(error => {
        console.error('Error fetching post by ID:', error);
    });
}