import pandas as pd
import numpy as np
from  scipy.spatial import distance

data = []
with open("data.csv") as f:    
    data = pd.read_csv("data.csv").values
print(data)
print(type(data))

dist = distance.cdist(data, data, metric = 'euclidean')
np.savetxt('dist.csv', dist, delimiter = ',')
print(dist)