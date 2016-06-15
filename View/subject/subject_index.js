/**
 * Created by zhou on 16/6/4.
 */

import NavigationBar from '../navigation_bar/navigation_bar';
import {MOVIE_API} from '../../API/API';
import MovieDetail from './movie_detail';
import MovieSearch from './movie_search';

import StarRating from '../3rd/StarRating';

/**
 * 电影
 */
export default class Subject extends Component {

    render() {
        return (
            <View style={styles.container}>
                <NavigationBar
                    title='电影'
                    rightIcon={require('../../icon/search_72.png')}
                    onPressRightIcon={() => this._onPressNavigationBtn()}
                />

                <GiftedListView
                    style={styles.listview}
                    onFetch={(page, callback) => this._onFetch(page, callback)}
                    rowView={rowData => this._renderRowView(rowData)}
                />
            </View>
        );
    }

    /**
     * 网络请求
     */
    _onFetch(page, callback) {
        const start = page * 10;
        const url = MOVIE_API.top250 + `?start=${start}&count=10`;
        service.get(url)
            .then(response => {
                if(response.ok === false) {
                    showHUDMessage(response.problem);
                    callback([]);
                }
                else {
                    const data = response.data.subjects;
                    const allLoaded = (page !== 0 && data.length === 0);
                    callback(data, {allLoaded});
                }
            })
    }

    _renderRowView(rowData) {
        // 导演
        const directorNames = rowData.directors.map(director => director.name);
        const directors = directorNames.join('/');

        const actorNames = rowData.casts.map(cast => cast.name);
        const casts = actorNames.join('/');

        return (
            <TouchableHighlight
                activeOpacity={0.8}
                underlayColor='#ddd'
                onPress={() => this._onSelectCell(rowData)}
            >
                <View style={styles.listView_cell}>

                    {/* 海报图片 */}
                    <View style={{backgroundColor: '#ddd'}}>
                        <Image
                            source={{uri: rowData.images.large}}
                            style={styles.movie_poster}
                        />
                    </View>

                    {/* 内容文字 */}
                    <View style={styles.text_container}>
                        <Text style={styles.movie_title} numberOfLines={1}>
                            {rowData.title}
                        </Text>

                        <View style={styles.rating_container}>
                            <StarRating
                                rating={rowData.rating.average / 2}
                                starSize={12}
                            />
                            <Text style={styles.rating_text}>{rowData.rating.average}</Text>
                        </View>

                        <Text style={styles.movie_detail}>
                            {`导演: ${directors}`}
                        </Text>

                        <Text style={[styles.movie_detail, {paddingTop: 5}]}>
                            {`演员: ${casts}`}
                        </Text>
                    </View>

                </View>
            </TouchableHighlight>
        );
    }

    _onSelectCell(rowData) {
        this.props.navigator && this.props.navigator.push({
            component: MovieDetail,
            params: {
                movieID: rowData.id
            }
        })
    }

    /**
     * 点击导航栏右上角搜索按钮
     * @private
     */
    _onPressNavigationBtn() {
        this.props.navigator && this.props.navigator.push({
            component: MovieSearch,
            isModal: true
        })
    }
}

const styles = Style({
    container: {
        flex: 1
    },
    listview: {
        flex: 1,
        backgroundColor: 'white'
    },
    listView_cell: {
        marginHorizontal: 12,
        borderBottomColor: '#ddd',
        borderBottomWidth: ONE_PIXEL,
        overflow: 'hidden',
        paddingTop: 20,
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingBottom: 20
    },
    movie_poster: {
        height: 80,
        width: 57
    },
    text_container: {
        flex: 1,
        marginLeft: 15
    },
    movie_title: {
        fontSize: 16,
        fontWeight: '500'
    },
    movie_detail: {
        fontSize: 12,
        color: 'rgb(155, 155, 155)',
        ios: {
            paddingTop: 10
        },
        android: {
            paddingTop: 7
        }
    },
    rating_container: {
        ios: {
            marginTop: 10
        },
        android: {
            marginVertical: 5
        },
        flexDirection: 'row',
        alignItems: 'center'
    },
    rating_text: {
        marginLeft: 5,
        fontSize: 12,
        color: 'rgb(155, 155, 155)'
    }
});