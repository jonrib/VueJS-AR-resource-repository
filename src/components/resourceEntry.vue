<template>
	
    <v-form
      ref="form"
      v-model="valid"
      :lazy-validation="lazy"
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
      ></v-text-field>

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
	  id: window.location.href.substring(window.location.href.lastIndexOf('/')+1,window.location.href.length),
    }),
	created: function(){
		if (!parseInt(this.id)){
			this.id = "new";
		}
	},
    methods: {
      validate () {
        if (this.$refs.form.validate()) {
          this.snackbar = true;
		  
          //this.axios.post(
			//"http://localhost:8081/login",
			//payload,
			//config
		  //).then(() => {this.successText = "Success!"; this.showSuccess = true; setTimeout(()=>{this.showSuccess=false; window.location.href = "/";},3000)}).catch((error) => {this.failText = error.response.data; this.showFail = true; setTimeout(()=>{this.showFail=false},3000)});
		}
	  },
      reset () {
        this.$refs.form.reset()
      },
    },
  }
</script>