import pandas as pd
import os
import json

# Define input and output paths based on docker-compose volume mounts
# Assumes the script is run from the /app directory inside the container
INPUT_DIR = './data'
OUTPUT_DIR = './processed_data'
ARRIVALS_CSV = os.path.join(INPUT_DIR, 'arrivals', 'country_visitors_by_year.csv')
EXPENDITURE_CSV = os.path.join(INPUT_DIR, 'expenditure', 'a1_travel_expenditure_by_country.csv')

YEARLY_ARRIVALS_JSON = os.path.join(OUTPUT_DIR, 'yearly_arrivals.json')
COUNTRY_EXPENDITURE_JSON = os.path.join(OUTPUT_DIR, 'country_expenditure.json')

def process_arrivals():
    """Reads arrivals CSV, calculates yearly total, and saves to JSON."""
    print(f"Processing arrivals data from: {ARRIVALS_CSV}")
    try:
        # Read the CSV, skipping the header row if it's descriptive (like row 2 in the sample)
        # Assuming the actual data starts from the first row or skipping non-data rows if necessary
        df = pd.read_csv(ARRIVALS_CSV)

        # Filter for rows where 'Country' is '総数' (Total)
        yearly_totals_df = df[df['Country'] == '総数'].copy()

        # Rename columns to match the desired output
        yearly_totals_df = yearly_totals_df.rename(columns={
            'Year': 'year',
            'Total Visitors': 'count'
        })

        # Select only the necessary columns
        yearly_totals_df = yearly_totals_df[['year', 'count']]

        # Convert to the desired list of dictionaries format
        yearly_totals_data = yearly_totals_df.to_dict(orient='records')

        # Ensure output directory exists
        os.makedirs(OUTPUT_DIR, exist_ok=True)

        # Save to JSON
        with open(YEARLY_ARRIVALS_JSON, 'w', encoding='utf-8') as f:
            json.dump(yearly_totals_data, f, indent=2, ensure_ascii=False)

        print(f"Successfully processed arrivals data. Output: {YEARLY_ARRIVALS_JSON}")

    except FileNotFoundError:
        print(f"Error: Input file not found at {ARRIVALS_CSV}")
    except Exception as e:
        print(f"Error processing arrivals data: {e}")

def process_expenditure():
    """Reads expenditure CSV, cleans data, and saves to JSON."""
    print(f"Processing expenditure data from: {EXPENDITURE_CSV}")
    try:
        # Read the CSV, skipping the descriptive header row (row 2)
        df = pd.read_csv(EXPENDITURE_CSV, skiprows=[1])

        # Rename columns
        df = df.rename(columns={
            'Country': 'country',
            '消費単価': 'averageExpenditure'
        })

        # Select relevant columns
        df = df[['country', 'averageExpenditure']]

        # Remove summary rows like 'その他', '全国籍･地域'
        df = df[~df['country'].isin(['その他', '全国籍･地域'])]

        # Remove rows with NaN in critical columns (like country)
        df = df.dropna(subset=['country', 'averageExpenditure'])

        # Convert to the desired list of dictionaries format
        expenditure_data = df.to_dict(orient='records')

        # Ensure output directory exists
        os.makedirs(OUTPUT_DIR, exist_ok=True)

        # Save to JSON
        with open(COUNTRY_EXPENDITURE_JSON, 'w', encoding='utf-8') as f:
            json.dump(expenditure_data, f, indent=2, ensure_ascii=False)

        print(f"Successfully processed expenditure data. Output: {COUNTRY_EXPENDITURE_JSON}")

    except FileNotFoundError:
        print(f"Error: Input file not found at {EXPENDITURE_CSV}")
    except Exception as e:
        print(f"Error processing expenditure data: {e}")

if __name__ == "__main__":
    print("Starting data ingestion process...")
    process_arrivals()
    process_expenditure()
    print("Data ingestion process finished.") 