## タスク管理

### プロジェクト初期設定
- [x] ⚪ プロジェクト構造のセットアップ (`src/app`, `src/components`, `src/lib`, `src/dal`, `scripts`, `data` など)
- [x] ⚪ データベース設定 (Prisma, SQLite)
- [x] ⚪ Prisma スキーマ定義 (年別入国者数、国別支出額モデル)
- [x] ⚪ Prisma マイグレーション実行
- [x] ⚪ グラフ描画ライブラリの選定・導入 (例: Recharts, Nivo)

### Docker & Python 設定
- [x] ⚪ scripts/requirements.txt 作成 (pandas)
- [x] ⚪ Dockerfile 作成 (Python環境)
- [x] ⚪ docker-compose.yml 作成 (ingest-scriptサービス)
- [x] ⚪ processed_data ディレクトリ作成

### データ処理バックエンド
- [x] 🟢 `scripts/ingest.py` 作成: CSV読み込みと集計ロジック (基本構造完了、詳細実装待ち)
- [x] 🟢 `scripts/ingest.py` 実装: 集計結果をJSONファイルに出力
- [x] 🟢 データアクセスレイヤー (`src/dal/`) 実装: DBから集計データを取得する関数

### フロントエンド開発
- [x] 🟡 `LineChart` コンポーネント作成 (`src/components/features/dashboard/`)
- [x] 🟡 `Barchart` コンポーネント作成 (`src/components/features/dashboard/`)
- [x] 🟡 ダッシュボードページ作成 (`src/app/(dashboard)/page.tsx`): DAL関数呼び出しとグラフ表示
- [x] 🟢 データ更新ボタン用コンポーネント作成 (`src/components/features/dashboard/`)
- [x] 🟡 データ更新用 Server Action 作成: `ingest.py` をDocker経由で実行し、出力JSONを読み込みDB更新

### 統合とテスト
- [x] 🟢 `ingest.py` 実行環境の設定 (Docker経由での実行テスト)
- [ ] 🟢 全体の動作確認とUI調整
- [ ] 🟢 レスポンシブデザイン対応

### その他
- [x] ⚪ サンプルCSVファイルの配置 (`data/arrivals/`, `data/expenditure/`) 