/**
 * Created by zhou on 16/6/11.
 */


import Subject from './subject_index';

const title = '书影音';

export default class SubjectNav extends Component {

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
                initialRoute={{name: title, component: Subject}}
                configureScene={route => Navigator.SceneConfigs.FloatFromRight}
                onWillFocus={navigator => this._onWillFocus(navigator)}
                renderScene={(route, navigator) => this._renderNaviScreen(route, navigator)}
            />
        );
    }

    _renderNaviScreen(route, navigator) {
        this.navigator = navigator;

        let Component = route.component;
        return (
            <Component {...route.params}
                navigator={navigator}
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

        if (this.enableAndroidBack) { // 返回上一页面或者退出APP
            if(routes.length > 1) {
                navigator.pop();
                return true;
            } else {
                return false;
            }
        }
        else { // 返回页面的上一个状态 不返回上一页面
            this.androidBackCallBack && this.androidBackCallBack();
            return true;
        }
    }
}