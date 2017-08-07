
let likes1 = {
  person_id: 'personId1',
  person_likes: [ 'personId2', 'personId3' ]
};

let likes2 = {
  person_id: 'personId2',
  person_likes: [ 'personId1', 'personId3' ]
};

let likes = [
  likes1,
  likes2
];


// console.log(likes);
let matches = {};

likes.forEach( (obj) => {
  obj.person_likes.forEach( (id) => {
    likes.forEach( (next) => {
      if(next.person_id == id) {
        if( next.person_likes.includes(obj.person_id) ) {
          matches[obj.person_id] = [];
          matches[obj.person_id].push(id);
          // console.log('matches --> ',obj.person_id, id);
        }
      }
    })
  })
})

console.log(matches)

// let likes = {
//   'personId1' : [ 'personId2', 'personId3' ],
//   'personId2' : [ 'personId1', 'personId3' ],
//   'personId3' : []
// };
// let matches = {};
// for (var key in likes) {
//   likes[key].forEach( (person) => {
//     if ( likes[person].includes(key) ) {
//         matches[key] = [];
//         matches[key].push(person);
//     }
//   });
// }
// console.log(matches);

 

 