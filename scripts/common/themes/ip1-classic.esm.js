import themeDefault from './light.esm.js';

/*
 * IP3 (IB908C), VT 2020 Web Development, Client Side
 *
 * Contains a color palette matching the old IP1 course.
 *
 * @author <a href="mailto:pebo6883@student.su.se">Peter Borgstedt</a>
 */
export default {
  name: 'IP1 Classic',
  palette: {
    ...themeDefault.palette, // Merge default palette and override parameters

    sidebarBackground: '#C8782A',
    sidebarTopBackground: '#E1B65B',
    sidebarBottomBackground: 'transparent',
    sidebarTextColor: '#000',

    sidebarActionTopTextColor: '#C8782A',
    sidebarActionTopIconColor: '#C8782A',
    sidebarActionTopHoverTextColor: '#142D58',
    sidebarActionTopHoverIconColor: '#142D58',
    sidebarActionTopHoverBackground: 'transparent',

    sidebarActionBottomTextColor: '#E1B65B',
    sidebarActionBottomIconColor: '#E1B65B',
    sidebarActionBottomHoverTextColor: '#142D58',
    sidebarActionBottomHoverIconColor: '#142D58',
    sidebarActionBottomHoverBackground: 'transparent',

    sidebarChannelHeaderTextColor: '#E1B65B',
    sidebarChannelHeaderCursorColor: '#E1B65B',
    sidebarChannelHeaderHoverTextColor: '#142D58',
    sidebarChannelHeaderHoverCursorColor: '#142D58',

    sidebarChannelItemIcon: 'chat',
    sidebarChannelItemTextColor: '#E1B65B',
    sidebarChannelItemIconColor: 'black',
    sidebarChannelItemHoverTextColor: '#E1B65B',
    sidebarChannelItemHoverIconColor: 'white',
    sidebarChannelItemHoverBackground: '#142D58',
    sidebarChannelItemSelectedBackground: '#447F6E',
    sidebarChannelItemSelectedTextColor: '#E1B65B',
    sidebarChannelItemSelectedIconColor: 'white',

    sidebarBorderHorizontalColor: 'transparent',
    sidebarBorderVerticalColor: 'transparent',
    sidebarBorderResizableHoverColor: '#447F6E',
    sidebarBorderResizableToggleHoverColor: 'white',
    sidebarBorderResizableToggleHoverBackground: '#447F6E',
    sidebarBorderResizableToggleOpenColor: 'gray',
    sidebarBorderResizableToggleOpenBackground: 'white',
    sidebarBorderResizableToggleClosedColor: 'white',
    sidebarBorderResizableToggleClosedBackground: 'gray',

    dropdownButtonColor: '#E1B65B',
    dropdownButtonHoverColor: '#142D58',

    channelHeaderBackground: '#447F6E',
    channelHeaderTitleColor: 'white',
    channelHeaderDescriptionColor: '#E1B65B',
    channelHeaderActionIconColor: 'white',
    channelHeaderActionHoverIconColor: '#142D58',
    channelHeaderSubscriptionColor: 'white',

    channelControlAttachmentHoverButtonBackground: '#142D58',

    modalButtonHoverBorderColor: '#142D58',
    modalButtonHoverBackground: '#142D58',

    modalInputFocusBorderColor: '#142D58',
    modalInputRadioColor: '#142D58',

    profileRemoveImageColor: '#142D58',

    subscriptionInputFocusOutlineColor: '#142D58',
    subscriptionChannelHoverIconColor: '#142D58'
  }
};
