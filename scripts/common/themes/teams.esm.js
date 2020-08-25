import themeDefault from './light.esm.js';

/*
 * IP3 (IB908C), VT 2020 Web Development, Client Side
 *
 * Contains a color palette matching the chat client Teams.
 *
 * @author <a href="mailto:pebo6883@student.su.se">Peter Borgstedt</a>
 */
export default {
  name: 'Teams',
  palette: {
    ...themeDefault.palette, // Merge default palette and override parameters


    sidebarBackground: '#FFFFFF',
    sidebarTopBackground: '#464775',
    sidebarBottomBackground: '#333449',
    sidebarTextColor: 'white',

    sidebarActionTopTextColor: '#eee',
    sidebarActionTopIconColor: '#eee',
    sidebarActionTopHoverTextColor: 'white',
    sidebarActionTopHoverIconColor: 'white',
    sidebarActionTopHoverBackground: 'transparent',

    sidebarActionBottomTextColor: '#eee',
    sidebarActionBottomIconColor: '#eee',
    sidebarActionBottomHoverTextColor: 'white',
    sidebarActionBottomHoverIconColor: 'white',
    sidebarActionBottomHoverBackground: 'transparent',

    sidebarChannelHeaderTextColor: 'black',
    sidebarChannelHeaderCursorColor: 'black',
    sidebarChannelHeaderHoverTextColor: 'black',
    sidebarChannelHeaderHoverCursorColor: 'black',
    sidebarChannelItemIcon: 'chat',
    sidebarChannelItemTextColor: 'black',
    sidebarChannelItemIconColor: '#979593',
    sidebarChannelItemHoverTextColor: 'black',
    sidebarChannelItemHoverIconColor: '#979593',
    sidebarChannelItemHoverBackground: '#F3F2F1',
    sidebarChannelItemSelectedBackground: '#E1DFDD',
    sidebarChannelItemSelectedTextColor: 'black',
    sidebarChannelItemSelectedIconColor: '#6264A7',

    sidebarBorderHorizontalColor: '#ccc',
    sidebarBorderVerticalColor: '#eee',
    sidebarBorderResizableHoverColor: '#F35325',
    sidebarBorderResizableToggleHoverColor: 'white',
    sidebarBorderResizableToggleHoverBackground: '#F35325',
    sidebarBorderResizableToggleOpenColor: 'gray',
    sidebarBorderResizableToggleOpenBackground: 'white',
    sidebarBorderResizableToggleClosedColor: 'white',
    sidebarBorderResizableToggleClosedBackground: 'gray',

    dropdownButtonColor: '#555',
    dropdownButtonHoverColor: '#F35325',

    channelBackground: '#F3F2F1',

    channelHeaderBackground: '#333449',
    channelHeaderTitleColor: 'white',
    channelHeaderDescriptionColor: '#888',
    channelHeaderActionIconColor: 'white',
    channelHeaderActionHoverIconColor: '#F35325',
    channelHeaderSubscriptionColor: 'white',

    channelControlBorderColor: 'transparent',
    channelControlSeparatorBorderColor: '#464775',
    channelControlBackground: 'white',
    channelControlColor: '#444',

    channelControlAttachmentHoverButtonBackground: '#F35325',

    channelControlToolbarBackground: 'transparent',

    modalButtonHoverBorderColor: '#F35325',
    modalButtonHoverBackground: '#F35325',

    modalInputFocusBorderColor: '#F35325',
    modalInputRadioColor: '#F35325',

    profileRemoveImageColor: '#F35325',

    subscriptionInputFocusOutlineColor: '#F35325',
    subscriptionChannelHoverIconColor: '#F35325'
  }
};
