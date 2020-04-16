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
        disabled
      ></v-text-field>

      <v-text-field
        v-model="email"
        :rules="emailRules"
        label="E-mail"
        required
      ></v-text-field>
	  
	  <v-text-field
        v-model="password"
		:append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
		:type="show1 ? 'text' : 'password'"
		@click:append="show1 = !show1"
        label="Old password"
        required
      ></v-text-field>
	  
	  <v-text-field
        v-model="newPassword"
		:append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
        id="newPassword"
		:type="show2 ? 'text' : 'password'"
		@click:append="show2 = !show2"
        label="New password"
        required
      ></v-text-field>

      <v-text-field
        v-model="newPasswordConfirm"
		:append-icon="show3 ? 'mdi-eye' : 'mdi-eye-off'"
        :rules="passwordRepeatRules"
		:type="show3 ? 'text' : 'password'"
		@click:append="show3 = !show3"
        label="New password confirm"
        required
      ></v-text-field>

      <v-btn
        :disabled="!valid || newPassword == '' || password == '' || newPasswordConfirm == ''"
        color="success"
        class="mr-4"
        @click="validate"
      >
        Submit
      </v-btn>
    </v-form>
</template>
<script>
  export default {
    data: () => ({
      showSuccess: false,
      showFail: false,
      show3: false,
	  successText: '',
	  failText: '',
	  password: '',
      newPassword: '',
      newPasswordConfirm: '',
      lazy: true,
	  show1: false,
	  show2: false,
      valid: true,
      username: window.location.href.substring(window.location.href.lastIndexOf('/')+1,window.location.href.length),
      email: '',
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
      ],
	  passwordRules: [
		v => (v && v.length >= 9) || 'Password must be at least 9 characters',
	  ],
	  passwordRepeatRules: [
		v => (v == document.getElementById('newPassword').value) || 'Password must match',
	  ]
    }),
    created: function(){
      if (!!$cookies.get('JWTs')) {
        if (this.username != $cookies.get('JWTs').sub){
          this.failText = "Can only edit your own profile!"; this.showFail = true; setTimeout(()=>{this.showFail=false; window.location.href='/';},3000);
          return;
        }
      }else{
         this.failText = "Not logged in!"; this.showFail = true; setTimeout(()=>{this.showFail=false; window.location.href='/';},3000);
         return;
      }
        

        this.axios.get(this.globalBackEndPath+"/user/"+this.username).then((data)=>{this.username = data.data.username; this.email = data.data.email})
        .catch((error) => {this.failText = error.response.data; this.showFail = true; setTimeout(()=>{this.showFail=false},3000)});;
    },
    methods: {
      validate () {
        if (this.$refs.form.validate()) {
          this.snackbar = true
		  var payload = {username: this.username, email: this.email, password: this.newPassword, passwordConfirm: this.password};
          // send post request
		  
          this.axios.put(this.globalBackEndPath+"/user/"+this.username, payload).then(() => {this.successText = "Success!"; this.showSuccess = true; setTimeout(()=>{this.showSuccess=false; window.location.href = "/"},3000)}).catch((error) => {this.failText = error.response.data; this.showFail = true; setTimeout(()=>{this.showFail=false},3000)});
		}
	  },
      reset () {
        this.$refs.form.reset()
      },
    },
  }
</script>