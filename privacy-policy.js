/**
 * GCU-SHOPS Privacy Policy Script
 * Brand: Game Corner Universe Limited
 * Fix: Removed scroll-hijacking bug, added Instant Policy Section Filter & Native Smooth UX
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // 1. Core Elements
    const progressBar = document.getElementById('scrollProgressBar');
    const header = document.getElementById('siteHeader');
    const backToTopBtn = document.getElementById('backToTopBtn');
    const printBtn = document.getElementById('printPageBtn');
    const mobileToggle = document.getElementById('mobileMenuToggle');
    const headerNav = document.getElementById('headerNav');
    const searchInput = document.getElementById('policySearchInput');
    const tocItems = document.querySelectorAll('.toc-item');
    const legalCards = document.querySelectorAll('.legal-doc-card');
    const faqTriggers = document.querySelectorAll('.faq-trigger');

    // 2. Reading Progress & Header Shadow (Clean native listener)
    window.addEventListener('scroll', () => {
        const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        
        if (height > 0 && progressBar) {
            const scrolled = (winScroll / height) * 100;
            progressBar.style.width = scrolled + '%';
        }

        // Header elevation shadow
        if (header) {
            if (winScroll > 20) {
                header.classList.add('has-scrolled');
            } else {
                header.classList.remove('has-scrolled');
            }
        }

        // Back to Top button visibility
        if (backToTopBtn) {
            if (winScroll > 350) {
                backToTopBtn.classList.add('is-visible');
            } else {
                backToTopBtn.classList.remove('is-visible');
            }
        }
    }, { passive: true });

    // 3. Back to Top Click
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // 4. Print Policy
    if (printBtn) {
        printBtn.addEventListener('click', () => {
            window.print();
        });
    }

    // 5. Mobile Navigation Toggle
    if (mobileToggle && headerNav) {
        mobileToggle.addEventListener('click', () => {
            const isOpen = headerNav.classList.toggle('menu-active');
            mobileToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });

        // Close menu on link selection
        headerNav.querySelectorAll('a').forEach(anchor => {
            anchor.addEventListener('click', () => {
                headerNav.classList.remove('menu-active');
                mobileToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // 6. Section Scroll Spy (Highlight TOC without freezing user scroll)
    const observerCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                tocItems.forEach(link => {
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('is-active');
                    } else {
                        link.classList.remove('is-active');
                    }
                });
            }
        });
    };

    const cardObserver = new IntersectionObserver(observerCallback, {
        root: null,
        rootMargin: '-70px 0px -65% 0px',
        threshold: 0
    });

    legalCards.forEach(card => cardObserver.observe(card));

    // 7. Instant Section Search / Filter in Table of Contents
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            tocItems.forEach(item => {
                const text = item.textContent.toLowerCase();
                if (text.includes(query)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }

    // 8. FAQ Accordion Toggle
    faqTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const row = trigger.closest('.faq-row');
            const answer = row.querySelector('.faq-answer-content');
            const isExpanded = trigger.getAttribute('aria-expanded') === 'true';

            // Close siblings
            document.querySelectorAll('.faq-row').forEach(otherRow => {
                if (otherRow !== row) {
                    otherRow.classList.remove('is-open');
                    const otherTrigger = otherRow.querySelector('.faq-trigger');
                    const otherAnswer = otherRow.querySelector('.faq-answer-content');
                    if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
                    if (otherAnswer) otherAnswer.style.maxHeight = null;
                }
            });

            // Toggle current
            if (isExpanded) {
                trigger.setAttribute('aria-expanded', 'false');
                row.classList.remove('is-open');
                answer.style.maxHeight = null;
            } else {
                trigger.setAttribute('aria-expanded', 'true');
                row.classList.add('is-open');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });
});