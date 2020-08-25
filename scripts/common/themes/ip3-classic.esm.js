import themeDefault from './light.esm.js';

/*
 * IP3 (IB908C), VT 2020 Web Development, Client Side
 *
 * Contains a color palette matching the old IP3 course.
 *
 * @author <a href="mailto:pebo6883@student.su.se">Peter Borgstedt</a>
 */
export default {
  name: 'IP3 Classic',
  palette: {
    ...themeDefault.palette, // Merge default palette and override parameters

    sidebarBackground: '#5D8FEE',
    sidebarTopBackground: '#30D0F7',
    sidebarBottomBackground: 'transparent',
    sidebarTextColor: '#000',

    sidebarActionTopTextColor: '#5D8FEE',
    sidebarActionTopIconColor: '#5D8FEE',
    sidebarActionTopHoverTextColor: 'black',
    sidebarActionTopHoverIconColor: 'black',
    sidebarActionTopHoverBackground: 'transparent',

    sidebarActionBottomTextColor: '#30D0F7',
    sidebarActionBottomIconColor: '#30D0F7',
    sidebarActionBottomHoverTextColor: 'black',
    sidebarActionBottomHoverIconColor: 'black',
    sidebarActionBottomHoverBackground: 'transparent',

    sidebarChannelHeaderTextColor: '#30D0F7',
    sidebarChannelHeaderCursorColor: '#30D0F7',
    sidebarChannelHeaderHoverTextColor: '#463347',
    sidebarChannelHeaderHoverCursorColor: '#463347',

    sidebarChannelItemIcon: 'chat',
    sidebarChannelItemTextColor: '#30D0F7',
    sidebarChannelItemIconColor: 'black',
    sidebarChannelItemHoverTextColor: '#30D0F7',
    sidebarChannelItemHoverIconColor: 'white',
    sidebarChannelItemHoverBackground: '#605197',
    sidebarChannelItemSelectedBackground: '#463347',
    sidebarChannelItemSelectedTextColor: '#30D0F7',
    sidebarChannelItemSelectedIconColor: 'white',

    sidebarBorderHorizontalColor: 'transparent',
    sidebarBorderVerticalColor: 'transparent',
    sidebarBorderResizableHoverColor: '#463347',
    sidebarBorderResizableToggleHoverColor: 'white',
    sidebarBorderResizableToggleHoverBackground: '#463347',
    sidebarBorderResizableToggleOpenColor: 'gray',
    sidebarBorderResizableToggleOpenBackground: 'white',
    sidebarBorderResizableToggleClosedColor: 'white',
    sidebarBorderResizableToggleClosedBackground: 'gray',

    dropdownButtonColor: '#30D0F7',
    dropdownButtonHoverColor: '#463347',

    channelHeaderBackground: '#463348',
    channelHeaderTitleColor: 'white',
    channelHeaderDescriptionColor: '#30D0F7',
    channelHeaderActionIconColor: 'white',
    channelHeaderActionHoverIconColor: '#605197',
    channelHeaderSubscriptionColor: 'white',

    channelControlAttachmentHoverButtonBackground: '#605197',

    modalButtonHoverBorderColor: '#605197',
    modalButtonHoverBackground: '#605197',

    modalInputFocusBorderColor: '#605197',
    modalInputRadioColor: '#605197',

    profileRemoveImageColor: '#605197',

    subscriptionInputFocusOutlineColor: '#605197',
    subscriptionChannelHoverIconColor: '#605197'
  }
};
