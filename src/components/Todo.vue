<template>
  <div class="todo">
    <h1>Strength Comparator</h1>
    <hr>
    <h2>...have you ever...</h2>
	<p>Gone to the gym?</p>
	<p>Lifted heavy weights?</p>
	<p>Wondered how you compare to your peers?</p>
    <h2>Wonder no longer!</h2>
    <h3>Just enter everybody's names, bodyweights, and one-rep maxes for the following lifts.</h3>
    <h3>The table below will show you how you all rank!</h3>
    <form v-on:submit.prevent="addItem">
      <p>Name</p>
      <input type="text" v-model="person">
      <p>Bodyweight</p>
      <input type="number" v-model="weight">
      <p>Bench</p>
      <input type="number" v-model="bench">
      <p>Squat</p>
      <input type="number" v-model="squat">
      <p>Deadlift</p>
      <input type="number" v-model="deadlift">
      <br><br>
      <button type="submit">Add</button>
    </form>
    <div class="controls">
      <button v-on:click="showAll()">Show All</button>
      <button v-on:click="showActive()">Show Active</button>
      <button v-on:click="showHidden()">Show Hidden</button>
      <button v-on:click="deleteHidden()">Delete Hidden</button>
      <!--<p>Select a person and a lift with an edited value to update!</p>
      <form v-on:submit.prevent="updateItem(item)">
	<select v-model="entry" v-for="item in items">
	  <option value=item>{{item.person}}</option>
	</select>
	<select v-model="lift">
	  <option value="bench">Bench</option>
	  <option value="squat">Squat</option>
	  <option value="deadlift">Deadlift</option>
	</select>
	<input type="number" v-model="number">
	<button type="submit">Update</button>
      </form>-->
    </div>
    <br>
    <table>
      <tr>
	<th>Name</th>
	<th>Bodyweight</th>
	<th>Bench</th>
	<th>Squat</th>
	<th>Deadlift</th>
	<th>Delete</th>
	<th>Hide</th>
      </tr>
      <tr v-for="item in filteredItems" draggable="true" v-on:dragstart="dragItem(item)" v-on:dragover.prevent v-on:drop="dropItem(item)">
	<td>{{ item.person }}</td>
	<td>{{ item.weight }}</td>
	<td>{{ item.benchR }}</td>
	<td>{{ item.squatR }}</td>
	<td>{{ item.deadliftR }}</td>
	<td><button v-on:click="deleteItem(item)" class="delete">X</button></td>
	<td><button v-on:click="hideItem(item)" class="hidden">O</button></td>
      </tr>
    </table>
    <div class="footer">
      <a href="https://github.com/mgwillia/Creative4">My Github</a>
      <a href="https://strengthlevel.com/">Strength Standards</a>
    </div>
  </div>
</template>

<script>
 export default {
   name: 'Todo',
   data () {
     return {
       person: '',
       show: 'active',
       weight: 0,
       bench: 0,
       squat: 0,
       deadlift: 0,
       benchR: '',
       squatR: '',
       deadliftR: '',
       hidden: false,
       drag: {},
     }
   },
   computed: {
     items: function() {
       return this.$store.getters.items;
     },
     activeItems: function() {
       return this.items.filter(function(item) {
	 return !item.hidden;
       });
     },
     filteredItems: function() {
       if (this.show === 'active')
	 return this.items.filter(function(item) {
	   return !item.hidden;
	 });
if (this.show === 'hidden')
	 return this.items.filter(function(item) {
	   return item.hidden;
	 });
       return this.items;
     },
   },
   created: function() {
     this.getItems();
   },
   methods: {
     setR: function(curLift, beginner, novice, intermediate, advanced, elite) {
       if (curLift < beginner) {
	 return 'terrible';
       }
       else if (curLift < novice) {
	 return 'Beginner';
       }
       else if (curLift < intermediate) {
         return 'Novice';
       }
       else if (curLift < advanced) {
	 return 'Intermediate';
       }
       else if (curLift < elite) {
         return 'Advanced';
       }
       else {
	 return 'Elite';
       }
     },
     setBenchR: function(curWeight, curBench) {
       let beginner = curWeight * 0.6;
       let novice = curWeight * 0.9;
       let intermediate = curWeight * 1.2;
       let advanced = curWeight * 1.5;
       let elite = curWeight * 1.8;
       return this.setR(curBench, beginner, novice, intermediate, advanced, elite);
     },
     setDeadliftR: function(curWeight, curBench) {
       let beginner = curWeight * 1.1;
       let novice = curWeight * 1.45;
       let intermediate = curWeight * 1.85;
       let advanced = curWeight * 2.3;
       let elite = curWeight * 2.8;
       return this.setR(curBench, beginner, novice, intermediate, advanced, elite);
     },
     setSquatR: function(curWeight, curBench) {
       let beginner = curWeight * 0.92;
       let novice = curWeight * 1.23;
       let intermediate = curWeight * 1.6;
       let advanced = curWeight * 2.02;
       let elite = curWeight * 2.47;
       return this.setR(curBench, beginner, novice, intermediate, advanced, elite);
     },
     getItems: function() {
       this.$store.dispatch('getItems');
     },
     addItem: function() {
	let benchR = this.setBenchR(this.weight, this.bench);
	let squatR = this.setSquatR(this.weight, this.squat);
	let deadliftR = this.setDeadliftR(this.weight, this.deadlift);
	 this.$store.dispatch('addItem',{
	 person: this.person,
	 weight: this.weight,
	 bench: this.bench,
	 benchR: benchR,
	 squat: this.squat,
	 squatR: squatR,
	 deadlift: this.deadlift,
	 deadliftR: deadliftR,
	 hidden: false,
       });
     },
     /*updateItem: function(item) {
	console.log(item);
	if (this.lift === 'bench') {
	  item.bench = this.number;
	}
	else if (this.lift === 'squat') {
	  item.squat = this.number;
	}
	else if (this.lift === 'deadlift') {
	  item.deadlift = this.number;
	}
	this.$store.dispatch('updateItem',{
	  id: item.id,
	  person: item.person,
	  weight: item.weight,
	  bench: item.bench,
	  squat: item.squat,
	  deadlift: item.deadlift,
	  hidden: item.hidden,
	  orderChange: false,
	});
     },*/
     hideItem: function(item) {
	item.hidden = !item.hidden;
	 this.$store.dispatch('updateItem',{
	 id: item.id,
	 person: item.person,
	 weight: item.weight,
	 bench: item.bench,
	 squat: item.squat,
	 deadlift: item.deadlift,
	 hidden: item.hidden,
	 orderChange: false,
       });
     },
     deleteItem: function(item) {
       this.$store.dispatch('deleteItem',{
       id: item.id
});
     },
     showAll: function() {
       this.show = 'all';
     },
     showActive: function() {
       this.show = 'active';
     },
     showHidden: function() {
       this.show = 'hidden';
     },
     deleteHidden: function() {
       this.items.forEach(item => {
	 if (item.hidden)
	   this.deleteItem(item)
       });
     },
     dragItem: function(item) {
       this.drag = item;
     },
     dropItem: function(item) {
	 this.$store.dispatch('updateItem',{
	 id: this.drag.id,
	 person: this.drag.person,
	 weight: this.drag.weight,
	 bench: this.drag.bench,
	 deadlift: this.drag.deadlift,
	 squat: this.drag.squat,
	 hidden: this.drag.hidden,
	 orderChange: true,
	 orderTarget: item.id
       });
     },
   }
 }
</script>

<style scoped>
.todo {
    padding: 20px;
    text-align: center;
    display: block;
    background-color: lightblue;
}

 li {
     min-height: 30px;
     padding: 10px;
     margin-bottom: 10px;
     font-size: 1em;
     display: block;
     align-items: center;
 }

.footer {
}

 .delete {
     margin-left: auto;
 }

 /*td:hover .delete {
     display: block;
 }*/

 label {
     width: 400px;
 }

 .hidden {
     margin-left: auto;
 }


table {
    margin-left: auto;
    margin-right: auto;
    float: center;
    font-size: xx-large;
    border: 1px solid black;
    margin-bottom: 20px;
}

td {
    padding: 10px;
    border: 1px solid black;
}

th {
    padding: 10px;
    border: 1px solid black;
}

 /* Form */

 input[type=checkbox] {
     transform: scale(1.5);
     margin-right: 10px;
 }

 input[type=text] {
     font-size: 1em;
 }

 button {
     font-family: 'Arvo';
     font-size: 1em;
 }
 .controls {
     margin-top: 20px;
 }

a {
    text-decoration: none;
    color: black;
    padding: 20px
}

input {
    text-align: center;
}
</style>
