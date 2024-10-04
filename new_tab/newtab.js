// Aurora animation
const canvas = document.getElementById('aurora');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Aurora {
    constructor() {
        this.layers = [];
        for (let i = 0; i < 3; i++) {
            this.layers.push({
                particles: [],
                speed: 0.5 + i * 0.5,
                hue: 120 + i * 60
            });
        }
        this.initParticles();
    }

    initParticles() {
        this.layers.forEach(layer => {
            for (let i = 0; i < 50; i++) {
                layer.particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    radius: Math.random() * 2 + 1,
                    speed: layer.speed
                });
            }
        });
    }

    draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        this.layers.forEach(layer => {
            ctx.beginPath();
            layer.particles.forEach(p => {
                ctx.moveTo(p.x, p.y);
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                p.y -= p.speed;
                if (p.y < 0) p.y = canvas.height;
            });
            ctx.closePath();
            ctx.fillStyle = `hsla(${layer.hue}, 100%, 50%, 0.3)`;
            ctx.fill();
        });
    }
}

const aurora = new Aurora();

function animate() {
    requestAnimationFrame(animate);
    aurora.draw();
}

animate();

// Clock and Date
function updateTime() {
    const now = new Date();
    document.getElementById('clock').textContent = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    document.getElementById('date').textContent = now.toLocaleDateString([], {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'});
}

setInterval(updateTime, 1000);
updateTime();

// Search
document.getElementById('search').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        const query = this.value;
        window.location.href = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    }
});

// Quick Links
const quickLinks = [
    {name: 'Gmail', url: 'https://mail.google.com'},
    {name: 'YouTube', url: 'https://www.youtube.com'},
    {name: 'GitHub', url: 'https://github.com'},
    {name: 'Reddit', url: 'https://www.reddit.com'},
    {name: 'Twitter', url: 'https://twitter.com'},
    {name: 'LinkedIn', url: 'https://www.linkedin.com'}
];

const quickLinksContainer = document.getElementById('quicklinks');
quickLinks.forEach(link => {
    const a = document.createElement('a');
    a.href = link.url;
    a.className = 'quicklink';
    a.textContent = link.name;
    quickLinksContainer.appendChild(a);
});