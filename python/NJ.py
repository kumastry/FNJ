from os import O_TEMPORARY
import pandas as pd
import numpy as np
import json

data = []
with open("dist.csv") as f:    
    data = pd.read_csv("dist.csv", header=None).values

n = len(data)
x = n

array= np.arange(1,len(data)+1)
print(array)

edge = []

#2.~7.
while(n >= 3):
    print("######")
    print(n)
    print("######")
    print(data)
    #3.
    Sij = 10**18
    it = -1
    jt = -1
    coni = -1
    conj = -1
    for i in range(len(array)):
        for j in range(len(array)):
            if(i == j):
                continue
            R_i = sum(data[i]) / (n-2)
            R_j = sum(data[j]) / (n-2)
            Dij = data[i][j] 

            if(Sij > Dij - R_i - R_j):
                Sij = Dij - R_i - R_j
                it = i
                jt = j
                coni = array[i]
                conj = array[j]
                
    #4.
    Lix = (data[it][jt] + sum(data[it]) / (n-2) - sum(data[jt]) / (n-2))/2
    Ljx = data[it][jt] - Lix


    array = np.delete(array,[it, jt])
    array = np.append(array, x)
    print(array)
    print(len(array))

    #5.
    dxk = np.empty(0)
    for k in range(len(data)):
        if(k != it and k != jt):
            dxk = np.append(dxk , (data[it][k] + data[jt][k] -data[it][jt])/2)

    print("###")
    print(dxk.shape)
    print("###")

    #6.
    arr = np.arange(n)
    if(jt < it):
        tmp = jt
        jt = it
        it = tmp
    #it < jt    
    r= np.hstack((arr[:it], arr[it+1:jt], arr[jt+1:]))
  
    data = data[r,:]
    data = data[:, r]

    data = np.insert(data,len(data),dxk,axis=1)
    ##print(data.shape)
    data = np.insert(data, len(data) , np.append(dxk, 0), axis = 0)

    #print(data.shape)
    #print(data)

    obj = {}
    obj["source"] = int(x)
    obj["length"] = float(Lix)
    obj["target"] = int(coni)
    edge.append(obj)

    obj = {}
    obj["source"] = int(coni)
    obj["length"] = float(Lix)
    obj["target"] = int(x)
    edge.append(obj)

    obj = {}
    obj["source"] = int(x)
    obj["length"] = float(Ljx)
    obj["target"] = int(conj)
    edge.append(obj)
    
    obj ={}
    obj["source"] = int(conj)
    obj["length"] = float(Ljx)
    obj["target"] = int(x)
    edge.append(obj)


    n-=1
    x+=1

print(edge)

f2 = open('edge.json', 'w')
json.dump(edge, f2)
f2.close