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
        v-model="username"
        label="Username"
        required
      ></v-text-field>

	  <v-text-field
        v-model="password"
		id="passwordFld"
		:append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
		:type="show1 ? 'text' : 'password'"
		@click:append="show1 = !show1"
        label="Password"
        required
      ></v-text-field>

      <v-btn
        :disabled="!valid"
        color="success"
        class="mr-4"
        @click="validate"
      >
        Submit
      </v-btn>

      <v-btn
        color="error"
        class="mr-4"
        @click="reset"
      >
        Reset Form
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
	  password: '',
	  successText: '',
      lazy: true,
	  show1: false,
      valid: true,
      username: '',
      email: '',
    }),

    methods: {
      validate () {
        if (this.$refs.form.validate()) {
          this.snackbar = true
		  var payload = new FormData();
		  payload.set('username', this.username);
		  payload.set('password', this.password);

		  const config = { headers: { 'Content-Type': 'multipart/form-data' } };
		  
          this.axios.post(
			this.globalBackEndPath+"/login",
			payload,
			config
		  ).then((data) => {this.successText = "Success!"; var base64Url = data.data.split('.')[1];
			var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
			var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
				return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      $cookies.set('JWTs', jsonPayload);
       ;this.showSuccess = true; setTimeout(()=>{this.showSuccess=false; window.location.href = "/";},3000)}).catch((error) => {this.failText = error.response.data; this.showFail = true; setTimeout(()=>{this.showFail=false},3000)});
		}
	  },
      reset () {
        this.$refs.form.reset()
      },
    },
  }
</script>