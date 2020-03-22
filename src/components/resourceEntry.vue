<template>
	<v-container fluid>
	<v-container fluid class="col-12">
    <v-form
      ref="form"
      v-model="valid"
      :lazy-validation="lazy"
    >
	<v-btn
        color="indigo"
        fab
        small
		class="float-right"
        @click="isEditing = !isEditing"
		v-if="canEditEntry() && id != 'new'"
      >
        <v-icon v-if="isEditing">mdi-close</v-icon>
        <v-icon v-else>mdi-pencil</v-icon>
    </v-btn>
	<v-btn
        color="indigo"
        fab
        small
		class="float-right"
        @click.stop="dialog = true"
		style="margin-right:5px;"
		v-if="canEditEntry() && id != 'new' && !isEditing"
      >
        <v-icon>mdi-delete</v-icon>
    </v-btn>
	<v-dialog
      v-model="dialog"
      max-width="450"
    >
      <v-card>
        <v-card-title class="headline">Permanently delete resource entry?</v-card-title>

        <v-card-text>
          WARNING: entry and all the files, tasks associated with it will be permanently deleted!
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            color="darken-1"
            text
            @click="dialog = false"
          >
            Disagree
          </v-btn>

          <v-btn
            color="red darken-1"
            text
            @click="deleteEntry(); dialog = false"
          >
            Agree
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
	<v-dialog
      v-model="dialogDelPreviewImage"
      max-width="450"
    >
      <v-card>
        <v-card-title class="headline">Permanently delete selected preview image?</v-card-title>

        <v-card-text>
          WARNING: image will be permanently deleted!
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            color="darken-1"
            text
            @click="dialogDelPreviewImage = false"
          >
            Disagree
          </v-btn>

          <v-btn
            color="red darken-1"
            text
            @click="deletePreviewImage(); dialogDelPreviewImage = false"
          >
            Agree
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
	<v-dialog
      v-model="dialogDelFile"
      max-width="450"
    >
      <v-card>
        <v-card-title class="headline">Permanently delete selected file?</v-card-title>

        <v-card-text>
          WARNING: file will be permanently deleted!
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            color="darken-1"
            text
            @click="dialogDelFile = false"
          >
            Disagree
          </v-btn>

          <v-btn
            color="red darken-1"
            text
            @click="deleteFile(); dialogDelFile = false"
          >
            Agree
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
	  <v-alert type="success" v-if="showSuccess" dismissible transition="fade-transition">
		  {{ successText }}
	  </v-alert>
	  <v-alert type="error" v-if="showFail" dismissible transition="fade-transition">
		  {{ failText }}
	  </v-alert>
	 <v-container fluid class="float-left col-6">
      <v-text-field
        v-model="title"
        label="Title"
        required
		:disabled="!isEditing"
		:rules="titleRules"
      ></v-text-field>
	  
	  <v-text-field
		:disabled="!isEditing"
        v-model="description"
        label="Description"
      ></v-text-field>
	  
	  <v-text-field
        v-model="tags"
        label="Tags (separated by ';')"
		:disabled="!isEditing"
      ></v-text-field>
	  
	  <v-select
        v-model="category"
        :items="cats"
        label="Category"
		:disabled="!isEditing"
      >
      </v-select>
	  
	  <v-text-field
        v-model="author"
        label="Author"
        readonly
		:disabled="!isEditing"
      ></v-text-field>
	  
	  <v-autocomplete
        :items="allUsers"
        :filter="usersFilter"
        item-text="name"
        label="Readers"
		v-model="readers"
		v-if="isPrivate"
		multiple
		:disabled="!isEditing"
      ></v-autocomplete>
	  
	  <v-autocomplete
        :items="allUsers"
        :filter="usersFilter"
        item-text="name"
        label="Editors"
		v-model="editors"
		multiple
		:disabled="!isEditing"
      ></v-autocomplete>
	  
	  
	  <v-checkbox v-model="isPrivate" label="Private resource" :disabled="!isEditing"></v-checkbox>

	  <v-file-input
		label="Upload preview images (recommended height is 680px)"
		prepend-icon="mdi-camera"
		v-if="isEditing && id!='new'"
		v-model="previewImageFiles"
		multiple
		accept="image/*"
	></v-file-input>
	<v-file-input
		label="Upload 3D models and other files"
		prepend-icon="mdi-paperclip"
		v-if="isEditing && id!='new'"
		v-model="uploadedFiles"
		multiple
	></v-file-input>

      <v-btn
        :disabled="!valid"
        color="success"
        class="mr-4"
        @click="validate"
		v-if="isEditing"
      >
        {{id == "new" ? "Create" : "Update"}}
      </v-btn>
	  <v-data-table
			:headers="uploadedFilesHeaders"
			:items="uploadedPrevFiles"
			:items-per-page="5"
			class="elevation-1"
		>
			<template v-slot:item="row">
				<tr>
					<td><a :href="path+'/resourceEntries/'+id+'/files/'+row.item.id" target="_blank">{{row.item.name}}</a></td>
					<td>{{row.item.size}}</td>
					<td v-if="isEditing">
						
							<v-icon @click="dialogDelFile = true; fileToDel = row.item.id">mdi-delete</v-icon>
						
					</td>
				</tr>
			</template>
			</v-data-table>
	  </v-container>
	  <v-container fluid class="float-right col-6">
	  <v-carousel
			hide-delimiter-background
			show-arrows-on-hover
			height="680px"
			lazy
		  >
			<v-carousel-item
			  v-for="(previewImage, i) in previewImages"
			  :key="i"
			  :src="path+'/resourceEntries/'+id+'/previewImages/'+previewImage.id"
			  :cover="true"
			  lazy-src="../../src/images/loadingImage.gif"
			>
			  
			</v-carousel-item>
		  </v-carousel>
		  <v-data-table
			:headers="previewImageHeaders"
			:items="uploadedPreviewImageFiles"
			:items-per-page="5"
			class="elevation-1"
			v-if="isEditing"
		>
			<template v-slot:item="row">
				<tr>
					<td>{{row.item.name}}</td>
					<td>{{row.item.size}}</td>
					<td>
						
							<v-icon @click="dialogDelPreviewImage = true; imagePrevToDel = row.item.id">mdi-delete</v-icon>
						
					</td>
				</tr>
			</template>
			</v-data-table>
		  </v-container>
	   <v-container fluid class="float-right col-12">
		    <Comment v-for="comment in comments" v-bind:key="comment.id" :replies="comment.replies" :comment="comment" :level="0"/>
	   </v-container>
	  </v-form>	
	  </v-container>
	</v-container>
</template>
<script>
  export default {
    data: () => ({
      showSuccess: false,
	  showFail: false,
	  successText: '',
	  failText: '',
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
	  path: '',
	  dialog: false,
	  dialogDelPreviewImage: false,
	  dialogDelFile: false,
	  imagePrevToDel: '',
	  fileToDel: '',
	  previewImageFiles: [],
	  previewImages: [],
	  uploadedPrevFiles: [],
	  uploadedFilesHeaders: [
          {
            text: 'File',
            align: 'start',
            sortable: false,
            value: 'name',
          },
          { text: 'Size in bytes', value: 'size' },
	  ],
	  uploadedFiles: [],
	  isEditing: window.location.href.substring(window.location.href.lastIndexOf('/')+1,window.location.href.length) == 'new',
	  cats: ['Architecture', 'Science', 'People', 'Misc'],
	  id: window.location.href.substring(window.location.href.lastIndexOf('/')+1,window.location.href.length),
	  titleRules: [
		 v => !!v || 'Title is required',
	  ],
	  previewImageHeaders: [
          {
            text: 'File',
            align: 'start',
            sortable: false,
            value: 'name',
          },
          { text: 'Size in bytes', value: 'size' },
		],
		uploadedPreviewImageFiles: [
		],
		comments: [],
	}),
	beforeCreate: function () {
		this.$options.components.Comment = require('./comment.vue').default
	},
	created: function(){
		this.path = this.globalBackEndPath;
		if (!parseInt(this.id)){
			this.id = "new";
		}
		this.axios.get(this.globalBackEndPath+"/users").then((data)=>{for(var i = 0; i < data.data.length;i++){this.allUsers.push(data.data[i].username)}});
		if (this.id != 'new'){
			this.axios.get(this.globalBackEndPath+"/resourceEntries/"+this.id).then((data)=>{
				this.title = data.data.title; this.description = data.data.description; this.isPrivate = data.data.private; this.tags = data.data.tags.join(';'); this.category = data.data.category; this.author = data.data.author[0].username; for(var i = 0; i < data.data.readers.length; i++){this.readers.push(data.data.readers[i].username)} for(var i = 0; i < data.data.editors.length; i++){this.editors.push(data.data.editors[i].username)} for(var i=0;i<data.data.images.length;i++){this.previewImages.push(data.data.images[i])}
				for (var i = 0;i < data.data.images.length; i++){
					this.uploadedPreviewImageFiles.push({name: data.data.images[i].fileName, size: data.data.images[i].size, id: data.data.images[i].id})
				}
				for (var i = 0;i < data.data.files.length; i++){
					this.uploadedPrevFiles.push({name: data.data.files[i].fileName, size: data.data.files[i].size, id: data.data.files[i].id})
				}
				for (var i = 0;i < data.data.comments.length; i++){
					this.comments.push(data.data.comments[i])
				}
				
			}).catch((error) => {this.failText = error.response.data; this.showFail = true; setTimeout(()=>{this.showFail=false},3000)});
		}else{
			this.author = this.getLoggedInData().sub;
		}
	},
    methods: {
      validate () {
        if (this.$refs.form.validate()) {
          this.snackbar = true;
		  var entry = {title: this.title, description: this.description, private: this.isPrivate, tags: this.tags.split(';').map(s => s.trim()), category: this.category};
		  var payload = {entry: entry, readers: this.readers, editors: this.editors};
		  if (this.id != 'new'){
			this.axios.put(
				this.globalBackEndPath+"/resourceEntries/"+this.id,
				payload
			  ).then(() => {
				  this.successText = "Successfuly updated entry!" + (this.previewImageFiles.length == 0 ? '' : ' Will upload images!') + (this.previewImageFiles.length == 0 ? '' : ' Will upload images!');
				  this.showSuccess = true;
				  if (this.previewImageFiles.length == 0 && this.uploadedFiles.length == 0){
					  setTimeout(()=>{this.showSuccess=false;window.location.href="/resources"},3000);
				  }else{
					setTimeout(()=>{this.showSuccess=false;},3000);
					let formData = new FormData();
					for( var i = 0; i < this.previewImageFiles.length; i++ ){
						let file = this.previewImageFiles[i];
						//TODO
						//validate size
						if (file.type.indexOf('image')!=-1)
							formData.append('file', file);
					}
					var imageUrl =this.globalBackEndPath+"/resourceEntries/"+this.id+"/previewImages";
					if (this.previewImageFiles.length != 0){
						this.axios.post(imageUrl, 
						formData,
						{
							headers: {
								'Content-Type': 'multipart/form-data'
							}
						}).then(() => {this.successText = "Updated preview images!";this.showSuccess = true;setTimeout(()=>{this.showSuccess=false;},3000);if (this.uploadedFiles.length == 0){window.location.href="/resources"}}).catch((error)=>{this.failText = error.response.data; this.showFail = true; setTimeout(()=>{this.showFail=false},3000)})
					}
					let formData2 = new FormData();
					for( var i = 0; i < this.uploadedFiles.length; i++ ){
						let file = this.uploadedFiles[i];
						//TODO
						//validate size
						formData2.append('file', file);
					}
					var fileUrl =this.globalBackEndPath+"/resourceEntries/"+this.id+"/files";
					if (this.uploadedFiles.length != 0){
						this.axios.post(fileUrl, 
						formData2,
						{
							headers: {
								'Content-Type': 'multipart/form-data'
							}
						
						}).then(() => {this.successText = "Updated uploaded files!";this.showSuccess = true;setTimeout(()=>{this.showSuccess=false;},3000);window.location.href="/resources"}).catch((error)=>{this.failText = error.response.data; this.showFail = true; setTimeout(()=>{this.showFail=false},3000)})
					}
				  }
				}).catch((error) => {this.failText = error.response.data; this.showFail = true; setTimeout(()=>{this.showFail=false},3000)});
				  
		  }else{
			this.axios.post(
				this.globalBackEndPath+"/resourceEntries",
				entry
			  ).then(() => {this.successText = "Success!"; this.showSuccess = true; setTimeout(()=>{this.showSuccess=false;window.location.href="/resources"},3000)}).catch((error) => {this.failText = error.response.data; this.showFail = true; setTimeout(()=>{this.showFail=false},3000)});
		  }
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
	  canEditEntry(){
		return this.getLoggedInData().Role.indexOf('Admin') > -1 || this.author == this.getLoggedInData().sub || this.editors.indexOf(this.getLoggedInData().sub) > -1;
	  },
	  deleteEntry (){
		  this.axios.delete(this.globalBackEndPath+"/resourceEntries/"+this.id).then(()=>{this.successText = "Success!"; this.showSuccess = true; setTimeout(()=>{this.showSuccess=false;window.location.href="/resources"},3000)}).catch((error)=>{this.failText = error.response.data; this.showFail = true; setTimeout(()=>{this.showFail=false},3000)});
	  },
	  deletePreviewImage (){
		  this.axios.delete(this.globalBackEndPath+"/resourceEntries/"+this.id+"/previewImages/"+this.imagePrevToDel).then(()=>{
			  this.successText = "Success!";
			  this.showSuccess = true;
			  setTimeout(()=>{this.showSuccess=false;},3000);
			  var ind1 = -1;
			  var ind2 = -1;
			  for(var i = 0; i < this.previewImages.length; i++){
				  if (this.previewImages[i].id == this.imagePrevToDel){
					ind1 = i;
					break;
				  }
			  } 
			  this.previewImages.splice(ind1, 1);
			  for(var i = 0; i < this.uploadedPreviewImageFiles.length; i++){
				  if (this.uploadedPreviewImageFiles[i].id == this.imagePrevToDel){
					ind2 = i;
					break;
				  }
				  
			  } 
			  this.uploadedPreviewImageFiles.splice(ind2, 1);
		   }).catch((error)=>{this.failText = error.response.data; this.showFail = true; setTimeout(()=>{this.showFail=false},3000)});
	  },
	  deleteFile (){
		  this.axios.delete(this.globalBackEndPath+"/resourceEntries/"+this.id+"/files/"+this.fileToDel).then(()=>{
			  this.successText = "Success!";
			  this.showSuccess = true;
			  setTimeout(()=>{this.showSuccess=false;},3000);
			  var ind1 = -1;
			  for(var i = 0; i < this.uploadedPrevFiles.length; i++){
				  if (this.uploadedPrevFiles[i].id == this.fileToDel){
					ind1 = i;
					break;
				  }
			  } 
			  this.uploadedPrevFiles.splice(ind1, 1);
		   }).catch((error)=>{this.failText = error.response.data; this.showFail = true; setTimeout(()=>{this.showFail=false},3000)});
	  },
    },
  }
</script>