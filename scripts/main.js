// Smooth scroll polyfill for older browsers
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Fade in elements as they scroll into view
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target); // Stop observing once animation is triggered
        }
    });
}, observerOptions);

// Observe all news cards, fight cards, and table rows
document.querySelectorAll('.news-card, .fight-card, .rankings-table tr').forEach(el => {
    el.classList.add('fade-out'); // Initial state
    observer.observe(el);
});

// Progress bar for scroll position
const progressBar = document.createElement('div');
progressBar.className = 'scroll-progress';
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (window.scrollY / windowHeight) * 100;
    progressBar.style.width = `${scrolled}%`;
});

// Dynamic navbar background
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('navbar-scrolled');
    } else {
        navbar.classList.remove('navbar-scrolled');
    }
});

// "Back to top" button with smooth animation
const backToTopButton = document.createElement('button');
backToTopButton.className = 'back-to-top';
backToTopButton.innerHTML = '↑';
document.body.appendChild(backToTopButton);

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTopButton.classList.add('visible');
    } else {
        backToTopButton.classList.remove('visible');
    }
});

backToTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Read More button hover effect
document.querySelectorAll('.read-more').forEach(button => {
    button.addEventListener('mousemove', (e) => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        button.style.setProperty('--mouse-x', `${x}px`);
        button.style.setProperty('--mouse-y', `${y}px`);
    });
});

// Fight countdown timers
document.querySelectorAll('.fight-card').forEach(card => {
    // Find the date text by looking for the Date: label
    const dateElement = Array.from(card.querySelectorAll('p')).find(p => 
        p.textContent.includes('Date:')
    );
    
    if (dateElement) {
        const dateText = dateElement.textContent;
        const datePart = dateText.split('Date:')[1].trim();
        const fightDate = new Date(datePart);
        
        // Create countdown element
        const countdownDiv = document.createElement('div');
        countdownDiv.className = 'countdown';
        card.appendChild(countdownDiv);
        
        const updateCountdown = () => {
            const now = new Date();
            const difference = fightDate - now;
            
            if (difference > 0) {
                const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
                
                countdownDiv.textContent = `${days}d ${hours}h ${minutes}m until fight`;
                countdownDiv.style.color = '#000';  // Regular color for future fights
            } else if (difference > -24 * 60 * 60 * 1000) {
                countdownDiv.textContent = 'Fight day!';
                countdownDiv.style.color = '#ff0000';  // Red color for fight day
            } else {
                countdownDiv.textContent = 'Fight completed';
                countdownDiv.style.color = '#666';  // Grey color for past fights
            }
        };
        
        // Initial update
        updateCountdown();
        
        // Update every minute
        setInterval(updateCountdown, 60000);
    }
});