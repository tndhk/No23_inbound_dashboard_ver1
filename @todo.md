## タスク管理

### プロジェクト初期設定
- [x] ⚪ プロジェクト構造のセットアップ (`src/app`, `src/components`, `src/lib`, `src/dal`, `scripts`, `data` など)
- [x] ⚪ データベース設定 (Prisma, SQLite -> PostgreSQL)
- [x] ⚪ Prisma スキーマ定義 (年別総入国者数、国別支出額モデル)
- [x] ⚪ Prisma スキーマ定義追加: CountryArrivals モデル
- [x] ⚪ Prisma マイグレーション実行
- [x] ⚪ グラフ描画ライブラリの選定・導入 (例: Recharts, Nivo)

### データ処理 & 投入 (シーディング)
- [x] 🟢 `papaparse` 導入: CSV解析ライブラリ
- [x] 🟢 `ts-node` 導入: Seeding スクリプト実行用
- [x] 🟢 `package.json` 設定: `prisma.seed` スクリプト追加
- [x] 🟢 `prisma/seed.ts` 実装: CSV読込とDBへのデータ投入 (CountryArrivals 含む)
- [x] 🟢 不要ファイル削除 (旧Action, Button, Docker/Python関連)
- [x] 🟢 データアクセスレイヤー (`src/dal/`) 実装: DBから集計データを取得する関数
- [x] 🟢 データアクセスレイヤー (`src/dal/`) 追加: getCountryArrivalsByYear 関数

### フロントエンド開発
- [x] 🟡 `LineChart` コンポーネント作成 (`src/components/features/dashboard/`)
- [x] 🟡 `Barchart` コンポーネント作成 (`src/components/features/dashboard/`)
- [x] 🟡 `CountryArrivalsBarChart` コンポーネント作成
- [x] 🟡 ダッシュボードページ作成/更新 (`src/app/(dashboard)/page.tsx`): 全グラフ表示、レイアウト調整

### 統合とテスト
- [ ] 🟢 ローカルで `prisma db seed` を実行し、DBにデータ投入 (再実行推奨)
- [ ] 🟢 全体の動作確認とUI調整 (表示のみ)
- [ ] 🟢 レスポンシブデザイン対応

### デプロイ準備
- [x] ⚪ Vercel 設定確認 (ビルドコマンド: `prisma generate && prisma migrate deploy && next build`)

### その他
- [x] ⚪ サンプルCSVファイルの配置 (`data/arrivals/`, `data/expenditure/`) 