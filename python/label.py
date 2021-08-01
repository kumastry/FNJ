import pandas as pd
import numpy as np
import json

data = []
label = []

with open("public\data\wordvectors.json", encoding="utf-8") as f:    
    data = json.load(f)

for i in range(len(data)):
    obj = {}
    obj['word'] = data[i]['word']
    obj['id'] = i+1
    label.append(obj)
print(label)

f2 = open('public\data\label.json', 'w')
json.dump(label, f2)
f2.close