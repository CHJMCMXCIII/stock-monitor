const axios = require('axios')


// const getData = async () => {
//     const response = await axios.get('http://127.0.0.1:12010/stocks/list')
//     let server_data = response.data

//     console.log(server_data[1])
// }

// getData()


let server_data;
axios.get('http://127.0.0.1:12010/stocks/list')
.then(res => { 

    server_data = res.data
    console.log(res.data[0].name)
})




