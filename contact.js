// Contact form functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeContactForm();
    initializeFAQ();
    initializeStarRatings();
});

function initializeContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    // Show/hide feedback sections based on checkbox selection
    const checkboxes = form.querySelectorAll('input[name="feedbackType"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateFormSections);
    });

    // Form submission
    form.addEventListener('submit', handleFormSubmit);
}

function updateFormSections() {
    const productFeedback = document.getElementById('productFeedback');
    const websiteFeedback = document.getElementById('websiteFeedback');
    
    const productChecked = document.querySelector('input[value="products"]').checked;
    const websiteChecked = document.querySelector('input[value="website"]').checked;
    
    if (productChecked) {
        productFeedback.classList.remove('hidden');
    } else {
        productFeedback.classList.add('hidden');
    }
    
    if (websiteChecked) {
        websiteFeedback.classList.remove('hidden');
    } else {
        websiteFeedback.classList.add('hidden');
    }
}

function initializeStarRatings() {
    const starRatings = document.querySelectorAll('.star-rating');
    
    starRatings.forEach(rating => {
        const stars = rating.querySelectorAll('i');
        let currentRating = 0;
        
        stars.forEach((star, index) => {
            star.addEventListener('click', () => {
                currentRating = index + 1;
                updateStars(stars, currentRating);
                
                // Update hidden input
                const hiddenInput = rating.querySelector('input[type="hidden"]');
                if (hiddenInput) {
                    hiddenInput.value = currentRating;
                }
                
                // Update rating text
                const ratingText = rating.parentElement.querySelector('.rating-text');
                if (ratingText) {
                    ratingText.textContent = getRatingText(currentRating);
                }
            });
            
            star.addEventListener('mouseenter', () => {
                updateStars(stars, index + 1);
            });
        });
        
        rating.addEventListener('mouseleave', () => {
            updateStars(stars, currentRating);
        });
    });
}

function updateStars(stars, rating) {
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.remove('far');
            star.classList.add('fas', 'active');
        } else {
            star.classList.remove('fas', 'active');
            star.classList.add('far');
        }
    });
}

function getRatingText(rating) {
    const texts = {
        1: 'Poor',
        2: 'Fair',
        3: 'Good',
        4: 'Very Good',
        5: 'Excellent'
    };
    return texts[rating] || 'Click to rate';
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    
    // Validate form
    if (!validateForm(form)) {
        return;
    }
    
    // Show loading state
    const submitBtn = form.querySelector('.btn-submit');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        // Hide form and show success message
        form.style.display = 'none';
        document.getElementById('successMessage').style.display = 'block';
        
        // Log form data (in real implementation, send to server)
        console.log('Form Data:', Object.fromEntries(formData));
        
        // Show notification
        showNotification('Feedback sent successfully!');
        
    }, 2000);
}

function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.style.borderColor = '#ff4757';
            isValid = false;
        } else {
            field.style.borderColor = '#ddd';
        }
    });
    
    // Check email format
    const email = form.querySelector('#email');
    if (email.value && !isValidEmail(email.value)) {
        email.style.borderColor = '#ff4757';
        isValid = false;
    }
    
    // Check if at least one feedback type is selected
    const feedbackTypes = form.querySelectorAll('input[name="feedbackType"]:checked');
    if (feedbackTypes.length === 0) {
        alert('Please select at least one feedback category.');
        isValid = false;
    }
    
    return isValid;
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function resetForm() {
    const form = document.getElementById('contactForm');
    const successMessage = document.getElementById('successMessage');
    
    form.reset();
    form.style.display = 'block';
    successMessage.style.display = 'none';
    
    // Reset hidden sections
    document.getElementById('productFeedback').classList.add('hidden');
    document.getElementById('websiteFeedback').classList.add('hidden');
    
    // Reset star ratings
    document.querySelectorAll('.star-rating').forEach(rating => {
        const stars = rating.querySelectorAll('i');
        updateStars(stars, 0);
        const ratingText = rating.parentElement.querySelector('.rating-text');
        if (ratingText) {
            ratingText.textContent = 'Click to rate';
        }
    });
}

function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Close other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Add notification styles
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .notification {
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--secondary-color);
        color: white;
        padding: 1rem 2rem;
        border-radius: 5px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 4000;
        animation: slideIn 0.3s ease;
    }
    
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
`;
document.head.appendChild(notificationStyles);
