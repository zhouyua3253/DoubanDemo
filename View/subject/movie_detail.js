/**
 * Created by zhou on 16/6/5.
 */

import NavigationBar from '../navigation_bar/navigation_bar';
import {MOVIE_API} from '../../API/API';
import Web from '../web/webView';
import SubjectCelebrity from './subject_celebrity';

export default class MovieDetail extends Component {

    static propTypes = {
        movieID: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.number
        ]).isRequired
    };

    constructor(props) {
        super(props);

        this.state = {
            title: ''
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <NavigationBar
                    title={this.state.title}
                    onPressBackIcon={() => this._onPressBackBtn()}
                />

                <GiftedListView
                    style={styles.listview}
                    pagination={false}
                    refreshable={false}
                    onFetch={(_, callback) => this._onFetch(_, callback)}
                    rowView={(rowData, _, rowID) => this._renderRowView(rowData, undefined, rowID)}
                />
            </View>
        );
    }

    /**
     * network
     */

    _onFetch(_, callback) {
        const url = MOVIE_API.detail + this.props.movieID;

        service.get(url)
            .then(response => {
                if(response.ok === false) {
                    callback([]);
                    showHUDMessage(response.problem);
                }
                else {
                    const datas = Array(3).fill(response.data);
                    callback(datas);

                    this.setState({title: response.data.title})
                }
            })
    }

    /**
     * UI
     */

    _renderRowView(rowData, sectionID, rowID) {
        if(rowID == 0) { // 标题 评分 演员 ...
            return this._renderTitleCell(rowData);
        }
        else if(rowID == 1) { // 剧情简介
            return this._renderSummaryCell(rowData);
        }
        else if(rowID == 2) { // 影人
            return this._rendercasts(rowData);
        }

        return null;
    }


    _renderTitleCell(rowData) {
        let title = `${rowData.title}`;
        if(rowData.original_title.length > 0) {
            title += `(${rowData.original_title})`;
        }
        const rate = `${rowData.rating.average}  ${rowData.ratings_count}人评分`;
        const peoples = rowData.casts.map(actor => actor.name).join('/');
        const genres = rowData.genres.join('/');
        const content = peoples + '/' + genres;
        const year = `${rowData.year}年上映`;

        return (
            <TouchableHighlight
                activeOpacity={0.8}
                underlayColor='#ddd'
                onPress={() => this._onJumpToWeb(rowData.mobile_url)}
            >
                <View style={[{padding: 15, paddingBottom: 10,flexDirection: 'row',alignItems: 'center'}, styles.bottom_line]}>

                    <View style={{flex: 1}}>
                        <Text style={{fontSize: 17}}>{title}</Text>
                        <Text style={{color: '#A8A8A8', fontSize: 10, marginTop: 8}}>{rate}</Text>
                        <Text style={{color: 'gray', fontSize: 12, marginTop: 5}}>{content}</Text>
                        <Text style={{color: 'gray', fontSize: 12, marginTop: 3}}>{year}</Text>
                    </View>

                    <Image style={{marginLeft: 15, width: 15, height: 15}}
                           source={require('../../icon/right_arrow.png')}/>
                </View>
            </TouchableHighlight>
        );
    }

    _renderSummaryCell(rowData) {
        return (
            <View style={{padding: 15}}>
                <Text style={{color: 'gray', fontSize: 14}}>剧情简介</Text>
                <Text style={{marginTop: 10, fontSize: 14}}>{rowData.summary}</Text>
            </View>
        );
    }

    _rendercasts(rowData) {
        const photoW = 90;
        const photoH = 126;
        const contentViewH = photoH + 50;

        for(let director of rowData.directors) {
            director.isDirector = true;
        }

        const peoples = rowData.directors.concat(rowData.casts);
        const photos = peoples.map((people, index) => {
            const contentViewW = index === peoples.length - 1 ? photoW : photoW + 10;
            return (
               <TouchableOpacity
                   key={`${index}`}
                   style={{width: contentViewW, height: contentViewH}}
                   onPress={() => this._onJumpToCelebrity(people.id, people.name)}
               >
                   <Image style={{width: photoW, height: photoH, backgroundColor: '#ddd'}}
                        source={{uri: people.avatars.large}}/>

                   <Text
                       style={{marginTop: 12, fontSize: 12, width: photoW, textAlign: 'center', lineHeight: 14}}
                       numberOfLines={2}
                   >
                       {people.name}
                       {people.isDirector ? <Text style={{fontSize: 11, color: 'gray'}}>  导演</Text> : null}
                   </Text>
               </TouchableOpacity>
            );
        });

        return (
            <View>
                <Text style={{marginLeft: 15, color: 'gray', fontSize: 14}}>影人</Text>

                <ScrollView
                    style={{height: contentViewH, marginTop: 15}}
                    horizontal={true}
                    alwaysBounceHorizontal={true}
                    showsHorizontalScrollIndicator={false}
                >
                    {photos}
                </ScrollView>
            </View>
        );
    }

    /**
     * EVENT
     */

    _onPressBackBtn() {
        this.props.navigator && this.props.navigator.pop();
    }

    _onJumpToWeb(url) {
        this.props.navigator && this.props.navigator.push({
            component: Web,
            params: {url}
        })
    }

    _onJumpToCelebrity(celebrityID, name) {
        this.props.navigator && this.props.navigator.push({
            component: SubjectCelebrity,
            params: {
                celebrityID,
                name
            }
        });
    }
}

const styles = Style({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    listview: {
        flex: 1,
        backgroundColor: 'white'
    },
    bottom_line: {
        borderBottomColor: '#ddd',
        borderBottomWidth: ONE_PIXEL
    }
});