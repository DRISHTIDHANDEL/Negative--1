//question answer submission form



const form = document.getElementById('questionForm');
if (form) {
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const title = document.getElementById('questionTitle').value.trim();
    const body = document.getElementById('questionBody').value.trim();
    const tags = document.getElementById('questionTags').value
      .split(',')
      .map(tag => tag.trim().toLowerCase());

    if (!title || !body || tags.length === 0 || tags[0] === "") {
      alert("Please fill in all fields and include at least one tag.");
      return;
    }

    if (title.length > 100) {
      alert("Question title must be 100 characters or less.");
      return;
    }

    const question = { title, body, tags };
    console.log("Submitted question:", question);
    alert("Your question has been submitted!");

    form.reset();
    window.location.href = "index.html"; // redirect to home after submit
  });
}




function setupSubjectNav() {
    // 1. Select the necessary elements from the DOM.
    const navItems = document.querySelectorAll('.nav-item');
    const navContainer = document.querySelector('.subject-nav');
    const leftArrow = document.querySelector('.nav-arrow:first-child');
    const rightArrow = document.querySelector('.nav-arrow:last-child');

    // 2. Add event listeners for the "active" state of a subject.
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove the 'active' class from the currently active item
            const currentActive = document.querySelector('.nav-item.active');
            if (currentActive) {
                currentActive.classList.remove('active');
            }

            // Add the 'active' class to the clicked item
            item.classList.add('active');
        });
    });

    // 3. Add event listeners for horizontal scrolling with the arrows.
    // Scroll a fixed amount (e.g., 100 pixels) on each click.
    const scrollAmount = 100;

    leftArrow.addEventListener('click', () => {
        navContainer.scrollLeft -= scrollAmount;
    });

    rightArrow.addEventListener('click', () => {
        navContainer.scrollLeft += scrollAmount;
    });

    // Optional: Add an event listener to the container itself to hide/show
    // arrows based on scroll position.
    navContainer.addEventListener('scroll', () => {
        // Hide left arrow if at the start
        if (navContainer.scrollLeft === 0) {
            leftArrow.style.opacity = '0.5';
            leftArrow.style.cursor = 'not-allowed';
        } else {
            leftArrow.style.opacity = '1';
            leftArrow.style.cursor = 'pointer';
        }

        // Hide right arrow if at the end
        if (navContainer.scrollLeft + navContainer.clientWidth >= navContainer.scrollWidth - 1) {
            rightArrow.style.opacity = '0.5';
            rightArrow.style.cursor = 'not-allowed';
        } else {
            rightArrow.style.opacity = '1';
            rightArrow.style.cursor = 'pointer';
        }
    });
}

// Call the function to set up the navigation bar when the DOM is ready.
document.addEventListener('DOMContentLoaded', setupSubjectNav);
// A function to simulate fetching data from a server.
// In a real project, this would be an actual API call using the fetch() API.
           
// Get the main voting container





// --- Start of Your Original Code (modified) ---

// A function to simulate fetching data from a server.
const fetchQuestions = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const newQuestions = [
                {
                    id: 1,
                    title: "What is the difference between JavaScript and TypeScript?",
                    answers: 5,
                    votes: 12 // Added a votes property
                },
                {
                    id: 2,
                    title: "How do you handle state in a React application?",
                    answers: 12,
                    votes: 7 // Added a votes property
                },
                {
                    id: 3,
                    title: "Best practices for writing clean CSS code?",
                    answers: 8,
                    votes: -3 // Added a votes property
                },
            ];
            resolve(newQuestions);
        }, 1000);
    });
};

// A function to render the questions on the page
const renderQuestions = (questions) => {
    const container = document.getElementById("questions-container");
    questions.forEach(question => {
        const questionCard = document.createElement("div");
        questionCard.classList.add("question-card");
        
        // This is the key change: we're building the complete card including the vote system
        questionCard.innerHTML = `
            <h2>${question.title}</h2>
            <p>${question.answers} answers</p>
            <div class="vote-container" data-item-id="${question.id}">
                <button class="vote-button upvote-button">
                    <i class="fa-solid fa-arrow-up"></i>
                </button>
                <span class="vote-count">${question.votes}</span>
                <button class="vote-button downvote-button">
                    <i class="fa-solid fa-arrow-down"></i>
                </button>
            </div>
        `;
        container.appendChild(questionCard);
    });
};

// --- End of Your Original Code ---

// --- Your Vote System Logic (Integrated) ---
// This part uses event delegation, so it automatically works for all new elements.
const mainContainer = document.body;

mainContainer.addEventListener('click', async (event) => {
    const button = event.target.closest('.vote-button');
    if (!button) {
        return;
    }

    const isUpvote = button.classList.contains('upvote-button');
    const voteType = isUpvote ? 'upvote' : 'downvote';

    const voteContainer = button.closest('.vote-container');
    const itemId = voteContainer.dataset.itemId;

    if (!itemId) {
        console.error('Item ID not found for voting on container:', voteContainer);
        return;
    }

    const voteCountElement = voteContainer.querySelector('.vote-count');
    const originalCount = parseInt(voteCountElement.textContent, 10);
    
    if (isNaN(originalCount)) {
        console.error('Original vote count is not a number:', voteCountElement.textContent);
        return;
    }

    voteCountElement.textContent = isUpvote ? originalCount + 1 : originalCount - 1;
    voteCountElement.style.color = 'gray';

    try {
        const response = await fetch('/api/vote', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                itemId: itemId,
                voteType: voteType,
            }),
        });

        if (response.ok) {
            const result = await response.json();
            
            if (result && typeof result.newVoteCount === 'number') {
                voteCountElement.textContent = result.newVoteCount;
                voteCountElement.style.color = '';
            } else {
                console.error('Server response did not contain a valid newVoteCount:', result);
                voteCountElement.textContent = originalCount;
                voteCountElement.style.color = 'red';
            }
        } else {
            voteCountElement.textContent = originalCount;
            voteCountElement.style.color = 'red';
            const errorText = await response.text();
            console.error(`Vote failed with status ${response.status}:`, errorText);
        }
    } catch (error) {
        voteCountElement.textContent = originalCount;
        voteCountElement.style.color = 'red';
        console.error('Network error during vote:', error);
    }
});

// --- Your Original Event Listeners ---
document.getElementById("loadMoreBtn").addEventListener("click", () => {
    const loadingMessage = document.getElementById("loading");
    const loadMoreBtn = document.getElementById("loadMoreBtn");
    
    loadingMessage.style.display = "block";
    loadMoreBtn.disabled = true;

    fetchQuestions()
        .then(newQuestions => {
            renderQuestions(newQuestions);
        })
        .finally(() => {
            loadingMessage.style.display = "none";
            loadMoreBtn.disabled = false;
        });
});

document.addEventListener("DOMContentLoaded", () => {
    renderQuestions([
        { id: 0, title: "How do I get started with StackIt?", answers: 3, votes: 20 }
    ]);
});
 document.addEventListener('DOMContentLoaded', () => {
            const notificationIcon = document.getElementById('notification-icon');
            const notificationBadge = document.getElementById('notification-badge');
            const notificationDropdown = document.getElementById('notification-dropdown');
            
            let unreadCount = 0;
            let notifications = [];

            // Simulates fetching notifications from an API
            const fetchNotifications = async () => {
                // In a real app, this would be a network request
                await new Promise(resolve => setTimeout(resolve, 500)); 

                notifications = [
                    { id: 1, message: 'Someone answered your question "How to build a simple UI component..."', is_read: false },
                    { id: 2, message: 'Someone commented on your answer "Make sure to pass data..."', is_read: false },
                    { id: 3, message: 'Someone mentioned you in a comment.', is_read: false },
                    { id: 4, message: 'Your post received 10 upvotes.', is_read: true },
                ];
                
                unreadCount = notifications.filter(n => !n.is_read).length;
                updateUI();
            };

            const updateUI = () => {
                // Update the badge with the unread count
                if (unreadCount > 0) {
                    notificationBadge.style.display = 'flex';
                    notificationBadge.textContent = unreadCount;
                } else {
                    notificationBadge.style.display = 'none';
                }

                // Render the notifications in the dropdown
                notificationDropdown.innerHTML = '';
                if (notifications.length === 0) {
                    notificationDropdown.innerHTML = `<div class="no-notifications">No new notifications.</div>`;
                    return;
                }
                
                notifications.forEach(notification => {
                    const item = document.createElement('div');
                    item.classList.add('notification-item');
                    if (!notification.is_read) {
                        item.classList.add('unread');
                    }
                    item.textContent = notification.message;
                    notificationDropdown.appendChild(item);
                });
            };

            const markAsRead = () => {
                notifications = notifications.map(n => ({ ...n, is_read: true }));
                unreadCount = 0;
                updateUI();
            };

            // Event listener for the bell icon
            notificationIcon.addEventListener('click', () => {
                notificationDropdown.classList.toggle('active');
                if (notificationDropdown.classList.contains('active') && unreadCount > 0) {
                    markAsRead();
                }
            });

            // Close the dropdown when clicking outside
            document.addEventListener('click', (event) => {
                if (!notificationIcon.contains(event.target) && !notificationDropdown.contains(event.target)) {
                    notificationDropdown.classList.remove('active');
                }
            });
            
            // Initial fetch of notifications
            fetchNotifications();

            // Simulate a new notification arriving in real-time after 5 seconds
            setTimeout(() => {
                console.log("Simulating a new notification...");
                const newNotification = { id: 5, message: 'You have been mentioned in a new comment.', is_read: false };
                notifications.unshift(newNotification); // Add to the beginning of the array
                unreadCount++;
                updateUI();
            }, 5000);
        });
