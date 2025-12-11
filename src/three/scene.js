import * as THREE from 'three';

export function initScene() {
    const container = document.getElementById('canvas-container');

    if (!container) return;

    const scene = new THREE.Scene();
    // Fog for depth
    scene.fog = new THREE.FogExp2(0x050508, 0.002);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // cyber-core object (Icosahedron)
    // Increased radius from 2 to 3.5 for "immersive" feel
    const geometry = new THREE.IcosahedronGeometry(3.5, 1);
    const material = new THREE.MeshBasicMaterial({
        color: 0x00f3ff,
        wireframe: true,
        transparent: true,
        opacity: 0.4 // Reduced opacity to not block text
    });
    const core = new THREE.Mesh(geometry, material);
    scene.add(core);

    // Inner core
    // Increased radius from 1 to 2
    const innerGeo = new THREE.IcosahedronGeometry(2, 2);
    const innerMat = new THREE.MeshBasicMaterial({
        color: 0xaa00ff, // Brighter purple
        wireframe: true,
        transparent: true,
        opacity: 0.5 // Reduced opacity
    });
    const innerCore = new THREE.Mesh(innerGeo, innerMat);
    scene.add(innerCore);

    // Position Centered and Lower
    core.position.x = 0;
    innerCore.position.x = 0;
    core.position.y = -1.5;
    innerCore.position.y = -1.5;

    // Particles
    const particlesGeo = new THREE.BufferGeometry();
    const particlesCount = 700;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 15;
    }
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMat = new THREE.PointsMaterial({
        size: 0.015,
        color: 0x00f3ff,
        transparent: true,
        opacity: 0.8
    });
    const particlesMesh = new THREE.Points(particlesGeo, particlesMat);
    scene.add(particlesMesh);

    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX);
        mouseY = (event.clientY - windowHalfY);
    });

    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);

        const elapsedTime = clock.getElapsedTime();

        targetX = mouseX * 0.001;
        targetY = mouseY * 0.001;

        core.rotation.y += 0.5 * (targetX - core.rotation.y);
        core.rotation.x += 0.05 * (targetY - core.rotation.x);
        core.rotation.z += 0.002;

        innerCore.rotation.y += 0.5 * (targetX - innerCore.rotation.y);
        innerCore.rotation.x += 0.05 * (targetY - innerCore.rotation.x);
        innerCore.rotation.z -= 0.005; // Counter rotate

        particlesMesh.rotation.y = -mouseX * 0.0002;
        particlesMesh.rotation.x = -mouseY * 0.0002;

        renderer.render(scene, camera);
    }

    animate();

    // Handle Resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}
