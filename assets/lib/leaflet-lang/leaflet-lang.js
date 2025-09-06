let lang = (localStorage.getItem('lang') == null ) ? 'en' : localStorage.getItem('lang');

const para = document.createElement("div");
para.id = 'leaflet-lang';
para.innerHTML = '<a href="#tr"' + (lang == 'tr' ? ' id="selected-lang"' : '') + '>tr</a> <a href="#en"' + (lang == 'en' ? ' id="selected-lang"' : '') + '>en</a>';

para.style = `border:2px solid #ddd; border-radius:8px;z-index: 999;position: absolute;bottom: 58px;left: 10px;background-color: rgb(255, 255, 255);height: auto;width: auto;text-align: center;`;
document.querySelector('#map').appendChild(para);

const Links = document.querySelectorAll('div#leaflet-lang a');
for (let index = 0; index < Links.length; index++) {
    const link = Links[index];
    link.addEventListener('click', function(e){
        let lang = e.target.childNodes[0].data;
        localStorage.setItem('lang', lang); 
        window.location.replace('index.html');
    });    
}
