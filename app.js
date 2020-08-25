const https = require('https');

function getImage(url, callback) {
    https.get(url, res => {
            // Initialise an array
            const bufs = [];

            // Add the data to the buffer collection
            res.on('data', function(chunk) {
                bufs.push(chunk)
            });

            // This signifies the end of a request
            res.on('end', function() {
                // We can join all of the 'chunks' of the image together
                const data = Buffer.concat(bufs);

                // Then we can call our callback.
                callback(null, data);
            });
        })
        // Inform the callback of the error.
        .on('error', callback);
}


const reddit = require('./redditKeys')




const T = require('./twitterKeys')


setInterval(function() {
    reddit.get('/r/funny/hot', {
        limit: 1
    }).then(function(result) {
        if (!result.data.children[2].data.is_video) {
            const res = result.data.children[2].data.url




            getImage(res, function(err, data) {
                const file = data.toString('base64')
                T.post('media/upload', { media_data: file }, function(err, data, response) {
                    const id = data.media_id_string
                    const params = {
                        status: result.data.children[2].data.title,
                        lat: Math.random() * 90,
                        long: Math.random() * 180,
                        display_coordinates: true,
                        media_ids: id
                    }


                    T.post('statuses/update', params, function(err, data, response) { console.log(data) })
                })
            })

        }











    })

}, 1000 * 60 * 60 * 2)












// const init = {
//     name: result.data.children[0].data.url,
//     command: "INIT",
//     media_type: "jpg",
//     total_bytes: 5000
// }
// var T = new Twit(vending)
// var id = ''
// T.post('media/upload', init, function(err, data, response) {
//     id = data.media_id_string


//     //console.log(data)


// })


// const append = {
//     name: result.data.children[0].data.url,
//     command: "APPEND",
//     media_id: id,
//     media_data: result.data.children[0].data.url,
//     segment_index: 0
// }
// T.post('media/upload', append, function(err, data, response) {})

// const fin = {
//     name: result.data.children[0].data.url,
//     command: "FINALIZE",
//     media_id: id,
// }
// T.post('media/upload', fin, function(err, data, response) {})



//console.log(result.data.children[0].data.url)



// var T = new Twit(vending)
// const params = {
//     status: "صباح الخير",
//     //in_reply_to_status_id: tweet_id,
//     lat: 30.5928,
//     long: 114.3055,
//     display_coordinates: true
// }
// T.post('statuses/update', params, function(err, data, response) {

//     })
// T.get('search/tweets', { q: 'Toilet', count: 1, }, function(err, data, response) {
//     const tweet_id = data.statuses[0].id_str
//     const user = data.statuses[0].user.screen_name
//     const user_id = data.statuses[0].user.id
//     console.log(tweet_id + ' ' + user + ' ' + user_id)
//     console.log(data.statuses)
//     const params = {
//         status: "وه",
//         in_reply_to_status_id: tweet_id,
//         lat: 30.5928,
//         long: 114.3055,
//         display_coordinates: true
//     }
//     T.post('statuses/update', params, function(err, data, response) {

//     })
// })