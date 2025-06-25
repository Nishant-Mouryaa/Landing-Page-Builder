import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { pageData } from "@/types/types";

const initialState: pageData = {
    styles: {},
    elements: {},
};

// Helper function to safely update nested objects
function updateNestedObject(obj: any, path: string[], value: any) {
    const newObj = { ...obj };
    let current = newObj;
    
    for (let i = 0; i < path.length - 1; i++) {
        const key = path[i];
        if (!(key in current)) {
            current[key] = {};
        }
        current = current[key];
    }
    
    current[path[path.length - 1]] = value;
    return newObj;
}

// Helper function to safely update array elements
function updateArrayElementHelper(obj: any, path: string[], index: number, value: any) {
    const newObj = { ...obj };
    let current = newObj;
    
    for (let i = 0; i < path.length - 1; i++) {
        const key = path[i];
        if (!(key in current)) {
            current[key] = {};
        }
        current = current[key];
    }
    
    const arrayKey = path[path.length - 1];
    if (!Array.isArray(current[arrayKey])) {
        current[arrayKey] = [];
    }
    
    current[arrayKey] = [...current[arrayKey]];
    current[arrayKey][index] = { ...current[arrayKey][index], ...value };
    
    return newObj;
}

const layoutSlice = createSlice({
    name: "layout",
    initialState,
    reducers: {
        setLayout: (state, action) => {
            state.styles = action.payload.styles;
            state.elements = action.payload.elements;
        },
        
        // Unified section update action
        updateSection: (state, action: PayloadAction<{
            section: string;
            path: string[];
            value: any;
        }>) => {
            const { section, path, value } = action.payload;
            if (!state.elements[section]) {
                state.elements[section] = {};
            }
            state.elements[section] = updateNestedObject(state.elements[section], path, value);
        },
        
        // Unified array element update action
        updateArrayElement: (state, action: PayloadAction<{
            section: string;
            path: string[];
            index: number;
            value: any;
        }>) => {
            const { section, path, index, value } = action.payload;
            if (!state.elements[section]) {
                state.elements[section] = {};
            }
            state.elements[section] = updateArrayElementHelper(state.elements[section], path, index, value);
        },
        
        // Add element to array
        addArrayElement: (state, action: PayloadAction<{
            section: string;
            path: string[];
            value: any;
        }>) => {
            const { section, path, value } = action.payload;
            if (!state.elements[section]) {
                state.elements[section] = {};
            }
            
            let current = state.elements[section];
            for (let i = 0; i < path.length - 1; i++) {
                const key = path[i];
                if (!(key in current)) {
                    current[key] = {};
                }
                current = current[key];
            }
            
            const arrayKey = path[path.length - 1];
            if (!Array.isArray(current[arrayKey])) {
                current[arrayKey] = [];
            }
            current[arrayKey].push(value);
        },
        
        // Remove element from array
        removeArrayElement: (state, action: PayloadAction<{
            section: string;
            path: string[];
            index: number;
        }>) => {
            const { section, path, index } = action.payload;
            if (!state.elements[section]) return;
            
            let current = state.elements[section];
            for (let i = 0; i < path.length - 1; i++) {
                const key = path[i];
                if (!(key in current)) return;
                current = current[key];
            }
            
            const arrayKey = path[path.length - 1];
            if (Array.isArray(current[arrayKey]) && current[arrayKey][index]) {
                current[arrayKey].splice(index, 1);
            }
        },
        
        // Load template action
        loadTemplate: (state, action: PayloadAction<pageData>) => {
            state.styles = action.payload.styles;
            state.elements = action.payload.elements;
        },
        
        // Legacy actions for backward compatibility (will be removed in future)
        updateNavbarActionLabel: (state, action: PayloadAction<string>) => {
            state.elements.navbar = state.elements.navbar || {};
            state.elements.navbar.actions = state.elements.navbar.actions || [];
            state.elements.navbar.actions[0] = { label: action.payload };
        },
        updateNavbarLinkLabel: (state, action: PayloadAction<{ index: number; value: string }>) => {
            state.elements.navbar = state.elements.navbar || { links: [] };
            const { index, value } = action.payload;
            if (state.elements.navbar!.links && state.elements.navbar!.links[index]) {
                state.elements.navbar!.links[index].label = value;
            }
        },
        updateNavbarLinkTo: (state, action: PayloadAction<{ index: number; value: string }>) => {
            state.elements.navbar = state.elements.navbar || { links: [] };
            const { index, value } = action.payload;
            if (state.elements.navbar!.links && state.elements.navbar!.links[index]) {
                state.elements.navbar!.links[index].link = value;
            }
        },
        updateNavbarLinkAdd: (state) => {
            state.elements.navbar = state.elements.navbar || { links: [] };
            state.elements.navbar.links = state.elements.navbar.links || [];
            state.elements.navbar.links.push({ label: "", link: "" });
        },
        updateNavbarLinkRemove: (state, action: PayloadAction<number>) => {
            state.elements.navbar = state.elements.navbar || { links: [] };
            state.elements.navbar.links = state.elements.navbar.links || [];
            if (state.elements.navbar.links[action.payload]) {
                state.elements.navbar.links.splice(action.payload, 1);
            }
        },
        updateNavbarLogo: (state, action: PayloadAction<string>) => {
            state.elements.navbar = state.elements.navbar || {};
            state.elements.navbar.logo = state.elements.navbar.logo || { src: "" };
            state.elements.navbar.logo.src = action.payload;
        },
        updateHeaderHeading: (state, action) => {
            state.elements.header = state.elements.header || {};
            state.elements.header.heading = action.payload;
        },
        updateHeaderDescription: (state, action) => {
            state.elements.header = state.elements.header || {};
            state.elements.header.description = action.payload;
        },
        updateHeaderImage: (state, action) => {
            state.elements.header = state.elements.header || {};
            state.elements.header.image = action.payload;
        },
        updateHeaderActionButtonLabel: (state, action) => {
            state.elements.header = state.elements.header || {};
            state.elements.header.ctaButton = state.elements.header.ctaButton || {};
            state.elements.header.ctaButton.label = action.payload;
        },
        updateHeaderActionButtonLink: (state, action) => {
            state.elements.header = state.elements.header || {};
            state.elements.header.ctaButton = state.elements.header.ctaButton || {};
            state.elements.header.ctaButton.link = action.payload;
        },
        updateFooterLogo: (state, action: PayloadAction<string>) => {
            state.elements.footer = state.elements.footer || {};
            state.elements.footer.logo = state.elements.footer.logo || { src: "" };
            state.elements.footer.logo.src = action.payload;
        },
        updateFooterTitle: (state, action: PayloadAction<string>) => {
            state.elements.footer = state.elements.footer || {};
            state.elements.footer.section = state.elements.footer.section || {};
            state.elements.footer.section.main = state.elements.footer?.section?.main || {};
            state.elements.footer.section.main.title = action.payload;
        },
        updateFooterDescription: (state, action: PayloadAction<string>) => {
            state.elements.footer = state.elements.footer || {};
            state.elements.footer.section = state.elements.footer.section || {};
            state.elements.footer.section.main = state.elements.footer?.section?.main || {};
            state.elements.footer.section.main.description = action.payload;
        },
        updateFooterCopyRight: (state, action: PayloadAction<string>) => {
            state.elements.footer = state.elements.footer || {};
            state.elements.footer.section = state.elements.footer.section || {};
            state.elements.footer.section.main = state.elements.footer?.section?.main || {};
            state.elements.footer.section.main.copyright = action.payload;
        },
        updateFooterPrivacyAndPolicyLabel: (state, action: PayloadAction<string>) => {
            state.elements.footer = state.elements.footer || {};
            state.elements.footer.section = state.elements.footer.section || {};
            state.elements.footer.section.main = state.elements.footer?.section?.main || {};
            state.elements.footer.section.main.privacyAndPolicy = {
                label: action.payload,
                link: state.elements.footer.section.main.privacyAndPolicy?.link,
            };
        },
        updateFooterPrivacyAndPolicyLink: (state, action: PayloadAction<string>) => {
            state.elements.footer = state.elements.footer || {};
            state.elements.footer.section = state.elements.footer.section || {};
            state.elements.footer.section.main = state.elements.footer?.section?.main || {};
            state.elements.footer.section.main.privacyAndPolicy = {
                label: state.elements.footer.section.main.privacyAndPolicy?.label,
                link: action.payload,
            };
        },
        updateFooterCtaButtonLabel: (state, action: PayloadAction<string>) => {
            state.elements.footer = state.elements.footer || {};
            state.elements.footer.section = state.elements.footer.section || {};
            state.elements.footer.section.main = state.elements.footer?.section?.main || {};
            state.elements.footer.section.main.ctaButton = {
                label: action.payload,
                link: state.elements.footer.section.main.ctaButton?.link,
            };
        },
        updateFooterCtaButtonLink: (state, action: PayloadAction<string>) => {
            state.elements.footer = state.elements.footer || {};
            state.elements.footer.section = state.elements.footer.section || {};
            state.elements.footer.section.main = state.elements.footer?.section?.main || {};
            state.elements.footer.section.main.ctaButton = {
                label: state.elements.footer.section.main.ctaButton?.label,
                link: action.payload,
            };
        },
        updateFooterMail: (state, action: PayloadAction<string>) => {
            state.elements.footer = state.elements.footer || {};
            state.elements.footer.section = state.elements.footer.section || {};
            state.elements.footer.section.contact = state.elements.footer?.section?.contact || {};
            state.elements.footer.section.contact.mail = action.payload;
        },
        updateFooterPhone: (state, action: PayloadAction<string>) => {
            state.elements.footer = state.elements.footer || {};
            state.elements.footer.section = state.elements.footer.section || {};
            state.elements.footer.section.contact = state.elements.footer?.section?.contact || {};
            state.elements.footer.section.contact.phone = action.payload;
        },
        updateFooterAddress: (state, action: PayloadAction<string>) => {
            state.elements.footer = state.elements.footer || {};
            state.elements.footer.section = state.elements.footer.section || {};
            state.elements.footer.section.contact = state.elements.footer?.section?.contact || {};
            state.elements.footer.section.contact.address = action.payload;
        },
        updateFooterSocialLinkLabel: (
            state,
            action: PayloadAction<{ index: number; value: string }>
        ) => {
            state.elements.footer = state.elements.footer || {};
            state.elements.footer.section = state.elements.footer.section || { social: [] };
            const { index, value } = action.payload;
            if (
                state.elements.footer.section!.social &&
                state.elements.footer.section!.social[index]
            ) {
                state.elements.footer.section!.social[index].label = value;
            }
        },
        updateFooterSocialLinkTo: (
            state,
            action: PayloadAction<{ index: number; value: string }>
        ) => {
            state.elements.footer = state.elements.footer || {};
            state.elements.footer.section = state.elements.footer.section || { social: [] };
            const { index, value } = action.payload;
            if (
                state.elements.footer.section!.social &&
                state.elements.footer.section!.social[index]
            ) {
                state.elements.footer.section!.social[index].link = value;
            }
        },
        updateFooterSocialLinkAdd: (state) => {
            state.elements.footer = state.elements.footer || {};
            state.elements.footer.section = state.elements.footer.section || { social: [] };
            state.elements.footer.section.social = state.elements.footer.section.social || [];
            state.elements.footer.section.social?.push({ label: "", link: "" });
        },
        updateFooterSocialLinkRemove: (state, action: PayloadAction<number>) => {
            state.elements.footer = state.elements.footer || {};
            state.elements.footer.section = state.elements.footer.section || { social: [] };
            state.elements.footer.section.social = state.elements.footer.section.social || [];
            if (state.elements.footer.section.social?.[action.payload]) {
                state.elements.footer.section.social?.splice(action.payload, 1);
            }
        },
        updateFooterServicesLinkLabel: (
            state,
            action: PayloadAction<{ index: number; value: string }>
        ) => {
            state.elements.footer = state.elements.footer || {};
            state.elements.footer.section = state.elements.footer.section || { services: [] };
            const { index, value } = action.payload;
            if (
                state.elements.footer.section!.services &&
                state.elements.footer.section!.services[index]
            ) {
                state.elements.footer.section!.services[index].label = value;
            }
        },
        updateFooterServicesLinkTo: (
            state,
            action: PayloadAction<{ index: number; value: string }>
        ) => {
            state.elements.footer = state.elements.footer || {};
            state.elements.footer.section = state.elements.footer.section || { services: [] };
            const { index, value } = action.payload;
            if (
                state.elements.footer.section!.services &&
                state.elements.footer.section!.services[index]
            ) {
                state.elements.footer.section!.services[index].link = value;
            }
        },
        updateFooterServicesLinkAdd: (state) => {
            state.elements.footer = state.elements.footer || {};
            state.elements.footer.section = state.elements.footer.section || { services: [] };
            state.elements.footer.section.services = state.elements.footer.section.services || [];
            state.elements.footer.section.services?.push({ label: "", link: "" });
        },
        updateFooterServicesLinkRemove: (state, action: PayloadAction<number>) => {
            state.elements.footer = state.elements.footer || {};
            state.elements.footer.section = state.elements.footer.section || { services: [] };
            state.elements.footer.section.services = state.elements.footer.section.services || [];
            if (state.elements.footer.section.services?.[action.payload]) {
                state.elements.footer.section.services?.splice(action.payload, 1);
            }
        },
    },
});

export const {
    setLayout,
    updateSection,
    updateArrayElement,
    addArrayElement,
    removeArrayElement,
    loadTemplate,
    // Legacy actions
    updateNavbarActionLabel,
    updateNavbarLinkLabel,
    updateNavbarLinkTo,
    updateNavbarLinkAdd,
    updateNavbarLinkRemove,
    updateNavbarLogo,
    updateHeaderHeading,
    updateHeaderDescription,
    updateHeaderImage,
    updateHeaderActionButtonLabel,
    updateHeaderActionButtonLink,
    updateFooterLogo,
    updateFooterTitle,
    updateFooterDescription,
    updateFooterCopyRight,
    updateFooterPrivacyAndPolicyLabel,
    updateFooterPrivacyAndPolicyLink,
    updateFooterCtaButtonLabel,
    updateFooterCtaButtonLink,
    updateFooterMail,
    updateFooterPhone,
    updateFooterAddress,
    updateFooterSocialLinkLabel,
    updateFooterSocialLinkTo,
    updateFooterSocialLinkAdd,
    updateFooterSocialLinkRemove,
    updateFooterServicesLinkLabel,
    updateFooterServicesLinkTo,
    updateFooterServicesLinkAdd,
    updateFooterServicesLinkRemove,
} = layoutSlice.actions;

export default layoutSlice.reducer;
