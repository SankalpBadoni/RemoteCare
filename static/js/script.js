document.addEventListener('DOMContentLoaded', function() {
    // Sample data for medical centers
    const medicalCenters = [
        {
            id: 1,
            name: "HealthPlus Medical Center",
            image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            distance: 2.3,
            price: 120,
            rating: 4.8,
            tests: ["Blood Test", "COVID-19", "Diabetes"]
        },
        {
            id: 2,
            name: "MediCare Diagnostics",
            image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            distance: 5.7,
            price: 85,
            rating: 4.5,
            tests: ["X-Ray", "MRI", "Blood Test"]
        },
        {
            id: 3,
            name: "City Health Labs",
            image: "https://images.unsplash.com/photo-1504439468489-c8920d796a29?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            distance: 8.1,
            price: 95,
            rating: 4.3,
            tests: ["Blood Test", "Ultrasound", "ECG"]
        },
        {
            id: 4,
            name: "Metro Diagnostics",
            image: "https://images.unsplash.com/photo-1559757175-7cb5d85b1e1e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            distance: 3.5,
            price: 150,
            rating: 4.7,
            tests: ["CT Scan", "X-Ray", "Blood Test"]
        },
        {
            id: 5,
            name: "Wellness Pathology",
            image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            distance: 12.3,
            price: 75,
            rating: 4.2,
            tests: ["Blood Test", "Urine Analysis", "Hormone Test"]
        },
        {
            id: 6,
            name: "Prime Medical Services",
            image: "https://images.unsplash.com/photo-1584982751601-97dcc096659c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            distance: 6.9,
            price: 110,
            rating: 4.6,
            tests: ["MRI", "X-Ray", "Ultrasound"]
        }
    ];

    // Filter buttons
    const nearbyBtn = document.getElementById('nearby-btn');
    const priceBtn = document.getElementById('price-btn');
    
    // Centers container
    const centersContainer = document.getElementById('centers-container');
    
    // Search functionality
    const searchInput = document.querySelector('.search-box input');
    const searchBtn = document.querySelector('.search-btn');
    
    // Current filter state
    let currentFilter = 'nearby';
    
    // Function to display centers
    function displayCenters(centers) {
        centersContainer.innerHTML = '';
        
        if (centers.length === 0) {
            centersContainer.innerHTML = '<p class="no-results">No medical centers found matching your criteria.</p>';
            return;
        }
        
        centers.forEach((center, index) => {
            // Create center card with a delay for staggered animation
            setTimeout(() => {
                const card = document.createElement('div');
                card.className = 'center-card';
                card.style.animationDelay = `${index * 0.1}s`;
                
                const starsHTML = generateStars(center.rating);
                
                card.innerHTML = `
                    <div class="center-image">
                        <img src="${center.image}" alt="${center.name}">
                    </div>
                    <div class="center-details">
                        <h3 class="center-name">${center.name}</h3>
                        <div class="center-distance">
                            <i class="fas fa-location-dot"></i>
                            <span>${center.distance} km away</span>
                        </div>
                        <div class="center-price">
                            <i class="fas fa-dollar-sign"></i>
                            <span>Average test price: $${center.price}</span>
                        </div>
                        <div class="center-rating">
                            <div class="stars">
                                ${starsHTML}
                            </div>
                            <span>${center.rating}</span>
                        </div>
                        <button class="book-btn">Book Appointment</button>
                    </div>
                `;
                
                centersContainer.appendChild(card);
            }, index * 100);
        });
    }
    
    // Generate star rating HTML
    function generateStars(rating) {
        let stars = '';
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5;
        
        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fas fa-star"></i>';
        }
        
        if (halfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        }
        
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
        for (let i = 0; i < emptyStars; i++) {
            stars += '<i class="far fa-star"></i>';
        }
        
        return stars;
    }
    
    // Filter centers by proximity (within 10km)
    function filterByProximity() {
        return medicalCenters.filter(center => center.distance <= 10)
            .sort((a, b) => a.distance - b.distance);
    }
    
    // Filter centers by price
    function filterByPrice() {
        return [...medicalCenters].sort((a, b) => a.price - b.price);
    }
    
    // Search centers by name or tests
    function searchCenters(query) {
        if (!query) {
            return currentFilter === 'nearby' ? filterByProximity() : filterByPrice();
        }
        
        query = query.toLowerCase();
        return medicalCenters.filter(center => 
            center.name.toLowerCase().includes(query) || 
            center.tests.some(test => test.toLowerCase().includes(query))
        );
    }
    
    // Initial display - proximity filter
    displayCenters(filterByProximity());
    
    // Filter button event listeners
    nearbyBtn.addEventListener('click', function() {
        nearbyBtn.classList.add('active');
        priceBtn.classList.remove('active');
        currentFilter = 'nearby';
        displayCenters(filterByProximity());
    });
    
    priceBtn.addEventListener('click', function() {
        priceBtn.classList.add('active');
        nearbyBtn.classList.remove('active');
        currentFilter = 'price';
        displayCenters(filterByPrice());
    });
    
    // Search functionality
    searchBtn.addEventListener('click', function() {
        const query = searchInput.value.trim();
        displayCenters(searchCenters(query));
    });
    
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const query = searchInput.value.trim();
            displayCenters(searchCenters(query));
        }
    });
    
    // Add animated scroll to sections
    document.querySelector('.cta-btn').addEventListener('click', function() {
        document.querySelector('.search-section').scrollIntoView({ 
            behavior: 'smooth' 
        });
    });
    
    // Navigation links smooth scrolling
    const navLinks = document.querySelectorAll('.nav-links a, .footer-section ul a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Remove active class from all links
                navLinks.forEach(navLink => navLink.classList.remove('active'));
                
                // Add active class to clicked link (only for main nav)
                if (this.parentElement.parentElement.classList.contains('nav-links')) {
                    this.classList.add('active');
                }
                
                // Scroll to the target section
                targetElement.scrollIntoView({ 
                    behavior: 'smooth' 
                });
            }
        });
    });
    
    // Animate navbar on scroll
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.padding = '0.7rem 5%';
            navbar.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.padding = '1rem 5%';
            navbar.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)';
        }
        
        // Update active nav link based on scroll position
        const sections = document.querySelectorAll('section[id]');
        let scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                document.querySelector('.nav-links a[href="#' + sectionId + '"]').classList.add('active');
            } else {
                document.querySelector('.nav-links a[href="#' + sectionId + '"]').classList.remove('active');
            }
        });
    });
    
    // Book appointment button effect
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('book-btn')) {
            e.target.textContent = 'Appointment Booked!';
            e.target.style.backgroundColor = '#059669'; // Green-600
            setTimeout(() => {
                e.target.textContent = 'Book Appointment';
                e.target.style.backgroundColor = '';
            }, 2000);
        }
    });
    
    // Contact form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            // Simple validation
            if (!name || !email || !message) {
                alert('Please fill in all required fields.');
                return;
            }
            
            // Simulate form submission
            const submitBtn = document.querySelector('.submit-btn');
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Simulate API call delay
            setTimeout(() => {
                // Reset form
                contactForm.reset();
                
                // Show success message
                submitBtn.textContent = 'Message Sent!';
                submitBtn.style.backgroundColor = '#059669'; // Green-600
                
                setTimeout(() => {
                    submitBtn.textContent = 'Send Message';
                    submitBtn.style.backgroundColor = '';
                    submitBtn.disabled = false;
                }, 2000);
            }, 1500);
        });
    }
    
    // Add animation to navigation links
    const headerNavLinks = document.querySelectorAll('.nav-links a');
    headerNavLinks.forEach((link, index) => {
        link.style.animationDelay = `${index * 0.1}s`;
        link.style.animation = 'fadeIn 0.5s ease-in-out forwards';
    });
});