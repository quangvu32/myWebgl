count = 0;
document.getElementById('draw').addEventListener('click', () => {
    count += 1;
    if(count % 2 == 0){
        document.querySelector('.drawBtn').querySelector('h3').innerText = 'Draw mode';
    }
    else{
        document.querySelector('.drawBtn').querySelector('h3').innerText = 'Point mode';
    }
})