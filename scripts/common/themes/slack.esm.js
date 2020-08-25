import themeDefault from './light.esm.js';

/*
 * IP3 (IB908C), VT 2020 Web Development, Client Side
 *
 * Contains a color palette matching the chat client Slack.
 *
 * @author <a href="mailto:pebo6883@student.su.se">Peter Borgstedt</a>
 */
export default {
  name: 'Slack',
  palette: {
    ...themeDefault.palette, // Merge default palette and override parameters

    sidebarBackground: '#3F0E40',
    sidebarTopBackground: 'transparent',
    sidebarBottomBackground: 'transparent',
    sidebarTextColor: '#CFC3CF',

    sidebarActionTopTextColor: '#CFC3CF',
    sidebarActionTopIconColor: '#CFC3CF',
    sidebarActionTopHoverTextColor: '#CFC3CF',
    sidebarActionTopHoverIconColor: '#CFC3CF',
    sidebarActionTopHoverBackground: '#350D36',

    sidebarActionBottomTextColor: '#CFC3CF',
    sidebarActionBottomIconColor: '#CFC3CF',
    sidebarActionBottomHoverTextColor: '#CFC3CF',
    sidebarActionBottomHoverIconColor: '#CFC3CF',
    sidebarActionBottomHoverBackground: '#350D36',

    sidebarChannelHeaderTextColor: '#CFC3CF',
    sidebarChannelHeaderCursorColor: '#CFC3CF',
    sidebarChannelHeaderHoverTextColor: '#CFC3CF',
    sidebarChannelHeaderHoverCursorColor: '#CFC3CF',
    sidebarChannelItemIcon: '#',
    sidebarChannelItemTextColor: '#CFC3CF',
    sidebarChannelItemIconColor: '#CFC3CF',
    sidebarChannelItemHoverTextColor: '#CFC3CF',
    sidebarChannelItemHoverIconColor: '#CFC3CF',
    sidebarChannelItemHoverBackground: '#350D36',
    sidebarChannelItemSelectedBackground: '#1264A3',
    sidebarChannelItemSelectedTextColor: 'white',
    sidebarChannelItemSelectedIconColor: 'white',

    sidebarBorderHorizontalColor: '#522753',
    sidebarBorderVerticalColor: '#522753',
    sidebarBorderResizableHoverColor: '#1C9BD1',
    sidebarBorderResizableToggleHoverColor: 'white',
    sidebarBorderResizableToggleHoverBackground: '#1C9BD1',
    sidebarBorderResizableToggleOpenColor: 'gray',
    sidebarBorderResizableToggleOpenBackground: 'white',
    sidebarBorderResizableToggleClosedColor: 'white',
    sidebarBorderResizableToggleClosedBackground: 'gray',

    dropdownButtonColor: '#CFC3CF',
    dropdownButtonHoverColor: 'white',
    dropdownButtonHoverBackground: '#532654',

    channelHeaderActionHoverIconColor: '#1C9BD1',

    channelControlBorderColor: '#606060',
    channelControlSeparatorBorderColor: '#ddd',

    channelControlToolbarBackground: '#F8F8F8',
    channelControlToolbarActionIconColor: '#888',
    channelControlToolbarActionIconBackground: 'transparent',
    channelControlToolbarActionHoverIconColor: '#222',
    channelControlToolbarActionHoverIconBackground: '#eee',
    channelControlToolbarActionSelectedIconBackground: '#ddd',
    channelControlToolbarActionSelectedBorderColor: 'transparent',

    channelControlAttachmentHoverButtonBackground: '#1C9BD1',

    modalButtonHoverBorderColor: '#1C9BD1',
    modalButtonHoverBackground: '#1C9BD1',

    modalInputFocusBorderColor: '#1C9BD1',
    modalInputRadioColor: '#1C9BD1',

    profileRemoveImageColor: '#1C9BD1',

    subscriptionInputFocusOutlineColor: '#1C9BD1',
    subscriptionChannelHoverIconColor: '#1C9BD1'
  }
};
