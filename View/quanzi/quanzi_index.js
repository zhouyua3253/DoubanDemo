/**
 * Created by zhou on 16/6/4.
 */

const BaiduMapKey = 'RSAx9ocx050LSrPu27ExymdsExQuDmGG';
import Citys from './quanzi_city';
import {Event} from '../../API/API';

import NavigationBar from '../navigation_bar/navigation_bar';
import SelectCity from './quanzi_select_city';
import Web from '../web/webView';
import EventList from './event_list';

export default class Quanzi extends Component {

    constructor(props) {
        super(props);

        this.state = {
            city: Citys[0],
            weekendEvent: [],
            futureEvent: [],
            musicEvent: [],
            commonwealEvent: []
        };

        /**
         * 本地上次保存的城市信息
         */
        localGet('city', null, value => {
            let city = Citys[0];
            if(value && typeof value === 'string') {
                city = JSON.parse(value);
                this.setState({city});
            }
            this._fetchData(city);
        })
    }

    componentDidMount() {
        /**
         * http://www.cnblogs.com/lecaf/archive/2011/08/01/2123593.html
         *
         * android的 AndroidManifest.xml 添加 <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION"/>
         * android 下设置 enableHighAccuracy: true 定位会很长时间
         */
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => this._onGeolocationSuccess(position),
                error => log(error.message),
                {enableHighAccuracy: false, timeout: 20000, maximumAge: 0})
        }
        else {
            Alert.alert('无法获取地点信息');
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <NavigationBar
                    title='活动'
                />

                <ScrollView
                    style={styles.scrollView}
                    alwaysBounceVertical={true}
                >
                    {this._renderCityCell()}
                    {this._renderWeekendEvent()}
                    {this._renderFutureEvent()}
                    {this._renderWeekMusic()}
                    {this._renderCommonwealEvent()}
                </ScrollView>
            </View>
        );
    }

    /**
     * 城市选择cell
     */
    _renderCityCell() {
        return (
            <View style={styles.city_cell}>
                <TouchableOpacity
                    style={styles.city_btn}
                    onPress={() => this._onPressSelectCity()}
                >
                    <Text style={styles.city_font}>
                        当前城市:
                        <Text style={{color: 'rgb(67, 189, 86)'}}>{`  ${this.state.city.name}`}</Text>
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    /**
     * 周末热门活动
     * @private
     */
    _renderWeekendEvent() {
        if(this.state.weekendEvent.length === 0) {
            return null;
        }
        else {
            return this._renderEventCell('周末热门活动', this.state.weekendEvent, () => this._onPressMore('周末热门活动', 'all', 'weekend', this.state.weekendEvent));
        }
    }

    /**
     * 近期热门展览
     */
    _renderFutureEvent() {
        if(this.state.futureEvent.length === 0) {
            return null;
        }
        else {
            return this._renderEventCell('近期热门展览', this.state.futureEvent, () => this._onPressMore('近期热门展览', 'exhibition', 'week', this.state.futureEvent));
        }
    }

    /**
     * 近期热门音乐活动
     */
    _renderWeekMusic() {
        if(this.state.musicEvent.length === 0) {
            return null;
        }
        else {
            return this._renderEventCell('近期热门音乐活动', this.state.musicEvent, () => this._onPressMore('近期热门音乐活动', 'music', 'week', this.state.musicEvent));
        }
    }

    /**
     * 近期热门公益活动
     */
    _renderCommonwealEvent() {
        if(this.state.commonwealEvent.length === 0) {
            return null;
        }
        else {
            return this._renderEventCell('近期热门公益活动', this.state.commonwealEvent, () => this._onPressMore('近期热门公益活动', 'commonweal', 'week', this.state.commonwealEvent));
        }
    }

    _renderEventCell(title, events, moreAction) {
        const eventImageWidth = (WIDTH - 15 - 20 - 20 - 15) / 3;
        const imageHeight = eventImageWidth * 260 / 175;

        let btns = [];
        for(var i = 0; i < Math.min(3, events.length); i ++) {
            const event = events[i];
            const btn = (
                <TouchableOpacity
                    key={i}
                    activeOpacity={0.5}
                    style={{width: eventImageWidth, marginLeft: i === 0 ? 0 : 20}}
                    onPress={() => this._onPressEvent(event)}
                >
                    <Image
                        source={{uri: event.image}}
                        style={{width: eventImageWidth, height: imageHeight, backgroundColor: '#dcdcdc'}}
                    />
                    <Text
                        style={{width: eventImageWidth, marginTop: 5, fontSize: 14, fontWeight: '400', lineHeight: 18}}
                        lin
                        numberOfLines={2}
                    >
                        {event.title}
                    </Text>

                    <Text
                        style={{width: eventImageWidth, marginTop: 5, fontSize: 12, color: '#bbb'}}
                    >
                        {event.begin_time.substring(0, 10)}
                    </Text>

                </TouchableOpacity>
            );
            btns.push(btn);
        }

        return (
            <View style={styles.eventeCell}>
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={moreAction.bind(this)}
                    style={styles.event_type_container}
                >
                    <Text style={styles.event_type_title}>{title}</Text>
                    <Text style={styles.event_more}>更多 ></Text>
                </TouchableOpacity>

                <View style={styles.event_image_container}>
                    {btns}
                </View>
            </View>
        );
    }


    _onPressMore(title, type, day_type, events) {
        this.props.navigator && this.props.navigator.push({
            component: EventList,
            params: {title, type, day_type, events, cityID: this.state.city.id}
        })
    }

    _onPressEvent(event) {
        this.props.navigator && this.props.navigator.push({
            component: Web,
            params: {url: event.alt}
        })
    }

    /**
     * NETWORK
     */

    _fetchData(city) {
        this._fetchWeekendData(city);
        this._fetchFutureExhibition(city);
        this._fetchFutureMusic(city);
        this._fetchCommonweal(city);
    }

    /**
     * 周末热门活动
     * @private
     */
    _fetchWeekendData(city) {
        const futureUrl = Event.eventList + city.id + '&day_type=weekend&type=all';
        service.get(futureUrl)
            .then(response => {
                if(response.ok === false) {
                    showHUDMessage(response.problem);
                }
                else {
                    const weekendEvent = response.data.events;
                    this.setState({weekendEvent});
                }
            })
    }

    /**
     * 获取近期热门展览数据
     * @private
     */
    _fetchFutureExhibition(city) {
        const futureUrl = Event.eventList + city.id + '&type=exhibition';
        service.get(futureUrl)
            .then(response => {
                if(response.ok === false) {
                    showHUDMessage(response.problem);
                }
                else {
                    const futureEvent = response.data.events;
                    this.setState({futureEvent});
                }
            })
    }

    /**
     * 获取近期热门音乐活动
     * @private
     */
    _fetchFutureMusic(city) {
        const futureUrl = Event.eventList + city.id + '&type=music';
        service.get(futureUrl)
            .then(response => {
                if(response.ok === false) {
                    showHUDMessage(response.problem);
                }
                else {
                    const musicEvent = response.data.events;
                    this.setState({musicEvent});
                }
            })
    }

    _fetchCommonweal(city) {
        const futureUrl = Event.eventList + city.id + '&type=commonweal';
        service.get(futureUrl)
            .then(response => {
                if(response.ok === false) {
                    showHUDMessage(response.problem);
                }
                else {
                    const commonwealEvent = response.data.events;
                    this.setState({commonwealEvent});
                }
            })
    }

    /**
     * 定位
     */

    /**
     * 根据地理坐标信息获取城市信息
     * @param position
     * @private
     */
    _onGeolocationSuccess(position) {
        const coords = position.coords;
        const getLocation = `http://api.map.baidu.com/geocoder/v2/?output=json&ak=${BaiduMapKey}&location=${coords.latitude},${coords.longitude}`;
        fetch(getLocation).then(response => response.json()).then(location => {

            if(location.status == 0) {

                const cityName = location.result.addressComponent.city; // 广州市

                for(let city of Citys) {
                    if(cityName.indexOf(city.name) == 0) {

                        if(city.name != this.state.city.name) {
                            this.setState({city});
                            localSave('city', JSON.stringify(city));
                            this._fetchData(city);
                        }

                        return;
                    }
                }
            }
        })
    }


    /**
     * 跳转选择城市
     * @private
     */
    _onPressSelectCity() {
        this.props.navigator && this.props.navigator.push({
            component: SelectCity,
            params: {
                onFinsihSelect: this._onSuccessSelectCity.bind(this)
            }
        });
    }

    /**
     * 成功选择了城市
     * @param city
     * @private
     */
    _onSuccessSelectCity(city) {
        if(city.name != this.state.city.name) {
            this.setState({
                city,
                weekendEvent: [],
                futureEvent: [],
                musicEvent: [],
                commonwealEvent: []
            });
            localSave('city', JSON.stringify(city));
            this._fetchData(city);
        }
    }
}

const styles = Style({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    scrollView: {
        flex: 1,
        backgroundColor: '#F2F2F2'
    },
    city_cell: {
        marginVertical: 15
    },
    city_btn: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: 'white'
    },
    city_font: {
        fontSize: 15,
        color: 'rgb(155, 155, 155)'
    },
    eventeCell: {
        marginBottom: 15,
        padding: 15,
        backgroundColor: 'white'
    },
    event_type_container: {
        paddingTop: 5,
        paddingBottom: 20,
        justifyContent: 'space-between',
        flexDirection: 'row'
    },
    event_type_title: {
        fontSize: 16,
        fontWeight: '500'
    },
    event_more: {
        fontSize: 14,
        color: 'rgb(67, 189, 86)'
    },
    event_image_container: {
        flexDirection: 'row'
    }
});