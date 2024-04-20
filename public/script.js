const btnPac = document.getElementById("btnPac")
const btnMed = document.getElementById("btnMed2")

btnPac.addEventListener('click', function(){
    const pac = document.getElementById("pac")
    const med = document.getElementById("med")

    pac.style.display = 'flex'
    med.style.display = 'none'
})

btnMed.addEventListener('click', function(){
    const pac = document.getElementById("pac")
    const med = document.getElementById("med")

    pac.style.display = 'none'
    med.style.display = 'flex'
})