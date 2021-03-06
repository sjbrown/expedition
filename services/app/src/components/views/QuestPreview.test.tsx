import {configure, shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import {Quest} from 'shared/schema/Quests';
import {FEATURED_QUESTS} from '../../Constants';
import {initialSettings} from '../../reducers/Settings';
import QuestPreview, {Props} from './QuestPreview';
configure({ adapter: new Adapter() });

describe('QuestPreview', () => {
  const savedInstances = [
    {pathLen: 1, ts: 1},
    {pathLen: 1, ts: 2},
    {pathLen: 1, ts: 4},
    {pathLen: 1, ts: 3},
  ];

  function setupCustom(questTitle: string, overrides?: Partial<Props>, questOverrides?: Partial<Quest>) {
    const props: Props = {
      isDirectLinked: false,
      savedInstances: [],
      lastPlayed: null,
      quest: new Quest({...FEATURED_QUESTS.filter((el) => el.title === questTitle)[0], ...questOverrides}),
      settings: {...initialSettings, experimental: true},
      onPlay: jasmine.createSpy('onPlay'),
      onPlaySaved: jasmine.createSpy('onPlaySaved'),
      onSave: jasmine.createSpy('onSave'),
      onDeleteOffline: jasmine.createSpy('onDeleteOffline'),
      onDeleteConfirm: jasmine.createSpy('onDeleteConfirm'),
      onReturn: jasmine.createSpy('onReturn'),
      ...overrides,
    };
    const wrapper = shallow(QuestPreview(props), undefined /*renderOptions*/);
    return {props, wrapper};
  }
  function setup(overrides?: Partial<Props>, questOverrides?: Partial<Quest>) {
    return setupCustom('Learning to Adventure', overrides, questOverrides);
  }

  test('renders selected quest details', () => {
    const quest = FEATURED_QUESTS.filter((el) => el.title === 'Learning to Adventure')[0];
    const {wrapper} = setup(quest.title);
    expect(wrapper.render().html()).toContain(quest.title);
    expect(wrapper.render().html()).toContain(quest.genre);
    expect(wrapper.render().html()).toContain(quest.summary);
    expect(wrapper.render().html()).toContain(quest.author);
    expect(wrapper.render().html()).toContain('Official Quest');
    expect(wrapper.render().html()).not.toContain('The Horror');
    expect(wrapper.render().html()).not.toContain('The Future');
    expect(wrapper.render().html()).not.toContain('Pen and Paper');
    expect(wrapper.render().html()).not.toContain('Award');
  });

  test('shows last played information if it has been played before', () => {
    const {wrapper} = setup({lastPlayed: new Date()});
    expect(wrapper.render().text().toLowerCase()).toContain('last completed');
  });

  test('does not show last played infomation if it does not exist', () => {
    const {wrapper} = setup({lastPlayed: null});
    expect(wrapper.render().text().toLowerCase()).not.toContain('last completed');
  });

  test('does not show book icon if it does not exist', () => {
    const {wrapper} = setup({}, {requirespenpaper: false});
    expect(wrapper.render().html()).not.toContain('book');
  });

  test('shows a book icon if it exists', () => {
    const {wrapper} = setup({}, {requirespenpaper: true});
    expect(wrapper.render().html()).toContain('book');
  });

  test('passes direct-linked state so we can ask for count and multitouch', () => {
    const {props, wrapper} = setup({isDirectLinked: true});
    wrapper.find('#play').simulate('click');
    expect(props.onPlay).toHaveBeenCalledWith(props.quest, true);
  });

  test('allows users to go back to the search page', () => {
    const {props, wrapper} = setup();
    wrapper.find('#searchDetailsBackButton').simulate('click');
    expect(props.onReturn).toHaveBeenCalledTimes(1);
  });

  test('allows save for offline play', () => {
    const quest = new Quest({...FEATURED_QUESTS[0], publishedurl: 'http://somenonlocalurl'});
    const {props, wrapper} = setup({quest});
    wrapper.find('#offlinesave').simulate('click');
    expect(props.onSave).toHaveBeenCalledWith(quest);
  });

  test('continues from most recent save', () => {
    const {props, wrapper} = setup({savedInstances});
    wrapper.find('#playlastsave').simulate('click');
    expect(props.onPlaySaved).toHaveBeenCalledWith(props.quest.id, 4);
  });

  test('lists all saves for the quest', () => {
    const {props, wrapper} = setup({savedInstances});
    for (let i = 0; i < props.savedInstances.length; i++) {
      expect(wrapper.find('#playsave' + i).exists()).toEqual(true);
    }
  });

  test('indicates when the quest is available offline', () => {
    const {props, wrapper} = setup({savedInstances: [{pathLen: 0, ts: 1}]});
    expect(wrapper.find(".searchDetails").text()).toContain("Available Offline");
  });

  test('disallows saving local quests for offline play', () => {
    const quest = new Quest({...FEATURED_QUESTS[0], publishedurl: 'quests/localquest.xml'});
    const {props, wrapper} = setup({quest});
    expect(wrapper.find('#offlinesave').exists()).toEqual(false);
  });

  test('asks user for confirmation when deleting a saved quest instance', () => {
    const {props, wrapper} = setup({savedInstances});
    wrapper.find('#deletesave1').simulate('click');
    // Saves are sorted in descending order of timestamp
    expect(props.onDeleteConfirm).toHaveBeenCalledWith(props.quest, props.savedInstances[3].ts);
  });

  test('indicates that horror and future expansions are required', () => {
    const quest = FEATURED_QUESTS.filter((el) => el.title === 'Learning 3: The Future')[0];
    const {wrapper} = setup({quest});
    expect(wrapper.html()).toContain('horror');
    expect(wrapper.html()).toContain('future');
  });
});
