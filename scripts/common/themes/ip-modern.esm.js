import themeDefault from './light.esm.js';

/*
 * IP3 (IB908C), VT 2020 Web Development, Client Side
 *
 * Contains a color palette matching the new IP courses.
 *
 * @author <a href="mailto:pebo6883@student.su.se">Peter Borgstedt</a>
 */
export default {
  name: 'IP Modern',
  palette: {
    ...themeDefault.palette, // Merge default palette and override parameters

    sidebarBackground: '#A3A86B',
    sidebarTopBackground: '#ACDEE5',
    sidebarBottomBackground: 'transparent',
    sidebarTextColor: 'black',

    sidebarActionTopTextColor: '#002F5F',
    sidebarActionTopIconColor: '#002F5F',
    sidebarActionTopHoverTextColor: 'black',
    sidebarActionTopHoverIconColor: 'black',
    sidebarActionTopHoverBackground: 'transparent',

    sidebarActionBottomTextColor: 'black',
    sidebarActionBottomIconColor: 'black',
    sidebarActionBottomHoverTextColor: '#002F5F',
    sidebarActionBottomHoverIconColor: '#002F5F',
    sidebarActionBottomHoverBackground: 'transparent',

    sidebarChannelHeaderTextColor: 'black',
    sidebarChannelHeaderCursorColor: 'black',
    sidebarChannelHeaderHoverTextColor: '#002F5F',
    sidebarChannelHeaderHoverCursorColor: '#002F5F',

    sidebarChannelItemIcon: 'chat',
    sidebarChannelItemTextColor: 'black',
    sidebarChannelItemIconColor: 'black',
    sidebarChannelItemHoverTextColor: 'black',
    sidebarChannelItemHoverIconColor: 'white',
    sidebarChannelItemHoverBackground: '#D95E01',
    sidebarChannelItemSelectedBackground: '#002F5F',
    sidebarChannelItemSelectedTextColor: '#ACDEE5',
    sidebarChannelItemSelectedIconColor: 'white',

    sidebarBorderHorizontalColor: 'transparent',
    sidebarBorderVerticalColor: 'transparent',
    sidebarBorderResizableHoverColor: '#002F5F',
    sidebarBorderResizableToggleHoverColor: 'white',
    sidebarBorderResizableToggleHoverBackground: '#002F5F',
    sidebarBorderResizableToggleOpenColor: 'gray',
    sidebarBorderResizableToggleOpenBackground: 'white',
    sidebarBorderResizableToggleClosedColor: 'white',
    sidebarBorderResizableToggleClosedBackground: 'gray',

    dropdownButtonColor: 'black',
    dropdownButtonHoverColor: '#002F5F',

    channelHeaderBackground: '#002F5F',
    channelHeaderTitleColor: 'white',
    channelHeaderDescriptionColor: '#D95E01',
    channelHeaderActionIconColor: 'white',
    channelHeaderActionHoverIconColor: '#D95E01',
    channelHeaderSubscriptionColor: 'white',

    channelControlAttachmentHoverButtonBackground: '#D95E01',

    modalButtonHoverBorderColor: '#D95E01',
    modalButtonHoverBackground: '#D95E01',

    modalInputFocusBorderColor: '#D95E01',
    modalInputRadioColor: '#D95E01',

    profileRemoveImageColor: '#D95E01',

    subscriptionInputFocusOutlineColor: '#D95E01',
    subscriptionChannelHoverIconColor: '#D95E01'
  }
};
