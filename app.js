// Table Tennis Club Management System
class TTClubManager {
    constructor() {
        this.members = [];
        this.transactions = [];
        this.invoices = [];
        this.activities = [];
        this.settings = {};
        this.currentEditingMember = null;
        this.dataFile = null; // Will store the loaded JSON file reference
        this.hasUnsavedChanges = false;

        this.initializeApp();
    }

    // Data Management - JSON File Based (Client-side)
    loadAllData() {
        // Try to load from localStorage first (as cache)
        const cachedData = this.loadFromLocalStorage('database');
        if (cachedData) {
            this.members = cachedData.members || [];
            this.transactions = cachedData.transactions || [];
            this.invoices = cachedData.invoices || [];
            this.activities = cachedData.activities || [];
            this.settings = cachedData.settings || this.getDefaultSettings();
            return true;
        } else {
            // Load initial data if no cache exists
            this.loadInitialData();
            return true;
        }
    }

    saveAllData(autoDownload = false) {
        const data = {
            members: this.members,
            transactions: this.transactions,
            invoices: this.invoices,
            activities: this.activities,
            settings: this.settings,
            lastUpdated: new Date().toISOString()
        };

        // Save to localStorage as cache
        this.saveToLocalStorage('database', data);

        // Mark as saved
        this.hasUnsavedChanges = false;
        this.updateSaveStatus();

        // Only auto-download if explicitly requested
        if (autoDownload) {
            this.downloadDatabaseJSON();
        }

        // Show save indicator instead
        this.showSaveIndicator();

        return true;
    }

    // Load initial data
    loadInitialData() {
        this.members = this.getInitialMembers();
        this.transactions = this.getInitialTransactions();
        this.invoices = [];
        this.activities = [
            {
                id: Date.now(),
                type: 'System',
                description: 'Application initialized with sample data',
                timestamp: new Date().toISOString()
            }
        ];
        this.settings = this.getDefaultSettings();

        // Save initial data
        this.saveAllData();
    }

    // Storage methods
    saveToLocalStorage(key, data) {
        localStorage.setItem(`ttclub_${key}`, JSON.stringify(data));
    }

    loadFromLocalStorage(key) {
        const data = localStorage.getItem(`ttclub_${key}`);
        return data ? JSON.parse(data) : null;
    }

    getDefaultSettings() {
        return {
            clubName: 'Passion Hills Table Tennis Club',
            defaultMembershipFee: 3000,
            defaultAnnualFee: 500,
            currentYear: 2025
        };
    }

    getInitialTransactions() {
        return [
            {
                id: 1704067200000,
                memberId: 1,
                memberName: 'PRAVEEN',
                type: 'membership_fee',
                amount: 3000,
                date: '2023-01-01',
                timestamp: '2023-01-01T00:00:00.000Z'
            },
            {
                id: 1704067200001,
                memberId: 1,
                memberName: 'PRAVEEN',
                type: 'annual_2023',
                amount: 500,
                date: '2023-03-01',
                timestamp: '2023-03-01T00:00:00.000Z'
            }
        ];
    }

    // Initialize the application
    initializeApp() {
        this.showLoading();

        // Load data from JSON file
        this.loadAllData();

        this.setupNavigation();
        this.setupModals();
        this.setupEventListeners();
        this.setupMobileEnhancements();
        this.updateDashboard();
        this.renderMembers();
        this.updateFeeManagement();
        this.updateSaveStatus();

        this.hideLoading();
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
    }

    addTouchSupport() {
        // Add touch feedback to buttons
        const buttons = document.querySelectorAll('.btn, .nav-btn');
        buttons.forEach(btn => {
            btn.addEventListener('touchstart', () => {
                btn.style.transform = 'scale(0.95)';
            });

            btn.addEventListener('touchend', () => {
                setTimeout(() => {
                    btn.style.transform = '';
                }, 100);
            });
        });
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

    // Get initial members data
    getInitialMembers() {
        return [
            {
                id: 1,
                name: 'PRAVEEN',
                villaNo: '16',
                status: 'FOUNDING MEMBER',
                membershipFee: 3000,
                annualFee2023: 500,
                annualFee2024: 500,
                annualFee2025: 0,
                totalPaid: 4000,
                joinDate: '2023-01-01',
                isActive: true
            },
            {
                id: 2,
                name: 'JOSEPH',
                villaNo: '20',
                status: 'FOUNDING MEMBER',
                membershipFee: 3000,
                annualFee2023: 500,
                annualFee2024: 500,
                annualFee2025: 0,
                totalPaid: 4000,
                joinDate: '2023-01-01',
                isActive: true
            },
            {
                id: 3,
                name: 'VARUN',
                villaNo: '26',
                status: 'NEW MEMBER',
                membershipFee: 3000,
                annualFee2023: 500,
                annualFee2024: 500,
                annualFee2025: 500,
                totalPaid: 4500,
                joinDate: '2023-06-01',
                isActive: true
            }
        ];
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
    }

    // Dashboard Updates
    updateDashboard() {
        const totalMembers = this.members.length;
        const activeMembers = this.members.filter(m => m.isActive).length;
        const totalCollected = this.members.reduce((sum, m) => sum + m.totalPaid, 0);
        const pendingPayments = this.calculatePendingPayments();

        document.getElementById('total-members').textContent = totalMembers;
        document.getElementById('active-members').textContent = activeMembers;
        document.getElementById('total-collected').textContent = `₹${totalCollected.toLocaleString()}`;
        document.getElementById('pending-payments').textContent = pendingPayments;

        this.renderRecentActivities();
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
        const tbody = document.getElementById('members-table-body');
        const filteredMembers = this.getFilteredMembers();
        
        tbody.innerHTML = filteredMembers.map((member, index) => `
            <tr>
                <td>${index + 1}</td>
                <td>${member.name}</td>
                <td>${member.villaNo}</td>
                <td><span class="status-badge status-${member.status.toLowerCase().replace(/\s+/g, '-')}">${member.status}</span></td>
                <td>₹${member.membershipFee.toLocaleString()}</td>
                <td>₹${member.annualFee2023.toLocaleString()}</td>
                <td>₹${member.annualFee2024.toLocaleString()}</td>
                <td>₹${member.annualFee2025.toLocaleString()}</td>
                <td>₹${member.totalPaid.toLocaleString()}</td>
                <td class="action-buttons">
                    <button class="btn btn-small btn-primary" onclick="ttClub.openMemberModal(${JSON.stringify(member).replace(/"/g, '&quot;')})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-small btn-danger" onclick="ttClub.deleteMember(${member.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    getFilteredMembers() {
        const searchTerm = document.getElementById('member-search').value.toLowerCase();
        const statusFilter = document.getElementById('status-filter').value;
        
        return this.members.filter(member => {
            const matchesSearch = member.name.toLowerCase().includes(searchTerm) || 
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
    openFeeModal() {
        const modal = document.getElementById('fee-modal');
        const memberSelect = document.getElementById('fee-member');

        // Populate member dropdown
        memberSelect.innerHTML = '<option value="">Select Member</option>' +
            this.members.map(member =>
                `<option value="${member.id}">${member.name} (Villa ${member.villaNo})</option>`
            ).join('');

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

        // Update member's fee record
        switch(feeType) {
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

        // Update total paid
        member.totalPaid = member.membershipFee + member.annualFee2023 + member.annualFee2024 + member.annualFee2025;

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

    renderPendingFees() {
        const pendingList = document.getElementById('pending-fees-list');
        const pendingFees = [];

        this.members.forEach(member => {
            if (member.annualFee2023 === 0) {
                pendingFees.push({
                    member: member,
                    feeType: 'Annual Fee 2023',
                    amount: 500
                });
            }
            if (member.annualFee2024 === 0) {
                pendingFees.push({
                    member: member,
                    feeType: 'Annual Fee 2024',
                    amount: 500
                });
            }
            if (member.annualFee2025 === 0) {
                pendingFees.push({
                    member: member,
                    feeType: 'Annual Fee 2025',
                    amount: 500
                });
            }
        });

        if (pendingFees.length === 0) {
            pendingList.innerHTML = '<p>No pending fees!</p>';
            return;
        }

        pendingList.innerHTML = pendingFees.map(pending => `
            <div class="pending-item">
                <div>
                    <strong>${pending.member.name}</strong> (Villa ${pending.member.villaNo})
                    <br><small>${pending.feeType} - ₹${pending.amount}</small>
                </div>
                <button class="btn btn-small btn-success" onclick="ttClub.quickCollectFee(${pending.member.id}, '${pending.feeType}', ${pending.amount})">
                    Collect
                </button>
            </div>
        `).join('');
    }

    quickCollectFee(memberId, feeType, amount) {
        const member = this.members.find(m => m.id === memberId);
        if (!member) return;

        const feeTypeKey = feeType.toLowerCase().replace('annual fee ', 'annual_');

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
        this.saveData('members', this.members);
        this.saveData('transactions', this.transactions);

        this.addActivity('Fee Collected', `Quick collected ${feeType} ₹${amount} from ${member.name}`);

        this.updateDashboard();
        this.updateFeeManagement();
        this.renderMembers();
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
        const totalCollected = totalMembershipFees + totalAnnualFees2023 + totalAnnualFees2024 + totalAnnualFees2025;

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
            <div class="financial-item total-line">
                <strong>Total Collected:</strong> ₹${totalCollected.toLocaleString()}
            </div>
            <div class="financial-item pending-line">
                <strong>Pending Amount:</strong> ₹${pendingAmount.toLocaleString()}
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
            settings: this.settings,
            exportDate: new Date().toISOString(),
            version: '1.0'
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
                        this.settings = importedData.settings || this.getDefaultSettings();

                        // Save imported data
                        this.saveAllData();

                        // Refresh all views
                        this.updateDashboard();
                        this.renderMembers();
                        this.updateFeeManagement();
                        this.renderInvoices();
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
               Array.isArray(data.activities);
    }
}

// Initialize the application
let ttClub;
document.addEventListener('DOMContentLoaded', () => {
    ttClub = new TTClubManager();
});
