// MOBILE MENU TOGGLE (with ARIA support)
function toggleMenu() {
    const menu = document.getElementById('navbarMenu');
    const toggle = document.querySelector('.navbar-toggle');
    const isExpanded = menu.classList.contains('active');
    
    menu.classList.toggle('active');
    
    // ACCESSIBILITY: Update ARIA attribute
    if (toggle) {
        toggle.setAttribute('aria-expanded', !isExpanded);
    }
}


// DROPDOWN TOGGLE (with keyboard support)
document.addEventListener('DOMContentLoaded', function() {
    const dropdowns = document.querySelectorAll('.dropdown');

    dropdowns.forEach(function(dropdown) {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        const menu = dropdown.querySelector('.dropdown-menu');

        if (toggle && menu) {
            // Click handler
            toggle.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                toggleDropdownState();
            });

            // ACCESSIBILITY: Keyboard support (Enter, Space, Escape)
            toggle.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleDropdownState();
                }
                if (e.key === 'Escape') {
                    closeDropdown();
                }
            });

            function toggleDropdownState() {
                const isOpen = dropdown.classList.contains('active');
                
                // Close all other dropdowns
                dropdowns.forEach(function(otherDropdown) {
                    if (otherDropdown !== dropdown) {
                        otherDropdown.classList.remove('active');
                        const otherToggle = otherDropdown.querySelector('.dropdown-toggle');
                        if (otherToggle) {
                            otherToggle.setAttribute('aria-expanded', 'false');
                        }
                    }
                });

                // Toggle current dropdown
                dropdown.classList.toggle('active');
                toggle.setAttribute('aria-expanded', !isOpen);

                // ACCESSIBILITY: Focus first menu item when opening
                if (!isOpen) {
                    setTimeout(function() {
                        const firstLink = menu.querySelector('a');
                        if (firstLink) {
                            firstLink.focus();
                        }
                    }, 0);
                }
            }

            function closeDropdown() {
                dropdown.classList.remove('active');
                toggle.setAttribute('aria-expanded', 'false');
                toggle.focus(); // Return focus to toggle
            }
        }
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.dropdown')) {
            dropdowns.forEach(function(dropdown) {
                dropdown.classList.remove('active');
                const toggle = dropdown.querySelector('.dropdown-toggle');
                if (toggle) {
                    toggle.setAttribute('aria-expanded', 'false');
                }
            });
        }
    });
});


// ALERT AUTO-DISMISS (with accessibility)
document.addEventListener('DOMContentLoaded', function() {
    const alerts = document.querySelectorAll('.alert');
    
    alerts.forEach(function(alert) {
        // Skip alerts marked as static (never dismiss)
        if (alert.classList.contains('static-alert')) {
            return;
        }

        setTimeout(function() {
            // ACCESSIBILITY: Announce before removing
            // Give screen readers time to read the alert
            alert.setAttribute('aria-live', 'off');
            
            // Fade out animation
            alert.style.transition = 'opacity 0.5s ease';
            alert.style.opacity = '0';

            // Remove from DOM after fade out
            setTimeout(function() {
                alert.remove();
            }, 500);
        }, 5000); // 5 seconds
    });
});

// HOME PAGE WELCOME MESSAGE
document.addEventListener('DOMContentLoaded', function() {
    const welcomeMsg = document.getElementById('welcome-message');
    if (welcomeMsg) {
        // Check if the URL has login=1 parameter (redirected from login)
        const urlParams = new URLSearchParams(window.location.search);
        const isLoginRedirect = urlParams.get('login') === '1';

        if (isLoginRedirect) {
            // Show the message
            welcomeMsg.style.display = 'block';
            
            // ACCESSIBILITY: Announce to screen readers
            welcomeMsg.setAttribute('role', 'status');
            welcomeMsg.setAttribute('aria-live', 'polite');

            // Auto-dismiss after 5 seconds
            setTimeout(function() {
                // Turn off live region before removing
                welcomeMsg.setAttribute('aria-live', 'off');
                
                // Fade out animation
                welcomeMsg.style.transition = 'opacity 0.5s ease';
                welcomeMsg.style.opacity = '0';

                // Remove from DOM after fade out
                setTimeout(function() {
                    welcomeMsg.remove();
                }, 500);
            }, 5000); // 5 seconds
        }
    }
});


// CLAIMS FORM - Dynamic form based on claim type
document.addEventListener('DOMContentLoaded', function() {
    const claimRadio = document.querySelector('input[value="claim"]');
    const inquiryRadio = document.querySelector('input[value="inquiry"]');
    const descriptionLabel = document.getElementById('description-label');
    const descriptionHelp = document.getElementById('description-help');
    const descriptionTextarea = document.querySelector('#id_description');
    const additionalProofSection = document.getElementById('additional-proof-section');

    function updateForm() {
        if (claimRadio && claimRadio.checked) {
            // Claim mode - show proof fields
            if (descriptionLabel) {
                descriptionLabel.textContent = 'Item Description / Proof of Ownership';
            }
            if (descriptionHelp) {
                descriptionHelp.textContent = 'Describe the item in detail to prove ownership. Include color, brand, size, distinguishing features, where you lost it, etc.';
            }
            if (descriptionTextarea) {
                descriptionTextarea.placeholder = 'Describe the item in detail. Include color, brand, size, distinguishing features, where you lost it, etc.';
                // ACCESSIBILITY: Update aria-describedby
                descriptionTextarea.setAttribute('aria-describedby', 'description-help');
            }
            if (additionalProofSection) {
                additionalProofSection.style.display = 'block';
                // ACCESSIBILITY: Make fields accessible again
                const proofTextarea = additionalProofSection.querySelector('textarea');
                if (proofTextarea) {
                    proofTextarea.removeAttribute('aria-hidden');
                }
            }
        } else if (inquiryRadio && inquiryRadio.checked) {
            // Inquiry mode - hide proof fields
            if (descriptionLabel) {
                descriptionLabel.textContent = 'Your Question or Inquiry';
            }
            if (descriptionHelp) {
                descriptionHelp.textContent = 'Ask a question about this item or request more information';
            }
            if (descriptionTextarea) {
                descriptionTextarea.placeholder = 'e.g., "Does this water bottle have a dent on the side?" or "Can you provide more details about where exactly it was found?"';
                descriptionTextarea.setAttribute('aria-describedby', 'description-help');
            }
            if (additionalProofSection) {
                additionalProofSection.style.display = 'none';
                // ACCESSIBILITY: Hide from screen readers when not visible
                const proofTextarea = additionalProofSection.querySelector('textarea');
                if (proofTextarea) {
                    proofTextarea.setAttribute('aria-hidden', 'true');
                }
            }
        }
    }

    // Listen for changes
    if (claimRadio) claimRadio.addEventListener('change', updateForm);
    if (inquiryRadio) inquiryRadio.addEventListener('change', updateForm);

    // Set initial state
    updateForm();
});

// HERO TAGLINE RANDOMIZER
document.addEventListener('DOMContentLoaded', function() {
    const randomizer = document.querySelector('[data-hero-randomizer]');
    if (randomizer) {
        const taglines = [
            'Lose it?<br>Find it here.',
            'One stop<br>for lost items.',
            'Lost things,<br>found solutions.',
            'A helping hand<br>for lost items.',
            'Trusted to<br>find your lost items.'
        ];
        const randomIndex = Math.floor(Math.random() * taglines.length);
        const taglineText = randomizer.querySelector('.tagline-text');
        if (taglineText) {
            taglineText.innerHTML = taglines[randomIndex];
            // ACCESSIBILITY: Announce the tagline to screen readers
            taglineText.setAttribute('role', 'status');
            taglineText.setAttribute('aria-live', 'polite');
        }
    }
});


// IMAGE SLIDER (with keyboard support)
document.addEventListener('DOMContentLoaded', function() {
    const sliderRoots = document.querySelectorAll('[data-lf-slider]');
    
    sliderRoots.forEach(function(sliderRoot) {
        const slides = Array.from(sliderRoot.querySelectorAll('[data-lf-slide]'));
        const prevBtn = sliderRoot.querySelector('[data-lf-slider-prev]');
        const nextBtn = sliderRoot.querySelector('[data-lf-slider-next]');
        const viewport = sliderRoot.querySelector('.lf-slider-viewport');

        if (!slides.length || !viewport) return;

        let index = 0;

        function setActive(nextIndex) {
            index = ((nextIndex % slides.length) + slides.length) % slides.length;
            const scrollLeft = slides[index].offsetLeft - viewport.offsetLeft;
            viewport.scrollLeft = scrollLeft;

            // ACCESSIBILITY: Update ARIA attributes
            slides.forEach(function(slide, i) {
                if (i === index) {
                    slide.setAttribute('aria-hidden', 'false');
                    slide.setAttribute('tabindex', '0');
                } else {
                    slide.setAttribute('aria-hidden', 'true');
                    slide.setAttribute('tabindex', '-1');
                }
            });

            // Update button states
            if (prevBtn) {
                prevBtn.setAttribute('aria-label', 'Previous slide, ' + (index + 1) + ' of ' + slides.length);
            }
            if (nextBtn) {
                nextBtn.setAttribute('aria-label', 'Next slide, ' + (index + 1) + ' of ' + slides.length);
            }
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', function(e) {
                e.preventDefault();
                setActive(index - 1);
            });
            
            // ACCESSIBILITY: Keyboard support
            prevBtn.setAttribute('aria-label', 'Previous slide');
            prevBtn.setAttribute('type', 'button');
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', function(e) {
                e.preventDefault();
                setActive(index + 1);
            });
            
            // ACCESSIBILITY: Keyboard support
            nextBtn.setAttribute('aria-label', 'Next slide');
            nextBtn.setAttribute('type', 'button');
        }

        // ACCESSIBILITY: Keyboard navigation (arrow keys)
        viewport.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                setActive(index - 1);
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                setActive(index + 1);
            }
        });

        // Initialize
        setActive(0);
        
        // ACCESSIBILITY: Add role and label to slider
        viewport.setAttribute('role', 'region');
        viewport.setAttribute('aria-label', 'Image carousel');
        viewport.setAttribute('tabindex', '0');
    });
});

// FORM VALIDATION ENHANCEMENTS
document.addEventListener('DOMContentLoaded', function() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(function(form) {
        const requiredInputs = form.querySelectorAll('[required]');
        
        requiredInputs.forEach(function(input) {
            // ACCESSIBILITY: Add aria-required
            input.setAttribute('aria-required', 'true');
            
            // Add validation feedback
            input.addEventListener('invalid', function(e) {
                e.preventDefault();
                
                // ACCESSIBILITY: Add aria-invalid
                input.setAttribute('aria-invalid', 'true');
                
                // Add visual error indicator
                input.classList.add('is-invalid');
                
                // Find or create error message
                let errorMsg = input.parentElement.querySelector('.error-message');
                if (!errorMsg) {
                    errorMsg = document.createElement('span');
                    errorMsg.className = 'error-message';
                    errorMsg.setAttribute('role', 'alert');
                    input.parentElement.appendChild(errorMsg);
                }
                
                // Set error message
                errorMsg.textContent = input.validationMessage;
                
                // ACCESSIBILITY: Link error to input
                const errorId = input.id + '-error';
                errorMsg.id = errorId;
                input.setAttribute('aria-describedby', errorId);
            });
            
            // Clear error on input
            input.addEventListener('input', function() {
                if (input.checkValidity()) {
                    input.setAttribute('aria-invalid', 'false');
                    input.classList.remove('is-invalid');
                    
                    const errorMsg = input.parentElement.querySelector('.error-message');
                    if (errorMsg) {
                        errorMsg.remove();
                    }
                }
            });
        });
    });
});

// FOCUS VISIBLE POLYFILL (for older browsers)
document.addEventListener('DOMContentLoaded', function() {
    let hadKeyboardEvent = false;

    document.addEventListener('keydown', function() {
        hadKeyboardEvent = true;
    });

    document.addEventListener('mousedown', function() {
        hadKeyboardEvent = false;
    });

    document.addEventListener('focusin', function(e) {
        if (hadKeyboardEvent) {
            e.target.setAttribute('data-focus-visible', 'true');
        }
    });

    document.addEventListener('focusout', function(e) {
        e.target.removeAttribute('data-focus-visible');
    });
});