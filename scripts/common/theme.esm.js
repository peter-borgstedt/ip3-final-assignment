import themeLight from './themes/light.esm.js';
import themeDark from './themes/dark.esm.js';
import themeSlack from './themes/slack.esm.js';
import themeTeams from './themes/teams.esm.js';
import themeIP1Classic from './themes/ip1-classic.esm.js';
import themeIP3Classic from './themes/ip3-classic.esm.js';
import themeIPModern from './themes/ip-modern.esm.js';

/*
 * IP3 (IB908C), VT 2020 Web Development, Client Side
 *
 * Contains logic to change CSS variables with predefined color themes.
 *
 * @author <a href="mailto:pebo6883@student.su.se">Peter Borgstedt</a>
 */

/** All available color themes */
export const themes = new Map([
  ['default', themeLight],
  ['dark', themeDark],
  ['slack', themeSlack],
  ['teams', themeTeams],
  ['ip1-classic', themeIP1Classic],
  ['ip3-classic', themeIP3Classic],
  ['ip-modern', themeIPModern],
]);

/**
 * Sets a new theme and stores the choice in local storage.
 * @param {string} id Id of theme
 */
export const setTheme = (id) => {
  if (id) {
    const { palette } = themes.get(id);
    document.documentElement.style.setProperty('--chat-background', palette.chatBackground);
    document.documentElement.style.setProperty('--sidebar-background', palette.sidebarBackground);
    document.documentElement.style.setProperty('--sidebar-top-background', palette.sidebarTopBackground);
    document.documentElement.style.setProperty('--sidebar-bottom-background', palette.sidebarBottomBackground);
    document.documentElement.style.setProperty('--sidebar-text-color', palette.sidebarTextColor);
    document.documentElement.style.setProperty('--sidebar-action-top-text-color', palette.sidebarActionTopTextColor);
    document.documentElement.style.setProperty('--sidebar-action-top-icon-color', palette.sidebarActionTopIconColor);
    document.documentElement.style.setProperty('--sidebar-action-top-hover-text-color', palette.sidebarActionTopHoverTextColor);
    document.documentElement.style.setProperty('--sidebar-action-top-hover-icon-color', palette.sidebarActionTopHoverIconColor);
    document.documentElement.style.setProperty('--sidebar-action-top-hover-background', palette.sidebarActionTopHoverBackground);
    document.documentElement.style.setProperty('--sidebar-action-bottom-text-color', palette.sidebarActionBottomTextColor);
    document.documentElement.style.setProperty('--sidebar-action-bottom-icon-color', palette.sidebarActionBottomIconColor);
    document.documentElement.style.setProperty('--sidebar-action-bottom-hover-text-color', palette.sidebarActionBottomHoverTextColor);
    document.documentElement.style.setProperty('--sidebar-action-bottom-hover-icon-color', palette.sidebarActionBottomHoverIconColor);
    document.documentElement.style.setProperty('--sidebar-action-bottom-hover-background', palette.sidebarActionBottomHoverBackground);
    document.documentElement.style.setProperty('--sidebar-channel-header-text-color', palette.sidebarChannelHeaderTextColor);
    document.documentElement.style.setProperty('--sidebar-channel-header-cursor-color', palette.sidebarChannelHeaderCursorColor);
    document.documentElement.style.setProperty('--sidebar-channel-header-hover-text-color', palette.sidebarChannelHeaderHoverTextColor);
    document.documentElement.style.setProperty('--sidebar-channel-header-hover-cursor-color', palette.sidebarChannelHeaderHoverCursorColor);
    document.documentElement.style.setProperty('--sidebar-channel-item-icon', `"${palette.sidebarChannelItemIcon}"`);
    document.documentElement.style.setProperty('--sidebar-channel-item-text-color', palette.sidebarChannelItemTextColor);
    document.documentElement.style.setProperty('--sidebar-channel-item-icon-color', palette.sidebarChannelItemIconColor);
    document.documentElement.style.setProperty('--sidebar-channel-item-hover-text-color', palette.sidebarChannelItemHoverTextColor);
    document.documentElement.style.setProperty('--sidebar-channel-item-hover-icon-color', palette.sidebarChannelItemHoverIconColor);
    document.documentElement.style.setProperty('--sidebar-channel-item-hover-background', palette.sidebarChannelItemHoverBackground);
    document.documentElement.style.setProperty('--sidebar-channel-item-selected-background', palette.sidebarChannelItemSelectedBackground);
    document.documentElement.style.setProperty('--sidebar-channel-item-selected-text-color', palette.sidebarChannelItemSelectedTextColor);
    document.documentElement.style.setProperty('--sidebar-channel-item-selected-icon-color', palette.sidebarChannelItemSelectedIconColor);
    document.documentElement.style.setProperty('--sidebar-border-horizontal-color', palette.sidebarBorderHorizontalColor);
    document.documentElement.style.setProperty('--sidebar-border-vertical-color', palette.sidebarBorderVerticalColor);
    document.documentElement.style.setProperty('--sidebar-border-resizable-hover-color', palette.sidebarBorderResizableHoverColor);
    document.documentElement.style.setProperty('--sidebar-border-resizable-toggle-hover-color', palette.sidebarBorderResizableToggleHoverColor);
    document.documentElement.style.setProperty('--sidebar-border-resizable-toggle-hover-background', palette.sidebarBorderResizableToggleHoverBackground);
    document.documentElement.style.setProperty('--sidebar-border-resizable-toggle-open-color', palette.sidebarBorderResizableToggleOpenColor);
    document.documentElement.style.setProperty('--sidebar-border-resizable-toggle-open-background', palette.sidebarBorderResizableToggleOpenBackground);
    document.documentElement.style.setProperty('--sidebar-border-resizable-toggle-closed-color', palette.sidebarBorderResizableToggleClosedColor);
    document.documentElement.style.setProperty('--sidebar-border-resizable-toggle-closed-background', palette.sidebarBorderResizableToggleClosedBackground);

    document.documentElement.style.setProperty('--channel-header-background', palette.channelHeaderBackground);
    document.documentElement.style.setProperty('--channel-header-border-color', palette.channelHeaderBorderColor);
    document.documentElement.style.setProperty('--channel-header-title-color', palette.channelHeaderTitleColor);
    document.documentElement.style.setProperty('--channel-header-description-color', palette.channelHeaderDescriptionColor);
    document.documentElement.style.setProperty('--channel-header-action-icon-color', palette.channelHeaderActionIconColor);
    document.documentElement.style.setProperty('--channel-header-action-hover-icon-color', palette.channelHeaderActionHoverIconColor);
    document.documentElement.style.setProperty('--channel-header-subscription-color', palette.channelHeaderSubscriptionColor);

    document.documentElement.style.setProperty('--channel-background', palette.channelBackground);

    document.documentElement.style.setProperty('--channel-control-border-color', palette.channelControlBorderColor);
    document.documentElement.style.setProperty('--channel-control-separator-border-color', palette.channelControlSeparatorBorderColor);

    document.documentElement.style.setProperty('--channel-control-background', palette.channelControlBackground);
    document.documentElement.style.setProperty('--channel-control-color', palette.channelControlColor);
    document.documentElement.style.setProperty('--channel-control-toolbar-background', palette.channelControlToolbarBackground);
    document.documentElement.style.setProperty('--channel-control-toolbar-action-icon-color', palette.channelControlToolbarActionIconColor);
    document.documentElement.style.setProperty('--channel-control-toolbar-action-icon-background', palette.channelControlToolbarActionIconBackground);

    document.documentElement.style.setProperty('--channel-control-toolbar-action-hover-icon-color', palette.channelControlToolbarActionHoverIconColor);
    document.documentElement.style.setProperty('--channel-control-toolbar-action-hover-icon-background', palette.channelControlToolbarActionHoverIconBackground);

    document.documentElement.style.setProperty('--channel-control-toolbar-action-selected-icon-background', palette.channelControlToolbarActionSelectedIconBackground);
    document.documentElement.style.setProperty('--channel-control-toolbar-action-selected-border-color', palette.channelControlToolbarActionSelectedBorderColor);

    document.documentElement.style.setProperty('--channel-control-attachment-background', palette.channelControlAttachmentBackground);
    document.documentElement.style.setProperty('--channel-control-attachment-border-color', palette.channelControlAttachmentBorderColor);
    document.documentElement.style.setProperty('--channel-control-attachment-hover-background', palette.channelControlAttachmentHoverBackground);
    document.documentElement.style.setProperty('--channel-control-attachment-hover-border-color', palette.channelControlAttachmentHoverBorderColor);
    
    document.documentElement.style.setProperty('--channel-control-attachment-hover-button-color', palette.channelControlAttachmentHoverButtonColor);
    document.documentElement.style.setProperty('--channel-control-attachment-hover-button-background', palette.channelControlAttachmentHoverButtonBackground);

    document.documentElement.style.setProperty('--channel-message-background', palette.channelMessageBackground);
    document.documentElement.style.setProperty('--channel-message-hover-background', palette.channelMessageHoverBackground);
    document.documentElement.style.setProperty('--channel-message-username-color', palette.channelMessageUsernameColor);
    document.documentElement.style.setProperty('--channel-message-timestamp-color', palette.channelMessageTimestampColor);
    document.documentElement.style.setProperty('--channel-message-text-color', palette.channelMessageTextColor);
    document.documentElement.style.setProperty('--channel-message-delete-background', palette.channelMessageDeleteBackground);
    document.documentElement.style.setProperty('--channel-message-delete-hover-background', palette.channelMessageDeleteHoverBackground);

    document.documentElement.style.setProperty('--modal-background', palette.modalBackground);
    document.documentElement.style.setProperty('--modal-border-color', palette.modalBorderColor);
    document.documentElement.style.setProperty('--modal-header-background', palette.modalHeaderBackground);
    document.documentElement.style.setProperty('--modal-header-color', palette.modalHeaderColor);
    document.documentElement.style.setProperty('--modal-button-border-color', palette.modalButtonBorderColor);
    document.documentElement.style.setProperty('--modal-button-background', palette.modalButtonBackground);
    document.documentElement.style.setProperty('--modal-button-color', palette.modalButtonColor);
    document.documentElement.style.setProperty('--modal-button-hover-border-color', palette.modalButtonHoverBorderColor);
    document.documentElement.style.setProperty('--modal-button-hover-background', palette.modalButtonHoverBackground);
    document.documentElement.style.setProperty('--modal-button-hover-color', palette.modalButtonHoverColor);

    document.documentElement.style.setProperty('--modal-label-color', palette.modalLabelColor);
    document.documentElement.style.setProperty('--modal-input-border-color', palette.modalInputBorderColor);
    document.documentElement.style.setProperty('--modal-input-background', palette.modalInputBackground);
    document.documentElement.style.setProperty('--modal-input-color', palette.modalInputColor);
    document.documentElement.style.setProperty('--modal-input-focus-border-color', palette.modalInputFocusBorderColor);
    document.documentElement.style.setProperty('--modal-input-radio-color', palette.modalInputRadioColor);

    document.documentElement.style.setProperty('--profile-remove-image-color', palette.profileRemoveImageColor);

    document.documentElement.style.setProperty('--dropdown-button-color', palette.dropdownButtonColor);
    document.documentElement.style.setProperty('--dropdown-button-hover-color', palette.dropdownButtonHoverColor);
    document.documentElement.style.setProperty('--dropdown-button-hover-background', palette.dropdownButtonHoverBackground);

    document.documentElement.style.setProperty('--subscription-background', palette.subscriptionBackground);
    document.documentElement.style.setProperty('--subscription-border-color', palette.subscriptionBorderColor);
    document.documentElement.style.setProperty('--subscription-input-border-color', palette.subscriptionInputBorderColor);
    document.documentElement.style.setProperty('--subscription-input-color', palette.subscriptionInputColor);
    document.documentElement.style.setProperty('--subscription-input-focus-border-color', palette.subscriptionInputFocusBorderColor);
    document.documentElement.style.setProperty('--subscription-input-focus-outline-color', palette.subscriptionInputFocusOutlineColor);
    document.documentElement.style.setProperty('--subscription-header-color', palette.subscriptionHeaderColor);
    document.documentElement.style.setProperty('--subscription-channel-border-color', palette.subscriptionChannelBorderColor);
    document.documentElement.style.setProperty('--subscription-channel-color', palette.subscriptionChannelColor);
    document.documentElement.style.setProperty('--subscription-channel-icon-color', palette.subscriptionChannelIconColor);
    document.documentElement.style.setProperty('--subscription-channel-hover-icon-color', palette.subscriptionChannelHoverIconColor);
    document.documentElement.style.setProperty('--subscription-channel-hover-background', palette.subscriptionChannelHoverBackground);

    document.documentElement.style.setProperty('--smiley-spinner-color', palette.smileySpinnerColor);

  }
};
