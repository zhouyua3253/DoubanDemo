/**
 * Created by zhouyumin on 16/6/14.
 */

import Quanzi from './quanzi_index';

const title = '活动';

export default class EventNav extends Component {

    componentDidMount() {
        this.enableAndroidBack = true; // 默认开启安卓返回键功能
        BackAndroid.addEventListener('hardwareBackPress', this._onAndroidBack.bind(this));
    }

    componentWillUnmount() {
        BackAndroid.removeEventListener('hardwareBackPress', this._onAndroidBack.bind(this));
    }

    render() {
        return (
            <Navigator
                initialRoute={{name: title, component: Quanzi}}
                configureScene={route => this._configureScene(route)}
                onWillFocus={navigator => this._onWillFocus(navigator)}
                renderScene={(route, navigator) => this._renderScreen(route, navigator)}
            />
        );
    }

    /**
     * 页面push方式
     */
    _configureScene(route) {
        //this.props.navigator.push({
        //    component: Web,
        //    isModal: true, // 需要下个页面模态方式出现
        //    params: {url}
        //})
        if(route.isModal) {
            // 150 -> 0 禁用手势返回
            Navigator.SceneConfigs.FloatFromBottom.gestures.pop.edgeHitWidth = 0;
            return Navigator.SceneConfigs.FloatFromBottom;
        }

        return Navigator.SceneConfigs.FloatFromRight;
    }

    _renderScreen(route, navigator) {
        this.navigator = navigator;

        let Component = route.component;
        return (
            <Component {...route.params}
                navigator={navigator}
                // 管理android返回键功能
                triggerAndroidBack={this._triggerAndroidBack.bind(this)}
            />
        );
    }

    /**
     * 每次有新的页面出现时判断是否需要显示底部的Tabbar
     * @param navigator
     * @private
     */
    _onWillFocus(navigator) {
        const visible = navigator.name === title;
        this.props.onTriggerTabbarVisible && this.props.onTriggerTabbarVisible(visible);
    }

    /**
     * 开启\禁用 安卓返回键功能
     * @param callBack   禁用返回键 响应返回键的回调
     * @private
     */
    _triggerAndroidBack(flag: boolean, callBack = null) {
        this.enableAndroidBack = flag;
        this.androidBackCallBack = callBack;
    }

    /**
     * 处理安卓返回键
     * @returns {boolean}
     * @private
     */
    _onAndroidBack() {
        const navigator = this.navigator;
        const routes = navigator.getCurrentRoutes();

        if (this.enableAndroidBack) { // 返回上一页面
            if(routes.length > 1) {
                navigator.pop();
            }
        }
        else { // 返回页面的上一个状态 不返回上一页面
            this.androidBackCallBack && this.androidBackCallBack();
        }

        return true;
    }
}