# Passion Hills Table Tennis Club Management System

A comprehensive web-based management system for table tennis club operations, built with vanilla JavaScript, HTML, and CSS with JSON file-based data storage.

## Features

### 🏓 Member Management
- Add new members with villa numbers and status
- Edit existing member details
- Delete members with confirmation
- Search and filter members by name, villa, or status
- Track membership fees and annual fees

### 💰 Fee Management
- Collect annual fees for multiple years (2023, 2024, 2025)
- Quick fee collection from pending list
- Track fee summaries by year
- View pending payments with one-click collection

### 📄 Invoice System
- Generate professional invoices for pending fees
- Print invoices with club branding
- Manage invoice history
- Track invoice status

### 📊 Dashboard & Reports
- Real-time club statistics
- Financial summaries and member analytics
- Export data to CSV format
- Activity logging for audit trail

### 💾 Data Management
- Client-side JSON file-based data storage
- Automatic data backup via file downloads
- Import/export database as JSON files
- localStorage caching for performance
- No server required - runs entirely in browser

## Installation & Setup

### Simple Setup (Recommended)
1. Download all files to a folder
2. Open `index.html` in any modern web browser
3. The application will work immediately with sample data
4. Data is automatically saved to browser localStorage
5. Use "Download JSON" to backup your data
6. Use "Import JSON" to restore from backup

### Alternative: HTTP Server (Optional)
If you prefer to run via HTTP server:
1. Use Python's built-in server:
   ```bash
   python3 -m http.server 8080
   ```
2. Open `http://localhost:8080`
3. Or use any other web server (Apache, Nginx, etc.)

## File Structure

```
├── index.html          # Main application interface
├── app.js             # Application logic and functionality
├── styles.css         # Styling and responsive design
├── data/
│   └── database.json  # Sample database file (for reference)
└── README.md          # This file
```

## Data Storage

The application uses a combination of:
- **localStorage**: For caching and primary data storage
- **JSON files**: For backup and data portability
- **File downloads**: For data export and backup

### Data Structure
The JSON database contains:
- **members**: Member information and fee records
- **transactions**: Payment transaction history
- **invoices**: Generated invoice records
- **activities**: System activity log
- **settings**: Club configuration

## Usage Guide

### Adding Members
1. Go to the "Members" section
2. Click "Add New Member"
3. Fill in member details (name, villa number, status)
4. Set initial membership fee (default: ₹3000)
5. Save the member

### Collecting Fees
1. Go to the "Fees" section
2. Click "Collect Fee" or use quick collection from pending list
3. Select member and fee type
4. Enter amount and payment date
5. Confirm collection

### Generating Invoices
1. Go to the "Invoices" section
2. Click "Generate Invoice"
3. Enter member name or ID
4. System automatically includes pending fees
5. Print or save the invoice

### Data Backup
1. Go to the "Reports" section
2. Click "Backup Database" for server backup
3. Click "Download JSON" for local backup
4. Backups include all data with timestamps

## Member Status Types
- **FOUNDING MEMBER**: Original club members
- **NEW MEMBER**: Recently joined members
- **APPROVED FOR MEMBERSHIP**: Pending full membership
- **Inactive**: Members who are no longer active

## Default Fee Structure
- **Membership Fee**: ₹3,000 (one-time)
- **Annual Fee**: ₹500 per year
- **Years Tracked**: 2023, 2024, 2025

## Browser Compatibility
- Chrome/Chromium (recommended)
- Firefox
- Safari
- Edge

## Data Security
- All data stored locally in JSON files
- No external dependencies or cloud services
- Regular backup functionality included
- Data can be easily exported and imported

## Troubleshooting

### Server Connection Issues
- If Node.js server fails, the app falls back to localStorage
- Check if port 3000 is available
- Ensure `data/` directory has write permissions

### Data Not Saving
- Check browser console for errors
- Verify server is running
- Try refreshing the page
- Use "Download JSON" to backup current data

### Performance Issues
- Large member lists (>1000) may slow down rendering
- Consider archiving old data periodically
- Use search/filter to navigate large datasets

## Customization

### Club Information
Edit the `settings` section in `database.json`:
```json
{
  "settings": {
    "clubName": "Passion Hills Table Tennis Club",
    "defaultMembershipFee": 3000,
    "defaultAnnualFee": 500,
    "currentYear": 2025
  }
}
```

### Styling
Modify `styles.css` to change:
- Colors and themes
- Layout and spacing
- Responsive breakpoints
- Print styles

## Support
For issues or questions:
1. Check the browser console for error messages
2. Verify all files are in the correct locations
3. Ensure proper file permissions
4. Try the localStorage fallback mode

## Version History
- **v1.0**: Initial release with full functionality
- JSON file-based storage
- Complete member and fee management
- Invoice generation and reporting
