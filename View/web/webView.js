/**
 * Created by zhou on 16/6/5.
 */

import { WebView } from 'react-native';
import NavigationBar from '../navigation_bar/navigation_bar';

export default class Web extends Component {

    static propTypes = {
        url: React.PropTypes.string.isRequired
    };

    constructor(props) {
        super(props);

        this.canGoBack = false;
        this._finishFirstLoad = false;
        this.state = {
            title: ''
        };
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: 'white'}}>
                <NavigationBar
                    title={this.state.title}
                    onPressBackIcon={() => this._onPressBackBtn()}
                />

                <WebView
                    ref={web => this._webView = web}
                    source={{uri: this.props.url}}
                    style={{flex: 1, overflow: 'hidden'}}
                    scalesPageToFit={true}
                    startInLoadingState={true} // 强制显示加载进度指示菊花
                    javaScriptEnabled={true}   // 仅限Android平台。iOS平台JavaScript是默认开启的
                    onNavigationStateChange={e => this._onNavigationStateChange(e)} // 页面状态改变 回调
                    onLoadEnd={() => this._onLoadEnd()}
                />
            </View>
        );
    }

    _onPressBackBtn() {
        if(this.canGoBack) {
            this._webView.goBack();
        }
        else {
            this.props.navigator && this.props.navigator.pop();
        }
    }

    /**
     * 页面状态改变
     *  │{ target: 277,                                                                                                                          │ │                                                         │
        │  canGoBack: true,                                                                                                                      │ │                                                         │
        │  loading: false,                                                                                                                       │ │                                                         │
        │  title: '肖申克的救赎的全部图片'           ,                                                                                                      │ └─────────────────────────────────────────────────────────┘
        │  canGoForward: false,                                                                                                                  │
        │  navigationType: 'other',                                                                                                              │ ┌─ Benchmark ─────────────────────────────────────────────┐
        │  url: 'https://movie.douban.com/subject/1292052/all_photos#!/i!/ckDefault' }
     */
    _onNavigationStateChange(info) {
        this.canGoBack = info.canGoBack;

        if(this._finishFirstLoad) { // 首次页面未完成加载时 获取的title时url地址 不是真正的title
            this.setState({
                title: info.title
            });
        }
    }

    _onLoadEnd() {
        this._finishFirstLoad = true;
    }
}