import axios from 'axios';


const client = axios.create({
    baseURL: 'https://openwhisk.eu-gb.bluemix.net/api/v1/web/granat.stepan%40gmail.com_dev/default'
})

export default client
