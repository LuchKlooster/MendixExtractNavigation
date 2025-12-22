/** 
 *       
 *      ███  ███  ███
 *      ███▄▄███▄▄███
 *       ███████████     Mendix SDK Navigation Extractor - Ver. 1.0.0
 *       ████▀▀▀████     Extracts pages from actions and icons from code property
 *       ████   ████     Usage: node extract-navigation.js
 *     ███████████████ 
 *     CONVENT SYSTEMS
 *
 */

const { MendixPlatformClient } = require("mendixplatformsdk");
const fs = require("fs");

const CONFIG = {
    projectId: process.env.MENDIX_PROJECT_ID || "542db4de-9b24-48cf-93d5-1ce757594249",
    branch: process.env.MENDIX_BRANCH || "main",
    outputFile: process.env.OUTPUT_FILE || "navigation-items.csv"
};

// Glyphicon code to name mapping (common ones)
const GLYPHICON_MAP = {
    57344: "asterisk",
    57345: "plus",
    57346: "euro",
    57348: "minus",
    57349: "cloud",
    57350: "envelope",
    57351: "pencil",
    57352: "glass",
    57353: "music",
    57354: "search",
    57355: "heart",
    57356: "star",
    57357: "star-empty",
    57358: "user",
    57359: "film",
    57360: "th-large",
    57361: "th",
    57362: "th-list",
    57363: "ok",
    57364: "remove",
    57365: "zoom-in",
    57366: "zoom-out",
    57367: "off",
    57368: "signal",
    57369: "cog",
    57370: "trash",
    57371: "home",
    57372: "file",
    57373: "time",
    57374: "road",
    57375: "download-alt",
    57376: "download",
    57377: "upload",
    57378: "inbox",
    57379: "play-circle",
    57380: "repeat",
    57381: "refresh",
    57382: "list-alt",
    57383: "lock",
    57384: "flag",
    57385: "headphones",
    57386: "volume-off",
    57387: "volume-down",
    57388: "volume-up",
    57389: "qrcode",
    57390: "barcode",
    57391: "tag",
    57392: "tags",
    57393: "book",
    57394: "bookmark",
    57395: "print",
    57396: "camera",
    57397: "font",
    57398: "bold",
    57399: "italic",
    57400: "text-height",
    57401: "text-width",
    57402: "align-left",
    57403: "align-center",
    57404: "align-right",
    57405: "align-justify",
    57406: "list",
    57407: "indent-left",
    57408: "indent-right",
    57409: "facetime-video",
    57410: "picture",
    57411: "map-marker",
    57412: "adjust",
    57413: "tint",
    57414: "edit",
    57415: "share",
    57416: "check",
    57417: "move",
    57418: "step-backward",
    57419: "fast-backward",
    57420: "backward",
    57421: "play",
    57422: "pause",
    57423: "stop",
    57424: "forward",
    57425: "fast-forward",
    57426: "step-forward",
    57427: "eject",
    57428: "chevron-left",
    57429: "chevron-right",
    57430: "plus-sign",
    57431: "minus-sign",
    57432: "remove-sign",
    57433: "ok-sign",
    57434: "question-sign",
    57435: "info-sign",
    57436: "screenshot",
    57437: "remove-circle",
    57438: "ok-circle",
    57439: "ban-circle",
    57440: "arrow-left",
    57441: "arrow-right",
    57442: "arrow-up",
    57443: "arrow-down",
    57444: "share-alt",
    57445: "resize-full",
    57446: "resize-small",
    57447: "exclamation-sign",
    57448: "gift",
    57449: "leaf",
    57450: "fire",
    57451: "eye-open",
    57452: "eye-close",
    57453: "warning-sign",
    57454: "plane",
    57455: "calendar",
    57456: "random",
    57457: "comment",
    57458: "magnet",
    57459: "chevron-up",
    57460: "chevron-down",
    57461: "retweet",
    57462: "shopping-cart",
    57463: "folder-close",
    57464: "folder-open",
    57465: "resize-vertical",
    57466: "resize-horizontal",
    57467: "hdd",
    57468: "bullhorn",
    57469: "bell",
    57470: "certificate",
    57471: "thumbs-up",
    57472: "thumbs-down",
    57473: "hand-right",
    57474: "hand-left",
    57475: "hand-up",
    57476: "hand-down",
    57477: "circle-arrow-right",
    57478: "circle-arrow-left",
    57479: "circle-arrow-up",
    57480: "circle-arrow-down",
    57481: "globe",
    57482: "wrench",
    57483: "tasks",
    57484: "filter",
    57485: "briefcase",
    57486: "fullscreen",
    57487: "dashboard",
    57488: "paperclip",
    57489: "heart-empty",
    57490: "link",
    57491: "phone",
    57492: "pushpin",
    57493: "usd",
    57494: "gbp",
    57495: "sort",
    57496: "sort-by-alphabet",
    57497: "sort-by-alphabet-alt",
    57498: "sort-by-order",
    57499: "sort-by-order-alt",
    57500: "sort-by-attributes",
    57501: "sort-by-attributes-alt",
    57502: "unchecked",
    57503: "expand",
    57504: "collapse-down",
    57505: "collapse-up",
    57506: "log-in",
    57507: "flash",
    57508: "log-out",
    57509: "new-window",
    57510: "record",
    57511: "save",
    57512: "open",
    57513: "saved",
    57514: "import",
    57515: "export",
    57516: "send",
    57517: "floppy-disk",
    57518: "floppy-saved",
    57519: "floppy-remove",
    57520: "floppy-save",
    57521: "floppy-open",
    57522: "credit-card",
    57523: "transfer",
    57524: "cutlery",
    57525: "header",
    57526: "compressed",
    57527: "earphone",
    57528: "phone-alt",
    57529: "tower",
    57530: "stats",
    57531: "sd-video",
    57532: "hd-video",
    57533: "subtitles",
    57534: "sound-stereo",
    57535: "sound-dolby",
    57536: "sound-5-1",
    57537: "sound-6-1",
    57538: "sound-7-1",
    57539: "copyright-mark",
    57540: "registration-mark",
    57541: "cloud-download",
    57542: "cloud-upload",
    57543: "tree-conifer",
    57544: "tree-deciduous",
    57545: "cd",
    57546: "save-file",
    57547: "open-file",
    57548: "level-up",
    57549: "copy",
    57550: "paste",
    57551: "alert",
    57552: "equalizer",
    57553: "king",
    57554: "queen",
    57555: "pawn",
    57556: "bishop",
    57557: "knight",
    57558: "baby-formula",
    57559: "tent",
    57560: "blackboard",
    57561: "bed",
    57562: "apple",
    57563: "erase",
    57564: "hourglass",
    57565: "lamp",
    57566: "duplicate",
    57567: "piggy-bank",
    57568: "scissors",
    57569: "bitcoin",
    57572: "yen",
    57574: "ruble",
    57576: "scale",
    57577: "ice-lolly",
    57578: "ice-lolly-tasted",
    57579: "education",
    57580: "option-horizontal",
    57581: "option-vertical",
    57582: "menu-hamburger",
    57583: "modal-window",
    57584: "oil",
    57585: "grain",
    57586: "sunglasses",
    57587: "text-size",
    57588: "text-color",
    57589: "text-background",
    57590: "object-align-top",
    57591: "object-align-bottom",
    57592: "object-align-horizontal",
    57593: "object-align-left",
    57594: "object-align-vertical",
    57595: "object-align-right",
    57596: "triangle-right",
    57597: "triangle-left",
    57598: "triangle-bottom",
    57599: "triangle-top",
    57600: "console",
    57601: "superscript",
    57602: "subscript",
    57603: "menu-left",
    57604: "menu-right",
    57605: "menu-down",
    57606: "menu-up",
};

// CSV helpers
function escapeCSV(value) {
    if (!value) return "";
    const str = String(value);
    if (str.includes('"') || str.includes(',') || str.includes('\n')) {
        return '"' + str.replace(/"/g, '""') + '"';
    }
    return str;
}

function arrayToCSV(rows) {
    return rows.map(row => row.map(escapeCSV).join(',')).join('\n');
}

// Extract page from action
async function getPageFromAction(action) {
    if (!action) return "";

    try {
        // Load the action if needed
        if (typeof action.load === 'function') {
            await action.load();
        }

        // For PageClientAction - page is in pageSettings
        if (action.constructor.name === "PageClientAction") {
            if (action.pageSettings) {
                // Load the pageSettings if needed
                if (typeof action.pageSettings.load === 'function') {
                    await action.pageSettings.load();
                }

                // Try to get page from pageSettings
                if (action.pageSettings.page) {
                    const page = action.pageSettings.page;
                    return page.name || page.qualifiedName || "";
                }
                if (action.pageSettings.pageQualifiedName) {
                    const parts = action.pageSettings.pageQualifiedName.split('.');
                    return parts[parts.length - 1];
                }
            }
        }

        // For MicroflowClientAction - microflow is in microflowSettings
        if (action.constructor.name === "MicroflowClientAction") {
            if (action.microflowSettings) {
                // Load the microflowSettings if needed
                if (typeof action.microflowSettings.load === 'function') {
                    await action.microflowSettings.load();
                }

                // Try to get microflow from microflowSettings
                if (action.microflowSettings.microflow) {
                    const mf = action.microflowSettings.microflow;
                    return `[MF: ${mf.name || mf.qualifiedName}]`;
                }
                if (action.microflowSettings.microflowQualifiedName) {
                    const parts = action.microflowSettings.microflowQualifiedName.split('.');
                    return `[MF: ${parts[parts.length - 1]}]`;
                }
            }
        }

        // For CallNanoflowClientAction - nanoflow is direct property
        if (action.constructor.name === "CallNanoflowClientAction") {
            if (action.nanoflow) {
                return `[NF: ${action.nanoflow.name || action.nanoflow.qualifiedName}]`;
            }
            if (action.nanoflowQualifiedName) {
                const parts = action.nanoflowQualifiedName.split('.');
                return `[NF: ${parts[parts.length - 1]}]`;
            }
        }

    } catch (e) {
        console.warn(`Error extracting page from action: ${e.message}`);
    }

    return "";
}

// Extract icon
function getIcon(item) {
    if (!item || !item.icon) return "";

    const icon = item.icon;

    try {
        // For GlyphIcon - use the code property
        if (icon.constructor.name === "GlyphIcon" && icon.code) {
            return `glyphicon-${icon.code}`;
        }

        // For IconCollectionIcon (Atlas icons)
        if (icon.constructor.name === "IconCollectionIcon") {
            if (icon.image && icon.image.name) {
                return `Image: ${icon.image.name}`;
            }
            if (icon.imageQualifiedName) {
                const parts = icon.imageQualifiedName.split('.');
                return `Image: ${parts[parts.length - 1]}`;
            }
        }

    } catch (e) {
        console.warn(`Error extracting icon: ${e.message}`);
    }

    return icon.constructor.name;
}

// Extract caption
function getCaption(item) {
    try {
        if (item.caption?.translations?.[0]?.text) {
            return item.caption.translations[0].text;
        }
        if (typeof item.caption === 'string') {
            return item.caption;
        }
    } catch (e) { }
    return "No Caption";
}

// Extract menu items recursively
async function extractMenuItems(items, profileType, documentName, parentPath, navigationItems, level = 0) {
    if (!items || items.length === 0) return;

    for (const item of items) {
        try {
            const caption = getCaption(item);
            const currentPath = parentPath ? `${parentPath} > ${caption}` : caption;

            // Extract page from action
            let targetPage = "";
            if (item.action) {
                targetPage = await getPageFromAction(item.action);
            }

            // Extract icon
            const icon = getIcon(item);

            navigationItems.push({
                documentName,
                profileType,
                itemType: item.constructor.name,
                level,
                caption,
                path: currentPath,
                targetPage,
                icon,
                alternativeText: item.alternativeText || ""
            });

            // Recurse into sub-items
            if (item.items && item.items.length > 0) {
                await extractMenuItems(item.items, profileType, documentName, currentPath, navigationItems, level + 1);
            }
        } catch (error) {
            console.warn(`Warning processing menu item: ${error.message}`);
        }
    }
}

// Extract profile
async function extractProfile(profile, profileType, documentName, navigationItems) {
    try {
        if (profile.menuItemCollection?.items) {
            await extractMenuItems(profile.menuItemCollection.items, profileType, documentName, "", navigationItems);
        }

        if (profile.homePage) {
            // Extract home page
            let homePage = "";

            // Load if needed
            if (typeof profile.homePage.load === 'function') {
                await profile.homePage.load();
            }

            if (profile.homePage.page) {
                const page = profile.homePage.page;
                homePage = page.name || page.qualifiedName || "";
            } else if (profile.homePage.pageQualifiedName) {
                const parts = profile.homePage.pageQualifiedName.split('.');
                homePage = parts[parts.length - 1];
            }

            navigationItems.push({
                documentName,
                profileType,
                itemType: "HomePage",
                level: -1,
                caption: "Home Page",
                path: "",
                targetPage: homePage,
                icon: "",
                alternativeText: ""
            });
        }

        // Extract role-based home pages
        if (profile.roleBasedHomePages && profile.roleBasedHomePages.length > 0) {
            for (const rbh of profile.roleBasedHomePages) {
                // Load if needed
                if (typeof rbh.load === 'function') {
                    await rbh.load();
                }

                let rolePage = "";
                if (rbh.page) {
                    const page = rbh.page;
                    rolePage = page.name || page.qualifiedName || "";
                } else if (rbh.pageQualifiedName) {
                    const parts = rbh.pageQualifiedName.split('.');
                    rolePage = parts[parts.length - 1];
                }

                const roleName = rbh.userRole?.name || rbh.userRole?.qualifiedName || "Unknown";

                navigationItems.push({
                    documentName,
                    profileType,
                    itemType: "RoleBasedHomePage",
                    level: -1,
                    caption: `Role: ${roleName}`,
                    path: "",
                    targetPage: rolePage,
                    icon: "",
                    alternativeText: ""
                });
            }
        }
    } catch (error) {
        console.error(`Error in profile ${profileType}: ${error.message}`);
    }
}

// Main function
async function main() {
    console.log("╔═════════════════════════════════════════════════════════════════════════════╗");
    console.log("║ ███  ███  ███                                                               ║");
    console.log("║ ███▄▄███▄▄███                                                               ║");
    console.log("║  ███████████     Mendix SDK Navigation Extractor - Ver. 1.0.0               ║");
    console.log("║  ████▀▀▀████                                                                ║");
    console.log("║  ████   ████     Usage: node extract-navigation.js                          ║");
    console.log("║███████████████                                                              ║");
    console.log("║CONVENT SYSTEMS                                                              ║");
    console.log("╚═════════════════════════════════════════════════════════════════════════════╝\n");

    try {
        if (!CONFIG.projectId) {
            console.error("❌ Set MENDIX_PROJECT_ID");
            process.exit(1);
        }

        console.log(`Project: ${CONFIG.projectId}`);
        console.log(`Branch: ${CONFIG.branch}\n`);

        console.log("1. Initializing client...");
        const client = new MendixPlatformClient();

        console.log("2. Getting app...");
        const app = client.getApp(CONFIG.projectId);

        console.log("3. Creating working copy...");
        const workingCopy = await app.createTemporaryWorkingCopy(CONFIG.branch);
        console.log(`   ✓ ${workingCopy.workingCopyId}`);

        console.log("4. Opening model...");
        const model = await workingCopy.openModel();
        console.log("   ✓ Model opened");

        console.log("\n5. Extracting navigation...");
        const navigationItems = [];
        const navDocuments = model.allNavigationDocuments();

        for (const navDoc of navDocuments) {
            await navDoc.load();
            const docName = navDoc.name || navDoc.qualifiedName || "Navigation";

            if (navDoc.profiles && navDoc.profiles.length > 0) {
                for (const profile of navDoc.profiles) {
                    const profileType = profile.profileKind || profile.kind || profile.name || "Unknown";
                    console.log(`   Extracting ${profileType} profile...`);
                    await extractProfile(profile, profileType, docName, navigationItems);
                }
            }
        }

        console.log(`   ✓ Extracted ${navigationItems.length} items\n`);

        // Generate CSV
        console.log("6. Generating CSV...");
        const rows = [[
            "Document Name", "Profile Type", "Item Type", "Level",
            "Caption", "Path", "Target Page", "Icon", "Alternative Text"
        ]];

        for (const item of navigationItems) {
            rows.push([
                item.documentName, item.profileType, item.itemType, item.level,
                item.caption, item.path, item.targetPage, item.icon, item.alternativeText
            ]);
        }

        const csv = rows.map(row => row.map(escapeCSV).join(',')).join('\n');
        fs.writeFileSync(CONFIG.outputFile, csv, 'utf8');
        console.log(`   ✓ ${CONFIG.outputFile}`);

        // Summary
        console.log("\n" + "=".repeat(50));
        console.log("SUMMARY");
        console.log("=".repeat(50));
        console.log(`Total items: ${navigationItems.length}`);
        console.log(`With pages/actions: ${navigationItems.filter(i => i.targetPage).length}`);
        console.log(`With icons: ${navigationItems.filter(i => i.icon && !i.icon.includes('Icon')).length}`);

        console.log("\n✓ Export completed successfully!\n");

    } catch (error) {
        console.error("\n❌ Error:", error.message);
        console.error(error.stack);
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}
