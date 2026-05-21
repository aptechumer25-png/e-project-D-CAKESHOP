
    const swiper = new Swiper('.swiper', {
    // Genel ayarlar    
    direction: 'horizontal', // Dikey kaydırıcı için 'vertical'
    loop: true, // Sonsuz döngü
      autoplay: {
        delay: 1500, // Resimler arası geçiş süresi (ms)
        disableOnInteraction: false,
    },

    // Sayfalama
    pagination: {
        el: '.swiper-pagination',
        clickable: true, // Sayfalama noktalarına tıklanabilirlik
    },

    // Navigasyon düğmeleri
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },  

    // Geçiş efektleri
    effect: 'fade', // Diğer efektler: slide, fade, cube, coverflow, flip
        fadeEffect: {
        crossFade: true,
    },

    // Geçiş efekti hızı (ms) 
    speed: 1500,
    });