
document.getElementById('welcome-screen').addEventListener('click', () => {
    document.getElementById('welcome-screen').style.opacity = 0;
    setTimeout(() => {
        document.getElementById('welcome-screen').style.display = 'none';
        document.getElementById('upload-screen').style.display = 'flex';
        document.getElementById('upload-screen').style.opacity = 1;
    }, 500);
});

function submitFile() {
    const fileInput = document.getElementById("fileUpload");
    if (!fileInput.files[0]) {
        alert("Proszę wybrać plik!");
        return;
    }

    const formData = new FormData();
    formData.append("file", fileInput.files[0]);
    
    fetch('/interpret', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        alert("Wynik analizy: " + data.message);
    })
    .catch(error => {
        alert("Błąd podczas analizy pliku!");
    });
}
