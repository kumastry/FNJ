from os import O_TEMPORARY
import pandas as pd
import numpy as np

data = []
with open("dist.csv") as f:    
    data = pd.read_csv("dist.csv", header=None).values

n = len(data)
while(n >= 3):
    
    Sij = 10**18
    it = -1
    jt = -1
    for i in range(len(data)):
        for j in range(len(data[i])):
            if(i == j):
                continue
            R_i = sum(data[i]) / (n-2)
            R_j = sum(data[j]) / (n-2)
            Dij = data[i][j] 

            if(Sij > Dij - R_i - R_j):
                Sij = Dij - R_i - R_j
                it = i
                jt = j
                

    Lix = (data[it][jt] + sum(data[it]) / (n-2) - sum(data[jt]) / (n-2))/2
    Ljx = data[it][jt] - Lix

    arr = np.arange(n)
    if(jt < it):
        tmp = jt
        jt = it
        it = tmp
    #it < jt    
    r= np.hstack((arr[:it], arr[it+1:jt], arr[jt+1:]))
    print(r)
    data = data[r,:]
    data = data[:, r]

    rowx = np.zeros((n-1))
    print(rowx.shape)
    print(data.shape)
    n-=1