## タスク管理

### プロジェクト初期設定
- [x] ⚪ プロジェクト構造のセットアップ (`src/app`, `src/components`, `src/lib`, `src/dal`, `scripts`, `data` など)
- [x] ⚪ データベース設定 (Prisma, SQLite)
- [x] ⚪ Prisma スキーマ定義 (年別入国者数、国別支出額モデル)
- [x] ⚪ Prisma マイグレーション実行
- [x] ⚪ グラフ描画ライブラリの選定・導入 (例: Recharts, Nivo)

### データ処理バックエンド (リファクタリング)
- [x] 🟢 `papaparse` 導入: CSV解析ライブラリ
- [x] 🟢 Server Action (`actions.ts`) リファクタリング: JS/TSでCSV処理実装
- [x] 🟢 不要ファイル削除 (Docker/Python関連)
- [x] 🟢 データアクセスレイヤー (`src/dal/`) 実装: DBから集計データを取得する関数

### フロントエンド開発
- [x] 🟡 `LineChart` コンポーネント作成 (`src/components/features/dashboard/`)
- [x] 🟡 `Barchart` コンポーネント作成 (`src/components/features/dashboard/`)
- [x] 🟡 ダッシュボードページ作成 (`src/app/(dashboard)/page.tsx`): DAL関数呼び出しとグラフ表示
- [x] 🟢 データ更新ボタン用コンポーネント作成 (`src/components/features/dashboard/`)
- [x] 🟡 データ更新用 Server Action 作成: JS/TSでCSV処理、DB更新、キャッシュ再検証

### 統合とテスト
- [ ] 🟢 全体の動作確認とUI調整
- [ ] 🟢 レスポンシブデザイン対応

### デプロイ準備
- [x] ⚪ Vercel 設定確認 (ビルドコマンド、環境変数など)

### その他
- [x] ⚪ サンプルCSVファイルの配置 (`data/arrivals/`, `data/expenditure/`) 