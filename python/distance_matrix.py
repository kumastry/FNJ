import pandas as pd
import numpy as np
from  scipy.spatial import distance

df = pd.read_csv('python\data\est.csv', header=None)
df = df.drop(df.columns[[0]], axis=1)
df.iloc[:,[12]] = df.iloc[:,[12]] / 10
data = df.values

dist = distance.cdist(data, data, metric = 'euclid')
np.savetxt('python\data\est_dist.csv', dist, delimiter = ',')
print(dist)