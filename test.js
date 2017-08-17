var _ = require('lodash');
var participants = [
    {"_id":"5995975bd8ce99d7d16c8eab","name":"Alexander","avatar":"https://vk.com/images/camera_50.png"},
    {"_id":"599597b3d8ce99d7d16c8eac","name":"Alexandra","avatar":"https://vk.com/images/camera_50.png"}
];

var matches = { '5995975bd8ce99d7d16c8eab': [ '599597b3d8ce99d7d16c8eac' ],
  '599597b3d8ce99d7d16c8eac': [ '5995975bd8ce99d7d16c8eab' ] };



for (var key in matches) {
//    console.log(matches[key])
   matches[key].forEach( (item, i , arr) => {
       var index = _.findIndex(participants, function(o) { return o._id == item; });
       arr[i] =  participants[index];
    //    participants[index];
   })
}


console.log(matches)