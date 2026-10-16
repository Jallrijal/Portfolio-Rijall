// Main JavaScript
document.addEventListener('DOMContentLoaded', () => {
  // Registrasi Plugin GSAP
  if (typeof gsap !== 'undefined') {
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }
    if (typeof TextPlugin !== 'undefined') {
      gsap.registerPlugin(TextPlugin);
    }
    console.log('GSAP initialized successfully.');
  }
});
