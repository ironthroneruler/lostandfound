// MOBILE MENU TOGGLE (with ARIA support)
function toggleMenu() {
    const menu = document.getElementById('navbarMenu');
    const toggle = document.querySelector('.navbar-toggle');
    const isExpanded = menu.classList.contains('active');
    
    menu.classList.toggle('active');

    if (toggle) {
        toggle.setAttribute('aria-expanded', String(!isExpanded));
    }
}



// DROPDOWN TOGGLE (with keyboard support)
document.addEventListener('DOMContentLoaded', function() {
    const dropdowns = document.querySelectorAll('.dropdown');

    dropdowns.forEach(function(dropdown) {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        const menu = dropdown.querySelector('.dropdown-menu');

        if (toggle && menu) {
            toggle.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                toggleDropdownState();
            });

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

                // Close other dropdowns
                dropdowns.forEach(function(otherDropdown) {
                    if (otherDropdown !== dropdown) {
                        otherDropdown.classList.remove('active');
                        const otherToggle = otherDropdown.querySelector('.dropdown-toggle');
                        if (otherToggle) {
                            otherToggle.setAttribute('aria-expanded', 'false');
                        }
                    }
                });

                dropdown.classList.toggle('active');
                toggle.setAttribute('aria-expanded', String(!isOpen));

                if (!isOpen) {
                    setTimeout(function() {
                        const firstLink = menu.querySelector('a');
                        if (firstLink) firstLink.focus();
                    }, 0);
                }
            }

            function closeDropdown() {
                dropdown.classList.remove('active');
                toggle.setAttribute('aria-expanded', 'false');
                toggle.focus();
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



// ALERT AUTO-DISMISS
document.addEventListener('DOMContentLoaded', function() {
    const alerts = document.querySelectorAll('.alert');
    
    alerts.forEach(function(alert) {
        if (alert.classList.contains('static-alert')) return;

        setTimeout(function() {
            alert.setAttribute('aria-live', 'off');
            
            alert.style.transition = 'opacity 0.5s ease';
            alert.style.opacity = '0';

            setTimeout(function() {
                alert.remove();
            }, 500);
        }, 5000);
    });
});



// HOME PAGE WELCOME MESSAGE
document.addEventListener('DOMContentLoaded', function() {
    const welcomeMsg = document.getElementById('welcome-message');
    if (welcomeMsg) {
        const urlParams = new URLSearchParams(window.location.search);
        const isLoginRedirect = urlParams.get('login') === '1';

        if (isLoginRedirect) {
            welcomeMsg.style.display = 'block';
            welcomeMsg.setAttribute('role', 'status');
            welcomeMsg.setAttribute('aria-live', 'polite');

            setTimeout(function() {
                welcomeMsg.setAttribute('aria-live', 'off');
                welcomeMsg.style.transition = 'opacity 0.5s ease';
                welcomeMsg.style.opacity = '0';

                setTimeout(function() {
                    welcomeMsg.remove();
                }, 500);
            }, 5000);
        }
    }
});



// CLAIMS FORM LOGIC
document.addEventListener('DOMContentLoaded', function() {
    const claimRadio = document.querySelector('input[value="claim"]');
    const inquiryRadio = document.querySelector('input[value="inquiry"]');
    const descriptionLabel = document.getElementById('description-label');
    const descriptionHelp = document.getElementById('description-help');
    const descriptionTextarea = document.querySelector('#id_description');
    const additionalProofSection = document.getElementById('additional-proof-section');

    function updateForm() {
        if (claimRadio && claimRadio.checked) {
            if (descriptionLabel) descriptionLabel.textContent = 'Item Description / Proof of Ownership';
            if (descriptionHelp) descriptionHelp.textContent = 'Describe the item in detail to prove ownership. Include color, brand, size, distinguishing features, where you lost it, etc.';
            if (descriptionTextarea) {
                descriptionTextarea.placeholder = 'Describe the item in detail. Include color, brand, size, distinguishing features, where you lost it, etc.';
                descriptionTextarea.setAttribute('aria-describedby', 'description-help');
            }
            if (additionalProofSection) {
                additionalProofSection.style.display = 'block';
                const proofTextarea = additionalProofSection.querySelector('textarea');
                if (proofTextarea) proofTextarea.removeAttribute('aria-hidden');
            }
        }
        else if (inquiryRadio && inquiryRadio.checked) {
            if (descriptionLabel) descriptionLabel.textContent = 'Your Question or Inquiry';
            if (descriptionHelp) descriptionHelp.textContent = 'Ask a question about this item or request more information';
            if (descriptionTextarea) {
                descriptionTextarea.placeholder = 'e.g., "Does this water bottle have a dent on the side?" or "Can you provide more details about where exactly it was found?"';
                descriptionTextarea.setAttribute('aria-describedby', 'description-help');
            }
            if (additionalProofSection) {
                additionalProofSection.style.display = 'none';
                const proofTextarea = additionalProofSection.querySelector('textarea');
                if (proofTextarea) proofTextarea.setAttribute('aria-hidden', 'true');
            }
        }
    }

    if (claimRadio) claimRadio.addEventListener('change', updateForm);
    if (inquiryRadio) inquiryRadio.addEventListener('change', updateForm);

    updateForm();
});



// REPORT ITEM FORM HANDLING
document.addEventListener('DOMContentLoaded', function() {
    const uploadBox = document.getElementById('uploadBox');
    const photoInput = document.getElementById('photoInput');
    const previewImage = document.getElementById('previewImage');
    const removeImageBtn = document.getElementById('removeImageBtn');
    const uploadEmpty = document.getElementById('uploadEmpty');
    const reportForm = document.getElementById('reportForm');
    const submitBtn = document.getElementById('submitBtn');
    const submitText = document.getElementById('submitText');

    // Only run if report form elements exist
    if (!reportForm || !uploadBox || !photoInput) return;

    // Prevent double submission
    let isSubmitting = false;

    reportForm.addEventListener('submit', function(e) {
        if (isSubmitting) {
            e.preventDefault();
            return false;
        }

        // Validate form
        if (!reportForm.checkValidity()) {
            return true; // Let browser handle validation
        }

        // Set submitting state
        isSubmitting = true;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Submitting...</span>';
    });

    // Only trigger file input on uploadBox click, not on button clicks
    uploadBox.addEventListener('click', function(e) {
        // Don't trigger if clicking remove button or submit button
        if (e.target.closest('#removeImageBtn') || 
            e.target.closest('button[type="submit"]') ||
            e.target.closest('.report-form-actions')) {
            return;
        }
        photoInput.click();
    });

    uploadBox.addEventListener('dragover', function(e) {
        e.preventDefault();
        uploadBox.classList.add('dragover');
    });

    uploadBox.addEventListener('dragleave', function() {
        uploadBox.classList.remove('dragover');
    });

    uploadBox.addEventListener('drop', function(e) {
        e.preventDefault();
        uploadBox.classList.remove('dragover');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileSelect(files[0]);
        }
    });

    photoInput.addEventListener('change', function(e) {
        if (e.target.files.length > 0) {
            handleFileSelect(e.target.files[0]);
        }
    });

    function handleFileSelect(file) {
        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            alert('Please select a valid image file (JPG, PNG, GIF, or WEBP)');
            photoInput.value = '';
            return;
        }

        // Validate file size (5MB)
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            alert('Image file size cannot exceed 5MB');
            photoInput.value = '';
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            previewImage.src = e.target.result;
            previewImage.style.display = 'block';
            removeImageBtn.style.display = 'inline-block';
            uploadEmpty.style.display = 'none';
            uploadBox.classList.add('has-image');
        };
        reader.readAsDataURL(file);
    }

    removeImageBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        photoInput.value = '';
        previewImage.src = '';
        previewImage.style.display = 'none';
        removeImageBtn.style.display = 'none';
        uploadEmpty.style.display = 'flex';
        uploadBox.classList.remove('has-image');
    });
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

            slides.forEach(function(slide, i) {
                slide.setAttribute('aria-hidden', i === index ? 'false' : 'true');
                slide.setAttribute('tabindex', i === index ? '0' : '-1');
            });

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
            prevBtn.setAttribute('type', 'button');
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', function(e) {
                e.preventDefault();
                setActive(index + 1);
            });
            nextBtn.setAttribute('type', 'button');
        }

        viewport.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                setActive(index - 1);
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                setActive(index + 1);
            }
        });

        setActive(0);

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
            input.setAttribute('aria-required', 'true');
            
            input.addEventListener('invalid', function(e) {
                e.preventDefault();
                input.setAttribute('aria-invalid', 'true');
                input.classList.add('is-invalid');

                let errorMsg = input.parentElement.querySelector('.error-message');
                if (!errorMsg) {
                    errorMsg = document.createElement('span');
                    errorMsg.className = 'error-message';
                    errorMsg.setAttribute('role', 'alert');
                    input.parentElement.appendChild(errorMsg);
                }

                errorMsg.textContent = input.validationMessage;

                const errorId = input.id + '-error';
                errorMsg.id = errorId;
                input.setAttribute('aria-describedby', errorId);
            });
            
            input.addEventListener('input', function() {
                if (input.checkValidity()) {
                    input.setAttribute('aria-invalid', 'false');
                    input.classList.remove('is-invalid');
                    
                    const errorMsg = input.parentElement.querySelector('.error-message');
                    if (errorMsg) errorMsg.remove();
                }
            });
        });
    });
});



// TOOLTIP SYSTEM
document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.lf-hover-tooltip')) return;

    const tooltip = document.createElement('div');
    tooltip.className = 'lf-hover-tooltip';

    const titleEl = document.createElement('div');
    titleEl.className = 'lf-hover-tooltip-title';

    const metaEl = document.createElement('div');
    metaEl.className = 'lf-hover-tooltip-meta';

    tooltip.appendChild(titleEl);
    tooltip.appendChild(metaEl);
    document.body.appendChild(tooltip);

    let activeTarget = null;

    function setTooltipContent(target) {
        const title = target.dataset.title || '';
        const dateFound = target.dataset.dateFound || '';
        const category = target.dataset.category || '';
        const location = target.dataset.location || '';

        titleEl.textContent = title;

        const parts = [];
        if (dateFound) parts.push('Found: ' + dateFound);
        if (category) parts.push('Category: ' + category);
        if (location) parts.push('Location: ' + location);
        metaEl.textContent = parts.join(' · ');
    }

    function setTooltipPosition(clientX, clientY) {
        const margin = 12;
        const offsetY = 16;

        tooltip.style.left = clientX + 'px';
        tooltip.style.top = (clientY + offsetY) + 'px';

        const rect = tooltip.getBoundingClientRect();

        let nextLeft = clientX;
        const minLeft = rect.width / 2 + margin;
        const maxLeft = window.innerWidth - rect.width / 2 - margin;

        if (nextLeft < minLeft) nextLeft = minLeft;
        if (nextLeft > maxLeft) nextLeft = maxLeft;
        tooltip.style.left = nextLeft + 'px';

        if (rect.bottom > window.innerHeight - margin) {
            tooltip.style.top = (clientX - rect.height - offsetY) + 'px';
        }
    }

    document.body.addEventListener('mouseover', function(e) {
        const target = e.target.closest('[data-lf-tooltip]');
        if (target) {
            activeTarget = target;
            setTooltipContent(target);
            tooltip.classList.add('is-visible');
            setTooltipPosition(e.clientX, e.clientY);
        }
    });

    document.body.addEventListener('mousemove', function(e) {
        if (activeTarget) {
            setTooltipPosition(e.clientX, e.clientY);
        }
    });

    document.body.addEventListener('mouseout', function(e) {
        const target = e.target.closest('[data-lf-tooltip]');
        if (target && target === activeTarget) {
            if (!target.contains(e.relatedTarget)) {
                activeTarget = null;
                tooltip.classList.remove('is-visible');
            }
        }
    });

    window.addEventListener('scroll', function() {
        if (!activeTarget) return;
        tooltip.classList.remove('is-visible');
        activeTarget = null;
    }, { passive: true });
});



// FOCUS VISIBLE POLYFILL
document.addEventListener('DOMContentLoaded', function() {
    let hadKeyboardEvent = false;

    document.addEventListener('keydown', function() {
        hadKeyboardEvent = true;
        document.body.classList.add('using-keyboard');
    });

    document.addEventListener('mousedown', function() {
        if (hadKeyboardEvent) {
            hadKeyboardEvent = false;
            document.body.classList.remove('using-keyboard');
        }
    });

    document.addEventListener('focusin', function(e) {
        if (hadKeyboardEvent) {
            e.target.classList.add('focus-visible');
        }
    });

    document.addEventListener('focusout', function(e) {
        e.target.classList.remove('focus-visible');
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const demoTrigger = document.getElementById('demo-trigger');
    const demoModeContainer = document.getElementById('demo-mode-container');
    const mainContent = document.getElementById('main-content');
    const navbar = document.querySelector('nav.navbar');
    const footer = document.querySelector('footer');
    const stageIndicator = document.getElementById('demo-stage-indicator');
    const flashMessages = document.querySelector('.flash-messages-container');
    const demoCursor = document.getElementById('demo-cursor');
    
    const STAGES = {
        0: { name: 'Title Page', url: null },
        1: { name: 'Home (Logged Out)', url: '/?demo=true' },
        2: { name: 'Register Student', url: '/register/student/' },
        3: { name: 'Register Teacher', url: '/register/teacher/' },
        4: { name: 'Login', url: '/login/' },
        5: { name: 'Home (Logged In)', url: '/' }
    };
    
    const TOTAL_STAGES = Object.keys(STAGES).length;

    function getCurrentStage() {
        if (sessionStorage.getItem('demoMode') === 'true') {
            return parseInt(sessionStorage.getItem('demoStage')) || 0;
        }
        return 0;
    }

    function updateStageIndicator(stage) {
        if (!stageIndicator) return;
        const lastStageNum = TOTAL_STAGES - 1;
        stageIndicator.textContent = `Stage: ${stage}/${lastStageNum}`;
    }

    function hideFlashMessages() {
        if (flashMessages) {
            flashMessages.setAttribute('data-demo-hidden', 'true');
        }
    }

    function showFlashMessages() {
        if (flashMessages) {
            flashMessages.removeAttribute('data-demo-hidden');
        }
    }

    function hideCursor() {
        if (demoCursor) {
            demoCursor.classList.remove('active');
        }
    }

    function showCursorAt(x, y) {
        if (!demoCursor) return;
        demoCursor.style.left = x + 'px';
        demoCursor.style.top = y + 'px';
        demoCursor.classList.add('active');
        sessionStorage.setItem('demoCursorX', x);
        sessionStorage.setItem('demoCursorY', y);
    }

    function moveCursorTo(targetX, targetY, duration = 800) {
        if (!demoCursor) return Promise.resolve();
        
        return new Promise(resolve => {
            const startX = parseFloat(demoCursor.style.left) || window.innerWidth / 2;
            const startY = parseFloat(demoCursor.style.top) || window.innerHeight / 2;
            const startTime = performance.now();

            function animate(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);

                const currentX = startX + (targetX - startX) * progress;
                const currentY = startY + (targetY - startY) * progress;

                showCursorAt(currentX, currentY);

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    resolve();
                }
            }

            requestAnimationFrame(animate);
        });
    }

    function typeInElement(element, text, delay = 100) {
        return new Promise(resolve => {
            let i = 0;
            element.value = '';
            element.focus();

            function typeChar() {
                if (i < text.length) {
                    element.value += text.charAt(i);
                    i++;
                    setTimeout(typeChar, delay);
                } else {
                    resolve();
                }
            }
            typeChar();
        });
    }

    function executeStageTransition(fromStage, toStage) {
        if (fromStage === 1 && toStage === 2) {
            return new Promise(async resolve => {
                const registerBtn = document.querySelector('a.cta-login-btn[href*="register/student"]');
                
                window.scrollBy({ top: 300, behavior: 'smooth' });
                
                await new Promise(r => setTimeout(r, 600));
                
                showCursorAt(window.innerWidth / 2, window.innerHeight / 2);
                
                await new Promise(r => setTimeout(r, 400));
                
                if (registerBtn) {
                    const rect = registerBtn.getBoundingClientRect();
                    const targetX = rect.left + rect.width / 2;
                    const targetY = rect.top + rect.height / 2;
                    
                    await moveCursorTo(targetX, targetY, 400);
                    await new Promise(r => setTimeout(r, 300));
                } else {
                    await new Promise(r => setTimeout(r, 600));
                }
                
                resolve();
            });
        } else if (fromStage === 2 && toStage === 3) {
            return new Promise(async resolve => {
                const teacherLink = document.querySelector('a.registration-link[href*="register/teacher"]');
                
                window.scrollBy({ top: 600, behavior: 'smooth' });
                
                await new Promise(r => setTimeout(r, 600));
                
                if (teacherLink) {
                    const rect = teacherLink.getBoundingClientRect();
                    const targetX = rect.left + rect.width / 2;
                    const targetY = rect.top + rect.height / 2;
                    
                    await moveCursorTo(targetX, targetY, 400);
                    await new Promise(r => setTimeout(r, 300));
                } else {
                    await new Promise(r => setTimeout(r, 600));
                }
                
                resolve();
            });
        } else if (fromStage === 3 && toStage === 4) {
            return new Promise(async resolve => {
                const loginLink = document.querySelector('a.registration-link[href*="login"]');
                
                window.scrollBy({ top: 600, behavior: 'smooth' });
                
                await new Promise(r => setTimeout(r, 600));
                
                if (loginLink) {
                    const rect = loginLink.getBoundingClientRect();
                    const targetX = rect.left + rect.width / 2;
                    const targetY = rect.top + rect.height / 2;
                    
                    await moveCursorTo(targetX, targetY, 400);
                    await new Promise(r => setTimeout(r, 300));
                } else {
                    await new Promise(r => setTimeout(r, 600));
                }
                
                resolve();
            });
        } else if (fromStage === 4 && toStage === 5) {
            return new Promise(async resolve => {
                const usernameInput = document.querySelector('input[name="username"]');
                const passwordInput = document.querySelector('input[name="password"]');
                const loginButton = document.querySelector('button[type="submit"]');
                
                if (usernameInput) {
                    const rect = usernameInput.getBoundingClientRect();
                    await moveCursorTo(rect.left + rect.width / 2, rect.top + rect.height / 2, 400);
                    await new Promise(r => setTimeout(r, 300));
                    await typeInElement(usernameInput, 'david123', 120);
                }
                
                if (passwordInput) {
                    const rect = passwordInput.getBoundingClientRect();
                    await moveCursorTo(rect.left + rect.width / 2, rect.top + rect.height / 2, 400);
                    await new Promise(r => setTimeout(r, 300));
                }
                
                if (loginButton) {
                    const rect = loginButton.getBoundingClientRect();
                    await moveCursorTo(rect.left + rect.width / 2, rect.top + rect.height / 2, 400);
                    await new Promise(r => setTimeout(r, 1000));
                }
                
                resolve();
            });
        }
        return Promise.resolve();
    }

    function loadStage(stageNum) {
        const stage = STAGES[stageNum];
        if (!stage) return;

        updateStageIndicator(stageNum);

        if (stageNum === 0) {
            fetch('/demo-logout/', { method: 'GET' });
            if (demoModeContainer) {
                demoModeContainer.classList.add('active');
            }
            if (mainContent) {
                mainContent.classList.add('hidden');
            }
            if (navbar) {
                navbar.style.display = 'none';
            }
            if (footer) {
                footer.style.display = 'none';
            }
            hideFlashMessages();
            hideCursor();
            sessionStorage.removeItem('demoMode');
            sessionStorage.removeItem('demoStage');
        } else {
            sessionStorage.setItem('demoMode', 'true');
            sessionStorage.setItem('demoStage', stageNum);
            hideFlashMessages();
            window.location.href = stage.url;
        }
    }

    function goToNextStage() {
        const current = getCurrentStage();
        if (current < TOTAL_STAGES - 1) {
            executeStageTransition(current, current + 1).then(() => {
                loadStage(current + 1);
            });
        }
    }

    function goToPreviousStage() {
        const current = getCurrentStage();
        if (current > 0) {
            hideCursor();
            loadStage(current - 1);
        }
    }

    function exitDemo() {
        sessionStorage.removeItem('demoMode');
        sessionStorage.removeItem('demoStage');
        if (demoModeContainer) {
            demoModeContainer.classList.remove('active');
        }
        if (mainContent) {
            mainContent.classList.remove('hidden');
        }
        if (demoTrigger) {
            demoTrigger.classList.remove('hidden');
        }
        if (navbar) {
            navbar.style.display = '';
        }
        if (footer) {
            footer.style.display = '';
        }
        if (stageIndicator) {
            stageIndicator.classList.remove('active');
        }
        hideCursor();
        showFlashMessages();
    }

    if (demoTrigger) {
        demoTrigger.addEventListener('click', function() {
            demoTrigger.classList.add('hidden');
            if (stageIndicator) {
                stageIndicator.classList.add('active');
            }
            loadStage(0);
        });
    }

    if (sessionStorage.getItem('demoMode') === 'true') {
        const stage = getCurrentStage();
        if (demoTrigger) {
            demoTrigger.classList.add('hidden');
        }
        if (stageIndicator) {
            stageIndicator.classList.add('active');
        }
        updateStageIndicator(stage);
        hideFlashMessages();
        
        if (navbar) {
            navbar.style.display = '';
        }
        if (footer) {
            footer.style.display = '';
        }

        const savedCursorX = sessionStorage.getItem('demoCursorX');
        const savedCursorY = sessionStorage.getItem('demoCursorY');
        if (savedCursorX && savedCursorY) {
            showCursorAt(parseFloat(savedCursorX), parseFloat(savedCursorY));
        }
    }

    window.addEventListener('keydown', function(e) {
        const isInDemo = sessionStorage.getItem('demoMode') === 'true';
        const isOnTitlePage = (demoModeContainer && sessionStorage.getItem('demoMode') !== 'true' && demoModeContainer.classList.contains('active'));

        if (isInDemo || isOnTitlePage) {
            if (e.key === 'Escape') {
                e.preventDefault();
                if (isOnTitlePage) {
                    exitDemo();
                } else {
                    exitDemo();
                    window.location.href = '/';
                }
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                goToNextStage();
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                goToPreviousStage();
            }
        }
    }, true);
});