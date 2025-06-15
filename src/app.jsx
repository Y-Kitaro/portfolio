import React, { useState, useEffect, useCallback } from 'react';

// 開発用 ダミーデータを利用するようになる
const DEBUG = false;

// --- ダミーデータ ---
// 実際にはGASから取得したデータを使用します
const dummyMainData = {
    main: {main: '<h1>My Portfolio</h1><div class="profile-container"><div><img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNjZWQ0ZGEiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1zaXplPSIxNiI+VGh1bWJuYWlsIDE8L3RleHQ+PC9zdmc+" alt="image"/></div><div><p style="text-align: center;">ユーザ名</p><ul><li>X : Xのアカウント</li><li>github : githubのアカウント</li><li>はてなブログ : はてなブログのURL</li></ul></div></div>'}
};

const dummyCardsData = [
    { 
        title: 'プロジェクトA',
        thumbnailbase64: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNjZWQ0ZGEiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1zaXplPSIxNiI+VGh1bWJuYWlsIDE8L3RleHQ+PC9zdmc+',
        body: '<h2>プロジェクトAの詳細</h2><p>このプロジェクトはReactとGASを連携させるサンプルです。</p><ul><li>項目1</li><li>項目2</li></ul>' 
    },
    { 
        title: '作品B',
        thumbnailbase64: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNhOGQ4YjQiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1zaXplPSIxNiI+VGh1bWJuYWlsIDI8L3RleHQ+PC9zdmc+',
        body: '<h3>作品Bについて</h3><p>これは2つ目のコンテンツの本文です。自由なHTMLを記述できます。</p>' 
    },
    { 
        title: '研究C',
        thumbnailbase64: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNiNGM4ZDgiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1zaXplPSIxNiI+VGh1bWJuYWlsIDM8L3RleHQ+PC9zdmc+',
        body: '<h4>研究Cの概要</h4><p>3つ目のコンテンツの本文です。</p><img src="https://placehold.co/300x150/EEE/333?text=Sample+Image" alt="サンプル画像" style="max-width: 100%; border-radius: 4px;" />' 
    }
];

// --- メインコンテンツコンポーネント ---
// dangerouslySetInnerHTMLを使用してHTML文字列を要素に反映します
function MainContent({ htmlContent }) {
    return (
        <div 
            className="main-container"
            dangerouslySetInnerHTML={{ __html: htmlContent }} 
        />
    );
}

// --- カードコンポーネント ---
function Card({ item, onClick }) {
    return (
        <div className="card" onClick={() => onClick(item)}>
            <img 
                src={item.thumbnailbase64} 
                alt={item.title}
                className="card-thumbnail" 
            />
            <h3 className="card-title">{item.title}</h3>
        </div>
    );
}

// --- モーダルコンポーネント ---
function Modal({ item, onClose }) {
    if (!item) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-button" onClick={onClose}>&times;</button>
                <img src={item.thumbnailbase64} alt={item.title} className="card-thumbnail"/>
                <div dangerouslySetInnerHTML={{ __html: item.body }} />
            </div>
        </div>
    );
}

// --- メインのAppコンポーネント ---
function App() {
    const [mainContent, setMainContent] = useState('');
    const [cardItems, setCardItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    
    // データを取得する処理
    useEffect(() => {
        // Google App ScriptのAPIURLを設定
        const GAS_URL = 'https://script.google.com/macros/s/AKfycbzCYqnvwJzjOP7L0vhh3OpM9-IIPzh7kE3yhRSUanvjV0PxYxtTrfAN0qEGkmduT0EG/exec'
        const GAS_URL_MAIN = GAS_URL + '?type=main';
        const GAS_URL_CARDS = GAS_URL + '?type=cards';
        
        if(DEBUG){
            // 開発デバッグ用のダミーデータ取得処理
            setMainContent(dummyMainData.main.main);
            setCardItems(dummyCardsData);
        } else {
            // 本番用 メインコンテンツの取得
            fetch(GAS_URL_MAIN)
                .then(res => res.json())
                .then(data => {
                    console.log(data)
                    if (data.main) {
                        setMainContent(data.main.main);
                    }
                })
                .catch(error => console.error('Error fetching main content:', error));

            // 本番用 カードコンテンツの取得
            fetch(GAS_URL_CARDS)
                .then(res => res.json())
                .then(data => {
                    console.log(data);
                    if (data.items) {
                        setCardItems(data.items);
                    }
                })
                .catch(error => console.error('Error fetching card items:', error));
        }
    }, []);

    const handleCardClick = (item) => {
        setSelectedItem(item);
    };

    const handleCloseModal = () => {
        setSelectedItem(null);
    };

    return (
        <div>
            {mainContent && <MainContent htmlContent={mainContent} />}
            
            <h2>コンテンツ</h2>
            <div className="card-list-container">
                {cardItems.map((item, index) => (
                    <Card key={index} item={item} onClick={handleCardClick} />
                ))}
            </div>
            
            <Modal item={selectedItem} onClose={handleCloseModal} />
        </div>
    );
}

export default App;

