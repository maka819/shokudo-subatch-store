/**
 * メディアギャラリーの画像切り替え
 * @param {string} src - 切り替え後の画像URL
 * @param {number} index - 選択されたサムネイルのインデックス
 */
function changeImage(src, index) {
    // メイン画像の差し替え
    const mainImg = document.getElementById('current-image');
    mainImg.style.opacity = 0; // フェードアウト演出
    
    setTimeout(() => {
        mainImg.src = src;
        mainImg.style.opacity = 1;
    }, 150);

    // サムネイルのアクティブ状態更新
    const thumbs = document.querySelectorAll('.thumb');
    thumbs.forEach(t => t.classList.remove('active'));
    thumbs[index].classList.add('active');
}

// ページ読み込み時の初期化
document.addEventListener('DOMContentLoaded', () => {
    console.log("Welcome to My Nontendo Store Parody!");
    
    // 購入ボタンクリック時のダミーアクション
    const buyButton = document.querySelector('.btn-primary');
    buyButton.addEventListener('click', () => {
        alert('この商品は食堂常連客のみの限定コンテンツです。店長の許可を得てから再度お試しください。');
    });
});