// ==================== TUBES BACKGROUND SETUP ====================

class TubesBackground {
    constructor(canvasElement) {
        this.canvas = canvasElement;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true, alpha: true });
        
        this.camera.position.z = 50;
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x000000, 0.1);
        
        this.tubes = [];
        this.tubeCount = 3;
        this.colors = ["#f967fb", "#53bc28", "#6958d5"];
        this.lightColors = ["#83f36e", "#fe8a2e", "#ff008a", "#60aed5"];
        
        this.mouse = new THREE.Vector2();
        this.targetMouse = new THREE.Vector2();
        
        this.init();
        this.setupEventListeners();
        this.animate();
    }
    
    init() {
        // Create tubes
        for (let i = 0; i < this.tubeCount; i++) {
            const geometry = new THREE.TubeGeometry(this.createCurve(), 20, 2, 8, false);
            const material = new THREE.MeshPhongMaterial({
                color: this.colors[i],
                emissive: this.colors[i],
                emissiveIntensity: 0.5,
                wireframe: false
            });
            const mesh = new THREE.Mesh(geometry, material);
            this.scene.add(mesh);
            this.tubes.push({
                mesh: mesh,
                speed: 0.005 + i * 0.003,
                offset: i * 0.3,
                color: this.colors[i]
            });
        }
        
        // Add lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);
        
        this.lights = [];
        this.lightColors.forEach(color => {
            const light = new THREE.PointLight(color, 200);
            light.position.set(Math.random() * 100 - 50, Math.random() * 100 - 50, Math.random() * 50);
            this.scene.add(light);
            this.lights.push(light);
        });
    }
    
    createCurve() {
        const points = [];
        for (let i = 0; i < 100; i++) {
            const x = Math.sin(i * 0.1) * 20;
            const y = Math.cos(i * 0.05) * 15;
            const z = i * 0.5 - 25;
            points.push(new THREE.Vector3(x, y, z));
        }
        return new THREE.CatmullRomCurve3(points);
    }
    
    setupEventListeners() {
        window.addEventListener('mousemove', (e) => {
            this.targetMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            this.targetMouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        });
        
        window.addEventListener('click', () => {
            this.randomizeColors();
        });
        
        window.addEventListener('resize', () => {
            this.onWindowResize();
        });
    }
    
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    randomizeColors() {
        const newColors = this.generateRandomColors(this.tubeCount);
        const newLightColors = this.generateRandomColors(this.lightColors.length);
        
        this.tubes.forEach((tube, i) => {
            tube.color = newColors[i];
            tube.mesh.material.color.setStyle(newColors[i]);
            tube.mesh.material.emissive.setStyle(newColors[i]);
        });
        
        this.lights.forEach((light, i) => {
            light.color.setStyle(newLightColors[i]);
        });
    }
    
    generateRandomColors(count) {
        return new Array(count)
            .fill(0)
            .map(() => "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'));
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        // Smooth mouse movement
        this.mouse.lerp(this.targetMouse, 0.1);
        
        // Update tubes position and rotation
        this.tubes.forEach((tube, i) => {
            tube.mesh.rotation.x += tube.speed;
            tube.mesh.rotation.y += tube.speed * 0.5;
            tube.mesh.position.x = this.mouse.x * 30;
            tube.mesh.position.y = this.mouse.y * 30;
        });
        
        // Update light positions
        this.lights.forEach((light, i) => {
            light.position.x += Math.sin(Date.now() * 0.0001 + i) * 0.5;
            light.position.y += Math.cos(Date.now() * 0.0001 + i) * 0.5;
        });
        
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize Tubes Background
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('tubesCanvas');
    if (canvas) {
        new TubesBackground(canvas);
    }
});

// ==================== THEME TOGGLE ====================

const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Update icon
    themeToggle.innerHTML = newTheme === 'light' 
        ? '<i class="fas fa-sun"></i>' 
        : '<i class="fas fa-moon"></i>';
});

// Load saved theme
const savedTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', savedTheme);
themeToggle.innerHTML = savedTheme === 'light' 
    ? '<i class="fas fa-sun"></i>' 
    : '<i class="fas fa-moon"></i>';

// ==================== CATEGORY FILTERING ====================

const tabs = document.querySelectorAll('.tab');
const projectCards = document.querySelectorAll('.project-card');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // Update active tab
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        const category = tab.getAttribute('data-category');
        
        // Filter projects
        projectCards.forEach(card => {
            if (category === 'all' || card.getAttribute('data-category') === category) {
                card.style.display = 'block';
                card.style.animation = 'fadeIn 0.6s ease';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// ==================== MODAL MANAGEMENT ====================

const modal = document.getElementById('projectModal');
const modalClose = document.getElementById('modalClose');
const modalBody = document.getElementById('modalBody');

// Close modal
modalClose.addEventListener('click', () => {
    modal.classList.remove('active');
    // Clean up any intervals/animations
    const iframe = modalBody.querySelector('iframe');
    if (iframe) {
        iframe.remove();
    }
});

// Close on outside click
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('active');
    }
});

// Close on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        modal.classList.remove('active');
    }
});

// Open Project Modal
projectCards.forEach(card => {
    const playButton = card.querySelector('.btn-play');
    
    playButton.addEventListener('click', (e) => {
        e.stopPropagation();
        const projectName = card.getAttribute('data-project');
        openProject(projectName);
    });
    
    card.addEventListener('click', () => {
        const projectName = card.getAttribute('data-project');
        openProject(projectName);
    });
});

function openProject(projectName) {
    modal.classList.add('active');
    loadProjectContent(projectName);
}

function loadProjectContent(projectName) {
    // This will be populated by projects.js
    const projectContent = getProjectHTML(projectName);
    modalBody.innerHTML = projectContent;
    
    // Initialize project-specific JavaScript
    initializeProject(projectName);
}

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Add entrance animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease';
        }
    });
}, observerOptions);

projectCards.forEach(card => observer.observe(card));
