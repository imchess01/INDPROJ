document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('.content-section');

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });

    sections.forEach(section => {
        observer.observe(section);
    });

    function createFloatingCircles(section) {
        for (let i = 0; i < 3; i++) {
            const circle = document.createElement('div');
            circle.classList.add('floating-circle');
            circle.style.left = `${Math.random() * 100}%`;
            circle.style.top = `${Math.random() * 100}%`;
            circle.style.animationDuration = `${Math.random() * 5 + 5}s`;
            section.querySelector('.floating-circles').appendChild(circle);
        }
    }

    sections.forEach(section => {
        createFloatingCircles(section);
    });

    function detectCollision(circle1, circle2) {
        const rect1 = circle1.getBoundingClientRect();
        const rect2 = circle2.getBoundingClientRect();

        return !(rect1.right < rect2.left || 
                 rect1.left > rect2.right || 
                 rect1.bottom < rect2.top || 
                 rect1.top > rect2.bottom);
    }

    function moveCircles() {
        const circles = document.querySelectorAll('.floating-circle');
        circles.forEach(circle => {
            let posX = parseFloat(circle.style.left); 
            let posY = parseFloat(circle.style.top);
            const speedX = (Math.random() - 0.5) * 2;
            const speedY = (Math.random() - 0.5) * 2;

            function animate() {
                posX += speedX;
                posY += speedY;

                if (posX <= 0 || posX >= window.innerWidth - circle.offsetWidth) {
                    posX = Math.max(0, Math.min(posX, window.innerWidth - circle.offsetWidth));
                }

                if (posY <= 0 || posY >= window.innerHeight - circle.offsetHeight) {
                    posY = Math.max(0, Math.min(posY, window.innerHeight - circle.offsetHeight));
                }

                circle.style.left = `${posX}px`;
                circle.style.top = `${posY}px`;

                circles.forEach(otherCircle => {
                    if (circle !== otherCircle && detectCollision(circle, otherCircle)) {
                        const tempSpeedX = speedX;
                        const tempSpeedY = speedY;
                        speedX = (Math.random() - 0.5) * 2;
                        speedY = (Math.random() - 0.5) * 2;
                        otherCircle.style.left = `${parseFloat(otherCircle.style.left) + tempSpeedX}px`;
                        otherCircle.style.top = `${parseFloat(otherCircle.style.top) + tempSpeedY}px`;
                    }
                });

                requestAnimationFrame(animate);
            }

            animate();
        });
    }

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion) {
        moveCircles();
    }
});