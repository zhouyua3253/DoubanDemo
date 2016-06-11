/**
 * Created by zhou on 16/6/4.
 */

export default class Things extends Component {

    render() {
        return (
            <View style={styles.container}>
                <Text>Things</Text>
            </View>
        );
    }
}

const styles = Style({
    container: {
        flex: 1,
        backgroundColor: 'cyan'
    }
});