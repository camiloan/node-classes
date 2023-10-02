const miFormulario = document.querySelector('form');

const url = window.location.hostname.includes('localhost')
  ? 'http://localhost:8080/api/auth/'
  : 'http://localhost:8080/api/auth/'; //DNS Servidor

miFormulario.addEventListener('submit', (ev) => {
  ev.preventDefault();
  const formData = {};
  for (let el of miFormulario.elements) {
    if (el.name.length > 0) {
      formData[el.name] = el.value;
    }
  }
  fetch(url + 'login', {
    method: 'POST',
    body: JSON.stringify(formData),
    headers: { 'Content-Type': 'application/json' },
  })
    .then((resp) => resp.json())
    .then(({ msg, token }) => {
      if (msg) {
        return console.error(msg);
      }
      localStorage.setItem('token', token);
      window.location = 'chat.html';
    })
    .catch((err) => {
      console.log(err);
    });
});

function handleCredentialResponse(response) {
  // decodeJwtResponse() is a custom function defined by you
  // to decode the credential response.
  // Google Token : ID_TOKEN
  // console.log('id_token', response.credential);
  const body = { id_token: response.credential };
  fetch(url + 'google', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
    .then((resp) => resp.json())
    .then(({ token, usuario }) => {
      localStorage.setItem('token', token);
      localStorage.setItem('email', usuario.correo);
      window.location = 'chat.html';
    })
    .catch(console.warn);
}

function signout() {
  // google.accounts.id.disableAutoSelect();
  //   console.log('Button clicked');
  //   console.log(google.accounts.id);
  google.accounts.id.revoke(localStorage.getItem('email'), (done) => {
    localStorage.clear();
    location.reload();
  });
}
