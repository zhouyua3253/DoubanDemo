/**
 * Created by zhou on 16/6/11.
 */

import {MOVIE_API} from '../../API/API';
import MovieDetail from './movie_detail';

export default class MovieSearch extends Component {

    render() {

        return (
            <View style={styles.container} >
                <View style={styles.searchBar}>
                    <Image style={styles.seacrh_icon}
                        source={require('../../icon/search_72.png')}
                    />

                    <TextInput
                        ref={textInput => this._textInput = textInput}
                        style={styles.search_textinput}
                        onChangeText={text => this._onChangeText(text)}
                        placeholder="影片、演员等"
                        autoCapitalize='none'
                        autoCorrect={false}
                        autoFocus={true}
                        blurOnSubmit={true}
                        placeholderTextColor='#B2B2B2'
                        enablesReturnKeyAutomatically={true}
                        returnKeyType='search'
                        underlineColorAndroid="transparent"
                    />

                    <Text style={styles.cancel_btn}
                        onPress={() => this._onPressCancel()}
                    >
                        取消
                    </Text>
                </View>

                <GiftedListView
                    ref={listView => this._listView = listView}
                    style={styles.listview}
                    pagination={false}
                    refreshable={false}
                    emptyView={() => null}
                    onScroll={() => this._onScroll()}
                    rowView={rowData => this._renderRowView(rowData)}
                />

            </View>
        );
    }

    _renderRowView(rowData) {
        const subTitle = `${rowData.rating.average}分/${rowData.genres.join('、')}/${rowData.year}年`;

        return (
            <TouchableHighlight
                activeOpacity={0.8}
                underlayColor='#ddd'
                onPress={() => this._onSelectCell(rowData)}
            >
                <View style={styles.cell}>
                    <Image style={styles.poster_image}
                        source={{uri: rowData.images.medium}}
                    />

                    <View style={styles.movie_content}>
                        <Text style={styles.title} numberOfLines={1}>{rowData.title}</Text>

                        <Text style={styles.subtitle}>{subTitle}</Text>
                    </View>
                </View>
            </TouchableHighlight>
        );
    }


    /**
     * NETWORK
     */

    _onSearch(key) {
        const url = MOVIE_API.movieSearch + key;

        service.get(url)
            .then(response => {
                if(response.ok === false) {
                    showHUDMessage(response.problem);
                }
                else {
                    const data = response.data;
                    // title: "搜索 "好先生" 的结果"
                    const end = data.title.indexOf('" 的结果');
                    const searchKey = data.title.substring(4, end);

                    if(searchKey === this._searchKey) { // 返回的结果是搜索的内容
                        this._listView._setRows([]);
                        this._listView._postPaginate(data.subjects);

                        if(data.subjects.length === 0) {
                            showHUDMessage('搜索无结果');
                        }
                    }
                }
            })
    }


    /**
     * EVENT
     */

    _onScroll() {
        this._textInput.blur();
    }

    _onChangeText(text) {
        this._searchKey = text;

        if(text.length > 0) {
            this._onSearch(text);
        }
        else {
            this._listView._setRows([]);
            this._listView._postPaginate([]);
        }
    }

    _onPressCancel() {
        this._textInput.blur();

        this.props.navigator && this.props.navigator.pop();
    }

    _onSelectCell(rowData) {
        this.props.navigator && this.props.navigator.push({
            component: MovieDetail,
            params: {
                movieID: rowData.id
            }
        })
    }
}

const styles = Style({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    searchBar: {
        ios: {
            height: 44,
            marginTop: 20
        },
        android: {
            height: 48
        },
        borderBottomColor: '#B2B2B2',
        borderBottomWidth: ONE_PIXEL,
        flexDirection: 'row',
        alignItems: 'center'
    },
    seacrh_icon: {
        width: 24,
        height: 24,
        marginHorizontal: 10
    },
    search_textinput: {
        flex: 1,
        fontSize: 16,
        alignSelf: 'center',
        ios: {
            height: 44
        },
        android: {
            height: 48
        }
    },
    cancel_btn: {
        margin: 10,
        color: 'rgb(67, 189, 86)',
        fontSize: 16
    },
    listview: {
        flex: 1
    },
    cell: {
        height: 66,
        flexDirection: 'row',
        paddingHorizontal: 15,
        paddingVertical: 8
    },
    poster_image: {
        width: 40,
        height: 50,
        backgroundColor: '#ddd'
    },
    movie_content: {
        flex: 1,
        marginLeft: 8,
        ios: {
            marginTop: 3
        }
    },
    title: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 8
    },
    subtitle: {
        fontSize: 12,
        color: 'rgb(155, 155, 155)'
    }
});