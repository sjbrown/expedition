import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Close from '@material-ui/icons/Close';
import NetworkWifi from '@material-ui/icons/NetworkWifi';
import SignalWifiOff from '@material-ui/icons/SignalWifiOff';
import * as React from 'react';
import {getMultiplayerClient} from '../../Multiplayer';
import {CardThemeType, MultiplayerState} from '../../reducers/StateTypes';

export interface StateProps {
  multiplayer: MultiplayerState;
  cardTheme: CardThemeType;
  questTheme: string;
}

export interface DispatchProps {
  onMultiplayerExit: () => void;
  onMultiplayerStatusIconTap: () => void;
}

export interface Props extends StateProps, DispatchProps {}

const MultiplayerFooter = (props: Props): JSX.Element => {
  const classes = ['remote_footer', `card_theme_${props.cardTheme}`, `quest_theme_${props.questTheme}`];
  const color = (props.cardTheme === 'dark') ? 'white' : 'black';
  const adventurerIcon = (props.cardTheme === 'dark') ? 'images/adventurer_white_small.svg' : 'images/adventurer_small.svg';
  const peers: JSX.Element[] = [];
  const rpClient = getMultiplayerClient();
  for (const client of Object.keys(props.multiplayer.clientStatus)) {
    const lastStatus = props.multiplayer.clientStatus[client];
    if (!lastStatus.connected) {
      continue;
    }
    peers.push(<img key={client} className="inline_icon" src={adventurerIcon} />);
  }

  // TODO: Indicate when waiting for other user action
  // TODO Icon colors here and in IconButton below
  const statusIcon = (
    <IconButton onClick={(e: any) => {props.onMultiplayerStatusIconTap(); }}>
      {(rpClient.isConnected()) ? <NetworkWifi nativeColor={color} /> : <SignalWifiOff nativeColor={color} />}
    </IconButton>
  );

  return (
    <div className={classes.join(' ')}>
      <IconButton onClick={(e: any) => {props.onMultiplayerExit(); }}>
         <Close nativeColor={color} />
      </IconButton>
      <Button className="peers">
        {peers}
      </Button>
      {statusIcon}
    </div>
  );
};

export default MultiplayerFooter;
