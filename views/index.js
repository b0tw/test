document.querySelector('#submit').addEventListener('click', () => {
    const denumire = document.querySelector('#descriere').value.trim();
    const specificatiiMinime = document.querySelector('#specificatiiMinime').value;
    const descriere = document.querySelector('#descriere').value;
    const pret = document.querySelector('#pret').value;
    const image = document.querySelector('#image').files[0];


    let formData = new FormData();
    formData.append(`denumire`, denumire);
    formData.append(`specificatiiMinime`, specificatiiMinime);
    formData.append(`descriere`, descriere);
    formData.append(`pret`, pret);
    formData.append(`image`, image);

    axios({
        method: "post",
        url: '/produse/adaugare',
        data: formData,
        config: { headers: { 'Content-Type': 'multipart/form-data' } }
    });

})