let lang = (localStorage.getItem('lang') == null ) ? 'en' : localStorage.getItem('lang');

const para = document.createElement("div");
para.id = 'leaflet-lang';
para.innerHTML = '<a href="#tr"' + (lang == 'tr' ? ' id="selected-lang"' : '') + '>tr</a> <a href="#en"' + (lang == 'en' ? ' id="selected-lang"' : '') + '>en</a>';


// Hover efekti için
para.addEventListener('mouseenter', () => {
  para.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
  para.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.2)';
  para.style.transform = 'translateX(-50%) translateY(-2px)';
});

para.addEventListener('mouseleave', () => {
  para.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
  para.style.boxShadow = '0 2px 12px rgba(0, 0, 0, 0.15)';
  para.style.transform = 'translateX(-50%) translateY(0)';
});
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
