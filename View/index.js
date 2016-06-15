/**
 * Created by zhouyumin on 16/6/3.
 */

import {AppState} from 'react-native';

import CodePush from 'react-native-code-push';

import TabNavigator from 'react-native-tab-navigator';

import Home from './home/home_index';
import Things from './things/things_index';
import SubjectNav from './subject/subject_nav';
import Event from './quanzi/quanzi_nav';
import Profile from './profile/peofile_index';

class TabbarModel {

    constructor(normalIcon, selctIcon, title, component, selected: boolean) {
        this.normalIcon = normalIcon;
        this.selctIcon = selctIcon;
        this.title = title;
        this.component = component;
        this.selected = selected;
    }
}

const tabbarModels = [
    new TabbarModel(require('../icon/tab_home.png'), require('../icon/tab_home_active.png'), '首页', Home, false),
    new TabbarModel(require('../icon/tab_things.png'), require('../icon/tab_things_active.png'), '小事', Things, false),
    new TabbarModel(require('../icon/tab_subject.png'), require('../icon/tab_subject_active.png'), '电影', SubjectNav, true),
    new TabbarModel(require('../icon/tab_quanzi.png'), require('../icon/tab_quanzi_active.png'), '活动', Event, false),
    new TabbarModel(require('../icon/tab_profile.png'), require('../icon/tab_profile_active.png'), '我的', Profile, false)
];

export default class Index extends Component {

    constructor(props) {
        super(props);

        const selctedTab = tabbarModels.filter(tabbarModel => tabbarModel.selected === true);

        if(selctedTab.length <= 0) {
            throw new Error('请选择一个默认显示的页面');
        }

        this.state = {
            selectedTab: selctedTab[0].title,
            tabbarVisible: true
        }
    }

    componentDidMount() {
        // 首次启动时检查时候有更新
        CodePush.sync({
            installMode: CodePush.InstallMode.ON_NEXT_RESUME
        });

        AppState.addEventListener('change', this._handleAppStateChange.bind(this));
    }

    _handleAppStateChange(currentAppState) {
        if(currentAppState === 'active') {
            CodePush.sync({
                installMode: CodePush.InstallMode.ON_NEXT_RESUME
            });
        }
    }

    render() {
        const items = tabbarModels.map(tabModel => {
            const title = tabModel.title;
            const Comp = tabModel.component;
            return (
                <TabNavigator.Item
                    key={title}
                    selected={this.state.selectedTab === title}
                    title={title}
                    renderIcon={() => <Image source={tabModel.normalIcon} style={styles.tabbar_icon}/>}
                    renderSelectedIcon={() => <Image source={tabModel.selctIcon} style={styles.tabbar_icon}/>}
                    onPress={() => this.setState({ selectedTab: title })}
                >
                    <Comp onTriggerTabbarVisible={this._triggerNavigatorTabbar.bind(this)}/>
                </TabNavigator.Item>
            );
        });

        const tabBarBottom = this.state.tabbarVisible ? 0 : -49;
        const scenePaddingBottom = this.state.tabbarVisible ? 49 : 0;
        return (
            <TabNavigator
                tabBarStyle={{bottom: tabBarBottom}}
                sceneStyle={{paddingBottom: scenePaddingBottom}}
            >
                {items}
            </TabNavigator>
        );
    }

    /**
     * 是否显示底部的Tabbar
     * @param flag
     * @private
     */
    _triggerNavigatorTabbar(flag: boolean) {
        this.setState({tabbarVisible: flag});
    }
}

const styles = Style({
    tabbar_icon: {
        width: 33,
        height: 33
    }
});