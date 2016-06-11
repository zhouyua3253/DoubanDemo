/**
 * Created by zhou on 16/6/4.
 */

export default class Home extends Component {

    render() {
        return (
            <View style={styles.container}>
                <Text>Home</Text>
            </View>
        );
    }
}

const styles = Style({
    container: {
        flex: 1,
        backgroundColor: '#987654'
    }
});
