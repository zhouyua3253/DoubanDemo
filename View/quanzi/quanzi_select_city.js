/**
 * Created by zhouyumin on 16/6/14.
 */

import NavigationBar from '../navigation_bar/navigation_bar';
import Citys from './quanzi_city';

const hot_city = Citys.slice(0, 15);
const orderCitys = Citys.sort((city1, city2) => {
    if(city1.uid > city2.uid) {
        return 1;
    }
    else if(city1.uid < city2.uid) {
        return -1;
    }
    else {
        return 0;
    }
});

export default class SelectCity extends Component {

    constructor(props) {
        super(props);

        this.sections = {'热门城市': [hot_city]}; // {"A": ['安庆', '安阳']}, {"B": ['北京', '包头']}

        for(let city of orderCitys) {
            const name = city.uid;
            const key = name.substring(0, 1).toUpperCase();

            if(this.sections[key]) {
                this.sections[key].push(city);
            }
            else {
                this.sections[key] = [city];
            }
        }
    }

    render() {
        return (
            <View
                style={styles.container}
            >
               <NavigationBar
                    title='选择城市'
                    onPressBackIcon={() => this._onPressBack()}
               />

                <GiftedListView
                    style={styles.listView}
                    withSections={true}
                    initialListSize={20}
                    pagination={false}
                    refreshable={false}
                    firstLoader={false}
                    onFetch={(_, callback) => this._fetchCitys(callback)}
                    rowView={this._renderCell.bind(this)}
                    sectionHeaderView={(sectionData, sectionID) => this._renderSectionHeaderView(sectionData, sectionID)}
                />
            </View>
        );
    }

    _fetchCitys(callback) {
        callback(this.sections);
    }

    _renderCell(data, sectionID) {
        if(sectionID === '热门城市') {
            const margin = 15;
            const width = (WIDTH - margin * 4) / 3;
            const btns = data.map(city => {
                return (
                    <TouchableOpacity
                        key={city.name}
                        style={[{width}, styles.hot_city_btn]}
                        onPress={() => this._onSelectCell(city)}
                    >
                        <Text>{city.name}</Text>
                    </TouchableOpacity>
                );
            });

            return (
                <View style={styles.hot_city_cell}>
                    {btns}
                </View>
            );
        }


        return (
            <TouchableHighlight
                underlayColor='#ddd'
                onPress={() => this._onSelectCell(data)}
                style={{overflow: 'hidden'}}
            >
                <View style={styles.cell_container}>
                    <Text style={styles.city_title}>{data.name}</Text>
                </View>
            </TouchableHighlight>
        )
    }

    /**
     * 粘性分区头部
     * @param sectionData  分区里面cell的具体数据
     * @param sectionID
     */
    _renderSectionHeaderView(sectionData, sectionID) {
        return (
            <View style={styles.section_header}>
                <Text style={styles.section_title}>{sectionID}</Text>
            </View>
        );
    }

    _onSelectCell(city) {
        this.props.onFinsihSelect && this.props.onFinsihSelect(city);
        this._onPressBack();
    }

    /**
     * EVENT
     */

    _onPressBack() {
        this.props.navigator && this.props.navigator.pop();
    }
}

const styles = Style({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    listView: {
        flex: 1
    },
    cell_container: {
        height: 45,
        paddingLeft: 15,
        borderBottomColor: '#ddd',
        borderBottomWidth: ONE_PIXEL,
        justifyContent: 'center'
    },
    city_title: {
        fontSize: 16
    },
    section_header: {
        height: 25,
        backgroundColor: 'rgb(241, 241, 241)',
        paddingLeft: 15,
        alignItems: 'flex-start',
        justifyContent: 'center'
    },
    section_title: {
        color: 'gray',
        fontSize: 12
    },
    hot_city_cell: {
        height: 50 * 5 + 10,
        backgroundColor: 'rgb(241, 241, 241)',
        justifyContent: 'flex-end',
        flexWrap: 'wrap'
    },
    hot_city_btn: {
        height: 35,
        borderRadius: 3,
        borderColor:'gray',
        borderWidth: ONE_PIXEL,
        marginBottom: 15,
        marginLeft: 15,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center'
    }
});