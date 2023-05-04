<template>
  <main class="adjacency-incident-L_incident">
    <div class="content">
      <h2 style="color: white">Лабораторная работа №2</h2>
      <h3>Введите размер матрицы смежности</h3> <br>
      <select v-model="sizeMatrix">
        <option v-for="val in 10">{{ val }}</option>
      </select>
      <button class="result" @click="Result">Расчитать</button>
      <div class="matrixs">
        <div v-if="sizeMatrix>0" class="input">
          <table>
            <tr>
              <th></th>
              <th v-for="i in +sizeMatrix">{{ i }}</th>
            </tr>
            <tr v-for="j in +sizeMatrix">
              <td style="font-weight: bold; color: white">{{ j }}</td>
              <td v-for="i in +sizeMatrix">
                <input class="cell" type="text" v-model="matrix[+j-1][+i-1]">
              </td>
            </tr>
          </table>
          <br>
          <p class="error" v-if="error">{{ error }}</p>
        </div>
        <div v-if="isMatrix" class="levels">
          <h3>Иерархические уровни</h3>
          <div  class="level" v-for="(level,index) in result.levels">
            <p>Уровень {{index+1}} :</p>
            <span v-for="(node_level) in level"> {{node_level}}</span>
          </div>
        </div>
        <div v-if="isMatrix" class="matrix">
          <h3>Перестроенная матрица смежности </h3>
          <div class="table">
            <table>

              <tr>
                <th></th>
                <th v-for="i in  new_matrix_adjacencies[0].length">{{ i }} ({{result.join_levels[i-1]}})</th>
              </tr>
              <tr v-for="j in new_matrix_adjacencies.length">
                <td style="font-weight: bold; color: white">{{ j }} ({{result.join_levels[j-1]}})</td>
                <td style="background-color: white" v-for="i in  new_matrix_adjacencies[0].length">
                  {{ new_matrix_adjacencies[j - 1][i - 1] }}
                </td>
              </tr>
            </table>
          </div>

        </div>
        <div v-if="isMatrix" class="left-incident">
          <h3>Список множества левых инциденций</h3>
          <ul>
            <li v-for="[key, value] of Object.entries(left_matrix_incident)">{{ `G(${key})` }}<sup>-</sup> =
              {{ `(${value})` }}
            </li>
          </ul>
        </div>

      </div>

    </div>
  </main>
</template>

<script>
export default {
  data() {
    return {
      result: null,
      isMatrix: false,
      sizeMatrix: null,
      matrix: [],
      new_matrix_adjacencies: [],
      left_matrix_incident: {},
      error: null,
    }
  },
  watch: {
    sizeMatrix() {
      if (this.sizeMatrix !== null) {
        this.error = null
      }
      this.isMatrix = false
      this.matrix = [];
      for (let i = 0; i < this.sizeMatrix; i++) {
        this.matrix.push([])
        for (let j = 0; j < this.sizeMatrix; j++) {
          this.matrix[i].push(0)
        }

      }
      console.log(this.matrix)
    },
  },
  methods: {
    async Result() {
      this.error=null;
      this.left_matrix_incident={};
      this.result = await this.$axios.$post('http://localhost:3001/', {
        matrix: this.matrix
      });
      if (typeof this.result!=="object"){
        this.error=this.result;
        this.left_matrix_incident={}
        this.isMatrix=false
        return;
      }
      console.log(this.result);
      this.new_matrix_adjacencies=this.result.resultMatrix;
      this.isMatrix=true;
      for (let i = 0; i < +this.sizeMatrix; i++) {
            this.left_matrix_incident[""+(i + 1)] = []
          }
      for (let i=0;i<this.sizeMatrix;i++){
        for (let j=0;j<this.sizeMatrix;j++){
          console.log(this.new_matrix_adjacencies[i][j])
          if (this.new_matrix_adjacencies[i][j] == '1') {
            if (this.new_matrix_adjacencies[i][j] == '1' && i == j) {
              this.left_matrix_incident["" + (j + 1)].push(i + 1)
            } else {
              this.left_matrix_incident["" + (j + 1)].push(i + 1)
            }
          }
        }
      }
      //   this.matrix_incident.length = 0;
      //   let arc = 0;
      //   console.log(this.matrix_incident)
      //   this.matrix.forEach(r => {
      //     r.forEach(c => {
      //       if (c === '1') {
      //         arc++
      //       }
      //     })
      //   })
      //   for (let i = 0; i < +this.sizeMatrix; i++) {
      //     this.left_matrix_incident[""+(i + 1)] = []
      //     this.matrix_incident.push([])
      //     for (let j = 0; j < arc; j++) {
      //       this.matrix_incident[i].push(0)
      //     }
      //
      //   }
      //   console.log(this.left_matrix_incident)
      //   console.log(this.matrix_incident)
      //   let k = 0
      //   for (let i = 0; i < this.sizeMatrix; i++) {
      //     for (let j = 0; j < this.sizeMatrix; j++) {
      //       if (this.matrix[i][j] === null){
      //         this.error="Не все поля заполнены!"
      //         this.isMatrix=false
      //         this.left_matrix_incident={}
      //         this.matrix_incident=[]
      //         return
      //       }
      //       if (this.matrix[i][j] !== "0" && this.matrix[i][j] !== "1"){
      //         console.log(this.matrix[i][j], typeof this.matrix[i][j])
      //         this.error="В матрице смежности содержатся только единицы и нули!"
      //         this.left_matrix_incident={}
      //         this.isMatrix=false
      //         this.matrix_incident=[]
      //         return
      //       }
      //       if (this.matrix[i][j] === '1') {
      //         if (this.matrix[i][j] === '1' && i == j) {
      //           this.left_matrix_incident[""+(j + 1)].push(i + 1)
      //           this.matrix_incident[j][k] = 2;
      //           k++
      //         } else {
      //           this.left_matrix_incident[""+(j + 1)].push(i + 1)
      //           this.matrix_incident[i][k] = 1;
      //           this.matrix_incident[j][k] = -1;
      //           k++
      //         }
      //       }
      //
      //
      //     }
      //   }
      //   this.error=null
      //   console.log(this.left_matrix_incident)
      //   this.isMatrix = true
      // }
      // catch (e){
      //   console.log(e)
      // }
      //
    },
  },

  mounted() {
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  font-family: "Helvetica Neue", serif;
}

body {
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-image: url(static/background.png);

}

.adjacency-incident-L_incident {
  max-width: 80vw;
  width: 1400px;
  min-width: 600px;
  max-height: 98vh;
  overflow-y: scroll;
  margin: 1vw;

  background: rgba(237, 228, 228, 0.40);
  border: 2px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(12.5px);
  /* Note: backdrop-filter has minimal browser support */

  border-radius: 26px;

}

.content {
  padding: 3vw;
  max-width: 80%;
}

.matrixs {
  display: flex;
  flex-wrap: wrap;
}

.row > p {
  display: inline;
  margin-left: 1.8vw;
}

.row > p:nth-child(n+10) {
  margin-left: 1.4vw;
}

p {
  font-size: 1vw;
  color: white;
}

h3, .result, th {
  color: white;
}

td > input, td {
  width: 3vw;
  height: 3vw;
  border: none;
}


tr, input {
  text-align: center;

}

.left-incident > h3, .levels>h3 {
  margin-top: -1.5vw;
  margin-bottom: 1.5vw;
}
.levels{
  margin: 0 2vw;
}
span,.levels p{
  color: white;
}
.levels p{
  font-weight: bold;
  margin-bottom: 1vw;
}
.left-incident > ul > li {
  color: white;
  font-family: "Helvetica Neue", serif;
  list-style-type: none;
  font-weight: bold;
}

.error {
  color: red;
  font-size: 1vw;
  font-weight: bold;
}

.result {
  width: 6vw;
  height: 2vw;
  border-radius: 0.2vw;
  background-color: #00b600;
  font-weight: bold;
  border: none;
  margin-bottom: 2vw;
  font-size: 1vw;
}

.result:active {
  background-color: #00a000;
}

select {
  width: 6vw;
  height: 2vw;
}

.matrix {
  display: inline-block;
  max-width: 100%;
  margin-right: 3vw;
}

.matrix > .table {
  max-width: 90%;
  overflow-x: scroll;
}

.input {
  margin-right: 5vw;
  margin-bottom: 3vw;
}

.matrix > h3 {
  margin-top: -1.5vw;
}
</style>
