/**
 * Created by zhouyumin on 16/6/14.
 */

const moment = require('moment');

import {Event} from '../../API/API';
import EventDetail from './event_detail';
import NavigationBar from '../navigation_bar/navigation_bar';

export default class EventList extends Component {

    static propTypes = {
        // 标题
        title: React.PropTypes.string.isRequired,

        // 城市ID
        cityID: React.PropTypes.string.isRequired,

        // 已经获取到的活动数据
        events: React.PropTypes.array.isRequired,

        // 活动类型	all,music, film, drama, commonweal, salon, exhibition, party, sports, travel, others
        type: React.PropTypes.oneOf(['all', 'music', 'film', 'drama', 'commonweal', 'salon', 'exhibition', 'party', 'sports', 'travel', 'others']).isRequired,

        // day_type	时间类型	future, week, weekend, today, tomorrow
        day_type: React.PropTypes.oneOf(['future', 'week', 'weekend', 'today', 'tomorrow']).isRequired
    };


    render() {
        return (
            <View style={styles.container}>
                <NavigationBar
                    title={this.props.title}
                    onPressBackIcon={() => this._onBack()}
                />

                <GiftedListView
                    style={styles.listView}
                    pagination={true}
                    refreshable={false}
                    firstLoader={false}
                    onFetch={(page, callback) => this._fetchEvents(page, callback)}
                    rowView={rowData => this._renderCell(rowData)}
                />
            </View>
        );
    }


    _fetchEvents(page, callback) {
        if(page === 0) {
            callback(this.props.events);
        }
        else {
            const futureUrl = Event.eventList + `${this.props.cityID}&type=${this.props.type}&day_type=${this.props.day_type}&start=${page * 20}`;
            service.get(futureUrl)
                .then(response => {
                    if(response.ok === false) {
                        showHUDMessage(response.problem);
                    }
                    else {
                        const list = response.data.events;
                        const allLoaded = list.length === 0;
                        callback(list, {allLoaded});
                    }
                })
        }
    }

    _renderCell(rowData) {
        const info = formateEventInfo(rowData);
        return (
            <TouchableHighlight
                underlayColor='#ddd'
                onPress={() => this._onSelectCell(rowData)}
                style={{overflow: 'hidden'}}
            >
                <View style={styles.cell_content}>
                    <Image
                        style={{backgroundColor: '#ddd', width: 77, height: 105}}
                        source={{uri: rowData.image}}
                    />

                    <View style={styles.cell_text_container}>
                        <Text style={styles.category_name}>{rowData.category_name}</Text>
                        <Text style={styles.title}>{rowData.title}</Text>
                        <Text style={styles.event_info}>{info}</Text>
                    </View>
                </View>
            </TouchableHighlight>
        );
    }

    /**
     * EVENT
     */

    _onBack() {
        this.props.navigator && this.props.navigator.pop();
    }

    _onSelectCell(event) {
        this.props.navigator && this.props.navigator.push({
            component: EventDetail,
            params: {event}
        })
    }
}

/**
 * 格式化活动信息
 * @param event
 * @returns {*}
 */
export function formateEventInfo(rowData): string {
    let duration = '';
    const begin_day = rowData.begin_time.substring(0, 10);
    const end_day = rowData.end_time.substring(0, 10);
    if(begin_day == end_day) { // 同一天
        const begin_time = rowData.begin_time.substring(11, 16);
        const end_time = rowData.end_time.substring(11, 16);

        const dayofWeek = parseInt(moment(begin_day).format('E'));
        let e = null;
        switch (dayofWeek) {
            case 1:
                e = '周一';
                break;

            case 2:
                e = '周二';
                break;

            case 3:
                e = '周三';
                break;

            case 4:
                e = '周四';
                break;

            case 5:
                e = '周五';
                break;

            case 6:
                e = '周六';
                break;

            case 7:
                e = '周日';
                break;

            default:
                e = '周一';
        }

        duration = `${moment(begin_day).format('MM月DD日')} ${e} ${begin_time} ~ ${end_time}`;
    }
    else {
        duration = `${moment(begin_day).format('MM月DD日')} ~ ${moment(end_day).format('MM月DD日')}`;
    }

    return `${rowData.participant_count}人/${duration}/${rowData.address}`;
}

const styles = Style({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    listView: {
        flex: 1
    },
    cell_content: {
        padding: 15,
        borderBottomColor: '#ddd',
        borderBottomWidth: ONE_PIXEL,
        flexDirection: 'row'
    },
    cell_text_container: {
        paddingLeft: 12,
        flex: 1
    },
    category_name: {
        fontSize: 10,
        color: 'rgb(155, 155, 155)'
    },
    title: {
        fontSize: 14,
        fontWeight: '500',
        marginTop: 10,
        lineHeight: 20
    },
    event_info: {
        fontSize: 12,
        color: 'rgb(155, 155, 155)',
        marginTop: 10,
        lineHeight: 15
    }
});