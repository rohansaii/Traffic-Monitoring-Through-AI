import pandas as pd
from sklearn.tree import DecisionTreeClassifier
from sklearn.preprocessing import LabelEncoder
import joblib

# Load dataset
data = pd.read_csv("traffic_data.csv")

# Encode categorical features
le_time = LabelEncoder()
le_day = LabelEncoder()
data['time_of_day'] = le_time.fit_transform(data['time_of_day'])
data['day_of_week'] = le_day.fit_transform(data['day_of_week'])

# Features & target
X = data[['time_of_day', 'day_of_week', 'vehicle_count']]
y = data['density']

# Train model
model = DecisionTreeClassifier(max_depth=4, random_state=42)
model.fit(X, y)

# Save model & encoders
joblib.dump(model, "density_model.pkl")
joblib.dump(le_time, "time_encoder.pkl")
joblib.dump(le_day, "day_encoder.pkl")

print(" Model trained and saved.")
