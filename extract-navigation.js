/** 
 *       
 *      ███  ███  ███
 *      ███▄▄███▄▄███
 *       ███████████     Mendix SDK Navigation Extractor - Ver. 1.2.1
 *       ████▀▀▀████     Extracts pages, icons, and user role permissions
 *       ████   ████     Now with nanoflow → page detection!
 *     ███████████████ 
 *     CONVENT SYSTEMS
 *
 */

const { MendixPlatformClient } = require("mendixplatformsdk");
const fs = require("fs");

const CONFIG = {
    projectId: process.env.MENDIX_PROJECT_ID || "542db4de-9b24-48cf-93d5-1ce757594249",
    branch: process.env.MENDIX_BRANCH || "main",
    outputFile: process.env.OUTPUT_FILE || "navigation-items.csv",
    debug: process.env.DEBUG === "true" || false
};
const glyphiconMapping = {
    // Speciale tekens (ASCII gebaseerd)
    42: "glyphicon-asterisk",
    43: "glyphicon-plus",
    165: "glyphicon-yen",
    8364: "glyphicon-euro",
    8381: "glyphicon-ruble",
    8722: "glyphicon-minus",
    9729: "glyphicon-cloud",
    9978: "glyphicon-tent",
    9993: "glyphicon-envelope",
    9999: "glyphicon-pencil",
    63743: "glyphicon-apple",

    // glyphicons
    57345: "glyphicon-glass",
    57346: "glyphicon-music",
    57347: "glyphicon-search",
    57349: "glyphicon-heart",
    57350: "glyphicon-star",
    57351: "glyphicon-star-empty",
    57352: "glyphicon-user",
    57353: "glyphicon-film",
    //
    57360: "glyphicon-th-large",
    57361: "glyphicon-th",
    57362: "glyphicon-th-list",
    57363: "glyphicon-ok",
    57364: "glyphicon-remove",
    57365: "glyphicon-zoom-in",
    57366: "glyphicon-zoom-out",
    57367: "glyphicon-off",
    57368: "glyphicon-signal",
    57369: "glyphicon-cog",
    //
    57376: "glyphicon-trash",
    57377: "glyphicon-home",
    57378: "glyphicon-file",
    57379: "glyphicon-time",
    57380: "glyphicon-road",
    57381: "glyphicon-download-alt",
    57382: "glyphicon-download",
    57383: "glyphicon-upload",
    57384: "glyphicon-inbox",
    57385: "glyphicon-play-circle",
    //
    57392: "glyphicon-repeat",
    57393: "glyphicon-refresh",
    57394: "glyphicon-list-alt",
    57395: "glyphicon-lock",
    57396: "glyphicon-flag",
    57397: "glyphicon-headphones",
    57398: "glyphicon-volume-off",
    57399: "glyphicon-volume-down",
    57400: "glyphicon-volume-up",
    57401: "glyphicon-qrcode",
    //
    57408: "glyphicon-barcode",
    57409: "glyphicon-tag",
    57410: "glyphicon-tags",
    57411: "glyphicon-book",
    57412: "glyphicon-bookmark",
    57413: "glyphicon-print",
    57414: "glyphicon-camera",
    57415: "glyphicon-font",
    57416: "glyphicon-bold",
    57417: "glyphicon-italic",
    //
    57424: "glyphicon-text-height",
    57425: "glyphicon-text-width",
    57426: "glyphicon-align-left",
    57427: "glyphicon-align-center",
    57428: "glyphicon-align-right",
    57429: "glyphicon-align-justify",
    57430: "glyphicon-list",
    57431: "glyphicon-indent-left",
    57432: "glyphicon-indent-right",
    57433: "glyphicon-facetime-video",
    // 
    57440: "glyphicon-picture",
    //
    57442: "glyphicon-map-marker",
    57443: "glyphicon-adjust",
    57444: "glyphicon-tint",
    57445: "glyphicon-edit",
    57446: "glyphicon-share",
    57447: "glyphicon-check",
    57448: "glyphicon-move",
    57449: "glyphicon-step-backward",
    //
    57456: "glyphicon-fast-backward",
    57457: "glyphicon-backward",
    57458: "glyphicon-play",
    57459: "glyphicon-pause",
    57460: "glyphicon-stop",
    57461: "glyphicon-forward",
    57462: "glyphicon-fast-forward",
    57463: "glyphicon-step-forward",
    57464: "glyphicon-eject",
    57465: "glyphicon-chevron-left",
    //
    57472: "glyphicon-chevron-right",
    57473: "glyphicon-plus-sign",
    57474: "glyphicon-minus-sign",
    57475: "glyphicon-remove-sign",
    57476: "glyphicon-ok-sign",
    57477: "glyphicon-question-sign",
    57478: "glyphicon-info-sign",
    57479: "glyphicon-screenshot",
    57480: "glyphicon-remove-circle",
    57481: "glyphicon-ok-circle",
    //
    57488: "glyphicon-ban-circle",
    57489: "glyphicon-arrow-left",
    57490: "glyphicon-arrow-right",
    57491: "glyphicon-arrow-up",
    57492: "glyphicon-arrow-down",
    57493: "glyphicon-share-alt",
    57494: "glyphicon-resize-full",
    57495: "glyphicon-resize-small",
    //
    57601: "glyphicon-exclamation-sign",
    57602: "glyphicon-gift",
    57603: "glyphicon-leaf",
    57604: "glyphicon-fire",
    57605: "glyphicon-eye-open",
    57606: "glyphicon-eye-close",
    57607: "glyphicon-warning-sign",
    57608: "glyphicon-plane",
    57609: "glyphicon-calendar",
    //
    57616: "glyphicon-random",
    57617: "glyphicon-comment",
    57618: "glyphicon-magnet",
    57619: "glyphicon-chevron-up",
    57620: "glyphicon-chevron-down",
    57621: "glyphicon-retweet",
    57622: "glyphicon-shopping-cart",
    57623: "glyphicon-folder-close",
    57624: "glyphicon-folder-open",
    57625: "glyphicon-resize-vertical",
    //
    57632: "glyphicon-resize-horizontal",
    57633: "glyphicon-hdd",
    57634: "glyphicon-bullhorn",
    57635: "glyphicon-bell",
    57636: "glyphicon-certificate",
    57637: "glyphicon-thumbs-up",
    57638: "glyphicon-thumbs-down",
    57639: "glyphicon-hand-right",
    57640: "glyphicon-hand-left",
    57641: "glyphicon-hand-up",
    //
    57648: "glyphicon-hand-down",
    57649: "glyphicon-circle-arrow-right",
    57650: "glyphicon-circle-arrow-left",
    57651: "glyphicon-circle-arrow-up",
    57652: "glyphicon-circle-arrow-down",
    57653: "glyphicon-globe",
    57654: "glyphicon-wrench",
    57655: "glyphicon-tasks",
    57656: "glyphicon-filter",
    57657: "glyphicon-briefcase",
    //
    57664: "glyphicon-fullscreen",
    57665: "glyphicon-dashboard",
    57666: "glyphicon-paperclip",
    57667: "glyphicon-heart-empty",
    57668: "glyphicon-link",
    57669: "glyphicon-phone",
    57670: "glyphicon-pushpin",
    //
    57672: "glyphicon-usd",
    57673: "glyphicon-gbp",
    //
    57680: "glyphicon-sort",
    57681: "glyphicon-sort-by-alphabet",
    57682: "glyphicon-sort-by-alphabet-alt",
    57683: "glyphicon-sort-by-order",
    57684: "glyphicon-sort-by-order-alt",
    57685: "glyphicon-sort-by-attributes",
    57686: "glyphicon-sort-by-attributes-alt",
    57687: "glyphicon-unchecked",
    57688: "glyphicon-expand",
    57689: "glyphicon-collapse-down",
    //
    57696: "glyphicon-collapse-up",
    57697: "glyphicon-log-in",
    57698: "glyphicon-flash",
    57699: "glyphicon-log-out",
    57700: "glyphicon-new-window",
    57701: "glyphicon-record",
    57702: "glyphicon-save",
    57703: "glyphicon-open",
    57704: "glyphicon-saved",
    57705: "glyphicon-import",
    //
    57712: "glyphicon-export",
    57713: "glyphicon-send",
    57714: "glyphicon-floppy-disk",
    57715: "glyphicon-floppy-saved",
    57716: "glyphicon-floppy-remove",
    57717: "glyphicon-floppy-save",
    57718: "glyphicon-floppy-open",
    57719: "glyphicon-credit-card",
    57720: "glyphicon-transfer",
    57721: "glyphicon-cutlery",
    //
    57728: "glyphicon-header",
    57729: "glyphicon-compressed",
    57730: "glyphicon-earphone",
    57731: "glyphicon-phone-alt",
    57732: "glyphicon-tower",
    57733: "glyphicon-stats",
    57734: "glyphicon-sd-video",
    57735: "glyphicon-hd-video",
    57736: "glyphicon-subtitles",
    57737: "glyphicon-sound-stereo",
    //
    57744: "glyphicon-sound-dolby",
    57745: "glyphicon-sound-5-1",
    57746: "glyphicon-sound-6-1",
    57747: "glyphicon-sound-7-1",
    57748: "glyphicon-copyright-mark",
    57749: "glyphicon-registration-mark",
    //
    57751: "glyphicon-cloud-download",
    57752: "glyphicon-cloud-upload",
    57753: "glyphicon-tree-conifer",
    //
    57856: "glyphicon-tree-deciduous",
    57857: "glyphicon-cd",
    57858: "glyphicon-save-file",
    57859: "glyphicon-open-file",
    57860: "glyphicon-level-up",
    57861: "glyphicon-copy",
    57862: "glyphicon-paste",
    //
    57865: "glyphicon-alert",
    //
    57872: "glyphicon-equalizer",
    57873: "glyphicon-king",
    57874: "glyphicon-queen",
    57875: "glyphicon-pawn",
    57876: "glyphicon-bishop",
    57877: "glyphicon-knight",
    57878: "glyphicon-baby-formula",
    57880: "glyphicon-blackboard",
    57881: "glyphicon-bed",
    //
    57889: "glyphicon-erase",
    //
    57891: "glyphicon-lamp", //
    57892: "glyphicon-duplicate",
    57893: "glyphicon-piggy-bank",
    57894: "glyphicon-scissors",
    57895: "glyphicon-bitcoin",
    //
    57904: "glyphicon-scale",
    57905: "glyphicon-ice-lolly",
    57906: "glyphicon-ice-lolly-tasted",
    57907: "glyphicon-education",
    57908: "glyphicon-open-horizontal",
    57909: "glyphicon-open vertical",
    57910: "glyphicon-menu-hamburger",
    57911: "glyphicon-modal-window",
    57912: "glyphicon-oil",
    57913: "glyphicon-grain",
    //
    57920: "glyphicon-sunglasses",
    57921: "glyphicon-text-size",
    57922: "glyphicon-text-color",
    57923: "glyphicon-text-background",
    57924: "glyphicon-object-align-top",
    57925: "glyphicon-object-align-bottom",
    57926: "glyphicon-object-align-horizontal",
    57927: "glyphicon-object-align-left",
    57928: "glyphicon-object-align-vertical",
    57929: "glyphicon-object-align-right",
    //
    57936: "glyphicon-triangle-right",
    57937: "glyphicon-triangle-left",
    57938: "glyphicon-triangle-bottom",
    57939: "glyphicon-triangle-top",
    57940: "glyphicon-console",
    57941: "glyphicon-superscript",
    57942: "glyphicon-subscript",
    57943: "glyphicon-menu-left",
    57944: "glyphicon-menu-right",
    57945: "glyphicon-menu-down",
    //
    57952: "glyphicon-menu-up"
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

async function getIcon(item) {
    if (!item || !item.icon) return "";

    let icon = item.icon;

    try {
        if (!icon.isLoaded) await icon.load();
        const data = icon.toJSON();
        const code = data.code; // Dit haalt 42, 8364, of 57377 op

        if (icon.constructor.name === "GlyphIcon") {
            // Gebruik de nieuwe, accurate mappingstabel
            return glyphiconMapping[code] || `glyphicon-unknown-code-${code}`;
        }

        if (icon.constructor.name === "IconCollectionIcon") {
            const imgPath = data.image || "";
            return imgPath ? `icon-${imgPath.split('.').pop()}` : "IconCollection";
        }

    } catch (e) {
        return "Error";
    }
    return "";
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

// Get allowed roles for a page
async function getAllowedRolesForPage(pageName, model) {
    if (!pageName) return [];
    
    try {
        // Find the page in the model
        const pages = model.allPages();
        const page = pages.find(p => p && (p.name === pageName || p.qualifiedName?.endsWith(`.${pageName}`)));
        
        if (!page) {
            return [];
        }
        
        // Load the page if needed
        if (typeof page.load === 'function' && !page.isLoaded) {
            await page.load();
        }
        
        // Get allowed roles (module roles)
        const allowedRoles = page.allowedRoles || [];
        const roleNames = allowedRoles
            .filter(role => role != null)  // Filter out null roles
            .map(role => {
                if (role.name) return role.name;
                if (role.qualifiedName) {
                    const parts = role.qualifiedName.split('.');
                    return parts[parts.length - 1];
                }
                return null;
            })
            .filter(Boolean);
        
        return roleNames;
    } catch (error) {
        console.warn(`Could not get roles for page ${pageName}: ${error.message}`);
        return [];
    }
}

// Get allowed roles for a microflow
async function getAllowedRolesForMicroflow(microflowName, model) {
    if (!microflowName) return [];
    
    try {
        // Find the microflow in the model
        const microflows = model.allMicroflows();
        const microflow = microflows.find(mf => mf && (mf.name === microflowName || mf.qualifiedName?.endsWith(`.${microflowName}`)));
        
        if (!microflow) {
            return [];
        }
        
        // Load the microflow if needed
        if (typeof microflow.load === 'function' && !microflow.isLoaded) {
            await microflow.load();
        }
        
        // Get allowed module roles
        const allowedModuleRoles = microflow.allowedModuleRoles || [];
        const roleNames = allowedModuleRoles
            .filter(role => role != null)
            .map(role => {
                if (role.name) return role.name;
                if (role.qualifiedName) {
                    const parts = role.qualifiedName.split('.');
                    return parts[parts.length - 1];
                }
                return null;
            })
            .filter(Boolean);
        
        return roleNames;
    } catch (error) {
        console.warn(`Could not get roles for microflow ${microflowName}: ${error.message}`);
        return [];
    }
}

// Get page from nanoflow (nanoflows can open pages)
async function getPageFromNanoflow(nanoflowName, model) {
    if (!nanoflowName) return null;
    
    try {
        // Find the nanoflow in the model
        const nanoflows = model.allNanoflows();
        const nanoflow = nanoflows.find(nf => nf && (nf.name === nanoflowName || nf.qualifiedName?.endsWith(`.${nanoflowName}`)));
        
        if (!nanoflow) {
            return null;
        }
        
        // Load the nanoflow if needed
        if (typeof nanoflow.load === 'function' && !nanoflow.isLoaded) {
            await nanoflow.load();
        }
        
        // Look through nanoflow actions to find ShowPage actions
        if (nanoflow.objectCollection && nanoflow.objectCollection.objects) {
            for (const obj of nanoflow.objectCollection.objects) {
                // Check if it's an ActionActivity with a ShowPageAction
                if (obj.constructor.name === 'ActionActivity' && obj.action) {
                    const action = obj.action;
                    
                    // Load action if needed
                    if (typeof action.load === 'function' && !action.isLoaded) {
                        await action.load();
                    }
                    
                    if (action.constructor.name === 'ShowPageAction') {
                        if (action.pageSettings) {
                            if (typeof action.pageSettings.load === 'function') {
                                await action.pageSettings.load();
                            }
                            
                            if (action.pageSettings.page) {
                                const page = action.pageSettings.page;
                                return page.name || page.qualifiedName || null;
                            }
                            if (action.pageSettings.pageQualifiedName) {
                                const parts = action.pageSettings.pageQualifiedName.split('.');
                                return parts[parts.length - 1];
                            }
                        }
                    }
                }
            }
        }
        
        return null;
    } catch (error) {
        console.warn(`Could not get page from nanoflow ${nanoflowName}: ${error.message}`);
        return null;
    }
}

// Get allowed roles for a target (automatically detects if page or microflow)
async function getAllowedRolesForTarget(target, model, debugLog = false) {
    if (!target || !model) return [];
    
    try {
        // Check if it's a microflow (marked with [MF: name])
        if (target.startsWith('[MF:')) {
            const microflowName = target.replace(/^\[MF:\s*/, '').replace(/\]$/, '').trim();
            if (debugLog) console.log(`  → Checking microflow: ${microflowName}`);
            const moduleRoles = await getAllowedRolesForMicroflow(microflowName, model);
            if (debugLog) console.log(`    Module roles found: ${moduleRoles.join(', ') || 'none'}`);
            const userRoles = await mapModuleRolesToUserRoles(moduleRoles, model);
            if (debugLog) console.log(`    User roles mapped: ${userRoles.join(', ') || 'none'}`);
            return userRoles;
        }
        
        // Check if it's a nanoflow (marked with [NF: name])
        if (target.startsWith('[NF:')) {
            const nanoflowName = target.replace(/^\[NF:\s*/, '').replace(/\]$/, '').trim();
            if (debugLog) console.log(`  → Checking nanoflow: ${nanoflowName}`);
            
            // Try to find a page that the nanoflow opens
            const pageName = await getPageFromNanoflow(nanoflowName, model);
            
            if (pageName) {
                if (debugLog) console.log(`    Nanoflow opens page: ${pageName}`);
                const moduleRoles = await getAllowedRolesForPage(pageName, model);
                if (debugLog) console.log(`    Module roles found: ${moduleRoles.join(', ') || 'none'}`);
                const userRoles = await mapModuleRolesToUserRoles(moduleRoles, model);
                if (debugLog) console.log(`    User roles mapped: ${userRoles.join(', ') || 'none'}`);
                return userRoles;
            } else {
                if (debugLog) console.log(`    Nanoflow doesn't open a page (client-side logic only)`);
                return []; // Nanoflow doesn't open a page
            }
        }
        
        // Otherwise, treat as page
        if (debugLog) console.log(`  → Checking page: ${target}`);
        const moduleRoles = await getAllowedRolesForPage(target, model);
        if (debugLog) console.log(`    Module roles found: ${moduleRoles.join(', ') || 'none'}`);
        const userRoles = await mapModuleRolesToUserRoles(moduleRoles, model);
        if (debugLog) console.log(`    User roles mapped: ${userRoles.join(', ') || 'none'}`);
        return userRoles;
        
    } catch (error) {
        console.warn(`Could not get roles for target ${target}: ${error.message}`);
        return [];
    }
}

// Map module roles to user roles
async function mapModuleRolesToUserRoles(moduleRoles, model) {
    try {
        // Check if moduleRoles is valid
        if (!moduleRoles || !Array.isArray(moduleRoles) || moduleRoles.length === 0) {
            return [];
        }
        
        // Get project security
        const securityDocs = model.allProjectSecurities();
        if (securityDocs.length === 0) {
            return [];
        }
        
        const projectSecurity = securityDocs[0];
        if (typeof projectSecurity.load === 'function' && !projectSecurity.isLoaded) {
            await projectSecurity.load();
        }
        
        const userRoles = projectSecurity.userRoles || [];
        const matchingUserRoles = [];
        
        // For each user role, check if it has the required module roles
        for (const userRole of userRoles) {
            // Skip if userRole is null or doesn't have a name
            if (!userRole || !userRole.name) {
                continue;
            }
            
            const userRoleModuleRoles = userRole.moduleRoles || [];
            const userRoleModuleRoleNames = userRoleModuleRoles
                .filter(mr => mr != null)  // Filter out null module roles
                .map(mr => {
                    if (mr.name) return mr.name;
                    if (mr.qualifiedName) {
                        const parts = mr.qualifiedName.split('.');
                        return parts[parts.length - 1];
                    }
                    return null;
                })
                .filter(Boolean);
            
            // Check if this user role has any of the required module roles
            const hasAccess = moduleRoles.some(mr => userRoleModuleRoleNames.includes(mr));
            
            if (hasAccess) {
                matchingUserRoles.push(userRole.name);
            }
        }
        
        return matchingUserRoles;
    } catch (error) {
        console.warn(`Error mapping module roles to user roles: ${error.message}`);
        return [];
    }
}

// Extract menu items recursively
async function extractMenuItems(items, profileType, documentName, parentPath, navigationItems, model, level = 0) {
    if (!items || items.length === 0) return;

    for (const item of items) {
        try {
            const caption = getCaption(item);
            const currentPath = parentPath ? `${parentPath} > ${caption}` : caption;

            // Extract page from action
            let targetPage = "";
            let iconValue = "";
            let allowedUserRoles = [];

            // 1. Haal de doelpagina op uit de actie (bestaande logica)
            if (item.action) {
                targetPage = await getPageFromAction(item.action);
            }

            // 2. Haal de allowed roles op voor het target (page, microflow, etc.)
            if (targetPage && model) {
                if (CONFIG.debug) {
                    console.log(`\nMenu item: ${caption}`);
                    console.log(`  Target: ${targetPage}`);
                }
                allowedUserRoles = await getAllowedRolesForTarget(targetPage, model, CONFIG.debug);
                if (CONFIG.debug && (!allowedUserRoles || allowedUserRoles.length === 0)) {
                    console.log(`  ⚠️ No user roles found for this target`);
                }
            } else if (CONFIG.debug && !targetPage) {
                console.log(`\nMenu item: ${caption}`);
                console.log(`  ⚠️ No target page/action found`);
            }

            // 3. Haal de icoon-waarde op (voor afbeeldingen)
            if (item.icon) {
                if (item.icon.structureTypeName === "Pages$ImageIcon") {
                    // Soms is de property direct beschikbaar via de referentie-naam
                    iconValue = item.icon.imageQualifiedName || (item.icon.image ? item.icon.image.qualifiedName : "");
                } else {
                    iconValue = await getIcon(item);
                }
            }

            navigationItems.push({
                documentName,
                profileType,
                itemType: item.constructor.name,
                level,
                caption,
                path: currentPath,
                targetPage,
                iconValue,
                alternativeText: item.alternativeText || "",
                allowedUserRoles: (Array.isArray(allowedUserRoles) && allowedUserRoles.length > 0) ? allowedUserRoles.join('; ') : ""
            });

            // Recurse into sub-items
            if (item.items && item.items.length > 0) {
                await extractMenuItems(item.items, profileType, documentName, currentPath, navigationItems, model, level + 1);
            }
        } catch (error) {
            console.warn(`Warning processing menu item: ${error.message}`);
        }
    }
}

// Extract profile
async function extractProfile(profile, profileType, documentName, navigationItems, model) {
    try {
        if (profile.menuItemCollection?.items) {
            await extractMenuItems(profile.menuItemCollection.items, profileType, documentName, "", navigationItems, model);
        }

        if (profile.homePage) {
            // Extract home page
            let homePage = "";
            let allowedUserRoles = [];

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

            // Get allowed roles for home page
            if (homePage && model) {
                allowedUserRoles = await getAllowedRolesForTarget(homePage, model);
            }

            navigationItems.push({
                documentName,
                profileType,
                itemType: "HomePage",
                level: -1,
                caption: "Home Page",
                path: "",
                targetPage: homePage,
                iconValue: "",
                alternativeText: "",
                allowedUserRoles: (Array.isArray(allowedUserRoles) && allowedUserRoles.length > 0) ? allowedUserRoles.join('; ') : ""
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
                let allowedUserRoles = [];
                
                if (rbh.page) {
                    const page = rbh.page;
                    rolePage = page.name || page.qualifiedName || "";
                } else if (rbh.pageQualifiedName) {
                    const parts = rbh.pageQualifiedName.split('.');
                    rolePage = parts[parts.length - 1];
                }

                const roleName = rbh.userRole?.name || rbh.userRole?.qualifiedName || "Unknown";
                
                // Get allowed roles for role-based home page
                if (rolePage && model) {
                    allowedUserRoles = await getAllowedRolesForTarget(rolePage, model);
                }

                navigationItems.push({
                    documentName,
                    profileType,
                    itemType: "RoleBasedHomePage",
                    level: -1,
                    caption: `Role: ${roleName}`,
                    path: "",
                    targetPage: rolePage,
                    iconValue: "",
                    alternativeText: "",
                    allowedUserRoles: (Array.isArray(allowedUserRoles) && allowedUserRoles.length > 0) ? allowedUserRoles.join('; ') : ""
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
    console.log("║  ███████████     Mendix SDK Navigation Extractor - Ver. 1.2.1               ║");
    console.log("║  ████▀▀▀████     Pages, icons, user roles (pages/microflows/nanoflows!)     ║");
    console.log("║  ████   ████     Usage: node extract-navigation.js                          ║");
    console.log("║███████████████   Debug: DEBUG=true node extract-navigation.js               ║");
    console.log("║CONVENT SYSTEMS                                                              ║");
    console.log("╚═════════════════════════════════════════════════════════════════════════════╝\n");

    try {
        if (!CONFIG.projectId) {
            console.error("❌ Set MENDIX_PROJECT_ID");
            process.exit(1);
        }

        console.log(`Project: ${CONFIG.projectId}`);
        console.log(`Branch: ${CONFIG.branch}`);
        if (CONFIG.debug) {
            console.log(`🐛 DEBUG MODE ENABLED - Detailed logging active\n`);
        } else {
            console.log();
        }

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
                    await extractProfile(profile, profileType, docName, navigationItems, model);
                }
            }
        }

        console.log(`   ✓ Extracted ${navigationItems.length} items\n`);

        // Generate CSV
        console.log("6. Generating CSV...");
        const rows = [[
            "Document Name", "Profile Type", "Item Type", "Level",
            "Caption", "Path", "Target Page", "Icon", "Alternative Text", "Allowed User Roles"
        ]];

        for (const item of navigationItems) {
            rows.push([
                item.documentName, item.profileType, item.itemType, item.level,
                item.caption, item.path, item.targetPage, item.iconValue, item.alternativeText, item.allowedUserRoles || ""
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
        console.log(`With icons: ${navigationItems.filter(i => i.iconValue && !i.iconValue.includes('Icon')).length}`);
        console.log(`With user role restrictions: ${navigationItems.filter(i => i.allowedUserRoles && i.allowedUserRoles.length > 0).length}`);

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
