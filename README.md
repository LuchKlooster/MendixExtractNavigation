# Mendix Navigation Extractor - Version 1.2.1


This tool extracts all navigation items from a Mendix project using the Mendix Platform SDK and Model SDK, then exports them to a CSV file.

## 🚀 What's New in v1.2.1?

### ✨ User Roles!
The script now automatically detects and retrieves user roles for pages, microflows, and nanoflows!

## Features

- Extracts navigation from all profiles (Desktop, Tablet, Phone)
- Captures menu items, sub-menus, and nested navigation structures
- Menu items have role information reported
- Exports home pages and role-based home pages
- Includes icon information and alternative text
- Preserves navigation hierarchy with level indicators
- Outputs to clean CSV format

## Prerequisites

1. **Node.js** (version 14 or higher)
2. **Mendix Platform SDK & Model SDK**
3. **Mendix Account** with API access
4. **Personal Access Token (PAT)** from Mendix Platform

```typescript
  `
  **Getting your Personal Access Token:**

  1. Go to the Mendix Developer Portal
  2. Navigate to your profile settings
  3. Generate a Personal Access Token
  4. Copy the token and set it as the `MENDIX_TOKEN` environment variable
  `
  ```

## Installation

### 1. Install Node.js dependencies

```bash
npm init -y
npm install mendixplatformsdk mendixmodelsdk
```

### 2. Get your Mendix API credentials

1. Go to [Mendix Platform](https://sprintr.home.mendix.com/)
2. Navigate to your profile settings
3. Generate a Personal Access Token (PAT)
4. Note your project ID (found in the project settings)

## ⚙️ Configuration

You can configure the script in two ways:

### Option 1: Environment Variables (Recommended)

Set environment variables:

```bash
export MENDIX_API_KEY="your-personal-access-token"
export MENDIX_PROJECT_ID="project-guid"
```

### Option 2: Edit the CONFIG object in the script

Open `extract-navigation.js` and modify the CONFIG object:

```javascript
const CONFIG = {
    projectId: process.env.MENDIX_PROJECT_ID || "your-project-id",
    branch: process.env.MENDIX_BRANCH || "main",
    outputFile: process.env.OUTPUT_FILE || "navigation-items.csv",
    debug: process.env.DEBUG === "true" || false  // ← NEW!
};
```

## 🔧 Usage

### Standard Usage
```bash
node extract-navigation.js
```

The script will:
1. Connect to the Mendix Platform
2. Open your project's working copy
3. Extract all navigation items
4. Generate a CSV file with the results

### With Debug Mode (recommended for troubleshooting)
```bash
DEBUG=true node extract-navigation.js
```

Debug mode shows:
- Which menu items are being processed
- Whether it's a page, microflow, or nanoflow
- Which module roles are found
- Which user roles are mapped
- Why some items don't have roles

---

## Output Format

The generated CSV file contains the following columns:

| Column | Description |
|--------|-------------|
| Document Name | Name of the navigation document |
| Profile Type | Desktop, Tablet, or Phone |
| Item Type | MenuItem, HomePage, or RoleBasedHomePage |
| Level | Nesting level (0 for top-level items) |
| Caption | Display text of the menu item |
| Path | Full navigation path (e.g., "Home > Settings > Users") |
| Target Page | Page or MF or NF that opens when clicked |
| Icon | Icon identifier |
| Alternative Text | Alt text for the menu item |
| Allowed User Roles | Allowed User Roles |


## 📊 Example Output

### Menu Item to a Page:
```
Menu item: Dashboard
  Target: Dashboard_Overview
  → Checking page: Dashboard_Overview
    Module roles found: Administrator, User
    User roles mapped: Administrator, User
```

### Menu Item to a Microflow:
```
Menu item: Export Data
  Target: [MF: ExportToExcel]
  → Checking microflow: ExportToExcel
    Module roles found: Administrator
    User roles mapped: Administrator
```

### Menu Item to a Nanoflow (that opens a page):
```
Menu item: Customer Details
  Target: [NF: ValidateAndShow]
  → Checking nanoflow: ValidateAndShow
    Nanoflow opens page: CustomerDetails
    Module roles found: Sales.User, Sales.Admin
    User roles mapped: SalesUser, Administrator
```

### Menu Item to a Nanoflow (pure client-side):
```
Menu item: Calculate Total
  Target: [NF: CalculatePrice]
  → Checking nanoflow: CalculatePrice
    Nanoflow doesn't open a page (client-side logic only)
```

### Menu Item without Target:
```
Menu item: Submenu Header
  ⚠️ No target page/action found
```

## 📈 Statistics

The summary now shows detailed statistics:

```
==================================================
SUMMARY
==================================================
Total items: 45
With pages/actions: 38
With icons: 35
With user role restrictions: 32
```

**Interpretation:**
- **45 items total** - All menu items including headers
- **38 with pages/actions** - Items that lead somewhere (page/microflow)
- **35 with icons** - Items with an icon
- **32 with user role restrictions** - Items with specific security

If `With user role restrictions` is much lower than `With pages/actions`:
- Many items might have `Allow all roles`
- Use DEBUG mode to investigate

---

## Troubleshooting

### Common Issues

**Authentication Error**
```
Error: Authentication failed
```
- Verify your username and API key
- Ensure your PAT has not expired
- Check that you have access to the project

**Project Not Found**
```
Error: Project not found
```
- Verify the project ID is correct
- Ensure you have access to the project
- Check that the branch name is correct

**Model Loading Errors**
```
Error: Cannot load navigation documents
```
- Ensure the project has navigation configured
- Try specifying a specific revision instead of -1
- Check that the model version is compatible

## Advanced Usage

### Extract from Specific Revision

Modify the CONFIG to use a specific revision number:

```javascript
revision: 123, // Use revision 123 instead of latest
```

### Change Output File Location

```javascript
outputFile: "/path/to/output/navigation-export.csv"
```

### Filter by Profile Type

Modify the `extractNavigationItems` function to only process specific profiles:

```javascript
// Only extract desktop navigation
if (navDoc.desktopProfile) {
    const profile = navDoc.desktopProfile;
    extractProfileItems(profile, "Desktop", navDoc.qualifiedName, navigationItems);
}
// Comment out tablet and phone sections
```

## API Reference

### Main Functions

#### `extractNavigationItems(workingCopy)`
Extracts all navigation items from the working copy.

**Parameters:**
- `workingCopy`: OnlineWorkingCopy object from Mendix SDK

**Returns:**
- Array of navigation item objects

#### `extractProfileItems(profile, profileType, documentName, navigationItems)`
Extracts items from a specific navigation profile.

#### `extractMenuItems(items, profileType, documentName, parentPath, navigationItems, level)`
Recursively extracts menu items and sub-menus.

## Resources

- [Mendix Platform SDK Documentation](https://docs.mendix.com/apidocs-mxsdk/mxsdk/)
- [Mendix Model SDK Documentation](https://apidocs.rnd.mendix.com/modelsdk/latest/)
- [Mendix Navigation Documentation](https://docs.mendix.com/refguide/navigation/)

## License

This is a utility script provided as-is for working with Mendix projects.

## 📞 Support

For questions or issues:
1. First try **DEBUG mode**: `DEBUG=true node extract-navigation.js`
2. Check console output for warnings
3. Verify security settings in Mendix Studio Pro
4. Contact Convent Systems

---

## 🎉 Changelog

### Version 1.2.1 (Latest)
- 🐛 **Nanoflow → Page detection** - Nanoflows that open pages now show the correct user roles
- 📊 **Better coverage** - More menu items now have role information
- 🔍 **Smart analysis** - Analyzes nanoflow actions to find ShowPage actions

### Version 1.2.0
- ✨ **Microflow security support** - Now also retrieves roles for microflows
- ✨ **Auto-detection** - Automatically recognizes pages, microflows, and nanoflows
- 🐛 **Debug mode** - See exactly what's happening and why
- 📊 **Better logging** - Clear warnings and error messages
- 🔧 **More robust code** - Better null checks and error handling

### Version 1.1.1
- 🐛 Fixed null reference errors
- 🔧 Better array handling

### Version 1.1.0
- ✨ Added user roles feature
- 📊 New CSV column

### Version 1.0.0
- 🎉 Initial release

---

**Mendix SDK Navigation Extractor v1.2.1**
© Convent Systems - 2025
