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
		:rules="nameRules"
        required
      ></v-text-field>

      <v-text-field
        v-model="email"
        :rules="emailRules"
        label="E-mail"
        required
      ></v-text-field>
	  
	  <v-text-field
        v-model="password"
		id="passwordFld"
		:append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
        :rules="passwordRules"
		:type="show1 ? 'text' : 'password'"
		@click:append="show1 = !show1"
        label="Password"
        required
      ></v-text-field>
	  
	  <v-text-field
        v-model="repeatPassword"
		:append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
        :rules="passwordRepeatRules"
		:type="show2 ? 'text' : 'password'"
		@click:append="show2 = !show2"
        label="Confirm password"
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
	  repeatPassword: '',
	  successText: '',
      lazy: true,
	  show1: false,
	  show2: false,
      valid: true,
      username: '',
      nameRules: [
        v => !!v || 'Username is required',
        v => (v && v.length <= 9) || 'Username must be less than 9 characters',
      ],
      email: '',
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
      ],
	  passwordRules: [
		v => (v && v.length >= 9) || 'Password must be at least 9 characters',
	  ],
	  passwordRepeatRules: [
		v => (v == document.getElementById('passwordFld').value) || 'Password must match',
	  ]
    }),

    methods: {
      validate () {
        if (this.$refs.form.validate()) {
          this.snackbar = true
		  var payload = {username: this.username, email: this.email, password: this.password, passwordConfirm: this.repeatPassword};
          // send post request
		  
          this.axios.post("http://localhost:8081/users", payload).then(() => {this.successText = "Success!"; this.showSuccess = true; setTimeout(()=>{this.showSuccess=false; window.location.href = "/"},3000)}).catch((error) => {this.failText = error.response.data; this.showFail = true; setTimeout(()=>{this.showFail=false},3000)});
		}
	  },
      reset () {
        this.$refs.form.reset()
      },
    },
  }
</script>