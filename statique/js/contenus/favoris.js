
let dicotest = {info : "ligne 1", arret  : "charle de gaule" , temps : "départ dans 15min", incident : "arret", afflu :"moyenne  ", suppr : "X"};

let ligne;
let arret;
//[
    //{info : "ligne" , temps : "départ dans" , incident : "RAS" , afflu :"calme" },
    //{info : "ligne" , temps : "départ dans" , incident : "RAS" , afflu :"calme" }
//];


function affiche() {
    let maListe = JSON.parse(localStorage.getItem('lifav')) || [];

    var listfav = document.getElementById("listefav");
    
    var html = "";
    for (var i = 0; i < maListe.length; i++) {
        var objet = maListe[i];
        html += "<li>LOGO " + " Ligne: " + objet.info + " arret : " + objet.arret +  " Départ dans: " + objet.temps + " Incident: " + objet.incident + " Affluence: " + objet.afflu + 
        " <a class=\"X\" href = \"#\" onclick=\"suppr(" + i + ")\"> " + objet.suppr + " </a> " + "</li>";
    }

    listfav.innerHTML = html; // Ajoute les éléments de liste générés à la liste
}

function ajouter() {
    document.getElementById('modal').style.display = 'block';
}

function valider() {
  // Masquer la modal en changeant le style de l'élément
  let maListe = JSON.parse(localStorage.getItem('lifav')) || [];
  maListe.push(dicotest);
  localStorage.setItem('lifav', JSON.stringify(maListe));
  affiche();
  document.getElementById('modal').style.display = 'none';
}

function suppr(objet) {
    let maListe = JSON.parse(localStorage.getItem('lifav'));
    maListe.splice(1,1);
    localStorage.setItem('lifav', JSON.stringify(maListe))
}


affiche()
