
var _ = require('lodash');

var founded = {};

var key1 = "59a2c6995a4ffa2284514cff";
var founded1 = [
    {_id: "59a2c6995a4ffa2284514cff", name: "Александра", avatar: "http://localhost:3000/images/59a2c6b25a4ffa2284514d00"},
    {_id: "59a498b4be2f9f52448a9432", name: "Alexander", avatar: "https://vk.com/images/camera_50.png"}
];

var key2 = "59a498b4be2f9f52448a9432";
var founded2 = [
    {_id: "59a498b4be2f9f52448a9432", name: "Alexander", avatar: "https://vk.com/images/camera_50.png"},
    {_id: "59a2c6995a4ffa2284514cff", name: "Александра", avatar: "http://localhost:3000/images/59a2c6b25a4ffa2284514d00"}
];

// 59a2c6995a4ffa2284514cff
// {_id: "59a498b4be2f9f52448a9432", name: "Alexander", avatar: "https://vk.com/images/camera_50.png"}
// 59a498b4be2f9f52448a9432
// {_id: "59a2c6995a4ffa2284514cff", name: "Александра", avatar: "http://localhost:3000/images/59a2c6b25a4ffa2284514d00"}

// 59a2c6995a4ffa2284514cff  -> search key 59a498b4be2f9f52448a9432 --> if 59a2c6995a4ffa2284514cff contains in key -> add pair
// pair: [{_id: "59a498b4be2f9f52448a9432", name: "Alexander", avatar: "https://vk.com/images/camera_50.png"}, 
//        {_id: "59a2c6995a4ffa2284514cff", name: "Александра", avatar: "http://localhost:3000/images/59a2c6b25a4ffa2284514d00"}]        

founded[key1] = founded1;
founded[key2] = founded2;


//////////////////

Array.prototype.indexOfForArrays = function(search)
{
  var searchJson = JSON.stringify(search); // "[3,566,23,79]"
  var arrJson = this.map(JSON.stringify); // ["[2,6,89,45]", "[3,566,23,79]", "[434,677,9,23]"]
  return arrJson.indexOf(searchJson);
};


for (var key in founded ) { 
    founded[key].shift();  
}

var passed = [];
var final = [];
var final_ob = [];
for (var key in founded ) {
    founded[key].forEach( (item) => {  
        founded[item._id].forEach( (found) => {
            if (found._id == key) {
                var s = [key, item._id].sort();
                if ( passed.indexOfForArrays(s) < 0 ) { 
                    passed.push(s);
                } else {
                    final = s;
                }
            }
        })
    })
}

for (var key in founded ) { 
    founded[key].forEach ( (it) => {
        if ( final.indexOf(it._id) > -1 ) {
            var ind = final.indexOf(it._id);
            final.slice(ind , 1);
            final_ob.push(it);
        }
    })
}

console.log(final_ob);

// console.log('founded', founded)
// console.log('passed',passed)
// console.log('final', final)



 





// matches
// var passed = [];
// for (var key in founded ) {
//   passed.push(founded[key]);
// }    
// console.log('-------- passed -------\n', passed);


// [ [ { _id: '59a2c6995a4ffa2284514cff',
// name: 'Александра',
// avatar: 'http://localhost:3000/images/59a2c6b25a4ffa2284514d00' },
// { _id: '59a498b4be2f9f52448a9432',
// name: 'Alexander',
// avatar: 'https://vk.com/images/camera_50.png' } ],
// [ { _id: '59a498b4be2f9f52448a9432',
// name: 'Alexander',
// avatar: 'https://vk.com/images/camera_50.png' },
// { _id: '59a2c6995a4ffa2284514cff',
// name: 'Александра',
// avatar: 'http://localhost:3000/images/59a2c6b25a4ffa2284514d00' } ] ]




// var participants = [
//     {"_id":"5995975bd8ce99d7d16c8eab","name":"Alexander","avatar":"https://vk.com/images/camera_50.png"},
//     {"_id":"599597b3d8ce99d7d16c8eac","name":"Alexandra","avatar":"https://vk.com/images/camera_50.png"}
// ];

// var matches = { '5995975bd8ce99d7d16c8eab': [ '599597b3d8ce99d7d16c8eac' ],
//   '599597b3d8ce99d7d16c8eac': [ '5995975bd8ce99d7d16c8eab' ] };



// for (var key in matches) {
// //    console.log(matches[key])
//    matches[key].forEach( (item, i , arr) => {
//        var index = _.findIndex(participants, function(o) { return o._id == item; });
//        arr[i] =  participants[index];
//     //    participants[index];
//    })
// }


// console.log(matches)

