import './style.css';
import { initScene } from './three/scene.js';
import emailjs from '@emailjs/browser';

// Initialize EmailJS (REPLACE these with your actual keys)
emailjs.init("GuT4zY4jrackV4AHK");

// Initialize 3D Scene
initScene();

// Typing Effect
const textToType = ["Cybersecurity Student", "DFIR Analyst", "Blue Team Operator"];
const typingElement = document.getElementById('typing-text');
let typeIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
  const currentText = textToType[typeIndex];

  if (isDeleting) {
    typingElement.textContent = currentText.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typingElement.textContent = currentText.substring(0, charIndex + 1);
    charIndex++;
  }

  let typeSpeed = isDeleting ? 50 : 100;

  if (!isDeleting && charIndex === currentText.length) {
    isDeleting = true;
    typeSpeed = 2000; // Pause at end
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    typeIndex = (typeIndex + 1) % textToType.length;
    typeSpeed = 500; // Pause before new word
  }

  setTimeout(typeEffect, typeSpeed);
}

// Start typing effect on load
document.addEventListener('DOMContentLoaded', () => {
  if (typingElement) typeEffect();
  initTilt();
  initContactForm();
  initScrollReveal();
  initCursorDot();
  initSpotlightCards();
  initScrollSpy();
});

// Spotlight Card Effect (Mouse Tracking)
function initSpotlightCards() {
  const cards = document.querySelectorAll('.glass-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

// ScrollSpy (Active Navigation Highlight)
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Remove active from all
        navLinks.forEach(link => link.classList.remove('active'));

        // Add active to matching link
        const id = entry.target.getAttribute('id');
        const activeLink = document.querySelector(`.nav-links a[href="#${id}"]`);
        if (activeLink) {
          activeLink.classList.add('active');
        }
      }
    });
  }, {
    threshold: 0.3, // Trigger when 30% of section is visible
    rootMargin: '-100px 0px -50% 0px' // Account for fixed nav
  });

  sections.forEach(section => observer.observe(section));
}



// Trailing Cursor Dot Logic
function initCursorDot() {
  const cursorDot = document.createElement('div');
  cursorDot.classList.add('cursor-dot');
  document.body.appendChild(cursorDot);

  document.addEventListener('mousemove', (e) => {
    // Direct follow (CSS transition handles the 'trail' lag)
    cursorDot.style.left = `${e.clientX}px`;
    cursorDot.style.top = `${e.clientY}px`;
  });

  // Hover States
  const clickables = document.querySelectorAll('a, button, input, textarea, .project-card, .skill-category');
  clickables.forEach(el => {
    el.addEventListener('mouseenter', () => cursorDot.classList.add('hover-active'));
    el.addEventListener('mouseleave', () => cursorDot.classList.remove('hover-active'));
  });
}

// Scroll Reveal Animation (Intersection Observer)
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  const windowHeight = window.innerHeight;
  const elementVisible = 150; // trigger distance

  // Use Intersection Observer for better performance
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Optional: Stop observing once revealed
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15
  });

  reveals.forEach(element => {
    observer.observe(element);
  });
}

// 3D Tilt Effect for Project Cards
function initTilt() {
  const cards = document.querySelectorAll('.project-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Calculate rotation based on mouse position
      // Multiplier determines sensitivity (higher = more tilt)
      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;

      // Apply transform with perspective
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

      // Remove transition delay for immediate response during movement
      card.style.transition = 'transform 0.1s ease-out';
    });

    card.addEventListener('mouseleave', () => {
      // Reset position
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
      // Add smooth transition for reset
      card.style.transition = 'transform 0.5s ease-out';
    });
  });
}

// Secure Contact Form Handler
// Secure Contact Form Handler (EmailJS)
function initContactForm() {
  const form = document.getElementById('contact-form');
  const btn = form.querySelector('button[type="submit"]');
  const emailInput = document.getElementById('email');
  const originalBtnText = btn.innerText;

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Real-time email validation
  emailInput.addEventListener('input', () => {
    if (emailInput.value === '') {
      emailInput.classList.remove('valid', 'invalid');
    } else if (emailRegex.test(emailInput.value)) {
      emailInput.classList.remove('invalid');
      emailInput.classList.add('valid');
    } else {
      emailInput.classList.remove('valid');
      emailInput.classList.add('invalid');
    }
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Validate email before submission
      if (!emailRegex.test(emailInput.value)) {
        emailInput.classList.add('invalid');
        emailInput.focus();
        return; // Stop submission
      }

      // UI Feedback: Loading
      btn.innerText = 'Initializing Uplink...';
      btn.disabled = true;
      btn.style.opacity = '0.7';
      btn.style.cursor = 'not-allowed';

      // Send Email
      // Replace 'YOUR_SERVICE_ID' and 'YOUR_TEMPLATE_ID' with actual values
      const serviceID = 'service_wu4swma';
      const templateID = 'template_ygilfa1';

      emailjs.sendForm(serviceID, templateID, form)
        .then(() => {
          // UI Feedback: Success
          btn.innerText = 'Transmission Sent';
          btn.style.background = '#27c93f'; // Green
          btn.style.color = '#fff';
          form.reset();

          setTimeout(() => {
            btn.innerText = originalBtnText;
            btn.disabled = false;
            btn.style.opacity = '1';
            btn.style.cursor = 'pointer';
            btn.style.background = ''; // Revert to default
            btn.style.color = '';
          }, 3000);
        }, (err) => {
          // UI Feedback: Error
          btn.innerText = 'Transmission Failed';
          btn.style.background = '#ff5f56'; // Red
          console.error('EmailJS Error:', err);

          setTimeout(() => {
            btn.innerText = originalBtnText;
            btn.disabled = false;
            btn.style.opacity = '1';
            btn.style.cursor = 'pointer';
            btn.style.background = '';
          }, 3000);
        });
    });
  }
}

// Smooth Scroll for Anchors
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});
