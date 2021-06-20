const cafeList = document.querySelector('#cafe-list');
const form = document.querySelector('#add-cafe-form');


// create element and render cafe in dom
const renderCafe = (doc) => {
  let li = document.createElement('li');
  let name = document.createElement('span');
  let city = document.createElement('span');
  let cross = document.createElement('div');

  li.setAttribute('data-id', doc.id);
  name.textContent = doc.data().name;
  city.textContent = doc.data().city;
  cross.textContent = 'X';

  li.appendChild(name);
  li.appendChild(city);
  li.appendChild(cross);

  cafeList.appendChild(li);

  cross.addEventListener('click', (e) => {
    e.preventDefault();
    let id = e.target.parentElement.getAttribute('data-id');
    firestore.collection('cafes').doc(id).delete();
  })
}

// // getting data
// firestore.collection('cafes').get().then((snapshot) => {
//   snapshot.docs.forEach(doc => {
//     renderCafe(doc);
//   })
// })

// saving data
form.addEventListener('submit', (e) => {
  e.preventDefault();
  firestore.collection('cafes').add({
    name: form.name.value,
    city: form.city.value
  });
  form.name.value = '';
  form.city.value = '';
})

// realtime listener
firestore.collection('cafes').orderBy('city').onSnapshot(snapshot => {
  const changes = snapshot.docChanges();
  changes.forEach(change => {
    if(change.type == 'added') {
    renderCafe(change.doc);
    } else if(change.type == 'removed') {
      let li = cafeList.querySelector(`[data-id=${change.doc.id}]`);
      cafeList.removeChild(li);
    }
  })
})