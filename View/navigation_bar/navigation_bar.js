/**
 * Created by zhou on 16/6/4.
 */

const rightBtnSize = 44;
const rightIconSize = 24;

const backIcon = require('../../icon/bar_back.png');

export default class NavigationBar extends Component {

    static propTypes = {
        title: React.PropTypes.string.isRequired,
        rightIcon: React.PropTypes.number,
        onPressRightIcon: React.PropTypes.func,
        onPressBackIcon: React.PropTypes.func
    };

    static defaultProps = {
        title: '' 
    };

    render() {
        const rightBtn = this.props.rightIcon ? (
            <TouchableOpacity
                style={styles.rightBtn}
                activeOpacity={0.75}
                onPress={() => this.props.onPressRightIcon()}
            >
                <Image
                    source={this.props.rightIcon}
                    style={styles.btn_icon}/>
            </TouchableOpacity>
        ) : null;

        const backBtn = this.props.onPressBackIcon ? (
            <TouchableOpacity
                style={styles.backBtn}
                activeOpacity={0.75}
                onPress={() => this.props.onPressBackIcon()}
            >
                <Image
                    source={backIcon}
                    style={styles.btn_icon}/>
            </TouchableOpacity>
        ) : null;

        return (
            <View style={styles.container}>
                <View style={styles.title_content}>
                    <Text style={styles.title_font}>{this.props.title}</Text>
                </View>
                <View style={styles.bottom_line}/>
                {rightBtn}
                {backBtn}
            </View>
        );
    }
}

const styles = Style({
    container: {
        backgroundColor: 'white',
        ios: {
            height: 64
        },
        android: {
            height: 48
        }
    },
    title_content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        ios: {
            marginTop: 20
        }
    },
    title_font: {
        fontSize: 17,
        fontWeight: '600'
    },
    rightBtn: {
        width: rightBtnSize,
        height: rightBtnSize,
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        right: 5,
        ios: {
            top: (44 - rightBtnSize) * 0.5 + 20
        },
        android: {
            top: (48 - rightBtnSize) * 0.5
        }
    },
    backBtn: {
        width: rightBtnSize,
        height: rightBtnSize,
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        left: 5,
        ios: {
            top: (44 - rightBtnSize) * 0.5 + 20
        },
        android: {
            top: (48 - rightBtnSize) * 0.5
        }
    },
    btn_icon: {
        width: rightIconSize,
        height: rightIconSize
    },
    bottom_line: {
        height: ONE_PIXEL,
        backgroundColor: '#B2B2B2'
    }
});