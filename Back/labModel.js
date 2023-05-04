module.exports = {
    Result: function topologicalSort(adjacencyMatrix) {
        try {
            for (let i = 0; i < adjacencyMatrix.length; i++) {
                for (let j = 0; j < adjacencyMatrix.length; j++) {
                    adjacencyMatrix[i][j]=+adjacencyMatrix[i][j];
                    console.log(adjacencyMatrix[i][j])
                    if(adjacencyMatrix[i][j]!==0&&adjacencyMatrix[i][j]!==1){
                        return "В матрице смежности содержатся только единицы и нули!";
                    }
                    if(adjacencyMatrix[j][j]===1){
                        return "В матрице смежности не должны быть петли!"
                    }
                }

            }
            console.table(adjacencyMatrix)
            function isCyclic(matrix) {
                const n = matrix.length;
                const visited = new Array(n).fill(false);
                const recursionStack = new Array(n).fill(false);

                function dfs(node) {
                    if (!visited[node]) {
                        visited[node] = true;
                        recursionStack[node] = true;

                        for (let neighbor = 0; neighbor < n; neighbor++) {
                            if (matrix[node][neighbor]) {
                                if (!visited[neighbor] && dfs(neighbor)) {
                                    return true;
                                } else if (recursionStack[neighbor]) {
                                    return true;
                                }
                            }
                        }
                    }

                    recursionStack[node] = false;
                    return false;
                }

                for (let i = 0; i < n; i++) {
                    if (dfs(i)) {
                        return true;
                    }
                }

                return false;
            }

            console.log(isCyclic(adjacencyMatrix))
            if (isCyclic(adjacencyMatrix)===true){
                return "Матрица содержит циклы!"
            }
            let levels = [[]];
            let i = 0, j = 0;
            let sum_null = 0
            let stop = false;
            for (i = 0; i < adjacencyMatrix.length; i++) {
                for (j = 0; j < adjacencyMatrix.length; j++) {
                    if (adjacencyMatrix[j][i] == 1) {
                        sum_null = 0;
                        break
                    } else {
                        sum_null++;
                    }
                }
                if (sum_null === adjacencyMatrix.length) {
                    levels[0].push(i + 1);
                    sum_null = 0;
                }
            }
            if (levels[0].length===0){
                return "Граф не является деревом"
            }
            let node = 0
            levels.push([])
            for (i = 0;stop===false; i++) { //цикл в котором перебираем массивы уровней
                for (j = 0; j < levels[i].length; j++) {//цикл в котором перебираем значения в массиве массива уровней
                    for (let k = 0; k < adjacencyMatrix.length; k++) {//цикл в котором ищем связи с другими вершинами
                        if(j>=levels[i].length){
                            j=-1;
                            continue;
                        }
                        let cell = adjacencyMatrix[levels[i][j] - 1][k]
                        if (cell == 1) {
                            levels[i + 1].push(k + 1);
                            node++
                        }
                    }
                }
                if(levels[i+1].length===0){
                    stop=true;
                }
                levels.push([]);
            }
            console.log(levels);
            levels.splice(levels.length - 2, 2);
            levels.reverse();
            for (let k = 0; k < levels.length ; k++) {
                levels[k].reverse();
            }
            function removeDuplicates(arr) {
                let seen = {};
                return arr.map(function(subarr) {
                    return subarr.filter(function(item) {
                        return seen.hasOwnProperty(item) ? false : (seen[item] = true);
                    });
                });
            }
            levels = removeDuplicates(levels);
            levels.reverse();
            for (let k = 0; k < levels.length ; k++) {
                levels[k].reverse();
            }
            levels.forEach(value => {
                value.sort();
            })
            console.log(levels);
            let join_levels=[].concat(...levels);
            console.table(join_levels)
            let resultMatrix = [];
            for(i=0;i<adjacencyMatrix.length;i++){
                resultMatrix.push([]);
                for (j=0;j<adjacencyMatrix.length;j++){
                    resultMatrix[i][j]=0;
                }
            }
            for (i = 0; i < adjacencyMatrix.length; i++) {
                for(j=0;j<adjacencyMatrix.length;j++){
                    if(adjacencyMatrix[join_levels[i]-1][j]==1){
                        let index=join_levels.indexOf(j+1)
                        resultMatrix[i][index]=1
                    }

                }
            }
            console.table(adjacencyMatrix)
            console.table(resultMatrix)
            return{
                resultMatrix:resultMatrix,
                join_levels:join_levels,
                levels:levels,
            }
        }
        catch (e){
            console.log(e)
            return e
        }

    }
}
