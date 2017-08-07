 

let likes = {
  'personId1' : [ 'personId2', 'personId3' ],
  'personId2' : [ 'personId1', 'personId3' ],
  'personId3' : []
};

let matches = {};
for (var key in likes) {
  likes[key].forEach( (person) => {
    if ( likes[person].includes(key) ) {
        matches[key] = [];
        matches[key].push(person);
    }
  });
}


console.log(matches);


/* 3) */

// eventID1
// matches: {
//   personID1: [ personID2, personID3 ]
//   personID2: [],
//   personID3: [],
// },

 