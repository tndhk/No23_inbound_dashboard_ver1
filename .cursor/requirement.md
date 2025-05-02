## 1. 概要・目的  
- **目的**  
  日本の訪日観光に関する主要指標を可視化するMVPダッシュボードを構築する。  
- **主要指標**  
  1. 年別国別入国者数（折れ線グラフ）  
  2. 国別１人当たり平均支出額 (棒グラフ)

## 2. 範囲・機能  

| 機能ID | 機能名称                         | 説明                                                               |
|--------|----------------------------------|--------------------------------------------------------------------|
| F1     | 年別国別入国者数折れ線グラフ       | 過去数年分の国別年別入国者数を折れ線グラフで表示する                       |
| F2     | 国別支出額棒グラフ    | １人当たり平均支出額を国別に比較できるグラフ  |

## 3. データ取得  
- **取得方法**：手動で各種CSVをダウンロードし、所定フォルダに配置  
- **更新頻度**：月１回  
- **配置フォルダ & ファイル**：  
  - `data/arrivals/country_visitors_by_year.csv`  
    - 年別入国者数データ  
  - `data/expenditure/a1_travel_expenditure_by_country.csv`  

## 4. ETL & 集計  
- **スクリプト**：`scripts/ingest.py`（Python）
- **処理フロー**：  
  1. **国別年別入国者数**  
     - `data/arrivals/country_visitors_by_year.csv` を読み込み  
     - `year`（年）でグループ化して合計 → `yearly_arrivals` テーブル／JSON出力  
  2. **国別平均支出額算出**  
     - `data/expenditure/a1_travel_expenditure_by_country.csv` を読み込み  

## 5. バックエンド API  
- **主なエンドポイント**：  
  - `GET /api/yearly-arrivals`  
    ```json
    [
      { "year": 2021, "count": 3200000 },
      { "year": 2022, "count": 4000000 },
      …
    ]
    ```  
  - `GET /api/kpi`  
    ```json
    {
      "avgStayDays": 5.2,
      "avgSpendYen": 135000
    }
    ```  

## 6. フロントエンドダッシュボード  
- **コンポーネント構成**：  
  1. **LineChart** — 年別総入国者数を折れ線グラフで表示  
  2. **Barchart** — 平均滞在日数＆1人当たり平均支出額をカード形式で表示  

## 7. 運用・スケジューリング  
- **データ更新フロー**：  
  1. 毎月、指定のCSVファイル（`country_visitors_by_year.csv`／`a1_travel_expenditure_by_country.csv`）を所定フォルダに配置  
  2. データ更新ボタンを押下して `scripts/ingest.py` を実行  
  3. 処理完了後、自動的にAPI・フロントエンドが最新データで更新  
