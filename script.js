/* メディアギャラリー */
const galleryData = [
    { 
        src: "https://placehold.jp/24/e70009/ffffff/800x450.png?text=Img+1",          // 標準（1x）用
        src2x: "https://placehold.jp/24/e70009/ffffff/1600x900.png?text=Img+1",    // Retina（2x）用
        alt: "メインビジュアル1", 
        fullSrc: "https://placehold.jp/24/e70009/ffffff/2560x1440.png?text=Full+Res+1", // モーダル用
        thumb: "https://placehold.jp/24/e70009/ffffff/800x450.png?text=Img+1" 
    },
    { 
        src: "https://placehold.jp/24/414548/ffffff/800x450.png?text=Img+2", 
        src2x: "https://placehold.jp/24/414548/ffffff/1600x900.png?text=Img+2", 
        alt: "メインビジュアル2", 
        fullSrc: "https://placehold.jp/24/e70009/ffffff/2560x1440.png?text=Full+Res+2",
        thumb: "https://placehold.jp/24/414548/ffffff/800x450.png?text=Img+2" 
    },
    { 
        src: "https://placehold.jp/24/989898/ffffff/800x450.png?text=Img+3", 
        src2x: "https://placehold.jp/24/989898/ffffff/1600x900.png?text=Img+3", 
        alt: "メインビジュアル3", 
        fullSrc: "https://placehold.jp/24/e70009/ffffff/2560x1440.png?text=Full+Res+3",
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

        // モーダル関連
        this.modal = document.getElementById('image-modal');
        this.modalImg = document.getElementById('modal-img');
        this.modalClose = document.getElementById('modal-close');

        this.render(); // データを元にHTMLを生成
        this.init();
    }

    render() {

        if (!this.inner || !this.thumbContainer) return; // 要素がない場合は何もしない
        // スライド生成
        this.inner.innerHTML = this.data.map((item, index) => `
            <div class="slide">
                <img 
                    src="${item.src}" 
                    srcset="${item.src} 1x, ${item.src2x} 2x" 
                    alt="${item.alt}" 
                    data-index="${index}" 
                    tabindex="0"
                >
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
        this.render(); // まず描画
        this.update(); // 初期位置設定
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

        // スライド画像にクリックイベント付与
        const slideImages = this.inner.querySelectorAll('img');
        slideImages.forEach(img => {
            img.style.cursor = 'zoom-in';
            
            const handleOpen = () => {
                const index = img.dataset.index;
                const item = this.data[index];
                this.openModal(item.fullSrc, item.src2x); 
            };

            img.addEventListener('click', handleOpen);
            img.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') handleOpen();
            });
        });

        // モーダルを閉じるイベント登録
        if (this.modalClose) this.modalClose.onclick = () => this.closeModal();
        if (this.modal) {
            this.modal.onclick = (e) => { if (e.target === this.modal) this.closeModal(); };
        }
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('is-active')) {
                this.closeModal();
            }
        });

        this.startAutoPlay();
    }

    goTo(index) {
        this.currentIndex = index;
        this.update();
        this.resetAutoPlay();
    }

    next() {
        this.currentIndex = (this.currentIndex + 1) % this.totalSlides;
        this.update();
        this.resetAutoPlay();
    }

    prev() {
        this.currentIndex = (this.currentIndex - 1 + this.totalSlides) % this.totalSlides;
        this.update();
        this.resetAutoPlay();
    }

    update() {
        // スライド移動を実現
        const offset = this.currentIndex * -100;
        this.inner.style.transform = `translateX(${offset}%)`;

        // サムネイルのアクティブ状態を更新
        this.thumbs.forEach((t, i) => {
            t.classList.toggle('active', i === this.currentIndex);
        });
    }

    // モーダル制御用メソッド
    openModal(fullSrc, src2x) {
        this.modalImg.src = fullSrc;
        this.modalImg.srcset = `${src2x} 1x, ${fullSrc} 2x`;
        this.modal.classList.add('is-active');
        this.modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        this.modal.classList.remove('is-active');
        this.modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
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

    // ハンバーガーメニュー制御
    const menuTrigger = document.getElementById('menu-trigger');
    const navDrawer = document.querySelector('.nav-drawer');
    const overlay = document.getElementById('menu-overlay');
    const body = document.body;

    if (menuTrigger && navDrawer && overlay) {
        function toggleMenu() {
            const isExpanded = menuTrigger.getAttribute('aria-expanded') === 'true';
            
            // 状態の反転 
            menuTrigger.setAttribute('aria-expanded', !isExpanded);
            navDrawer.setAttribute('aria-hidden', isExpanded);
            
            // クラスの切り替え
            menuTrigger.classList.toggle('is-active');
            navDrawer.classList.toggle('is-active');
            overlay.classList.toggle('is-active');
            
            // 背景スクロールロック（操作性の安定） [cite: 42, 47]
            body.style.overflow = isExpanded ? '' : 'hidden';
        }

        menuTrigger.addEventListener('click', toggleMenu);
        overlay.addEventListener('click', toggleMenu); // 枠外クリックで閉じる
    }

    const stickyFooter = document.querySelector('.mobile-sticky-footer');
    
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
    
    
    const wishlistBtn = document.querySelector('.btn-secondary');

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

