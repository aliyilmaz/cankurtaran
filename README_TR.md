## Cankurtaran (Doğa ve Çevre Koruma Harita Projesi)
Bu proje, doğa, şehir ve anıt koruyucularının dijital haritalar üzerinde işaretlemeler yapmasını sağlayarak çevre koruma ve sorunların raporlanması amacıyla geliştirilmiştir. Kullanıcılar, harita üzerinde çeşitli şekillerde işaretlemeler yaparak korunması gereken yerleri işaretleyebilir, ilgili kurumlara iletebilir veya çözüm üretmeye çalışabilir.

### Özellikler
Proje aşağıdaki harita ve işaretleme özelliklerine sahiptir:

- **Konum Takibi:** GPS ikonuna tıklayarak mevcut konumunuzu harita üzerinde takip edebilirsiniz.
- **Label Ekleme:** Text ikonu tıklanarak, harita üzerinde tıklanan noktada bir textbox oluşturulabilir. Bu textbox'ı silmek için içeriğini boşaltıp Enter ya da Ok butonuna basabilirsiniz.
- **Polyline Oluşturma:** Birden fazla noktayı birleştirerek çizgisel (polyline) işaretlemeler yapabilirsiniz.
- **Polygon Oluşturma:** Kapalı alanlar (polygon) çizerek, koruma altına alınması gereken alanları işaretleyebilirsiniz.
- **Rectangle Oluşturma:** Dikdörtgen şeklinde alanlar çizebilir ve bu alanları belirtebilirsiniz.
- **Circle Oluşturma:** Yarıçap belirleyerek dairesel alanlar çizebilirsiniz.
- **Marker Oluşturma:** Harita üzerinde belirli noktalara işaretler (marker) yerleştirebilirsiniz.
- **CircleMarker Oluşturma:** Dairesel işaretleyiciler (circle marker) ekleyebilirsiniz.

### Export ve Import
- **GeoJSON olarak Export:** Yaptığınız tüm işaretlemeleri ve şekilleri GeoJSON formatında dışa aktarabilirsiniz.

- **GeoJSON'u Import Etme:** Önceden dışa aktarılan GeoJSON dosyasını içeri aktararak harita üzerinde tekrar görüntüleyebilirsiniz.

### Kullanım
**1. Harita Görüntüleme:** Sistemi açtığınızda harita otomatik olarak yüklenir.

**2. Konum Takibi:** GPS ikonuna tıklayarak mevcut konumunuzu harita üzerinde takip edebilirsiniz. Konumunuzun sürekli takibi sağlanır.

**3. İşaretleme:**
- **Label Ekleme:** Text ikonu tıklanarak harita üzerinde tıklanan noktada bir textbox oluşturulur. Textbox'ı silmek için içeriğini boşaltıp Enter veya Ok butonuna basmanız yeterlidir.
- **Polyline:** Birden fazla noktayı birleştirerek çizgi oluşturabilirsiniz.
- **Polygon, Rectangle, Circle:** İlgili araçları seçip belirlediğiniz alanları çizebilirsiniz.
- **Marker ve CircleMarker:** Harita üzerinde belirli noktaları işaretlemek için kullanılır.

**4. Veri Export ve Import:**

- **Export:** Harita üzerindeki işaretlemeleri GeoJSON formatında dışa aktarabilirsiniz.
- **Import:** Dışa aktarılmış bir GeoJSON dosyasını haritaya import edebilirsiniz.

### Teknolojiler
Bu proje aşağıdaki teknolojilerle geliştirilmiştir:

- **Leaflet.js:** Harita görselleştirme ve etkileşim için kullanılmıştır.
- **leaflet-gps-control:** Kullanıcıların GPS konumlarını harita üzerinde izlemelerini sağlayan bir - Leaflet eklentisidir.
- **Leaflet Draw:** Harita üzerinde şekiller (polyline, polygon, rectangle, circle) çizmek için kullanılan - Leaflet eklentisidir.
- **TextBoxLabel:** Harita üzerinde etiketleme işlemleri için kullanılan özel bir araçtır. Text ikonu tıklanarak harita üzerinde metin eklenebilir ve düzenlenebilir.

### Katkı
Bu projeye katkıda bulunmak isterseniz, lütfen şu adımları izleyin:

**1. Repo'yu forklayın.**
**2. Yeni bir branş oluşturun** (``git checkout -b feature-isim``).
**3. Yapacağınız değişiklikleri commitleyin** (``git commit -am 'Yeni özellik'``).
**4. Değişikliklerinizi push'layın** (``git push origin feature-isim``).
**5. Bir pull request oluşturun.**

### Lisans
Bu proje MIT Lisansı altında lisanslanmıştır. Daha fazla bilgi için [LICENSE](LICENSE) dosyasına göz atabilirsiniz.