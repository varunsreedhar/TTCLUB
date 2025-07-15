// Passion Hills Table Tennis Club Database
// All data stored as JavaScript arrays and objects

const TTClubDatabase = {
    // Club Members
    members: [
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
            name: 'JOSEPH MARCUS (BENNY)',
            villaNo: '22',
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
            id: 4,
            name: 'JAIMON/ZACHAIRAH',
            villaNo: '11/6',
            status: 'FOUNDING MEMBER (Inactive)',
            membershipFee: 3000,
            annualFee2023: 0,
            annualFee2024: 0,
            annualFee2025: 0,
            totalPaid: 3000,
            joinDate: '2023-01-01',
            isActive: false
        },
        {
            id: 5,
            name: 'BINU',
            villaNo: '23',
            status: 'FOUNDING MEMBER',
            membershipFee: 3000,
            annualFee2023: 500,
            annualFee2024: 500,
            annualFee2025: 500,
            totalPaid: 4500,
            joinDate: '2023-01-01',
            isActive: true
        },
        {
            id: 6,
            name: 'RENITH',
            villaNo: '25',
            status: 'FOUNDING MEMBER',
            membershipFee: 3000,
            annualFee2023: 500,
            annualFee2024: 500,
            annualFee2025: 500,
            totalPaid: 4500,
            joinDate: '2023-01-01',
            isActive: true
        },
        {
            id: 7,
            name: 'AJITH',
            villaNo: '27',
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
            id: 8,
            name: 'JACOB',
            villaNo: '04',
            status: 'FOUNDING MEMBER (Inactive)',
            membershipFee: 3000,
            annualFee2023: 0,
            annualFee2024: 0,
            annualFee2025: 0,
            totalPaid: 3000,
            joinDate: '2023-01-01',
            isActive: false
        },
        {
            id: 9,
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
        },
        {
            id: 10,
            name: 'MATHEWS',
            villaNo: '05',
            status: 'NEW MEMBER',
            membershipFee: 3000,
            annualFee2023: 0,
            annualFee2024: 500,
            annualFee2025: 500,
            totalPaid: 4000,
            joinDate: '2023-08-01',
            isActive: true
        },
        {
            id: 11,
            name: 'JAISON',
            villaNo: '02',
            status: 'NEW MEMBER',
            membershipFee: 3000,
            annualFee2023: 0,
            annualFee2024: 500,
            annualFee2025: 500,
            totalPaid: 4000,
            joinDate: '2023-09-01',
            isActive: true
        },
        {
            id: 12,
            name: 'ANSON',
            villaNo: '02',
            status: 'NEW MEMBER',
            membershipFee: 3000,
            annualFee2023: 0,
            annualFee2024: 500,
            annualFee2025: 500,
            totalPaid: 4000,
            joinDate: '2023-10-01',
            isActive: true
        },
        {
            id: 13,
            name: 'ALEX',
            villaNo: '10',
            status: 'APPROVED FOR MEMBERSHIP',
            membershipFee: 0,
            annualFee2023: 0,
            annualFee2024: 0,
            annualFee2025: 500,
            totalPaid: 500,
            joinDate: '2024-01-01',
            isActive: true,
            pendingAmount: 3000
        },
        {
            id: 14,
            name: 'JOHN',
            villaNo: '10',
            status: 'APPROVED FOR MEMBERSHIP',
            membershipFee: 0,
            annualFee2023: 0,
            annualFee2024: 0,
            annualFee2025: 500,
            totalPaid: 500,
            joinDate: '2024-01-01',
            isActive: true,
            pendingAmount: 3000
        }
    ],

    // Transactions (cleared as requested)
    transactions: [],

    // Invoices
    invoices: [],

    // Expenses
    expenses: [],

    // Individual and External Contributions
    contributions: [],

    // Pending Fees (manually added)
    pendingFees: [],

    // Activity Log
    activities: [
        {
            id: Date.now(),
            type: 'System',
            description: 'Database initialized with member data',
            timestamp: new Date().toISOString()
        }
    ],

    // Fee Years Configuration
    feeYears: [
        {
            year: 2023,
            amount: 500,
            description: 'Annual Fee 2023',
            isActive: true
        },
        {
            year: 2024,
            amount: 500,
            description: 'Annual Fee 2024',
            isActive: true
        },
        {
            year: 2025,
            amount: 500,
            description: 'Annual Fee 2025',
            isActive: true
        }
    ],

    // Club Settings
    settings: {
        clubName: 'Passion Hills Table Tennis Club',
        defaultMembershipFee: 3000,
        defaultAnnualFee: 500,
        currentYear: 2025
    }
};

// Export for use in main application
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TTClubDatabase;
} else if (typeof window !== 'undefined') {
    window.TTClubDatabase = TTClubDatabase;
}
