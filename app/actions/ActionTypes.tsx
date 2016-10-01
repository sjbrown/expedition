import {CardState, SettingNameType, XMLElement, TransitionType, UserState, SearchPhase} from '../reducers/StateTypes'
import {QuestDetails, Enemy, CombatPhaseNameType} from '../reducers/QuestTypes'

export interface NavigateAction extends Redux.Action {
  type: 'NAVIGATE';
  to: CardState;
  phase?: CombatPhaseNameType | SearchPhase;
};

export interface ReturnAction extends Redux.Action {
  type: 'RETURN';
  before?: string;
};

export interface InitQuestAction extends Redux.Action {
  type: 'INIT_QUEST';
  node: XMLElement;
}

export interface ChoiceAction extends Redux.Action {
  type: 'CHOICE';
  choice: number;
};

export interface EventAction extends Redux.Action {
  type: 'EVENT';
  event: string;
}

export interface ChangeSettingsAction extends Redux.Action {
  type: 'CHANGE_SETTINGS';
  settings: any;
}

export interface InitCombatAction extends Redux.Action {
  type: 'INIT_COMBAT';
  numPlayers: number;
  enemies: Enemy[];
}

export interface CombatTimerStopAction extends Redux.Action {
  type: 'COMBAT_TIMER_STOP';
  elapsedMillis: number;
}

export interface CombatDefeatAction extends Redux.Action {
  type: 'COMBAT_DEFEAT';
}

export interface CombatVictoryAction extends Redux.Action {
  type: 'COMBAT_VICTORY';
}

export interface TierSumDeltaAction extends Redux.Action {
  type: 'TIER_SUM_DELTA';
  delta: number;
}

export interface AdventurerDeltaAction extends Redux.Action {
  type: 'ADVENTURER_DELTA';
  delta: number;
}

export interface SearchResponseAction extends Redux.Action {
  type: 'SEARCH_RESPONSE';
  quests: QuestDetails[];
  nextToken: string;
  receivedAt: number;
}

export interface ViewQuestAction extends Redux.Action {
  type: 'VIEW_QUEST';
  quest: QuestDetails;
}

export interface UserLoginAction extends Redux.Action {
  type: 'USER_LOGIN';
  user: UserState;
}

export interface UserLogoutAction extends Redux.Action {
  type: 'USER_LOGOUT';
}

export interface QuestCardAction {}