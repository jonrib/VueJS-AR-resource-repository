<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      app
    >
      <v-list dense>
        <v-list-item link to="/welcome">
          <v-list-item-action>
            <v-icon>mdi-home-outline</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Welcome</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link to="/resources">
          <v-list-item-action>
            <v-icon>mdi-cube-outline</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Resources</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
    <v-list-item link :to="'/users/'+userName" v-if="loggedin === true">
          <v-list-item-action>
            <v-icon>mdi-account-multiple-outline</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>User</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
		<v-list-item link to="/login" v-if="loggedin === false">
          <v-list-item-action>
            <v-icon>mdi-account-key-outline</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Sign in</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
		<v-list-item link v-if="loggedin === true" v-on:click="logout()">
          <v-list-item-action>
            <v-icon>mdi-account-remove-outline</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Sign out</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
		<v-list-item link to="/registration" v-if="loggedin === false">
          <v-list-item-action>
            <v-icon>mdi-account-plus-outline</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Register</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      app
      color="indigo"
      dark
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>AR Resource Repository</v-toolbar-title>
    </v-app-bar>

    <v-content>
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
    <v-footer
      color="indigo"
      app
    >
      <span class="white--text">&copy; 2020 Jonas Ribikauskas</span>
    </v-footer>
  </v-app>
</template>

<script>
  export default {
    props: {
      source: String,
    },
    data: () => ({
      drawer: null,
    loggedin: false,
    roles: [],
    userName: '',
    }),
	methods: {
	  logout(){
    $cookies.set('JWTs', '');
    this.axios.delete(this.globalBackEndPath+"/deleteJWT").then(()=>{window.location.href="/";}).catch((error)=>{console.error(error.data);});
	  }
	},
	created: function() {
		if (!!$cookies.get('JWTs')) {
			var roles = [];
			var token = $cookies.get('JWTs');
			//var base64Url = token.split('.')[1];
			//var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
			//var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
			//	return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
			//}).join(''));
			this.roles = token.Role;
      this.loggedin = (token.sub != '');
      this.userName = token.sub;
		}else{
			this.loggedin = false;
		}
	  }
  }

</script>