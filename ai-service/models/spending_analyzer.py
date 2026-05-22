import numpy as np
import pandas as pd
from datetime import datetime, timedelta
from collections import defaultdict

class SpendingAnalyzer:
    def __init__(self):
        self.categories = ['food','rent','utilities','transport','groceries','internet','medical','other']

    def analyze(self, expenses: list) -> dict:
        if not expenses:
            return {'insights': ['No data available.'], 'recommendations': []}

        df = pd.DataFrame(expenses)
        df['amount'] = pd.to_numeric(df['amount'], errors='coerce').fillna(0)
        df['date'] = pd.to_datetime(df['date'], errors='coerce')

        total = df['amount'].sum()
        avg_daily = df['amount'].mean()

        by_cat = df.groupby('category')['amount'].sum().sort_values(ascending=False)
        top_cat = by_cat.index[0] if len(by_cat) > 0 else 'other'
        top_pct = (by_cat.iloc[0] / total * 100) if total > 0 else 0

        insights = []
        recommendations = []

        insights.append(f"Total spending analyzed: Rs.{total:,.0f} across {len(df)} transactions.")

        if top_pct > 40:
            insights.append(f"⚠️ {top_cat.capitalize()} accounts for {top_pct:.0f}% of your spending — consider budgeting it.")
        else:
            insights.append(f"Your top category is {top_cat.capitalize()} at {top_pct:.0f}% of total spending.")

        # Weekly trend
        if len(df) >= 7:
            df_sorted = df.sort_values('date')
            recent = df_sorted.tail(7)['amount'].sum()
            older = df_sorted.head(7)['amount'].sum()
            if recent > older * 1.2:
                insights.append(f"📈 Your spending increased by {((recent/older - 1)*100):.0f}% in the last 7 days vs the previous period.")
            elif recent < older * 0.8:
                insights.append(f"📉 Great job! Spending decreased by {((1 - recent/older)*100):.0f}% recently.")

        # Recommendations
        if 'food' in by_cat.index and by_cat.get('food', 0) / total > 0.35:
            recommendations.append("🍕 Food costs are high. Try meal prepping or cooking at home to save 30-40%.")
        if 'transport' in by_cat.index and by_cat.get('transport', 0) / total > 0.2:
            recommendations.append("🚌 Consider carpooling or monthly transit passes to reduce transport costs.")
        recommendations.append("💰 Set category budgets: Food (35%), Rent (30%), Transport (15%), Misc (20%).")
        recommendations.append("📱 Log expenses daily for better tracking accuracy.")

        return {
            'insights': insights,
            'recommendations': recommendations,
            'summary': {
                'total': float(total),
                'avg_per_transaction': float(avg_daily),
                'top_category': top_cat,
                'transaction_count': len(df)
            }
        }

    def predict_next_month(self, expenses: list) -> dict:
        if not expenses or len(expenses) < 10:
            return {'predicted_amount': 0, 'confidence': 'low', 'message': 'Need more data for prediction.'}

        df = pd.DataFrame(expenses)
        df['amount'] = pd.to_numeric(df['amount'], errors='coerce').fillna(0)

        avg = df['amount'].mean()
        std = df['amount'].std()
        n = len(df)

        predicted = float(avg * 30)
        confidence = 'high' if n > 30 else 'medium' if n > 15 else 'low'

        return {
            'predicted_amount': round(predicted, 2),
            'confidence': confidence,
            'message': f"Based on {n} transactions, predicted next month: Rs.{predicted:,.0f}"
        }
