/**
 * Created by zhou on 16/6/4.
 */

/**
 * https://github.com/skellock/apisauce
 */
import {create as API} from 'apisauce';
import Reactotron from 'reactotron';

export default service = API({
    baseURL: 'https://api.douban.com',
    timeout: 10000,
    headers: {'Accept': 'application/json'}
});
service.addMonitor(Reactotron.apiLog);