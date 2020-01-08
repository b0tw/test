document.querySelector('#submit').addEventListener('click', () => {
    const username = document.querySelector('#userName').value.trim();
    const password = document.querySelector('#password').value;

    const user = {
        username,
        password
    }

    axios.post('/login', user).then((response) => {
    });
})