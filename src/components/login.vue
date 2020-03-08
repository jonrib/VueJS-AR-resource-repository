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
		  ).then(() => {this.successText = "Success!"; this.showSuccess = true; setTimeout(()=>{this.showSuccess=false; window.location.href = "/";},3000)}).catch((error) => {this.failText = error.response.data; this.showFail = true; setTimeout(()=>{this.showFail=false},3000)});
		}
	  },
      reset () {
        this.$refs.form.reset()
      },
    },
  }
</script>