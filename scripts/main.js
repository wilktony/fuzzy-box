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

const canvas = document.createElement('canvas');
const topSection = document.getElementById('top');
topSection.appendChild(canvas);
const ctx = canvas.getContext('2d');
canvas.width = topSection.clientWidth;
canvas.height = Math.min(topSection.clientHeight,50);
// console.log(topSection.clientHeight);

const gloveImage = new Image();
gloveImage.src = './images/derek_chisora_vs_otto_wallin.jpg'; // Replace with actual image URL

const gloveImageTwo = new Image();
gloveImageTwo.src = './images/boxing-glove.jpg'; // Replace with actual image URL

let gloves = [];

class Glove {
    constructor(x, y, dx, dy, size, image) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.size = size;
        this.image = image; // assign image dynamically
    }
    update() {
        this.x += this.dx;
        this.y += this.dy;

        // Bounce off walls
        if (this.x + this.size > canvas.width || this.x < 0) this.dx = -this.dx;
        if (this.y + this.size > canvas.height || this.y < 0) this.dy = -this.dy;
    }

    draw() {
        ctx.drawImage(this.image, this.x, this.y, this.size, this.size);
    }
}

// Check for collision and handle bouncing
function resolveCollisions() {
    for (let i = 0; i < gloves.length; i++) {
        for (let j = i + 1; j < gloves.length; j++) {
            let g1 = gloves[i];
            let g2 = gloves[j];

            let dx = g2.x - g1.x;
            let dy = g2.y - g1.y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < (g1.size / 2 + g2.size / 2)) {
                // Swap velocities for simple elastic collision
                [g1.dx, g2.dx] = [g2.dx, g1.dx];
                [g1.dy, g2.dy] = [g2.dy, g1.dy];

                // Push apart to avoid overlap
                let overlap = (g1.size / 2 + g2.size / 2) - distance;
                let angle = Math.atan2(dy, dx);
                let moveX = Math.cos(angle) * overlap / 2;
                let moveY = Math.sin(angle) * overlap / 2;

                g1.x -= moveX;
                g1.y -= moveY;
                g2.x += moveX;
                g2.y += moveY;
            }
        }
    }
}

function init() {
    gloves = [];
    for (let i = 0; i < 10; i++) {
        // let size = Math.random() * 30 + 30;
        let size = 30;
        let x = Math.random() * (canvas.width - size);
        let y = Math.random() * (canvas.height - size);
        let dx = (Math.random() - 0.5) * 3;
        let dy = (Math.random() - 0.5) * 2;

        // Randomly assign an image
        let image = Math.random() < 0.5 ? gloveImage : gloveImageTwo;

        gloves.push(new Glove(x, y, dx, dy, size, image));
    }
}

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    gloves.forEach(glove => glove.update());
    resolveCollisions();
    gloves.forEach(glove => glove.draw());
}

gloveImage.onload = gloveImageTwo.onload = () => {
    init();
    animate();
};

window.addEventListener('resize', () => {
    canvas.width = topSection.clientWidth;
    canvas.height = topSection.clientHeight;
    init();
});
