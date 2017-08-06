
/* 1) */
// person1

let person1 = {
  'eventID1': [ 'personId2', 'personId3' ],
  'eventID2': [ 'personId4', 'personId5', 'personId6' ],
};

let person2 = {
  'eventID1': [ 'personId1', 'personId3' ]
};

/* 2) */
// eventID1
// {
//   person1 : [ personId2, personId3 .. ],
//   person2 : [ personId1, personId3 .. ]
// }

let eventID1 = {
  'personId1' : [ 'personId2', 'personId3' ],
  'personId2' : [ 'personId1', 'personId3' ],
  'personId3' : []
};

let matches = {};
for (var key in eventID1) {
  eventID1[key].forEach( (person) => {
    if ( eventID1[person].includes(key) ) {
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

 