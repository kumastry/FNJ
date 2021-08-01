import pandas as pd
import numpy as np
import json

data = []
label = []
with open("python\data\est_dist.csv") as f:    
    data = pd.read_csv("python\data\est_dist.csv", header=None).values
    #label = pd.read_csv("wine_data.csv", header = None)
n = len(data)
x = n

array= np.arange(1,len(data)+1)
print(array)

edge = []

data_sum = []
for i in range(len(data)):
    data_sum.append(sum(data[i]))

#2.~7.
while(n >= 3):
    #print("######")
    print(n)
    #print("######")
    #print(data)

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
            R_i = data_sum[i] / (n-2)
            R_j = data_sum[j] / (n-2)
            Dij = data[i][j] 

            if(Sij > Dij - R_i - R_j):
                Sij = Dij - R_i - R_j
                it = i
                jt = j
                coni = array[i]
                conj = array[j]
                
    #4.
    Lix = (data[it][jt] + (data_sum[it] / (n-2)) - (data_sum[jt] / (n-2)))/2
    Ljx = data[it][jt] - Lix

    assert(Lix >= 0)
    assert(Ljx >= 0)
    #5.
    sumdxk = 0
    dxk = np.empty(0)
    for k in range(len(data)):
        if(k != it and k != jt):
            dxk = np.append(dxk , (data[it][k] + data[jt][k] -data[it][jt])/2)
            sumdxk += (data[it][k] + data[jt][k] -data[it][jt])/2


    #print("###")
    #print(dxk.shape)
    #print("###")
    array = np.delete(array,[it, jt])
    array = np.append(array, x)


    #6.
    arr = np.arange(n)
    if(jt < it):
        tmp = jt
        jt = it
        it = tmp
    #it < jt    

    jdx = 0
    #print(len(data_sum))
    #print(len(dxk))
    for idx in range(len(data_sum)):
        data_sum[idx] -= data[idx][it]
        data_sum[idx] -= data[idx][jt]

    jdx = 0
    for idx in range(len(data_sum)):
        if(idx != it and idx != jt):
            data_sum[idx] += dxk[jdx]
            #print(idx)
            jdx += 1
    del data_sum[jt]
    del data_sum[it]
    data_sum.append(sumdxk)

 
    r= np.hstack((arr[:it], arr[it+1:jt], arr[jt+1:]))
    data = data[r,:]
    data = data[:, r]
    data = np.insert(data,len(data),dxk,axis=1)
    data = np.insert(data, len(data) , np.append(dxk, 0), axis = 0)

    assert(len(dxk)+1 == len(data))
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
    print("u:{}, v:{}, len:{}".format(int(coni), int(x), float(Lix)))
    print("u:{}, v:{}, len:{}".format(int(conj), int(x), float(Ljx)))
    
    n-=1
    x+=1

print(edge)

f2 = open('python\data\est.json', 'w')
json.dump(edge, f2)
f2.close