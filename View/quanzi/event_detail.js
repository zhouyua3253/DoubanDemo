/**
 * Created by zhouyumin on 16/6/23.
 */

import {Surface} from "gl-react-native";
 import {Blur} from "gl-react-blur";
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import ParsedText from 'react-native-parsed-text';
import Web from '../web/webView';
import {formateEventInfo} from './event_list';

const back_btn_res = require('../../icon/back_white.png');

const HeaderHeight = 300;

export default class EventDetail extends Component {

    static propTypes = {
        // 活动信息
        event: React.PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.state = {
            renderBlur: false,
            base64: ''
        };
    }

    componentDidMount() {
        if (isAndroid) {
            InteractionManager.runAfterInteractions(() => {
                this.setState({renderBlur: true});

                const captureConfig = {
                    quality: 0.5,
                    type: "jpg",
                    format: "base64"
                };
                this._blurView.captureFrame(captureConfig).then(base64 => this.setState({base64}))
            });
        }
    }

    render() {
        let blur_content = null;
        if (this.state.renderBlur && isAndroid) {
            blur_content = (
                <Surface
                    preload={true}
                    width={WIDTH}
                    height={HeaderHeight}
                    style={styles.blur_container}
                    ref={view => this._blurView = view}
                >
                    <Blur factor={10} passes={20}>
                        {this.props.event.image}
                    </Blur>
                </Surface>
            );
        }

        return (
            <View style={styles.container}>
                <GiftedListView
                    style={styles.container}
                    pagination={false}
                    refreshable={false}
                    firstLoader={false}
                    onFetch={(_, callback) => this._fetchEvents(_, callback)}
                    rowView={(rowData, sectionID, rowID) => this._renderRowView(rowData, sectionID, rowID)}
                    renderScrollComponent={props => this._parallaxScrollView(props)}
                />

                {blur_content}
            </View>
        );
    }

    _fetchEvents(_, callback) {
        const datas = isAndroid ? Array(3).fill(this.props.event) : Array(2).fill(this.props.event);
        callback(datas);
    }

    _renderRowView(rowData, _, rowID) {
        if (isAndroid) {
            if (rowID == '0') {
                const backBtn = (
                    <TouchableOpacity
                        style={styles.backBtn}
                        activeOpacity={0.75}
                        onPress={() => this._onPressBackIcon()}
                    >
                        <Image
                            source={back_btn_res}
                            style={styles.btn_icon}/>
                    </TouchableOpacity>
                );

                return (
                    <View style={styles.headerBg}>
                        <Image
                            source={{uri: this.state.base64}}
                            style={styles.headerBg}
                        />
                        <Image
                            source={{uri: rowData.image}}
                            style={styles.header_image}
                        />
                        {backBtn}
                    </View>
                );
            }
            else if (rowID == '1') {
                return this._renderTitleCell(rowData);
            }
            else if (rowID == '2') {
                return this._renderContentCell(rowData);
            }
        }

        // ios
        if (rowID == '0') {
            return this._renderTitleCell(rowData);
        }
        else if (rowID == '1') {
            return this._renderContentCell(rowData);
        }
    }

    _renderTitleCell(rowData) {
        const info = formateEventInfo(rowData);

        return (
            <View style={[styles.title_container, styles.border_bottom]}>
                <Text style={styles.title}>{rowData.title}</Text>
                <Text style={styles.event_info}>{info}</Text>
            </View>
        );
    }

    _renderContentCell(rowData) {
        return (
            <View style={styles.title_container}>
                <ParsedText
                    style={styles.content}
                    parse={[{type: 'url', style: styles.url, onPress: this._handleUrlPress.bind(this)}]}
                >
                    {rowData.content}
                </ParsedText>
            </View>
        );
    }

    /**
     * 可拉伸的头部
     */

    _parallaxScrollView(props) {
        if (isAndroid) {
            return <ScrollView style={styles.container}/>;
        }

        return (
            <ParallaxScrollView
                parallaxHeaderHeight={HeaderHeight}
                renderBackground={() => this._renderHeaderBackground()}
                renderForeground={() => this._renderHeaderForeground()}
                stickyHeaderHeight={20}
                backgroundColor='white'
                renderStickyHeader={() => <View style={{height: 20, backgroundColor: 'white'}}/>}
            >

            </ParallaxScrollView>
        );
    }

    /**
     * 头部背景图
     */
    _renderHeaderBackground() {
        const {event} = this.props;
        return (
            <View style={styles.headerBg}>
                <Image
                    source={{uri: event.image, width: WIDTH, height: HeaderHeight}}
                    blurRadius={25}
                />
            </View>
        );
    }

    /**
     * 头部前景图
     */
    _renderHeaderForeground() {
        const {event} = this.props;

        const backBtn = (
            <TouchableOpacity
                style={styles.backBtn}
                activeOpacity={0.75}
                onPress={() => this._onPressBackIcon()}
            >
                <Image
                    source={back_btn_res}
                    style={styles.btn_icon}/>
            </TouchableOpacity>
        );

        return (
            <View
                style={styles.header_foreground}
            >
                <Image
                    source={{uri: event.image}}
                    style={styles.header_image}
                    resizeMode={Image.resizeMode.stretch}
                />

                {backBtn}
            </View>
        );
    }

    _handleUrlPress(url) {
        this.props.navigator && this.props.navigator.push({
            component: Web,
            params: {url}
        })
    }

    _onPressBackIcon() {
        this.props.navigator && this.props.navigator.pop();
    }
}

class EventInfoItem extends Component {

    static propTypes = {
        // 左侧图标resource
        icon: React.PropTypes.number.isRequired,
        title: React.PropTypes.string.isRequired,
        content: React.PropTypes.string.isRequired
    };

    render() {
        return (
            <View style={{height: 60, alignItems: 'center'}}>

            </View>
        );
    }
}

const styles = Style({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    header_foreground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        ios: {
            marginTop: 20
        }
    },
    header_image: {
        ios: {
            height: HeaderHeight - 20 * 3,
            width: (HeaderHeight - 20 * 3) / 260 * 175
        },
        android: {
            height: HeaderHeight - 20 * 2,
            width: (HeaderHeight - 20 * 2) / 260 * 175,
            position: 'absolute',
            top: 20,
            left: (WIDTH - ((HeaderHeight - 20 * 3) / 260 * 175)) * 0.5
        }
    },
    title_container: {
        marginHorizontal: 15,
        paddingVertical: 20
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    content: {
        fontSize: 16,
        fontWeight: '400'
    },
    url: {
        color: 'rgb(67, 189, 86)'
    },
    event_info: {
        fontSize: 12,
        color: 'rgb(155, 155, 155)',
        marginTop: 10,
        lineHeight: 15
    },
    border_bottom: {
        borderBottomColor: '#bababa',
        borderBottomWidth: ONE_PIXEL
    },
    backBtn: {
        width: 44,
        height: 44,
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        left: 5,
        top: 0
    },
    btn_icon: {
        width: 24,
        height: 24
    },
    blur_container: {
        position: 'absolute',
        top: HEIGHT,
        width: WIDTH
    },
    headerBg: {
        width: WIDTH,
        height: HeaderHeight,
        backgroundColor: '#ddd'
    }
});