import pandas as pd
import numpy as np
from  scipy.spatial import distance
import json 


word = None 
with open("./wordvectors.json", encoding="utf-8") as f:
    word = json.load(f)
print(len(word))
print(len(word[0]['vector']))

data = []
for i in word:
    data.append(i['vector'])

dist = distance.cdist(data, data, metric = 'euclid')
np.savetxt('word_dist.csv', dist, delimiter = ',')
print(dist)