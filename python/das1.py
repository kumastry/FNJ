import pandas as pd

df = pd.read_csv('original_data.csv', header=None)
df = df.drop(df.columns[[0]], axis=1)
print(df)

df.to_csv('data.csv', header = False,index = False)