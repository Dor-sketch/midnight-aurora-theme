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
let quickLinks = JSON.parse(localStorage.getItem('quickLinks')) || [
    {name: 'Gmail', url: 'https://mail.google.com'},
    {name: 'YouTube', url: 'https://www.youtube.com'},
    {name: 'GitHub', url: 'https://github.com'},
    {name: 'Reddit', url: 'https://www.reddit.com'},
    {name: 'Twitter', url: 'https://twitter.com'},
    {name: 'LinkedIn', url: 'https://www.linkedin.com'}
];

function getFaviconUrl(url) {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
}

function renderQuickLinks() {
    const quickLinksContainer = document.getElementById('quicklinks');
    quickLinksContainer.innerHTML = '';
    quickLinks.forEach((link, index) => {
        const a = document.createElement('a');
        a.href = link.url;
        a.className = 'quicklink';
        a.draggable = true;
        a.setAttribute('data-index', index);

        const img = document.createElement('img');
        img.src = getFaviconUrl(link.url);
        img.alt = '';
        a.appendChild(img);

        const span = document.createElement('span');
        span.textContent = link.name;
        a.appendChild(span);

        const removeButton = document.createElement('button');
        removeButton.textContent = 'x';
        removeButton.className = 'remove-link';
        removeButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            removeQuickLink(index);
        });

        a.appendChild(removeButton);
        quickLinksContainer.appendChild(a);

        // Drag and drop events
        a.addEventListener('dragstart', dragStart);
        a.addEventListener('dragover', dragOver);
        a.addEventListener('dragenter', dragEnter);
        a.addEventListener('dragleave', dragLeave);
        a.addEventListener('drop', drop);
        a.addEventListener('dragend', dragEnd);
    });
}

function addQuickLink(name, url) {
    quickLinks.push({name, url});
    saveQuickLinks();
    renderQuickLinks();
}

function removeQuickLink(index) {
    quickLinks.splice(index, 1);
    saveQuickLinks();
    renderQuickLinks();
}

function saveQuickLinks() {
    localStorage.setItem('quickLinks', JSON.stringify(quickLinks));
}

document.getElementById('add-link-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('link-name').value;
    const url = document.getElementById('link-url').value;
    addQuickLink(name, url);
    this.reset();
});

// Edit mode
const editButton = document.getElementById('edit-button');
const quickLinksContainer = document.getElementById('quicklinks-container');

editButton.addEventListener('click', function() {
    quickLinksContainer.classList.toggle('edit-mode');
    this.innerHTML = quickLinksContainer.classList.contains('edit-mode')
        ? '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg>'
        : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>';
});

// Drag and Drop functionality
let draggedItem = null;

function dragStart(e) {
    draggedItem = this;
    setTimeout(() => this.classList.add('dragging'), 0);
}

function dragOver(e) {
    e.preventDefault();
}

function dragEnter(e) {
    e.preventDefault();
    this.classList.add('drag-over');
}

function dragLeave() {
    this.classList.remove('drag-over');
}

function drop() {
    this.classList.remove('drag-over');
    if (this !== draggedItem) {
        const allItems = [...document.querySelectorAll('.quicklink')];
        const fromIndex = parseInt(draggedItem.getAttribute('data-index'));
        const toIndex = parseInt(this.getAttribute('data-index'));

        const movedItem = quickLinks.splice(fromIndex, 1)[0];
        quickLinks.splice(toIndex, 0, movedItem);

        saveQuickLinks();
        renderQuickLinks();
    }
}

function dragEnd() {
    this.classList.remove('dragging');
    draggedItem = null;
}

renderQuickLinks();