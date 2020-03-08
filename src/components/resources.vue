<template>
  <v-content v-if="!showAll">
      <v-container
        class="fill-height"
        fluid
      >
        <v-row
          align="center"
          justify="center"
        >
          <v-col class="text-center">
            <router-view></router-view>
          </v-col>
        </v-row>
      </v-container>
    </v-content>

  <v-container
	v-else
    class="fill-height"
    fluid
    style="min-height: 434px; max-width: 100%;"
  >

      <v-row>
        <v-col cols="2" v-for="values in displayed">
          <v-card>
            <v-img
              :src="values.images.length != 0 ? path+'/resourceEntries/'+values.id+'/previewImages/'+values.images[0].id : '/src/images/question.png'"
              height="250"
              class="grey darken-4"
            ></v-img>
            <v-card-title @click="showAll=false;showID=values.id" class="title"><v-btn text link :to="'/resourceEntry/'+values.id">{{values.title}}</v-btn></v-card-title>
			<v-card-actions>
			  <v-spacer></v-spacer>

			  <v-btn
				icon
				@click="showDesc[values.id] = !showDesc[values.id]"
			  >
				<v-icon>{{ showDesc[values.id] ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
			  </v-btn>
			</v-card-actions>
			<v-expand-transition>
			  <div v-show="showDesc[values.id]">
				<v-divider></v-divider>

				<v-card-text>
				  {{values.description}}
				</v-card-text>
			  </div>
			</v-expand-transition>
          </v-card>
        </v-col>
      </v-row>
	  
		<v-pagination
		  v-model="page"
		  :length="numberOfPages"
		></v-pagination>
	  
  </v-container>
</template>
<script>
  export default {
    data: () => ({
	  page: 1,
	  perPage: 18,
	  numberOfPages: 0,
	  all: [],
      show: true,
	  showDesc: {},
	  showAll: true,
	  showID: false,
	  path: '',
    }),
	created: function(){
		this.path = this.globalBackEndPath;
		this.axios.get(this.globalBackEndPath+"/resourceEntries").then((data)=> {this.all = data.data;for (var i = 0; i < this.all.length; i++){this.$set(this.showDesc, this.all[i].id, false);}}).catch((error)=>{console.error(error)});
		this.numberOfPages = Math.ceil(this.all.length / this.perPage);
		this.all;
	},
	methods:{
		paginate (all) {
			let page = this.page;
			let perPage = this.perPage;
			let from = (page * perPage) - perPage;
			let to = (page * perPage);
			return  all.slice(from, to);
		},
		
	},
	computed: {
		displayed() {
			return this.paginate(this.all);
		}
	},
  }
</script>