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
