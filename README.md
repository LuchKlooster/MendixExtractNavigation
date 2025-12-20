# Mendix Navigation Extractor

This tool extracts all navigation items from a Mendix project using the Mendix Platform SDK and Model SDK, then exports them to a CSV file.

## Features

- Extracts navigation from all profiles (Desktop, Tablet, Phone)
- Captures menu items, sub-menus, and nested navigation structures
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

## Configuration

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
    outputFile: process.env.OUTPUT_FILE || "navigation-items.csv"
};
```

## Usage

Run the script:

```bash
node extract-mendix-navigation.js
```

The script will:
1. Connect to the Mendix Platform
2. Open your project's working copy
3. Extract all navigation items
4. Generate a CSV file with the results

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

## Example Output

```csv
Document Name,Profile Type,Item Type,Level,Caption,Path,Target Page,Icon,Alternative Text
Navigation,Desktop,HomePage,,"Home Page",,MyModule.HomePage,,
Navigation,Desktop,MenuItem,0,Home,Home,MyModule.HomePage,glyphicon-home,
Navigation,Desktop,MenuItem,0,Settings,Settings,,,
Navigation,Desktop,MenuItem,1,Users,Settings > Users,MyModule.UserManagement,,
Navigation,Desktop,MenuItem,1,Roles,Settings > Roles,MyModule.RoleManagement,,
```

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

## Support

For issues related to:
- **Mendix SDK**: Check Mendix documentation or community forums
- **This Script**: Review the troubleshooting section above

## Version History

- **1.0.0**: Initial release with support for all navigation profiles
