import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import * as React from 'react';
import {Quest} from 'shared/schema/Quests';
import {openWindow} from '../../Globals';
import {MultiplayerCounters} from '../../Multiplayer';
import {ContentSetsType, DialogState, FeedbackType, QuestState, SavedQuestMeta, SettingsType, UserState} from '../../reducers/StateTypes';
import Checkbox from './Checkbox';
import Picker from './Picker';

export interface BaseDialogProps extends React.Props<any> {
  onClose: () => void;
  open: boolean;
}
export class ConfirmationDialog<T extends BaseDialogProps> extends React.Component<T, {}> {
  protected title: string;
  protected content: JSX.Element|null;
  protected action?: string;

  constructor(props: T) {
    super(props);
  }

  public onAction() {
    throw new Error('Unimplemented');
  }

  public render(): JSX.Element {
    return (
      <Dialog classes={{paperWidthSm: 'dialog'}} open={Boolean(this.props.open)}>
        <DialogTitle>{this.title || 'Confirm'}</DialogTitle>
        <DialogContent className="dialog">
          {this.content}
        </DialogContent>
        <DialogActions>
          <Button id="closeButton" onClick={() => this.props.onClose()}>Cancel</Button>
          <Button id="actionButton" className="primary" onClick={() => this.onAction()}>{this.action || 'Exit'}</Button>
        </DialogActions>
      </Dialog>
    );
  }
}

interface ExitDialogProps extends BaseDialogProps {
  onExit: () => void;
}

export class ExitQuestDialog extends ConfirmationDialog<ExitDialogProps> {
  constructor(props: ExitDialogProps) {
    super(props);
    this.title = 'Exit Quest?';
    this.content = <p>Tapping exit will lose your place in the quest and return you to the home screen.</p>;
  }

  public onAction() {
    this.props.onExit();
  }
}

export class ExitMultiplayerDialog extends ConfirmationDialog<ExitDialogProps> {
  constructor(props: ExitDialogProps) {
    super(props);
    this.title = 'Exit Multiplayer?';
    this.content = <p>Tapping exit will disconnect you from your peers and return you to the home screen.</p>;
  }

  public onAction() {
    this.props.onExit();
  }
}

interface DeleteSavedQuestDialogProps extends BaseDialogProps {
  onDelete: (savedQuest: SavedQuestMeta) => void;
  savedQuest: SavedQuestMeta|null;
}

export class DeleteSavedQuestDialog extends ConfirmationDialog<DeleteSavedQuestDialogProps> {
  constructor(props: DeleteSavedQuestDialogProps) {
    super(props);
    this.title = 'Delete saved quest?';
    this.content = null;
    this.action = 'Delete';
  }

  public onAction() {
    const savedQuest = this.props.savedQuest;
    if (savedQuest === null) {
      throw new Error('missing saved quest information');
    }
    this.props.onDelete(savedQuest);
  }
}

interface MultiplayerStatusDialogProps extends React.Props<any> {
  onClose: () => void;
  onSendReport: (user: UserState, quest: Quest, stats: MultiplayerCounters) => void;
  open: boolean;
  questDetails: Quest;
  stats: MultiplayerCounters;
  user: UserState;
}

export class MultiplayerStatusDialog extends React.Component<MultiplayerStatusDialogProps, {}> {
  public render(): JSX.Element {

    const stats = <ul>{
        Object.keys(this.props.stats).map((k, i) => {
          return <li key={i}>{k}: {this.props.stats[k]}</li>;
        })
      }</ul>;

      // TODO: autoScrollBodyContent={true} ???
    return (
      <Dialog classes={{paperWidthSm: 'dialog'}} open={Boolean(this.props.open)}>
        <DialogTitle>Multiplayer Stats</DialogTitle>
        <DialogContent className="dialog">
          <p>Here's some multiplayer debugging information:</p>
          {stats}
          <p>
            If you're experiencing problems with multiplayer, please
            tap "Send Report" below to send a log to the Expedition team. Thanks!
          </p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => this.props.onClose()}>Cancel</Button>,
          <Button id="sendReportButton" className="primary" onClick={() => this.props.onSendReport(this.props.user, this.props.questDetails, this.props.stats)}>Send Report</Button>
        </DialogActions>
      </Dialog>
    );
  }
}

interface ExpansionSelectDialogProps extends React.Props<any> {
  onExpansionSelect: (contentSets: ContentSetsType) => void;
  open: boolean;
}

export class ExpansionSelectDialog extends React.Component<ExpansionSelectDialogProps, {}> {
  public render(): JSX.Element {
    return (
      <Dialog classes={{paperWidthSm: 'dialog'}} open={Boolean(this.props.open)}>
        <DialogTitle>Choose game</DialogTitle>
        <DialogContent className="dialog">
          <Button id="base" className="primary large" onClick={() => this.props.onExpansionSelect({horror: false, future: false})}>Base Game</Button>
          <br/>
          <br/>
          <Button id="horror" className="primary large" onClick={() => this.props.onExpansionSelect({horror: true})}>Base + Horror</Button>
          <br/>
          <br/>
          <Button id="future" className="primary large" onClick={() => this.props.onExpansionSelect({horror: true, future: true})}>Base + Horror + Future</Button>
          <p style={{textAlign: 'center', marginTop: '1.5em'}}>This will only appear once, but you can change it at any time in Settings.</p>
          <p style={{textAlign: 'center', marginTop: '1.5em'}}>Don't have the cards? <strong><a href="#" onClick={() => openWindow('https://expeditiongame.com/store?utm_source=app')}>Get a copy</a></strong>.</p>
        </DialogContent>
      </Dialog>
    );
  }
}

export class TextAreaDialog<T extends BaseDialogProps> extends React.Component<T, {}> {
  protected title: string;
  protected content: JSX.Element;
  protected helperText: string;

  public state: {text: string};

  constructor(props: T) {
    super(props);
    this.state = {text: ''};
  }

  public onSubmit() {
    throw new Error('Unimplemented');
  }

  public render(): JSX.Element {
    return (
      <Dialog classes={{paperWidthSm: 'dialog'}} open={Boolean(this.props.open)}>
        <DialogTitle>{this.title}</DialogTitle>
        <DialogContent className="dialog">
          {this.content}
          <TextField
            className="textfield"
            fullWidth={true}
            helperText={this.helperText}
            multiline={true}
            onChange={(e: any) => this.setState({text: e.target.value})}
            onFocus={(e: any) => e.target.scrollIntoView()}
            rows={3}
            rowsMax={6}
            value={this.state.text}
          />
        </DialogContent>
        <DialogActions>
          <Button id="cancelButton" onClick={() => this.props.onClose()}>Cancel</Button>
          <Button id="submitButton" className="primary" onClick={() => this.onSubmit()}>Submit</Button>
        </DialogActions>
      </Dialog>
    );
  }
}

interface FeedbackDialogProps extends BaseDialogProps {
  quest: QuestState;
  settings: SettingsType;
  user: UserState;
  onFeedbackSubmit: (type: FeedbackType, quest: QuestState, settings: SettingsType, user: UserState, text: string) => void;
}

export class FeedbackDialog extends TextAreaDialog<FeedbackDialogProps> {
  constructor(props: FeedbackDialogProps) {
    super(props);
    this.title = 'Send Feedback';
    this.content = <p>Thank you for taking the time to give us feedback! If you've encountered a bug, please include the steps that you can take to reproduce the issue.</p>;
    this.helperText = 'Your feedback here';
  }

  public onSubmit() {
    this.props.onFeedbackSubmit('feedback', this.props.quest, this.props.settings, this.props.user, this.state.text);
  }
}

interface ReportErrorDialogProps extends FeedbackDialogProps {
  error: string;
}
export class ReportErrorDialog extends TextAreaDialog<ReportErrorDialogProps> {
  constructor(props: ReportErrorDialogProps) {
    super(props);
    this.title = 'Report Error';
    this.content = <p>Thank you for taking the time to report an error! What were you doing when the error occurred?</p>;
    this.helperText = 'What you were doing at the time of the error';
  }

  public onSubmit() {
    this.props.onFeedbackSubmit('report_error', this.props.quest, this.props.settings, this.props.user, this.state.text + '... Error: ' + this.props.error);
  }
}

export class ReportQuestDialog extends TextAreaDialog<FeedbackDialogProps> {
  constructor(props: FeedbackDialogProps) {
    super(props);
    this.title = 'Report Quest';
    this.content = (
      <span>
        <p>You're reporting an issue with <i>{props.quest.details.title}</i>.</p>
        <p>You should report a quest (instead of reviewing it at the end of the quest) if it is:</p>
        <ul>
          <li>Offensive or inappropriate for the age level it claimed to be.</li>
          <li>Broken or buggy.</li>
          <li>Incomplete or missing sections.</li>
        </ul>
      </span>
    );
    this.helperText = 'Describe the issue';
  }

  public onSubmit() {
    this.props.onFeedbackSubmit('report_quest', this.props.quest, this.props.settings, this.props.user, this.state.text);
  }
}

interface SetPlayerCountDialogProps extends React.Props<any> {
  open: boolean;
  quest: Quest;
  settings: SettingsType;
  onClose: () => void;
  onMultitouchChange: (v: boolean) => void;
  onPlayerDelta: (numPlayers: number, delta: number) => void;
  playQuest: (quest: Quest) => void;
}

export class SetPlayerCountDialog extends React.Component<SetPlayerCountDialogProps, {}> {
  public render(): JSX.Element {
    const quest = this.props.quest;
    let playersAllowed = true;
    if (quest.minplayers && quest.maxplayers) {
      playersAllowed = (this.props.settings.numPlayers >= quest.minplayers &&
        this.props.settings.numPlayers <= quest.maxplayers);
    }
    let contents = <div>
        <Picker id="adventurerCount" label="Adventurers" value={this.props.settings.numPlayers} onDelta={(i: number) => this.props.onPlayerDelta(this.props.settings.numPlayers, i)}>
          {!playersAllowed && `Quest requires ${quest.minplayers} - ${quest.maxplayers} players.`}
        </Picker>
        <Checkbox id="multitouch" label="Multitouch" value={this.props.settings.multitouch} onChange={this.props.onMultitouchChange}>
          {(this.props.settings.multitouch) ? 'All players must hold their finger on the screen to end combat.' : 'A single tap will end combat.'}
        </Checkbox>
      </div>;

    let expansionErr = '';
    if (quest.expansionhorror && !this.props.settings.contentSets.horror) {
      expansionErr = 'Horror';
    } else if (quest.expansionfuture && !this.props.settings.contentSets.future) {
      expansionErr = 'Future';
    }
    if (expansionErr) {
      contents = <div className="error">
          The {expansionErr} expansion is required to play this quest.
          If you have it, make sure to enable it in settings.
          Otherwise, you can pick up a copy on
          <a href="#" onClick={() => openWindow('https://expeditiongame.com/store?utm_source=app')}>the Expedition Store</a>.
        </div>;
    }
    return (
      <Dialog classes={{paperWidthSm: 'dialog'}} open={Boolean(this.props.open)}>
        <DialogTitle>{expansionErr ? 'Expansion Required' : 'How many players?'}</DialogTitle>
        <DialogContent className="dialog">
          {contents}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => this.props.onClose()}>Cancel</Button>
          {!expansionErr && <Button id="play" disabled={!playersAllowed} className="primary" onClick={() => this.props.playQuest(this.props.quest)}>Play</Button>}
        </DialogActions>
      </Dialog>
    );
  }
}

export interface StateProps {
  dialog: DialogState;
  multiplayerStats: MultiplayerCounters;
  quest: QuestState;
  selectedSave: SavedQuestMeta|null;
  settings: SettingsType;
  user: UserState;
}

export interface DispatchProps {
  onClose: () => void;
  onDeleteSavedQuest: (savedQuest: SavedQuestMeta) => void;
  onExitMultiplayer: () => void;
  onExitQuest: () => void;
  onExpansionSelect: (contentSets: ContentSetsType) => void;
  onFeedbackSubmit: (type: FeedbackType, quest: QuestState, settings: SettingsType, user: UserState, text: string) => void;
  onMultitouchChange: (v: boolean) => void;
  onPlayerDelta: (numPlayers: number, delta: number) => void;
  onSendMultiplayerReport: (user: UserState, quest: Quest, stats: MultiplayerCounters) => void;
  playQuest: (quest: Quest) => void;
}

interface Props extends StateProps, DispatchProps {}

const Dialogs = (props: Props): JSX.Element => {
  return (
    <span>
      <DeleteSavedQuestDialog
        savedQuest={props.selectedSave}
        open={props.dialog && props.dialog.open === 'DELETE_SAVED_QUEST'}
        onDelete={props.onDeleteSavedQuest}
        onClose={props.onClose}
      />
      <ExitQuestDialog
        open={props.dialog && props.dialog.open === 'EXIT_QUEST'}
        onExit={props.onExitQuest}
        onClose={props.onClose}
      />
      <ExpansionSelectDialog
        open={props.dialog && props.dialog.open === 'EXPANSION_SELECT'}
        onExpansionSelect={(contentSets: ContentSetsType) => props.onExpansionSelect(contentSets)}
      />
      <ExitMultiplayerDialog
        open={props.dialog && props.dialog.open === 'EXIT_REMOTE_PLAY'}
        onExit={props.onExitMultiplayer}
        onClose={props.onClose}
      />
      <MultiplayerStatusDialog
        open={props.dialog && props.dialog.open === 'MULTIPLAYER_STATUS'}
        stats={props.multiplayerStats}
        user={props.user}
        questDetails={props.quest.details}
        onSendReport={props.onSendMultiplayerReport}
        onClose={props.onClose}
      />
      <FeedbackDialog
        open={props.dialog && props.dialog.open === 'FEEDBACK'}
        onFeedbackSubmit={props.onFeedbackSubmit}
        onClose={props.onClose}
        quest={props.quest}
        settings={props.settings}
        user={props.user}
      />
      <ReportErrorDialog
        error={props.dialog && props.dialog.message || ''}
        open={props.dialog && props.dialog.open === 'REPORT_ERROR'}
        onFeedbackSubmit={props.onFeedbackSubmit}
        onClose={props.onClose}
        quest={props.quest}
        settings={props.settings}
        user={props.user}
      />
      <ReportQuestDialog
        open={props.dialog && props.dialog.open === 'REPORT_QUEST'}
        onFeedbackSubmit={props.onFeedbackSubmit}
        onClose={props.onClose}
        quest={props.quest}
        settings={props.settings}
        user={props.user}
      />
      <SetPlayerCountDialog
        open={props.dialog && props.dialog.open === 'SET_PLAYER_COUNT'}
        onMultitouchChange={props.onMultitouchChange}
        onPlayerDelta={props.onPlayerDelta}
        onClose={props.onClose}
        playQuest={props.playQuest}
        quest={props.quest.details}
        settings={props.settings}
      />
    </span>
  );
};

export default Dialogs;
