# 外国株式 損益シミュレーター（PWA）

スマホのホーム画面に追加して、アプリのように使える PWA 版です。

## ファイル構成
```
index.html               … 本体（3Dシミュレーター）
manifest.webmanifest     … アプリ情報（名前・アイコン・表示モード）
sw.js                    … サービスワーカー（オフライン動作用）
icons/
  icon-192.png
  icon-512.png
  icon-512-maskable.png  … Android用（周囲が切られても中央が残る）
  apple-touch-icon-180.png … iOS用
```
※ この構成（フォルダ階層と相対パス）を崩さずに置いてください。

## 動かすには「HTTPSのホスティング」が必要
サービスワーカーは `https://` か `localhost` でしか動きません。`file://`（ダブルクリックで直接開く）ではPWA機能（インストール・オフライン）は無効になります。※ 3D表示自体は `file://` でも動きます。

### いちばん簡単な公開方法：GitHub Pages
1. GitHubで新しいリポジトリを作る（例 `gaikabu-sim`）。
2. このフォルダの中身（index.html・manifest・sw.js・iconsフォルダ）をそのままアップロード。
3. リポジトリの **Settings → Pages** で、Branch を `main` / フォルダ `/ (root)` にして保存。
4. 数分後 `https://<ユーザー名>.github.io/gaikabu-sim/` で開ける。

（前に使っていた Firebase Hosting でもOK。`firebase deploy` で公開すれば同様に動きます。）

### ローカルで試すだけなら
```
cd このフォルダ
python3 -m http.server 8000
```
→ スマホと同じWi-Fiで `http://<PCのIP>:8000/` を開く。※localhost以外のHTTPだとSWが無効なブラウザもあるため、インストール確認は本番のHTTPS環境で。

## スマホでインストール
- **iPhone (Safari)**: 共有ボタン → 「ホーム画面に追加」。
- **Android (Chrome)**: メニュー → 「アプリをインストール」または「ホーム画面に追加」。

インストールすると全画面のアプリとして起動し、2回目以降はオフラインでも開けます（初回にオンラインで一度読み込む必要あり。three.js とフォントも初回にキャッシュされます）。

## 更新のしかた
中身を変更したら、`sw.js` の先頭 `const CACHE = 'gaikabu-sim-v1'` の `v1` を `v2`… と上げてください。これで古いキャッシュが破棄され、新しい版が反映されます。

## 保存データについて
シナリオ保存は端末内の localStorage に保存されます。同じURL・同じブラウザなら次回も残ります（端末やブラウザをまたぐ共有はされません）。
