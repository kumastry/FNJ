import json

data = None

with open('python\data\edge_word.json') as f:
    data = json.load(f)
num = 0
for i in data:
    if(i['target'] == 0 or i['source'] == 0):
        num += 1
print(len(data))
print(num)