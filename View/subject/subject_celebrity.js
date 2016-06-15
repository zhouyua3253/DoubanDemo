/**
 * Created by zhou on 16/6/11.
 */

import NavigationBar from '../navigation_bar/navigation_bar';
import {MOVIE_API} from '../../API/API';
import MovieDetail from './movie_detail';

export default class SubjectCelebrity extends Component {

    static propTypes = {
        celebrityID: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.number
        ]).isRequired,
        name: React.PropTypes.string.isRequired
    };

    constructor(props) {
        super(props);

        this.state = {
            celebrity: null
        }
    }

    componentDidMount() {
        this._onfetch();
    }

    /**
     * UI
     */

    render() {
        const content = this.state.celebrity ? (
            <ScrollView
                style={styles.scrollView}
                automaticallyAdjustContentInsets={false}
            >
                {this._renderBsicInfo()}
                {this._renderSepLine()}
                {this._renderWorks()}
            </ScrollView>
        ) : null;

        return (
            <View style={styles.container}>
                <NavigationBar
                    title={this.props.name || ''}
                    onPressBackIcon={() => this._onPressBackBtn()}
                />

                {content}
            </View>
        );
    }

    /**
     * 演员基本信息
     */
    _renderBsicInfo() {
        const model = this.state.celebrity;
        const gender = `性别: ${model.gender}`;
        const bornPlace = `出生地: ${model.born_place}`;
        const name_en = `外文名: ${model.aka_en.join('/')}`;
        const other_name = model.aka.join('/');

        return (
            <View style={styles.basic_info_container}>
                <View style={styles.title_container}>
                    <Text style={styles.name_title}>
                        {model.name}
                    </Text>

                    <Text style={styles.basic_info_title}>
                        {gender}
                    </Text>

                    <Text style={styles.basic_info_title}>
                        {bornPlace}
                    </Text>

                    <Text style={styles.basic_info_title}>
                        {name_en}
                    </Text>

                    <Text style={styles.basic_info_title}>
                        {other_name.length > 0 ? `其他译名: ${other_name}` : null}
                    </Text>
                </View>
                <Image
                    style={styles.photo}
                    source={{uri: model.avatars.large}}
                />
            </View>
        );
    }


    _renderSepLine() {
        return (
            <View style={styles.sepLine}/>
        );
    }

    _renderWorks() {
        const model = this.state.celebrity;

        const width = (WIDTH - 15 * 4) / 3;
        const imgeHeight = width / 65 * 100;
        const btnHeight = imgeHeight + 6 + 16;
        const posters = model.works.map((work, index) => {
            const marginRight = index === model.works.length - 1 ? 15 : 0;
            return (
                <TouchableOpacity
                    key={index}
                    style={{width, marginRight, height: btnHeight, marginLeft: 15}}
                    onPress={() => this._onPressPoster(work)}
                >
                    <Image style={{height: imgeHeight, backgroundColor: '#ddd'}}
                        source={{uri: work.subject.images.large}}
                    />

                    <View style={{paddingTop: 6}}>
                        <Text
                            style={[styles.other_movie_title, {width}]}
                            numberOfLines={1}
                        >
                            {work.subject.title}
                        </Text>
                    </View>
                </TouchableOpacity>
            );
        });

        return (
            <View>
                <Text style={styles.works_title}>
                    {`${model.name}的影视作品`}
                </Text>

                <ScrollView
                    style={{height: btnHeight}}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                >
                    {posters}
                </ScrollView>
            </View>
        );
    }

    /**
     * NETWORK
     */

    _onfetch() {
        showHUDLoading();

        const url = MOVIE_API.celebrity + this.props.celebrityID;
        service.get(url)
            .then(response => {
                if(response.ok === false) {
                    showHUDMessage(response.problem);
                }
                else {
                    console.log(response.data);
                    hidenHUDLoading();
                    this.setState({celebrity: response.data})
                }
            })
    }

    /**
     * EVENT
     */

    _onPressBackBtn() {
        this.props.navigator && this.props.navigator.pop();
    }

    _onPressPoster(work) {
        const movieID = work.subject.id;

        this.props.navigator && this.props.navigator.push({
            component: MovieDetail,
            params: {
                movieID
            }
        });
    }
}

const styles = Style({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    scrollView: {
        flex: 1
    },
    basic_info_container: {
        padding: 15,
        flexDirection: 'row'
    },
    photo: {
        width: 100,
        height: 140,
        backgroundColor: '#ddd'
    },
    title_container: {
        flex: 1,
        marginRight: 10
    },
    name_title: {
        fontSize: 17,
        marginBottom: 15
    },
    basic_info_title: {
        marginTop: 3,
        fontSize: 14
    },
    sepLine: {
        height: 10,
        backgroundColor: '#ddd'
    },
    works_title: {
        margin: 15,
        color: '#a1a1a1',
        fontSize: 14
    },
    other_movie_title: {
        fontSize: 14,
        fontWeight: '500',
        lineHeight: 16,
        textAlign: 'center'
    }
});