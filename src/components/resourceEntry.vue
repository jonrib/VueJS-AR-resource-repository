<template>
	
    <v-form
      ref="form"
      v-model="valid"
      :lazy-validation="lazy"
	  class="col-6"
    >
	  <v-alert type="success" v-if="showSuccess" dismissible transition="fade-transition">
		  {{ successText }}
	  </v-alert>
	  <v-alert type="error" v-if="showFail" dismissible transition="fade-transition">
		  {{ failText }}
	  </v-alert>
      <v-text-field
        v-model="title"
        label="Title"
        required
		:rules="titleRules"
      ></v-text-field>
	  
	  <v-text-field
        v-model="description"
        label="Description"
      ></v-text-field>
	  
	  <v-text-field
        v-model="tags"
        label="Tags (separated by ';')"
      ></v-text-field>
	  
	  <v-select
        v-model="category"
        :items="cats"
        label="Category"
      >
      </v-select>
	  
	  <v-text-field
        v-model="author"
        label="Author"
        readonly
      ></v-text-field>
	  
	  <v-autocomplete
        :items="allUsers"
        :filter="usersFilter"
        item-text="name"
        label="Readers"
		v-model="readers"
		v-if="isPrivate"
		multiple
      ></v-autocomplete>
	  
	  <v-autocomplete
        :items="allUsers"
        :filter="usersFilter"
        item-text="name"
        label="Editors"
		v-model="editors"
		multiple
      ></v-autocomplete>
	  
	  
	  <v-checkbox v-model="isPrivate" label="Private resource"></v-checkbox>

      <v-btn
        :disabled="!valid"
        color="success"
        class="mr-4"
        @click="validate"
      >
        Update
      </v-btn>
    </v-form>
</template>
<script>
  export default {
    data: () => ({
      showSuccess: false,
	  showFail: false,
	  successText: '',
	  failText: '',
	  successText: '',
      lazy: true,
      valid: true,
	  title: '',
	  description: '',
	  isPrivate: false,
	  tags: '',
	  category: '',
	  author: '',
	  allUsers: [],
	  readers: [],
	  editors: [],
	  cats: ['Architecture', 'Science', 'People', 'Misc'],
	  id: window.location.href.substring(window.location.href.lastIndexOf('/')+1,window.location.href.length),
	  titleRules: [
		 v => !!v || 'Title is required',
	  ],
    }),
	created: function(){
		if (!parseInt(this.id)){
			this.id = "new";
		}
		this.axios.get(this.globalBackEndPath+"/users").then((data)=>{for(var i = 0; i < data.data.length;i++){this.allUsers.push(data.data[i].username)}});
		this.axios.get(this.globalBackEndPath+"/resourceEntries/"+this.id).then((data)=>{this.title = data.data.title; this.description = data.data.description; this.isPrivate = data.data.private; this.tags = data.data.tags.join(';'); this.category = data.data.category; this.author = data.data.author[0].username; for(var i = 0; i < data.data.readers.length; i++){this.readers.push(data.data.readers[i].username)} for(var i = 0; i < data.data.editors.length; i++){this.editors.push(data.data.editors[i].username)}})
		console.log();
	},
    methods: {
      validate () {
        if (this.$refs.form.validate()) {
          this.snackbar = true;
		  var entry = {title: this.title, description: this.description, private: this.isPrivate, tags: this.tags.split(';').map(s => s.trim()), category: this.category};
		  var payload = {entry: entry, readers: this.readers, editors: this.editors};
		  
          this.axios.put(
			this.globalBackEndPath+"/resourceEntries/"+this.id,
			payload
		  ).then(() => {this.successText = "Success!"; this.showSuccess = true; setTimeout(()=>{this.showSuccess=false;},3000)}).catch((error) => {this.failText = error.response.data; this.showFail = true; setTimeout(()=>{this.showFail=false},3000)});
		}
	  },
	  usersFilter (item, queryText, itemText) {		
        const textOne = itemText.toLowerCase();
        const searchText = queryText.toLowerCase();
        return textOne.indexOf(searchText) > -1;
      },
      reset () {
        this.$refs.form.reset()
      },
    },
  }
</script>