// Table Tennis Club Management System
class TTClubManager {
    constructor() {
        // Initialize data directly from db.js
        this.loadDataFromDB();

        this.currentEditingMember = null;
        this.currentEditingExpense = null;
        this.currentEditingContribution = null;
        this.currentEditingFee = null;
        this.hasUnsavedChanges = false;

        this.initializeApp();
    }

    // Data Management - Direct from db.js file
    loadDataFromDB() {
        console.log('Loading data from db.js file');
        console.log('TTClubDatabase available:', typeof TTClubDatabase !== 'undefined');

        // Load data directly from the global TTClubDatabase object
        if (typeof TTClubDatabase !== 'undefined') {
            console.log('TTClubDatabase found, loading data...');
            console.log('TTClubDatabase.members length:', TTClubDatabase.members ? TTClubDatabase.members.length : 'undefined');

            this.members = [...TTClubDatabase.members]; // Create copies to avoid direct mutation
            this.transactions = [...TTClubDatabase.transactions];
            this.invoices = [...TTClubDatabase.invoices];
            this.activities = [...TTClubDatabase.activities];
            this.expenses = [...TTClubDatabase.expenses];
            this.contributions = [...TTClubDatabase.contributions];
            this.pendingFees = [...TTClubDatabase.pendingFees];
            this.feeYears = [...TTClubDatabase.feeYears];
            this.settings = {...TTClubDatabase.settings};

            console.log('Successfully loaded from db.js:', this.members.length, 'members');
        } else {
            console.error('TTClubDatabase not found! Make sure db.js is loaded before app.js');
            console.log('Available global objects:', Object.keys(window));
            this.initializeEmptyData();
        }
    }

    initializeEmptyData() {
        this.members = [];
        this.transactions = [];
        this.invoices = [];
        this.activities = [];
        this.expenses = [];
        this.contributions = [];
        this.pendingFees = [];
        this.feeYears = [];
        this.settings = {
            clubName: 'Passion Hills Table Tennis Club',
            defaultMembershipFee: 3000,
            defaultAnnualFee: 500,
            currentYear: 2025
        };
    }

    saveAllData(autoDownload = false) {
        // Update the global database object
        if (typeof TTClubDatabase !== 'undefined') {
            TTClubDatabase.members = [...this.members];
            TTClubDatabase.transactions = [...this.transactions];
            TTClubDatabase.invoices = [...this.invoices];
            TTClubDatabase.activities = [...this.activities];
            TTClubDatabase.expenses = [...this.expenses];
            TTClubDatabase.contributions = [...this.contributions];
            TTClubDatabase.pendingFees = [...this.pendingFees];
            TTClubDatabase.feeYears = [...this.feeYears];
            TTClubDatabase.settings = {...this.settings};

            console.log('Data saved to db.js structure');
        }

        // Mark as saved
        this.hasUnsavedChanges = false;
        this.updateSaveStatus();

        // Only auto-download if explicitly requested
        if (autoDownload) {
            this.downloadDatabaseJSON();
        }

        // Show save indicator
        this.showSaveIndicator();

        return true;
    }

    // Reset to original database state
    resetToOriginalData() {
        if (confirm('This will reset all data to the original database state. Are you sure?')) {
            // Reload the page to get fresh data from db.js
            location.reload();
        }
    }



    // Initialize the application
    initializeApp() {
        try {
            this.showLoading();

            // Data is already loaded in constructor via loadDataFromDB()
            console.log('Initializing app with', this.members.length, 'members');

            if (this.members.length === 0) {
                console.error('No members loaded! Check db.js file.');
                this.showMessage('Error: No member data found. Please check db.js file.', 'error');
            }

            this.setupNavigation();
            this.setupModals();
            this.setupEventListeners();
            this.setupMobileEnhancements();
            this.updateDashboard();
            this.renderMembers();
            this.updateFeeManagement();
            this.renderPendingFees();
            this.updateSaveStatus();

            // Initialize comprehensive mobile support
            this.initializeMobileSupport();

            console.log('App initialization completed successfully');
        } catch (error) {
            console.error('Error during app initialization:', error);
            this.showMessage('Error initializing application: ' + error.message, 'error');
        } finally {
            this.hideLoading();
        }
    }

    // Mobile-specific enhancements
    setupMobileEnhancements() {
        // Add touch-friendly interactions
        this.addTouchSupport();

        // Handle orientation changes
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.handleOrientationChange();
            }, 100);
        });

        // Prevent zoom on double tap for buttons
        document.addEventListener('touchend', (e) => {
            if (e.target.classList.contains('btn') || e.target.closest('.btn')) {
                e.preventDefault();
            }
        });

        // Add swipe support for navigation (optional)
        this.addSwipeNavigation();

        // Add mobile-specific event delegation for better button handling
        this.addMobileEventDelegation();

        // Add global event delegation for dashboard cards
        this.addDashboardCardDelegation();
    }

    addTouchSupport() {
        // Add touch feedback to buttons
        const buttons = document.querySelectorAll('.btn, .nav-btn, .btn-small, .btn-edit-fee');
        buttons.forEach(btn => {
            // Prevent double-tap zoom on buttons
            btn.addEventListener('touchstart', (e) => {
                btn.style.transform = 'scale(0.95)';
                btn.style.transition = 'transform 0.1s ease';
            }, { passive: true });

            btn.addEventListener('touchend', (e) => {
                setTimeout(() => {
                    btn.style.transform = '';
                    btn.style.transition = '';
                }, 150);
            }, { passive: true });

            // Prevent context menu on long press for action buttons
            if (btn.classList.contains('btn-small') || btn.classList.contains('btn-edit-fee')) {
                btn.addEventListener('contextmenu', (e) => {
                    e.preventDefault();
                });
            }
        });

        // Add specific touch handling for collect fee buttons
        this.addCollectFeeButtonTouchSupport();
    }

    addCollectFeeButtonTouchSupport() {
        console.log('Setting up mobile button support...');

        // Handle all buttons with a comprehensive approach
        this.setupMobileButtonSupport();

        // Handle specific buttons that might be dynamically created
        this.setupDynamicButtonSupport();
    }

    setupMobileButtonSupport() {
        console.log('Setting up mobile button support...');

        // Remove any existing listeners
        if (this.globalButtonClickHandler) {
            document.body.removeEventListener('click', this.globalButtonClickHandler);
            document.body.removeEventListener('touchstart', this.globalButtonClickHandler);
        }

        // Create a comprehensive mobile button handler
        this.globalButtonClickHandler = (e) => {
            const button = e.target.closest('button, .btn, .nav-btn, .close, .stat-card.clickable');
            if (!button) return;

            console.log('Mobile button/element clicked:', button.className, button.id);

            // Prevent default behavior
            e.preventDefault();
            e.stopPropagation();

            // Handle different types of clickable elements
            if (button.classList.contains('stat-card')) {
                this.handleStatCardClick(button);
            } else if (button.classList.contains('nav-btn')) {
                this.handleNavButtonClick(button);
            } else if (button.classList.contains('close')) {
                this.handleCloseButtonClick(button);
            } else {
                this.handleRegularButtonClick(button);
            }
        };

        // Add multiple event types for maximum compatibility
        document.addEventListener('touchstart', this.globalButtonClickHandler, { passive: false });
        document.addEventListener('touchend', this.globalButtonClickHandler, { passive: false });
        document.addEventListener('click', this.globalButtonClickHandler, { passive: false });

        // Add visual feedback
        document.addEventListener('touchstart', (e) => {
            const button = e.target.closest('button, .btn, .stat-card.clickable');
            if (button && !button.disabled) {
                this.addButtonTouchFeedback(button);
            }
        }, { passive: true });

        document.addEventListener('touchend', (e) => {
            const button = e.target.closest('button, .btn, .stat-card.clickable');
            if (button) {
                this.removeButtonTouchFeedback(button);
            }
        }, { passive: true });

        console.log('Mobile button support setup complete');
    }

    handleStatCardClick(button) {
        console.log('Stat card clicked:', button.getAttribute('data-navigate'));
        const navigateTo = button.getAttribute('data-navigate');
        const filter = button.getAttribute('data-filter');

        if (navigateTo) {
            this.navigateFromStatCard(navigateTo, filter);
        }
    }

    handleNavButtonClick(button) {
        console.log('Nav button clicked:', button.getAttribute('data-section'));
        const section = button.getAttribute('data-section');

        if (section) {
            this.showSection(section);
        }
    }

    handleCloseButtonClick(button) {
        console.log('Close button clicked');
        const modal = button.closest('.modal');

        if (modal) {
            modal.style.display = 'none';
            // Re-enable body scroll
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
        }
    }

    handleRegularButtonClick(button) {
        console.log('Regular button clicked:', button.id || button.className);

        // Handle onclick attribute
        const onclickAttr = button.getAttribute('onclick');
        if (onclickAttr) {
            try {
                console.log('Executing onclick:', onclickAttr.substring(0, 100) + '...');
                eval(onclickAttr);
            } catch (error) {
                console.error('Error executing onclick:', error);
            }
        }

        // Handle specific button IDs
        if (button.id) {
            switch (button.id) {
                case 'add-member-btn':
                    this.openMemberModal();
                    break;
                case 'collect-fee-btn':
                    this.openFeeModal();
                    break;
                case 'add-pending-fee-btn':
                    this.openPendingFeeModal();
                    break;
                case 'add-expense-btn':
                    this.openExpenseModal();
                    break;
                case 'add-contribution-btn':
                    this.openContributionModal();
                    break;
                case 'export-json':
                    this.downloadDatabaseJSON();
                    break;
                case 'import-json':
                    document.getElementById('json-file-input').click();
                    break;
                case 'reset-data':
                    this.resetToOriginalData();
                    break;
                case 'manage-fee-years-btn':
                    this.openFeeYearsModal();
                    break;
                default:
                    console.log('Unhandled button ID:', button.id);
            }
        }
    }

    handleGlobalButtonClick(e) {
        const button = e.target.closest('button, .btn');
        if (!button || button.disabled) return;

        console.log('Global button click:', button.id || button.className);

        // Handle onclick attributes for mobile
        const onclickAttr = button.getAttribute('onclick');
        if (onclickAttr) {
            e.preventDefault();
            e.stopPropagation();

            try {
                // Execute the onclick function
                eval(onclickAttr);
                console.log('Executed onclick:', onclickAttr.substring(0, 50) + '...');
            } catch (error) {
                console.error('Error executing onclick:', error);
            }
        }
    }

    handleGlobalButtonTouch(e) {
        const button = e.target.closest('button, .btn');
        if (!button || button.disabled) return;

        console.log('Global button touch:', button.id || button.className);

        // Handle onclick attributes for mobile touch
        const onclickAttr = button.getAttribute('onclick');
        if (onclickAttr) {
            e.preventDefault();
            e.stopPropagation();

            try {
                // Execute the onclick function
                eval(onclickAttr);
                console.log('Executed touch onclick:', onclickAttr.substring(0, 50) + '...');
            } catch (error) {
                console.error('Error executing touch onclick:', error);
            }
        }
    }

    addButtonTouchFeedback(button) {
        button.style.transition = 'all 0.1s ease';
        button.style.transform = 'scale(0.95)';

        if (button.classList.contains('btn-success')) {
            button.style.backgroundColor = '#1e7e34';
        } else if (button.classList.contains('btn-danger')) {
            button.style.backgroundColor = '#c82333';
        } else if (button.classList.contains('btn-primary')) {
            button.style.backgroundColor = '#0056b3';
        } else if (button.classList.contains('btn-secondary')) {
            button.style.backgroundColor = '#545b62';
        } else if (button.classList.contains('btn-warning')) {
            button.style.backgroundColor = '#e0a800';
        }
    }

    removeButtonTouchFeedback(button) {
        setTimeout(() => {
            button.style.backgroundColor = '';
            button.style.transform = '';
            button.style.transition = '';
        }, 150);
    }

    setupDynamicButtonSupport() {
        // Ensure all buttons have proper mobile attributes
        const allButtons = document.querySelectorAll('button, .btn');
        allButtons.forEach(btn => {
            btn.style.touchAction = 'manipulation';
            btn.style.userSelect = 'none';
            btn.style.webkitUserSelect = 'none';
            btn.style.webkitTapHighlightColor = 'transparent';
            btn.style.webkitTouchCallout = 'none';
        });
    }

    addMobileEventDelegation() {
        // Add event delegation for better mobile button handling
        document.body.addEventListener('touchstart', (e) => {
            const target = e.target.closest('.btn-success, .btn-primary, .btn-secondary, .btn-danger, .btn-warning');
            if (target) {
                target.style.opacity = '0.8';
                target.style.transform = 'scale(0.95)';
            }
        }, { passive: true });

        document.body.addEventListener('touchend', (e) => {
            const target = e.target.closest('.btn-success, .btn-primary, .btn-secondary, .btn-danger, .btn-warning');
            if (target) {
                setTimeout(() => {
                    target.style.opacity = '';
                    target.style.transform = '';
                }, 150);
            }
        }, { passive: true });

        // Prevent iOS Safari from showing the magnifying glass on long press
        document.body.addEventListener('touchstart', (e) => {
            if (e.target.closest('button, .btn')) {
                e.target.style.webkitUserSelect = 'none';
                e.target.style.webkitTouchCallout = 'none';
            }
        }, { passive: true });
    }

    handleOrientationChange() {
        // Refresh layout after orientation change
        this.renderMembers();
        this.updateDashboard();

        // Close any open modals on orientation change
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (modal.style.display === 'block') {
                modal.style.display = 'none';
            }
        });
    }

    initializeMobileSupport() {
        console.log('Initializing comprehensive mobile support...');

        // Check if we're on mobile - more comprehensive detection
        const isMobile = this.detectMobileDevice();

        console.log('Mobile detection result:', isMobile);
        console.log('User agent:', navigator.userAgent);
        console.log('Screen width:', window.innerWidth);
        console.log('Touch support:', 'ontouchstart' in window);

        if (isMobile) {
            console.log('Mobile device detected, applying aggressive mobile fixes...');

            // Apply mobile fixes immediately and with delays
            this.applyImmediateMobileFixes();

            setTimeout(() => {
                this.addCollectFeeButtonTouchSupport();
                this.fixMobileModals();
                this.fixMobileNavigation();
                this.addMobileScrollFixes();
                this.addAggressiveMobileButtonFixes();
            }, 100);

            // Apply additional fixes after a longer delay
            setTimeout(() => {
                this.addFallbackMobileSupport();
            }, 500);
        }

        // Always apply these fixes regardless of device
        this.addUniversalButtonFixes();
    }

    detectMobileDevice() {
        // Multiple detection methods for better accuracy
        const userAgent = navigator.userAgent.toLowerCase();
        const isMobileUA = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile|tablet/i.test(userAgent);
        const isMobileScreen = window.innerWidth <= 768;
        const hasTouchSupport = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        const isMobileOrientation = window.orientation !== undefined;

        return isMobileUA || (isMobileScreen && hasTouchSupport) || isMobileOrientation;
    }

    applyImmediateMobileFixes() {
        console.log('Applying immediate mobile fixes...');

        // Disable text selection on the entire page
        document.body.style.webkitUserSelect = 'none';
        document.body.style.userSelect = 'none';
        document.body.style.webkitTouchCallout = 'none';

        // Add mobile-specific CSS class
        document.body.classList.add('mobile-device');

        // Fix viewport issues
        const viewport = document.querySelector('meta[name="viewport"]');
        if (viewport) {
            viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, shrink-to-fit=no');
        }
    }

    addAggressiveMobileButtonFixes() {
        console.log('Adding aggressive mobile button fixes...');

        // Remove all existing event listeners and re-add them
        const allClickableElements = document.querySelectorAll('button, .btn, .nav-btn, .close, .stat-card.clickable, input[type="submit"], input[type="button"]');

        allClickableElements.forEach((element, index) => {
            console.log(`Fixing element ${index}:`, element.tagName, element.className, element.id);

            // Clone element to remove all existing event listeners
            const newElement = element.cloneNode(true);
            element.parentNode.replaceChild(newElement, element);

            // Apply mobile-specific styles
            newElement.style.touchAction = 'manipulation';
            newElement.style.webkitTapHighlightColor = 'transparent';
            newElement.style.webkitUserSelect = 'none';
            newElement.style.userSelect = 'none';
            newElement.style.webkitTouchCallout = 'none';
            newElement.style.cursor = 'pointer';
            newElement.style.position = 'relative';
            newElement.style.zIndex = '10';

            // Add comprehensive event listeners
            this.addComprehensiveEventListeners(newElement);
        });
    }

    addComprehensiveEventListeners(element) {
        const eventHandler = (e) => {
            console.log('Mobile event triggered:', e.type, 'on', element.tagName, element.className, element.id);

            // Prevent default behavior
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();

            // Add visual feedback
            element.style.opacity = '0.7';
            element.style.transform = 'scale(0.95)';

            setTimeout(() => {
                element.style.opacity = '';
                element.style.transform = '';
            }, 200);

            // Handle the click based on element type
            this.handleMobileElementClick(element);
        };

        // Add multiple event types for maximum compatibility
        element.addEventListener('touchstart', eventHandler, { passive: false });
        element.addEventListener('touchend', eventHandler, { passive: false });
        element.addEventListener('click', eventHandler, { passive: false });
        element.addEventListener('mousedown', eventHandler, { passive: false });
        element.addEventListener('mouseup', eventHandler, { passive: false });
    }

    handleMobileElementClick(element) {
        console.log('Handling mobile element click:', element.tagName, element.className, element.id);

        // Handle different types of elements
        if (element.classList.contains('stat-card')) {
            this.handleStatCardClick(element);
        } else if (element.classList.contains('nav-btn')) {
            this.handleNavButtonClick(element);
        } else if (element.classList.contains('close')) {
            this.handleCloseButtonClick(element);
        } else {
            this.handleRegularButtonClick(element);
        }
    }

    addFallbackMobileSupport() {
        console.log('Adding fallback mobile support...');

        // Add a global touch handler as absolute fallback
        document.addEventListener('touchend', (e) => {
            const target = e.target;
            const clickable = target.closest('button, .btn, .nav-btn, .close, .stat-card.clickable');

            if (clickable) {
                console.log('Fallback touch handler activated for:', clickable.tagName, clickable.className);

                e.preventDefault();
                e.stopPropagation();

                // Trigger click programmatically
                setTimeout(() => {
                    this.handleMobileElementClick(clickable);
                }, 50);
            }
        }, { passive: false });

        // Add a global click handler as another fallback
        document.addEventListener('click', (e) => {
            const target = e.target;
            const clickable = target.closest('button, .btn, .nav-btn, .close, .stat-card.clickable');

            if (clickable && this.detectMobileDevice()) {
                console.log('Fallback click handler activated for:', clickable.tagName, clickable.className);

                e.preventDefault();
                e.stopPropagation();

                this.handleMobileElementClick(clickable);
            }
        }, { passive: false });
    }

    fixMobileModals() {
        console.log('Fixing mobile modals...');

        // Ensure all modals have proper mobile styling
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.style.zIndex = '9999';
            modal.style.position = 'fixed';
            modal.style.top = '0';
            modal.style.left = '0';
            modal.style.width = '100%';
            modal.style.height = '100%';

            const modalContent = modal.querySelector('.modal-content');
            if (modalContent) {
                modalContent.style.margin = '2% auto';
                modalContent.style.width = '96%';
                modalContent.style.maxWidth = 'none';
                modalContent.style.maxHeight = '95vh';
                modalContent.style.overflowY = 'auto';
                modalContent.style.webkitOverflowScrolling = 'touch';
            }
        });

        // Fix close buttons
        const closeButtons = document.querySelectorAll('.close');
        closeButtons.forEach(btn => {
            btn.style.fontSize = '2rem';
            btn.style.padding = '1rem';
            btn.style.minWidth = '50px';
            btn.style.minHeight = '50px';
            btn.style.display = 'flex';
            btn.style.alignItems = 'center';
            btn.style.justifyContent = 'center';
            btn.style.position = 'absolute';
            btn.style.top = '10px';
            btn.style.right = '10px';
            btn.style.background = 'rgba(0,0,0,0.1)';
            btn.style.borderRadius = '50%';
            btn.style.cursor = 'pointer';
            btn.style.zIndex = '1000';
            btn.style.touchAction = 'manipulation';
        });
    }

    fixMobileNavigation() {
        console.log('Fixing mobile navigation...');

        // Ensure navigation buttons work on mobile
        const navButtons = document.querySelectorAll('.nav-btn');
        navButtons.forEach(btn => {
            btn.style.touchAction = 'manipulation';
            btn.style.minHeight = '50px';
            btn.style.minWidth = '50px';
        });
    }

    addMobileScrollFixes() {
        console.log('Adding mobile scroll fixes...');

        // Prevent body scroll when modal is open
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                        if (modal.style.display === 'block') {
                            document.body.style.overflow = 'hidden';
                            document.body.style.position = 'fixed';
                            document.body.style.width = '100%';
                        } else {
                            document.body.style.overflow = '';
                            document.body.style.position = '';
                            document.body.style.width = '';
                        }
                    }
                });
            });

            observer.observe(modal, { attributes: true });
        });
    }

    addUniversalButtonFixes() {
        console.log('Adding universal button fixes...');

        // Apply to all buttons
        const allButtons = document.querySelectorAll('button, .btn, .btn-small, input[type="submit"], input[type="button"]');
        allButtons.forEach(btn => {
            btn.style.webkitAppearance = 'none';
            btn.style.webkitTapHighlightColor = 'transparent';
            btn.style.touchAction = 'manipulation';
            btn.style.userSelect = 'none';
            btn.style.webkitUserSelect = 'none';
            btn.style.webkitTouchCallout = 'none';
            btn.style.position = 'relative';
            btn.style.zIndex = '1';
            btn.style.pointerEvents = 'auto';
        });
    }

    addDashboardCardDelegation() {
        // Add global event delegation for dashboard stat cards
        document.body.addEventListener('click', (e) => {
            const statCard = e.target.closest('.stat-card.clickable');
            if (statCard) {
                console.log('Dashboard card clicked via delegation');
                e.preventDefault();
                e.stopPropagation();

                const navigateTo = statCard.getAttribute('data-navigate');
                const filter = statCard.getAttribute('data-filter');

                console.log('Navigate to:', navigateTo, 'Filter:', filter);

                if (navigateTo) {
                    this.navigateFromStatCard(navigateTo, filter);
                }
            }
        });

        document.body.addEventListener('touchend', (e) => {
            const statCard = e.target.closest('.stat-card.clickable');
            if (statCard) {
                console.log('Dashboard card touched via delegation');
                e.preventDefault();
                e.stopPropagation();

                const navigateTo = statCard.getAttribute('data-navigate');
                const filter = statCard.getAttribute('data-filter');

                console.log('Navigate to:', navigateTo, 'Filter:', filter);

                if (navigateTo) {
                    this.navigateFromStatCard(navigateTo, filter);
                }
            }
        }, { passive: false });

        // Add visual feedback via delegation
        document.body.addEventListener('touchstart', (e) => {
            const statCard = e.target.closest('.stat-card.clickable');
            if (statCard) {
                console.log('Touch start on dashboard card');
                statCard.style.transform = 'scale(0.98)';
                statCard.style.backgroundColor = '#f8f9fa';
                statCard.style.borderColor = '#3498db';
            }
        }, { passive: true });

        document.body.addEventListener('touchend', (e) => {
            const statCard = e.target.closest('.stat-card.clickable');
            if (statCard) {
                console.log('Touch end on dashboard card');
                setTimeout(() => {
                    statCard.style.transform = '';
                    statCard.style.backgroundColor = '';
                    statCard.style.borderColor = '';
                }, 200);
            }
        }, { passive: true });
    }

    addSwipeNavigation() {
        let startX = 0;
        let startY = 0;

        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });

        document.addEventListener('touchend', (e) => {
            if (!startX || !startY) return;

            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;

            const diffX = startX - endX;
            const diffY = startY - endY;

            // Only handle horizontal swipes that are significant
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                const activeSection = document.querySelector('.section.active');
                const sections = ['dashboard', 'members', 'fees', 'invoices', 'reports'];
                const currentIndex = sections.indexOf(activeSection.id);

                if (diffX > 0 && currentIndex < sections.length - 1) {
                    // Swipe left - next section
                    this.switchToSection(sections[currentIndex + 1]);
                } else if (diffX < 0 && currentIndex > 0) {
                    // Swipe right - previous section
                    this.switchToSection(sections[currentIndex - 1]);
                }
            }

            startX = 0;
            startY = 0;
        });
    }

    switchToSection(sectionId) {
        const targetButton = document.querySelector(`[data-section="${sectionId}"]`);
        if (targetButton) {
            targetButton.click();
        }
    }

    showLoading() {
        document.body.insertAdjacentHTML('beforeend', `
            <div id="loading-overlay" style="
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(0,0,0,0.5); display: flex; align-items: center;
                justify-content: center; z-index: 9999; color: white; font-size: 1.2rem;
            ">
                <div style="text-align: center;">
                    <i class="fas fa-spinner fa-spin" style="font-size: 2rem; margin-bottom: 1rem;"></i>
                    <br>Loading Club Data...
                </div>
            </div>
        `);
    }

    hideLoading() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.remove();
        }
    }

    // Show save indicator instead of auto-downloading
    showSaveIndicator() {
        // Remove any existing indicator
        const existingIndicator = document.getElementById('save-indicator');
        if (existingIndicator) {
            existingIndicator.remove();
        }

        // Create save indicator
        const indicator = document.createElement('div');
        indicator.id = 'save-indicator';
        indicator.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: #27ae60;
                color: white;
                padding: 0.75rem 1rem;
                border-radius: 8px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                z-index: 9999;
                font-size: 0.9rem;
                display: flex;
                align-items: center;
                gap: 0.5rem;
                animation: slideInRight 0.3s ease;
            ">
                <i class="fas fa-check-circle"></i>
                Data Saved
            </div>
        `;

        document.body.appendChild(indicator);

        // Auto-remove after 2 seconds
        setTimeout(() => {
            if (indicator && indicator.parentNode) {
                indicator.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => {
                    if (indicator && indicator.parentNode) {
                        indicator.remove();
                    }
                }, 300);
            }
        }, 2000);
    }



    // Navigation Setup
    setupNavigation() {
        const navButtons = document.querySelectorAll('.nav-btn');
        const sections = document.querySelectorAll('.section');

        navButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetSection = btn.dataset.section;
                
                // Update active nav button
                navButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Update active section
                sections.forEach(s => s.classList.remove('active'));
                document.getElementById(targetSection).classList.add('active');
                
                // Update content based on section
                this.updateSectionContent(targetSection);
            });
        });
    }

    // Update section content when switching
    updateSectionContent(section) {
        switch(section) {
            case 'dashboard':
                this.updateDashboard();
                break;
            case 'members':
                this.renderMembers();
                break;
            case 'fees':
                this.updateFeeManagement();
                break;
            case 'invoices':
                this.renderInvoices();
                break;
            case 'expenses':
                this.renderExpenses();
                break;
            case 'contributions':
                this.renderContributions();
                break;
            case 'reports':
                this.updateReports();
                break;
        }
    }

    // Modal Setup
    setupModals() {
        const modals = document.querySelectorAll('.modal');
        const closeButtons = document.querySelectorAll('.close');

        closeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                modals.forEach(modal => modal.style.display = 'none');
            });
        });

        window.addEventListener('click', (e) => {
            modals.forEach(modal => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                }
            });
        });
    }

    // Event Listeners Setup
    setupEventListeners() {
        // Add Member Button
        document.getElementById('add-member-btn').addEventListener('click', () => {
            this.openMemberModal();
        });

        // Member Form Submit
        document.getElementById('member-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveMember();
        });

        // Cancel Member
        document.getElementById('cancel-member').addEventListener('click', () => {
            document.getElementById('member-modal').style.display = 'none';
        });

        // Collect Fee Button
        document.getElementById('collect-fee-btn').addEventListener('click', () => {
            this.openFeeModal();
        });

        // Fee Form Submit
        document.getElementById('fee-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.collectFee();
        });

        // Cancel Fee
        document.getElementById('cancel-fee').addEventListener('click', () => {
            document.getElementById('fee-modal').style.display = 'none';
        });

        // Search and Filter
        document.getElementById('member-search').addEventListener('input', () => {
            this.filterMembers();
        });

        document.getElementById('status-filter').addEventListener('change', () => {
            this.filterMembers();
        });

        // Export buttons
        document.getElementById('export-members').addEventListener('click', () => {
            this.exportMembers();
        });

        document.getElementById('export-financial').addEventListener('click', () => {
            this.exportFinancialData();
        });

        // Generate Invoice
        document.getElementById('generate-invoice-btn').addEventListener('click', () => {
            this.generateInvoice();
        });

        // Backup and Download
        document.getElementById('backup-data').addEventListener('click', () => {
            this.backupDatabase();
        });

        document.getElementById('download-json').addEventListener('click', () => {
            this.downloadDatabaseJSON();
        });

        // Import JSON
        document.getElementById('import-json').addEventListener('click', () => {
            document.getElementById('json-file-input').click();
        });

        document.getElementById('json-file-input').addEventListener('change', (e) => {
            this.importDatabaseJSON(e.target.files[0]);
        });

        // Quick Save Button
        document.getElementById('quick-save').addEventListener('click', () => {
            this.saveAllData(false);
            this.showMessage('Data saved successfully!', 'success');
        });

        // Expense Management
        document.getElementById('add-expense-btn').addEventListener('click', () => {
            this.openExpenseModal();
        });

        document.getElementById('expense-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveExpense();
        });

        document.getElementById('cancel-expense').addEventListener('click', () => {
            document.getElementById('expense-modal').style.display = 'none';
        });

        // Contribution Management
        document.getElementById('add-contribution-btn').addEventListener('click', () => {
            this.openContributionModal();
        });

        document.getElementById('contribution-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveContribution();
        });

        document.getElementById('cancel-contribution').addEventListener('click', () => {
            document.getElementById('contribution-modal').style.display = 'none';
        });

        // Search and Filter Events
        document.getElementById('expense-search').addEventListener('input', () => {
            this.filterExpenses();
        });

        document.getElementById('expense-category-filter').addEventListener('change', () => {
            this.filterExpenses();
        });

        document.getElementById('expense-status-filter').addEventListener('change', () => {
            this.filterExpenses();
        });

        document.getElementById('contribution-search').addEventListener('input', () => {
            this.filterContributions();
        });

        document.getElementById('contribution-type-filter').addEventListener('change', () => {
            this.filterContributions();
        });

        // Reset Data Button
        document.getElementById('reset-data').addEventListener('click', () => {
            this.resetToOriginalData();
        });

        // Pending Fee Management
        document.getElementById('add-pending-fee-btn').addEventListener('click', () => {
            this.openPendingFeeModal();
        });

        document.getElementById('pending-fee-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.savePendingFee();
        });

        document.getElementById('cancel-pending-fee').addEventListener('click', () => {
            document.getElementById('pending-fee-modal').style.display = 'none';
        });

        // Fee Years Management
        document.getElementById('manage-fee-years-btn').addEventListener('click', () => {
            this.openFeeYearsModal();
        });

        document.getElementById('add-fee-year-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addFeeYear();
        });

        document.getElementById('cancel-fee-year').addEventListener('click', () => {
            document.getElementById('fee-years-modal').style.display = 'none';
        });

        // Edit Member Fee
        document.getElementById('edit-member-fee-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.updateMemberFee();
        });

        document.getElementById('cancel-edit-fee').addEventListener('click', () => {
            document.getElementById('edit-member-fee-modal').style.display = 'none';
        });

        // Dashboard stat card click events
        this.setupDashboardCardClicks();
    }

    setupDashboardCardClicks() {
        console.log('Setting up dashboard card clicks...');
        const statCards = document.querySelectorAll('.stat-card.clickable');
        console.log('Found stat cards:', statCards.length);

        statCards.forEach((card, index) => {
            console.log(`Setting up card ${index}:`, card.getAttribute('data-navigate'));

            // Remove any existing event listeners by cloning the element
            const newCard = card.cloneNode(true);
            card.parentNode.replaceChild(newCard, card);

            // Add click event listener to the new element
            const clickHandler = (e) => {
                console.log('Card clicked!', e.type);
                e.preventDefault();
                e.stopPropagation();

                const navigateTo = newCard.getAttribute('data-navigate');
                const filter = newCard.getAttribute('data-filter');

                console.log('Navigate to:', navigateTo, 'Filter:', filter);

                if (navigateTo) {
                    this.navigateFromStatCard(navigateTo, filter);
                } else {
                    console.error('No navigation target found');
                }
            };

            // Add multiple event types for better compatibility
            newCard.addEventListener('click', clickHandler, { passive: false });
            newCard.addEventListener('touchend', clickHandler, { passive: false });

            // Add visual feedback for mobile
            newCard.addEventListener('touchstart', (e) => {
                console.log('Touch start on card');
                newCard.style.transform = 'scale(0.98)';
                newCard.style.backgroundColor = '#f8f9fa';
                newCard.style.borderColor = '#3498db';
            }, { passive: true });

            newCard.addEventListener('touchend', (e) => {
                console.log('Touch end on card');
                setTimeout(() => {
                    newCard.style.transform = '';
                    newCard.style.backgroundColor = '';
                    newCard.style.borderColor = '';
                }, 200);
            }, { passive: true });

            // Add mouse events for desktop
            newCard.addEventListener('mousedown', (e) => {
                console.log('Mouse down on card');
                newCard.style.transform = 'scale(0.98)';
            }, { passive: true });

            newCard.addEventListener('mouseup', (e) => {
                console.log('Mouse up on card');
                setTimeout(() => {
                    newCard.style.transform = '';
                }, 100);
            }, { passive: true });
        });

        console.log('Dashboard card clicks setup complete');
    }

    navigateFromStatCard(section, filter = null) {
        // Navigate to the specified section
        this.showSection(section);

        // Apply filters if specified
        if (filter) {
            switch (section) {
                case 'members':
                    if (filter === 'active') {
                        // Filter to show only active members
                        const statusFilter = document.getElementById('status-filter');
                        if (statusFilter) {
                            statusFilter.value = 'active';
                            this.filterMembers();
                        }
                    }
                    break;
                case 'fees':
                    if (filter === 'pending') {
                        // Scroll to pending fees section
                        setTimeout(() => {
                            const pendingSection = document.querySelector('.pending-fees');
                            if (pendingSection) {
                                pendingSection.scrollIntoView({ behavior: 'smooth' });
                            }
                        }, 300);
                    }
                    break;
            }
        }

        // Show success message
        const sectionName = section.charAt(0).toUpperCase() + section.slice(1);
        const filterText = filter ? ` (${filter})` : '';
        this.showMessage(`Navigated to ${sectionName}${filterText}`, 'info');
    }

    // Dashboard Updates
    updateDashboard() {
        const totalMembers = this.members.length;
        const activeMembers = this.members.filter(m => m.isActive).length;
        const totalCollected = this.members.reduce((sum, m) => sum + m.totalPaid, 0);
        const totalContributions = this.contributions.reduce((sum, c) => sum + c.amount, 0);
        const totalExpenses = this.expenses.reduce((sum, e) => sum + e.amount, 0);
        const netBalance = totalCollected + totalContributions - totalExpenses;
        const pendingPayments = this.calculatePendingPayments();

        document.getElementById('total-members').textContent = totalMembers;
        document.getElementById('active-members').textContent = activeMembers;
        document.getElementById('total-collected').textContent = `₹${(totalCollected + totalContributions).toLocaleString()}`;
        document.getElementById('pending-payments').textContent = pendingPayments;

        this.renderRecentActivities();

        // Setup dashboard card clicks after updating content with a delay
        setTimeout(() => {
            this.setupDashboardCardClicks();
        }, 100);

        // Update expense and contribution summaries if on those sections
        if (document.getElementById('total-expenses')) {
            this.updateExpenseSummary();
        }
        if (document.getElementById('total-contributions')) {
            this.updateContributionSummary();
        }
    }

    calculatePendingPayments() {
        let pending = 0;
        this.members.forEach(member => {
            if (member.annualFee2023 === 0) pending++;
            if (member.annualFee2024 === 0) pending++;
            if (member.annualFee2025 === 0) pending++;
        });
        return pending;
    }

    renderRecentActivities() {
        const activitiesList = document.getElementById('recent-activities-list');
        const recentActivities = this.activities.slice(-5).reverse();
        
        if (recentActivities.length === 0) {
            activitiesList.innerHTML = '<p>No recent activities</p>';
            return;
        }

        activitiesList.innerHTML = recentActivities.map(activity => `
            <div class="activity-item">
                <strong>${activity.type}</strong>: ${activity.description}
                <br><small>${new Date(activity.timestamp).toLocaleString()}</small>
            </div>
        `).join('');
    }

    // Member Management
    openMemberModal(member = null) {
        const modal = document.getElementById('member-modal');
        const title = document.getElementById('modal-title');
        const form = document.getElementById('member-form');
        
        this.currentEditingMember = member;
        
        if (member) {
            title.textContent = 'Edit Member';
            document.getElementById('member-name').value = member.name;
            document.getElementById('member-villa').value = member.villaNo;
            document.getElementById('member-status').value = member.status;
            document.getElementById('membership-fee').value = member.membershipFee;
        } else {
            title.textContent = 'Add New Member';
            form.reset();
            document.getElementById('membership-fee').value = 3000;
        }
        
        modal.style.display = 'block';
    }

    saveMember() {
        const name = document.getElementById('member-name').value;
        const villaNo = document.getElementById('member-villa').value;
        const status = document.getElementById('member-status').value;
        const membershipFee = parseInt(document.getElementById('membership-fee').value);

        if (this.currentEditingMember) {
            // Edit existing member
            const member = this.members.find(m => m.id === this.currentEditingMember.id);
            member.name = name;
            member.villaNo = villaNo;
            member.status = status;
            member.membershipFee = membershipFee;

            this.addActivity('Member Updated', `Updated details for ${name}`);
        } else {
            // Add new member
            const newMember = {
                id: Date.now(),
                name,
                villaNo,
                status,
                membershipFee,
                annualFee2023: 0,
                annualFee2024: 0,
                annualFee2025: 0,
                totalPaid: membershipFee,
                joinDate: new Date().toISOString().split('T')[0],
                isActive: true
            };

            this.members.push(newMember);
            this.addActivity('Member Added', `Added new member: ${name}`);
        }

        this.markDataChanged();
        this.saveAllData();
        this.renderMembers();
        this.updateDashboard();
        document.getElementById('member-modal').style.display = 'none';
    }

    deleteMember(id) {
        if (confirm('Are you sure you want to delete this member?')) {
            const member = this.members.find(m => m.id === id);
            this.members = this.members.filter(m => m.id !== id);
            this.markDataChanged();
            this.saveAllData();
            this.renderMembers();
            this.updateDashboard();
            this.addActivity('Member Deleted', `Deleted member: ${member.name}`);
        }
    }

    renderMembers() {
        const thead = document.getElementById('members-table-header');
        const tbody = document.getElementById('members-table-body');
        const filteredMembers = this.getFilteredMembers();

        console.log('Rendering members:', filteredMembers.length, 'members');

        // Render dynamic headers
        this.renderMembersTableHeader(thead);

        if (filteredMembers.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="10" style="text-align: center; padding: 2rem; color: #7f8c8d;">
                        <i class="fas fa-users" style="font-size: 2rem; margin-bottom: 1rem; display: block;"></i>
                        No members found. ${this.members.length === 0 ? 'Add your first member!' : 'Try adjusting your search or filters.'}
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = filteredMembers.map((member, index) => {
            const isFoundingMember = member.status.includes('FOUNDING MEMBER');
            const isInactive = member.status.includes('Inactive') || !member.isActive;
            const rowClass = isFoundingMember ? 'founding-member-row' : '';
            const inactiveClass = isInactive ? 'inactive-member' : '';

            return `
                <tr class="${rowClass} ${inactiveClass}" data-member-id="${member.id}">
                    <td data-label="Sl No">${index + 1}</td>
                    <td data-label="Name">
                        <div class="member-name">
                            ${isFoundingMember ? '<i class="fas fa-crown founding-icon" title="Founding Member"></i>' : ''}
                            ${member.name}
                            ${isInactive ? '<i class="fas fa-pause-circle inactive-icon" title="Inactive Member"></i>' : ''}
                        </div>
                    </td>
                    <td data-label="Villa">${member.villaNo}</td>
                    <td data-label="Status"><span class="status-badge status-${member.status.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, '')}">${member.status}</span></td>
                    <td data-label="Membership">₹${member.membershipFee.toLocaleString()}</td>
                    ${this.feeYears.sort((a, b) => a.year - b.year).map(feeYear => {
                        const feeKey = `annualFee${feeYear.year}`;
                        const feeAmount = member[feeKey] || 0;
                        return `
                            <td data-label="${feeYear.year}" class="${feeAmount === 0 ? 'unpaid-fee' : 'paid-fee'} fee-cell">
                                <div class="fee-amount-container">
                                    <span class="fee-amount">₹${feeAmount.toLocaleString()}</span>
                                    <button class="btn-edit-fee" onclick="ttClub.editMemberFee(${member.id}, ${feeYear.year}, ${feeAmount})" title="Edit ${feeYear.year} fee">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                </div>
                            </td>
                        `;
                    }).join('')}
                    <td data-label="Total Paid" class="total-paid">₹${member.totalPaid.toLocaleString()}</td>
                    <td data-label="Actions" class="action-buttons">
                        <button class="btn btn-small btn-primary" onclick="ttClub.openMemberModal(${JSON.stringify(member).replace(/"/g, '&quot;')})" title="Edit Member">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn btn-small btn-danger" onclick="ttClub.deleteMember(${member.id})" title="Delete Member">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                        ${this.hasUnpaidFees(member) ?
                            `<button class="btn btn-small btn-success" onclick="ttClub.openFeeModal('${member.id}')" title="Collect Fee">
                                <i class="fas fa-money-bill-wave"></i> Collect
                            </button>` : ''
                        }
                    </td>
                </tr>
            `;
        }).join('');

        // Update member count display
        this.updateMemberCount(filteredMembers.length);

        // Add touch support for dynamically created buttons (mobile)
        if (window.innerWidth <= 768) {
            setTimeout(() => {
                this.addCollectFeeButtonTouchSupport();
            }, 100);
        }
    }

    hasUnpaidFees(member) {
        // Check if member has any unpaid fees across all fee years
        return this.feeYears.some(feeYear => {
            const feeKey = `annualFee${feeYear.year}`;
            return (member[feeKey] || 0) === 0;
        });
    }

    renderMembersTableHeader(thead) {
        const sortedFeeYears = this.feeYears.sort((a, b) => a.year - b.year);

        thead.innerHTML = `
            <tr>
                <th>Sl No</th>
                <th>Name</th>
                <th>Villa No</th>
                <th>Status</th>
                <th>Membership Fee</th>
                ${sortedFeeYears.map(feeYear =>
                    `<th>Annual Fee ${feeYear.year}</th>`
                ).join('')}
                <th>Total Paid</th>
                <th>Actions</th>
            </tr>
        `;
    }

    updateMemberCount(count) {
        // Add member count to section header if it doesn't exist
        const sectionHeader = document.querySelector('#members .section-header h2');
        if (sectionHeader) {
            const totalMembers = this.members.length;
            const foundingMembers = this.members.filter(m => m.status.includes('FOUNDING MEMBER')).length;
            sectionHeader.innerHTML = `
                Member Management
                <small style="font-weight: normal; color: #7f8c8d; font-size: 0.7em;">
                    (${count} of ${totalMembers} shown • ${foundingMembers} founding members)
                </small>
            `;
        }
    }

    getFilteredMembers() {
        // Get search and filter values with null checks
        const searchElement = document.getElementById('member-search');
        const statusElement = document.getElementById('status-filter');

        const searchTerm = searchElement ? searchElement.value.toLowerCase() : '';
        const statusFilter = statusElement ? statusElement.value : '';

        console.log('Filtering members:', {
            totalMembers: this.members.length,
            searchTerm,
            statusFilter
        });

        return this.members.filter(member => {
            const matchesSearch = !searchTerm ||
                                member.name.toLowerCase().includes(searchTerm) ||
                                member.villaNo.toLowerCase().includes(searchTerm);
            const matchesStatus = !statusFilter || member.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }

    filterMembers() {
        this.renderMembers();
    }

    // Add Activity Log
    addActivity(type, description) {
        const activity = {
            id: Date.now(),
            type,
            description,
            timestamp: new Date().toISOString()
        };

        this.activities.push(activity);
        // Save activities without auto-download
        this.saveAllData(false);
    }

    // Show user-friendly messages
    showMessage(message, type = 'info') {
        // Remove any existing message
        const existingMessage = document.getElementById('user-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        const messageDiv = document.createElement('div');
        messageDiv.id = 'user-message';
        messageDiv.className = `message ${type} show`;
        messageDiv.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: ${type === 'success' ? '#d4edda' : type === 'error' ? '#f8d7da' : '#d1ecf1'};
                color: ${type === 'success' ? '#155724' : type === 'error' ? '#721c24' : '#0c5460'};
                border: 1px solid ${type === 'success' ? '#c3e6cb' : type === 'error' ? '#f5c6cb' : '#bee5eb'};
                padding: 1rem 1.5rem;
                border-radius: 8px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                z-index: 9999;
                font-size: 0.9rem;
                max-width: 90%;
                text-align: center;
                animation: slideInDown 0.3s ease;
            ">
                ${message}
            </div>
        `;

        document.body.appendChild(messageDiv);

        // Auto-remove after 3 seconds
        setTimeout(() => {
            if (messageDiv && messageDiv.parentNode) {
                messageDiv.style.animation = 'slideOutUp 0.3s ease';
                setTimeout(() => {
                    if (messageDiv && messageDiv.parentNode) {
                        messageDiv.remove();
                    }
                }, 300);
            }
        }, 3000);
    }

    // Track data changes
    markDataChanged() {
        this.hasUnsavedChanges = true;
        this.updateSaveStatus();
    }

    updateSaveStatus() {
        const saveButton = document.getElementById('quick-save');
        if (saveButton) {
            if (this.hasUnsavedChanges) {
                saveButton.style.background = '#e74c3c';
                saveButton.title = 'You have unsaved changes - Click to save';
                saveButton.innerHTML = '<i class="fas fa-exclamation-circle"></i>';
            } else {
                saveButton.style.background = 'rgba(255,255,255,0.2)';
                saveButton.title = 'Data is saved';
                saveButton.innerHTML = '<i class="fas fa-check"></i>';
            }
        }
    }

    // Fee Management
    openFeeModal(memberId = null) {
        const modal = document.getElementById('fee-modal');
        const memberSelect = document.getElementById('fee-member');
        const feeTypeSelect = document.getElementById('fee-type');

        // Populate member dropdown
        memberSelect.innerHTML = '<option value="">Select Member</option>' +
            this.members.map(member =>
                `<option value="${member.id}">${member.name} (Villa ${member.villaNo})</option>`
            ).join('');

        // Populate fee type dropdown with active fee years
        const activeFeeYears = this.feeYears.filter(fy => fy.isActive).sort((a, b) => a.year - b.year);
        feeTypeSelect.innerHTML = '<option value="">Select Fee Type</option>' +
            activeFeeYears.map(feeYear =>
                `<option value="annual_${feeYear.year}">Annual Fee ${feeYear.year} (₹${feeYear.amount})</option>`
            ).join('');

        // Pre-select member if provided
        if (memberId) {
            memberSelect.value = memberId;
            // Trigger change event to update fee amount if needed
            memberSelect.dispatchEvent(new Event('change'));
        }

        // Set default date to today
        document.getElementById('payment-date').value = new Date().toISOString().split('T')[0];

        modal.style.display = 'block';
    }

    collectFee() {
        const memberId = parseInt(document.getElementById('fee-member').value);
        const feeType = document.getElementById('fee-type').value;
        const amount = parseInt(document.getElementById('fee-amount').value);
        const paymentDate = document.getElementById('payment-date').value;

        const member = this.members.find(m => m.id === memberId);
        if (!member) return;

        // Update member's fee record dynamically
        if (feeType.startsWith('annual_')) {
            const year = feeType.replace('annual_', '');
            const feeKey = `annualFee${year}`;
            member[feeKey] = amount;
        }

        // Update total paid by summing all fee years
        member.totalPaid = member.membershipFee +
                          this.feeYears.reduce((sum, feeYear) => {
                              const feeKey = `annualFee${feeYear.year}`;
                              return sum + (member[feeKey] || 0);
                          }, 0);

        // Record transaction
        const transaction = {
            id: Date.now(),
            memberId: member.id,
            memberName: member.name,
            type: feeType,
            amount: amount,
            date: paymentDate,
            timestamp: new Date().toISOString()
        };

        this.transactions.push(transaction);
        this.markDataChanged();
        this.saveAllData();

        this.addActivity('Fee Collected', `Collected ${feeType.replace('_', ' ')} ₹${amount} from ${member.name}`);

        this.updateDashboard();
        this.updateFeeManagement();
        this.renderMembers();

        document.getElementById('fee-modal').style.display = 'none';
        document.getElementById('fee-form').reset();
    }

    updateFeeManagement() {
        // Calculate fee summaries
        let fee2023Collected = 0, fee2023Pending = 0;
        let fee2024Collected = 0, fee2024Pending = 0;
        let fee2025Collected = 0, fee2025Pending = 0;

        this.members.forEach(member => {
            fee2023Collected += member.annualFee2023;
            fee2024Collected += member.annualFee2024;
            fee2025Collected += member.annualFee2025;

            if (member.annualFee2023 === 0) fee2023Pending += 500;
            if (member.annualFee2024 === 0) fee2024Pending += 500;
            if (member.annualFee2025 === 0) fee2025Pending += 500;
        });

        document.getElementById('fee-2023-collected').textContent = `₹${fee2023Collected.toLocaleString()}`;
        document.getElementById('fee-2023-pending').textContent = `₹${fee2023Pending.toLocaleString()}`;
        document.getElementById('fee-2024-collected').textContent = `₹${fee2024Collected.toLocaleString()}`;
        document.getElementById('fee-2024-pending').textContent = `₹${fee2024Pending.toLocaleString()}`;
        document.getElementById('fee-2025-collected').textContent = `₹${fee2025Collected.toLocaleString()}`;
        document.getElementById('fee-2025-pending').textContent = `₹${fee2025Pending.toLocaleString()}`;

        this.renderPendingFees();
    }

    // Pending Fee Management Methods
    openPendingFeeModal() {
        const modal = document.getElementById('pending-fee-modal');
        const memberSelect = document.getElementById('pending-fee-member');
        const feeTypeSelect = document.getElementById('pending-fee-type');

        // Populate member dropdown
        memberSelect.innerHTML = '<option value="">Select Member</option>' +
            this.members.map(member =>
                `<option value="${member.id}">${member.name} (Villa ${member.villaNo})</option>`
            ).join('');

        // Populate fee type dropdown with active fee years
        const activeFeeYears = this.feeYears.filter(fy => fy.isActive).sort((a, b) => a.year - b.year);
        feeTypeSelect.innerHTML = '<option value="">Select Fee Type</option>' +
            activeFeeYears.map(feeYear =>
                `<option value="Annual Fee ${feeYear.year}">Annual Fee ${feeYear.year} (₹${feeYear.amount})</option>`
            ).join('') +
            `<option value="Membership Fee">Membership Fee</option>
             <option value="Special Assessment">Special Assessment</option>
             <option value="Tournament Fee">Tournament Fee</option>
             <option value="Other">Other</option>`;

        // Set default due date to 30 days from now
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 30);
        document.getElementById('pending-fee-due-date').value = dueDate.toISOString().split('T')[0];

        modal.style.display = 'block';
    }

    savePendingFee() {
        const memberId = parseInt(document.getElementById('pending-fee-member').value);
        const feeType = document.getElementById('pending-fee-type').value;
        const amount = parseInt(document.getElementById('pending-fee-amount').value);
        const dueDate = document.getElementById('pending-fee-due-date').value;
        const notes = document.getElementById('pending-fee-notes').value;

        const member = this.members.find(m => m.id === memberId);
        if (!member) {
            this.showMessage('Member not found!', 'error');
            return;
        }

        // Check if this pending fee already exists
        const existingPending = this.pendingFees.find(pf =>
            pf.memberId === memberId && pf.feeType === feeType
        );

        if (existingPending) {
            this.showMessage('A pending fee of this type already exists for this member!', 'error');
            return;
        }

        const newPendingFee = {
            id: Date.now(),
            memberId: memberId,
            memberName: member.name,
            memberVilla: member.villaNo,
            feeType: feeType,
            amount: amount,
            dueDate: dueDate,
            notes: notes,
            status: 'Pending',
            createdDate: new Date().toISOString().split('T')[0],
            timestamp: new Date().toISOString()
        };

        this.pendingFees.push(newPendingFee);
        this.markDataChanged();
        this.saveAllData();

        this.addActivity('Pending Fee Added', `Added pending ${feeType} ₹${amount} for ${member.name}`);
        this.renderPendingFees();
        this.showMessage(`Pending fee added for ${member.name}`, 'success');

        document.getElementById('pending-fee-modal').style.display = 'none';
        document.getElementById('pending-fee-form').reset();
    }

    renderPendingFees() {
        const pendingList = document.getElementById('pending-fees-list');
        if (!pendingList) {
            console.error('Pending fees list element not found');
            return;
        }

        if (this.pendingFees.length === 0) {
            pendingList.innerHTML = '<p class="empty-state">No pending fees added. Click "Add Pending Fee" to create pending fee records.</p>';
            return;
        }

        pendingList.innerHTML = this.pendingFees.map(pending => `
            <div class="pending-item">
                <div class="pending-info">
                    <strong>${pending.memberName}</strong> (Villa ${pending.memberVilla})
                    <br><small>${pending.feeType} - ₹${pending.amount.toLocaleString()}</small>
                    <br><small>Due: ${new Date(pending.dueDate).toLocaleDateString()}</small>
                    ${pending.notes ? `<br><small class="notes">Note: ${pending.notes}</small>` : ''}
                </div>
                <div class="pending-actions">
                    <button class="btn btn-small btn-success" onclick="ttClub.collectPendingFee(${pending.id})" title="Collect Fee">
                        <i class="fas fa-money-bill-wave"></i> Collect
                    </button>
                    <button class="btn btn-small btn-danger" onclick="ttClub.deletePendingFee(${pending.id})" title="Remove Pending Fee">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');

        // Add mobile touch support for pending fee buttons
        if (window.innerWidth <= 768) {
            setTimeout(() => {
                this.addCollectFeeButtonTouchSupport();
            }, 100);
        }
    }

    collectPendingFee(pendingId) {
        const pending = this.pendingFees.find(pf => pf.id === pendingId);
        if (!pending) {
            this.showMessage('Pending fee not found!', 'error');
            return;
        }

        const member = this.members.find(m => m.id === pending.memberId);
        if (!member) {
            this.showMessage('Member not found!', 'error');
            return;
        }

        // Update member's fee record based on fee type
        if (pending.feeType === 'Annual Fee 2023') {
            member.annualFee2023 = pending.amount;
        } else if (pending.feeType === 'Annual Fee 2024') {
            member.annualFee2024 = pending.amount;
        } else if (pending.feeType === 'Annual Fee 2025') {
            member.annualFee2025 = pending.amount;
        } else if (pending.feeType === 'Membership Fee') {
            member.membershipFee += pending.amount;
        }

        // Update total paid
        member.totalPaid = member.membershipFee + member.annualFee2023 + member.annualFee2024 + member.annualFee2025;

        // Record transaction
        const transaction = {
            id: Date.now(),
            memberId: member.id,
            memberName: member.name,
            type: pending.feeType.toLowerCase().replace(/\s+/g, '_'),
            amount: pending.amount,
            date: new Date().toISOString().split('T')[0],
            timestamp: new Date().toISOString(),
            fromPending: true,
            pendingFeeId: pendingId
        };

        this.transactions.push(transaction);

        // Remove from pending fees
        this.pendingFees = this.pendingFees.filter(pf => pf.id !== pendingId);

        this.markDataChanged();
        this.saveAllData();

        this.addActivity('Pending Fee Collected', `Collected ${pending.feeType} ₹${pending.amount} from ${member.name}`);

        this.updateDashboard();
        this.renderMembers();
        this.renderPendingFees();

        this.showMessage(`Successfully collected ${pending.feeType} ₹${pending.amount} from ${member.name}`, 'success');
    }

    deletePendingFee(pendingId) {
        const pending = this.pendingFees.find(pf => pf.id === pendingId);
        if (!pending) {
            this.showMessage('Pending fee not found!', 'error');
            return;
        }

        if (confirm(`Are you sure you want to remove the pending ${pending.feeType} for ${pending.memberName}?`)) {
            this.pendingFees = this.pendingFees.filter(pf => pf.id !== pendingId);
            this.markDataChanged();
            this.saveAllData();

            this.addActivity('Pending Fee Removed', `Removed pending ${pending.feeType} for ${pending.memberName}`);
            this.renderPendingFees();
            this.showMessage('Pending fee removed successfully', 'success');
        }
    }

    quickCollectFee(memberId, feeType, amount) {
        const member = this.members.find(m => m.id === memberId);
        if (!member) {
            console.error('Member not found:', memberId);
            this.showMessage('Member not found!', 'error');
            return;
        }

        console.log('Quick collecting fee:', { memberId, feeType, amount, member });

        // Convert fee type to the correct format
        let feeTypeKey;
        if (feeType === 'Annual Fee 2023') {
            feeTypeKey = 'annual_2023';
        } else if (feeType === 'Annual Fee 2024') {
            feeTypeKey = 'annual_2024';
        } else if (feeType === 'Annual Fee 2025') {
            feeTypeKey = 'annual_2025';
        } else {
            // Fallback to the old method
            feeTypeKey = feeType.toLowerCase().replace('annual fee ', 'annual_');
        }

        switch(feeTypeKey) {
            case 'annual_2023':
                member.annualFee2023 = amount;
                break;
            case 'annual_2024':
                member.annualFee2024 = amount;
                break;
            case 'annual_2025':
                member.annualFee2025 = amount;
                break;
        }

        member.totalPaid = member.membershipFee + member.annualFee2023 + member.annualFee2024 + member.annualFee2025;

        const transaction = {
            id: Date.now(),
            memberId: member.id,
            memberName: member.name,
            type: feeTypeKey,
            amount: amount,
            date: new Date().toISOString().split('T')[0],
            timestamp: new Date().toISOString()
        };

        this.transactions.push(transaction);
        this.markDataChanged();
        this.saveAllData();

        this.addActivity('Fee Collected', `Quick collected ${feeType} ₹${amount} from ${member.name}`);

        this.updateDashboard();
        this.updateFeeManagement();
        this.renderMembers();

        this.showMessage(`Successfully collected ${feeType} ₹${amount} from ${member.name}`, 'success');
    }

    // Invoice Management
    generateInvoice() {
        const memberId = prompt('Enter Member ID or select from list:');
        if (!memberId) return;

        const member = this.members.find(m => m.id == memberId || m.name.toLowerCase().includes(memberId.toLowerCase()));
        if (!member) {
            alert('Member not found!');
            return;
        }

        const invoice = {
            id: Date.now(),
            invoiceNumber: `INV-${Date.now()}`,
            memberId: member.id,
            memberName: member.name,
            memberVilla: member.villaNo,
            items: [],
            total: 0,
            date: new Date().toISOString().split('T')[0],
            status: 'Generated'
        };

        // Add pending fees to invoice
        if (member.annualFee2023 === 0) {
            invoice.items.push({ description: 'Annual Fee 2023', amount: 500 });
            invoice.total += 500;
        }
        if (member.annualFee2024 === 0) {
            invoice.items.push({ description: 'Annual Fee 2024', amount: 500 });
            invoice.total += 500;
        }
        if (member.annualFee2025 === 0) {
            invoice.items.push({ description: 'Annual Fee 2025', amount: 500 });
            invoice.total += 500;
        }

        if (invoice.items.length === 0) {
            alert('No pending fees for this member!');
            return;
        }

        this.invoices.push(invoice);
        this.saveData('invoices', this.invoices);
        this.addActivity('Invoice Generated', `Generated invoice ${invoice.invoiceNumber} for ${member.name}`);
        this.renderInvoices();

        // Open print dialog
        this.printInvoice(invoice);
    }

    printInvoice(invoice) {
        const printWindow = window.open('', '_blank');
        const invoiceHTML = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Invoice ${invoice.invoiceNumber}</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    .header { text-align: center; margin-bottom: 30px; }
                    .invoice-details { margin-bottom: 20px; }
                    .items-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                    .items-table th, .items-table td { border: 1px solid #ddd; padding: 10px; text-align: left; }
                    .items-table th { background-color: #f2f2f2; }
                    .total { text-align: right; font-size: 18px; font-weight: bold; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>Passion Hills Table Tennis Club</h1>
                    <h2>Invoice</h2>
                </div>
                <div class="invoice-details">
                    <p><strong>Invoice Number:</strong> ${invoice.invoiceNumber}</p>
                    <p><strong>Date:</strong> ${invoice.date}</p>
                    <p><strong>Member:</strong> ${invoice.memberName}</p>
                    <p><strong>Villa No:</strong> ${invoice.memberVilla}</p>
                </div>
                <table class="items-table">
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${invoice.items.map(item => `
                            <tr>
                                <td>${item.description}</td>
                                <td>₹${item.amount}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                <div class="total">
                    <p>Total Amount: ₹${invoice.total}</p>
                </div>
            </body>
            </html>
        `;

        printWindow.document.write(invoiceHTML);
        printWindow.document.close();
        printWindow.print();
    }

    renderInvoices() {
        const invoiceList = document.getElementById('invoice-list');

        if (this.invoices.length === 0) {
            invoiceList.innerHTML = '<p>No invoices generated yet.</p>';
            return;
        }

        invoiceList.innerHTML = this.invoices.map(invoice => `
            <div class="invoice-item">
                <div class="invoice-info">
                    <h4>${invoice.invoiceNumber}</h4>
                    <p>${invoice.memberName} (Villa ${invoice.memberVilla}) - ₹${invoice.total}</p>
                    <small>Date: ${invoice.date}</small>
                </div>
                <div class="invoice-actions">
                    <button class="btn btn-small btn-primary" onclick="ttClub.printInvoice(${JSON.stringify(invoice).replace(/"/g, '&quot;')})">
                        <i class="fas fa-print"></i> Print
                    </button>
                    <button class="btn btn-small btn-danger" onclick="ttClub.deleteInvoice(${invoice.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    deleteInvoice(id) {
        if (confirm('Are you sure you want to delete this invoice?')) {
            this.invoices = this.invoices.filter(inv => inv.id !== id);
            this.saveData('invoices', this.invoices);
            this.renderInvoices();
            this.addActivity('Invoice Deleted', `Deleted invoice`);
        }
    }

    // Reports and Analytics
    updateReports() {
        this.updateFinancialSummary();
        this.updateMemberStatistics();
    }

    updateFinancialSummary() {
        const financialSummary = document.getElementById('financial-summary');

        const totalMembershipFees = this.members.reduce((sum, m) => sum + m.membershipFee, 0);
        const totalAnnualFees2023 = this.members.reduce((sum, m) => sum + m.annualFee2023, 0);
        const totalAnnualFees2024 = this.members.reduce((sum, m) => sum + m.annualFee2024, 0);
        const totalAnnualFees2025 = this.members.reduce((sum, m) => sum + m.annualFee2025, 0);
        const totalMemberFees = totalMembershipFees + totalAnnualFees2023 + totalAnnualFees2024 + totalAnnualFees2025;

        const totalContributions = this.contributions.reduce((sum, c) => sum + c.amount, 0);
        const totalExpenses = this.expenses.reduce((sum, e) => sum + e.amount, 0);
        const totalIncome = totalMemberFees + totalContributions;
        const netBalance = totalIncome - totalExpenses;

        const pendingAmount = this.calculateTotalPendingAmount();

        financialSummary.innerHTML = `
            <div class="financial-item">
                <strong>Total Membership Fees:</strong> ₹${totalMembershipFees.toLocaleString()}
            </div>
            <div class="financial-item">
                <strong>Annual Fees 2023:</strong> ₹${totalAnnualFees2023.toLocaleString()}
            </div>
            <div class="financial-item">
                <strong>Annual Fees 2024:</strong> ₹${totalAnnualFees2024.toLocaleString()}
            </div>
            <div class="financial-item">
                <strong>Annual Fees 2025:</strong> ₹${totalAnnualFees2025.toLocaleString()}
            </div>
            <div class="financial-item">
                <strong>Total Contributions:</strong> ₹${totalContributions.toLocaleString()}
            </div>
            <div class="financial-item total-line">
                <strong>Total Income:</strong> ₹${totalIncome.toLocaleString()}
            </div>
            <div class="financial-item">
                <strong>Total Expenses:</strong> ₹${totalExpenses.toLocaleString()}
            </div>
            <div class="financial-item ${netBalance >= 0 ? 'total-line' : 'pending-line'}">
                <strong>Net Balance:</strong> ₹${netBalance.toLocaleString()}
            </div>
            <div class="financial-item pending-line">
                <strong>Pending Fees:</strong> ₹${pendingAmount.toLocaleString()}
            </div>
        `;
    }

    calculateTotalPendingAmount() {
        let pending = 0;
        this.members.forEach(member => {
            if (member.annualFee2023 === 0) pending += 500;
            if (member.annualFee2024 === 0) pending += 500;
            if (member.annualFee2025 === 0) pending += 500;
        });
        return pending;
    }

    updateMemberStatistics() {
        const memberStatistics = document.getElementById('member-statistics');

        const totalMembers = this.members.length;
        const foundingMembers = this.members.filter(m => m.status === 'FOUNDING MEMBER').length;
        const newMembers = this.members.filter(m => m.status === 'NEW MEMBER').length;
        const approvedMembers = this.members.filter(m => m.status === 'APPROVED FOR MEMBERSHIP').length;
        const inactiveMembers = this.members.filter(m => !m.isActive).length;

        memberStatistics.innerHTML = `
            <div class="stat-item">
                <strong>Total Members:</strong> ${totalMembers}
            </div>
            <div class="stat-item">
                <strong>Founding Members:</strong> ${foundingMembers}
            </div>
            <div class="stat-item">
                <strong>New Members:</strong> ${newMembers}
            </div>
            <div class="stat-item">
                <strong>Approved Members:</strong> ${approvedMembers}
            </div>
            <div class="stat-item">
                <strong>Inactive Members:</strong> ${inactiveMembers}
            </div>
        `;
    }

    // Export Functions
    exportMembers() {
        const csvContent = this.generateMembersCSV();
        this.downloadCSV(csvContent, 'tt_club_members.csv');
        this.addActivity('Data Export', 'Exported members data to CSV');
    }

    exportFinancialData() {
        const csvContent = this.generateFinancialCSV();
        this.downloadCSV(csvContent, 'tt_club_financial.csv');
        this.addActivity('Data Export', 'Exported financial data to CSV');
    }

    generateMembersCSV() {
        const headers = ['Sl No', 'Name', 'Villa No', 'Status', 'Membership Fee', 'Annual Fee 2023', 'Annual Fee 2024', 'Annual Fee 2025', 'Total Paid', 'Join Date', 'Active'];

        const rows = this.members.map((member, index) => [
            index + 1,
            member.name,
            member.villaNo,
            member.status,
            member.membershipFee,
            member.annualFee2023,
            member.annualFee2024,
            member.annualFee2025,
            member.totalPaid,
            member.joinDate,
            member.isActive ? 'Yes' : 'No'
        ]);

        return [headers, ...rows].map(row => row.join(',')).join('\n');
    }

    generateFinancialCSV() {
        const headers = ['Transaction ID', 'Date', 'Member Name', 'Villa No', 'Fee Type', 'Amount'];

        const rows = this.transactions.map(transaction => [
            transaction.id,
            transaction.date,
            transaction.memberName,
            this.members.find(m => m.id === transaction.memberId)?.villaNo || '',
            transaction.type.replace('_', ' ').toUpperCase(),
            transaction.amount
        ]);

        return [headers, ...rows].map(row => row.join(',')).join('\n');
    }

    downloadCSV(csvContent, filename) {
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');

        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }

    // Backup and Download Functions
    backupDatabase() {
        // Create a backup by downloading the current database
        this.downloadDatabaseJSON();
        this.addActivity('Database Backup', 'Database backup downloaded');
        this.showMessage('Database backup downloaded successfully!', 'success');
    }

    downloadDatabaseJSON() {
        const data = {
            members: this.members,
            transactions: this.transactions,
            invoices: this.invoices,
            activities: this.activities,
            expenses: this.expenses,
            contributions: this.contributions,
            pendingFees: this.pendingFees,
            feeYears: this.feeYears,
            settings: this.settings,
            exportDate: new Date().toISOString(),
            version: '2.0'
        };

        const jsonContent = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
        const link = document.createElement('a');

        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            link.setAttribute('href', url);
            link.setAttribute('download', `ttclub_database_${timestamp}.json`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }

        this.addActivity('Data Export', 'Downloaded complete database JSON');
    }

    // Fee Years Management Methods
    openFeeYearsModal() {
        const modal = document.getElementById('fee-years-modal');
        const currentYear = new Date().getFullYear();

        // Set default year to next year
        document.getElementById('new-fee-year').value = currentYear + 1;

        this.renderCurrentFeeYears();
        modal.style.display = 'block';
    }

    renderCurrentFeeYears() {
        const container = document.getElementById('current-fee-years');

        if (this.feeYears.length === 0) {
            container.innerHTML = '<p class="empty-state">No fee years configured.</p>';
            return;
        }

        // Sort fee years by year
        const sortedYears = [...this.feeYears].sort((a, b) => a.year - b.year);

        container.innerHTML = sortedYears.map(feeYear => `
            <div class="fee-year-item ${!feeYear.isActive ? 'inactive' : ''}">
                <div class="fee-year-info">
                    <strong>${feeYear.year}</strong>
                    <span class="fee-amount">₹${feeYear.amount.toLocaleString()}</span>
                    ${feeYear.description ? `<small>${feeYear.description}</small>` : ''}
                </div>
                <div class="fee-year-actions">
                    <button class="btn btn-small ${feeYear.isActive ? 'btn-warning' : 'btn-success'}"
                            onclick="ttClub.toggleFeeYear(${feeYear.year})"
                            title="${feeYear.isActive ? 'Deactivate' : 'Activate'} this fee year">
                        <i class="fas fa-${feeYear.isActive ? 'pause' : 'play'}"></i>
                    </button>
                    <button class="btn btn-small btn-primary"
                            onclick="ttClub.editFeeYear(${feeYear.year})"
                            title="Edit fee year">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-small btn-danger"
                            onclick="ttClub.deleteFeeYear(${feeYear.year})"
                            title="Delete fee year">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    addFeeYear() {
        const year = parseInt(document.getElementById('new-fee-year').value);
        const amount = parseInt(document.getElementById('new-fee-amount').value);
        const description = document.getElementById('fee-year-description').value || `Annual Fee ${year}`;

        // Check if year already exists
        const existingYear = this.feeYears.find(fy => fy.year === year);
        if (existingYear) {
            this.showMessage(`Fee year ${year} already exists!`, 'error');
            return;
        }

        // Add new fee year
        const newFeeYear = {
            year: year,
            amount: amount,
            description: description,
            isActive: true
        };

        this.feeYears.push(newFeeYear);

        // Add the new fee year columns to all existing members
        this.members.forEach(member => {
            const feeKey = `annualFee${year}`;
            if (!(feeKey in member)) {
                member[feeKey] = 0; // Initialize with 0 (unpaid)
            }
        });

        this.markDataChanged();
        this.saveAllData();

        this.addActivity('Fee Year Added', `Added fee year ${year} with amount ₹${amount}`);
        this.showMessage(`Fee year ${year} added successfully!`, 'success');

        // Refresh displays
        this.renderCurrentFeeYears();
        this.updateFeeManagement();
        this.renderMembers();

        // Reset form
        document.getElementById('add-fee-year-form').reset();
        document.getElementById('new-fee-year').value = new Date().getFullYear() + 1;
    }

    toggleFeeYear(year) {
        const feeYear = this.feeYears.find(fy => fy.year === year);
        if (!feeYear) return;

        feeYear.isActive = !feeYear.isActive;

        this.markDataChanged();
        this.saveAllData();

        this.addActivity('Fee Year Updated', `${feeYear.isActive ? 'Activated' : 'Deactivated'} fee year ${year}`);
        this.showMessage(`Fee year ${year} ${feeYear.isActive ? 'activated' : 'deactivated'}`, 'success');

        this.renderCurrentFeeYears();
        this.updateFeeManagement();
    }

    editFeeYear(year) {
        const feeYear = this.feeYears.find(fy => fy.year === year);
        if (!feeYear) return;

        const newAmount = prompt(`Enter new amount for ${year}:`, feeYear.amount);
        if (newAmount === null) return; // User cancelled

        const amount = parseInt(newAmount);
        if (isNaN(amount) || amount < 0) {
            this.showMessage('Please enter a valid amount', 'error');
            return;
        }

        const newDescription = prompt(`Enter description for ${year}:`, feeYear.description);
        if (newDescription === null) return; // User cancelled

        feeYear.amount = amount;
        feeYear.description = newDescription;

        this.markDataChanged();
        this.saveAllData();

        this.addActivity('Fee Year Updated', `Updated fee year ${year}: ₹${amount} - ${newDescription}`);
        this.showMessage(`Fee year ${year} updated successfully!`, 'success');

        this.renderCurrentFeeYears();
    }

    deleteFeeYear(year) {
        const feeYear = this.feeYears.find(fy => fy.year === year);
        if (!feeYear) return;

        // Check if any member has paid this fee
        const feeKey = `annualFee${year}`;
        const hasPaidMembers = this.members.some(member => member[feeKey] > 0);

        if (hasPaidMembers) {
            if (!confirm(`Some members have already paid fees for ${year}. Deleting this fee year will remove all payment records for this year. Are you sure?`)) {
                return;
            }
        } else {
            if (!confirm(`Are you sure you want to delete fee year ${year}?`)) {
                return;
            }
        }

        // Remove fee year
        this.feeYears = this.feeYears.filter(fy => fy.year !== year);

        // Remove fee year data from all members
        this.members.forEach(member => {
            delete member[feeKey];
            // Recalculate total paid
            member.totalPaid = member.membershipFee +
                              this.feeYears.reduce((sum, fy) => {
                                  const key = `annualFee${fy.year}`;
                                  return sum + (member[key] || 0);
                              }, 0);
        });

        // Remove related transactions
        this.transactions = this.transactions.filter(t => t.type !== `annual_${year}`);

        this.markDataChanged();
        this.saveAllData();

        this.addActivity('Fee Year Deleted', `Deleted fee year ${year}`);
        this.showMessage(`Fee year ${year} deleted successfully!`, 'success');

        // Refresh displays
        this.renderCurrentFeeYears();
        this.updateFeeManagement();
        this.renderMembers();
    }

    // Member Fee Editing Methods
    editMemberFee(memberId, year, currentAmount) {
        const member = this.members.find(m => m.id === memberId);
        if (!member) {
            this.showMessage('Member not found!', 'error');
            return;
        }

        const modal = document.getElementById('edit-member-fee-modal');

        // Store current editing context
        this.currentEditingFee = {
            memberId: memberId,
            year: year,
            currentAmount: currentAmount
        };

        // Populate modal with member and fee information
        document.getElementById('edit-fee-member-name').textContent = `${member.name} (Villa ${member.villaNo})`;
        document.getElementById('edit-fee-year').textContent = year;
        document.getElementById('edit-fee-current-amount').textContent = currentAmount.toLocaleString();
        document.getElementById('edit-fee-new-amount').value = currentAmount;

        // Reset form
        document.getElementById('edit-fee-reason').value = '';
        document.getElementById('edit-fee-notes').value = '';

        modal.style.display = 'block';
    }

    updateMemberFee() {
        if (!this.currentEditingFee) {
            this.showMessage('No fee editing context found!', 'error');
            return;
        }

        const { memberId, year } = this.currentEditingFee;
        const newAmount = parseInt(document.getElementById('edit-fee-new-amount').value);
        const reason = document.getElementById('edit-fee-reason').value;
        const notes = document.getElementById('edit-fee-notes').value;

        if (newAmount < 0) {
            this.showMessage('Fee amount cannot be negative!', 'error');
            return;
        }

        const member = this.members.find(m => m.id === memberId);
        if (!member) {
            this.showMessage('Member not found!', 'error');
            return;
        }

        // Update member's fee record
        const feeKey = `annualFee${year}`;
        const oldAmount = member[feeKey] || 0;
        member[feeKey] = newAmount;

        // Recalculate total paid
        member.totalPaid = member.membershipFee +
                          this.feeYears.reduce((sum, feeYear) => {
                              const key = `annualFee${feeYear.year}`;
                              return sum + (member[key] || 0);
                          }, 0);

        // Create adjustment transaction record
        const adjustmentTransaction = {
            id: Date.now(),
            memberId: member.id,
            memberName: member.name,
            type: `fee_adjustment_${year}`,
            amount: newAmount - oldAmount, // Can be negative for reductions
            date: new Date().toISOString().split('T')[0],
            timestamp: new Date().toISOString(),
            isAdjustment: true,
            adjustmentReason: reason,
            adjustmentNotes: notes,
            originalAmount: oldAmount,
            newAmount: newAmount
        };

        this.transactions.push(adjustmentTransaction);

        this.markDataChanged();
        this.saveAllData();

        // Log the activity
        const changeDescription = newAmount > oldAmount ?
            `increased from ₹${oldAmount.toLocaleString()} to ₹${newAmount.toLocaleString()}` :
            newAmount < oldAmount ?
            `reduced from ₹${oldAmount.toLocaleString()} to ₹${newAmount.toLocaleString()}` :
            `corrected (no amount change)`;

        this.addActivity('Fee Adjusted',
            `${member.name}'s ${year} fee ${changeDescription}. Reason: ${reason}`);

        // Refresh displays
        this.updateDashboard();
        this.renderMembers();
        this.updateFeeManagement();

        // Show success message
        this.showMessage(
            `Successfully updated ${member.name}'s ${year} fee to ₹${newAmount.toLocaleString()}`,
            'success'
        );

        // Close modal and reset
        document.getElementById('edit-member-fee-modal').style.display = 'none';
        this.currentEditingFee = null;
    }



    // Expense Management Methods
    openExpenseModal(expense = null) {
        const modal = document.getElementById('expense-modal');
        const title = document.getElementById('expense-modal-title');
        const form = document.getElementById('expense-form');

        this.currentEditingExpense = expense;

        if (expense) {
            title.textContent = 'Edit Expense';
            document.getElementById('expense-date').value = expense.date;
            document.getElementById('expense-description').value = expense.description;
            document.getElementById('expense-category').value = expense.category;
            document.getElementById('expense-amount').value = expense.amount;
            document.getElementById('expense-paid-by').value = expense.paidBy;
            document.getElementById('expense-status').value = expense.status;
            document.getElementById('expense-receipt').value = expense.receipt || '';
        } else {
            title.textContent = 'Add New Expense';
            form.reset();
            document.getElementById('expense-date').value = new Date().toISOString().split('T')[0];
        }

        modal.style.display = 'block';
    }

    saveExpense() {
        const date = document.getElementById('expense-date').value;
        const description = document.getElementById('expense-description').value;
        const category = document.getElementById('expense-category').value;
        const amount = parseFloat(document.getElementById('expense-amount').value);
        const paidBy = document.getElementById('expense-paid-by').value;
        const status = document.getElementById('expense-status').value;
        const receipt = document.getElementById('expense-receipt').value;

        if (this.currentEditingExpense) {
            // Edit existing expense
            const expense = this.expenses.find(e => e.id === this.currentEditingExpense.id);
            expense.date = date;
            expense.description = description;
            expense.category = category;
            expense.amount = amount;
            expense.paidBy = paidBy;
            expense.status = status;
            expense.receipt = receipt;

            this.addActivity('Expense Updated', `Updated expense: ${description}`);
        } else {
            // Add new expense
            const newExpense = {
                id: Date.now(),
                date,
                description,
                category,
                amount,
                paidBy,
                status,
                receipt,
                timestamp: new Date().toISOString()
            };

            this.expenses.push(newExpense);
            this.addActivity('Expense Added', `Added new expense: ${description} - ₹${amount}`);
        }

        this.markDataChanged();
        this.saveAllData();
        this.renderExpenses();
        this.updateDashboard();
        document.getElementById('expense-modal').style.display = 'none';
    }

    deleteExpense(id) {
        if (confirm('Are you sure you want to delete this expense?')) {
            const expense = this.expenses.find(e => e.id === id);
            this.expenses = this.expenses.filter(e => e.id !== id);
            this.markDataChanged();
            this.saveAllData();
            this.renderExpenses();
            this.updateDashboard();
            this.addActivity('Expense Deleted', `Deleted expense: ${expense.description}`);
        }
    }

    renderExpenses() {
        const tbody = document.getElementById('expenses-table-body');
        const filteredExpenses = this.getFilteredExpenses();

        tbody.innerHTML = filteredExpenses.map(expense => `
            <tr>
                <td>${new Date(expense.date).toLocaleDateString()}</td>
                <td>${expense.description}</td>
                <td>${expense.category}</td>
                <td>₹${expense.amount.toLocaleString()}</td>
                <td>${expense.paidBy}</td>
                <td><span class="status-badge status-${expense.status.toLowerCase()}">${expense.status}</span></td>
                <td>${expense.receipt ? '✓' : '-'}</td>
                <td class="action-buttons">
                    <button class="btn btn-small btn-primary" onclick="ttClub.openExpenseModal(${JSON.stringify(expense).replace(/"/g, '&quot;')})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-small btn-danger" onclick="ttClub.deleteExpense(${expense.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');

        this.updateExpenseSummary();
    }

    getFilteredExpenses() {
        const searchTerm = document.getElementById('expense-search')?.value.toLowerCase() || '';
        const categoryFilter = document.getElementById('expense-category-filter')?.value || '';
        const statusFilter = document.getElementById('expense-status-filter')?.value || '';

        return this.expenses.filter(expense => {
            const matchesSearch = expense.description.toLowerCase().includes(searchTerm) ||
                                expense.paidBy.toLowerCase().includes(searchTerm);
            const matchesCategory = !categoryFilter || expense.category === categoryFilter;
            const matchesStatus = !statusFilter || expense.status === statusFilter;

            return matchesSearch && matchesCategory && matchesStatus;
        });
    }

    filterExpenses() {
        this.renderExpenses();
    }

    updateExpenseSummary() {
        const totalExpenses = this.expenses.reduce((sum, e) => sum + e.amount, 0);
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const monthExpenses = this.expenses
            .filter(e => {
                const expenseDate = new Date(e.date);
                return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
            })
            .reduce((sum, e) => sum + e.amount, 0);
        const pendingReimbursements = this.expenses
            .filter(e => e.status === 'Pending')
            .reduce((sum, e) => sum + e.amount, 0);

        document.getElementById('total-expenses').textContent = `₹${totalExpenses.toLocaleString()}`;
        document.getElementById('month-expenses').textContent = `₹${monthExpenses.toLocaleString()}`;
        document.getElementById('pending-reimbursements').textContent = `₹${pendingReimbursements.toLocaleString()}`;
    }

    // Contribution Management Methods
    openContributionModal(contribution = null) {
        const modal = document.getElementById('contribution-modal');
        const title = document.getElementById('contribution-modal-title');
        const form = document.getElementById('contribution-form');

        this.currentEditingContribution = contribution;

        if (contribution) {
            title.textContent = 'Edit Contribution';
            document.getElementById('contribution-date').value = contribution.date;
            document.getElementById('contribution-name').value = contribution.contributorName;
            document.getElementById('contribution-location').value = contribution.location;
            document.getElementById('contribution-type').value = contribution.type;
            document.getElementById('contribution-purpose').value = contribution.purpose;
            document.getElementById('contribution-amount').value = contribution.amount;
            document.getElementById('contribution-receipt').value = contribution.receipt || '';
        } else {
            title.textContent = 'Add New Contribution';
            form.reset();
            document.getElementById('contribution-date').value = new Date().toISOString().split('T')[0];
        }

        modal.style.display = 'block';
    }

    saveContribution() {
        const date = document.getElementById('contribution-date').value;
        const contributorName = document.getElementById('contribution-name').value;
        const location = document.getElementById('contribution-location').value;
        const type = document.getElementById('contribution-type').value;
        const purpose = document.getElementById('contribution-purpose').value;
        const amount = parseFloat(document.getElementById('contribution-amount').value);
        const receipt = document.getElementById('contribution-receipt').value;

        if (this.currentEditingContribution) {
            // Edit existing contribution
            const contribution = this.contributions.find(c => c.id === this.currentEditingContribution.id);
            contribution.date = date;
            contribution.contributorName = contributorName;
            contribution.location = location;
            contribution.type = type;
            contribution.purpose = purpose;
            contribution.amount = amount;
            contribution.receipt = receipt;

            this.addActivity('Contribution Updated', `Updated contribution from ${contributorName}`);
        } else {
            // Add new contribution
            const newContribution = {
                id: Date.now(),
                date,
                contributorName,
                location,
                type,
                purpose,
                amount,
                receipt,
                timestamp: new Date().toISOString()
            };

            this.contributions.push(newContribution);
            this.addActivity('Contribution Added', `Added new contribution from ${contributorName} - ₹${amount}`);
        }

        this.markDataChanged();
        this.saveAllData();
        this.renderContributions();
        this.updateDashboard();
        document.getElementById('contribution-modal').style.display = 'none';
    }

    deleteContribution(id) {
        if (confirm('Are you sure you want to delete this contribution?')) {
            const contribution = this.contributions.find(c => c.id === id);
            this.contributions = this.contributions.filter(c => c.id !== id);
            this.markDataChanged();
            this.saveAllData();
            this.renderContributions();
            this.updateDashboard();
            this.addActivity('Contribution Deleted', `Deleted contribution from ${contribution.contributorName}`);
        }
    }

    renderContributions() {
        const tbody = document.getElementById('contributions-table-body');
        const filteredContributions = this.getFilteredContributions();

        tbody.innerHTML = filteredContributions.map(contribution => `
            <tr>
                <td>${new Date(contribution.date).toLocaleDateString()}</td>
                <td>${contribution.contributorName}</td>
                <td>${contribution.location}</td>
                <td><span class="status-badge type-${contribution.type.toLowerCase().replace(' ', '-')}">${contribution.type}</span></td>
                <td>${contribution.purpose}</td>
                <td>₹${contribution.amount.toLocaleString()}</td>
                <td>${contribution.receipt ? '✓' : '-'}</td>
                <td class="action-buttons">
                    <button class="btn btn-small btn-primary" onclick="ttClub.openContributionModal(${JSON.stringify(contribution).replace(/"/g, '&quot;')})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-small btn-danger" onclick="ttClub.deleteContribution(${contribution.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');

        this.updateContributionSummary();
    }

    getFilteredContributions() {
        const searchTerm = document.getElementById('contribution-search')?.value.toLowerCase() || '';
        const typeFilter = document.getElementById('contribution-type-filter')?.value || '';

        return this.contributions.filter(contribution => {
            const matchesSearch = contribution.contributorName.toLowerCase().includes(searchTerm) ||
                                contribution.location.toLowerCase().includes(searchTerm) ||
                                contribution.purpose.toLowerCase().includes(searchTerm);
            const matchesType = !typeFilter || contribution.type === typeFilter;

            return matchesSearch && matchesType;
        });
    }

    filterContributions() {
        this.renderContributions();
    }

    updateContributionSummary() {
        const totalContributions = this.contributions.reduce((sum, c) => sum + c.amount, 0);
        const memberContributions = this.contributions
            .filter(c => c.type === 'Member')
            .reduce((sum, c) => sum + c.amount, 0);
        const externalContributions = this.contributions
            .filter(c => c.type === 'External' || c.type === 'Donation' || c.type === 'Sponsorship')
            .reduce((sum, c) => sum + c.amount, 0);

        document.getElementById('total-contributions').textContent = `₹${totalContributions.toLocaleString()}`;
        document.getElementById('member-contributions').textContent = `₹${memberContributions.toLocaleString()}`;
        document.getElementById('external-contributions').textContent = `₹${externalContributions.toLocaleString()}`;
    }

    // Import JSON Database
    importDatabaseJSON(file) {
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target.result);

                // Validate the imported data structure
                if (this.validateImportedData(importedData)) {
                    // Confirm before importing
                    if (confirm('This will replace all current data. Are you sure you want to import this database?')) {
                        this.members = importedData.members || [];
                        this.transactions = importedData.transactions || [];
                        this.invoices = importedData.invoices || [];
                        this.activities = importedData.activities || [];
                        this.expenses = importedData.expenses || [];
                        this.contributions = importedData.contributions || [];
                        this.pendingFees = importedData.pendingFees || [];
                        this.feeYears = importedData.feeYears || [];
                        this.settings = importedData.settings || this.getDefaultSettings();

                        // Save imported data
                        this.saveAllData();

                        // Refresh all views
                        this.updateDashboard();
                        this.renderMembers();
                        this.updateFeeManagement();
                        this.renderInvoices();
                        this.renderExpenses();
                        this.renderContributions();
                        this.updateReports();

                        this.addActivity('Data Import', `Imported database from ${file.name}`);
                        alert('Database imported successfully!');
                    }
                } else {
                    alert('Invalid JSON file format. Please select a valid TT Club database file.');
                }
            } catch (error) {
                console.error('Error importing JSON:', error);
                alert('Error reading JSON file. Please check the file format.');
            }
        };

        reader.readAsText(file);
    }

    validateImportedData(data) {
        // Check if the imported data has the required structure
        return data &&
               typeof data === 'object' &&
               Array.isArray(data.members) &&
               Array.isArray(data.transactions) &&
               Array.isArray(data.invoices) &&
               Array.isArray(data.activities) &&
               Array.isArray(data.expenses) &&
               Array.isArray(data.contributions) &&
               (data.pendingFees === undefined || Array.isArray(data.pendingFees));
    }
}

// Initialize the application
let ttClub;

function initializeApp() {
    console.log('Attempting to initialize app...');
    console.log('TTClubDatabase available:', typeof TTClubDatabase !== 'undefined');

    if (typeof TTClubDatabase !== 'undefined') {
        try {
            ttClub = new TTClubManager();
            console.log('TTClubManager initialized successfully');
        } catch (error) {
            console.error('Failed to initialize TTClubManager:', error);
            showInitError('Failed to initialize application: ' + error.message);
        }
    } else {
        console.log('TTClubDatabase not ready, retrying...');
        setTimeout(initializeApp, 50); // Retry after 50ms
    }
}

function showInitError(message) {
    // Remove loading screen if it exists
    const overlay = document.getElementById('loading-overlay');
    if (overlay) overlay.remove();

    // Show error message
    document.body.insertAdjacentHTML('beforeend', `
        <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                   background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                   text-align: center; z-index: 10000;">
            <h3 style="color: #e74c3c; margin-bottom: 1rem;">Initialization Error</h3>
            <p>${message}</p>
            <button onclick="location.reload()" style="padding: 0.5rem 1rem; background: #3498db; color: white; border: none; border-radius: 4px; cursor: pointer;">
                Reload Page
            </button>
        </div>
    `);
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, starting initialization...');
    initializeApp();
});
