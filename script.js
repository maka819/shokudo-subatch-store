/* メディアギャラリー */
const galleryData = [
    { 
        src: "https://placehold.jp/24/e70009/ffffff/800x450.png?text=Img+1",          // 標準（1x）用
        src2x: "https://placehold.jp/24/e70009/ffffff/1600x900.png?text=Img+1",    // Retina（2x）用
        alt: "メインビジュアル1", 
        thumb: "https://placehold.jp/24/e70009/ffffff/800x450.png?text=Img+1" 
    },
    { 
        src: "https://placehold.jp/24/414548/ffffff/800x450.png?text=Img+2", 
        src2x: "https://placehold.jp/24/414548/ffffff/1600x900.png?text=Img+2", 
        alt: "メインビジュアル2", 
        thumb: "https://placehold.jp/24/414548/ffffff/800x450.png?text=Img+2" 
    },
    { 
        src: "https://placehold.jp/24/989898/ffffff/800x450.png?text=Img+3", 
        src2x: "https://placehold.jp/24/989898/ffffff/1600x900.png?text=Img+3", 
        alt: "メインビジュアル3", 
        thumb: "https://placehold.jp/24/989898/ffffff/800x450.png?text=Img+3" 
    }
];
class MediaCarousel {
    constructor(element, data) {
        this.container = element;
        this.data = data;
        this.inner = element.querySelector('.slider-inner');
        this.thumbContainer = element.querySelector('.thumbnails');
        this.currentIndex = 0;
        
        this.totalSlides = data.length; // ボタン用のスライド枚数を取得
        this.autoPlayInterval = 5000; // オートスライドの間隔(ms)
        this.timer = null;
        this.render(); // データを元にHTMLを生成
        this.init();
    }

    render() {
        // スライド生成
        this.inner.innerHTML = this.data.map(item => `
            <div class="slide">
                <img src="${item.src}" 
                    srcset="${item.src} 1x, ${item.src2x} 2x" 
                    alt="${item.alt}">
            </div>
        `).join('');
  
        // サムネイル生成
        this.thumbContainer.innerHTML = this.data.map((item, index) => `
            <img class="thumb ${index === 0 ? 'active' : ''}" 
                src="${item.thumb || item.src}" 
                data-index="${index}">
        `).join('');

        // 生成後に要素を再取得
        this.thumbs = this.container.querySelectorAll('.thumb');
    }

    init() {
        // ボタンのクリックイベント登録 
        const nextBtn = this.container.querySelector('#next-btn');
        const prevBtn = this.container.querySelector('#prev-btn');
        if (nextBtn) nextBtn.addEventListener('click', () => this.next());
        if (prevBtn) prevBtn.addEventListener('click', () => this.prev());

        this.thumbs.forEach(thumb => {
            thumb.addEventListener('click', () => {
                this.goTo(parseInt(thumb.dataset.index));
            });
        });
        
        this.startAutoPlay();
    }

    goTo(index) {
        this.currentIndex = index;
        this.updateView();
        this.resetAutoPlay();
    }

    next() {
        this.currentIndex = (this.currentIndex + 1) % this.totalSlides;
        this.updateView();
        this.resetAutoPlay();
    }

    prev() {
        this.currentIndex = (this.currentIndex - 1 + this.totalSlides) % this.totalSlides;
        this.updateView();
        this.resetAutoPlay();
    }

    updateView() {
        // スライド移動を実現
        const offset = this.currentIndex * -100;
        this.inner.style.transform = `translateX(${offset}%)`;

        // サムネイルのアクティブ状態を更新
        this.thumbs.forEach((t, i) => {
            t.classList.toggle('active', i === this.currentIndex);
        });
    }

    startAutoPlay() {
        this.timer = setInterval(() => this.next(), this.autoPlayInterval);
    }

    resetAutoPlay() {
        clearInterval(this.timer);
        this.startAutoPlay();
    }
}

/**
 * クリック位置にハートを生成する
 */
function createHeartEffect(x, y) {
    const heart = document.createElement('span');
    heart.className = 'heart-effect';
    heart.textContent = '❤';
    
    // クリック位置（またはボタン中央）に配置
    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;
    heart.style.position = 'fixed'; // スクロールに対応

    document.body.appendChild(heart);

    // アニメーション終了後に要素を削除（クリーンアップ） 
    heart.addEventListener('animationend', () => {
        heart.remove();
    });
}

// 初期化
document.addEventListener('DOMContentLoaded', () => {
    const galleryEl = document.querySelector('.media-gallery');
    if (galleryEl) {
        new MediaCarousel(galleryEl, galleryData);
    }

    const stickyFooter = document.querySelector('.mobile-sticky-footer');
    const wishlistBtn = document.querySelector('.btn-secondary');

    if (stickyFooter) {
        window.addEventListener('scroll', () => {
            // window.innerHeight (現在の画面の高さ) を超えたらクラスを付与
            if (window.scrollY > window.innerHeight) {
                stickyFooter.classList.add('is-visible');
            } else {
                stickyFooter.classList.remove('is-visible');
            }
        }, { passive: true }); // パフォーマンス向上のためのオプション
    }


    if (wishlistBtn) {
        wishlistBtn.addEventListener('click', function(e) {
            // 現在「追加済み」かどうかを判定
            const isAdded = this.classList.contains('is-added');

            if (!isAdded) {
                // 追加処理
                this.classList.add('is-added');
                this.textContent = '❤ ほしいものリストに追加済';
                createHeartEffect(e.clientX, e.clientY);
            
            } else {
                // 解除処理
                this.classList.remove('is-added');
                this.textContent = 'ほしいものリストに追加';
            }
        });
    }

    const buyButtons = document.querySelectorAll('.btn-primary');
    
    buyButtons.forEach(button => {
        button.addEventListener('click', () => {
            alert('この商品は食堂常連客のみの限定コンテンツです。店長の許可を得てから再度お試しください。');
        });
    });
});

